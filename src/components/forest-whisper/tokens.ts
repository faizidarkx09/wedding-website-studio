// Forest Whisper design tokens + small shared helpers.
//
// Deep forest #1B4332, moss #6A994E, cream #F4F1E6. NOT a palette
// swap of Emerald Royale or the samples: the cover is SPLIT-SCREEN
// (photo left ~55%, deep-green panel right with the names), the
// envelope is a leaf-seal envelope with a twine band, the story is
// ZIGZAG alternating rows (never photo cards, never a timeline),
// details are a "trail map" (a winding path with pinned stops), and
// the RSVP is a wooden signboard card (never torn paper, never a
// letter). Fireflies drift over the cover. Only the couple names /
// date / venue are data-driven (Partner A / Partner B placeholders
// — never a real couple). The four template-palette colours
// (bg/ink/accent/accentSoft) also live in templates.ts so the
// Studio's design-tab overrides keep working — tokens here only ADD
// the extra Forest Whisper tones and the fixed asset paths.
import type { DetailBlock, WeddingSite } from "@/lib/types";

export const FOREST = {
  deep: "#1B4332",
  deepSoft: "#14301F",
  pine: "#2D6A4F",
  moss: "#6A994E",
  mossSoft: "#A7C957",
  cream: "#F4F1E6",
  creamSoft: "#E7EAD9",
  paper: "#FBF9F1",
  bark: "#5C4033",
  twine: "#C8A97A",
  white: "#FDFCF7",
} as const;

/** Fixed template artwork (optimized progressive JPEG, staged from
 * ~/workspace/forest-whisper-assets/optimized/ — 4 files. Masters
 * are 1920px; optimized copies are downscaled to a max 1200px long
 * side at q80 so every file meets the <=258 KB cap — see
 * UPLOAD_MANIFEST.md).
 * The hero is the forest-trail couple photo (also the cover's left
 * panel). The detail/envelope image is a TIGHT CROP of the
 * flat-lay envelope master (x 26–76%, y 15–83% of the 1920x1280
 * master → 960x870): the crop keeps the whole envelope — flap apex
 * at ~(48%, 5%), body top edge at ~34%, body bottom at ~96% — with
 * only a linen margin around it, so the envelope container
 * (aspect-[32/29]) shows the envelope edge-to-edge with no
 * letterboxing. The envelope photo itself is seal-free and
 * twine-free: the leaf seal and the twine band are live HTML/SVG
 * (see ForestWhisperEnvelope), so the sliding card never hides
 * them. The RSVP signboard is a blank wooden board on a green wall
 * (measured: board spans x ~16.5–84%, y ~17.5–82% of the 1920x1280
 * image; the text column is sized to stay on the wood — see
 * ForestWhisperSections). */
export const COVER_IMAGE_URL = "/images/themes/forest-whisper.jpg";
export const DETAIL_IMAGE_URL = "/images/themes/forest-whisper-detail.jpg";
export const ENVELOPE_IMAGE_URL = "/images/themes/forest-whisper-detail.jpg";
export const SIGNBOARD_RSVP_URL = "/images/themes/forest-whisper-rsvp.jpg";
export const STORY_TRAIL_URL = "/images/themes/forest-whisper-story-1.jpg";
/** The 2 neutral Royal Burgundy meadow photo — palette-neutral,
 * reused by path (never re-generated). The dedicated hero
 * generation failed upstream (see assets notes), so the hero reuses
 * the trail-walk master and the second story photo is this meadow
 * (same reuse pattern as Golden Hour's Royal Burgundy photos). */
export const PHOTO_MEADOW_URL = "/images/themes/royal-burgundy/photo-meadow.jpg";

/** The template's own couple photographs — three AI-generated
 * forest scenes (misty trail walk, canopy portrait, golden-hour
 * clearing dance), staged from
 * ~/workspace/forest-whisper-assets/optimized/ as
 * public/images/themes/forest-whisper-couple-N.jpg. Used as the
 * story fallback when the buyer has not uploaded their own photos
 * yet (same pattern as ÉTERNEL's template hero fallback). */
