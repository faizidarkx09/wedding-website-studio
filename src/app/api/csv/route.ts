// GET /api/csv?siteId=… — CSV export of one site's RSVPs only.
// Customer session (session.siteId must match) or admin session.
// Formula-injection escaping is applied by toCsv.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { listRsvps } from "@/lib/store";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const siteId = req.nextUrl.searchParams.get("siteId") || "";
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const admin = verifySession(cookieStore.get("wws_admin")?.value);
  const customer = verifySession(cookieStore.get("wws_customer")?.value);
  const isAdmin = admin?.role === "admin";
  const isOwner = customer?.role === "customer" && customer.siteId === siteId;
  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Not authorised for this site" }, { status: 401 });
  }

  const rsvps = await listRsvps(siteId);
  const csv = toCsv(
    rsvps.map((r) => ({
      name: r.guestName,
      email: r.email,
      phone: r.phone,
      attending: r.attending ? "Yes" : "No",
      guests: r.guestCount,
      dietary: r.dietary,
      allergies: r.allergies,
      message: r.message,
      submitted: r.submittedAt,
    })),
    [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "attending", label: "Attending" },
      { key: "guests", label: "Guests" },
      { key: "dietary", label: "Dietary" },
      { key: "allergies", label: "Allergies" },
      { key: "message", label: "Message" },
      { key: "submitted", label: "Submitted" },
    ],
  );

  const safeSiteId = siteId.replace(/[^A-Za-z0-9._-]/g, "-");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rsvps-${safeSiteId}.csv"`,
    },
  });
}
