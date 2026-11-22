import { NextRequest, NextResponse } from "next/server";
import { findAccessCodeByHash, useAccessCode, getSiteById } from "@/lib/store";
import { rateLimit, sha256, signSession } from "@/lib/auth";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
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
  const record = await findAccessCodeByHash(sha256(code));
  if (!record || record.status !== "active") {
    // Deliberately generic: do not leak whether the code exists, was used,
    // revoked, or expired.
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 401 });
  }

  // Site id is on the code record; resolve the slug for the redirect.
  const site = await getSiteById(record.siteId);
  if (!site) {
    return NextResponse.json({ ok: false, error: "Invalid, revoked or expired code" }, { status: 401 });
  }

  // Demo code (code-demo-1) is reusable by design — it is the labeled
  // demo site's code. Real codes are single-use: consumed on activation.
  if (record.id !== "code-demo-1") {
    await useAccessCode(record.id);
  }

  const res = NextResponse.json({ ok: true, slug: site.slug });
  res.cookies.set("wws_customer", signSession({ role: "customer", siteId: site.id, exp: Date.now() + 30 * 24 * 3600 * 1000 }), {
    httpOnly: true,
    path: "/",
    maxAge: 30 * 24 * 3600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
