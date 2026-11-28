// Eternal Moment design tokens + small shared helpers.
//
// The Wedding Experience port — warm ivory #F8F5EF, cream #EFE9DE,
// espresso ink #24221F, soft stone #77716A, antique gold #B69A70 and
// sage #A5AA95 on paper #FFFEFC. Cormorant Garamond display serif,
// Manrope body, system mono for the small-caps labels (DM Mono is
// not loaded by the Studio layout, so the mono role falls back to
// the ui-monospace stack).
//
// Single scrolling page, hero first — no intro screen, no opening
// ceremony of any kind (see EternalMomentRenderer). Only the couple
// names / date / venue / story / events / gallery are data-driven
// (Partner A / Partner B placeholders — never a real couple).
// The five dress-code swatches are the template's own palette;
// the couple's dress-code text (site.content.dressCode) is the
// section intro, and any kind:"dress" detail blocks render below
// the swatches.
import type { DetailBlock, StoryMilestone, WeddingSite } from "@/lib/types";

export const ETERNAL = {
  ivory: "#F8F5EF",
  cream: "#EFE9DE",
  espresso: "#24221F",
  stone: "#77716A",
  gold: "#B69A70",
  goldDeep: "#8C6F4D",
  sage: "#A5AA95",
  paper: "#FFFEFC",
  champagne: "#D9C29A",
  mocha: "#6B4F3A",
  softGold: "#B69A70",
} as const;

/** Tailwind v4 variable-font utilities (next/font variables are on
 * <html> via the Studio layout). DM Mono is not loaded there, so the
 * mono role uses the Tailwind font-mono stack. */
export const FONT_DISPLAY = "font-(--font-cormorant)";
export const FONT_BODY = "font-(--font-manrope)";

/** Fixed template artwork — the source design's stand-in photos,
 * downloaded to local files (all <=258 KB, progressive JPEG).
 * The hero lives at the template root; the rest under
 * eternal-moment/. Gallery 01–07 and 12 are hard links to the
 * hero / story / event files (same photo, no extra bytes). */
export const COVER_IMAGE_URL = "/images/themes/eternal-moment.jpg";
export const HERO_IMAGE_URL = "/images/themes/eternal-moment/hero.jpg";
export const VENUE_IMAGE_URL = "/images/themes/eternal-moment/venue.jpg";
export const STORY_MET_URL = "/images/themes/eternal-moment/story-met.jpg";
export const STORY_ADVENTURE_URL = "/images/themes/eternal-moment/story-adventure.jpg";
export const STORY_PROPOSAL_URL = "/images/themes/eternal-moment/story-proposal.jpg";
export const STORY_FOREVER_URL = "/images/themes/eternal-moment/story-forever.jpg";
export const EVENT_REHEARSAL_URL = "/images/themes/eternal-moment/event-rehearsal.jpg";
export const EVENT_WELCOME_URL = "/images/themes/eternal-moment/event-welcome.jpg";
export const EVENT_CEREMONY_URL = "/images/themes/eternal-moment/event-ceremony.jpg";
export const EVENT_COCKTAIL_URL = "/images/themes/eternal-moment/event-cocktail.jpg";
export const EVENT_RECEPTION_URL = "/images/themes/eternal-moment/event-reception.jpg";
export const EVENT_BRUNCH_URL = "/images/themes/eternal-moment/event-brunch.jpg";

/** The template's own story photos, in chapter order — the fallback
 * images when the site has story text but no milestone photos. */
export const TEMPLATE_STORY_PHOTOS = [
  STORY_MET_URL,
  STORY_ADVENTURE_URL,
  STORY_PROPOSAL_URL,
  STORY_FOREVER_URL,
] as const;

/** The template's own event photos, in event order — the fallback
 * image for an event with no photo of its own. */
export const TEMPLATE_EVENT_PHOTOS = [
  EVENT_REHEARSAL_URL,
  EVENT_WELCOME_URL,
  EVENT_CEREMONY_URL,
  EVENT_COCKTAIL_URL,
  EVENT_RECEPTION_URL,
  EVENT_BRUNCH_URL,
] as const;

/** The template's 12-photo gallery, in source order — used only as
 * the template-preview gallery seed (never seeded into a buyer's
 * own gallery; a buyer's gallery is their own photos). */
export const TEMPLATE_GALLERY_PHOTOS = [
  "/images/themes/eternal-moment/gallery-01.jpg",
  "/images/themes/eternal-moment/gallery-02.jpg",
  "/images/themes/eternal-moment/gallery-03.jpg",
  "/images/themes/eternal-moment/gallery-04.jpg",
  "/images/themes/eternal-moment/gallery-05.jpg",
  "/images/themes/eternal-moment/gallery-06.jpg",
  "/images/themes/eternal-moment/gallery-07.jpg",
  "/images/themes/eternal-moment/gallery-08.jpg",
  "/images/themes/eternal-moment/gallery-09.jpg",
  "/images/themes/eternal-moment/gallery-10.jpg",
  "/images/themes/eternal-moment/gallery-11.jpg",
  "/images/themes/eternal-moment/gallery-12.jpg",
] as const;

/** The five dress-code swatches — the template's own palette.
 * Guidance lines are generic template copy (which colours pair
 * with what), never the couple's own words. */
