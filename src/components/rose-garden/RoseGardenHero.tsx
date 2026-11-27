// Rose Garden invitation-view sections — welcome introduction,
// months-aware countdown on a leaf-green band, and the story
// preview: a COMPACT VERTICAL TIMELINE with rose markers (not photo
// cards). Only the data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { PaperSurface, RoseDivider, RoseMark } from "./Decor";
import {
  STORY_CHAPTERS,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  storyParagraphs,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function RoseGardenIntroduction({ site }: { site: WeddingSite }) {
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
          className="rg-font-display text-[10px] tracking-[0.34em] text-[#7E0C37] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3D1420]"
        >
          {heading}
        </motion.h2>

        {/* Rose divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <RoseDivider className="w-40" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#B3124F]"
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
                className="rg-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#3D1420]/85 first:mt-0"
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
/* Countdown — "A Day Among the Roses Awaits"                        */
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

export function RoseGardenCountdown({ site }: { site: WeddingSite }) {
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
      <p className="rg-font-display text-[10px] tracking-[0.34em] text-[#F4A7B9] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="rg-font-display mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFF7F2]">
        A Day Among the Roses Awaits
      </h3>

      <div
        aria-hidden="true"
        className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#F4A7B9]/90 to-transparent"
      />

      <p className="rg-font-editorial mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#FFF7F2]/85">
        Join us as we count down to a day filled with love, laughter, and cherished memories.
      </p>

      {/* Countdown — "Garden trellis": the five units hang from a
          horizontal vine line like seed-packet tags, at staggered
          lengths, gently swaying. Tags are cream cards on the
          leaf-green band; numbers and labels are deep rose on cream
          (contrast ~10:1). Container queries, so the editor preview
          renders the mobile layout. */}
      <div role="timer" aria-live="off" className="@container relative mx-auto mt-8 w-full max-w-[560px]">
        {/* The vine line the tags hang from */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-2 left-2 h-px bg-gradient-to-r from-transparent via-[#3E6B3A] to-transparent"
        />
        <div className="flex items-start justify-center gap-2 @min-[40rem]:gap-3">
          {units.map((unit, idx) => {
            const stringH = ["8px", "20px", "12px", "24px", "16px"][idx] ?? "12px";
            return (
              <motion.div
                key={unit.label}
                initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : { rotate: [0, 1.4, 0, -1.4, 0] }
                  }
                  transition={{ duration: 5, delay: idx * 0.45, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ transformOrigin: "top center" }}
                  className="flex flex-col items-center"
                >
                  <span
                    aria-hidden="true"
                    className="block w-px bg-[#3E6B3A]"
                    style={{ height: stringH }}
                  />
                  <span className="flex w-[60px] flex-col items-center rounded-md border border-[#B3124F]/30 bg-[#FFF7F2] px-1 py-2.5 shadow-[0_8px_18px_-6px_rgba(20,40,20,0.5)] @min-[40rem]:w-[74px] @min-[40rem]:py-3">
                    <span className="rg-font-display text-[1.3rem] leading-none font-normal text-[#7E0C37] tabular-nums @min-[40rem]:text-[1.55rem]">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span className="rg-font-display mt-1.5 text-[8px] tracking-[0.22em] text-[#7E0C37] uppercase @min-[40rem]:text-[9px]">
                      {unit.label}
                    </span>
                  </span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-9 flex flex-col items-center gap-1.5">
        <p className="rg-font-display text-xs tracking-[0.3em] text-[#FFF7F2] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="rg-font-editorial flex items-center gap-1.5 text-sm text-[#FFF7F2]/80 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#F4A7B9]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — compact vertical timeline with rose markers        */
/* ------------------------------------------------------------------ */

export function RoseGardenStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const paragraphs = storyParagraphs(site);
  const gallery = (site.gallery ?? []).map((g) => g.url);
  const photos =
    gallery.length >= 3 ? gallery.slice(0, 3) : [...TEMPLATE_PHOTOS];
  const entries = paragraphs.slice(0, 3).map((text, i) => ({
    title: STORY_CHAPTERS[i % STORY_CHAPTERS.length],
    text,
    photo: photos[i % photos.length],
  }));

  return (
    <PaperSurface variant="cream" className="px-4 py-14">
      <div className="mx-auto flex max-w-[720px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display text-[10px] tracking-[0.34em] text-[#7E0C37] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3D1420]"
        >
          Our Story, Petal by Petal
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#3D1420]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this garden day.
        </motion.p>

        {/* Compact vertical timeline — rose markers on a leaf stem */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 w-full max-w-[560px] text-left"
        >
          <div
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-[#B3124F]/60 via-[#3E6B3A]/50 to-[#B3124F]/60"
          />
          <ol className="space-y-8">
            {entries.map((entry, i) => (
              <li key={`${entry.title}-${i}`} className="relative flex gap-4 pl-0">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B3124F]/50 bg-[#FFF7F2] text-[#B3124F] shadow-[0_6px_14px_-4px_rgba(61,20,32,0.35)]">
                  <RoseMark className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <p className="rg-font-display text-[12px] tracking-[0.22em] text-[#7E0C37] uppercase">
                    {entry.title}
                  </p>
                  <p className="rg-font-editorial mt-1.5 line-clamp-3 text-[0.98rem] leading-[1.7] text-[#3D1420]/85">
                    {entry.text}
                  </p>
                  <div className="relative mt-3 aspect-[16/9] w-full max-w-[340px] overflow-hidden rounded-[4px] shadow-[0_12px_24px_-10px_rgba(61,20,32,0.4)] ring-1 ring-[#B3124F]/25">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.photo}
                      alt={`Our Story — ${entry.title}`}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
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
            className="group mt-10 inline-flex items-center gap-2 border border-[#B3124F]/70 px-6 py-3 rg-font-display text-[11px] tracking-[0.28em] text-[#3D1420] uppercase transition-colors duration-300 hover:border-[#3D1420] hover:bg-[#3D1420] hover:text-[#FFF7F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F]"
          >
            <Heart className="h-3.5 w-3.5 text-[#7E0C37] transition-colors group-hover:text-[#F4A7B9]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>
    </PaperSurface>
  );
}
