import { NextRequest, NextResponse } from "next/server";
import { deleteRsvp, listRsvps } from "@/lib/store";
import { verifySession, type SessionPayload } from "@/lib/auth";

function sessions(req: NextRequest): { customer: SessionPayload | null; admin: SessionPayload | null } {
  return {
    customer: verifySession(req.cookies.get("wws_customer")?.value),
    admin: verifySession(req.cookies.get("wws_admin")?.value),
  };
}

/** Resolve the site this caller may access, or null. */
function allowedSiteId(customer: SessionPayload | null, admin: SessionPayload | null, requested: string | null): string | null {
  if (admin && admin.role === "admin") return requested;
  if (customer && customer.role === "customer") {
    // A customer may only ever see their own site, whatever they ask for.
    return customer.siteId ?? null;
  }
  return null;
}

/** GET ?siteId= — RSVP list + counts for one site. */
export async function GET(req: NextRequest) {
  const { customer, admin } = sessions(req);
  const siteId = allowedSiteId(customer, admin, req.nextUrl.searchParams.get("siteId"));
  if (!siteId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const rsvps = await listRsvps(siteId);
  const attendingList = rsvps.filter((r) => r.attending);
  return NextResponse.json({
    ok: true,
    rsvps,
    counts: {
      total: rsvps.length,
      attending: attendingList.length,
      declined: rsvps.length - attendingList.length,
      attendees: attendingList.reduce((sum, r) => sum + r.guestCount, 0),
    },
  });
}

/** DELETE ?id=&siteId= — delete one RSVP response. */
export async function DELETE(req: NextRequest) {
  const { customer, admin } = sessions(req);
  const params = req.nextUrl.searchParams;
  const siteId = allowedSiteId(customer, admin, params.get("siteId"));
  const id = params.get("id");
  if (!siteId || !id) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  await deleteRsvp(id, siteId);
  return NextResponse.json({ ok: true });
}
