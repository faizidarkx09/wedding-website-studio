// Server-only auth helpers: hashing, signed sessions, rate limiting.
// Guest passwords are stored as SHA-256 hashes only. Template access
// codes are NOT hashed in storage — they are kept in plain text in the
// template record by design (they ship in the delivery PDF); only the
// code the buyer types is hashed before comparison.
import { createHash, createHmac, randomBytes } from "crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function generateAccessCode(): string {
  const part = () =>
    randomBytes(2).toString("hex").toUpperCase().replace(/[^A-Z0-9]/g, "");
  // WWS-XXXX-XXXX-XXXX, cryptographically random, unguessable.
  return `WWS-${part()}-${part()}-${part()}`;
}

export function generateToken(bytes = 24): string {
  return randomBytes(bytes).toString("hex");
}

function sessionSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-secret-change-me-in-production";
}

// LOUD WARNING (do not silence): the fallback session secret above is a
// publicly known string in this repo. If the live site runs with it, ANYONE
// can forge a valid admin session cookie (signSession is HMAC-SHA256 with
// this secret) and open /admin without the password. Set SESSION_SECRET
// (and ADMIN_PASSWORD) in the Vercel env vars and redeploy. This warning
// fires once per serverless instance boot in production.
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  console.error(
    "[SECURITY] SESSION_SECRET is not set — the app is signing admin/customer sessions with the public default secret from the repo. Anyone can forge an admin cookie. Set SESSION_SECRET in Vercel env vars and redeploy immediately.",
  );
}
if (process.env.NODE_ENV === "production" && !process.env.ADMIN_PASSWORD) {
  console.error(
    "[SECURITY] ADMIN_PASSWORD is not set — the admin login accepts the public default password admin123. Set ADMIN_PASSWORD in Vercel env vars and redeploy.",
  );
}

export interface SessionPayload {
  role: "admin" | "customer" | "guest";
  siteId?: string;
  exp: number;
}

export function signSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// --- Simple in-memory rate limiting.
// NOTE: this map lives per process / per serverless instance. On Vercel
// each function instance has its own copy, so the limit is enforced
// per-instance, not globally — a burst spread across instances is not
// counted together. A shared store (Supabase/Upstash) is needed for a
// truly global limit; see README "Production hardening". ---
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxAttempts) return false;
  entry.count += 1;
  return true;
}

export function adminPassword(): string {
  // Default admin password. Set ADMIN_PASSWORD in production — see README.
  return process.env.ADMIN_PASSWORD || "admin123";
}
