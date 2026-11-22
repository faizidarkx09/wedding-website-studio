import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { getSiteById, setSiteStatus } from "@/lib/store";
import type { WeddingSite } from "@/lib/types";

const ALLOWED: WeddingSite["status"][] = ["draft", "published", "unpublished", "suspended", "archived"];

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.action !== "set-status") {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!id || !ALLOWED.includes(status as WeddingSite["status"])) {
    return NextResponse.json({ error: "A valid site id and status are required." }, { status: 400 });
  }
  const site = await getSiteById(id);
  if (!site) return NextResponse.json({ error: "Site not found." }, { status: 404 });

  await setSiteStatus(id, status as WeddingSite["status"]);
  return NextResponse.json({ ok: true, status });
}
