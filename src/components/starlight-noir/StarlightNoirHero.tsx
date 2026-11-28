// Starlight Noir invitation-view sections — welcome introduction,
// star-clock countdown on black, and the story preview:
// constellation cards (star-map style, staggered like stars on a
// chart) instead of the samples' warm photo cards. Only the data
// comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Star } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ConstellationDivider, NightSurface, Starfield } from "./Decor";
import {
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited" under the stars */
/* ------------------------------------------------------------------ */

export function StarlightNoirIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase"
        >
          Together with their families
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F5EFE0]"
        >
          {heading}
        </motion.h2>

        {/* Constellation divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <ConstellationDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_SCRIPT }}
          className="mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#D4AF37]"
        >
          {coupleNames(site)}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-[540px] text-left"
        >
          {site.content.welcome
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p
                key={i}
                style={{ fontFamily: FONT_EDITORIAL }}
                className="mt-3 text-center text-[1.02rem] leading-[1.75] text-[#F5EFE0]/85 first:mt-0"
              >
                {p}
              </p>
            ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Countdown — "A Night Written in the Stars Awaits"                 */
/*                                                                   */
/* Constellation-arc star clock (NOT circular badges): the five     */
/* units are stars on a midnight field — a small gold star above    */
/* each bare large number, the five stars joined by one thin        */
/* constellation line in wide containers, a twinkling star accent  */
/* beside the heading. Numbers/labels are bare type on black, so   */
/* contrast is the raw gold-on-black value: #F2D98C on #0A0A0A =   */
/* 14.22:1, #D4AF37 on #0A0A0A = 9.42:1, #F5EFE0 on #0A0A0A =      */
/* 17.26:1 — all far above the 4.5:1 bar (Autumn Harvest lesson).   */
/* ------------------------------------------------------------------ */

/** Small five-pointed gold star (24×24 viewBox), for the clock. */
function GoldStar({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <polygon
        points="12,1 13.4,7.7 18.5,3.1 15.6,8.4 22.5,8.6 16.5,12 22.5,15.4 15.6,15.7 18.5,20.9 13.4,16.3 12,23 10.6,16.3 5.5,20.9 8.4,15.7 1.5,15.4 7.5,12 1.5,8.6 8.4,8.4 5.5,3.1 10.6,7.7"
        fill="#D4AF37"
        stroke="#F2D98C"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Months-aware countdown: whole months from the calendar date,
 * days/hours/minutes/seconds from the remaining time. Ticks every
 * second. */
function useCountdown(targetIso: string, timezone: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return useMemo(() => {
    const target = new Date(targetIso);
    const diffMs = Math.max(0, target.getTime() - now);
    const num = (parts: Intl.DateTimeFormatPart[], type: string) =>
      Number(parts.find((p) => p.type === type)?.value ?? 0);
    const targetParts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(target);
    const nowParts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(new Date(now));
    let months =
      (num(targetParts, "year") - num(nowParts, "year")) * 12 +
      (num(targetParts, "month") - num(nowParts, "month"));
    if (num(targetParts, "day") < num(nowParts, "day")) months -= 1;
    months = Math.max(0, months);
    return {
      months,
      days: Math.floor(diffMs / 86_400_000),
      hours: Math.floor(diffMs / 3_600_000) % 24,
      minutes: Math.floor(diffMs / 60_000) % 60,
      seconds: Math.floor(diffMs / 1_000) % 60,
    };
  }, [targetIso, timezone, now]);
}

export function StarlightNoirCountdown({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const { months, days, hours, minutes, seconds } = useCountdown(site.weddingDate, site.timezone);
  const lines = venueLines(site);

  const units = [
    { value: months, label: "Months" },
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pb-14 text-center"
    >
      {/* Faint twinkling starfield behind the clock — the midnight field */}
      {!prefersReducedMotion && <Starfield density={24} className="opacity-40" />}

      {/* Twinkling star accent beside the heading */}
      {!prefersReducedMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute top-1 right-6 z-10 sm:right-14"
          animate={{ opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        >
          <GoldStar className="h-5 w-5" />
        </motion.span>
      )}

      <p
        style={{ fontFamily: FONT_DISPLAY }}
        className="relative z-10 text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase"
      >
        The Countdown Begins
      </p>

      <h3
        style={{ fontFamily: FONT_DISPLAY }}
        className="relative z-10 mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F5EFE0]"
      >
        A Night Written in the Stars Awaits
      </h3>

      <ConstellationDivider className="relative z-10 mt-4 h-7 w-32" />

      <p
        style={{ fontFamily: FONT_EDITORIAL }}
        className="relative z-10 mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#F5EFE0]/80"
      >
        Join us as we count down to a night beneath the stars, filled with love, laughter, and
        cherished memories.
      </p>

      {/* Star clock — 5 units as stars on a midnight field: a gold
          star above each bare large number, joined by one thin
          constellation line in wide containers (container queries,
          so the editor preview renders the mobile layout). Narrow:
          3 + 2 grid, no connecting line; wide: one row, arc line. */}
      <div
        role="timer"
        aria-live="off"
        className="@container relative z-10 mt-8 w-full"
      >
        {/* Constellation arc line — wide row only */}
        <svg
          aria-hidden="true"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          className="pointer-events-none absolute top-0 right-0 left-0 hidden h-5 w-full @min-[40rem]:block"
        >
          <polyline
            points="10,12 30,8 50,12 70,8 90,12"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.6"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-7 @min-[40rem]:grid-cols-5 @min-[40rem]:gap-x-2">
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center ${idx >= 3 ? "col-span-1" : ""} ${
                idx === 3 ? "col-start-1 @min-[40rem]:col-start-auto" : ""
              }`}
            >
              <GoldStar className="h-4 w-4 @min-[40rem]:h-5 @min-[40rem]:w-5" />
              <span
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-2 text-[2rem] leading-none font-normal text-[#F2D98C] tabular-nums @min-[40rem]:text-[2.4rem]"
              >
                <span suppressHydrationWarning>{String(unit.value).padStart(2, "0")}</span>
              </span>
              <span
                style={{ fontFamily: FONT_DISPLAY }}
                className="mt-2.5 text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase"
              >
                {unit.label}
              </span>
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-1 rounded-full bg-[#D4AF37]/70"
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-xs tracking-[0.3em] text-[#F5EFE0] uppercase"
        >
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            style={{ fontFamily: FONT_EDITORIAL }}
            className="flex items-center gap-1.5 text-sm text-[#F5EFE0]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — constellation cards (star-map style). Each photo   */
/* sits in a black frame with a gold border and a thin constellation */
/* line drawn across its corner; captions sit in a gold-ruled black  */
/* bar. Cards are staggered — odd cards drop lower, like stars on a  */
/* chart — instead of the samples' even warm photo-card grid.        */
/* ------------------------------------------------------------------ */

export function StarlightNoirStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 2 star-map photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const pool =
      gallery.length >= 2 ? gallery : [...TEMPLATE_PHOTOS, ...TEMPLATE_PHOTOS];
    return pool.slice(0, 4).map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <NightSurface variant="panel" className="px-4 py-14">
      {!prefersReducedMotion && <Starfield density={40} className="opacity-60" />}
      <div className="relative z-10 mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#F2D98C] uppercase"
        >
          Our Story
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F5EFE0]"
        >
          Written in the Stars
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#F5EFE0]/80"
        >
          From a first glance to a forever promise, every chapter has led us to this night
          beneath the stars.
        </motion.p>

        {/* Constellation cards — staggered like stars on a chart */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 grid w-full grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {cards.map((card, i) => (
            <figure
              key={`${card.src}-${i}`}
              className={`group relative overflow-hidden rounded-[4px] border border-[#D4AF37]/50 bg-[#0A0A0A] shadow-[0_14px_28px_-10px_rgba(0,0,0,0.8)] ${
                i % 2 === 1 ? "translate-y-4 lg:translate-y-6" : ""
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.src}
                  alt={card.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/55 via-transparent to-transparent"
                />
                {/* Constellation line across the photo's corner */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <line x1="12" y1="10" x2="38" y2="26" stroke="#D4AF37" strokeWidth="0.5" opacity="0.8" />
                  <line x1="38" y1="26" x2="66" y2="14" stroke="#D4AF37" strokeWidth="0.5" opacity="0.8" />
                  <circle cx="12" cy="10" r="1.6" fill="#F2D98C" />
                  <circle cx="38" cy="26" r="1.6" fill="#F2D98C" />
                  <circle cx="66" cy="14" r="1.6" fill="#F2D98C" />
                </svg>
                <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#0A0A0A]/70">
                  <Star className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
                </span>
              </div>
              <figcaption
                style={{ fontFamily: FONT_DISPLAY }}
                className="flex items-center justify-center gap-1.5 border-t border-[#D4AF37]/40 bg-[#0A0A0A] px-2 py-3 text-[10px] tracking-[0.2em] text-[#F2D98C] uppercase"
              >
                <Camera className="h-3 w-3 text-[#D4AF37]" />
                {card.caption}
              </figcaption>
            </figure>
          ))}
        </motion.div>

        {/* Read Our Full Story */}
        {willRenderSection(site, "story") && (
          <motion.button
            type="button"
            onClick={onOpenStory}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: FONT_DISPLAY }}
            className="group mt-10 inline-flex items-center gap-2 border border-[#D4AF37]/70 px-6 py-3 text-[11px] tracking-[0.28em] text-[#F5EFE0] uppercase transition-colors duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            <Heart className="h-3.5 w-3.5 text-[#D4AF37] transition-colors group-hover:text-[#0A0A0A]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      <Star className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#D4AF37]/50" />
      <Star className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#D4AF37]/40" />
    </NightSurface>
  );
}
