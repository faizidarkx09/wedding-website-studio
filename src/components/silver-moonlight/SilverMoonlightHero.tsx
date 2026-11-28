// Silver Moonlight invitation-view sections — welcome
// introduction, months-aware countdown on a deep-night band, and
// the story preview: three moonlit photo cards. Only the data comes
// from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, MapPin, Heart, Moon } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { CrescentMoon, MoonDivider, NightSurface, TwinklingStars } from "./Decor";
import {
  MOON_CAPTIONS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function SilverMoonlightIntroduction({ site }: { site: WeddingSite }) {
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
          className="er-font-display text-[10px] tracking-[0.34em] text-[#2E3A4A] uppercase sm:text-xs"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#16202E] sm:mt-5 sm:text-[2.55rem]"
        >
          {heading}
        </motion.h2>

        {/* Animated silver moon divider — crescent draws in */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <MoonDivider className="w-44" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#2E3A4A] sm:mt-4 sm:text-[2.75rem]"
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
                className="er-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#16202E]/85 first:mt-0 sm:text-[1.08rem]"
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
/* Countdown — "A Night of Love Awaits"                              */
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

export function SilverMoonlightCountdown({ site }: { site: WeddingSite }) {
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
      <p className="er-font-display text-[10px] tracking-[0.34em] text-[#C9CDD6]/90 uppercase sm:text-xs">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="er-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F4F7FA] sm:text-[2rem]">
        A Night of Love Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#C9CDD6]/90 to-transparent sm:w-56"
      />

      <p className="er-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#DDE1E8]/90 sm:text-[1.06rem]">
        Join us as we count down to a night filled with love, laughter, and cherished memories
        under a silver moon.
      </p>

      {/* Countdown — "Moon dial": the five units orbit a central
          crescent moon like a clock face, instead of a row of
          circles. The dial is a square whose units sit at fixed
          percentages, so it scales with its container (container
          queries, so the editor preview renders correctly). Labels
          are white on the deep-night band (contrast ~15:1). */}
      <div
        role="timer"
        aria-live="off"
        className="@container relative mx-auto mt-8 aspect-square w-full max-w-[400px]"
      >
        {/* Central crescent moon */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 opacity-90 @min-[28rem]:h-28 @min-[28rem]:w-28"
        >
          <CrescentMoon className="h-full w-full" />
        </div>
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9CDD6]/15 @min-[28rem]:h-40 @min-[28rem]:w-40"
        />
        {units.map((unit, idx) => {
          const pos = [
            { left: "50%", top: "7%" },
            { left: "87%", top: "30%" },
            { left: "75%", top: "79%" },
            { left: "25%", top: "79%" },
            { left: "13%", top: "30%" },
          ][idx] ?? { left: "50%", top: "50%" };
          return (
            <motion.div
              key={unit.label}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: pos.left, top: pos.top }}
            >
              <span className="er-font-display flex h-14 w-14 items-center justify-center rounded-full border border-[#C9CDD6]/65 bg-[#0E1620]/80 text-[1.25rem] font-normal text-[#FFFFFF] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_6px_16px_rgba(14,22,32,0.4)] tabular-nums @min-[28rem]:h-16 @min-[28rem]:w-16 @min-[28rem]:text-[1.45rem]">
                <span suppressHydrationWarning>{String(unit.value).padStart(2, "0")}</span>
              </span>
              <span className="er-font-display mt-1.5 text-[8px] tracking-[0.28em] text-[#FFFFFF] uppercase @min-[28rem]:text-[9px]">
                {unit.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5 sm:mt-11">
        <p className="er-font-display text-xs tracking-[0.3em] text-[#F4F7FA] uppercase sm:text-sm">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="er-font-editorial flex items-center gap-1.5 text-sm text-[#DDE1E8]/85 italic sm:text-[0.95rem]"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C9CDD6]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — three moonlit photo cards                          */
/* ------------------------------------------------------------------ */

export function SilverMoonlightStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cards = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 3 moonlit photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 3).map((g) => g.url);
    const base = gallery.length >= 3 ? gallery : TEMPLATE_PHOTOS.slice(0, 3);
    return base.map((src, i) => ({
      src,
      caption: MOON_CAPTIONS[i % MOON_CAPTIONS.length],
      alt: `Our Story — ${MOON_CAPTIONS[i % MOON_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <NightSurface variant="night" className="px-4 py-14 sm:px-6 sm:py-20">
      {/* Faint twinkling stars behind the cards (under the text) */}
      <TwinklingStars count={36} />
      <div className="relative mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-[10px] tracking-[0.34em] text-[#C9CDD6] uppercase sm:text-xs"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F4F7FA] sm:text-[2.3rem]"
        >
          Written in Moonlight
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#DDE1E8]/90 sm:text-[1.06rem]"
        >
          From a first glance to a forever promise, every chapter has led us to this silver night.
        </motion.p>

        {/* Moonlit Photo Cards — three portrait cards with silver rings */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 grid w-full grid-cols-3 gap-3 sm:mt-11 sm:gap-5"
        >
          {cards.map((card, i) => (
            <figure
              key={`${card.src}-${i}`}
              className={`group relative ${i === 1 ? "sm:translate-y-4" : ""}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2px] shadow-[0_10px_22px_-6px_rgba(14,22,32,0.6)] ring-1 ring-[#C9CDD6]/40">
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
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1620]/55 via-transparent to-transparent"
                />
                <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-white/95 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] sm:text-[10px]">
                  <Camera className="h-3 w-3" />
                  {card.caption}
                </span>
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#C9CDD6]/70 px-6 py-3 er-font-display text-[11px] tracking-[0.28em] text-[#F4F7FA] uppercase transition-colors duration-300 hover:border-[#F4F7FA] hover:bg-[#F4F7FA] hover:text-[#16202E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9CDD6] sm:mt-10 sm:text-xs"
          >
            <Heart className="h-3.5 w-3.5 text-[#C9CDD6] transition-colors group-hover:text-[#16202E]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative moon accents */}
      <Moon className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#C9CDD6]/50 md:block" />
      <Moon className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#C9CDD6]/40 md:block" />
    </NightSurface>
  );
}
