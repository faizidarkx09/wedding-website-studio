import { NextRequest, NextResponse } from "next/server";
import { getSiteById, saveSite } from "@/lib/store";
import { sha256, verifySession, type SessionPayload } from "@/lib/auth";

function sessions(req: NextRequest): { customer: SessionPayload | null; admin: SessionPayload | null } {
  return {
    customer: verifySession(req.cookies.get("wws_customer")?.value),
    admin: verifySession(req.cookies.get("wws_admin")?.value),
  };
}

/**
 * POST { siteId, password } — set/change the guest password (hashed
 * server-side; the plain password is never stored or forwarded anywhere
 * else). POST { siteId, disable: true } — remove guest-password protection.
 * The plain password is never logged.
 */
export async function POST(req: NextRequest) {
  const { customer, admin } = sessions(req);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const { siteId, password, disable } = (body as { siteId?: unknown; password?: unknown; disable?: unknown }) ?? {};
  if (typeof siteId !== "string" || !siteId) {
    return NextResponse.json({ ok: false, error: "siteId is required" }, { status: 400 });
  }
  const isAdminUser = !!admin && admin.role === "admin";
  const isOwner = !!customer && customer.role === "customer" && customer.siteId === siteId;
  if (!isAdminUser && !isOwner) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const site = await getSiteById(siteId);
  if (!site) return NextResponse.json({ ok: false, error: "Site not found" }, { status: 404 });

  if (disable === true) {
    site.settings.passwordEnabled = false;
    site.settings.passwordHash = null;
    await saveSite(site);
    return NextResponse.json({ ok: true, passwordEnabled: false });
  }

  if (typeof password !== "string" || password.length < 4) {
    return NextResponse.json({ ok: false, error: "Password must be at least 4 characters" }, { status: 400 });
  }
  site.settings.passwordEnabled = true;
  site.settings.passwordHash = sha256(password);
  await saveSite(site);
  return NextResponse.json({ ok: true, passwordEnabled: true });
}
