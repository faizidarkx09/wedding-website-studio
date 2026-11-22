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

  // --- Validation ---
  if (typeof site.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug)) {
    return NextResponse.json({ ok: false, error: "Slug must be lowercase letters, numbers and hyphens" }, { status: 400 });
  }
  const others = await listSites();
  if (others.some((s) => s.slug === site.slug && s.id !== site.id)) {
    return NextResponse.json({ ok: false, error: "That URL slug is already in use" }, { status: 400 });
  }
  if (typeof site.weddingDate !== "string" || Number.isNaN(Date.parse(site.weddingDate))) {
    return NextResponse.json({ ok: false, error: "Wedding date must be a valid date" }, { status: 400 });
  }
  if (!Array.isArray(site.events)) {
    return NextResponse.json({ ok: false, error: "Events must be a list" }, { status: 400 });
  }
  for (const ev of site.events) {
    if (!ev || typeof ev.name !== "string" || !ev.name.trim() || typeof ev.date !== "string" || !ev.date.trim()) {
      return NextResponse.json({ ok: false, error: "Every event needs a name and a date" }, { status: 400 });
    }
  }
  if (!Array.isArray(site.gallery) || !Array.isArray(site.customQuestions)) {
    return NextResponse.json({ ok: false, error: "Gallery and custom questions must be lists" }, { status: 400 });
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
