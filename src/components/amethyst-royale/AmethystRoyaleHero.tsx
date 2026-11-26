// Amethyst Royale invitation-view sections — welcome
// introduction, months-aware countdown on a deep-amethyst band with
// hexagonal number tiles, and the story preview: faceted HEXAGON
// gem cards (not rectangular photo cards, not a film strip). Only
// the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Gem, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FacetDivider, PaperSurface } from "./Decor";
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

export function AmethystRoyaleIntroduction({ site }: { site: WeddingSite }) {
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
          className="ar-font-display text-[10px] tracking-[0.34em] text-[#5B21B6] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E1065]"
        >
          {heading}
        </motion.h2>

        {/* Facet divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <FacetDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#5B21B6]"
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
                className="ar-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#2E1065]/85 first:mt-0"
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
/* Countdown — "A Day of Amethyst Light Awaits"                      */
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

export function AmethystRoyaleCountdown({ site }: { site: WeddingSite }) {
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
      <p className="ar-font-display text-[10px] tracking-[0.34em] text-[#C4B5FD] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="ar-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F5F0FA]">
        A Day of Amethyst Light Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#C4B5FD]/90 to-transparent"
      />

      <p className="ar-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#E9D5FF]/85">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — 5 hexagonal tiles, 2 lines of 3 + 2 in narrow
          containers, one row in wide containers (container queries,
          so the editor preview renders the mobile layout). */}
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
            <span
              className="ar-font-display flex h-16 w-16 items-center justify-center bg-[#2E1065]/80 text-[1.55rem] font-normal text-[#FFFDFF] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(46,16,101,0.4)] tabular-nums @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]"
              style={{
                clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
              }}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="ar-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#C4B5FD] uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="ar-font-display text-xs tracking-[0.3em] text-[#F5F0FA] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="ar-font-editorial flex items-center gap-1.5 text-sm text-[#E9D5FF]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C4B5FD]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — faceted HEXAGON gem cards with caption chips       */
/* ------------------------------------------------------------------ */

export function AmethystRoyaleStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 faceted photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="lavender" className="px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display text-[10px] tracking-[0.34em] text-[#5B21B6] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E1065]"
        >
          Our Story in Amethyst Light
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="ar-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#2E1065]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this violet day.
        </motion.p>

        {/* Faceted hexagon gem cards — photo clipped to a pointy-top
            hexagon, caption in a small facet chip below. Even cards
            sit lower for a honeycomb stagger. */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 grid w-full grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4"
        >
          {cards.map((card, i) => (
            <figure
              key={`${card.src}-${i}`}
              className={`group relative flex flex-col items-center ${i % 2 === 1 ? "translate-y-5" : ""}`}
            >
              <div
                className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_14px_28px_-10px_rgba(46,16,101,0.4)] ring-1 ring-[#7C3AED]/30"
                style={{
                  clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                }}
              >
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
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E1065]/30 via-transparent to-transparent"
                />
              </div>
              <figcaption className="mt-3 flex items-center gap-1.5 border border-[#7C3AED]/40 bg-[#FFFDFF] px-3 py-1.5 text-[10px] tracking-[0.2em] text-[#2E1065] uppercase shadow-[0_6px_14px_-6px_rgba(46,16,101,0.35)]">
                <Camera className="h-3 w-3 text-[#5B21B6]" />
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
            className="group mt-12 inline-flex items-center gap-2 border border-[#7C3AED]/70 px-6 py-3 ar-font-display text-[11px] tracking-[0.28em] text-[#2E1065] uppercase transition-colors duration-300 hover:border-[#2E1065] hover:bg-[#2E1065] hover:text-[#F5F0FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C3AED]"
          >
            <Gem className="h-3.5 w-3.5 text-[#5B21B6] transition-colors group-hover:text-[#C4B5FD]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative gem accents */}
      <Gem className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#7C3AED]/50" />
      <Gem className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#7C3AED]/40" />
    </PaperSurface>
  );
}
