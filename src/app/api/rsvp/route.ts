// POST /api/rsvp — submit a new RSVP or update an existing one via its
// update token. GET /api/rsvp?token=… — fetch one response's public-safe
// fields so a guest can edit their own RSVP. Never returns other guests.

import { NextRequest, NextResponse } from "next/server";
import { generateToken, rateLimit, verifySession } from "@/lib/auth";
import { getRsvpByToken, getSiteById, saveRsvp } from "@/lib/store";
import type { RsvpResponse } from "@/lib/types";

const MAX_GUEST_COUNT = 10;

function str(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const siteId = str(body.siteId, 100);
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  // Rate-limit per IP + site: 10 submissions per minute.
  if (!rateLimit(`rsvp:${clientIp(req)}:${siteId}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const site = await getSiteById(siteId);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }
  // Only published sites take RSVPs — drafts / unpublished / suspended
  // sites must not collect responses (direct POSTs included, not just
  // the form page, which already 404s for them via getPublicSite).
  if (site.status !== "published") {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }
  // Password-protected sites: the caller must hold the signed guest
  // cookie for this site, exactly as the RSVP form page requires.
  // (The form page is gated, but a direct POST would bypass it.)
  if (site.settings.passwordEnabled) {
    const session = verifySession(req.cookies.get(`wws_guest_${site.slug}`)?.value);
    if (!(session?.role === "guest" && session.siteId === site.id)) {
      return NextResponse.json({ error: "Password required" }, { status: 401 });
    }
  }
  if (!site.settings.rsvpEnabled) {
    return NextResponse.json({ error: "RSVP is disabled for this site" }, { status: 403 });
  }

  // --- Validation (all server-side) ---
  const guestName = str(body.guestName, 200);
  if (!guestName) {
    return NextResponse.json({ error: "Guest name is required" }, { status: 400 });
  }
  if (typeof body.attending !== "boolean") {
    return NextResponse.json({ error: "attending must be true or false" }, { status: 400 });
  }
  const attending = body.attending;
  const guestCount = body.guestCount;
  if (
    typeof guestCount !== "number" ||
    !Number.isInteger(guestCount) ||
    guestCount < 0 ||
    guestCount > MAX_GUEST_COUNT
  ) {
    return NextResponse.json(
      { error: `guestCount must be an integer between 0 and ${MAX_GUEST_COUNT}` },
      { status: 400 },
    );
  }
  if (!attending && guestCount !== 0) {
    return NextResponse.json(
      { error: "guestCount must be 0 when declining" },
      { status: 400 },
    );
  }
  if (attending && guestCount < 1) {
    return NextResponse.json(
      { error: "guestCount must be at least 1 when attending" },
      { status: 400 },
    );
  }

  // --- Server-side deadline enforcement (never client-only) ---
  // Deadlines are stored as ISO UTC; compare against Date.now().
  if (site.settings.rsvpDeadline) {
    const deadlineMs = Date.parse(site.settings.rsvpDeadline);
    if (!Number.isNaN(deadlineMs) && Date.now() > deadlineMs) {
      return NextResponse.json({ error: "RSVP closed" }, { status: 410 });
    }
  }

  const email = str(body.email, 200);
  const phone = str(body.phone, 50);
  const dietary = str(body.dietary, 500);
  const allergies = str(body.allergies, 500);
  const message = str(body.message, 2000);
  const answers: Record<string, string> = {};
  if (body.answers && typeof body.answers === "object" && !Array.isArray(body.answers)) {
    for (const [key, value] of Object.entries(body.answers as Record<string, unknown>)) {
      if (typeof value === "string") answers[key.slice(0, 100)] = value.slice(0, 1000);
    }
  }

  const now = new Date().toISOString();
  const updateToken = str(body.updateToken, 200);

  // --- Update path: token must belong to THIS site; update in place ---
  if (updateToken) {
    const existing = await getRsvpByToken(updateToken);
    if (!existing || existing.siteId !== site.id) {
      return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
    }
    const updated: RsvpResponse = {
      ...existing,
      guestName,
      email,
      phone,
      attending,
      guestCount,
      dietary,
      allergies,
      message,
      answers,
      status: "updated",
      updatedAt: now,
    };
    await saveRsvp(updated);
    return NextResponse.json({ ok: true, updateToken: existing.updateToken, id: existing.id });
  }

  // --- Create path ---
  const created: RsvpResponse = {
    id: `rsvp-${Date.now().toString(36)}-${generateToken(6)}`,
    siteId: site.id,
    guestName,
    email,
    phone,
    attending,
    guestCount,
    dietary,
    allergies,
    message,
    answers,
    updateToken: generateToken(),
    status: attending ? "attending" : "declined",
    submittedAt: now,
    updatedAt: now,
  };
  await saveRsvp(created);
  return NextResponse.json({ ok: true, updateToken: created.updateToken, id: created.id });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }
  const rsvp = await getRsvpByToken(token);
  if (!rsvp) {
    return NextResponse.json({ error: "RSVP not found" }, { status: 404 });
  }
  // Public-safe fields only — never other guests' data, never the token
  // of anyone else, never internal ids beyond this record's own.
  return NextResponse.json({
    guestName: rsvp.guestName,
    attending: rsvp.attending,
    guestCount: rsvp.guestCount,
    dietary: rsvp.dietary,
    allergies: rsvp.allergies,
    message: rsvp.message,
    answers: rsvp.answers,
    email: rsvp.email,
    phone: rsvp.phone,
  });
}
