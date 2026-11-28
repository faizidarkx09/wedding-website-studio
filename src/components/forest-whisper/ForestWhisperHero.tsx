// Forest Whisper invitation-view sections — welcome introduction,
// months-aware countdown on a deep-forest band, and the story
// preview: ZIGZAG alternating rows (photo left / text right, then
// flipped) — never photo cards. Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Sparkles, TreePine } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, LeafDivider } from "./Decor";
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

export function ForestWhisperIntroduction({ site }: { site: WeddingSite }) {
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
          className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#1B4332]"
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
          className="fw-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#2D6A4F]"
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
                className="fw-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#1B4332]/85 first:mt-0"
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
/* Countdown — "A Day Beneath the Canopy Awaits"                     */
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

export function ForestWhisperCountdown({ site }: { site: WeddingSite }) {
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
      <p className="fw-font-display text-[10px] tracking-[0.34em] text-[#D6E8B0] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="fw-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#F4F1E6]">
        A Day Beneath the Canopy Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#A7C957]/90 to-transparent"
      />

      <p className="fw-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#E7EAD9]">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — a woodland TRAIL of five stepping stones: each
          unit is a moss stone on a dashed forest path, a leaf sprig
          above it, its label below. 3 + 2 in narrow containers, one
          winding row in wide containers (container queries, so the
          editor preview renders the mobile layout). The dashed trail
          line runs behind the stones on wide containers only. */}
      <div
        role="timer"
        aria-live="off"
        className="@container relative mt-10 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-8 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-4"
      >
        {/* Dashed trail path behind the stones (wide containers) */}
        <div
          aria-hidden="true"
          className="absolute top-[3.1rem] right-[8%] left-[8%] hidden border-t-2 border-dashed border-[#A7C957]/50 @min-[40rem]:block"
        />
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
            {/* Leaf sprig above the stone */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 14"
              className="mb-1.5 h-3.5 w-6 text-[#A7C957]"
              fill="currentColor"
            >
              <path d="M12 1 Q17 5 12 13 Q7 5 12 1 Z" />
              <path d="M12 4 L12 12" stroke="#1B4332" strokeWidth="0.7" />
            </svg>
            {/* Stepping stone — moss-green oval with a leaf ring */}
            <span className="fw-font-display relative flex h-[4.4rem] w-[4.4rem] items-center justify-center rounded-[46%] border-2 border-[#A7C957] bg-[#2D6A4F] text-[1.55rem] font-normal text-[#FBF9F1] shadow-[inset_0_2px_6px_rgba(255,255,255,0.12),0_8px_18px_rgba(20,48,31,0.5)] tabular-nums ring-4 ring-[#A7C957]/15 @min-[40rem]:h-[5rem] @min-[40rem]:w-[5rem] @min-[40rem]:text-[1.85rem]">
              <span suppressHydrationWarning>{String(unit.value).padStart(2, "0")}</span>
            </span>
            <span className="fw-font-display mt-2.5 text-[9px] tracking-[0.3em] text-[#E7EAD9] uppercase">
              {unit.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="fw-font-display text-xs tracking-[0.3em] text-[#F4F1E6] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="fw-font-editorial flex items-center gap-1.5 text-sm text-[#E7EAD9] italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#A7C957]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — ZIGZAG alternating rows (photo left / text right,  */
/* then flipped). Never photo cards, never a timeline.               */
/* ------------------------------------------------------------------ */

export function ForestWhisperStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const rows = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 2 forest photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 2).map((g) => g.url);
    const base = gallery.length >= 2 ? gallery : TEMPLATE_PHOTOS.slice(0, 2);
    return [
      {
        src: base[0],
        caption: STORY_CAPTIONS[0],
        title: "Where It All Began",
        text: "Every love story has a first chapter — ours began on a quiet trail, with a first hello neither of us expected.",
        alt: "Our Story — Where It All Began",
      },
      {
        src: base[1],
        caption: STORY_CAPTIONS[1],
        title: "The Light We Carry",
        text: "Through quiet mornings and loud celebrations, we kept choosing each other — and the light only grew warmer.",
        alt: "Our Story — The Light We Carry",
      },
    ];
  }, [site.gallery]);

  return (
    <PaperSurface variant="cream" className="px-4 py-14">
      <div className="@container mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display text-[10px] tracking-[0.34em] text-[#2D6A4F] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#1B4332]"
        >
          Our Story Along the Trail
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#1B4332]/85"
        >
          From a first glance to a forever promise, every step of the trail has led us to this day.
        </motion.p>

        {/* Zigzag rows — photo and text swap sides on each row in
            wide containers; stacked (photo above text) in narrow
            ones. Container queries throughout. */}
        <div className="mt-10 flex w-full flex-col gap-10 @min-[40rem]:gap-12">
          {rows.map((row, i) => (
            <motion.div
              key={`${row.src}-${i}`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="grid w-full grid-cols-1 items-center gap-5 @min-[40rem]:grid-cols-2 @min-[40rem]:gap-8"
            >
              <figure
                className={`group relative overflow-hidden rounded-[4px] shadow-[0_14px_28px_-10px_rgba(27,67,50,0.4)] ring-1 ring-[#6A994E]/30 ${
                  i % 2 === 1 ? "@min-[40rem]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={row.src}
                    alt={row.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1B4332]/30 via-transparent to-transparent"
                  />
                </div>
                <figcaption className="flex items-center justify-center gap-1.5 bg-[#FBF9F1] px-2 py-3 text-[10px] tracking-[0.2em] text-[#1B4332] uppercase">
                  <Camera className="h-3 w-3 text-[#2D6A4F]" />
                  {row.caption}
                </figcaption>
              </figure>
              <div className={`text-left ${i % 2 === 1 ? "@min-[40rem]:order-1 @min-[40rem]:text-right" : ""}`}>
                <p className="fw-font-display flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#2D6A4F] uppercase">
                  <TreePine className="h-3.5 w-3.5 shrink-0" />
                  {row.caption}
                </p>
                <h4 className="fw-font-display mt-2 text-[1.45rem] leading-[1.2] font-normal text-[#1B4332]">
                  {row.title}
                </h4>
                <p className="fw-font-editorial mt-3 text-[1rem] leading-[1.75] text-[#1B4332]/85">
                  {row.text}
                </p>
              </div>
            </motion.div>
          ))}
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
            className="group mt-10 inline-flex items-center gap-2 border border-[#6A994E]/70 px-6 py-3 fw-font-display text-[11px] tracking-[0.28em] text-[#1B4332] uppercase transition-colors duration-300 hover:border-[#1B4332] hover:bg-[#1B4332] hover:text-[#F4F1E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6A994E]"
          >
            <Heart className="h-3.5 w-3.5 text-[#2D6A4F] transition-colors group-hover:text-[#A7C957]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#6A994E]/50" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#6A994E]/40" />
    </PaperSurface>
  );
}
