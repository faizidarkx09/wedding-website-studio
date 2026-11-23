import { NextRequest, NextResponse } from "next/server";
import { getSiteById, listSites, saveSite } from "@/lib/store";
import { verifySession, type SessionPayload } from "@/lib/auth";
import type { WeddingSite } from "@/lib/types";

/** Returns the customer session, the admin session, or nulls for both. */
function sessions(req: NextRequest): { customer: SessionPayload | null; admin: SessionPayload | null } {
  return {
    customer: verifySession(req.cookies.get("wws_customer")?.value),
    admin: verifySession(req.cookies.get("wws_admin")?.value),
  };
}

function isAdmin(s: SessionPayload | null): boolean {
  return !!s && s.role === "admin";
}

/** True when the caller may read/write the given site. */
function canAccess(customer: SessionPayload | null, admin: SessionPayload | null, siteId: string): boolean {
  if (isAdmin(admin)) return true;
  return !!customer && customer.role === "customer" && customer.siteId === siteId;
}

/**
 * GET — return the caller's own site.
 * Customer: their session site. Admin: ?siteId= required.
 */
export async function GET(req: NextRequest) {
  const { customer, admin } = sessions(req);
  const siteId = req.nextUrl.searchParams.get("siteId") ?? customer?.siteId ?? null;
  if (!siteId || !canAccess(customer, admin, siteId)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const site = await getSiteById(siteId);
  if (!site) return NextResponse.json({ ok: false, error: "Site not found" }, { status: 404 });
  return NextResponse.json({ ok: true, site });
}

export async function POST(req: NextRequest) {
  const { customer, admin } = sessions(req);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const site = (body as { site?: unknown })?.site as WeddingSite | undefined;
  if (!site || typeof site !== "object" || typeof site.id !== "string" || !site.id) {
    return NextResponse.json({ ok: false, error: "A valid site object with an id is required" }, { status: 400 });
  }
  if (!canAccess(customer, admin, site.id)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  // --- Validation (field-specific errors; the editor surfaces them) ---
  const bad = (error: string) =>
    NextResponse.json({ ok: false, error }, { status: 400 });
  const isStr = (v: unknown): v is string => typeof v === "string";
  const isNonEmptyStr = (v: unknown): v is string => isStr(v) && v.trim().length > 0;
  const isBool = (v: unknown): v is boolean => typeof v === "boolean";
  const isHex = (v: unknown): v is string => isStr(v) && /^#[0-9a-fA-F]{6}$/.test(v);
  const isValidTimezone = (v: unknown): v is string => {
    if (!isStr(v) || !v) return false;
    try {
      return Intl.supportedValuesOf("timeZone").includes(v);
    } catch {
      return false;
    }
  };
  const isValidDate = (v: unknown): v is string =>
    isStr(v) && !Number.isNaN(Date.parse(v));

  if (typeof site.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug)) {
    return bad("Slug must be lowercase letters, numbers and hyphens");
  }
  const others = await listSites();
  if (others.some((s) => s.slug === site.slug && s.id !== site.id)) {
    return bad("That URL slug is already in use");
  }
  if (!isValidDate(site.weddingDate)) {
    return bad("Wedding date must be a valid date");
  }
  if (!isValidTimezone(site.timezone)) {
    return bad(`Timezone “${typeof site.timezone === "string" ? site.timezone : ""}” is not a known IANA timezone`);
  }
  if (!isStr(site.ownerName) || !isStr(site.ownerEmail)) {
    return bad("Owner name and owner email must be text");
  }
  if (!["draft", "published", "unpublished", "suspended", "archived"].includes(site.status)) {
    return bad("Status is not a known site status");
  }

  // Content: both partner names are required; the rest must be present
  // with the right types so a half-shaped save cannot wipe the site.
  const content = site.content as unknown;
  if (!content || typeof content !== "object") return bad("Content is required");
  const c = content as Record<string, unknown>;
  if (!isNonEmptyStr(c.partnerA)) return bad("Partner A name is required");
  if (!isNonEmptyStr(c.partnerB)) return bad("Partner B name is required");
  for (const key of ["subtitle", "welcome", "invitationText", "story", "dressCode", "footerMessage", "heroImage", "venueName", "venueAddress", "mapLink", "postWeddingMessage"] as const) {
    if (!isStr(c[key])) return bad(`Content field “${key}” must be text`);
  }
  if (!Array.isArray(c.details)) return bad("Details blocks must be a list");
  const detailKinds = new Set(["venue", "travel", "accommodation", "dress", "parking", "accessibility", "registry", "notes"]);
  for (const block of c.details as Record<string, unknown>[]) {
    if (!block || typeof block !== "object") return bad("Every details block must be an object");
    if (!isNonEmptyStr(block.id)) return bad("Every details block needs an id");
    if (!isStr(block.kind) || !detailKinds.has(block.kind)) return bad(`Details block “${String(block.id)}” has an unknown kind`);
    if (!isStr(block.title) || !isStr(block.body)) return bad(`Details block “${String(block.id)}” needs a title and text`);
    if (!isBool(block.hidden)) return bad(`Details block “${String(block.id)}” needs a hidden flag (true/false)`);
    if (block.linkLabel !== undefined && !isStr(block.linkLabel)) return bad(`Details block “${String(block.id)}” link label must be text`);
    if (block.linkUrl !== undefined && !isStr(block.linkUrl)) return bad(`Details block “${String(block.id)}” link URL must be text`);
  }
  if (!Array.isArray(c.faqs)) return bad("FAQs must be a list");
  for (const faq of c.faqs as Record<string, unknown>[]) {
    if (!faq || typeof faq !== "object") return bad("Every FAQ must be an object");
    if (!isNonEmptyStr(faq.id)) return bad("Every FAQ needs an id");
    if (!isStr(faq.question) || !isStr(faq.answer)) return bad(`FAQ “${String(faq.id)}” needs a question and an answer`);
  }

  // Design: colours must be #rrggbb, fonts text, layout one of the three.
  const design = site.design as unknown;
  if (!design || typeof design !== "object") return bad("Design is required");
  const d = design as Record<string, unknown>;
  for (const key of ["primary", "accent", "background"] as const) {
    if (!isHex(d[key])) return bad(`Design colour “${key}” must be a #rrggbb hex colour`);
  }
  if (!isStr(d.headingFont) || !isStr(d.bodyFont)) return bad("Heading and body fonts must be text");
  if (!["grid", "masonry", "carousel"].includes(String(d.galleryLayout))) {
    return bad("Gallery layout must be grid, masonry or carousel");
  }

  // Settings: booleans, a known countdown style, a valid timezone, and a
  // valid (or empty) RSVP deadline.
  const settings = site.settings as unknown;
  if (!settings || typeof settings !== "object") return bad("Settings are required");
  const s = settings as Record<string, unknown>;
  for (const key of ["passwordEnabled", "rsvpEnabled", "countdownEnabled", "showStory", "showGallery", "showEvents", "showDressCode", "showCountdown", "showInvitation", "showDetails", "showFaq"] as const) {
    if (!isBool(s[key])) return bad(`Setting “${key}” must be true or false`);
  }
  if (!(s.passwordHash === null || isStr(s.passwordHash))) return bad("Password hash must be text or empty");
  if (!(s.rsvpDeadline === null || isValidDate(s.rsvpDeadline))) return bad("RSVP deadline must be a valid date or empty");
  if (!isValidTimezone(s.timezone)) return bad("Settings timezone is not a known IANA timezone");
  if (!["classic", "minimal", "bold"].includes(String(s.countdownStyle))) {
    return bad("Countdown style must be classic, minimal or bold");
  }

  // Events / gallery / custom questions.
  if (!Array.isArray(site.events)) {
    return bad("Events must be a list");
  }
  for (const ev of site.events) {
    if (!ev || typeof ev !== "object") return bad("Every event must be an object");
    const e = ev as unknown as Record<string, unknown>;
    if (!isNonEmptyStr(e.id)) return bad("Every event needs an id");
    if (!isNonEmptyStr(e.name)) return bad("Every event needs a name");
    if (!isStr(e.date) || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || Number.isNaN(Date.parse(e.date))) {
      return bad(`Event “${String(e.name ?? e.id)}” needs a valid date (YYYY-MM-DD)`);
    }
    for (const key of ["time", "venue", "address", "description"] as const) {
      if (!isStr(e[key])) return bad(`Event “${String(e.name ?? e.id)}” field “${key}” must be text`);
    }
  }
  if (!Array.isArray(site.gallery)) {
    return bad("Gallery must be a list");
  }
  for (const img of site.gallery) {
    if (!img || typeof img !== "object") return bad("Every gallery photo must be an object");
    const g = img as unknown as Record<string, unknown>;
    if (!isNonEmptyStr(g.id)) return bad("Every gallery photo needs an id");
    if (!isStr(g.url) || !/^(https?:\/\/|data:image\/[a-z]+;base64,)/.test(g.url)) {
      return bad(`Gallery photo “${String(g.id)}” needs a valid http(s) or image data URL`);
    }
    if (!isStr(g.caption)) return bad(`Gallery photo “${String(g.id)}” caption must be text`);
  }
  if (!Array.isArray(site.customQuestions)) {
    return bad("Custom questions must be a list");
  }
  for (const q of site.customQuestions) {
    if (!q || typeof q !== "object") return bad("Every custom question must be an object");
    const qq = q as unknown as Record<string, unknown>;
    if (!isNonEmptyStr(qq.id)) return bad("Every custom question needs an id");
    if (!isNonEmptyStr(qq.label)) return bad("Every custom question needs a label");
    if (qq.type !== "text" && qq.type !== "choice") return bad(`Custom question “${String(qq.label ?? qq.id)}” type must be text or choice`);
    if (!isBool(qq.required)) return bad(`Custom question “${String(qq.label ?? qq.id)}” needs a required flag (true/false)`);
    if (qq.type === "choice") {
      if (!Array.isArray(qq.options) || qq.options.length < 2 || !qq.options.every((o) => isStr(o))) {
        return bad(`Custom question “${String(qq.label ?? qq.id)}” needs at least two text options`);
      }
    }
  }

  // Customers may edit content/design/settings, but never escalate their own
  // status, ownership, or template snapshot — those stay as stored.
  const existing = await getSiteById(site.id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: "Site not found" }, { status: 404 });
  }
  if (!isAdmin(admin)) {
    site.status = existing.status;
    site.ownerName = existing.ownerName;
    site.ownerEmail = existing.ownerEmail;
    site.templateId = existing.templateId;
    site.templateSnapshot = existing.templateSnapshot;
    site.createdAt = existing.createdAt;
    site.publishedAt = existing.publishedAt;
  }

  await saveSite(site);
  return NextResponse.json({ ok: true, updatedAt: site.updatedAt });
}
