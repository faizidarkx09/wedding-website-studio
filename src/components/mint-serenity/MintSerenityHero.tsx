// Mint Serenity invitation-view sections — welcome introduction,
// months-aware countdown on a deep-sage band, and the story
// preview: floating BUBBLE photos of staggered sizes (not photo
// cards). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BubbleDivider, PaperSurface } from "./Decor";
import {
  FONT_BODY,
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

export function MintSerenityIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      {/* Drifting bubble accents */}
      <span aria-hidden="true" className="pointer-events-none absolute top-10 left-6 h-10 w-10 rounded-full border border-[#065F46]/25 bg-white/50" />
      <span aria-hidden="true" className="pointer-events-none absolute right-8 bottom-16 h-6 w-6 rounded-full border border-[#065F46]/25 bg-white/60" />
      <span aria-hidden="true" className="pointer-events-none absolute top-24 right-14 h-4 w-4 rounded-full bg-[#A7F3D0]/70" />

      {/* Letterpress invitation copy */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="text-[10px] tracking-[0.34em] text-[#047857] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#052E22]"
        >
          {heading}
        </motion.h2>

        {/* Bubble divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <BubbleDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_SCRIPT}
          className="mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#047857]"
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
                style={FONT_EDITORIAL}
                className="mt-3 text-center text-[1.02rem] leading-[1.75] text-[#052E22]/85 first:mt-0"
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
/* Countdown — "A Day of Mint Serenity Awaits"                       */
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

export function MintSerenityCountdown({ site }: { site: WeddingSite }) {
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
      <p style={FONT_DISPLAY} className="text-[10px] tracking-[0.34em] text-[#6EE7B7] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3
        style={FONT_DISPLAY}
        className="mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFFFFF]"
      >
        A Day of Mint Serenity Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#A7F3D0]/90 to-transparent"
      />

      <p style={FONT_EDITORIAL} className="mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#D1FAE5]/90">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — rising bubbles: five glass bubbles at staggered
          heights, numbers and labels in white, tiny bubble trails
          drifting up; the seconds bubble bobs gently. 3 + 2 grid in
          narrow containers (container queries, so the editor preview
          renders the mobile layout). */}
      <div
        role="timer"
        aria-live="off"
        className="@container mt-8 grid w-full grid-cols-3 items-end justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-end @min-[40rem]:justify-center @min-[40rem]:gap-x-6"
      >
        {units.map((unit, idx) => {
          const bobH = [56, 28, 40, 16, 8][idx];
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
              {/* Bubble trail — tiny bubbles rising above the bubble */}
              <span
                aria-hidden="true"
                className="mb-1 flex flex-col items-center justify-end gap-1"
                style={{ height: `${bobH}px` }}
              >
                <span className="h-1 w-1 rounded-full border border-white/70" />
                <span className="h-1.5 w-1.5 rounded-full border border-white/60" />
                <span className="h-2 w-2 rounded-full border border-white/50" />
              </span>
              {/* Glass bubble with the number */}
              <motion.span
                animate={
                  idx === 4 && !prefersReducedMotion ? { y: [0, -6, 0] } : undefined
                }
                transition={{ duration: 2.4, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
                style={FONT_DISPLAY}
                className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/10 text-[1.55rem] font-semibold text-[#FFFFFF] shadow-[0_6px_16px_rgba(0,0,0,0.25),inset_0_0_12px_rgba(255,255,255,0.25)] tabular-nums backdrop-blur-sm @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[18%] left-[22%] h-2.5 w-2.5 rounded-full bg-white/80"
                />
                {String(unit.value).padStart(2, "0")}
              </motion.span>
              <span style={FONT_DISPLAY} className="mt-2.5 text-[9px] tracking-[0.3em] text-[#FFFFFF] uppercase">
                {unit.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p style={FONT_DISPLAY} className="text-xs tracking-[0.3em] text-[#FFFFFF] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            style={FONT_EDITORIAL}
            className="flex items-center gap-1.5 text-sm text-[#D1FAE5]/85 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A7F3D0]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — floating bubble photos of staggered sizes          */
/* ------------------------------------------------------------------ */

/** Bubble sizes/positions (staggered, like bubbles rising): the
 * first bubble is the largest, the rest float around it.
 * Container queries (@min-[40rem]: on the @container parent) —
 * never viewport `sm:` — so the editor's Mobile (390px) preview
 * keeps the mobile bubble sizes. */
const BUBBLE_STYLES = [
  "h-44 w-44 @min-[40rem]:h-52 @min-[40rem]:w-52",
  "h-36 w-36 @min-[40rem]:h-44 @min-[40rem]:w-44 mt-10 @min-[40rem]:mt-14",
  "h-40 w-40 @min-[40rem]:h-48 @min-[40rem]:w-48",
  "h-32 w-32 @min-[40rem]:h-40 @min-[40rem]:w-40 mt-8 @min-[40rem]:mt-12",
] as const;

export function MintSerenityStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const bubbles = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 bubble photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="wash" className="@container px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="text-[10px] tracking-[0.34em] text-[#047857] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_DISPLAY}
          className="mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#052E22]"
        >
          Our Story, Floating on Air
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          style={FONT_EDITORIAL}
          className="mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#052E22]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this gentle day.
        </motion.p>

        {/* Floating bubble photos — circles of staggered sizes, each
            with a caption chip beneath; hover lifts the bubble. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex w-full flex-wrap items-start justify-center gap-4 @min-[40rem]:gap-6"
        >
          {bubbles.map((bubble, i) => (
            <motion.figure
              key={`${bubble.src}-${i}`}
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [0, -6, 0] }
              }
              transition={{
                duration: 5 + i * 0.8,
                repeat: Infinity,
                ease: [0.25, 0.1, 0.25, 1],
                delay: i * 0.4,
              }}
              className="group flex flex-col items-center"
            >
              <div
                className={`relative overflow-hidden rounded-full bg-white shadow-[0_18px_32px_-12px_rgba(6,95,70,0.45)] ring-4 ring-white ${BUBBLE_STYLES[i % BUBBLE_STYLES.length]}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bubble.src}
                  alt={bubble.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-[#065F46]/25 via-transparent to-white/20"
                />
                {/* Bubble highlight */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[12%] left-[16%] h-[14%] w-[14%] rounded-full bg-white/80"
                />
              </div>
              <figcaption
                style={FONT_BODY}
                className="mt-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-[#052E22] uppercase shadow-[0_6px_14px_-6px_rgba(6,95,70,0.4)]"
              >
                <Camera className="h-3 w-3 text-[#047857]" />
                {bubble.caption}
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
            style={FONT_DISPLAY}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-[#065F46] px-7 py-3 text-[11px] tracking-[0.28em] text-white uppercase shadow-[0_10px_22px_-8px_rgba(6,95,70,0.6)] transition-colors duration-300 hover:bg-[#047857] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
          >
            <Heart className="h-3.5 w-3.5 text-[#A7F3D0] transition-colors group-hover:text-white" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>
    </PaperSurface>
  );
}
