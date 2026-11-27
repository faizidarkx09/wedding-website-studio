// Desert Dusk design tokens + small shared helpers.
//
// Terracotta #C2703D / sand #F5E6D3 / dusk purple #6B3A5C — NOT a
// palette swap of Golden Hour: the cover is a dune-HORIZON
// photograph (low horizon, big gradient sky, the names written in
// the sky itself, no crest disc); the story is a caravan ROUTE (a
// dotted path with stops, not photo cards); details sit in oasis
// arch cards; the RSVP is a sand-toned postcard. Only the couple
// names / date / venue are data-driven (Partner A / Partner B
// placeholders — never a real couple). The four template-palette
// colours (bg/ink/accent/accentSoft) also live in templates.ts so
// the Studio's design-tab overrides keep working — tokens here only
// ADD the extra Desert Dusk tones and the fixed asset paths.
import type { DetailBlock, WeddingSite } from "@/lib/types";

export const DUSK = {
  terra: "#C2703D",
  terraDeep: "#8A4A22",
  terraSoft: "#D9A05B",
  sand: "#F5E6D3",
  sandDeep: "#E8D3B3",
  cream: "#FFF8EC",
  paper: "#FFFDF6",
  dusk: "#6B3A5C",
  duskDeep: "#3D2133",
  duskSoft: "#9A6B8A",
  ink: "#3A2A20",
  inkSoft: "#5C4030",
  white: "#FFFDF9",
} as const;

/** Fixed template artwork (AI-generated originals, optimized
 * progressive JPEG q80, max 1200px long side, each <=258 KB —
 * staged from ~/workspace/desert-dusk-assets/masters/).
 * The hero and detail live at the template root; the rest under
 * desert-dusk/. The envelope photo is SEAL-FREE (the plain master)
 * so the sliding card never hides the seal — the gold sun seal is
 * a crop of the sealed master, used as the seal button below the
 * envelope (same pattern as Golden Hour's wax seal). */
export const COVER_IMAGE_URL = "/images/themes/desert-dusk.jpg";
export const DETAIL_IMAGE_URL = "/images/themes/desert-dusk-detail.jpg";
export const ENVELOPE_IMAGE_URL = "/images/themes/desert-dusk-detail.jpg";
export const SUN_SEAL_URL = "/images/themes/desert-dusk/sun-seal.jpg";
export const RSVP_POSTCARD_URL = "/images/themes/desert-dusk/rsvp-postcard.jpg";
export const STORY_DUNES_URL = "/images/themes/desert-dusk/story-dunes.jpg";
/** The template's own desert-sunset couple photos (AI-generated
 * originals, 1200px, staged from ~/workspace/desert-dusk-assets/
 * optimized/) — 1: walking the dune ridge, 2: close embrace,
 * 3: facing the setting sun. */
export const COUPLE_1_URL = "/images/themes/desert-dusk-couple-1.jpg";
export const COUPLE_2_URL = "/images/themes/desert-dusk-couple-2.jpg";
export const COUPLE_3_URL = "/images/themes/desert-dusk-couple-3.jpg";
/** The 5 neutral golden-hour couple photos from Royal Burgundy —
 * palette-neutral, reused by path (never re-generated). */
export const PHOTO_HANDS_URL = "/images/themes/royal-burgundy/photo-hands.jpg";
export const PHOTO_VEIL_URL = "/images/themes/royal-burgundy/photo-veil.jpg";
export const PHOTO_SUNSET_URL = "/images/themes/royal-burgundy/photo-sunset.jpg";
export const PHOTO_TOAST_URL = "/images/themes/royal-burgundy/photo-toast.jpg";
export const PHOTO_MEADOW_URL = "/images/themes/royal-burgundy/photo-meadow.jpg";

/** The template's own wedding photographs, in caravan-route order
 * (couple on the ridge, dunes, close embrace, facing the sun) —
 * used as the route-stop fallback chrome when the buyer has not
 * uploaded their own photos yet (same pattern as ÉTERNEL's template
 * hero fallback). */
export const TEMPLATE_PHOTOS = [
  COUPLE_1_URL,
  STORY_DUNES_URL,
  COUPLE_2_URL,
  COUPLE_3_URL,
] as const;

/** Caravan-route stop captions (generic captions, not couple data). */
export const ROUTE_CAPTIONS = ["First Hello", "The First Journey", "The Promise", "Golden Dusk"] as const;

/** Caravan-route stop lines — one short generic line per stop. */
export const ROUTE_LINES = [
  "A first hello neither of us expected.",
  "Side by side, across every dune since.",
  "A promise made under a desert sky.",
  "And now, a golden dusk to celebrate.",
] as const;

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

/** Live monogram for the cover, in "A&B" form — first letters
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
      // The story page needs the story text; the caravan-route
      // preview needs photos (see "gallery").
      return site.settings.showStory === true && storyParagraphs(site).length > 0;
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "gallery":
      // The route stops — the buyer's own photos. Template photos
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
