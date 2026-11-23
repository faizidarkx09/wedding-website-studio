"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import type { DetailBlock, WeddingSite } from "@/lib/types";
import Countdown from "./Countdown";
import EnvelopeIntro from "./EnvelopeIntro";
import Reveal from "./Reveal";
import EternelRenderer from "./eternel/EternelRenderer";
import BlossomRenderer from "./blossom/BlossomRenderer";
import SacredGardenRenderer from "./sacred-garden/SacredGardenRenderer";
import DolceVitaRenderer from "./dolce-vita/DolceVitaRenderer";

interface SiteRendererProps {
  site: WeddingSite;
  /** Preview renders bypass the published-only gate (template previews). */
  preview?: boolean;
  /**
   * Show the envelope intro ("Click to open") as the first screen.
   * True on public wedding sites and template previews; false in the
   * editor live preview (the envelope would block editing there).
   */
  envelope?: boolean;
}

/** Clean "not available" page shared by the renderer and the /w routes. */
export function SiteUnavailable({ message }: { message?: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-stone-500">
        Wedding Website Studio
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-900 sm:text-4xl">
        This wedding website is not available
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-stone-600">
        {message ??
          "This site may still be a draft, or it may have been unpublished by the couple. Please check the link and try again, or ask the couple for the correct address."}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
      >
        Back to Wedding Website Studio
      </Link>
    </main>
  );
}

function formatDate(dateIso: string, timezone: string): string {
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

function formatEventDate(date: string): string {
  const parsed = Date.parse(`${date}T12:00:00`);
  if (Number.isNaN(parsed)) return date;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(parsed));
}

/* ---------- presentation (composition-driven) ---------- */

// The design comes from the site's own template snapshot (palette +
// composition key) — never from a hardcoded template id. Each composition
// ("champagne", "blue", "midnight", "sage", "mediterranean", "lavender")
// gets its own hero, divider, timeline, gallery and motion treatment.
// Unknown compositions fall back to the generic "classic" presentation.

function composition(site: WeddingSite): string {
  return site.templateSnapshot.composition || "classic";
}

/* ---------- design-tab overrides (editor saves site.design.*) ---------- */

// The editor's Design tab saves colours / fonts / gallery layout on
// site.design, seeded at creation from the template palette. Colours apply
// whenever set (the seed equals the template palette, so untouched sites
// look identical); fonts and gallery layout apply only when the couple
// actually changed them from the creation defaults, so untouched sites
// keep the theme's own display serif and per-theme gallery treatment.
const DEFAULT_HEADING_FONT = "Georgia, serif";
const DEFAULT_BODY_FONT = "system-ui, sans-serif";

function effectivePalette(site: WeddingSite): {
  bg: string;
  ink: string;
  accent: string;
  accentSoft: string;
} {
  const tpl = site.templateSnapshot.palette;
  const d = site.design;
  return {
    bg: d?.background?.trim() ? d.background : tpl.bg,
    ink: d?.primary?.trim() ? d.primary : tpl.ink,
    accent: d?.accent?.trim() ? d.accent : tpl.accent,
    accentSoft: tpl.accentSoft,
  };
}

/** Site with the template palette replaced by the design-tab palette, so
 * every section that reads site.templateSnapshot.palette honours it. */
function withDesign(site: WeddingSite): WeddingSite {
  return {
    ...site,
    templateSnapshot: { ...site.templateSnapshot, palette: effectivePalette(site) },
  };
}

function headingFontOverride(site: WeddingSite): string | undefined {
  const f = site.design?.headingFont?.trim();
  return f && f !== DEFAULT_HEADING_FONT ? f : undefined;
}

function bodyFontOverride(site: WeddingSite): string | undefined {
  const f = site.design?.bodyFont?.trim();
  return f && f !== DEFAULT_BODY_FONT ? f : undefined;
}

function initials(site: WeddingSite): string {
  const a = site.content.partnerA.trim().charAt(0);
  const b = site.content.partnerB.trim().charAt(0);
  return `${a}${b}`.toUpperCase() || "W";
}

/** Activate page used by template previews.
 * Preview sites (slug "preview-<template>") are never saved to the store,
 * so /w/preview-<template>/rsvp would render SiteUnavailable. Point their
 * RSVP buttons at the activate page instead, where a buyer with a template
 * code can create their own site and try the RSVP form there. Real sites
 * keep their own slug. */
export const PREVIEW_RSVP_HREF = "/activate";

function rsvpHref(site: WeddingSite): string {
  return site.slug.startsWith("preview-") ? PREVIEW_RSVP_HREF : `/w/${site.slug}/rsvp`;
}

function isPreviewSite(site: WeddingSite): boolean {
  return site.slug.startsWith("preview-");
}

/** Small note shown under RSVP buttons on template previews only. */
function PreviewRsvpNote() {
  return (
    <p className="mt-3 text-xs opacity-70">
      Preview — activate a template code to try the RSVP form on your own site.
    </p>
  );
}

/* ---------- theme ornaments (original SVG/CSS, no copied assets) ---------- */

