// Eternal Moment renderer — The Wedding Experience port as a
// Studio template.
//
// Single scrolling page, hero first: nav → hero (with countdown
// inside, as in the source) → welcome → story → events → venue →
// dress-code → gallery → good-to-know → RSVP → footer.
//
// The `envelope` prop is accepted for the SiteRenderer contract
// but deliberately IGNORED: this template has no intro screen, no
// opening ceremony of any kind by design (user order
// 2026-11-28 — the whole opening was removed from the source
// design, and the Studio standing rule is no envelope in any
// template). The page always starts directly on the hero, in the
// editor live preview as well as on guest sites.
//
// Navigation is a template-local fixed bar (transparent over the
// hero, ivory once scrolled) in the EternelNav pattern — the
// shared SiteNav is the Studio marketing header (Templates /
// Features / Admin links) and does not belong on a guest wedding
// page, so it is not used here.
"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import Reveal from "../Reveal";
import {
  EternalMomentEvents,
  EternalMomentDressCode,
  EternalMomentInfoBlocks,
  EternalMomentVenue,
} from "./EternalMomentDetails";
import EternalMomentHero from "./EternalMomentHero";
import EternalMomentRsvpForm from "./EternalMomentRsvpForm";
import { EternalMomentFooter, EternalMomentGallery } from "./EternalMomentSections";
import EternalMomentStory from "./EternalMomentStory";
import {
  ETERNAL,
  FONT_BODY,
  coupleNames,
  initials,
  resolveHeroSrc,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* EternalMomentNav — fixed, transparent over the hero (ivory text), */
/* ivory + backdrop blur once the page scrolls. Mobile gets a       */
/* full-screen overlay. Links only point at sections that will     */
/* actually render on this site.                                     */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: { key: string; label: string; href: string }[] = [
  { key: "story", label: "Our Story", href: "#story" },
  { key: "events", label: "Celebration", href: "#events" },
  { key: "venue", label: "Venue", href: "#venue" },
  { key: "dress-code", label: "Dress Code", href: "#dress-code" },
  { key: "gallery", label: "Gallery", href: "#gallery" },
  { key: "rsvp", label: "RSVP", href: "#rsvp" },
];

function EternalMomentNav({ site }: { site: WeddingSite }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const items = NAV_ITEMS.filter((item) => willRenderSection(site, item.key));
  const dark = !scrolled && !menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "border-b backdrop-blur-sm" : "border-b border-transparent bg-transparent"
        }`}
        style={
          scrolled
            ? { backgroundColor: `${ETERNAL.ivory}F2`, borderColor: ETERNAL.champagne }
            : undefined
        }
      >
        <nav
          aria-label="Wedding website"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
        >
          <a
            href="#home"
            className="flex min-h-11 min-w-11 items-center gap-2.5 text-sm font-semibold tracking-[0.2em] uppercase"
            style={{ color: dark ? ETERNAL.paper : ETERNAL.espresso }}
            aria-label={`${coupleNames(site)} — back to top`}
          >
            <span
              aria-hidden="true"
              className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold"
              style={
                dark
                  ? { borderColor: "rgba(255,255,255,0.6)", color: ETERNAL.paper }
                  : { borderColor: ETERNAL.gold, color: ETERNAL.goldDeep }
              }
            >
              {initials(site)}
            </span>
            <span className="hidden sm:inline">An Eternal Moment</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {items
              .filter((item) => item.key !== "rsvp")
              .map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="shrink-0 rounded-full px-3.5 py-2.5 text-[13px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase transition hover:opacity-70"
                  style={{ color: dark ? ETERNAL.paper : ETERNAL.espresso }}
                >
                  {item.label}
                </a>
              ))}
          </div>

          <div className="flex items-center gap-2.5">
            {willRenderSection(site, "rsvp") ? (
              <a
                href="#rsvp"
                className="hidden min-h-11 items-center rounded-full px-5 text-[13px] font-bold tracking-[0.12em] uppercase transition hover:opacity-85 sm:inline-flex"
                style={
                  dark
                    ? { backgroundColor: ETERNAL.paper, color: ETERNAL.espresso }
                    : { backgroundColor: ETERNAL.espresso, color: ETERNAL.paper }
                }
              >
                RSVP
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex h-11 w-11 items-center justify-center rounded-full border md:hidden"
              style={
                dark
                  ? { borderColor: "rgba(255,255,255,0.6)", color: ETERNAL.paper }
                  : { borderColor: ETERNAL.gold, color: ETERNAL.espresso }
              }
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: ETERNAL.ivory, color: ETERNAL.espresso }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              {initials(site)} — An Eternal Moment
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border"
              style={{ borderColor: ETERNAL.gold }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
            {items.map((item) => (
              <a
                key={item.key}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="w-full max-w-xs rounded-full border px-6 py-3.5 text-center text-sm font-semibold tracking-[0.18em] uppercase transition hover:opacity-75"
                style={{ borderColor: `${ETERNAL.gold}66` }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Renderer                                                            */
/* ------------------------------------------------------------------ */

export default function EternalMomentRenderer({
  site,
  envelope: _envelope,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  // `_envelope` is intentionally unused: this template never shows
  // an intro screen — the page always opens directly on the hero.
  void _envelope;

  const heroSrc = resolveHeroSrc(site);
  const welcome = (site.content.welcome ?? "").trim();
  const showWelcome = willRenderSection(site, "welcome");

  return (
    <div
      className="eternal-moment min-h-dvh w-full"
      style={{ backgroundColor: ETERNAL.ivory, color: ETERNAL.espresso, fontFamily: "var(--font-manrope), sans-serif" }}
    >
      {/* Fast-load: preload the hero photo (the user explicitly wants
          fast loading — same fix as ÉTERNEL / Blossom / Golden Hour). */}
      {heroSrc ? <link rel="preload" as="image" href={heroSrc} fetchPriority="high" /> : null}

      {preview ? (
        <div
          className="relative z-30 px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white"
          style={{ backgroundColor: ETERNAL.espresso }}
        >
          Preview — this is how the Eternal Moment template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      <EternalMomentNav site={site} />

      <main>
        <EternalMomentHero site={site} />

        {/* Welcome line — only when the couple wrote one. */}
        {showWelcome ? (
          <section aria-label="Welcome" className="mx-auto w-full max-w-3xl px-4 pt-16 pb-2 text-center sm:px-6">
            <Reveal>
              <p className={`${FONT_BODY} text-[1.1rem] leading-[1.9] italic`} style={{ color: `${ETERNAL.espresso}D9` }}>
                {welcome}
              </p>
            </Reveal>
          </section>
        ) : null}

        {willRenderSection(site, "story") ? <EternalMomentStory site={site} /> : null}
        {willRenderSection(site, "events") ? <EternalMomentEvents site={site} /> : null}
        {willRenderSection(site, "venue") ? <EternalMomentVenue site={site} /> : null}
        {willRenderSection(site, "dress-code") ? <EternalMomentDressCode site={site} /> : null}
        {willRenderSection(site, "gallery") ? <EternalMomentGallery site={site} /> : null}
        {site.settings.showDetails === true ? <EternalMomentInfoBlocks site={site} /> : null}
        {willRenderSection(site, "rsvp") ? <EternalMomentRsvpForm site={site} /> : null}
      </main>

      <EternalMomentFooter site={site} />
    </div>
  );
}
