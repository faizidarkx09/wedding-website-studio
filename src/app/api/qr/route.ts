// GET /api/qr?slug=…&format=svg|png — QR code for a site's PUBLIC guest
// URL only. Never encodes editor, activation or admin URLs.
//
// Access: published sites are public (anyone may fetch their QR code).
// Draft / unpublished / suspended sites only disclose a QR code to their
// owner (customer session for that site) or an admin — otherwise 404,
// so the endpoint cannot be used to probe for or advertise hidden sites.

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSiteBySlug } from "@/lib/store";
import { verifySession } from "@/lib/auth";
import { qrPng, qrSvg } from "@/lib/qr";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const format = (req.nextUrl.searchParams.get("format") || "svg").toLowerCase();
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  if (format !== "svg" && format !== "png") {
    return NextResponse.json({ error: "format must be svg or png" }, { status: 400 });
  }

  const site = await getSiteBySlug(slug);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  if (site.status !== "published") {
    const cookieStore = await cookies();
    const admin = verifySession(cookieStore.get("wws_admin")?.value);
    const customer = verifySession(cookieStore.get("wws_customer")?.value);
    const allowed =
      admin?.role === "admin" ||
      (customer?.role === "customer" && customer.siteId === site.id);
    if (!allowed) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
  }

  // Canonical base URL first (configured), then this request's own
  // origin. Never the Origin header: it is caller-controlled, and a
  // forged Origin would make the QR code point at an attacker's domain.
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    new URL(req.url).origin
  ).replace(/\/$/, "");
  const publicUrl = `${base}/w/${site.slug}`;

  if (format === "png") {
    const png = await qrPng(publicUrl);
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="qr-${site.slug}.png"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const svg = await qrSvg(publicUrl);
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `inline; filename="qr-${site.slug}.svg"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