export const COUPLE_PHOTO_1_URL = "/images/themes/forest-whisper-couple-1.jpg";
export const COUPLE_PHOTO_2_URL = "/images/themes/forest-whisper-couple-2.jpg";
export const COUPLE_PHOTO_3_URL = "/images/themes/forest-whisper-couple-3.jpg";

/** The template's own photographs, in zigzag order (trail walk,
 * canopy portrait, clearing dance) — used as the story fallback
 * when the buyer has not uploaded their own photos yet. */
export const TEMPLATE_PHOTOS = [COUPLE_PHOTO_1_URL, COUPLE_PHOTO_2_URL, COUPLE_PHOTO_3_URL] as const;

/** Zigzag row captions (generic captions, not couple data). */
export const STORY_CAPTIONS = ["The First Hello", "The Lantern Lit", "The Trail Ahead"] as const;

/** Server-side RSVP cap (matches POST /api/rsvp MAX_GUEST_COUNT). */
export const MAX_GUESTS_SERVER = 10;

/** Configured per-site guest cap (editor Settings tab), else server cap. */
export function maxGuests(site: WeddingSite): number {
  const configured = site.settings.rsvpMaxGuests;
  if (typeof configured === "number" && Number.isFinite(configured)) {
    return Math.min(MAX_GUESTS_SERVER, Math.max(1, Math.floor(configured)));
  }
  return MAX_GUESTS_SERVER;
}

/** Live monogram for the cover crest, in "A&B" form — first letters
 * of both partners joined with "&". */
export function initials(site: WeddingSite): string {
  const a = site.content.partnerA.trim().charAt(0);
  const b = site.content.partnerB.trim().charAt(0);
  return `${a}&${b}`.toUpperCase() || "W&W";
}

export function coupleNames(site: WeddingSite): string {
  return `${site.content.partnerA} & ${site.content.partnerB}`;
}

function ordinal(day: number): string {
  if (day >= 11 && day <= 13) return `${day}TH`;
  switch (day % 10) {
    case 1:
      return `${day}ST`;
    case 2:
      return `${day}ND`;
    case 3:
      return `${day}RD`;
    default:
      return `${day}TH`;
  }
}

/** "14TH SEPTEMBER 2027" — the dateDisplay format. Single source of
 * truth for the footer, the details header and the reply-by line. */
export function formatDateDisplay(dateIso: string, timezone: string): string {
  try {
    const d = new Date(dateIso);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(d);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    const day = Number(get("day"));
    return `${ordinal(day)} ${get("month").toUpperCase()} ${get("year")}`;
  } catch {
    return "";
  }
}

