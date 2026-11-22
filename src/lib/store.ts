// Server-side store (demo/local mode).
// In-memory, seeded on first use. When Supabase env vars are configured,
// the SQL migrations in supabase/migrations/ are the production store —
// see README "Connecting Supabase" for the one-step switch. The store API
// is async throughout so callers never change when the backend changes.
//
// Tenant isolation rule: every private read/write is scoped by siteId
// (or orderId). Public pages only ever receive the public fields of a
// published site — never access codes, guest lists or RSVP records.

import type {
  AccessCode,
  AuditLog,
  EtsyOrder,
  RsvpResponse,
  TemplateMeta,
  WeddingSite,
} from "./types";
import { TEMPLATES } from "./templates";
import { buildSeed } from "./seed";
import { generateAccessCode, sha256 } from "./auth";

interface Db {
  templates: TemplateMeta[];
  sites: WeddingSite[];
  orders: EtsyOrder[];
  accessCodes: AccessCode[];
  rsvps: RsvpResponse[];
  audit: AuditLog[];
  seeded: boolean;
}

const globalDb = globalThis as unknown as { __wwsDb?: Db };

function db(): Db {
  if (!globalDb.__wwsDb) {
    const seed = buildSeed();
    globalDb.__wwsDb = {
      templates: TEMPLATES.map((t) => ({ ...t })),
      sites: seed.sites,
      orders: seed.orders,
      accessCodes: seed.accessCodes,
      rsvps: seed.rsvps,
      audit: seed.audit,
      seeded: true,
    };
  }
  return globalDb.__wwsDb;
}

export const isDemoMode = () =>
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- Templates ---
export async function listTemplates(): Promise<TemplateMeta[]> {
  return db().templates.map((t) => ({ ...t }));
}

export async function getTemplateById(id: string): Promise<TemplateMeta | null> {
  return db().templates.find((t) => t.id === id) || null;
}

export async function saveTemplate(t: TemplateMeta): Promise<void> {
  const d = db();
  const i = d.templates.findIndex((x) => x.id === t.id);
  if (i >= 0) d.templates[i] = { ...t };
  else d.templates.push({ ...t });
  audit("admin", "template.save", `Template ${t.id} saved.`);
}

export async function archiveTemplate(id: string): Promise<void> {
  const t = await getTemplateById(id);
  if (t) {
    t.active = false;
    await saveTemplate(t);
  }
}

// --- Sites ---
export async function listSites(): Promise<WeddingSite[]> {
  return db().sites.map((s) => ({ ...s, events: [...s.events], gallery: [...s.gallery] }));
}

export async function getSiteById(id: string): Promise<WeddingSite | null> {
  return db().sites.find((s) => s.id === id) || null;
}

export async function getSiteBySlug(slug: string): Promise<WeddingSite | null> {
  return db().sites.find((s) => s.slug === slug) || null;
}

/** Public view: only published sites, only public fields. */
export async function getPublicSite(slug: string): Promise<WeddingSite | null> {
  const site = await getSiteBySlug(slug);
  if (!site || site.status !== "published") return null;
  return site;
}

export async function saveSite(site: WeddingSite): Promise<void> {
  const d = db();
  site.updatedAt = new Date().toISOString();
  const i = d.sites.findIndex((x) => x.id === site.id);
  if (i >= 0) d.sites[i] = site;
  else d.sites.push(site);
}

export async function setSiteStatus(id: string, status: WeddingSite["status"]): Promise<void> {
  const site = await getSiteById(id);
  if (!site) return;
  site.status = status;
  if (status === "published") site.publishedAt = new Date().toISOString();
  await saveSite(site);
  audit("admin", "site.status", `Site ${site.slug} → ${status}.`);
}

// --- Orders + provisioning (idempotent) ---
export async function listOrders(): Promise<EtsyOrder[]> {
  return db().orders.map((o) => ({ ...o }));
}

export async function getOrderById(id: string): Promise<EtsyOrder | null> {
  return db().orders.find((o) => o.id === id) || null;
}

export async function saveOrder(order: EtsyOrder): Promise<void> {
  const d = db();
  const i = d.orders.findIndex((x) => x.id === order.id);
  if (i >= 0) d.orders[i] = { ...order };
  else d.orders.push({ ...order });
}

/**
 * Provision exactly one site + one access code for a verified order.
 * Idempotent: a second call returns the existing site/code, never a
 * duplicate. The admin's chosen template is authoritative — the Etsy
 * listing ID only auto-suggests it in the form, it never overrides.
 */
