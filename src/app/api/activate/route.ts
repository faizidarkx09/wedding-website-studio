// POST /api/activate — turn an access code into a customer session.
//
// Two kinds of code:
// 1. TEMPLATE code (e.g. WWS-EDITORIAL-2026): one fixed code per template,
//    shared by every buyer of that template. Activating it creates a
//    BRAND-NEW private site from that template, for this buyer only —
//    buyers never share a site. The buyer must supply their names
//    (Partner A + Partner B); the site slug is derived from them.
// 2. Stored access code (e.g. the demo code WWS-DEMO-2026): claims the
//    pre-built site the code points to. The demo code is reusable by
//    design; any other stored code is single-use.
import { NextRequest, NextResponse } from "next/server";
import {
  createSiteFromTemplate,
  findAccessCodeByHash,
  findTemplateByAccessCodeHash,
  getSiteById,
  useAccessCode,
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

  // --- 1. Template code: create a fresh site for this buyer. ---
  const template = await findTemplateByAccessCodeHash(codeHash);
  if (template) {
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

  // --- 2. Stored access code (demo code): claim its pre-built site. ---
  const record = await findAccessCodeByHash(codeHash);
  if (!record || record.status !== "active") {
    // Deliberately generic: do not leak whether a code exists, was used,
    // revoked, or expired.
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 401 });
  }

  const site = await getSiteById(record.siteId);
  if (!site) {
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 401 });
  }

  // Demo code (code-demo-1) is reusable by design — it is the labeled
  // demo site's code. Other stored codes are single-use: consumed on activation.
  if (record.id !== "code-demo-1") {
    await useAccessCode(record.id);
  }

  const res = NextResponse.json({ ok: true, slug: site.slug });
  setCustomerSession(res, site.id);
  return res;
}
