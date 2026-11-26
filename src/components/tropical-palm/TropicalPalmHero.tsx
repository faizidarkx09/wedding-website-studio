// Tropical Palm invitation-view sections — welcome introduction,
// months-aware countdown on a deep-palm band, and the story
// preview: an island-hop strip — a horizontal scroll-snap row of
// island stops, each card wearing a green leaf tab (not a photo
// grid). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Palmtree, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, PalmDivider } from "./Decor";
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

export function TropicalPalmIntroduction({ site }: { site: WeddingSite }) {
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
          className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#14301C]"
        >
          {heading}
        </motion.h2>

        {/* Palm divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <PalmDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#166534]"
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
                className="tp-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#14301C]/85 first:mt-0"
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
/* Countdown — "An Island Day Awaits"                                */
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

export function TropicalPalmCountdown({ site }: { site: WeddingSite }) {
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
      <p className="tp-font-display text-[10px] tracking-[0.34em] text-[#4ADE80] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="tp-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFFBEB]">
        An Island Day Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent"
      />

      <p className="tp-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#FEF3C7]/85">
        Join us as we count down to a day of sun, sea and sand — and the beginning of forever.
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
            <span className="tp-font-display flex h-16 w-16 items-center justify-center rounded-full border border-[#06B6D4]/70 bg-[#0A2E19]/70 text-[1.55rem] font-normal text-[#FFFDF9] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(10,46,25,0.4)] tabular-nums @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="tp-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#4ADE80] uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="tp-font-display text-xs tracking-[0.3em] text-[#FFFBEB] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="tp-font-editorial flex items-center gap-1.5 text-sm text-[#FEF3C7]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#06B6D4]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — island-hop strip: a horizontal scroll-snap row of  */
/* island stops, each card wearing a green leaf tab on top.          */
/* ------------------------------------------------------------------ */

export function TropicalPalmStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 island photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      stop: `ISLAND ${i + 1}`,
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
          className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#14301C]"
        >
          Island-Hopping Through Our Story
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="tp-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#14301C]/85"
        >
          From a first glance to a forever promise, every island we stopped at brought us closer
          to this day.
        </motion.p>

        {/* Island-hop strip — horizontal scroll-snap on mobile, a
            4-stop row on wide containers. Each stop wears a green
            leaf tab above its photo. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="@container mt-9 w-full"
        >
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 @min-[40rem]:grid @min-[40rem]:grid-cols-4 @min-[40rem]:overflow-visible @min-[40rem]:pb-0">
            {cards.map((card, i) => (
              <figure
                key={`${card.src}-${i}`}
                className="group relative w-[72%] shrink-0 snap-center overflow-hidden rounded-t-[4px] rounded-b-[4px] bg-[#FFFDF6] shadow-[0_14px_28px_-10px_rgba(20,83,45,0.4)] ring-1 ring-[#15803D]/30 @min-[40rem]:w-auto"
              >
                {/* Leaf tab */}
                <div className="flex items-center justify-center gap-1.5 bg-[#14532D] px-2 py-2 text-[9px] tracking-[0.24em] text-[#FDE68A] uppercase">
                  <Palmtree className="h-3 w-3 text-[#4ADE80]" />
                  {card.stop}
                </div>
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
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14532D]/30 via-transparent to-transparent"
                  />
                </div>
                <figcaption className="flex items-center justify-center gap-1.5 bg-[#FFFDF6] px-2 py-3 text-[10px] tracking-[0.2em] text-[#14301C] uppercase">
                  <Camera className="h-3 w-3 text-[#166534]" />
                  {card.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="tp-font-editorial mt-3 text-sm text-[#14301C]/60 italic @min-[40rem]:hidden">
            Swipe to hop between islands →
          </p>
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#15803D]/70 px-6 py-3 tp-font-display text-[11px] tracking-[0.28em] text-[#14301C] uppercase transition-colors duration-300 hover:border-[#14532D] hover:bg-[#14532D] hover:text-[#FFFBEB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803D]"
          >
            <Heart className="h-3.5 w-3.5 text-[#166534] transition-colors group-hover:text-[#4ADE80]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#15803D]/50" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#15803D]/40" />
    </PaperSurface>
  );
}
