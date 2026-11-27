// Sakura Dream invitation-view sections — welcome introduction,
// months-aware countdown on a deep-plum band with falling petals,
// and the story preview: photos winding down a petal path (not
// photo cards, not a film strip). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { Blossom, PaperSurface, PetalDivider, SakuraPetals } from "./Decor";
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

export function SakuraDreamIntroduction({ site }: { site: WeddingSite }) {
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
          className="sd-font-display text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E0A3D]"
        >
          {heading}
        </motion.h2>

        {/* Petal divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <PetalDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#6B21A8]"
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
                className="sd-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#2E0A3D]/85 first:mt-0"
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
/* Countdown — "A Day Beneath the Blossoms Awaits"                   */
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

export function SakuraDreamCountdown({ site }: { site: WeddingSite }) {
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
      className="relative @container mx-auto flex max-w-[640px] flex-col items-center px-4 pb-14 text-center"
    >
      {!prefersReducedMotion && <SakuraPetals />}
      <p className="relative z-10 sd-font-display text-[10px] tracking-[0.34em] text-[#FFFFFF] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="relative z-10 sd-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFFFFF]">
        A Day Beneath the Blossoms Awaits
      </h3>

      <div
        aria-hidden="true"
        className="relative z-10 mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#F9A8D4]/90 to-transparent"
      />

      <p className="relative z-10 sd-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#FFFFFF]">
        Join us as we count down to a day filled with love, laughter, and petals in the air.
      </p>

      {/* Countdown — petal-ring discs on a branch: five white discs,
          each ringed in deep pink with a pale-pink inner ring and a
          tiny blossom at its crown, joined by one thin branch line
          (wide containers only) with a single petal drifting down
          over it. 2 lines of 3 + 2 in narrow containers, one row in
          wide containers (container queries, so the editor preview
          renders the mobile layout). Contrast (computed, vs the
          deep-plum band #6B21A8 — the band's gradient only darkens
          toward #2E0A3D, which raises every ratio): number #2E0A3D
          on white disc 16.87, eyebrow/label/date/intro/venue white
          8.72 on #6B21A8 (6.25 even at the lightest point of the
          band's pink glow, #9C30A2) — all ≥ 4.5. */}
      <div className="relative z-10 mt-8 w-full">
        {/* Branch line joining the discs (wide containers only) */}
        <div
          aria-hidden="true"
          className="absolute top-[2.4rem] right-[12%] left-[12%] hidden h-[2px] bg-gradient-to-r from-[#F9A8D4]/70 via-[#EC4899] to-[#F9A8D4]/70 @min-[40rem]:block"
        />
        {/* One petal drifting down over the branch */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="absolute -top-3 left-[16%] z-20 hidden @min-[40rem]:block"
            animate={{ y: [0, 30, 0], x: [0, 12, -6, 0], rotate: [0, 45, -25, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
          >
            <Blossom className="h-5 w-5" />
          </motion.div>
        )}
        <div
          role="timer"
          aria-live="off"
          className="relative @container grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-6"
        >
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col items-center ${idx >= 3 ? "col-span-1" : ""} ${
                idx === 3 ? "col-start-1 @min-[40rem]:col-start-auto" : ""
              }`}
            >
              {/* Petal-ring disc — white, deep-pink ring, pale-pink
                  inner ring, blossom at the crown */}
              <span
                className="sd-font-display relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#EC4899] bg-[#FFFDFB] text-[1.55rem] font-normal text-[#2E0A3D] tabular-nums @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]"
                style={{
                  boxShadow:
                    "inset 0 0 0 2px #FBCFE8, 0 0 0 4px rgba(249, 168, 212, 0.35), 0 8px 20px rgba(46, 10, 61, 0.45)",
                }}
              >
                {String(unit.value).padStart(2, "0")}
                <span aria-hidden="true" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Blossom className="h-5 w-5 drop-shadow-[0_2px_6px_rgba(46,10,61,0.35)]" />
                </span>
              </span>
              <span className="sd-font-display mt-3 text-[10px] tracking-[0.3em] text-[#FFFFFF] uppercase">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-9 flex flex-col items-center gap-1.5">
        <p className="sd-font-display text-xs tracking-[0.3em] text-[#FFFFFF] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="sd-font-editorial flex items-center gap-1.5 text-sm text-[#FFFFFF] italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F9A8D4]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — photos winding down a petal path: each photo      */
/* alternates left / right of a winding dashed blossom path, with   */
/* a blossom marker where the path meets it.                         */
/* ------------------------------------------------------------------ */

export function SakuraDreamStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 blossom photos (never seeded onto a buyer site — preview only).
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
          className="sd-font-display text-[10px] tracking-[0.34em] text-[#6B21A8] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#2E0A3D]"
        >
          Our Story Along the Petal Path
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#2E0A3D]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this day beneath
          the blossoms.
        </motion.p>

        {/* Petal path — a winding dashed curve down the centre, with
            the photos alternating left / right of it. On narrow
            containers the photos stack centred and the path runs
            straight down the middle behind them. */}
        <div className="@container relative mt-10 w-full max-w-[760px]">
          {/* Winding path (desktop) / straight path (narrow) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 760 900"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full @min-[40rem]:block"
          >
            <path
              d="M 380 0 C 260 120, 500 220, 380 340 C 260 460, 500 560, 380 680 C 300 780, 430 840, 380 900"
              fill="none"
              stroke="#EC4899"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 border-l-2 border-dashed border-[#EC4899]/50 @min-[40rem]:hidden"
          />

          <div className="relative flex flex-col gap-10">
            {cards.map((card, i) => {
              const left = i % 2 === 0;
              return (
                <motion.figure
                  key={`${card.src}-${i}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.85, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`group relative mx-auto w-full max-w-[300px] @min-[40rem]:w-[46%] ${
                    left ? "@min-[40rem]:mr-auto @min-[40rem]:ml-0" : "@min-[40rem]:ml-auto @min-[40rem]:mr-0"
                  }`}
                >
                  {/* Blossom marker where the path meets the photo */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-1/2 z-10 hidden -translate-y-1/2 @min-[40rem]:block ${
                      left ? "-right-8" : "-left-8"
                    }`}
                  >
                    <Blossom className="h-9 w-9 drop-shadow-[0_4px_10px_rgba(107,33,168,0.3)]" />
                  </span>
                  <div className="relative overflow-hidden rounded-full bg-[#FFFDFB] shadow-[0_16px_32px_-12px_rgba(46,10,61,0.45)] ring-4 ring-white">
                    <div className="relative aspect-square overflow-hidden rounded-full">
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
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E0A3D]/30 via-transparent to-transparent"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 flex items-center justify-center gap-1.5 text-[10px] tracking-[0.2em] text-[#2E0A3D] uppercase">
                    <Camera className="h-3 w-3 text-[#EC4899]" />
                    {card.caption}
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>

        {/* Read Our Full Story */}
        {willRenderSection(site, "story") && (
          <motion.button
            type="button"
            onClick={onOpenStory}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="group mt-10 inline-flex items-center gap-2 border border-[#EC4899]/70 px-6 py-3 sd-font-display text-[11px] tracking-[0.28em] text-[#2E0A3D] uppercase transition-colors duration-300 hover:border-[#2E0A3D] hover:bg-[#2E0A3D] hover:text-[#FFF7FB] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EC4899]"
          >
            <Heart className="h-3.5 w-3.5 text-[#EC4899] transition-colors group-hover:text-[#F9A8D4]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#EC4899]/50" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#EC4899]/40" />
    </PaperSurface>
  );
}
