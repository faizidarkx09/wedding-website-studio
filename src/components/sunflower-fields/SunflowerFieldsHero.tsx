// Sunflower Fields invitation-view sections — welcome
// introduction, months-aware countdown on a deep-green band with
// floating pollen, and the story preview: a horizontal FIELD ROW
// of photos on stems (not a grid of cards). Only the data comes
// from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, Pollen, SunflowerDivider } from "./Decor";
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
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function SunflowerFieldsIntroduction({ site }: { site: WeddingSite }) {
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
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#14532D]"
        >
          {heading}
        </motion.h2>

        {/* Sunflower divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <SunflowerDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_SCRIPT }}
          className="mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#166534]"
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
                className="mt-3 text-center text-[1.02rem] leading-[1.75] text-[#14532D]/85 first:mt-0"
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
/* Countdown — "A Field of Sunshine Awaits"                          */
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

export function SunflowerFieldsCountdown({ site }: { site: WeddingSite }) {
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
      className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pb-14 text-center"
    >
      <Pollen />
      <p
        style={{ fontFamily: FONT_DISPLAY }}
        className="text-[10px] tracking-[0.34em] text-[#FACC15] uppercase"
      >
        THE COUNTDOWN BEGINS
      </p>

      <h3
        style={{ fontFamily: FONT_DISPLAY }}
        className="mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFFBEB]"
      >
        A Field of Sunshine Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#FACC15]/90 to-transparent"
      />

      <p
        style={{ fontFamily: FONT_EDITORIAL }}
        className="mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#FEF9C3]/85"
      >
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — sunflower field: five sunflower heads on stems
          of different heights, numbers in the brown centres, labels
          below in white; the seconds flower sways in the breeze.
          3 + 2 grid in narrow containers (container queries, so the
          editor preview renders the mobile layout). */}
      <div role="timer" aria-live="off" className="@container relative z-10 mt-8 w-full">
        <div className="relative grid grid-cols-3 items-end justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-end @min-[40rem]:justify-center @min-[40rem]:gap-x-6">
          {units.map((unit, idx) => {
            const stemH = [72, 56, 64, 48, 40][idx];
            return (
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
                {/* Sunflower head — petal ring + brown centre with the number */}
                <motion.span
                  animate={
                    idx === 4 && !prefersReducedMotion
                      ? { rotate: [0, 3, -3, 0] }
                      : undefined
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
                  style={{ transformOrigin: "50% 100%" }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.4)] @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "repeating-conic-gradient(from 0deg, #FACC15 0deg 15deg, #EAB308 15deg 30deg)",
                    }}
                  />
                  <span
                    style={{ fontFamily: FONT_DISPLAY }}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#451A03] text-[1.35rem] font-semibold text-[#FFFBEB] tabular-nums @min-[40rem]:h-[3.3rem] @min-[40rem]:w-[3.3rem] @min-[40rem]:text-[1.6rem]"
                  >
                    {String(unit.value).padStart(2, "0")}
                  </span>
                </motion.span>
                {/* Stem */}
                <span
                  aria-hidden="true"
                  className="mt-1 w-[3px] bg-[#15803D]"
                  style={{ height: `${stemH}px` }}
                />
                <span
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="mt-2 text-[9px] tracking-[0.3em] text-[#FFFFFF] uppercase"
                >
                  {unit.label}
                </span>
              </motion.div>
            );
          })}
        </div>
        {/* Ground line the stems stand on */}
        <div
          aria-hidden="true"
          className="mx-auto mt-2 h-[2px] w-4/5 bg-[#15803D]/60"
        />
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-xs tracking-[0.3em] text-[#FFFBEB] uppercase"
        >
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            style={{ fontFamily: FONT_EDITORIAL }}
            className="flex items-center gap-1.5 text-sm text-[#FEF9C3]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FACC15]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — a FIELD ROW: photos in a horizontal scroll-snap   */
/* row, each standing on a green stem above a ground line (the      */
/* field, not a grid of cards).                                     */
/* ------------------------------------------------------------------ */

export function SunflowerFieldsStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 field photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="cream" className="px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#14532D]"
        >
          Our Story, Grown in the Field
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_EDITORIAL }}
          className="mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#14532D]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this sunny day.
        </motion.p>

        {/* Field row — horizontal scroll-snap on narrow screens,
            a four-across row on wide ones. Each photo stands on a
            green stem above the shared ground line. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 w-full"
        >
          <div className="@container flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] @min-[40rem]:grid @min-[40rem]:grid-cols-4 @min-[40rem]:overflow-visible @min-[40rem]:pb-0">
            {cards.map((card, i) => (
              <figure
                key={`${card.src}-${i}`}
                className="group w-[68vw] max-w-[260px] shrink-0 snap-center @min-[40rem]:w-auto @min-[40rem]:max-w-none"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-[#FFFEF5] shadow-[0_14px_28px_-10px_rgba(20,83,45,0.4)] ring-1 ring-[#EAB308]/40">
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14532D]/30 via-transparent to-transparent"
                  />
                </div>
                {/* Stem + caption */}
                <div aria-hidden="true" className="mx-auto h-8 w-0.5 bg-[#166534]/70" />
                <figcaption
                  style={{ fontFamily: FONT_DISPLAY }}
                  className="flex items-center justify-center gap-1.5 px-2 text-[10px] tracking-[0.2em] text-[#14532D] uppercase"
                >
                  <Camera className="h-3 w-3 text-[#166534]" />
                  {card.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          {/* Ground line the stems grow from */}
          <div
            aria-hidden="true"
            className="mx-auto mt-1 h-0.5 w-full max-w-[860px] rounded-full bg-gradient-to-r from-transparent via-[#166534]/50 to-transparent"
          />
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#EAB308]/70 px-6 py-3 text-[11px] tracking-[0.28em] text-[#14532D] uppercase transition-colors duration-300 hover:border-[#14532D] hover:bg-[#14532D] hover:text-[#FFFBEB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EAB308]"
          >
            <Heart className="h-3.5 w-3.5 text-[#166534] transition-colors group-hover:text-[#FACC15]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#EAB308]/50" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#EAB308]/40" />
    </PaperSurface>
  );
}
