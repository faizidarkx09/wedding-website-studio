// Shared types for Wedding Website Studio (PRD v1.0).
// One shared rendering engine, many tenant-isolated wedding sites.

export type TemplateId =
  | "the-editorial"
  | "the-romance"
  | "the-modern"
  | "the-countryside"
  | "the-classic";

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
  palette: { bg: string; ink: string; accent: string; accentSoft: string };
  fontClass: string;
  layout: string;
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
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
}

export interface SiteContent {
  partnerA: string;
  partnerB: string;
  subtitle: string;
  welcome: string;
  story: string;
  dressCode: string;
  footerMessage: string;
  heroImage: string;
  venueName: string;
  venueAddress: string;
  mapLink: string;
  postWeddingMessage: string;
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
  showStory: boolean;
  showGallery: boolean;
  showEvents: boolean;
  showDressCode: boolean;
  showCountdown: boolean;
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

export interface AccessCode {
  id: string;
  /** Null for codes not tied to an order (e.g. the demo code). */
  orderId: string | null;
  siteId: string;
  /** SHA-256 hex of the code. The plain code is never stored. */
  codeHash: string;
  status: "active" | "used" | "revoked" | "expired";
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface GuestRecord {
  id: string;
  siteId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  rsvpId: string | null;
}
