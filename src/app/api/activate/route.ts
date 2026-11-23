// POST /api/activate — turn a template access code into a customer session.
//
// Template-code only: one fixed code per template (e.g. WWS-XXXX-2026),
// shared by every buyer of that template. Activating it creates a
// BRAND-NEW private site from that template, for this buyer only —
// buyers never share a site. The buyer must supply their names
// (Partner A + Partner B); the site slug is derived from them.
import { NextRequest, NextResponse } from "next/server";
import {
  createSiteFromTemplate,
  findTemplateByAccessCodeHash,
  getSiteById,
} from "@/lib/store";
import { rateLimit, sha256, signSession, verifySession } from "@/lib/auth";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

function customerCookie(siteId: string) {
  return signSession({
    role: "customer",
    siteId,
    exp: Date.now() + 30 * 24 * 3600 * 1000,
  });
}

function setCustomerSession(res: NextResponse, siteId: string) {
  res.cookies.set("wws_customer", customerCookie(siteId), {
    httpOnly: true,
    path: "/",
    maxAge: 30 * 24 * 3600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function cleanName(v: unknown): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, 60) : "";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (!rateLimit(`activate:${ip}`, 5)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 400 });
  }
  const rawCode = (body as { code?: unknown })?.code;
  if (typeof rawCode !== "string" || !rawCode.trim()) {
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 400 });
  }

  // Normalize: trim + uppercase. Never log the plain code.
  const code = rawCode.trim().toUpperCase();
  const codeHash = sha256(code);

  const template = await findTemplateByAccessCodeHash(codeHash);
  if (!template || !template.active) {
    // Deliberately generic: do not leak whether a code exists, or whether
    // its template is inactive — both look identical to the caller.
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 401 });
  }

  const partnerA = cleanName((body as { partnerA?: unknown })?.partnerA);
  const partnerB = cleanName((body as { partnerB?: unknown })?.partnerB);
  if (!partnerA || !partnerB) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please enter both names — your new website is created from them.",
        needsNames: true,
      },
      { status: 400 },
    );
  }

  // Activating creates a NEW site and overwrites the wws_customer cookie,
  // which would orphan the caller's existing site (no recovery path).
  // If this browser already has a valid customer session for a different
  // site, stop and ask for explicit confirmation first.
  const confirmOverwrite = (body as { confirmOverwrite?: unknown })?.confirmOverwrite === true;
  const existingSession = verifySession(req.cookies.get("wws_customer")?.value);
  if (!confirmOverwrite && existingSession?.role === "customer" && existingSession.siteId) {
    const existingSite = await getSiteById(existingSession.siteId);
    if (existingSite) {
      return NextResponse.json(
        {
          ok: false,
          overwritesExisting: true,
          existingSlug: existingSite.slug,
          error:
            "You already have a website. Activating creates a NEW one and you will lose access to the old one.",
        },
        { status: 409 },
      );
    }
  }

  const site = await createSiteFromTemplate(template, partnerA, partnerB);
  const res = NextResponse.json({ ok: true, slug: site.slug, created: true });
  setCustomerSession(res, site.id);
  return res;
}
