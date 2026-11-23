import { NextRequest, NextResponse } from "next/server";
import { getSiteById, setSiteStatus } from "@/lib/store";
import { verifySession, type SessionPayload } from "@/lib/auth";

function sessions(req: NextRequest): { customer: SessionPayload | null; admin: SessionPayload | null } {
  return {
    customer: verifySession(req.cookies.get("wws_customer")?.value),
    admin: verifySession(req.cookies.get("wws_admin")?.value),
  };
}

export async function POST(req: NextRequest) {
  const { customer, admin } = sessions(req);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const { siteId, status } = (body as { siteId?: unknown; status?: unknown }) ?? {};
  if (typeof siteId !== "string" || !siteId) {
    return NextResponse.json({ ok: false, error: "siteId is required" }, { status: 400 });
  }
  const isAdminUser = !!admin && admin.role === "admin";
  const isOwner = !!customer && customer.role === "customer" && customer.siteId === siteId;
  if (!isAdminUser && !isOwner) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (status !== "published" && status !== "unpublished") {
    return NextResponse.json({ ok: false, error: "status must be 'published' or 'unpublished'" }, { status: 400 });
  }
  const site = await getSiteById(siteId);
  if (!site) return NextResponse.json({ ok: false, error: "Site not found" }, { status: 404 });
  // A suspended or archived site can only be restored by an admin (via
  // /api/admin/sites). The owner must not be able to re-publish it here.
  if (status === "published" && (site.status === "suspended" || site.status === "archived") && !isAdminUser) {
    return NextResponse.json(
      { ok: false, error: "This website was suspended or archived. Only an admin can restore it." },
      { status: 403 },
    );
  }
  await setSiteStatus(siteId, status);
  return NextResponse.json({ ok: true, status });
}
