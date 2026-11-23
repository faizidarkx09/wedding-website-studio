import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateAccessCode, verifySession } from "@/lib/auth";
import { getTemplateById, listTemplates, saveTemplate } from "@/lib/store";
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

/** Composition keys the renderer knows (SiteRenderer composition()):
 * champagne, blue, midnight, sage, mediterranean, lavender, eternel,
 * blossom, sacred-garden, dolce-vita, plus the generic "classic"
 * fallback for unknown keys. */
const KNOWN_COMPOSITIONS = new Set([
  "champagne",
  "blue",
  "midnight",
  "sage",
  "mediterranean",
  "lavender",
  "eternel",
  "blossom",
  "sacred-garden",
  "dolce-vita",
  "classic",
]);

/** Section keys the renderer knows (NAV_LABELS + renderSection switch in
 * SiteRenderer). "hero" has no nav label but is a real section.
 * "welcome" and "venue" are ÉTERNEL-only sections (its own renderer);
 * "dress-code" is a BLOSSOM & OUD / SACRED GARDEN / DOLCE VITA section
 * (their own renderers). */
const KNOWN_SECTIONS = new Set([
  "hero",
  "invitation",
  "countdown",
  "story",
  "events",
  "details",
  "gallery",
  "faq",
  "rsvp",
  "welcome",
  "venue",
  "dress-code",
]);

/** Validate a TemplateMeta payload. Returns an error message, or null when
 * valid. Saving a master template only updates the templates table —
 * existing sites keep their templateSnapshot, so this can never silently
 * change a purchased customer's site. */
function validateTemplate(v: unknown): string | null {
  if (!v || typeof v !== "object") return "Invalid template.";
  const t = v as Record<string, unknown>;
  if (typeof t.id !== "string" || !t.id.trim()) return "Template ID is required.";
  if (typeof t.name !== "string" || !t.name.trim()) return "Template name is required.";
  if (typeof t.tagline !== "string" || typeof t.description !== "string") return "Tagline and description are required.";
  if (typeof t.priceUsd !== "number" || !Number.isFinite(t.priceUsd) || t.priceUsd < 0) return "Price must be a number ≥ 0.";
  if (!(t.etsyListingId === null || typeof t.etsyListingId === "string")) return "Etsy listing ID must be text or empty.";
  if (typeof t.active !== "boolean") return "Active must be true or false.";
  // The fixed per-template access code must survive every save — it is
  // baked into the static delivery PDF on Etsy, so it must never be
  // blanked or lost by an edit.
  if (typeof t.accessCode !== "string" || !t.accessCode.trim()) return "Access code is required.";
  if (typeof t.fontClass !== "string" || typeof t.layout !== "string") return "Font class and layout are required.";
  if (typeof t.composition !== "string" || !KNOWN_COMPOSITIONS.has(t.composition)) {
    return `Composition must be one of: ${[...KNOWN_COMPOSITIONS].sort().join(", ")}.`;
  }
  if (!Array.isArray(t.sections) || !t.sections.every((s) => typeof s === "string")) return "Sections must be a list of text.";
  const unknownSections = (t.sections as string[]).filter((s) => !KNOWN_SECTIONS.has(s));
  if (unknownSections.length > 0) {
    return `Unknown section(s): ${unknownSections.join(", ")}. Known sections: ${[...KNOWN_SECTIONS].sort().join(", ")}.`;
  }
  const p = t.palette;
  if (!p || typeof p !== "object") return "Palette is required.";
  const pal = p as Record<string, unknown>;
  if (
    !(
      typeof pal.bg === "string" && HEX.test(pal.bg) &&
      typeof pal.ink === "string" && HEX.test(pal.ink) &&
      typeof pal.accent === "string" && HEX.test(pal.accent) &&
      typeof pal.accentSoft === "string" && HEX.test(pal.accentSoft)
    )
  ) {
    return "Palette needs four #rrggbb colours.";
  }
  return null;
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
    const templateError = validateTemplate(body.template);
    if (templateError) {
      return bad(`Invalid template: ${templateError}`);
    }
    const template = body.template as TemplateMeta;
    // Access codes must be unique (case-insensitive) across templates:
    // two templates sharing a code would activate the same code to two
    // different themes, and findTemplateByAccessCodeHash returns the
    // first match. The template being edited may keep its own code.
    const clash = (await listTemplates()).find(
      (t) => t.id !== template.id && t.accessCode.trim().toUpperCase() === template.accessCode.trim().toUpperCase(),
    );
    if (clash) {
      return bad(`Access code “${template.accessCode.trim()}” is already used by the “${clash.name}” template. Each template needs its own code.`);
    }
    await saveTemplate(template);
    return NextResponse.json({ ok: true, id: template.id });
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
      // ...and it must not share the original's access code either: every
      // template has its own code, so the copy gets a fresh one.
      accessCode: generateAccessCode(),
      active: false,
      palette: { ...original.palette },
      sections: [...original.sections],
    };
    await saveTemplate(copy);
    return NextResponse.json({ ok: true, id: copy.id });
  }

  return bad(`Unknown action: ${action}.`);
}
