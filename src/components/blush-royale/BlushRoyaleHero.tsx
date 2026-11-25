// Blush Royale invitation-view sections — welcome introduction,
// months-aware countdown, and the CIRCULAR story preview (floral
// rings — never a film strip, never horizontal photo cards). Only
// the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FloralCluster, FloralRingPhoto, WashSurface } from "./Decor";
import {
  CIRCLE_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* Introduction — "You Are Cordially Invited"                        */
/* ------------------------------------------------------------------ */

export function BlushRoyaleIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16 sm:pt-14 sm:pb-20">
      {/* Decorative blush floral clusters (desktop/tablet corner chrome) */}
      <div className="pointer-events-none absolute top-0 left-0 hidden h-56 w-52 opacity-90 md:block">
        <FloralCluster side="left" className="h-full w-full" />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 hidden h-56 w-52 opacity-90 md:block">
        <FloralCluster side="right" className="h-full w-full" />
      </div>

      {/* Letterpress invitation copy */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display text-[10px] tracking-[0.34em] text-[#7A4A55] uppercase sm:text-xs"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#5C323B] sm:mt-5 sm:text-[2.55rem]"
        >
          You Are Cordially Invited
        </motion.h2>

        {/* Animated rose-gold stem underline */}
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 180 34"
          fill="none"
          className="mt-3 h-7 w-36 sm:h-8 sm:w-44"
          initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.path
            d="M18 22 C20 14, 32 9, 45 13 C60 17, 75 21, 90 20 C105 19, 118 15, 128 12 C142 8, 158 10, 166 17"
            stroke="#B76E79"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <motion.path
            d="M89 11 C92 15, 94 17, 89 21 C84 17, 86 15, 89 11 Z"
            fill="#E8B4B8"
            stroke="#B76E79"
            strokeWidth="1"
          />
          <motion.path
            d="M89 21 L89 27"
            stroke="#B76E79"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="26" cy="19" r="1.6" fill="#B76E79" />
          <circle cx="158" cy="13" r="1.6" fill="#B76E79" />
        </motion.svg>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#B76E79] sm:mt-4 sm:text-[2.75rem]"
        >
          {coupleNames(site)}
        </motion.p>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 max-w-[540px] text-left sm:mt-5"
        >
          {site.content.welcome
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p
                key={i}
                className="br-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#5C323B]/85 first:mt-0 sm:text-[1.08rem]"
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
/* Countdown — "A Day of Love Awaits"                                */
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

export function BlushRoyaleCountdown({ site }: { site: WeddingSite }) {
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
      className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pb-14 text-center sm:px-6"
    >
      <p className="br-font-display text-[10px] tracking-[0.34em] text-[#B76E79] uppercase sm:text-xs">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="br-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#5C323B] sm:text-[2rem]">
        A Day of Love Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#B76E79]/80 to-transparent sm:w-56"
      />

      <p className="br-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#5C323B]/85 sm:text-[1.06rem]">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — 5 units, 2 lines of 3 + 2 on mobile, one row on desktop */}
      <div
        role="timer"
        aria-live="off"
        className="mt-8 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 sm:mt-10 sm:flex sm:flex-row sm:items-start sm:justify-center sm:gap-x-6 md:gap-x-9"
      >
        {units.map((unit, idx) => (
          <motion.div
            key={unit.label}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col items-center ${idx >= 3 ? "col-span-1" : ""} ${
              idx === 3 ? "col-start-1 sm:col-start-auto" : ""
            }`}
          >
            <span className="br-font-display flex h-16 w-16 items-center justify-center rounded-full border border-[#B76E79]/60 bg-[#FFFDFB]/80 text-[1.55rem] font-normal text-[#B76E79] shadow-[inset_0_1px_4px_rgba(255,255,255,0.7),0_6px_16px_rgba(92,50,59,0.2)] tabular-nums sm:h-[4.6rem] sm:w-[4.6rem] sm:text-[1.85rem]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="br-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#7A4A55] uppercase sm:text-[10px]">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5 sm:mt-11">
        <p className="br-font-display text-xs tracking-[0.3em] text-[#5C323B] uppercase sm:text-sm">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="br-font-editorial flex items-center gap-1.5 text-sm text-[#5C323B]/80 italic sm:text-[0.95rem]"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#B76E79]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — CIRCULAR photos with floral rings                  */
/* ------------------------------------------------------------------ */

export function BlushRoyaleStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const circles = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: CIRCLE_CAPTIONS[i % CIRCLE_CAPTIONS.length],
      alt: `Our Story — ${CIRCLE_CAPTIONS[i % CIRCLE_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <WashSurface variant="wash" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        {/* Decorative blush floral corner accents */}
        <div className="pointer-events-none absolute top-0 left-0 hidden h-44 w-44 opacity-70 md:block">
          <FloralCluster side="left" className="h-full w-full" />
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 hidden h-44 w-44 opacity-70 md:block">
          <FloralCluster side="right" className="h-full w-full" />
        </div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display text-[10px] tracking-[0.34em] text-[#B76E79] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#5C323B] sm:text-[2.3rem]"
        >
          A Love in Full Bloom
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#5C323B]/85 sm:text-[1.06rem]"
        >
          From a first glance to a forever promise, every chapter has led us to this blushing day.
        </motion.p>

        {/* Circular photos with floral rings — 2 per row on mobile,
            4 in a row on desktop; gentle float on alternate rings */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 grid w-full max-w-[860px] grid-cols-2 gap-x-4 gap-y-8 sm:mt-11 sm:grid-cols-4 sm:gap-x-6"
        >
          {circles.map((frame, i) => (
            <motion.figure
              key={`${frame.src}-${i}`}
              animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={{
                duration: 5 + i * 0.6,
                repeat: Infinity,
                ease: [0.45, 0.05, 0.55, 0.95],
                delay: i * 0.4,
              }}
              className="flex flex-col items-center"
            >
              <FloralRingPhoto src={frame.src} alt={frame.alt} className="w-full max-w-[190px]" />
              <figcaption className="br-font-script mt-3 text-[1.35rem] leading-none text-[#B76E79] sm:text-[1.5rem]">
                {frame.caption}
              </figcaption>
            </motion.figure>
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
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-[#B76E79]/70 bg-[#FFFDFB]/70 px-6 py-3 br-font-display text-[11px] tracking-[0.28em] text-[#5C323B] uppercase transition-colors duration-300 hover:border-[#B76E79] hover:bg-[#B76E79] hover:text-[#FFFDFB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:text-xs"
          >
            <Heart className="h-3.5 w-3.5 text-[#B76E79] transition-colors group-hover:text-[#FFFDFB]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#B76E79]/50 md:block" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#B76E79]/40 md:block" />
    </WashSurface>
  );
}
