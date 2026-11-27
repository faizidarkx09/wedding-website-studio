// Sunflower Fields design tokens + small shared helpers.
//
// Sunflower yellow #FACC15 / deep leaf green #166534, warm cream
// #FFFBEB. NOT a palette swap of Golden Hour: the cover is a
// low-angle sunflower-field photograph with the names over the sky,
// the story is a horizontal FIELD ROW of photos on stems (not a
// grid of cards), details sit in solid sunflower-yellow BLOCKS,
// and the RSVP is a seed-packet card (not torn paper). Only the
// couple names / date / venue are data-driven (Partner A /
// Partner B placeholders — never a real couple).
//
// Fonts: inline fontFamily styles using the next/font CSS variables
// already loaded in layout (playfair / cormorant / great-vibes /
// lora) — this folder never touches globals.css, so no .sf-*
// classes exist there. FONT_* below are the single source of truth.
import type { DetailBlock, WeddingSite } from "@/lib/types";

export const SUNFLOWER = {
  yellow: "#FACC15",
  yellowDeep: "#EAB308",
  yellowPale: "#FEF9C3",
  yellowSoft: "#FEF08A",
  green: "#166534",
  greenDeep: "#14532D",
  greenSoft: "#15803D",
  cream: "#FFFBEB",
  creamSoft: "#FEF3C7",
  paper: "#FFFEF5",
  ink: "#14532D",
  white: "#FFFEF5",
} as const;

/** Inline font families (next/font vars from layout, Georgia/serif
 * fallbacks). Use style={{ fontFamily: FONT_DISPLAY }} etc. */
export const FONT_DISPLAY =
  "var(--font-playfair), Georgia, \"Times New Roman\", serif";
export const FONT_EDITORIAL =
  "var(--font-cormorant), Georgia, \"Times New Roman\", serif";
export const FONT_SCRIPT =
  "var(--font-great-vibes), \"Snell Roundhand\", cursive";
export const FONT_BODY =
  "var(--font-lora), Georgia, \"Times New Roman\", serif";

/** Fixed template artwork (AI-generated originals, optimized
 * progressive JPEG q80, max 1200px long side, each <=258 KB —
 * staged from ~/workspace/sunflower-fields-assets/optimized/).
 * The hero is a 1200x800 landscape crop of the top of the
 * low-angle field master (sky + tall flowers, so the cover names
 * sit over clear sky). The envelope photo is a cream V-flap
 * envelope with a sunflower wax seal and sunflowers along the
 * bottom edge (see SunflowerFieldsEnvelope for the measured
 * pocket geometry). The story photo is a couple from behind,
 * hand in hand down a field path. The seed-packet photo is a
 * blank-label packet on wood — no readable words anywhere. */
export const COVER_IMAGE_URL = "/images/themes/sunflower-fields.jpg";
export const DETAIL_IMAGE_URL = "/images/themes/sunflower-fields-detail.jpg";
export const ENVELOPE_IMAGE_URL = "/images/themes/sunflower-fields-detail.jpg";
export const STORY_FIELD_URL = "/images/themes/sunflower-fields/story-field.jpg";
export const SEED_PACKET_URL = "/images/themes/sunflower-fields/seed-packet.jpg";
/** The template's own couple photographs — AI-generated for
 * Sunflower Fields, used in the story in place of the Royal
 * Burgundy reuse. */
export const COUPLE_1_URL = "/images/themes/sunflower-fields-couple-1.jpg";
export const COUPLE_2_URL = "/images/themes/sunflower-fields-couple-2.jpg";
export const COUPLE_3_URL = "/images/themes/sunflower-fields-couple-3.jpg";
/** Palette-neutral shared-pool photos reused by path (never
 * re-generated) for the extra field-row frames. Kept for reference;
 * the story now uses the template's own couple photos. */
export const PHOTO_HANDS_URL = "/images/themes/royal-burgundy/photo-hands.jpg";
export const PHOTO_VEIL_URL = "/images/themes/royal-burgundy/photo-veil.jpg";
export const PHOTO_SUNSET_URL = "/images/themes/royal-burgundy/photo-sunset.jpg";
export const PHOTO_TOAST_URL = "/images/themes/royal-burgundy/photo-toast.jpg";
export const PHOTO_MEADOW_URL = "/images/themes/royal-burgundy/photo-meadow.jpg";

/** The template's own field photographs, in field-row order
 * (field path, then the three couple photos) — used as the
 * story-row fallback chrome when the buyer has not uploaded their
 * own photos yet (same pattern as ÉTERNEL's template hero
 * fallback). */
export const TEMPLATE_PHOTOS = [
  STORY_FIELD_URL,
  COUPLE_1_URL,
  COUPLE_2_URL,
  COUPLE_3_URL,
] as const;

/** Field-row captions (generic captions, not couple data). */
export const STORY_CAPTIONS = ["The Path", "First Hello", "The Walk", "Golden Hour"] as const;

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
 * defaults to the house menu. */
export function mealOptions(site: WeddingSite): string[] {
  const opts = (site.content.mealOptions ?? []).filter((o) => o.trim());
  if (opts.length > 0) return opts;
  return [
    "Herb-Crusted Filet Mignon",
    "Pan-Seared Sea Bass",
    "Wild Mushroom & Truffle Risotto (Vegetarian)",
    "Roasted Heirloom Vegetable Tart (Vegan)",
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
      return site.settings.showStory === true && storyParagraphs(site).length > 0;
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "gallery":
      // The field-row photos — the buyer's own photos. Template
      // photos never seed a buyer's gallery (design rule).
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
