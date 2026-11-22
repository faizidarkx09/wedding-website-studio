import { NextRequest, NextResponse } from "next/server";
import { getSiteBySlug } from "@/lib/store";
import { rateLimit, sha256 } from "@/lib/auth";

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * POST { slug, password } — guest gate for a password-protected public site.
 * No protection configured → { ok: true }. On success sets the
 * `wws_guest_<slug>` cookie (httpOnly, 7 days) which the public site page
 * checks server-side to bypass the gate. Wrong password → generic error.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  const { slug, password } = (body as { slug?: unknown; password?: unknown }) ?? {};
  if (typeof slug !== "string" || !slug) {
    return NextResponse.json({ ok: false, error: "slug is required" }, { status: 400 });
  }
  const ip = clientIp(req);
  if (!rateLimit(`guest-pw:${slug}:${ip}`, 5)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  const site = await getSiteBySlug(slug);
  if (!site) return NextResponse.json({ ok: false, error: "Site not found" }, { status: 404 });

  // No password protection on this site: the gate is open.
  if (!site.settings.passwordEnabled || !site.settings.passwordHash) {
    return NextResponse.json({ ok: true });
  }
  if (typeof password !== "string" || sha256(password) !== site.settings.passwordHash) {
    return NextResponse.json({ ok: false, error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(`wws_guest_${slug}`, "1", {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 3600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