/** Per-composition section divider. */
function ThemeDivider({ comp, className }: { comp: string; className?: string }) {
  const color = "currentColor";
  if (comp === "blue") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 12" className={`mx-auto mt-3 block h-3 w-28 ${className ?? ""}`}>
        <path d="M0 6 Q 15 1, 30 6 T 60 6 T 90 6 T 120 6" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    );
  }
  if (comp === "sage") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 24" className={`mx-auto mt-3 block h-6 w-28 ${className ?? ""}`}>
        <path d="M8 12 H46 M74 12 H112" stroke={color} strokeWidth="1" />
        <path
          className="sig-sage-draw"
          d="M60 12 C 54 4, 46 5, 47 12 C 52 14, 58 14, 60 12 Z M60 12 C 66 4, 74 5, 73 12 C 68 14, 62 14, 60 12 Z"
          fill="none"
          stroke={color}
          strokeWidth="1"
        />
      </svg>
    );
  }
  if (comp === "midnight") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 12" className={`mx-auto mt-3 block h-3 w-28 ${className ?? ""}`}>
        <path d="M8 6 H48 M72 6 H112" stroke={color} strokeWidth="1" />
        <circle cx="60" cy="6" r="4" fill={color} />
      </svg>
    );
  }
  if (comp === "mediterranean") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 24" className={`mx-auto mt-3 block h-6 w-28 ${className ?? ""}`}>
        <path d="M8 20 H44 M76 20 H112" stroke={color} strokeWidth="1" />
        <path d="M50 20 V12 A10 10 0 0 1 70 20 Z" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    );
  }
  if (comp === "lavender") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 12" className={`mx-auto mt-3 block h-3 w-28 ${className ?? ""}`}>
        <path d="M8 6 H44 M76 6 H112" stroke={color} strokeWidth="1" />
        <circle cx="54" cy="6" r="2" fill={color} />
        <circle cx="60" cy="6" r="2.5" fill={color} />
        <circle cx="66" cy="6" r="2" fill={color} />
      </svg>
    );
  }
  if (comp === "champagne") {
    return (
      <svg aria-hidden="true" viewBox="0 0 120 12" className={`mx-auto mt-3 block h-3 w-28 ${className ?? ""}`}>
        <path d="M8 6 H50 M70 6 H112" stroke={color} strokeWidth="1" />
        <rect x="56" y="2" width="8" height="8" transform="rotate(45 60 6)" fill="none" stroke={color} strokeWidth="1" />
      </svg>
    );
  }
  return <span aria-hidden="true" className="mx-auto mt-3 block h-px w-16 bg-current opacity-40" />;
}

/** Wax-seal ornament (Midnight Romance): initials inside a brass ring. */
function WaxSeal({ site }: { site: WeddingSite }) {
  return (
    <div
      aria-hidden="true"
      className="sig-midnight mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 text-lg font-bold"
      style={{ borderColor: "#B08B56", backgroundColor: "#6E263B", color: "#F1E8DA" }}
    >
      {initials(site)}
    </div>
  );
}

function headingClass(): string {
  return "text-xs font-semibold uppercase tracking-[0.3em]";
}

function SectionHeading({
  site,
  title,
  intro,
}: {
  site: WeddingSite;
  title: string;
  intro?: string;
}) {
  const comp = composition(site);
  return (
    <div className="text-center">
      <h2 className={headingClass()} style={{ color: site.templateSnapshot.palette.accent }}>
        {title}
      </h2>
      <ThemeDivider comp={comp} />
      {intro ? <p className="mx-auto mt-3 max-w-xl leading-relaxed opacity-80">{intro}</p> : null}
    </div>
  );
}

function sectionSpacing(): string {
  return "py-16 sm:py-20";
}

function PrimaryButton({ site, href, children }: { site: WeddingSite; href: string; children: React.ReactNode }) {
  const comp = composition(site);
  const shape =
    comp === "champagne"
      ? "rounded-none uppercase tracking-[0.15em]"
      : comp === "mediterranean"
        ? "rounded-md"
        : comp === "sage"
          ? "rounded-lg"
          : "rounded-full";
  const bg = comp === "midnight" ? "#6E263B" : site.templateSnapshot.palette.accent;
  return (
    <Link
      href={href}
      className={`inline-block px-9 py-3.5 text-sm font-bold text-white transition hover:opacity-85 ${shape}`}
      style={{ backgroundColor: bg }}
    >
      {children}
    </Link>
  );
}

/* ---------- sections ---------- */

/**
 * Hero image with a graceful fallback: if the image file is missing
 * (e.g. a theme image not yet uploaded), render a palette-gradient
 * panel with the couple's monogram instead — never a broken image.
 */
