// GET /api/qr?slug=…&format=svg|png — QR code for a site's PUBLIC guest
// URL only. Never encodes editor, activation or admin URLs.

import { NextRequest, NextResponse } from "next/server";
import { getSiteBySlug } from "@/lib/store";
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

  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get("origin") ||
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