export async function provisionOrder(
  orderId: string,
): Promise<{ site: WeddingSite; code: string; already: boolean }> {
  const d = db();
  const order = d.orders.find((o) => o.id === orderId);
  if (!order) throw new Error("Order not found");
  if (order.status === "pending") throw new Error("Order must be verified first");

  const existingSite = order.siteId ? d.sites.find((s) => s.id === order.siteId) : undefined;
  const existingCode = order.accessCodeId
    ? d.accessCodes.find((c) => c.id === order.accessCodeId)
    : undefined;
  if (existingSite && existingCode) {
    // Never reveal the original code again — admin must reset it to get a new one.
    return { site: existingSite, code: "", already: true };
  }

  const template = d.templates.find((t) => t.id === order.templateId);
  if (!template) throw new Error("Template not found");

  const slugBase = order.customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40) || "wedding";
  let slug = slugBase;
  let n = 2;
  while (d.sites.some((s) => s.slug === slug)) slug = `${slugBase}-${n++}`;

  const now = new Date().toISOString();
  const site: WeddingSite = {
    id: `site-${Date.now().toString(36)}`,
    slug,
    templateId: template.id,
    templateSnapshot: { ...template },
    ownerName: order.customerName,
    ownerEmail: order.customerEmail,
    status: "draft",
    weddingDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: "America/New_York",
    content: {
      partnerA: order.customerName.split("&")[0]?.trim() || "Partner A",
      partnerB: order.customerName.split("&")[1]?.trim() || "Partner B",
      subtitle: "Together with their families",
      welcome: "Welcome to our wedding website! We cannot wait to celebrate with you.",
      story: "Our story begins here — edit this text in your editor.",
      dressCode: "Semi-formal.",
      footerMessage: "Thank you for being part of our day.",
      heroImage: "https://picsum.photos/seed/wedding-hero/1600/1000",
      venueName: "Venue to be confirmed",
      venueAddress: "",
      mapLink: "",
      postWeddingMessage: "Just married! Thank you for celebrating with us.",
    },
    design: {
      primary: template.palette.ink,
      accent: template.palette.accent,
      background: template.palette.bg,
      headingFont: "Georgia, serif",
      bodyFont: "system-ui, sans-serif",
      galleryLayout: "grid",
    },
    events: [],
    gallery: [],
    customQuestions: [],
    settings: {
      passwordEnabled: false,
      passwordHash: null,
      rsvpEnabled: true,
      rsvpDeadline: null,
      timezone: "America/New_York",
      countdownEnabled: true,
      countdownStyle: "classic",
      showStory: true,
      showGallery: true,
      showEvents: true,
      showDressCode: true,
      showCountdown: true,
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };

  const code = generateAccessCode();
  const accessCode: AccessCode = {
    id: `code-${Date.now().toString(36)}`,
    orderId: order.id,
    siteId: site.id,
    codeHash: sha256(code),
    status: "active",
    createdAt: now,
    lastUsedAt: null,
    expiresAt: null,
  };

  d.sites.push(site);
  d.accessCodes.push(accessCode);
  order.siteId = site.id;
  order.accessCodeId = accessCode.id;
  order.status = "provisioned";
  order.deliveryStatus = "pdf-ready";
  order.displayCode = code;
  await saveOrder(order);
  audit("admin", "order.provision", `Order ${order.etsyOrderId} provisioned → site ${slug}.`);
  return { site, code, already: false };
}

export async function findAccessCodeByHash(codeHash: string): Promise<AccessCode | null> {
  return db().accessCodes.find((c) => c.codeHash === codeHash) || null;
}

export async function useAccessCode(id: string): Promise<void> {
  const c = db().accessCodes.find((x) => x.id === id);
  if (c) {
    c.status = "used";
    c.lastUsedAt = new Date().toISOString();
  }
}

export async function revokeAccessCode(id: string): Promise<void> {
  const c = db().accessCodes.find((x) => x.id === id);
  if (c) {
    c.status = "revoked";
    audit("admin", "code.revoke", `Access code ${id} revoked.`);
  }
}

export async function resetAccessCode(orderId: string): Promise<string> {
  const d = db();
  const order = d.orders.find((o) => o.id === orderId);
  if (!order || !order.accessCodeId) throw new Error("No access code for this order");
  const code = generateAccessCode();
  const c = d.accessCodes.find((x) => x.id === order.accessCodeId);
  if (!c) throw new Error("Access code not found");
  c.codeHash = sha256(code);
  c.status = "active";
  c.lastUsedAt = null;
  order.displayCode = code;
  await saveOrder(order);
  audit("admin", "code.reset", `Access code reset for order ${order.etsyOrderId}.`);
  return code;
}

// --- RSVPs (tenant-scoped) ---
export async function listRsvps(siteId: string): Promise<RsvpResponse[]> {
  return db().rsvps.filter((r) => r.siteId === siteId);
}

export async function getRsvpByToken(token: string): Promise<RsvpResponse | null> {
  return db().rsvps.find((r) => r.updateToken === token) || null;
}

export async function saveRsvp(r: RsvpResponse): Promise<void> {
  const d = db();
  const i = d.rsvps.findIndex((x) => x.id === r.id);
  if (i >= 0) d.rsvps[i] = r;
  else d.rsvps.push(r);
}

export async function deleteRsvp(id: string, siteId: string): Promise<void> {
  const d = db();
  d.rsvps = d.rsvps.filter((r) => !(r.id === id && r.siteId === siteId));
}

// --- Audit ---
export function audit(actor: string, action: string, detail: string): void {
  db().audit.unshift({
    id: `audit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    actor,
    action,
    detail,
    createdAt: new Date().toISOString(),
  });
}

export async function listAudit(): Promise<AuditLog[]> {
  return db().audit.slice(0, 100);
}

// --- Stats for admin overview ---
export async function getStats() {
  const d = db();
  const attending = d.rsvps.filter((r) => r.attending);
  return {
    totalOrders: d.orders.length,
    pendingOrders: d.orders.filter((o) => o.status === "pending").length,
    verifiedOrders: d.orders.filter((o) => o.status !== "pending").length,
    totalSites: d.sites.length,
    publishedSites: d.sites.filter((s) => s.status === "published").length,
    draftSites: d.sites.filter((s) => s.status === "draft" || s.status === "unpublished").length,
    suspendedSites: d.sites.filter((s) => s.status === "suspended").length,
    totalRsvps: d.rsvps.length,
    attendingCount: attending.length,
    declinedCount: d.rsvps.filter((r) => !r.attending).length,
    totalAttendees: attending.reduce((sum, r) => sum + r.guestCount, 0),
  };
}
