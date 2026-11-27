// Ocean Pearl invitation-view sections — welcome introduction,
// months-aware countdown on a deep-sea band with bubble numerals,
// and the story preview: a HORIZONTAL SCROLL strip (swipeable photo
// row with captions below — not photo cards, not a timeline). Only
// the data comes from the site.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, Heart, MapPin, Waves } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, WaveDivider } from "./Decor";
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

export function OceanPearlIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      {/* Invitation copy */}
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#1F6B78] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display mt-4 text-[2.1rem] leading-[1.12] font-bold tracking-[0.02em] text-[#0E3A45]"
        >
          {heading}
        </motion.h2>

        {/* Wave divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <WaveDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display mt-3 text-[1.9rem] leading-[1.15] font-bold tracking-[0.03em] text-[#2E8B9A] uppercase"
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
                className="op-font-body mt-3 text-center text-[1.02rem] leading-[1.75] text-[#0E3A45]/85 first:mt-0"
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
/* Countdown — "A Day by the Sea Awaits"                             */
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

export function OceanPearlCountdown({ site }: { site: WeddingSite }) {
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
      <p className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#7FC4CE] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="op-font-display mt-3 text-[1.7rem] leading-[1.12] font-bold tracking-[0.02em] text-[#F7FBFC]">
        A Day by the Sea Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#7FC4CE]/90 to-transparent"
      />

      <p className="op-font-body mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#D8EDEF]/85">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — "Tide bubbles": the five units are bubbles
          resting on a common sea-floor baseline, DESCENDING in size
          from months (largest) to seconds (smallest), each gently
          bobbing like it's floating. Numbers are white inside the
          bubbles, labels white below (contrast ~15:1 on the
          deep-sea band). Container queries, so the editor preview
          renders the mobile layout. */}
      <div
        role="timer"
        aria-live="off"
        className="@container mt-8 flex w-full items-end justify-center gap-2 @min-[40rem]:gap-3"
      >
        {units.map((unit, idx) => {
          const size = [
            { bubble: "h-20 w-20 @min-[40rem]:h-[5.5rem] @min-[40rem]:w-[5.5rem]", text: "text-[1.45rem] @min-[40rem]:text-[1.7rem]" },
            { bubble: "h-[4.5rem] w-[4.5rem] @min-[40rem]:h-20 @min-[40rem]:w-20", text: "text-[1.3rem] @min-[40rem]:text-[1.5rem]" },
            { bubble: "h-16 w-16 @min-[40rem]:h-[4.5rem] @min-[40rem]:w-[4.5rem]", text: "text-[1.2rem] @min-[40rem]:text-[1.35rem]" },
            { bubble: "h-14 w-14 @min-[40rem]:h-16 @min-[40rem]:w-16", text: "text-[1.05rem] @min-[40rem]:text-[1.2rem]" },
            { bubble: "h-12 w-12 @min-[40rem]:h-14 @min-[40rem]:w-14", text: "text-[0.95rem] @min-[40rem]:text-[1.05rem]" },
          ][idx] ?? { bubble: "h-14 w-14", text: "text-[1.05rem]" };
          return (
            <motion.div
              key={unit.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              <motion.span
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { y: [0, -4, 0] }
                }
                transition={{ duration: 3.2, delay: idx * 0.45, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
                className={`op-font-display relative flex items-center justify-center rounded-full border border-[#7FC4CE]/70 bg-[#0E3A45]/60 font-bold text-white shadow-[inset_0_1px_4px_rgba(255,255,255,0.12),0_6px_16px_rgba(14,58,69,0.4)] tabular-nums ${size.bubble} ${size.text}`}
              >
                {String(unit.value).padStart(2, "0")}
                <span
                  aria-hidden="true"
                  className="absolute top-[18%] left-[22%] h-[18%] w-[18%] rounded-full bg-white/70"
                />
              </motion.span>
              <span className="op-font-display mt-2.5 text-[8px] font-semibold tracking-[0.26em] text-[#FFFFFF] uppercase @min-[40rem]:text-[9px]">
                {unit.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="op-font-display text-xs font-semibold tracking-[0.3em] text-[#F7FBFC] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="op-font-body flex items-center gap-1.5 text-sm text-[#D8EDEF]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7FC4CE]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryStrip — the horizontal-scroll strip shared by the preview    */
/* and the story page: a swipeable photo row with captions below     */
/* each photo. The buyer's own gallery photos win; otherwise the     */
/* template's 3 ocean photos (never seeded onto a buyer site —       */
/* preview only).                                                    */
/* ------------------------------------------------------------------ */

export function useStoryStrip(site: WeddingSite) {
  return useMemo(() => {
    const gallery = (site.gallery ?? []).map((g) => g.url);
    const base = gallery.length >= 3 ? gallery.slice(0, 6) : TEMPLATE_PHOTOS.slice(0, 3);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);
}

export function StoryStrip({ items }: { items: { src: string; caption: string; alt: string }[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 264, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      <div
        ref={stripRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <figure
            key={`${item.src}-${i}`}
            className="group relative w-[240px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-white shadow-[0_14px_28px_-10px_rgba(14,58,69,0.4)] ring-1 ring-[#2E8B9A]/30 @min-[40rem]:w-[264px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E3A45]/30 via-transparent to-transparent"
              />
            </div>
            <figcaption className="flex items-center justify-center gap-1.5 bg-white px-2 py-3 text-[10px] font-semibold tracking-[0.2em] text-[#0E3A45] uppercase">
              <Camera className="h-3 w-3 text-[#2E8B9A]" />
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Strip controls + swipe hint */}
      <div className="mt-1 flex items-center justify-between">
        <p className="op-font-body flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-[#1F6B78]/80 uppercase">
          <Waves className="h-4 w-4 text-[#2E8B9A]" />
          Swipe to explore
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll story photos left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2E8B9A]/60 bg-white text-[#0E3A45] transition-colors hover:border-[#0E3A45] hover:bg-[#D8EDEF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E8B9A]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll story photos right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2E8B9A]/60 bg-white text-[#0E3A45] transition-colors hover:border-[#0E3A45] hover:bg-[#D8EDEF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E8B9A]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — horizontal-scroll strip on the invitation view     */
/* ------------------------------------------------------------------ */

export function OceanPearlStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const items = useStoryStrip(site);

  return (
    <PaperSurface variant="pearl" className="px-4 py-14">
      <div className="@container mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display text-[10px] font-semibold tracking-[0.34em] text-[#1F6B78] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-display mt-3 text-[1.9rem] leading-[1.12] font-bold tracking-[0.02em] text-[#0E3A45]"
        >
          Our Story, Riding the Waves
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="op-font-body mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#0E3A45]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this day by the sea.
        </motion.p>

        {/* Horizontal-scroll strip */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 w-full text-left"
        >
          <StoryStrip items={items} />
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#2E8B9A]/70 px-6 py-3 op-font-display text-[11px] font-semibold tracking-[0.28em] text-[#0E3A45] uppercase transition-colors duration-300 hover:border-[#0E3A45] hover:bg-[#0E3A45] hover:text-[#F7FBFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E8B9A]"
          >
            <Heart className="h-3.5 w-3.5 text-[#2E8B9A] transition-colors group-hover:text-[#7FC4CE]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>
    </PaperSurface>
  );
}
