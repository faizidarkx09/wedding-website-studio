// GET /api/pdf?orderId=… — admin-only delivery PDF for a provisioned
// order. Requires the order to have a display code: if the code was already
// shown (or never generated), the admin must reset the code first — the
// plain code is never stored, so it cannot be recovered from the database.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getOrderById, getSiteById } from "@/lib/store";
import { deliveryPdf } from "@/lib/pdf";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin session required" }, { status: 401 });
  }

  const orderId = req.nextUrl.searchParams.get("orderId") || "";
  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!order.siteId) {
    return NextResponse.json(
      { error: "Order has no provisioned site yet" },
      { status: 400 },
    );
  }
  if (!order.displayCode) {
    return NextResponse.json(
      {
        error:
          "No access code available for this order. Reset the access code first, then download the PDF again.",
      },
      { status: 400 },
    );
  }

  const site = await getSiteById(order.siteId);
  if (!site) {
    return NextResponse.json({ error: "Provisioned site not found" }, { status: 404 });
  }

  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  ).replace(/\/$/, "");
  const pdf = deliveryPdf({
    customerName: order.customerName,
    templateName: site.templateSnapshot.name,
    editorUrl: `${base}/editor?site=${site.slug}`,
    activateUrl: `${base}/activate`,
    accessCode: order.displayCode,
    siteSlug: site.slug,
    publicUrl: `${base}/w/${site.slug}`,
  });

  const safeOrderId = order.etsyOrderId.replace(/[^A-Za-z0-9._-]/g, "-");
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="wedding-website-${safeOrderId}.pdf"`,
    },
  });
}
