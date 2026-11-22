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
} from "@/lib/store";
import { rateLimit, sha256, signSession } from "@/lib/auth";

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
  if (!template) {
    // Deliberately generic: do not leak whether a code exists.
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
  const site = await createSiteFromTemplate(template, partnerA, partnerB);
  const res = NextResponse.json({ ok: true, slug: site.slug, created: true });
  setCustomerSession(res, site.id);
  return res;
}
