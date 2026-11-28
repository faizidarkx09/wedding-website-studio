// Autumn Harvest invitation-view sections — welcome introduction,
// months-aware countdown on a burnt-orange band, and the story
// preview: a MASONRY grid of varied-height photos (not uniform
// cards, not a film strip). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, Leaf, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FallingLeaves, LeafDivider, PaperSurface } from "./Decor";
import {
  STORY_ASPECTS,
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

export function AutumnHarvestIntroduction({ site }: { site: WeddingSite }) {
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
          className="ah-font-display text-[10px] font-semibold tracking-[0.34em] text-[#9C3D12] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-display mt-4 text-[2.1rem] leading-[1.12] font-semibold tracking-[0.01em] text-[#5C3A21]"
        >
          {heading}
        </motion.h2>

        {/* Leaf divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <LeafDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#C05621]"
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
                className="ah-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#5C3A21]/85 first:mt-0"
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
/* Countdown — "An Autumn Day Awaits"                                */
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

export function AutumnHarvestCountdown({ site }: { site: WeddingSite }) {
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
    <div className="relative">
      {!prefersReducedMotion && <FallingLeaves />}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pt-14 pb-14 text-center"
      >
        <p className="ah-font-display text-[10px] font-semibold tracking-[0.34em] text-white uppercase">
          THE COUNTDOWN BEGINS
        </p>

        <h3 className="ah-font-display mt-3 text-[1.7rem] leading-[1.12] font-semibold tracking-[0.01em] text-white">
          An Autumn Day Awaits
        </h3>

        <div
          aria-hidden="true"
          className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#FFF7E8]/90 to-transparent"
        />

        <p className="ah-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-white">
          Join us as we count down to a day of falling leaves, warm light, and cherished memories.
        </p>

        {/* Countdown — kraft ticket stubs: a cream ticket card with a
            dashed perforation edge, a leaf marker, a dark-brown
            number and a deep-orange label. The clock VALUES sit on
            cream (#FFF7E8), never on the orange band, so they stay
            high-contrast at every size; the eyebrow / heading /
            intro / date / venue lines stay white on the burnt-orange
            band (#C05621, 4.57 — the live-verified combo). The old
            light-orange #E8A05C labels (2.09) are gone for good.
            5 units, 2 lines of 3 + 2 in narrow containers, one row
            in wide containers (container queries, so the editor
            preview renders the mobile layout). */}
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
              <div className="relative w-[4.4rem] @min-[40rem]:w-[5rem]">
                {/* Ticket punch-hole notches on the stub edges */}
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -left-[5px] z-10 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#3A2412]"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-[5px] z-10 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-[#3A2412]"
                />
                {/* Dashed perforation edge around the stub */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[5px] z-10 rounded-[4px] border border-dashed border-[#C05621]/30"
                />
                <div className="flex flex-col items-center rounded-[6px] bg-[#FFF7E8] px-1 pt-2.5 pb-2 shadow-[0_10px_24px_-8px_rgba(58,36,18,0.55)] ring-1 ring-[#7A2E0D]/20">
                  <Leaf aria-hidden="true" className="h-3.5 w-3.5 text-[#9C3D12]" />
                  <span className="ah-font-display mt-1 text-[1.5rem] leading-none font-bold text-[#3A2412] tabular-nums @min-[40rem]:text-[1.8rem]">
                    <span suppressHydrationWarning>{String(unit.value).padStart(2, "0")}</span>
                  </span>
                  {/* Tear line between the number and the label */}
                  <span
                    aria-hidden="true"
                    className="mt-2 w-3/4 border-t border-dashed border-[#C05621]/50"
                  />
                  <span className="ah-font-display mt-1.5 text-[8px] font-bold tracking-[0.22em] text-[#9C3D12] uppercase @min-[40rem]:text-[9px]">
                    {unit.label}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-9 flex flex-col items-center gap-1.5">
          <p className="ah-font-display text-xs font-semibold tracking-[0.3em] text-white uppercase">
            {formatLongDate(site.weddingDate, site.timezone)}
          </p>
          {lines.map((line, i) => (
            <p
              key={i}
              className="ah-font-editorial flex items-center gap-1.5 text-sm text-white italic"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#FFF7E8]" />
              {line}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — MASONRY grid of varied-height photos with kraft   */
/* caption tags (not uniform cards, not a film strip).               */
/* ------------------------------------------------------------------ */

export function AutumnHarvestStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const tiles = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 6 masonry photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 6).map((g) => g.url);
    const base = gallery.length >= 6 ? gallery : TEMPLATE_PHOTOS.slice(0, 6);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
      aspect: STORY_ASPECTS[i % STORY_ASPECTS.length],
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="cream" className="@container px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-display text-[10px] font-semibold tracking-[0.34em] text-[#9C3D12] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-display mt-3 text-[1.9rem] leading-[1.12] font-semibold tracking-[0.01em] text-[#5C3A21]"
        >
          Gathered Like Autumn Leaves
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="ah-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#5C3A21]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this harvest day.
        </motion.p>

        {/* Masonry — CSS columns, varied tile heights, kraft caption tags */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 w-full columns-2 gap-4 @min-[40rem]:columns-3 [&>*]:mb-4"
        >
          {tiles.map((tile, i) => (
            <figure
              key={`${tile.src}-${i}`}
              className="group relative break-inside-avoid overflow-hidden rounded-[4px] bg-[#FFFDF6] shadow-[0_14px_28px_-10px_rgba(92,58,33,0.4)] ring-1 ring-[#C05621]/30"
            >
              <div className={`relative ${tile.aspect} overflow-hidden`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3A2412]/30 via-transparent to-transparent"
                />
              </div>
              <figcaption className="flex items-center justify-center gap-1.5 bg-[#FFFDF6] px-2 py-3 text-[10px] font-medium tracking-[0.2em] text-[#5C3A21] uppercase">
                <Leaf className="h-3 w-3 text-[#C05621]" />
                {tile.caption}
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#C05621]/70 px-6 py-3 ah-font-display text-[11px] font-semibold tracking-[0.28em] text-[#5C3A21] uppercase transition-colors duration-300 hover:border-[#5C3A21] hover:bg-[#5C3A21] hover:text-[#FFF7E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C05621]"
          >
            <Heart className="h-3.5 w-3.5 text-[#C05621] transition-colors group-hover:text-[#E8A05C]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative leaf accents */}
      <Camera className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#C05621]/50" />
      <Leaf className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#C05621]/40" />
    </PaperSurface>
  );
}
