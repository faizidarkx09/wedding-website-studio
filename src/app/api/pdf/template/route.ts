// GET /api/pdf/template?templateId=… — admin-only delivery PDF for ONE
// template. One static PDF per template: the seller uploads it once to the
// Etsy listing as the digital download file. Every buyer of that template
// gets this same PDF and this same access code — activating the code
// creates a brand-new private site just for that buyer.
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getTemplateById } from "@/lib/store";
import { templateDeliveryPdf } from "@/lib/pdf";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin session required" }, { status: 401 });
  }

  const templateId = req.nextUrl.searchParams.get("templateId") || "";
  if (!templateId) {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  const template = await getTemplateById(templateId);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
  if (!template.accessCode) {
    return NextResponse.json(
      { error: "This template has no access code yet" },
      { status: 400 },
    );
  }

  const base = (
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  ).replace(/\/$/, "");
  const pdf = templateDeliveryPdf({
    templateName: template.name,
    activateUrl: `${base}/activate`,
    templateUrl: `${base}/templates/${template.id}`,
    accessCode: template.accessCode,
  });

  const safeId = template.id.replace(/[^A-Za-z0-9._-]/g, "-");
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="wedding-website-studio-${safeId}.pdf"`,
    },
  });
}
