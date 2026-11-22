import { NextRequest, NextResponse } from "next/server";
import { verifySession, type SessionPayload } from "@/lib/auth";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * POST multipart form-data { file, siteId } — customer (own site) or admin.
 * Demo/local storage: the image is returned as a base64 data URL and stored
 * in the site gallery by the editor. When Supabase Storage is configured,
 * this route should upload the bytes there and return the public URL
 * instead — it currently does NOT upload to Supabase.
 */
export async function POST(req: NextRequest) {
  const customer: SessionPayload | null = verifySession(req.cookies.get("wws_customer")?.value);
  const admin: SessionPayload | null = verifySession(req.cookies.get("wws_admin")?.value);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Expected multipart form-data" }, { status: 400 });
  }
  const siteId = form.get("siteId");
  if (typeof siteId !== "string" || !siteId) {
    return NextResponse.json({ ok: false, error: "siteId is required" }, { status: 400 });
  }
  const isAdminUser = !!admin && admin.role === "admin";
  const isOwner = !!customer && customer.role === "customer" && customer.siteId === siteId;
  if (!isAdminUser && !isOwner) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string" || !("arrayBuffer" in file)) {
    return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Only JPG, PNG and WebP images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "Image must be 5 MB or smaller" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ ok: false, error: "Uploaded file is empty" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const url = `data:${file.type};base64,${bytes.toString("base64")}`;
  return NextResponse.json({ ok: true, url });
}
