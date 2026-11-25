// Sapphire Royale invitation-view sections — welcome letter,
// months-aware countdown on a navy band, and the story preview as
// THREE HORIZONTAL PHOTO CARDS side by side (never a film strip).
// Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DecoDivider, FanPatternBand, NightSurface, SparkleField } from "./Decor";
import {
  CARD_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function SapphireRoyaleIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16 sm:pt-14 sm:pb-20">
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display text-[10px] tracking-[0.34em] text-[#12294D] uppercase sm:text-xs"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#0A1F44] sm:mt-5 sm:text-[2.55rem]"
        >
          {heading}
        </motion.h2>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-4"
        >
          <DecoDivider className="h-5 w-44 sm:w-56" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#12294D] sm:mt-4 sm:text-[2.75rem]"
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
                className="sr-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#12294D]/85 first:mt-0 sm:text-[1.08rem]"
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
/* Countdown — "A Night to Remember"                                 */
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

export function SapphireRoyaleCountdown({ site }: { site: WeddingSite }) {
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
      <p className="sr-font-display text-[10px] tracking-[0.34em] text-[#C0C0C8]/90 uppercase sm:text-xs">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="sr-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F2F4F8] sm:text-[2rem]">
        A Night to Remember
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#C0C0C8]/90 to-transparent sm:w-56"
      />

      <p className="sr-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#D9D9DE]/85 sm:text-[1.06rem]">
        Join us as we count down to a night of silver light, laughter, and cherished memories.
      </p>

      {/* Countdown — 5 units, 2 lines of 3 + 2 on mobile, one row on desktop.
          Silver diamond-framed numbers (art-deco, not circles). */}
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
            <span className="sr-font-display flex h-16 w-16 rotate-45 items-center justify-center border border-[#C0C0C8]/70 bg-[#12294D]/80 text-[1.55rem] font-normal text-[#FFFFFF] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(6,18,43,0.5)] tabular-nums sm:h-[4.6rem] sm:w-[4.6rem] sm:text-[1.85rem]">
              <span className="-rotate-45">{String(unit.value).padStart(2, "0")}</span>
            </span>
            <span className="sr-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#C0C0C8] uppercase sm:text-[10px]">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5 sm:mt-11">
        <p className="sr-font-display text-xs tracking-[0.3em] text-[#F2F4F8] uppercase sm:text-sm">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="sr-font-editorial flex items-center gap-1.5 text-sm text-[#D9D9DE]/80 italic sm:text-[0.95rem]"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C0C0C8]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — THREE HORIZONTAL PHOTO CARDS (not a film strip)    */
/* ------------------------------------------------------------------ */

export function SapphireRoyaleStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 3 photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 3).map((g) => g.url);
    const base = gallery.length >= 3 ? gallery : TEMPLATE_PHOTOS.slice(0, 3);
    return base.map((src, i) => ({
      src,
      caption: CARD_CAPTIONS[i % CARD_CAPTIONS.length],
      alt: `Our Story — ${CARD_CAPTIONS[i % CARD_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <NightSurface variant="navy" className="px-4 py-14 sm:px-6 sm:py-20">
      <FanPatternBand />
      <SparkleField className="opacity-40" />
      <div className="relative mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display text-[10px] tracking-[0.34em] text-[#C0C0C8] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F2F4F8] sm:text-[2.3rem]"
        >
          Written in Silver
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#D9D9DE]/85 sm:text-[1.06rem]"
        >
          From a first glance to a forever promise, every chapter has led us to this silver night.
        </motion.p>

        {/* Three horizontal photo cards, side by side — the middle
            card sits lower (stepped art-deco rhythm). */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 grid w-full grid-cols-1 gap-5 sm:mt-11 sm:grid-cols-3 sm:gap-5"
        >
          {cards.map((card, i) => (
            <figure
              key={`${card.src}-${i}`}
              className={`group relative ${i === 1 ? "sm:translate-y-6" : ""}`}
            >
              <div className="relative overflow-hidden border border-[#C0C0C8]/50 bg-[#12294D] p-2 shadow-[0_16px_32px_-12px_rgba(6,18,43,0.7)]">
                <div className="relative aspect-[4/3] overflow-hidden">
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06122B]/50 via-transparent to-transparent"
                  />
                </div>
                <figcaption className="flex items-center justify-center gap-2 px-2 pt-3 pb-1.5 sr-font-display text-[10px] tracking-[0.24em] text-[#D9D9DE] uppercase">
                  <Camera className="h-3 w-3 text-[#C0C0C8]" />
                  {card.caption}
                </figcaption>
              </div>
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#C0C0C8]/70 px-6 py-3 sr-font-display text-[11px] tracking-[0.28em] text-[#F2F4F8] uppercase transition-colors duration-300 hover:border-[#F2F4F8] hover:bg-[#F2F4F8] hover:text-[#0A1F44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8] sm:mt-12 sm:text-xs"
          >
            <Heart className="h-3.5 w-3.5 text-[#C0C0C8] transition-colors group-hover:text-[#0A1F44]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#C0C0C8]/50 md:block" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#C0C0C8]/40 md:block" />
    </NightSurface>
  );
}
