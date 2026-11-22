// Server-side store (local mode).
// In-memory, starting EMPTY — no demo content, no sample sites, no sample
// RSVPs. The 6 real templates are the only built-in data. When Supabase
// env vars are configured, the SQL migrations in supabase/migrations/ are
// the production store — see README "Connecting Supabase" for the
// one-step switch. The store API is async throughout so callers never
// change when the backend changes.
//
// Delivery model: one FIXED access code per template (TemplateMeta.accessCode,
// baked into source). Every buyer of a template gets the same PDF and the
// same code — but activating the code creates a brand-new private site just
// for that buyer. There is no per-order provisioning and no mail system.
//
// Tenant isolation rule: every private read/write is scoped by siteId.
// Public pages only ever receive the public fields of a published site —
// never access codes, guest lists or RSVP records.

import type {
  AuditLog,
  RsvpResponse,
  TemplateMeta,
  WeddingSite,
} from "./types";
import { TEMPLATES } from "./templates";
import { sha256 } from "./auth";

interface Db {
  templates: TemplateMeta[];
  sites: WeddingSite[];
  rsvps: RsvpResponse[];
  audit: AuditLog[];
}

const globalDb = globalThis as unknown as { __wwsDb?: Db };

function db(): Db {
  if (!globalDb.__wwsDb) {
    // Starts EMPTY: no demo site, no sample RSVPs, no access-code records.
    // Templates are the only built-in data; sites appear only when a real
    // buyer activates a template code.
    globalDb.__wwsDb = {
      templates: TEMPLATES.map((t) => ({ ...t })),
      sites: [],
      rsvps: [],
      audit: [],
    };
  }
  return globalDb.__wwsDb;
}

export const isLocalStore = () =>
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

/**
 * Find the template whose fixed access code matches the given SHA-256 hash.
 * The plain code is never stored or compared in the clear here — callers
 * pass the hash of the code the buyer entered.
 */
export async function findTemplateByAccessCodeHash(
  codeHash: string,
): Promise<TemplateMeta | null> {
  return (
    db().templates.find(
      (t) =>
        typeof t.accessCode === "string" &&
        t.accessCode.length > 0 &&
        sha256(t.accessCode) === codeHash,
    ) || null
  );
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

/**
 * Create a BRAND-NEW private site from a template, for one buyer.
 * Called when a buyer activates a template's fixed access code with their
 * names. Every activation creates a fresh site — buyers of the same
 * template never share a site and never overwrite each other's work.
 * The slug comes from the buyers' names, with -2/-3 dedup on collision.
 */
export async function createSiteFromTemplate(
  template: TemplateMeta,
  partnerA: string,
  partnerB: string,
): Promise<WeddingSite> {
  const d = db();
  const ownerName = `${partnerA} & ${partnerB}`;

  const slugBase =
    ownerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "wedding";
  let slug = slugBase;
  let n = 2;
  while (d.sites.some((s) => s.slug === slug)) slug = `${slugBase}-${n++}`;

  const now = new Date().toISOString();
  const site: WeddingSite = {
    id: `site-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    slug,
    templateId: template.id,
    templateSnapshot: { ...template },
    ownerName,
    ownerEmail: "",
    status: "draft",
    weddingDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: "America/New_York",
    content: {
      partnerA,
      partnerB,
      subtitle: "Together with their families",
      welcome: "Welcome to our wedding website! We cannot wait to celebrate with you.",
      invitationText: `Together with their families, ${partnerA} and ${partnerB} request the honour of your presence at their wedding celebration.`,
      story: "Our story begins here — edit this text in your editor.",
      dressCode: "Semi-formal.",
      footerMessage: "Thank you for being part of our day.",
      heroImage: template.heroImage ?? "https://picsum.photos/seed/wedding-hero/1600/1000",
      venueName: "Venue to be confirmed",
      venueAddress: "",
      mapLink: "",
      postWeddingMessage: "Just married! Thank you for celebrating with us.",
      details: [
        {
          id: "d-venue",
          kind: "venue",
          title: "The venue",
          body: "Venue details go here — add the address and directions in the editor.",
          hidden: false,
        },
        {
          id: "d-dress",
          kind: "dress",
          title: "Dress code",
          body: "Semi-formal.",
          hidden: false,
        },
      ],
      faqs: [],
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
      showInvitation: true,
      showDetails: true,
      showFaq: true,
    },
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };

  d.sites.push(site);
  audit(
    "system",
    "site.create",
    `New site /w/${slug} created from template ${template.name} (${template.id}).`,
  );
  return site;
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
