// Vintage Lace invitation-view sections — welcome introduction,
// months-aware countdown on a deep-sepia band, and the story
// preview: a photo-ALBUM spread (an open two-page book with a
// centre spine, not photo cards). Only the data comes from the site.
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, Heart, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DustMotes, LaceDivider, PaperSurface } from "./Decor";
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

export function VintageLaceIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display text-[10px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase"
        >
          Together with their families
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display mt-4 text-[2.1rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#4A3A2E]"
        >
          You Are Cordially Invited
        </motion.h2>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <LaceDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#A66A6E]"
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
                className="vl-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#4A3A2E] first:mt-0"
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
/* Countdown — "A Day of Lace & Roses Awaits"                        */
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

export function VintageLaceCountdown({ site }: { site: WeddingSite }) {
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
      {!prefersReducedMotion && <DustMotes />}
      <p className="vl-font-display relative z-10 text-[10px] font-semibold tracking-[0.34em] text-[#EAD3D3] uppercase">
        The countdown begins
      </p>

      <h3 className="vl-font-display relative z-10 mt-3 text-[1.7rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#FDF8F0]">
        A Day of Lace &amp; Roses Awaits
      </h3>

      <div
        aria-hidden="true"
        className="relative z-10 mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#C08A8E]/90 to-transparent"
      />

      <p className="vl-font-editorial relative z-10 mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#F7EBD9]">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — cream vintage lace cards hung on a thin thread
          line: each card is ivory paper with a sepia border, a
          dashed dusty-rose lace inner border, a thread-knot diamond
          where it hangs, and a serif numeral above its label. 5
          units, 2 lines of 3 + 2 in narrow containers, one row in
          wide containers (container queries, so the editor preview
          renders the mobile layout). Contrast (WCAG, computed, not
          eyeballed): numerals #4A3A2E on #FFFDF8 = 10.67:1, labels
          #6B563E on #FFFDF8 = 6.83:1 — both ≥ 4.5. The thread line
          and knots are decorative only. */}
      <div
        role="timer"
        aria-live="off"
        className="@container relative z-10 mt-8 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-3"
      >
        {/* Thin thread line behind the cards (wide row only) */}
        <div
          aria-hidden="true"
          className="absolute top-1/2 right-[4%] left-[4%] hidden h-px bg-[#C08A8E]/70 @min-[40rem]:block"
        />
        {units.map((unit, idx) => (
          <Fragment key={unit.label}>
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex w-[4.5rem] flex-col items-center rounded-[4px] border border-[#8B7355]/70 bg-[#FFFDF8] px-1 pt-3 pb-2.5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45)] @min-[40rem]:w-[5.4rem] @min-[40rem]:pt-3.5 @min-[40rem]:pb-3 ${
                idx >= 3 ? "col-span-1" : ""
              } ${idx === 3 ? "col-start-1 @min-[40rem]:col-start-auto" : ""}`}
            >
              {/* Delicate lace inner border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-dashed border-[#C08A8E]/70"
              />
              {/* Thread-knot diamond where the card hangs from the thread */}
              <div
                aria-hidden="true"
                className="absolute -top-[5px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border border-[#8B7355]/60 bg-[#C08A8E]"
              />
              <span className="vl-font-display relative text-[1.6rem] leading-none font-semibold text-[#4A3A2E] tabular-nums @min-[40rem]:text-[1.9rem]">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="vl-font-display relative mt-2 text-[9px] font-semibold tracking-[0.24em] text-[#6B563E] uppercase @min-[40rem]:text-[10px]">
                {unit.label}
              </span>
            </motion.div>
            {/* Thread knot between cards (wide row only) */}
            {idx < units.length - 1 && (
              <div
                aria-hidden="true"
                className="hidden h-2.5 w-2.5 shrink-0 self-center rounded-full border border-[#C08A8E] bg-[#FDF8F0] shadow-sm @min-[40rem]:block"
              />
            )}
          </Fragment>
        ))}
      </div>

      <div className="relative z-10 mt-9 flex flex-col items-center gap-1.5">
        <p className="vl-font-display text-xs font-semibold tracking-[0.3em] text-[#FDF8F0] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="vl-font-editorial flex items-center gap-1.5 text-sm text-[#F7EBD9] italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#C08A8E]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — an open photo-ALBUM spread: two cream pages with  */
/* a centre spine, one photograph per page with a handwritten-style */
/* caption beneath. The buyer's own gallery photos win; otherwise   */
/* the template's 4 photos show.                                     */
/* ------------------------------------------------------------------ */

export function VintageLaceStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const pages = useMemo(() => {
    const gallery = (site.gallery ?? []).slice(0, 2).map((g) => g.url);
    const base = gallery.length >= 2 ? gallery : TEMPLATE_PHOTOS.slice(0, 2);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <PaperSurface variant="ivory" className="px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display text-[10px] font-semibold tracking-[0.34em] text-[#6B563E] uppercase"
        >
          Our story
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-display mt-3 text-[1.9rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#4A3A2E]"
        >
          From Our Family Album
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="vl-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#4A3A2E]"
        >
          Pressed between these pages are the moments that made us — turn the page and read
          them all.
        </motion.p>

        {/* Open album — two cream pages, centre spine shadow, lace bookmark */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-9 w-full max-w-[820px]"
        >
          <div className="relative flex overflow-hidden rounded-[4px] bg-[#FFFDF8] shadow-[0_24px_44px_-16px_rgba(74,58,46,0.45)] ring-1 ring-[#8B7355]/40 @container">
            {/* Centre spine */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-10 -translate-x-1/2 bg-gradient-to-r from-transparent via-[rgba(74,58,46,0.22)] to-transparent"
            />
            {pages.map((page, i) => (
              <figure
                key={`${page.src}-${i}`}
                className={`group relative w-1/2 bg-[#FFFDF8] p-3 pb-4 @min-[40rem]:p-5 @min-[40rem]:pb-6 ${
                  i === 0 ? "border-r border-[#8B7355]/25 pr-4 @min-[40rem]:pr-6" : "pl-4 @min-[40rem]:pl-6"
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden border-[3px] border-white shadow-[0_10px_20px_-8px_rgba(74,58,46,0.4)] ring-1 ring-[#8B7355]/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.src}
                    alt={page.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="vl-font-script mt-3 text-center text-[1.35rem] leading-none text-[#A66A6E] @min-[40rem]:text-[1.6rem]">
                  {page.caption}
                </figcaption>
                <p className="vl-font-display mt-1.5 text-center text-[8px] font-semibold tracking-[0.24em] text-[#6B563E] uppercase @min-[40rem]:text-[9px]">
                  {i === 0 ? "Page one" : "Page two"}
                </p>
              </figure>
            ))}
          </div>
          {/* Lace bookmark ribbon hanging from the album's top edge */}
          <div
            aria-hidden="true"
            className="absolute -top-1 right-[18%] z-30 h-9 w-4 bg-[#C08A8E] shadow-[0_4px_8px_rgba(74,58,46,0.35)]"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)" }}
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
            className="group mt-8 inline-flex items-center gap-2 border border-[#8B7355]/70 bg-[#FFFDF8] px-6 py-3 vl-font-display text-[11px] font-semibold tracking-[0.28em] text-[#4A3A2E] uppercase shadow-[0_10px_22px_-10px_rgba(74,58,46,0.4)] transition-colors duration-300 hover:border-[#4A3A2E] hover:bg-[#4A3A2E] hover:text-[#FDF8F0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8B7355]"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#A66A6E] transition-colors group-hover:text-[#EAD3D3]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>
    </PaperSurface>
  );
}
