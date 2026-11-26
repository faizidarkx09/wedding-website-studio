// Rustic Charm invitation-view sections — welcome introduction,
// months-aware countdown on a dark-bark band, and the story
// preview: a clothesline with photos pegged to a rope (not photo
// cards). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, Leaf, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BarnSurface, TwineDivider } from "./Decor";
import {
  STORY_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* Clothesline — a rope with wooden pegs holding the photos. Shared  */
/* by the invitation preview and the story page.                      */
/* ------------------------------------------------------------------ */

export function Clothesline({
  photos,
  captions,
}: {
  photos: string[];
  captions: readonly string[];
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="relative w-full">
      {/* The rope — a sagging jute line across the section */}
      <div
        aria-hidden="true"
        className="relative mx-auto h-3 w-full max-w-[980px]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 42%, #A16207 42%, #78350F 58%, transparent 58%, transparent 100%)",
        }}
      />
      {/* Pegged photos hanging from the rope */}
      <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-x-4 gap-y-8 px-1 pt-1 lg:grid-cols-4">
        {photos.map((src, i) => {
          const tilt = i % 2 === 0 ? "-rotate-[2.5deg]" : "rotate-[2deg]";
          return (
            <motion.figure
              key={`${src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative ${tilt}`}
            >
              {/* Wooden peg */}
              <span
                aria-hidden="true"
                className="absolute -top-3.5 left-1/2 z-20 h-5 w-3 -translate-x-1/2 rotate-[-4deg] rounded-[2px] bg-[#92400E] shadow-[0_2px_4px_rgba(45,26,3,0.5)] ring-1 ring-[#451A03]/40"
              />
              <div className="relative overflow-hidden rounded-[3px] bg-[#FFFDF6] p-2 pb-0 shadow-[0_16px_30px_-12px_rgba(45,26,3,0.5)] ring-1 ring-[#78350F]/30">
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Our Story — ${captions[i % captions.length]}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#451A03]/25 via-transparent to-transparent"
                  />
                </div>
                {/* Kraft caption tag */}
                <figcaption className="flex items-center justify-center gap-1.5 bg-[#FFFDF6] px-2 py-3 text-[10px] tracking-[0.2em] text-[#451A03] uppercase">
                  <Leaf className="h-3 w-3 text-[#4D7C0F]" />
                  {captions[i % captions.length]}
                </figcaption>
              </div>
            </motion.figure>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function RusticCharmIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      {/* Welcome letter copy */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display text-[10px] tracking-[0.34em] text-[#92400E] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#451A03]"
        >
          You Are Cordially Invited
        </motion.h2>

        {/* Twine divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <TwineDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#92400E]"
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
                className="rc-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#451A03]/85 first:mt-0"
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
/* Countdown — "A Day Among the Wildflowers Awaits"                  */
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

export function RusticCharmCountdown({ site }: { site: WeddingSite }) {
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
      <p className="rc-font-display text-[10px] tracking-[0.34em] text-[#D9F99D] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="rc-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FEF3C7]">
        A Day Among the Wildflowers Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#A16207]/90 to-transparent"
      />

      <p className="rc-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#FEF3C7]/85">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
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
            <span className="rc-font-display flex h-16 w-16 items-center justify-center rounded-full border border-[#A16207]/65 bg-[#451A03]/70 text-[1.55rem] font-normal text-[#FFFDF9] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(45,26,3,0.4)] tabular-nums @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="rc-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#D9F99D] uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="rc-font-display text-xs tracking-[0.3em] text-[#FEF3C7] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="rc-font-editorial flex items-center gap-1.5 text-sm text-[#FEF3C7]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D9F99D]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — the clothesline with pegged photos                 */
/* ------------------------------------------------------------------ */

export function RusticCharmStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 rustic photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <BarnSurface variant="cream" className="px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display text-[10px] tracking-[0.34em] text-[#92400E] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#451A03]"
        >
          Our Story on the Line
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="rc-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#451A03]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this barn-door day.
        </motion.p>

        {/* Clothesline — photos pegged to a rope */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 w-full"
        >
          <Clothesline photos={cards.map((c) => c.src)} captions={STORY_CAPTIONS} />
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
            className="group mt-10 inline-flex items-center gap-2 border border-[#78350F]/70 px-6 py-3 rc-font-display text-[11px] tracking-[0.28em] text-[#451A03] uppercase transition-colors duration-300 hover:border-[#451A03] hover:bg-[#451A03] hover:text-[#FEF3C7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#78350F]"
          >
            <Heart className="h-3.5 w-3.5 text-[#92400E] transition-colors group-hover:text-[#D9F99D]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>
    </BarnSurface>
  );
}
