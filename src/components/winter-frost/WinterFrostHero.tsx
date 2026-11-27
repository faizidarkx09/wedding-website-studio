// Winter Frost invitation-view sections — welcome introduction,
// months-aware countdown on a deep-blue band, and the story
// preview: the snow-globe CAROUSEL (one large photo + dots,
// swipeable — the template's signature story layout). Only the data
// comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Snowflake } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { FrostSurface, SnowGlobeCarousel, SnowflakeDivider, type GlobeSlide } from "./Decor";
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

export function WinterFrostIntroduction({ site }: { site: WeddingSite }) {
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
          className="wf-font-display text-[10px] tracking-[0.34em] text-[#1B4A6B] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#12395B]"
        >
          {heading}
        </motion.h2>

        {/* Snowflake divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <SnowflakeDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#1B4A6B]"
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
                className="wf-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#12395B]/85 first:mt-0"
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
/* Countdown — "A Day of Winter Light Awaits"                        */
/* Ice-crystal design: each unit sits in a hexagonal frost frame   */
/* (ice-blue gradient border, solid deep-navy core, frost glint,   */
/* tiny snowflake over the number). Values + hook unchanged — only  */
/* the visual design changed. All clock text ≥4.5:1 (see           */
/* /tmp/wf-contrast.mjs run 2026-11-27): labels/eyebrow #EAF4FB    */
/* 10.69:1 on #12395B, 5.64:1 on the glow-blended centre; numbers  */
/* #FDFEFF 15.37:1 on solid #0B2540; intro/venue #D6EBF9 9.71:1 /   */
/* 5.12:1 on glow.                                                 */
/* ------------------------------------------------------------------ */

const HEX_CLIP = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

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

export function WinterFrostCountdown({ site }: { site: WeddingSite }) {
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
      <p className="wf-font-display text-[10px] tracking-[0.34em] text-[#EAF4FB] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="wf-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FDFEFF]">
        A Day of Winter Light Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#BDE0F5]/90 to-transparent"
      />

      <p className="wf-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#D6EBF9]">
        Join us as we count down to a day of falling snow, warm hearts, and cherished memories.
      </p>

      {/* Countdown — 5 hexagonal frost frames, 2 lines of 3 + 2 in
          narrow containers, one row in wide containers (container
          queries, so the editor preview renders the mobile layout). */}
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
            {/* Hexagonal frost frame: ice-gradient border + solid
                deep-navy core + frost glint + tiny snowflake */}
            <div
              className="flex h-[3.9rem] w-[4.5rem] items-center justify-center p-[2px] shadow-[0_8px_20px_-6px_rgba(11,37,64,0.5)] @min-[40rem]:h-[4.7rem] @min-[40rem]:w-[5.4rem]"
              style={{
                clipPath: HEX_CLIP,
                background:
                  "linear-gradient(160deg, #EAF4FB 0%, #BDE0F5 35%, #7FB3D9 70%, #D6EBF9 100%)",
              }}
            >
              <div
                className="wf-font-display flex h-full w-full flex-col items-center justify-center gap-0.5 text-[#FDFEFF] tabular-nums"
                style={{
                  clipPath: HEX_CLIP,
                  backgroundColor: "#0B2540",
                  backgroundImage:
                    "radial-gradient(ellipse 70% 60% at 30% 18%, rgba(189, 224, 245, 0.28) 0%, rgba(189, 224, 245, 0) 62%)",
                }}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 12 12"
                  className="h-2.5 w-2.5 text-[#BDE0F5]/80"
                >
                  <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                    <line x1="6" y1="1" x2="6" y2="11" />
                    <line x1="1.7" y1="3.5" x2="10.3" y2="8.5" />
                    <line x1="10.3" y1="3.5" x2="1.7" y2="8.5" />
                  </g>
                </svg>
                <span className="text-[1.45rem] leading-none font-normal @min-[40rem]:text-[1.8rem]">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
            </div>
            <span className="wf-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#EAF4FB] uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="wf-font-display text-xs tracking-[0.3em] text-[#FDFEFF] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="wf-font-editorial flex items-center gap-1.5 text-sm text-[#D6EBF9] italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#BDE0F5]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — the snow-globe carousel (one large photo + dots,  */
/* swipeable) with a "Read Our Full Story" jump.                     */
/* ------------------------------------------------------------------ */

export function WinterFrostStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const slides: GlobeSlide[] = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 7 winter photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 7);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <FrostSurface variant="pale" className="px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display text-[10px] tracking-[0.34em] text-[#1B4A6B] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#12395B]"
        >
          Our Story in a Snow Globe
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="wf-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#12395B]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this winter day.
          Swipe through our favourite moments.
        </motion.p>

        {/* Snow-globe carousel — one large round photo + dots */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 w-full"
        >
          <SnowGlobeCarousel slides={slides} />
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#7FB3D9]/70 px-6 py-3 wf-font-display text-[11px] tracking-[0.28em] text-[#12395B] uppercase transition-colors duration-300 hover:border-[#12395B] hover:bg-[#12395B] hover:text-[#FDFEFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7FB3D9]"
          >
            <Heart className="h-3.5 w-3.5 text-[#1B4A6B] transition-colors group-hover:text-[#BDE0F5]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative snowflake accents */}
      <Snowflake className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#7FB3D9]/50" />
      <Snowflake className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#7FB3D9]/40" />
    </FrostSurface>
  );
}
