// Shared types for Wedding Website Studio (PRD v1.0).
// One shared rendering engine, many tenant-isolated wedding sites.

// Template ids are free-form slugs chosen when a template is created
// (e.g. "champagne-elegance"). The catalogue holds the six launch themes
// from the Premium Design System spec v1.0; new templates are added from
// the admin panel (Admin → Templates → New template).
export type TemplateId = string;

/** Composition key — which art direction a template uses. Free-form so
 * future templates can add their own; the renderer falls back to the
 * generic "classic" presentation for unknown keys. */
export type Composition = string;

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  priceUsd: number;
  etsyListingId: string | null;
  active: boolean;
  /**
   * Fixed access code for this template, baked into source so it never
   * changes across deploys. Every buyer of this template gets the SAME
   * PDF and the SAME code — but activating it creates a brand-new private
   * site just for that buyer. The code is public by design (it ships in
   * the Etsy delivery PDF); it only gates site creation, never access to
   * an existing site.
   */
  accessCode: string;
  /**
   * AI-generated hero image for this template, served from
   * `/images/themes/<id>.jpg` (original artwork, generated for this
   * theme). Optional — templates created in the admin panel may not
   * have one; the renderer and cards fall back to the site's own hero
   * image / palette colour block when it is missing.
   */
  heroImage?: string;
  palette: { bg: string; ink: string; accent: string; accentSoft: string };
  fontClass: string;
  layout: string;
  /** Art-direction key (e.g. "champagne", "midnight") — drives the
   * renderer's per-theme hero, divider, timeline, gallery and motion. */
  composition: Composition;
  sections: string[];
}

export interface SiteEvent {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "4:00 PM"
  venue: string;
  address: string;
  description: string;
  /** Optional event photo URL (ÉTERNEL event blocks). */
  photo?: string;
  /** Optional directions link (e.g. Google Maps URL). */
  directionsUrl?: string;
}

/** One relationship milestone for the Our Story timeline (ÉTERNEL).
 * Optional so older sites (without milestones) still parse — the
 * renderer falls back to the single `story` text when none are set. */
export interface StoryMilestone {
  id: string;
  /** Display date, e.g. "June 2019" — free text, shown as written. */
  date: string;
  title: string;
  text: string;
  /** Optional milestone photo URL. */
  image?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

/** One optional "Details" block (venue, travel, accommodation, dress
 * code, parking, accessibility, gift registry, guest notes). Blocks with
 * `hidden` set, or with no title and no body, are never shown publicly. */
export type DetailKind =
  | "venue"
  | "travel"
  | "accommodation"
  | "dress"
  | "parking"
  | "accessibility"
  | "registry"
  | "notes";

export interface DetailBlock {
  id: string;
  kind: DetailKind;
  title: string;
  body: string;
  /** Optional external link (e.g. registry URL, directions). */
  linkLabel?: string;
  linkUrl?: string;
  hidden: boolean;
}

/** One FAQ entry, shown in the accordion. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  partnerA: string;
  partnerB: string;
  subtitle: string;
  welcome: string;
  /** Invitation section text ("Together with their families, …"). */
  invitationText: string;
  story: string;
  /** ÉTERNEL story timeline milestones (4 by default). When empty or
   * unset, the renderer shows the single `story` text instead. */
  storyMilestones?: StoryMilestone[];
  /** The Sacred Garden tagline (Imperial Script, gold) shown above
   * the welcome paragraph. Optional — empty hides the line. */
  tagline?: string;
  /** The Sacred Garden gift-preference text. Optional — when empty
   * the gift notice is hidden. */
  giftText?: string;
  /** The Sacred Garden venue photo URL. Optional — shown above the
   * map when set. */
  venueImage?: string;
  dressCode: string;
  footerMessage: string;
  heroImage: string;
  venueName: string;
  venueAddress: string;
  mapLink: string;
  postWeddingMessage: string;
  /** Optional details blocks (shown in template "details" order). */
  details: DetailBlock[];
  /** FAQ entries, in display order. */
  faqs: FaqItem[];
}

export interface SiteDesign {
  primary: string;
  accent: string;
  background: string;
  headingFont: string;
  bodyFont: string;
  galleryLayout: "grid" | "masonry" | "carousel";
}

export interface RsvpQuestion {
  id: string;
  label: string;
  type: "text" | "choice";
  required: boolean;
  options?: string[];
}

export interface SiteSettings {
  passwordEnabled: boolean;
  passwordHash: string | null;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null; // ISO datetime
  timezone: string;
  countdownEnabled: boolean;
  countdownStyle: "classic" | "minimal" | "bold";
  /** Optional background-music URL (ÉTERNEL music toggle). Null/empty
   * means the template default track. */
  musicUrl?: string | null;
  /** Max guests one RSVP may cover (ÉTERNEL). Null/empty means the
   * server cap of 10. */
  rsvpMaxGuests?: number | null;
  showStory: boolean;
  showGallery: boolean;
  showEvents: boolean;
  showDressCode: boolean;
  showCountdown: boolean;
  showInvitation: boolean;
  showDetails: boolean;
  showFaq: boolean;
}

export type SiteStatus = "draft" | "published" | "unpublished" | "suspended" | "archived";

export interface WeddingSite {
  id: string;
  slug: string;
  templateId: TemplateId;
  /** Snapshot of the template config at creation time — later template
   *  edits must never silently change a purchased customer's site. */
  templateSnapshot: TemplateMeta;
  ownerName: string;
  ownerEmail: string;
  status: SiteStatus;
  weddingDate: string; // ISO datetime
  timezone: string;
  content: SiteContent;
  design: SiteDesign;
  events: SiteEvent[];
  gallery: GalleryImage[];
  customQuestions: RsvpQuestion[];
  settings: SiteSettings;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface RsvpResponse {
  id: string;
  siteId: string;
  guestName: string;
  email: string;
  phone: string;
  attending: boolean;
  guestCount: number;
  dietary: string;
  allergies: string;
  message: string;
  answers: Record<string, string>;
  updateToken: string;
  status: "attending" | "declined" | "updated";
  submittedAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
}
