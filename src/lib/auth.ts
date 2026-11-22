// Server-only auth helpers: hashing, signed sessions, rate limiting.
// Access codes and guest passwords are stored as SHA-256 hashes only.

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

export interface SessionPayload {
  role: "admin" | "customer";
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

// --- Simple in-memory rate limiting (per process; Supabase/Upstash can
// replace this in production — see README "Production hardening"). ---
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
