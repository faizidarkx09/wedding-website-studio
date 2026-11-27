// Aurora invitation-view sections — welcome introduction, months-
// aware countdown on a deep-night band with aurora glow, and the
// story preview: a RIBBON-FLOW (photos alternating left/right along
// a flowing aurora ribbon line — not a photo-card grid). Only the
// data comes from the site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart, MapPin, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { AuroraDivider, AuroraLights, NightSurface } from "./Decor";
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

export function AuroraIntroduction({ site }: { site: WeddingSite }) {
  const prefersReducedMotion = useReducedMotion();
  const heading = "You Are Cordially Invited";

  return (
    <div className="relative overflow-hidden px-5 pt-10 pb-16">
      {/* Aurora glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(20, 184, 166, 0.14) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 100%, rgba(139, 92, 246, 0.14) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-[580px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display mt-4 text-[2.1rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#F4F7FB]"
        >
          {heading}
        </motion.h2>

        {/* Aurora divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <AuroraDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#5EEAD4]"
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
                className="au-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#E2E8F0]/90 first:mt-0"
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
/* Countdown — "A Night Beneath the Lights Awaits"                   */
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

export function AuroraCountdown({ site }: { site: WeddingSite }) {
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
      {!prefersReducedMotion && <AuroraLights />}
      <p className="au-font-display relative z-10 text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase">
        THE COUNTDOWN BEGINS
      </p>

      <h3 className="au-font-display relative z-10 mt-3 text-[1.7rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#F4F7FB]">
        A Night Beneath the Lights Awaits
      </h3>

      <div
        aria-hidden="true"
        className="relative z-10 mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#5EEAD4]/90 to-transparent"
      />

      <p className="au-font-editorial relative z-10 mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#E2E8F0]/85">
        Join us as we count down to a night filled with love, laughter, and cherished memories
        under the northern lights.
      </p>

      {/* Countdown — aurora orbit rings: five glass rings on a wavy
          aurora ribbon (wide containers), each ring carrying a small
          orbiting light; the seconds ring orbits fastest and pulses.
          3 + 2 grid in narrow containers (container queries, so the
          editor preview renders the mobile layout). */}
      <div role="timer" aria-live="off" className="@container relative z-10 mt-8 w-full">
        {/* Wavy aurora ribbon behind the rings — wide containers only */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-[30px] right-0 left-0 hidden h-10 w-full @min-[40rem]:block"
          viewBox="0 0 640 40"
          preserveAspectRatio="none"
          fill="none"
        >
          <defs>
            <linearGradient id="au-ribbon-grad" x1="0" y1="0" x2="640" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="50%" stopColor="#5EEAD4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path
            d="M0 22 C 80 6, 160 34, 240 20 S 400 6, 480 22 S 600 34, 640 18"
            stroke="url(#au-ribbon-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
        <div className="relative grid grid-cols-3 justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-6">
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
              <span className="au-font-display relative flex h-16 w-16 items-center justify-center rounded-full border border-[#5EEAD4]/60 bg-[#1E293B]/80 text-[1.55rem] font-semibold text-[#F8FAFC] shadow-[inset_0_1px_4px_rgba(255,255,255,0.08),0_0_24px_rgba(20,184,166,0.25)] tabular-nums @min-[40rem]:h-[4.6rem] @min-[40rem]:w-[4.6rem] @min-[40rem]:text-[1.85rem]">
                {/* Orbiting light circling the ring (seconds fastest) */}
                {!prefersReducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: idx === 4 ? 3 : 8 + idx * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <span className="absolute top-[-3px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#5EEAD4] shadow-[0_0_8px_rgba(94,234,212,0.9)]" />
                  </motion.span>
                )}
                {/* Seconds ring pulse */}
                {idx === 4 && !prefersReducedMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-[#5EEAD4]/70"
                    animate={{ opacity: [0.6, 0.05, 0.6], scale: [1, 1.14, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
                  />
                )}
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="au-font-display mt-2.5 text-[9px] font-semibold tracking-[0.3em] text-[#FFFFFF] uppercase">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-9 flex flex-col items-center gap-1.5">
        <p className="au-font-display text-xs font-semibold tracking-[0.3em] text-[#F4F7FB] uppercase">
          {formatLongDate(site.weddingDate, site.timezone)}
        </p>
        {lines.map((line, i) => (
          <p
            key={i}
            className="au-font-editorial flex items-center gap-1.5 text-sm text-[#E2E8F0]/85 italic"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5EEAD4]" />
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — RIBBON-FLOW: photos alternating left/right along  */
/* a flowing aurora ribbon line (not a photo-card grid).             */
/* ------------------------------------------------------------------ */

export function AuroraStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const moments = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 3 aurora photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 3).map((g) => g.url);
    const base = gallery.length >= 3 ? gallery : TEMPLATE_PHOTOS.slice(0, 3);
    return base.map((src, i) => ({
      src,
      caption: STORY_CAPTIONS[i % STORY_CAPTIONS.length],
      alt: `Our Story — ${STORY_CAPTIONS[i % STORY_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <NightSurface variant="night" className="px-4 py-14">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display text-[10px] font-semibold tracking-[0.34em] text-[#5EEAD4] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-display mt-3 text-[1.9rem] leading-[1.12] font-semibold tracking-[0.02em] text-[#F4F7FB]"
        >
          Our Story Beneath the Lights
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="au-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#E2E8F0]/85"
        >
          From a first glance to a forever promise, every chapter has led us to this night
          beneath the aurora.
        </motion.p>

        {/* Ribbon-flow — the aurora ribbon runs down the centre on
            wide containers (photos alternate left/right) and down
            the left edge on narrow ones. Container queries only:
            the editor Mobile preview is a 390px div on a desktop
            viewport, so viewport `sm:` would apply the desktop
            alternating layout in a mobile column. */}
        <div className="@container relative mt-12 w-full">
          {/* The flowing ribbon line */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-5 w-[3px] bg-gradient-to-b from-[#14B8A6] via-[#8B5CF6] to-[#5EEAD4] opacity-70 @min-[40rem]:left-1/2 @min-[40rem]:-translate-x-1/2"
          />
          <div className="relative flex flex-col gap-10 @min-[40rem]:gap-14">
            {moments.map((moment, i) => {
              const leftSide = i % 2 === 0;
              return (
                <motion.figure
                  key={`${moment.src}-${i}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex items-start gap-4 pl-12 text-left @min-[40rem]:w-[calc(50%-2rem)] @min-[40rem]:pl-0 ${
                    leftSide
                      ? "@min-[40rem]:self-start @min-[40rem]:flex-row"
                      : "@min-[40rem]:self-end @min-[40rem]:flex-row-reverse @min-[40rem]:text-right"
                  }`}
                >
                  {/* Ribbon node */}
                  <span
                    aria-hidden="true"
                    className="absolute top-6 left-5 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[#5EEAD4] bg-[#0F172A] shadow-[0_0_14px_rgba(20,184,166,0.7)] @min-[40rem]:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-6 z-10 hidden h-4 w-4 items-center justify-center rounded-full border-2 border-[#5EEAD4] bg-[#0F172A] shadow-[0_0_14px_rgba(20,184,166,0.7)] @min-[40rem]:flex"
                    style={leftSide ? { right: "-2.5rem" } : { left: "-2.5rem" }}
                  />
                  <div className="group relative w-36 shrink-0 overflow-hidden rounded-xl shadow-[0_18px_36px_-12px_rgba(2,6,23,0.8)] ring-1 ring-[#5EEAD4]/40 @min-[40rem]:w-44">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={moment.src}
                        alt={moment.alt}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/50 via-transparent to-transparent"
                      />
                    </div>
                  </div>
                  <figcaption className="min-w-0 pt-4">
                    <span className="au-font-display block text-[11px] font-semibold tracking-[0.24em] text-[#5EEAD4] uppercase @min-[40rem]:text-xs">
                      {moment.caption}
                    </span>
                    <span className="au-font-editorial mt-2 block text-[0.95rem] leading-relaxed text-[#E2E8F0]/80 italic">
                      {i === 0 &&
                        "A first dance beneath a sky that shimmered just for us."}
                      {i === 1 && "The night the lights came out to celebrate with us."}
                      {i === 2 && "Every step since has led us here — together."}
                    </span>
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
            className="group mt-12 inline-flex items-center gap-2 border border-[#5EEAD4]/70 px-6 py-3 au-font-display text-[11px] font-semibold tracking-[0.28em] text-[#F4F7FB] uppercase transition-colors duration-300 hover:border-[#5EEAD4] hover:bg-[#14B8A6]/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            <Heart className="h-3.5 w-3.5 text-[#5EEAD4] transition-colors group-hover:text-[#5EEAD4]" />
            Read Our Full Story
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative sparkle accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#5EEAD4]/50" />
      <Sparkles className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#C4B5FD]/40" />
    </NightSurface>
  );
}