function HeroImage({
  site,
  src,
  alt,
  className,
}: {
  site: WeddingSite;
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          background: `linear-gradient(150deg, ${site.templateSnapshot.palette.accentSoft}, ${site.templateSnapshot.palette.bg})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="text-6xl font-bold opacity-40"
          style={{ color: site.templateSnapshot.palette.accent }}
        >
          {initials(site)}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading="eager" onError={() => setFailed(true)} />
  );
}

function Hero({ site }: { site: WeddingSite }) {
  const { content, templateSnapshot: tpl } = site;
  const comp = composition(site);
  const names = `${content.partnerA} & ${content.partnerB}`;
  const dateLine = formatDate(site.weddingDate, site.timezone);

  // The site's own hero photo wins when the couple set one. Until then
  // (the default placeholder), use the theme's AI-generated hero image.
  const heroSrc =
    !content.heroImage || content.heroImage.includes("picsum.photos")
      ? (site.templateSnapshot.heroImage ?? content.heroImage)
      : content.heroImage;

  const rsvpCta = (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <PrimaryButton site={site} href={rsvpHref(site)}>
        RSVP
      </PrimaryButton>
      <Link
        href="#details"
        className="inline-block px-6 py-3.5 text-sm font-semibold transition hover:opacity-75"
        style={{ color: tpl.palette.accent }}
      >
        View details →
      </Link>
    </div>
  );

  // Midnight: dark full-screen photo, ivory names, burgundy date detail.
  if (comp === "midnight") {
    return (
      <section className="relative w-full overflow-hidden text-center">
        <HeroImage
          site={site}
          src={heroSrc}
          alt={`${names} — wedding photo`}
          className="hero-img-midnight aspect-[4/5] w-full object-cover sm:aspect-[16/9]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 px-5 py-16 text-[#F1E8DA]">
          <div className="hero-enter">
            <WaxSeal site={site} />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#B08B56]">
              {content.subtitle}
            </p>
            <h1 className="mt-4 text-5xl leading-tight sm:text-7xl">
              {content.partnerA} <span className="text-[#B08B56]">&amp;</span> {content.partnerB}
            </h1>
            <p className="mt-5 inline-block rounded-full px-5 py-2 text-sm font-semibold" style={{ backgroundColor: "#6E263B" }}>
              {dateLine}
            </p>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed opacity-90">{content.welcome}</p>
            {rsvpCta}
          </div>
        </div>
      </section>
    );
  }

  // Blue Serenity: wide image first, then a pale-blue title block.
  if (comp === "blue") {
    return (
      <section className="w-full text-center">
        <HeroImage
          site={site}
          src={heroSrc}
          alt={`${names} — wedding photo`}
          className="aspect-[21/9] w-full object-cover"
        />
        <div className="sig-blue mx-auto -mt-10 w-full max-w-3xl px-5 py-10 sm:px-8" style={{ backgroundColor: tpl.palette.accentSoft }}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: tpl.palette.accent }}>
            {content.subtitle}
          </p>
          <h1 className="mt-4 text-5xl leading-tight sm:text-7xl">
            {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
          </h1>
          <ThemeDivider comp={comp} />
          <p className="mt-5 text-lg sm:text-xl">{dateLine}</p>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed opacity-85">{content.welcome}</p>
          {rsvpCta}
        </div>
      </section>
    );
  }

  // Mediterranean: arch-framed image with bold names below.
  if (comp === "mediterranean") {
    return (
      <section className="mx-auto w-full max-w-5xl px-5 pt-12 pb-14 text-center sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: tpl.palette.accent }}>
          {content.subtitle}
        </p>
        <div className="sig-mediterranean mx-auto mt-8 w-full max-w-md">
          <HeroImage
            site={site}
            src={heroSrc}
            alt={`${names} — wedding photo`}
            className="arch-frame aspect-[3/4] w-full object-cover"
          />
        </div>
        <h1 className="hero-enter mt-8 text-5xl leading-tight font-bold sm:text-7xl">
          {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
        </h1>
        <ThemeDivider comp={comp} />
        <p className="mt-5 text-lg font-semibold sm:text-xl">{dateLine}</p>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed opacity-85">{content.welcome}</p>
        {rsvpCta}
      </section>
    );
  }

  // Sage: botanical-framed portrait.
  if (comp === "sage") {
    return (
      <section className="mx-auto w-full max-w-5xl px-5 pt-12 pb-14 text-center sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: tpl.palette.accent }}>
          {content.subtitle}
        </p>
        <h1 className="hero-enter mt-4 text-5xl leading-tight sm:text-7xl">
          {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
        </h1>
        <ThemeDivider comp={comp} />
        <p className="mt-5 text-lg sm:text-xl">{dateLine}</p>
        <div className="mx-auto mt-8 w-full max-w-3xl" style={{ color: tpl.palette.accent }}>
          <HeroImage
            site={site}
            src={heroSrc}
            alt={`${names} — wedding photo`}
            className="frame-sage aspect-[16/10] w-full object-cover"
          />
        </div>
        <p className="mx-auto mt-8 max-w-2xl leading-relaxed opacity-85">{content.welcome}</p>
        {rsvpCta}
      </section>
    );
  }

  // Lavender: pearl hero with a framed portrait inside a translucent card.
  if (comp === "lavender") {
    return (
      <section className="mx-auto w-full max-w-5xl px-5 pt-12 pb-14 text-center sm:pt-16">
        <div className="sig-lavender mx-auto w-full max-w-3xl rounded-2xl bg-white/60 px-5 py-10 shadow-sm sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: tpl.palette.accent }}>
            {content.subtitle}
          </p>
          <h1 className="mt-4 text-5xl leading-tight sm:text-7xl">
            {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
          </h1>
          <ThemeDivider comp={comp} />
          <p className="mt-5 text-lg sm:text-xl">{dateLine}</p>
          <div className="mx-auto mt-8 w-full max-w-xl" style={{ color: tpl.palette.accent }}>
            <HeroImage
              site={site}
              src={heroSrc}
              alt={`${names} — wedding photo`}
              className="frame-lavender aspect-[4/3] w-full object-cover"
            />
          </div>
          <p className="mx-auto mt-8 max-w-2xl leading-relaxed opacity-85">{content.welcome}</p>
          {rsvpCta}
        </div>
      </section>
    );
  }

  // Champagne + classic: framed portrait, centred names, thin rules.
  return (
    <section className="mx-auto w-full max-w-5xl px-5 pt-12 pb-14 text-center sm:pt-16">
      <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: tpl.palette.accent }}>
        {content.subtitle}
      </p>
      <h1 className="hero-enter mt-4 text-5xl leading-tight sm:text-7xl">
        {content.partnerA} <span style={{ color: tpl.palette.accent }}>&amp;</span> {content.partnerB}
      </h1>
      <ThemeDivider comp={comp} />
      <p className="mt-5 text-lg sm:text-xl">{dateLine}</p>
      <p className="mx-auto mt-4 max-w-2xl leading-relaxed opacity-85">{content.welcome}</p>
      <div className="mx-auto mt-10 w-full max-w-4xl" style={{ color: tpl.palette.accent }}>
        <HeroImage
          site={site}
          src={heroSrc}
          alt={`${names} — wedding photo`}
          className={comp === "champagne" ? "frame-champagne aspect-[16/9] w-full object-cover" : "aspect-[16/9] w-full object-cover"}
        />
      </div>
      {rsvpCta}
      {isPreviewSite(site) ? <PreviewRsvpNote /> : null}
    </section>
  );
}

function CountdownSection({ site }: { site: WeddingSite }) {
  if (!site.settings.showCountdown || !site.settings.countdownEnabled) return null;
  const soft = site.templateSnapshot.palette.accentSoft;
  return (
    <section
      id="countdown"
      className={`mx-auto w-full max-w-5xl px-5 ${sectionSpacing()}`}
      aria-label="Countdown to the wedding"
    >
      <div className="rounded-xl px-6 py-10" style={{ backgroundColor: soft }}>
        <SectionHeading site={site} title="Counting down" />
        <div className="mt-8">
          <Countdown
            date={site.weddingDate}
            timezone={site.timezone}
            style={site.settings.countdownStyle}
            postMessage={site.content.postWeddingMessage}
          />
        </div>
      </div>
    </section>
  );
}

function InvitationSection({ site }: { site: WeddingSite }) {
  if (site.settings.showInvitation === false) return null;
  const comp = composition(site);
  const tpl = site.templateSnapshot;
  const text = (site.content.invitationText ?? "").trim();
  if (!text) return null;
  const dateLine = formatDate(site.weddingDate, site.timezone);
  const names = `${site.content.partnerA} & ${site.content.partnerB}`;

  const body = (
    <>
      <SectionHeading site={site} title="You are invited" />
      <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed whitespace-pre-line opacity-90">{text}</p>
      <p className="mt-8 text-lg font-semibold">{names}</p>
      <p className="mt-1 opacity-80">{dateLine}</p>
      {site.content.venueName ? <p className="mt-1 opacity-80">{site.content.venueName}</p> : null}
    </>
  );

  // Midnight: ivory invitation sheet emerging over charcoal.
  if (comp === "midnight") {
    return (
      <section id="invitation" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
        <div
          className="sig-midnight rounded-sm px-6 py-10 sm:px-12"
          style={{ backgroundColor: "#F1E8DA", color: "#171717" }}
        >
          <WaxSeal site={site} />
          <div className="mt-6">{body}</div>
        </div>
      </section>
    );
  }

  // Blue: open letter with a narrow blue side rule.
  if (comp === "blue") {
    return (
      <section id="invitation" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
        <div
          className="sig-blue rounded-r-xl border-l-4 bg-white px-6 py-10 text-left sm:px-10"
          style={{ borderLeftColor: tpl.palette.accent }}
        >
          <div className="text-center">{body}</div>
        </div>
      </section>
    );
  }

  // Mediterranean: terracotta / ivory split.
  if (comp === "mediterranean") {
    return (
      <section id="invitation" className={`mx-auto w-full max-w-5xl px-5 ${sectionSpacing()}`}>
        <div className="sig-mediterranean grid overflow-hidden rounded-xl sm:grid-cols-2" style={{ border: `1px solid ${tpl.palette.accent}` }}>
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center text-white" style={{ backgroundColor: tpl.palette.accent }}>
            <p className="text-xs font-semibold uppercase tracking-[0.3em]">You are invited</p>
            <p className="mt-4 text-3xl font-bold">{names}</p>
            <p className="mt-2">{dateLine}</p>
          </div>
          <div className="px-6 py-10 text-center sm:px-10">
            <p className="text-lg leading-relaxed whitespace-pre-line opacity-90">{text}</p>
            {site.content.venueName ? <p className="mt-6 font-semibold">{site.content.venueName}</p> : null}
          </div>
        </div>
      </section>
    );
  }

  // Lavender: layered translucent stationery cards.
  if (comp === "lavender") {
    return (
      <section id="invitation" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
        <div className="relative">
          <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl" style={{ backgroundColor: tpl.palette.accentSoft }} />
          <div className="sig-lavender relative rounded-2xl bg-white/80 px-6 py-10 shadow-sm sm:px-12">{body}</div>
        </div>
      </section>
    );
  }

  // Champagne + sage + classic: centred stationery panel with fine border.
  return (
    <section id="invitation" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
      <div
        className={comp === "champagne" ? "sig-champagne px-6 py-10 sm:px-12" : "px-6 py-10 sm:px-12"}
        style={{ backgroundColor: tpl.palette.accentSoft, border: `1px solid ${tpl.palette.accent}` }}
      >
        {body}
      </div>
    </section>
  );
}

function StorySection({ site }: { site: WeddingSite }) {
  if (!site.settings.showStory) return null;
  const comp = composition(site);
  const tpl = site.templateSnapshot;
  const first = site.gallery[0];
  const second = site.gallery[1];
  const storyImg = first?.url ?? site.content.heroImage;
  const storyText = (
    <p className="text-lg leading-relaxed whitespace-pre-line opacity-90">{site.content.story}</p>
  );

  // Champagne: asymmetric editorial two-column (text wide, image narrow).
  if (comp === "champagne" && first) {
    return (
      <section id="story" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Our story" />
        <div className="mt-10 grid items-start gap-10 sm:grid-cols-5">
          <div className="sm:col-span-3">{storyText}</div>
          <figure className="sm:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="aspect-[3/4] w-full object-cover" style={{ border: `1px solid ${tpl.palette.accent}` }} />
            {first.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{first.caption}</figcaption> : null}
          </figure>
        </div>
      </section>
    );
  }

  // Blue: centred text with a wide image strip below.
  if (comp === "blue" && first) {
    return (
      <section id="story" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Our story" />
        <div className="mx-auto mt-8 max-w-3xl text-center">{storyText}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="mx-auto mt-10 aspect-[21/9] w-full max-w-5xl object-cover" />
        {first.caption ? <p className="mt-2 text-center text-sm italic opacity-75">{first.caption}</p> : null}
      </section>
    );
  }

  // Midnight: dark editorial spread — large portrait, concise narrative.
  if (comp === "midnight" && first) {
    return (
      <section id="story" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <div className="rounded-xl px-6 py-10 sm:px-10" style={{ backgroundColor: tpl.palette.accentSoft }}>
          <SectionHeading site={site} title="Our story" />
          <div className="mt-10 grid items-center gap-10 sm:grid-cols-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
            <div>{storyText}</div>
          </div>
        </div>
      </section>
    );
  }

  // Sage: orderly scrapbook pairing — framed image, text beside it.
  if (comp === "sage" && first) {
    return (
      <section id="story" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Our story" />
        <div className="mt-10 grid items-start gap-10 sm:grid-cols-2">
          <figure style={{ color: tpl.palette.accent }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="frame-sage aspect-[4/3] w-full object-cover" />
            {first.caption ? <figcaption className="mt-3 text-center text-sm italic opacity-75">{first.caption}</figcaption> : null}
          </figure>
          <div>{storyText}</div>
        </div>
      </section>
    );
  }

  // Mediterranean: image-led sequence — image on top, text below.
  if (comp === "mediterranean" && first) {
    return (
      <section id="story" className={`mx-auto w-full max-w-4xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Our story" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="mx-auto mt-10 aspect-[16/9] w-full object-cover" />
        {first.caption ? <p className="mt-2 text-center text-sm italic opacity-75">{first.caption}</p> : null}
        <div className="mx-auto mt-8 max-w-2xl text-center">{storyText}</div>
      </section>
    );
  }

  // Lavender: soft editorial collage — two images above the text.
  // With only one photo there is no second card: show the single photo
  // alone instead of rendering an empty placeholder card.
  if (comp === "lavender" && first) {
    return (
      <section id="story" className={`mx-auto w-full max-w-5xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Our story" />
        {second ? (
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" style={{ border: `1px solid ${tpl.palette.accent}` }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={second.url} alt={second.caption || "A favourite photo"} loading="lazy" decoding="async" className="mt-8 aspect-[4/5] w-full object-cover" style={{ border: `1px solid ${tpl.palette.accent}` }} />
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={storyImg} alt={first.caption || "A favourite photo"} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" style={{ border: `1px solid ${tpl.palette.accent}` }} />
            {first.caption ? <p className="mt-2 text-center text-sm italic opacity-75">{first.caption}</p> : null}
          </div>
        )}
        <div className="mx-auto mt-10 max-w-2xl text-center">{storyText}</div>
      </section>
    );
  }

  // Classic / no photos: centred text.
  return (
    <section id="story" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
      <SectionHeading site={site} title="Our story" />
      <p className="mt-8 text-lg leading-relaxed whitespace-pre-line opacity-90">{site.content.story}</p>
    </section>
  );
}

function EventsSection({ site }: { site: WeddingSite }) {
  if (!site.settings.showEvents || site.events.length === 0) return null;
  const comp = composition(site);
  const accent = site.templateSnapshot.palette.accent;
  const soft = site.templateSnapshot.palette.accentSoft;

  // Blue: airy stacked itinerary — time left, event right.
  if (comp === "blue") {
    return (
      <section id="events" className={`mx-auto w-full max-w-4xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="When & where" intro="Everything happening across the weekend." />
        <div className="mt-10 divide-y" style={{ borderColor: accent }}>
          {site.events.map((event) => (
            <article key={event.id} className="flex flex-col gap-1 py-6 sm:flex-row sm:gap-8">
              <p className="w-40 shrink-0 font-semibold" style={{ color: accent }}>
                {formatEventDate(event.date)}
                <span className="block text-sm font-normal opacity-80">{event.time}</span>
              </p>
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="mt-1 font-medium">{event.venue}</p>
                <p className="text-sm opacity-75">{event.address}</p>
                {event.description ? <p className="mt-2 text-sm leading-relaxed opacity-85">{event.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Classic: card grid (kept for legacy snapshots).
  if (comp === "classic") {
    return (
      <section id="events" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="When & where" intro="Everything happening across the weekend." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.events.map((event) => (
            <article key={event.id} className="rounded-xl p-6" style={{ backgroundColor: soft }}>
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="mt-2 font-medium" style={{ color: accent }}>
                {formatEventDate(event.date)} · {event.time}
              </p>
              <p className="mt-1 font-medium">{event.venue}</p>
              <p className="text-sm opacity-75">{event.address}</p>
              {event.description ? <p className="mt-3 text-sm leading-relaxed opacity-85">{event.description}</p> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  // All other themes: vertical timeline with a fine rule and markers.
  // Marker shape varies: square for Mediterranean, leaf dot for Sage,
  // round brass for Midnight, round mauve for Lavender, round gold for Champagne.
  const markerClass =
    comp === "mediterranean" ? "rounded-none" : "rounded-full";
  return (
    <section id="events" className={`mx-auto w-full max-w-3xl px-5 ${sectionSpacing()}`}>
      <SectionHeading site={site} title="When & where" intro="Everything happening across the weekend." />
      <div className="relative mt-12">
        <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px opacity-40" style={{ backgroundColor: accent }} />
        <div className="flex flex-col gap-10">
          {site.events.map((event) => (
            <article key={event.id} className="relative pl-10">
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-0 h-[15px] w-[15px] border-2 ${markerClass}`}
                style={{ backgroundColor: soft, borderColor: accent }}
              />
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="mt-1 font-medium" style={{ color: accent }}>
                {formatEventDate(event.date)} · {event.time}
              </p>
              <p className="mt-1 font-medium">{event.venue}</p>
              <p className="text-sm opacity-75">{event.address}</p>
              {event.description ? <p className="mt-2 text-sm leading-relaxed opacity-85">{event.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VenueSection({ site }: { site: WeddingSite }) {
  const { content } = site;
  if (!content.venueName && !content.venueAddress) return null;
  return (
    <section id="venue" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
      <p className="mt-8 text-2xl font-semibold">{content.venueName}</p>
      {content.venueAddress ? <p className="mt-2 leading-relaxed opacity-85">{content.venueAddress}</p> : null}
      {content.mapLink ? (
        <a
          href={content.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border px-6 py-3 text-sm font-semibold transition hover:opacity-75"
          style={{ borderColor: site.templateSnapshot.palette.accent, color: site.templateSnapshot.palette.accent }}
        >
          View on a map
        </a>
      ) : null}
    </section>
  );
}

const DETAIL_KIND_LABELS: Record<string, string> = {
  venue: "Venue",
  travel: "Travel",
  accommodation: "Accommodation",
  dress: "Dress code",
  parking: "Parking",
  accessibility: "Accessibility",
  registry: "Gift registry",
  notes: "Good to know",
};

function visibleDetails(site: WeddingSite): DetailBlock[] {
  const blocks = site.content.details ?? [];
  return blocks.filter((b) => !b.hidden && (b.title.trim() || b.body.trim()));
}

function DetailLink({ block, site }: { block: DetailBlock; site: WeddingSite }) {
  if (!block.linkUrl) return null;
  return (
    <a
      href={block.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-block rounded-full border px-5 py-2 text-sm font-semibold transition hover:opacity-75"
      style={{ borderColor: site.templateSnapshot.palette.accent, color: site.templateSnapshot.palette.accent }}
    >
      {block.linkLabel || (block.kind === "registry" ? "View registry" : "Open link")} ↗
    </a>
  );
}

function DetailsSection({ site }: { site: WeddingSite }) {
  if (site.settings.showDetails === false) return null;
  const blocks = visibleDetails(site);
  if (blocks.length === 0) return null;
  const comp = composition(site);
  const tpl = site.templateSnapshot;

  // Midnight: alternating dark and ivory panels.
  if (comp === "midnight") {
    return (
      <section id="details" className={`mx-auto w-full max-w-5xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Details" intro="Everything guests need to know." />
        <div className="mt-10 flex flex-col gap-6">
          {blocks.map((block, i) => (
            <article
              key={block.id}
              className="rounded-lg px-6 py-8"
              style={
                i % 2 === 0
                  ? { backgroundColor: tpl.palette.accentSoft }
                  : { backgroundColor: "#F1E8DA", color: "#171717" }
              }
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: i % 2 === 0 ? tpl.palette.accent : "#6E263B" }}>
                {DETAIL_KIND_LABELS[block.kind] ?? "Details"}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{block.title}</h3>
              <p className="mt-2 leading-relaxed whitespace-pre-line opacity-90">{block.body}</p>
              <DetailLink block={block} site={site} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Lavender: alternating pearl and lavender-mist panels.
  if (comp === "lavender") {
    return (
      <section id="details" className={`mx-auto w-full max-w-5xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Details" intro="Everything guests need to know." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {blocks.map((block, i) => (
            <article
              key={block.id}
              className="rounded-2xl px-6 py-8"
              style={{ backgroundColor: i % 2 === 0 ? "#FFFFFF" : tpl.palette.accentSoft, border: `1px solid ${tpl.palette.accentSoft}` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: tpl.palette.accent }}>
                {DETAIL_KIND_LABELS[block.kind] ?? "Details"}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{block.title}</h3>
              <p className="mt-2 leading-relaxed whitespace-pre-line opacity-90">{block.body}</p>
              <DetailLink block={block} site={site} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Sage: clean stacked sections with botanical chapter markers.
  if (comp === "sage") {
    return (
      <section id="details" className={`mx-auto w-full max-w-3xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Details" intro="Everything guests need to know." />
        <div className="mt-10 flex flex-col gap-10">
          {blocks.map((block, i) => (
            <article key={block.id} className="border-t pt-8" style={{ borderColor: tpl.palette.accent }}>
              <p className="text-sm font-semibold" style={{ color: tpl.palette.accent }}>
                {String(i + 1).padStart(2, "0")} · {DETAIL_KIND_LABELS[block.kind] ?? "Details"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{block.title}</h3>
              <p className="mt-2 leading-relaxed whitespace-pre-line opacity-90">{block.body}</p>
              <DetailLink block={block} site={site} />
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Champagne, Blue, Mediterranean, classic: editorial split cards.
  return (
    <section id="details" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
      <SectionHeading site={site} title="Details" intro="Everything guests need to know." />
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {blocks.map((block) => (
          <article
            key={block.id}
            className="rounded-xl p-6"
            style={{ backgroundColor: tpl.palette.accentSoft, border: comp === "champagne" ? `1px solid ${tpl.palette.accent}` : undefined }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: tpl.palette.accent }}>
              {DETAIL_KIND_LABELS[block.kind] ?? "Details"}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{block.title}</h3>
            <p className="mt-2 leading-relaxed whitespace-pre-line opacity-90">{block.body}</p>
            <DetailLink block={block} site={site} />
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ site }: { site: WeddingSite }) {
  // Hooks FIRST — the early return below must come after them, or the
  // hook order changes (and React crashes) once a first photo is added.
  const comp = composition(site);
  const tpl = site.templateSnapshot;
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + site.gallery.length) % site.gallery.length,
      );
    },
    [site.gallery.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, close, step]);

  if (!site.settings.showGallery || site.gallery.length === 0) return null;

  const openBtn = (i: number, label: string, children: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setLightbox(i)}
      aria-label={`Open photo ${i + 1}: ${label}`}
      className="block w-full cursor-pointer text-left"
    >
      {children}
    </button>
  );

  // Design-tab gallery layout wins when the couple changed it from the
  // "grid" default. (Sage already renders masonry per-theme, so only
  // non-sage compositions need the explicit masonry branch here.)
  const layout = site.design?.galleryLayout;
  if (layout === "carousel") {
    return (
      <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className="w-72 shrink-0 snap-start sm:w-96">
              {openBtn(
                i,
                image.caption,
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${i + 1}`}
                    loading="lazy" decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </>,
              )}
              {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
      </section>
    );
  }
  if (layout === "masonry" && comp !== "sage") {
    return (
      <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
        <div className="mt-10 columns-2 gap-4 sm:columns-3">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className="mb-4 break-inside-avoid">
              {openBtn(
                i,
                image.caption,
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${i + 1}`}
                    loading="lazy" decoding="async"
                    className={`w-full object-cover ${i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}
                  />
                </>,
              )}
              {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
      </section>
    );
  }

  // Sage: organic asymmetric grid (masonry columns).
  if (comp === "sage") {
    return (
      <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
        <div className="mt-10 columns-2 gap-4 sm:columns-3">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className="mb-4 break-inside-avoid" style={{ color: tpl.palette.accent }}>
              {openBtn(
                i,
                image.caption,
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${i + 1}`}
                    loading="lazy" decoding="async"
                    className={`w-full object-cover ${i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}
                    style={{ border: `1px solid ${tpl.palette.accent}` }}
                  />
                </>,
              )}
              {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
      </section>
    );
  }

  // Champagne: curated magazine grid — first photo spans two columns.
  if (comp === "champagne") {
    return (
      <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className={i === 0 ? "sm:col-span-2 sm:row-span-2" : ""}>
              {openBtn(
                i,
                image.caption,
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${i + 1}`}
                    loading="lazy" decoding="async"
                    className={`w-full object-cover ${i === 0 ? "aspect-[16/10] sm:aspect-auto sm:h-full" : "aspect-[4/3]"}`}
                  />
                </>,
              )}
              {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
      </section>
    );
  }

  // Midnight: dark gallery with generous gutters.
  if (comp === "midnight") {
    return (
      <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className="rounded-lg p-3" style={{ backgroundColor: tpl.palette.accentSoft }}>
              {openBtn(
                i,
                image.caption,
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${i + 1}`}
                    loading="lazy" decoding="async"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </>,
              )}
              {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
      </section>
    );
  }

  // Mediterranean: mixed-size photo wall with warm gutters.
  if (comp === "mediterranean") {
    return (
      <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
        <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {site.gallery.map((image, i) => (
            <figure key={image.id} className={i % 4 === 0 ? "sm:col-span-2" : ""}>
              {openBtn(
                i,
                image.caption,
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || `Gallery photo ${i + 1}`}
                    loading="lazy" decoding="async"
                    className={`w-full object-cover ${i % 4 === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                  />
                </>,
              )}
              {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
        <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
      </section>
    );
  }

  // Blue: wide image-led layout. Lavender + classic: refined uniform grid.
  return (
    <section id="gallery" className={`mx-auto w-full max-w-6xl px-5 ${sectionSpacing()}`}>
      <SectionHeading site={site} title="Moments" intro="A few favourite memories, so far." />
      <div className={`mt-10 grid gap-4 ${comp === "blue" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {site.gallery.map((image, i) => (
          <figure
            key={image.id}
            className={comp === "blue" && i === 0 ? "sm:col-span-2" : ""}
            style={comp === "lavender" ? { border: `1px solid ${tpl.palette.accent}`, backgroundColor: "#fff", padding: 8 } : undefined}
          >
            {openBtn(
              i,
              image.caption,
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.caption || `Gallery photo ${i + 1}`}
                  loading="lazy" decoding="async"
                  className={`w-full object-cover ${comp === "blue" && i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                />
              </>,
            )}
            {image.caption ? <figcaption className="mt-2 text-center text-sm italic opacity-75">{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      <Lightbox site={site} index={lightbox} onClose={close} onStep={step} />
    </section>
  );
}

/** Accessible lightbox: previous/next, close, keyboard controls. */
function Lightbox({
  site,
  index,
  onClose,
  onStep,
}: {
  site: WeddingSite;
  index: number | null;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  if (index === null) return null;
  const image = site.gallery[index];
  if (!image) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${site.gallery.length}`}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="flex w-full max-w-4xl items-center justify-between text-white">
        <span className="text-sm opacity-80">
          {index + 1} / {site.gallery.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Close ✕
        </button>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.caption || `Gallery photo ${index + 1}`}
        decoding="async"
        className="mt-4 max-h-[75vh] w-auto max-w-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {image.caption ? <p className="mt-3 text-center text-sm text-white/85 italic">{image.caption}</p> : null}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStep(-1);
          }}
          aria-label="Previous photo"
          className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStep(1);
          }}
          aria-label="Next photo"
          className="rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function DressCodeSection({ site }: { site: WeddingSite }) {
  if (!site.settings.showDressCode || !site.content.dressCode) return null;
  return (
    <section id="dress-code" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
      <p
        className="mx-auto mt-8 max-w-xl rounded-xl px-6 py-6 text-lg leading-relaxed"
        style={{ backgroundColor: site.templateSnapshot.palette.accentSoft }}
      >
        {site.content.dressCode}
      </p>
    </section>
  );
}

function FaqSection({ site }: { site: WeddingSite }) {
  const [open, setOpen] = useState<number | null>(0);
  if (site.settings.showFaq === false) return null;
  const faqs = site.content.faqs ?? [];
  if (faqs.length === 0) return null;
  const comp = composition(site);
  const tpl = site.templateSnapshot;
  return (
    <section id="faq" className={`mx-auto w-full max-w-3xl px-5 ${sectionSpacing()}`}>
      <SectionHeading site={site} title="Questions & answers" intro="The things guests ask us most." />
      <div className="mt-10 flex flex-col gap-3">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div
              key={faq.id}
              className={comp === "lavender" ? "rounded-2xl" : "rounded-lg"}
              style={{
                backgroundColor: tpl.palette.accentSoft,
                border: comp === "champagne" ? `1px solid ${tpl.palette.accent}` : undefined,
              }}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold"
                >
                  <span>{faq.question}</span>
                  <span aria-hidden="true" className="shrink-0 text-xl" style={{ color: tpl.palette.accent }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen ? (
                <p id={`faq-answer-${faq.id}`} className="px-5 pb-5 leading-relaxed whitespace-pre-line opacity-90">
                  {faq.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function RsvpTeaser({ site }: { site: WeddingSite }) {
  const comp = composition(site);
  const tpl = site.templateSnapshot;
  const deadline = site.settings.rsvpDeadline
    ? formatDate(site.settings.rsvpDeadline, site.timezone)
    : null;
  const inner = (
    <>
      <SectionHeading site={site} title="Will you be there?" />
      <p className="mx-auto mt-4 max-w-xl leading-relaxed opacity-85">
        {site.settings.rsvpEnabled
          ? "Please let us know if you can make it — it helps us save you a seat (and a slice of cake)."
          : "RSVP is now closed. Thank you to everyone who has already replied."}
        {deadline && site.settings.rsvpEnabled ? ` Kindly reply by ${deadline}.` : ""}
      </p>
      <div className="mt-8">
        <PrimaryButton site={site} href={rsvpHref(site)}>
          RSVP
        </PrimaryButton>
      </div>
      {isPreviewSite(site) ? <PreviewRsvpNote /> : null}
    </>
  );

  // Midnight: warm ivory form panel on charcoal.
  if (comp === "midnight") {
    return (
      <section id="rsvp" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
        <div className="rounded-sm px-6 py-10" style={{ backgroundColor: "#F1E8DA", color: "#171717" }}>
          {inner}
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className={`mx-auto w-full max-w-3xl px-5 text-center ${sectionSpacing()}`}>
      <div
        className={comp === "lavender" ? "rounded-2xl px-6 py-10" : "rounded-xl px-6 py-10"}
        style={{ backgroundColor: tpl.palette.accentSoft }}
      >
        {inner}
      </div>
    </section>
  );
}

/* ---------- renderer ---------- */

const NAV_LABELS: Record<string, string> = {
  invitation: "Invitation",
  story: "Our story",
  events: "Schedule",
  venue: "Venue",
  details: "Details",
  "dress-code": "Dress code",
  gallery: "Gallery",
  faq: "FAQ",
  rsvp: "RSVP",
};

/** Does this section actually render for this site? Nav links must only
 * point at sections that will be on the page — sections return null when
 * empty / hidden / disabled, and a dead anchor is worse than no link. */
function willRenderSection(site: WeddingSite, key: string): boolean {
  switch (key) {
    case "invitation":
      return site.settings.showInvitation !== false && (site.content.invitationText ?? "").trim().length > 0;
    case "story":
      return site.settings.showStory === true;
    case "events":
      return site.settings.showEvents === true && site.events.length > 0;
    case "venue":
      return Boolean(site.content.venueName?.trim() || site.content.venueAddress?.trim());
    case "details":
      return site.settings.showDetails !== false && visibleDetails(site).length > 0;
    case "gallery":
      return site.settings.showGallery === true && site.gallery.length > 0;
    case "dress-code":
      return site.settings.showDressCode === true && Boolean(site.content.dressCode?.trim());
    case "faq":
      return site.settings.showFaq !== false && (site.content.faqs ?? []).length > 0;
    case "rsvp":
      return true;
    default:
      return false;
  }
}

export default function SiteRenderer({ site, preview = false, envelope = false }: SiteRendererProps) {
  if (site.status !== "published" && !preview) {
    return <SiteUnavailable />;
  }

  // Apply the Design-tab overrides (colours / fonts / gallery layout)
  // once, here, and render everything from the effective site.
  const effective = withDesign(site);
  const palette = effective.templateSnapshot.palette;
  const comp = composition(effective);

  // ÉTERNEL renders through its own renderer (Framer Motion + editorial
  // layout). The published-only gate above already ran, so no own gate
  // is needed here.
  if (comp === "eternel") {
    return <EternelRenderer site={effective} envelope={envelope} preview={preview} />;
  }

  // BLOSSOM & OUD renders through its own renderer (Framer Motion +
  // French-Moroccan garden layout). Same gate as ÉTERNEL above.
  if (comp === "blossom") {
    return <BlossomRenderer site={effective} envelope={envelope} preview={preview} />;
  }

  // THE SACRED GARDEN renders through its own renderer (Framer Motion
  // + rose-garden layout). Same gate as ÉTERNEL above.
  if (comp === "sacred-garden") {
    return <SacredGardenRenderer site={effective} envelope={envelope} preview={preview} />;
  }

  // DOLCE VITA renders through its own renderer — a 1:1 port of the
  // approved standalone site (390px column, Ken Burns hero, petals,
  // scratch-reveal date, photo slider). Same gate as ÉTERNEL above.
  if (comp === "dolce-vita") {
    return <DolceVitaRenderer site={effective} envelope={envelope} preview={preview} />;
  }

  const sections = effective.templateSnapshot.sections;

  const navLinks = sections.filter((key) => NAV_LABELS[key] && willRenderSection(effective, key));

  const renderSection = (key: string): React.ReactNode => {
    switch (key) {
      case "hero":
        return <Hero key="hero" site={effective} />;
      case "invitation":
        return <InvitationSection key="invitation" site={effective} />;
      case "countdown":
        return <CountdownSection key="countdown" site={effective} />;
      case "story":
        return <StorySection key="story" site={effective} />;
      case "events":
        return <EventsSection key="events" site={effective} />;
      case "venue":
        return <VenueSection key="venue" site={effective} />;
      case "details":
        return <DetailsSection key="details" site={effective} />;
      case "gallery":
        return <GallerySection key="gallery" site={effective} />;
      case "dress-code":
        return <DressCodeSection key="dress-code" site={effective} />;
      case "faq":
        return <FaqSection key="faq" site={effective} />;
      case "rsvp":
        return <RsvpTeaser key="rsvp" site={effective} />;
      default:
        return null;
    }
  };

  // Design-tab fonts, when the couple changed them: headings via the
  // --font-display variable (headings use it), body via font-family.
  const headingFont = headingFontOverride(site);
  const bodyFont = bodyFontOverride(site);

  return (
    <div
      className={`theme-${comp} min-h-full w-full`}
      style={{
        backgroundColor: palette.bg,
        color: palette.ink,
        fontFamily: bodyFont ?? undefined,
        "--font-display": headingFont,
        "--font-body": bodyFont,
      } as React.CSSProperties}
    >
      {envelope ? <EnvelopeIntro site={effective} autoFocus={!preview} /> : null}
      {preview ? (
        <p className="bg-stone-900 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Template preview — placeholder content
        </p>
      ) : null}
      {navLinks.length > 1 ? (
        <nav
          aria-label="Wedding website sections"
          className="sticky top-0 z-20 overflow-x-auto border-b"
          style={{ backgroundColor: palette.bg, borderColor: palette.accent }}
        >
          <div className="mx-auto flex w-full max-w-6xl items-center justify-start gap-1 px-3 py-2 sm:justify-center">
            {navLinks.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap uppercase tracking-[0.15em] transition hover:opacity-70"
                style={{ color: palette.ink }}
              >
                {NAV_LABELS[key]}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
      {sections.map((key) => {
        const node = renderSection(key);
        if (!node) return null;
        // The hero is above the fold and already has its own entrance
        // animation; every other section scroll-reveals into view.
        if (key === "hero") return <Fragment key={key}>{node}</Fragment>;
        return <Reveal key={key}>{node}</Reveal>;
      })}
      <Reveal>
        <footer className="border-t px-5 py-12 text-center" style={{ borderColor: palette.accent }}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: palette.accent }}>
            {initials(site)}
          </p>
          <p className="mt-4 text-lg font-semibold">
            {site.content.partnerA} &amp; {site.content.partnerB}
          </p>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed opacity-80">{site.content.footerMessage}</p>
          <ThemeDivider comp={comp} />
          <p className="mt-6 text-xs uppercase tracking-[0.25em] opacity-60">
            {formatDate(site.weddingDate, site.timezone)}
          </p>
        </footer>
      </Reveal>
    </div>
  );
}
