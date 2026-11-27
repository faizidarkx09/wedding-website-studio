// Desert Dusk invitation-view sections — welcome introduction,
// months-aware countdown on a dusk-purple band with drifting sand
// motes, and the story preview: a caravan ROUTE (a dotted path
// with photo stops, not photo cards). Only the data comes from the
// site.
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Heart, MapPin, Moon, Sparkles } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { DuneDivider, DuneRidge, SandMotes } from "./Decor";
import {
  ROUTE_CAPTIONS,
  ROUTE_LINES,
  TEMPLATE_PHOTOS,
  coupleNames,
  formatLongDate,
  venueLines,
  willRenderSection,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* WeddingIntroduction — "You Are Cordially Invited"                 */
/* ------------------------------------------------------------------ */

export function DesertDuskIntroduction({ site }: { site: WeddingSite }) {
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
          className="dd-font-display text-[10px] tracking-[0.34em] text-[#8A4A22] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h2
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display mt-4 text-[2.1rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3A2A20]"
        >
          {heading}
        </motion.h2>

        {/* Dune divider */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 w-full"
        >
          <DuneDivider className="h-7 w-36" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-script mt-3 text-[2.3rem] leading-[1.15] font-normal text-[#8A4A22]"
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
                className="dd-font-editorial mt-3 text-center text-[1.02rem] leading-[1.75] text-[#3A2A20]/85 first:mt-0"
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
/* Countdown — "A Night of Desert Stars Awaits"                      */
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

export function DesertDuskCountdown({ site }: { site: WeddingSite }) {
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
      {/* Dune ridge transition from the sand body above */}
      <DuneRidge className="relative z-10 block h-10 w-full" />
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto flex max-w-[640px] flex-col items-center px-4 pt-6 pb-14 text-center"
      >
        {!prefersReducedMotion && <SandMotes />}
        <p className="dd-font-display relative z-10 text-[10px] tracking-[0.34em] text-[#D9A05B] uppercase">
          THE COUNTDOWN BEGINS
        </p>

        <h3 className="dd-font-display relative z-10 mt-3 text-[1.7rem] leading-[1.12] font-normal tracking-[0.02em] text-[#FFF8EC]">
          A Night of Desert Stars Awaits
        </h3>

        <div
          aria-hidden="true"
          className="relative z-10 mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#D9A05B]/90 to-transparent"
        />

        <p className="dd-font-editorial relative z-10 mt-4 max-w-[540px] text-[1rem] leading-[1.75] text-[#F5E6D3]/85">
          Join us as we count down to a day that ends beneath the desert stars.
        </p>

        {/* Countdown — RISING-SUN ARC design (unique to Desert Dusk):
            a sun disc rising on an arc over a dune horizon, with the
            five units as sandstone ARCH tablets (rounded-t-full, like
            oasis arches) — not Blush's circular badges, not the old
            flat circles. Every text colour is ≥4.5:1 against its
            background (values #3D2133 on cream #FFF8EC = 13.59:1,
            labels #8A4A22 on cream = 6.45:1, eyebrow #D9A05B on dusk
            #3D2133 = 6.24:1 — the Autumn Harvest lesson). 5 units in
            one row in wide containers, 3 + 2 in narrow containers
            (container queries, so the editor preview renders the
            mobile layout). */}
        <div
          aria-hidden="true"
          className="relative z-10 mt-7 w-full max-w-[560px]"
        >
          <svg viewBox="0 0 640 118" fill="none" className="h-auto w-full">
            {/* Rising-sun arc */}
            <path
              d="M 70 108 A 250 250 0 0 1 570 108"
              stroke="#D9A05B"
              strokeWidth="1.6"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            {/* Sun disc on the arc, with rays */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = Math.PI + (i * Math.PI) / 11;
              return (
                <line
                  key={i}
                  x1={320 + 34 * Math.cos(angle)}
                  y1={58 + 34 * Math.sin(angle)}
                  x2={320 + 46 * Math.cos(angle)}
                  y2={58 + 46 * Math.sin(angle)}
                  stroke="#D9A05B"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx="320" cy="58" r="26" fill="#D9A05B" />
            <circle cx="320" cy="58" r="26" fill="none" stroke="#FFF8EC" strokeOpacity="0.35" strokeWidth="1.5" />
            {/* Dune horizon the arc rises over */}
            <path
              d="M 0 108 Q 160 84 320 102 T 640 100"
              stroke="#C2703D"
              strokeWidth="1.6"
              fill="none"
            />
            <path
              d="M 0 112 Q 200 94 400 108 T 640 110"
              stroke="#C2703D"
              strokeWidth="1"
              strokeOpacity="0.6"
              fill="none"
            />
          </svg>
        </div>

        <div
          role="timer"
          aria-live="off"
          className="@container relative z-10 mt-2 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 @min-[40rem]:flex @min-[40rem]:flex-row @min-[40rem]:items-start @min-[40rem]:justify-center @min-[40rem]:gap-x-5"
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
              {/* Sandstone arch tablet — cream, gold rim, deep-dusk value */}
              <span className="dd-font-display flex h-[6.4rem] w-[4.5rem] flex-col items-center justify-center rounded-t-full rounded-b-lg border border-[#D9A05B]/80 bg-[#FFF8EC] pt-3 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.9)] @min-[40rem]:h-[7.2rem] @min-[40rem]:w-[5.2rem]">
                <span className="text-[1.55rem] leading-none font-normal text-[#3D2133] tabular-nums @min-[40rem]:text-[1.85rem]">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="mt-2 h-px w-8 bg-gradient-to-r from-transparent via-[#C2703D] to-transparent" />
                <span className="mt-2 text-[9px] tracking-[0.28em] text-[#8A4A22] uppercase">
                  {unit.label}
                </span>
              </span>
            </motion.div>
          ))}
        </div>

        {/* Dune line under the tablets — wide containers only, where
            the five tablets sit in one row and the dots can align. */}
        <div
          aria-hidden="true"
          className="relative z-10 mt-6 hidden w-full max-w-[560px] items-center @min-[40rem]:flex"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D9A05B]/70 to-transparent" />
          <span className="mx-3 flex items-center gap-8">
            {units.map((unit) => (
              <span key={unit.label} className="h-1.5 w-1.5 rounded-full bg-[#D9A05B]" />
            ))}
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#D9A05B]/70 to-transparent" />
        </div>

        <div className="relative z-10 mt-9 flex flex-col items-center gap-1.5">
          <p className="dd-font-display text-xs tracking-[0.3em] text-[#FFF8EC] uppercase">
            {formatLongDate(site.weddingDate, site.timezone)}
          </p>
          {lines.map((line, i) => (
            <p
              key={i}
              className="dd-font-editorial flex items-center gap-1.5 text-sm text-[#F5E6D3]/80 italic"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D9A05B]" />
              {line}
            </p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StoryPreview — the caravan ROUTE: a dotted path with four photo  */
/* stops. Mobile: a vertical dotted path; wide containers: a        */
/* horizontal dotted path with stops alternating above and below.   */
/* ------------------------------------------------------------------ */

export function DesertDuskStoryPreview({
  site,
  onOpenStory,
}: {
  site: WeddingSite;
  onOpenStory: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();
  const stops = useMemo(() => {
    // The buyer's own gallery photos win; otherwise the template's
    // 4 route photos (never seeded onto a buyer site — preview only).
    const gallery = (site.gallery ?? []).slice(0, 4).map((g) => g.url);
    const base = gallery.length >= 4 ? gallery : TEMPLATE_PHOTOS.slice(0, 4);
    return base.map((src, i) => ({
      src,
      caption: ROUTE_CAPTIONS[i % ROUTE_CAPTIONS.length],
      line: ROUTE_LINES[i % ROUTE_LINES.length],
      alt: `Our Story — ${ROUTE_CAPTIONS[i % ROUTE_CAPTIONS.length]}`,
    }));
  }, [site.gallery]);

  return (
    <div className="@container relative overflow-hidden bg-[#FFF8EC] px-4 py-14">
      <div className="relative mx-auto flex max-w-[980px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display text-[10px] tracking-[0.34em] text-[#8A4A22] uppercase"
        >
          OUR STORY
        </motion.p>

        <motion.h3
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display mt-3 text-[1.9rem] leading-[1.12] font-normal tracking-[0.02em] text-[#3A2A20]"
        >
          Our Caravan Route
        </motion.h3>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-editorial mt-4 max-w-[560px] text-[1rem] leading-[1.75] text-[#3A2A20]/85"
        >
          Every love story is a journey. Follow the dotted path through the four stops that
          brought us to this desert dusk.
        </motion.p>

        {/* Mobile: vertical dotted route */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 w-full max-w-[520px] text-left @min-[40rem]:hidden"
        >
          <div
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-[2.75rem] border-l-2 border-dotted border-[#C2703D]/70"
          />
          <div className="space-y-8">
            {stops.map((stop, i) => (
              <div key={`${stop.src}-${i}`} className="relative flex items-start gap-4">
                <div className="relative z-10 h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-full bg-[#FFFDF6] shadow-[0_12px_24px_-8px_rgba(58,42,32,0.5)] ring-2 ring-[#C2703D]/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stop.src}
                    alt={stop.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 pt-1">
                  <p className="dd-font-display flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-[#3A2A20] uppercase">
                    <Camera className="h-3 w-3 text-[#8A4A22]" />
                    Stop {i + 1} · {stop.caption}
                  </p>
                  <p className="dd-font-editorial mt-1.5 text-[0.95rem] leading-relaxed text-[#3A2A20]/80 italic">
                    {stop.line}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Wide containers: horizontal dotted route, stops alternate above / below */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12 hidden w-full @min-[40rem]:block"
        >
          <div
            aria-hidden="true"
            className="absolute top-1/2 right-[12%] left-[12%] border-t-2 border-dotted border-[#C2703D]/70"
          />
          <div className="relative grid grid-cols-4 gap-4">
            {stops.map((stop, i) => {
              const above = i % 2 === 0;
              return (
                <div key={`${stop.src}-${i}`} className="flex flex-col items-center">
                  <div className={`flex min-h-[7.5rem] flex-col items-center justify-end text-center ${above ? "" : "invisible"}`}>
                    <p className="dd-font-display text-[11px] tracking-[0.2em] text-[#3A2A20] uppercase">
                      Stop {i + 1} · {stop.caption}
                    </p>
                    <p className="dd-font-editorial mt-1.5 max-w-[200px] text-sm leading-relaxed text-[#3A2A20]/80 italic">
                      {stop.line}
                    </p>
                  </div>
                  <div className="relative z-10 my-3 h-28 w-28 overflow-hidden rounded-full bg-[#FFFDF6] shadow-[0_12px_24px_-8px_rgba(58,42,32,0.5)] ring-2 ring-[#C2703D]/60 transition-transform duration-500 hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stop.src}
                      alt={stop.alt}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className={`flex min-h-[7.5rem] flex-col items-center justify-start text-center ${above ? "invisible" : ""}`}>
                    <p className="dd-font-display text-[11px] tracking-[0.2em] text-[#3A2A20] uppercase">
                      Stop {i + 1} · {stop.caption}
                    </p>
                    <p className="dd-font-editorial mt-1.5 max-w-[200px] text-sm leading-relaxed text-[#3A2A20]/80 italic">
                      {stop.line}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
            className="group mt-10 inline-flex items-center gap-2 border border-[#C2703D]/70 px-6 py-3 dd-font-display text-[11px] tracking-[0.28em] text-[#3A2A20] uppercase transition-colors duration-300 hover:border-[#3A2A20] hover:bg-[#3A2A20] hover:text-[#FFF8EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2703D]"
          >
            <Heart className="h-3.5 w-3.5 text-[#8A4A22] transition-colors group-hover:text-[#D9A05B]" />
            Follow the Full Route
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        )}
      </div>

      {/* Decorative accents */}
      <Sparkles className="pointer-events-none absolute top-8 right-8 hidden h-5 w-5 text-[#C2703D]/50" />
      <Moon className="pointer-events-none absolute bottom-10 left-10 hidden h-4 w-4 text-[#6B3A5C]/40" />
    </div>
  );
}