export interface DressSwatch {
  id: string;
  name: string;
  hex: string;
  textOn: string;
  guidance: string;
}

export const DRESS_SWATCHES: DressSwatch[] = [
  {
    id: "champagne",
    name: "Champagne",
    hex: "#D9C29A",
    textOn: "#24221F",
    guidance: "Warm and luminous — pairs with gold jewellery and metallic shoes.",
  },
  {
    id: "sage",
    name: "Sage",
    hex: "#A5AA95",
    textOn: "#24221F",
    guidance: "Soft green-grey — calm against gold, and kind to the lawns.",
  },
  {
    id: "ivory",
    name: "Ivory",
    hex: "#FFFEFC",
    textOn: "#24221F",
    guidance: "Pure and classic — best layered with champagne or sage.",
  },
  {
    id: "mocha",
    name: "Mocha",
    hex: "#6B4F3A",
    textOn: "#FFFEFC",
    guidance: "Deep, warm brown — the grounding note, beautiful after dark.",
  },
  {
    id: "soft-gold",
    name: "Soft Gold",
    hex: "#B69A70",
    textOn: "#24221F",
    guidance: "Our signature — a muted, antique gold, never brassy.",
  },
];

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

/** Live monogram for the hero ring, in "A&B" form — first letters
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

/** "04TH JULY 2027" — the dateDisplay format. Single source of
 * truth for the hero date line, the footer and the reply-by line. */
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

/** "4 JULY 2027" — the hero date label (no ordinal). */
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

/** "Sunday, 4 July 2027" — long date for the hero + footer. */
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

/** "Saturday, 4 July 2027 · 6:00 PM" — hero date + time line. */
export function formatDateTime(dateIso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateIso));
  } catch {
    return formatLongDate(dateIso, timezone);
  }
}

/** "Sunday, 4 July 2027" — an event's YYYY-MM-DD date. */
export function formatEventDate(date: string): string {
  const parsed = Date.parse(`${date}T12:00:00`);
  if (Number.isNaN(parsed)) return date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(parsed));
}

/** "City, ST" — the footer location label, derived from the venue
 * address (last two comma parts, uppercased); falls back to the
 * venue name. */
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

/** "04TH JULY 2027 · City, ST" — footer location line. */
export function footerLocation(site: WeddingSite): string {
  const loc = locationLabel(site);
  const date = formatDateDisplay(site.weddingDate, site.timezone);
  return loc ? `${date} · ${loc}` : date;
}

/** Venue lines for the hero. The Studio's model has name +
 * address — render those two lines. */
export function venueLines(site: WeddingSite): string[] {
  return [site.content.venueName, site.content.venueAddress]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);
}

/** RSVP reply-by line ("KINDLY REPLY BY 4TH DECEMBER 2026"): the
 * site's configured deadline when set, else 60 days before the
 * wedding. */
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

/** The four story chapters. The seed writes them as
 * site.content.storyMilestones (date / title / text / image); when
 * a site has none, the story paragraphs become numbered chapters
 * with the template's story photos, so the chapter layout never
 * renders empty. */
export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  date: string;
  text: string;
  image: string;
  imageAlt: string;
}

export function storyChapters(site: WeddingSite): StoryChapter[] {
  const milestones: StoryMilestone[] = (site.content.storyMilestones ?? []).filter(
    (m) => m.title.trim() || m.text.trim(),
  );
  if (milestones.length > 0) {
    return milestones.slice(0, 4).map((m, i) => ({
      id: m.id || `chapter-${i + 1}`,
      number: String(i + 1).padStart(2, "0"),
      title: m.title.trim(),
      date: m.date.trim(),
      text: m.text.trim(),
      image: (m.image ?? "").trim() || TEMPLATE_STORY_PHOTOS[i] || TEMPLATE_STORY_PHOTOS[0],
      imageAlt: m.title.trim() ? `${m.title.trim()} — chapter ${i + 1}` : `Story chapter ${i + 1}`,
    }));
  }
  return storyParagraphs(site)
    .slice(0, 4)
    .map((text, i) => ({
      id: `chapter-${i + 1}`,
      number: String(i + 1).padStart(2, "0"),
      title: "",
      date: "",
      text,
      image: TEMPLATE_STORY_PHOTOS[i] || TEMPLATE_STORY_PHOTOS[0],
      imageAlt: `Story chapter ${i + 1}`,
    }));
}

/** Dress-code detail blocks (kind "dress") — extra notes the couple
 * wrote in the editor, shown under the swatches. */
export function dressCodeNotes(site: WeddingSite): DetailBlock[] {
  return (site.content.details ?? []).filter(
    (b) => !b.hidden && b.kind === "dress" && (b.title.trim() || b.body.trim()),
  );
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
      return site.settings.showStory === true && storyChapters(site).length > 0;
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "gallery":
      // The buyer's own photos. Template photos never seed a buyer's
      // gallery (design rule) — the preview seed supplies them.
      return site.settings.showGallery === true && site.gallery.length > 0;
    case "countdown":
      return site.settings.showCountdown === true && site.settings.countdownEnabled === true;
    case "dress-code":
      return (
        site.settings.showDressCode === true &&
        (site.content.dressCode.trim().length > 0 || dressCodeNotes(site).length > 0)
      );
    case "rsvp":
      return site.settings.rsvpEnabled === true;
    default:
      return false;
  }
}
