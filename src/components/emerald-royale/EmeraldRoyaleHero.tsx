// Emerald Royale invitation-view sections — welcome introduction,
// months-aware countdown on an emerald band, and the story preview:
// an emerald film strip with GOLD tape (not silver perforations).
// Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, MapPin, Heart, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface } from "./Decor";
import {
  FILM_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function EmeraldRoyaleIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16 sm:pt-14 sm:pb-20">
      {/* Decorative Emerald Floral Clusters (Desktop/Tablet corner chrome) */}
      <div className="pointer-events-none absolute top-0 left-0 hidden h-56 w-52 opacity-90 md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/themes/emerald-royale/floral_emerald_cluster.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="er-mask-radial-soft h-full w-full object-contain"
        />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 hidden h-56 w-52 opacity-90 md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/themes/emerald-royale/floral_emerald_cluster.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="er-mask-radial-soft h-full w-full -scale-x-100 object-contain"
        />
      </div>

      {/* Letterpress invitation copy */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-[10px] tracking-[0.34em] text-[#14543D] uppercase sm:text-xs"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#0B3D2E] sm:mt-5 sm:text-[2.55rem]"
        >
          {heading}
        </motion.h2>

        {/* Animated hand-drawn heart + gold-leaf underline */}
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
            stroke="#C9A227"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <motion.path
            d="M89 11 C92 15, 94 17, 89 21 C84 17, 86 15, 89 11 Z"
            fill="#C9A227"
            stroke="#0B3D2E"
            strokeWidth="1"
          />
          <motion.path
            d="M89 21 L89 27"
            stroke="#C9A227"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="26" cy="19" r="1.6" fill="#C9A227" />
          <circle cx="158" cy="13" r="1.6" fill="#C9A227" />
        </motion.svg>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#14543D] sm:mt-4 sm:text-[2.75rem]"
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
                className="er-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#06231B]/85 first:mt-0 sm:text-[1.08rem]"
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

export function EmeraldRoyaleCountdown({ site }: { site: WeddingSite }) {
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
      <p className="er-font-display text-[10px] tracking-[0.34em] text-[#C9A227]/90 uppercase sm:text-xs">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="er-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F7F3E8] sm:text-[2rem]">
        A Day of Love Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#C9A227]/90 to-transparent sm:w-56"
      />

      <p className="er-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#EFE7D3]/85 sm:text-[1.06rem]">
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
            <span className="er-font-display flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A227]/65 bg-[#06231B]/70 text-[1.55rem] font-normal text-[#FFFDF9] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(4,26,19,0.4)] tabular-nums sm:h-[4.6rem] sm:w-[4.6rem] sm:text-[1.85rem]">
              <span suppressHydrationWarning>{String(unit.value).padStart(2, "0")}</span>
            </span>
            <span className="er-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#C9A227] uppercase sm:text-[10px]">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5 sm:mt-11">
        <p className="er-font-display text-xs tracking-[0.3em] text-[#F7F3E8] uppercase sm:text-sm">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="er-font-editorial flex items-center gap-1.5 text-sm text-[#EFE7D3]/80 italic sm:text-[0.95rem]"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9A227]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — emerald film strip with GOLD tape                  */
/* ------------------------------------------------------------------ */

export function EmeraldRoyaleStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const stripImages = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 film photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: FILM_CAPTIONS[i % FILM_CAPTIONS.length],
      alt: `Our Story — ${FILM_CAPTIONS[i % FILM_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="emerald" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        {/* Decorative emerald floral corner accents */}
        <div className="pointer-events-none absolute top-0 left-0 hidden h-44 w-44 opacity-70 md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/themes/emerald-royale/floral_emerald_cluster.jpg"
            alt=""
            referrerPolicy="no-referrer"
            className="er-mask-radial-soft h-full w-full object-contain"
          />
        </div>
        <div className="pointer-events-none absolute right-0 bottom-0 hidden h-44 w-44 opacity-70 md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/themes/emerald-royale/floral_emerald_cluster.jpg"
            alt=""
            referrerPolicy="no-referrer"
            className="er-mask-radial-soft h-full w-full -scale-x-100 object-contain"
          />
        </div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-[10px] tracking-[0.34em] text-[#C9A227] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F7F3E8] sm:text-[2.3rem]"
        >
          A Love Written in Gold
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#EFE7D3]/85 sm:text-[1.06rem]"
        >
          From a first glance to a forever promise, every chapter has led us to this golden day.
        </motion.p>

        {/* Film Strip with Gold Tape — gold sprocket bars top + bottom */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-9 w-full overflow-hidden bg-[#06231B]/60 px-2 py-4 sm:mt-11 sm:px-4 sm:py-5"
        >
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 left-0 flex justify-between px-1"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="h-2.5 w-3.5 rounded-[2px] bg-gradient-to-b from-[#E8D5A0] to-[#C9A227] sm:w-4.5" />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 flex justify-between px-1"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="h-2.5 w-3.5 rounded-[2px] bg-gradient-to-b from-[#E8D5A0] to-[#C9A227] sm:w-4.5" />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 px-1 pt-2 pb-2 sm:grid-cols-4 sm:gap-4 sm:px-2">
            {stripImages.map((frame, i) => (
              <figure key={`${frame.src}-${i}`} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] shadow-[0_10px_22px_-6px_rgba(4,26,19,0.6)] ring-1 ring-[#C9A227]/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.src}
                    alt={frame.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06231B]/45 via-transparent to-transparent"
                  />
                  {/* Gold tape tab on the top edge of each frame */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 h-3 w-12 -translate-x-1/2 bg-[#C9A227]/85 shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
                  />
                  <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] tracking-[0.2em] text-white/95 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                    <Camera className="h-3 w-3" />
                    {frame.caption}
                  </span>
                </div>
              </figure>
            ))}
          </div>
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#C9A227]/70 px-6 py-3 er-font-display text-[11px] tracking-[0.28em] text-[#F7F3E8] uppercase transition-colors duration-300 hover:border-[#F7F3E8] hover:bg-[#F7F3E8] hover:text-[#0B3D2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227] sm:mt-10 sm:text-xs"
          >
            <Heart className="h-3.5 w-3.5 text-[#C9A227] transition-colors group-hover:text-[#0B3D2E]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#C9A227]/50 md:block" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#C9A227]/40 md:block" />
    </PaperSurface>
  );
}
