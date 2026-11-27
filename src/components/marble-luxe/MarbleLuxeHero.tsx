// Marble Luxe invitation-view sections — welcome introduction,
// minimal countdown on white with gold numerals and hairline
// dividers, and the story preview: a GALLERY WALL of two large
// photos with generous white space (not photo cards). Only the data
// comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { GoldDivider, PaperSurface } from "./Decor";
import {
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function MarbleLuxeIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden bg-white px-5 pt-10 pb-16">
      {/* Minimal invitation copy — lots of white space, thin rules */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#8C7355] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display mt-4 text-[2.1rem] leading-[1.12] font-medium tracking-[0.02em] text-[#1F2937]"
        >
          {heading}
        </motion.h2>

        {/* Gold divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 w-full"
        >
          <GoldDivider className="h-3 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#8C7355]"
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
                className="ml-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#374151] first:mt-0"
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
/* Countdown — "Until We Say I Do"                                   */
/* ------------------------------------------------------------------ */

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

export function MarbleLuxeCountdown({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const { months, days, hours, minutes, seconds } = useCountdown(site.weddingDate, site.timezone);
  const lines = venueLines(site);

  const units = [
    { value: months, label: "MONTHS" },
    { value: days, label: "DAYS" },
    { value: hours, label: "HOURS" },
    { value: minutes, label: "MINUTES" },
    { value: seconds, label: "SECONDS" },
  ];

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pt-14 pb-16 text-center"
    >
      <p className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#6B5B3E] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="ml-font-display mt-3 text-[1.7rem] leading-[1.12] font-medium tracking-[0.02em] text-[#1F2937]">
        Until We Say I Do
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#B49A70] to-transparent"
      />

      <p className="ml-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#4B5563]">
        Join us as we count down to a day of quiet elegance, love, and cherished memories.
      </p>

      {/* Countdown — GOLD-FRAMED PANEL: a double gold-ruled panel
          holding dark-ink numerals, gold diamonds and gold hairline
          dividers (replaces the old bare numerals). 5 units, 2 lines
          of 3 + 2 in narrow containers, one row in wide containers
          (container queries, so the editor preview renders the mobile
          layout). */}
      <div
        role="timer"
        aria-live="off"
        className="@container relative mt-8 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 rounded-[4px] border border-[#B49A70] bg-[#FDFCF9] px-3 py-5 shadow-[0_10px_28px_-12px_rgba(31,41,55,0.25)] @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-0 @min-[40rem]:px-6 @min-[40rem]:py-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[5px] border border-[#B49A70]/40"
        />
        {units.map((unit, idx) => (
          <motion.div
            key={unit.label}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col items-center @min-[40rem]:px-6 @min-[40rem]:[&:not(:last-child)]:border-r @min-[40rem]:[&:not(:last-child)]:border-[#D9C7A5] ${
              idx >= 3 ? "col-span-1" : ""
            } ${idx === 3 ? "col-start-1 @min-[40rem]:col-start-auto" : ""}`}
          >
            <span aria-hidden="true" className="mb-2 block h-1.5 w-1.5 rotate-45 bg-[#B49A70]" />
            <span className="ml-font-display text-[2rem] leading-none font-medium text-[#1F2937] tabular-nums @min-[40rem]:text-[2.4rem]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="ml-font-display mt-2.5 text-[9px] font-medium tracking-[0.3em] text-[#6B5B3E] uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="ml-font-display text-xs font-medium tracking-[0.3em] text-[#1F2937] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="ml-font-editorial flex items-center gap-1.5 text-sm text-[#4B5563] italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B49A70]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — gallery wall: two LARGE photos, generous spacing   */
/* ------------------------------------------------------------------ */

export function MarbleLuxeStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const photos = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 2).map((g) => g.url);
    const base = gallery.length >= 2 ? gallery : TEMPLATE_PHOTOS.slice(0, 2);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="marble" className="px-4 py-16">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display text-[10px] font-medium tracking-[0.34em] text-[#8C7355] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-display mt-3 text-[1.9rem] leading-[1.12] font-medium tracking-[0.02em] text-[#1F2937]"
        >
          Our Story in White &amp; Gold
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="ml-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#4B5563]"
        >
          From a first glance to a forever promise, every chapter has led us to this day.
        </motion.p>

        {/* Gallery wall — two large photos, generous gaps, no cards */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="@container mt-10 grid w-full grid-cols-1 gap-10 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-12"
        >
          {photos.map((photo, i) => (
            <figure key={`${photo.src}-${i}`} className="group relative">
              <div className="relative overflow-hidden bg-white shadow-[0_18px_36px_-16px_rgba(31,41,55,0.35)]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <figcaption className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium tracking-[0.28em] text-[#4B5563] uppercase">
                <span aria-hidden="true" className="h-px w-6 bg-[#B49A70]" />
                {photo.caption}
                <span aria-hidden="true" className="h-px w-6 bg-[#B49A70]" />
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
            className="group mt-12 inline-flex items-center gap-2 border border-[#B49A70] px-6 py-3 ml-font-display text-[11px] font-medium tracking-[0.28em] text-[#1F2937] uppercase transition-colors duration-300 hover:border-[#1F2937] hover:bg-[#1F2937] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B49A70]"
          >
            <Heart className="h-3.5 w-3.5 text-[#8C7355] transition-colors group-hover:text-[#D9C6A5]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>
    </PaperSurface>
  );
}
