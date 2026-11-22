import { NextRequest, NextResponse } from "next/server";
import { adminPassword, rateLimit, sha256, signSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // 5 attempts per 15 minutes per IP.
  if (!rateLimit(`admin-login:${ip}`, 5)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const password =
    body && typeof body === "object" && "password" in body
      ? (body as { password?: unknown }).password
      : undefined;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password is required." }, { status: 400 });
  }

  // Compare hashes (never the raw passwords) — equality of SHA-256 hex.
  if (sha256(password) !== sha256(adminPassword())) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(
    "wws_admin",
    signSession({ role: "admin", exp: Date.now() + 30 * 24 * 3600 * 1000 }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 3600,
    },
  );
  return res;
}
