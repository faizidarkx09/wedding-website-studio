import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { archiveTemplate, getTemplateById, listTemplates, saveTemplate } from "@/lib/store";
import type { TemplateMeta } from "@/lib/types";

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get("wws_admin")?.value);
  return session && session.role === "admin" ? session : null;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const HEX = /^#[0-9a-fA-F]{6}$/;

/** Validate a TemplateMeta payload. Saving a master template only updates
 *  the templates table — existing sites keep their templateSnapshot, so
 *  this can never silently change a purchased customer's site. */
function isValidTemplate(v: unknown): v is TemplateMeta {
  if (!v || typeof v !== "object") return false;
  const t = v as Record<string, unknown>;
  if (typeof t.id !== "string" || !t.id.trim()) return false;
  if (typeof t.name !== "string" || !t.name.trim()) return false;
  if (typeof t.tagline !== "string" || typeof t.description !== "string") return false;
  if (typeof t.priceUsd !== "number" || !Number.isFinite(t.priceUsd) || t.priceUsd < 0) return false;
  if (!(t.etsyListingId === null || typeof t.etsyListingId === "string")) return false;
  if (typeof t.active !== "boolean") return false;
  if (typeof t.fontClass !== "string" || typeof t.layout !== "string") return false;
  if (!Array.isArray(t.sections) || !t.sections.every((s) => typeof s === "string")) return false;
  const p = t.palette;
  if (!p || typeof p !== "object") return false;
  const pal = p as Record<string, unknown>;
  return (
    typeof pal.bg === "string" && HEX.test(pal.bg) &&
    typeof pal.ink === "string" && HEX.test(pal.ink) &&
    typeof pal.accent === "string" && HEX.test(pal.accent) &&
    typeof pal.accentSoft === "string" && HEX.test(pal.accentSoft)
  );
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Admin sign-in required." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return bad("Invalid request body.");
  }

  const action = body.action;
  if (typeof action !== "string") return bad("Missing action.");

  if (action === "save") {
    if (!isValidTemplate(body.template)) {
      return bad("Invalid template: name, a price ≥ 0, and four #rrggbb palette colours are required.");
    }
    await saveTemplate(body.template);
    return NextResponse.json({ ok: true, id: body.template.id });
  }

  if (action === "duplicate") {
    const id = typeof body.id === "string" ? body.id : typeof body.templateId === "string" ? body.templateId : "";
    if (!id) return bad("Missing template id.");
    const original = await getTemplateById(id);
    if (!original) return bad("Template not found.", 404);
    const taken = new Set((await listTemplates()).map((t) => t.id));
    let copyId = `${original.id}-copy`;
    let n = 2;
    while (taken.has(copyId as TemplateMeta["id"])) copyId = `${original.id}-copy-${n++}`;
    const copy: TemplateMeta = {
      ...original,
      id: copyId as TemplateMeta["id"],
      name: `${original.name} Copy`,
      // A copy must not share the original's Etsy listing — it starts
      // inactive until the admin gives it its own listing and activates it.
      etsyListingId: null,
      active: false,
      palette: { ...original.palette },
      sections: [...original.sections],
    };
    await saveTemplate(copy);
    return NextResponse.json({ ok: true, id: copy.id });
  }

  if (action === "archive") {
    const id = typeof body.id === "string" ? body.id : typeof body.templateId === "string" ? body.templateId : "";
    if (!id) return bad("Missing template id.");
    const existing = await getTemplateById(id);
    if (!existing) return bad("Template not found.", 404);
    await archiveTemplate(id);
    return NextResponse.json({ ok: true, id });
  }

  return bad(`Unknown action: ${action}.`);
}