/** "14 SEPTEMBER 2027" — the envelope-card date label (no ordinal). */
export function formatCardDate(dateIso: string, timezone: string): string {
  try {
    const d = new Date(dateIso);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(d);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("day")} ${get("month").toUpperCase()} ${get("year")}`;
  } catch {
    return "";
  }
}

/** "YOUR TOWN, ST" — the envelope-card location label, derived from
 * the venue address (last two comma parts, uppercased); falls back to
 * the venue name. */
export function locationLabel(site: WeddingSite): string {
  const address = (site.content.venueAddress ?? "").trim();
  if (address) {
    const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
    const tail = parts.slice(-2).join(", ");
    if (tail) return tail.toUpperCase();
    return address.toUpperCase();
  }
  return (site.content.venueName ?? "").trim().toUpperCase();
}

/** "14 SEPTEMBER 2027 · Your Town, ST" — footer location line. */
export function footerLocation(site: WeddingSite): string {
  const loc = locationLabel(site);
  const date = formatDateDisplay(site.weddingDate, site.timezone);
  return loc ? `${date} · ${loc}` : date;
}

/** Venue lines for the countdown. The Studio's model has name +
 * address — render those two lines. */
export function venueLines(site: WeddingSite): string[] {
  return [site.content.venueName, site.content.venueAddress]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
}

export function formatLongDate(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateIso));
  } catch {
    return new Date(dateIso).toLocaleDateString("en-US");
  }
}

export function formatShortDate(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateIso));
  } catch {
    return "";
  }
}

/** RSVP reply-by line ("KINDLY REPLY BY 1ST JULY 2027"): the site's
 * configured deadline when set, else 60 days before the wedding. */
export function rsvpReplyBy(site: WeddingSite): string {
  const configured = site.settings.rsvpDeadline
    ? Date.parse(site.settings.rsvpDeadline)
    : NaN;
  const ms = !Number.isNaN(configured)
    ? configured
    : Date.parse(site.weddingDate) - 60 * 24 * 60 * 60 * 1000;
  if (Number.isNaN(ms)) return "";
  try {
    const d = new Date(ms);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: site.timezone,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(d);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `KINDLY REPLY BY ${ordinal(Number(get("day")))} ${get("month").toUpperCase()} ${get("year")}`;
  } catch {
    return "";
  }
}

/** Google Maps embed without an API key. */
export function mapsEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

/** Google Maps directions/search link (no API key). */
export function mapsLink(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function rsvpHref(site: WeddingSite): string {
  return site.slug.startsWith("preview-") ? "/activate" : `/w/${site.slug}/rsvp`;
}

export function isPreviewSite(site: WeddingSite): boolean {
  return site.slug.startsWith("preview-");
}

/** Story paragraphs — the Studio stores the story as one string;
 * paragraphs are joined with blank lines. */
export function storyParagraphs(site: WeddingSite): string[] {
  return (site.content.story ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Meal options for the RSVP form. Couple-editable via the editor;
 * defaults to the woodland house menu. */
export function mealOptions(site: WeddingSite): string[] {
  const opts = (site.content.mealOptions ?? []).filter((o) => o.trim());
  if (opts.length > 0) return opts;
  return [
    "Cedar-Plank Salmon",
    "Herb-Roasted Chicken",
    "Wild Mushroom & Truffle Risotto (Vegetarian)",
    "Roasted Garden Vegetable Tart (Vegan)",
    "Children’s Entrée",
  ];
}

export interface Accommodation {
  name: string;
  distance: string;
  note: string;
  code: string;
}

/** Accommodations live in the Studio's DetailBlocks (kind
 * "accommodation"). Body format written by the seed: first line =
 * distance, last "Booking Code:" line = code, the middle = note. */
export function accommodations(site: WeddingSite): Accommodation[] {
  return (site.content.details ?? [])
    .filter((d: DetailBlock) => d.kind === "accommodation" && !d.hidden && d.title.trim())
    .map((d: DetailBlock) => {
      const lines = d.body.split("\n").map((l) => l.trim()).filter(Boolean);
      const codeLine = lines.find((l) => /^booking code:/i.test(l));
      const code = codeLine ? codeLine.replace(/^booking code:/i, "").trim() : "";
      const rest = lines.filter((l) => l !== codeLine);
      return {
        name: d.title.trim(),
        distance: rest[0] ?? "",
        note: rest.slice(1).join(" "),
        code,
      };
    });
}

/** The site's own hero photo wins when the couple set one. Until then
 * (the default placeholder), use the theme's hero image. */
export function resolveHeroSrc(site: WeddingSite): string {
  return !site.content.heroImage || site.content.heroImage.includes("picsum.photos")
    ? (site.templateSnapshot.heroImage ?? site.content.heroImage)
    : site.content.heroImage;
}

/** Does this section actually render? Sections with no content never
 * render — a dead anchor is worse than no link. */
export function willRenderSection(site: WeddingSite, key: string): boolean {
  switch (key) {
    case "hero":
      return true;
    case "welcome":
      return (site.content.welcome ?? "").trim().length > 0;
    case "story":
      // The story page needs the story text; the zigzag preview
      // needs photos (see "gallery").
      return site.settings.showStory === true && storyParagraphs(site).length > 0;
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "gallery":
      // The zigzag rows — the buyer's own photos. Template photos
      // never seed a buyer's gallery (design rule).
      return site.settings.showGallery === true && site.gallery.length > 0;
    case "countdown":
      return site.settings.showCountdown === true && site.settings.countdownEnabled === true;
    case "dress-code":
      return site.settings.showDressCode === true && site.content.dressCode.trim().length > 0;
    case "rsvp":
      return site.settings.rsvpEnabled === true;
    default:
      return false;
  }
}
