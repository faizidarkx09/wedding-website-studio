// Coral Sunset invitation-view sections — welcome introduction,
// months-aware countdown on a deep-plum band with ember particles,
// and the story preview: a sunset STRIP — a horizontal scroll-snap
// row of photos inside a coral→peach→plum gradient band (not a
// grid of cards). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Sun } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { EmberParticles, SunsetDivider, SunsetSurface } from "./Decor";
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

export function CoralSunsetIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      {/* Letterpress invitation copy */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display text-[10px] tracking-[0.34em] text-[#C94A2E] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3D1F2B]"
        >
          {heading}
        </motion.h2>

        {/* Sunset divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <SunsetDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#C94A2E]"
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
                className="cs-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#3D1F2B]/85 first:mt-0"
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
/* Countdown — "A Sunset Worth Counting Down To"                     */
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

export function CoralSunsetCountdown({ site }: { site: WeddingSite }) {
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
    <SunsetSurface variant="plum" className="px-4 pt-14">
      {!prefersReducedMotion && <EmberParticles />}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pb-14 text-center"
      >
        <p className="cs-font-display text-[10px] tracking-[0.34em] text-[#FF7F50] uppercase">
          THE COUNTDOWN BEGINS
        </p>

        <h3 className="cs-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFF6EE]">
          A Sunset Worth Counting Down To
        </h3>

        <div
          aria-hidden="true"
          className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#FF7F50]/90 to-transparent"
        />

        <p className="cs-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#FFDAB9]/85">
          Join us as we count down to an evening painted in coral and gold.
        </p>

        {/* Countdown — 5 units, 2 lines of 3 + 2 in narrow containers,
            one row in wide containers (container queries, so the
            editor preview renders the mobile layout). */}
        <div
          role="timer"
          aria-live="off"
          className="@container mt-8 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-6"
        >
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
              <span className="cs-font-display flex h-16 w-16 items-center justify-center rounded-full border border-[#FF7F50]/70 bg-[#3D1F2B]/70 text-[1.55rem] font-normal text-[#FFF6EE] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(46,20,32,0.4)] tabular-nums @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="cs-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#FF7F50] uppercase">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-center gap-1.5">
          <p className="cs-font-display text-xs tracking-[0.3em] text-[#FFF6EE] uppercase">
            {formatLongDate(site.weddingDate, site.timezone)}
          </p>
          {lines.map((line, i) => (
            <p
              key={i}
              className="cs-font-editorial flex items-center gap-1.5 text-sm text-[#FFDAB9]/80 italic"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FF7F50]" />
              {line}
            </p>
          ))}
        </div>
      </motion.div>
    </SunsetSurface>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — the sunset STRIP: a horizontal scroll-snap row of  */
/* photos inside a coral→peach→plum gradient band (not a grid).      */
/* ------------------------------------------------------------------ */

export function CoralSunsetStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 sunset photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <SunsetSurface variant="sunset" className="px-0 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center px-4 text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display text-[10px] tracking-[0.34em] text-[#2E1420] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E1420]"
        >
          Our Story in Coral Light
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="cs-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#3D1F2B]/90"
        >
          From a first glance to a forever promise, every chapter has led us to this sunset day.
        </motion.p>
      </div>

      {/* Sunset strip — horizontal scroll-snap row */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:justify-center"
      >
        {cards.map((card, i) => (
          <figure
            key={`${card.src}-${i}`}
            className="group relative w-56 shrink-0 snap-center overflow-hidden rounded-[18px] bg-[#FFFBF5] shadow-[0_16px_30px_-10px_rgba(46,20,32,0.5)] ring-1 ring-[#FFF6EE]/60 sm:w-60"
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
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1420]/45 via-transparent to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 px-2 py-3 text-[10px] tracking-[0.2em] text-[#FFF6EE] uppercase drop-shadow-[0_2px_4px_rgba(46,20,32,0.8)]">
                <Camera className="h-3 w-3 text-[#FFDAB9]" />
                {card.caption}
              </figcaption>
            </div>
          </figure>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center px-4">
        {willRenderSection(site, "story") && (
          <motion.button
            type="button"
            onClick={onOpenStory}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="group inline-flex items-center gap-2 rounded-full bg-[#2E1420] px-6 py-3 cs-font-display text-[11px] tracking-[0.28em] text-[#FFF6EE] uppercase shadow-[0_10px_22px_-8px_rgba(46,20,32,0.6)] transition-colors duration-300 hover:bg-[#3D1F2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E1420]"
          >
            <Heart className="h-3.5 w-3.5 text-[#FF7F50] transition-colors group-hover:text-[#FFDAB9]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Sun accent */}
      <Sun className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#2E1420]/40" />
    </SunsetSurface>
  );
}
