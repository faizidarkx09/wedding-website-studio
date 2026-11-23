// The Sacred Garden sections — Welcome (invitation card),
// Countdown, Schedule of Events (vertical timeline), Venue + map,
// Dress Code + Gift Preference. All content comes from site data;
// nothing here is hardcoded to a sample wedding. Reveals are
// 600–1000ms, transform/opacity only, and respect
// prefers-reduced-motion via framer-motion's useReducedMotion.
// NO story timeline section — the original has none.
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import {
  SACRED,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
} from "./tokens";
import { Divider, FloralCorner, FloralDrift, Flower, Rose, TornPaperDivider } from "./Decor";

/* ---------- shared reveal primitives ---------- */

function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <Reveal className="text-center">
      <h2
        className="sacred-script text-[41px] leading-[1.55]"
        style={{ color: SACRED.gold }}
      >
        {title}
      </h2>
      <Divider className="mx-auto mt-2 h-4 w-44" style={{ color: SACRED.gold }} />
    </Reveal>
  );
}

function sectionPad(): string {
  return "px-5 py-20 sm:py-24";
}

/* ---------- Welcome (invitation card) ---------- */

export function SacredGardenWelcome({ site }: { site: WeddingSite }) {
  const invitation = (site.content.invitationText ?? "").trim();
  return (
    <section id="welcome" aria-label="Welcome" className="relative mx-auto w-full max-w-3xl overflow-hidden text-center" style={{ backgroundColor: SACRED.cream }}>
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0">
        <FloralDrift>
          <FloralCorner className="h-36 w-36 opacity-40 sm:h-48 sm:w-48" style={{ color: SACRED.gold }} />
        </FloralDrift>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0">
        <FloralDrift delay={1.5}>
          <FloralCorner flip className="h-36 w-36 opacity-40 sm:h-48 sm:w-48" style={{ color: SACRED.gold }} />
        </FloralDrift>
      </div>
      <div className={`relative ${sectionPad()}`}>
        {/* The tagline lives in the hero now (SacredGardenHero) — it
            used to render here too, which duplicated the line. */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-[21px] leading-[1.25]" style={{ color: SACRED.welcomeBrown }}>
            {site.content.welcome}
          </p>
        </Reveal>
        {invitation ? (
          <Reveal delay={0.2}>
            <div
              className="mx-auto mt-10 max-w-xl rounded-sm border px-6 py-8 sm:px-10"
              style={{ backgroundColor: SACRED.white, borderColor: SACRED.beige }}
            >
              <Flower className="mx-auto h-10 w-10" style={{ color: SACRED.gold }} />
              <p className="mt-4 text-lg leading-relaxed whitespace-pre-line" style={{ color: SACRED.brown }}>
                {invitation}
              </p>
              <p className="sacred-script mt-5 text-3xl" style={{ color: SACRED.gold }}>
                {site.content.partnerA} &amp; {site.content.partnerB}
              </p>
            </div>
          </Reveal>
        ) : null}
        <Reveal delay={0.25} className="mt-12">
          <TornPaperDivider className="mx-auto h-6 w-64 sm:w-80" style={{ color: SACRED.gold }} />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Countdown ---------- */

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diffParts(targetMs: number, nowMs: number): CountdownParts {
  const total = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
    done: total <= 0,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const reduceMotion = useReducedMotion();
  const display = label === "Days" ? String(value) : pad(value);
  return (
    <div className="min-w-[4.25rem] text-center sm:min-w-28">
      <div className="overflow-hidden px-2 py-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={display}
            initial={{ y: reduceMotion ? 0 : "-60%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduceMotion ? 0 : "60%", opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            className="sacred-ovo text-[45px] leading-none font-normal tabular-nums"
            style={{ color: SACRED.gold }}
          >
            {display}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="sacred-ovo mt-1 text-[19px]" style={{ color: SACRED.countdownGold }}>
        {label}
      </p>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <span aria-hidden="true" className="sacred-ovo pt-3 text-[52px] leading-none" style={{ color: SACRED.gold }}>
      :
    </span>
  );
}

export function SacredGardenCountdown({ site }: { site: WeddingSite }) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!site.settings.showCountdown || !site.settings.countdownEnabled) return null;

  // The wedding date is the SINGLE source of truth — the same date
  // the hero shows (audit bug #1: the source counted to a different
  // date than its hero date).
  const parts = diffParts(Date.parse(site.weddingDate), now);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);

  if (parts.done) {
    return (
      <section id="countdown" aria-label="Countdown" className="mx-auto w-full max-w-3xl text-center" style={{ backgroundColor: SACRED.cream }}>
        <div className={sectionPad()}>
          <SectionHeading title="The Celebration Begins In" />
          <Reveal delay={0.15}>
            <p className="sacred-script mt-6 text-4xl" style={{ color: SACRED.gold }}>
              {site.content.postWeddingMessage || "See you there!"}
            </p>
            <p className="mt-3 text-sm opacity-70">{dateLine}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="countdown" aria-label="Countdown to the wedding" className="mx-auto w-full max-w-4xl text-center" style={{ backgroundColor: SACRED.cream }}>
      <div className={sectionPad()}>
        <SectionHeading title="The Celebration Begins In" />
        <Reveal delay={0.15}>
          <div className="mt-8 flex items-start justify-center gap-1 sm:gap-3" role="timer" aria-label="Countdown to the wedding">
            <CountdownUnit value={parts.days} label="Days" />
            <CountdownSeparator />
            <CountdownUnit value={parts.hours} label="Hours" />
            <CountdownSeparator />
            <CountdownUnit value={parts.minutes} label="Minutes" />
            <CountdownSeparator />
            <CountdownUnit value={parts.seconds} label="Seconds" />
          </div>
          <p className="mt-6 text-sm font-medium tracking-wide opacity-75">{dateLine}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Schedule of Events (vertical timeline) ---------- */

export function SacredGardenEvents({ site }: { site: WeddingSite }) {
  if (!site.settings.showEvents || site.events.length === 0) return null;
  const events = site.events.slice(0, 6);
  return (
    <section id="events" aria-label="Schedule of events" className="mx-auto w-full max-w-4xl" style={{ backgroundColor: SACRED.cream }}>
      <div className={sectionPad()}>
        <SectionHeading title="Schedule of Events" />
        <div className="relative mt-14">
          {/* Timeline spine — 2px vertical line, centre on desktop,
              left on mobile (audit §4). */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-[2px] sm:left-1/2 sm:-translate-x-1/2" style={{ backgroundColor: SACRED.gold, opacity: 0.45 }} />
          <div className="flex flex-col gap-12 sm:gap-14">
            {events.map((event, i) => {
              const leftSide = i % 2 === 0;
              return (
                <Reveal key={event.id} delay={0.05} className="relative pl-10 sm:pl-0">
                  {/* 8×8 dot on the spine. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-[4px] h-2 w-2 rounded-full sm:left-1/2 sm:-translate-x-1/2"
                    style={{ backgroundColor: SACRED.gold }}
                  />
                  <div className="grid items-start gap-2 sm:grid-cols-2 sm:gap-16">
                    <div className={leftSide ? "sm:pr-2 sm:text-right" : "sm:order-2 sm:pl-2"}>
                      <h3 className="text-[20px] leading-[1.1]" style={{ color: SACRED.brown }}>
                        {event.name}
                      </h3>
                      {event.description ? (
                        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line" style={{ color: `${SACRED.brown}CC` }}>
                          {event.description}
                        </p>
                      ) : null}
                    </div>
                    <div className={leftSide ? "sm:order-2 sm:pl-2" : "sm:pr-2 sm:text-right"}>
                      <p className="sacred-ovo text-[30px] leading-[1.55]" style={{ color: SACRED.taupe }}>
                        {event.time}
                      </p>
                    </div>
                  </div>
                  {/* Rose marker — one per event row, alternating sides. */}
                  <span
                    aria-hidden="true"
                    className={`mt-3 hidden sm:block ${leftSide ? "sm:pl-[calc(50%+2.5rem)]" : "sm:pr-[calc(50%+2.5rem)] sm:text-right"}`}
                    style={{ color: SACRED.gold }}
                  >
                    <Rose className="inline-block h-8 w-8 opacity-70" />
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Venue + map ---------- */

export function SacredGardenVenue({ site }: { site: WeddingSite }) {
  const { content } = site;
  if (!content.venueName?.trim() && !content.venueAddress?.trim()) return null;
  const query = [content.venueName, content.venueAddress].filter(Boolean).join(", ");
  const directions = content.mapLink?.trim() || mapsLink(query);
  const venueImage = (content.venueImage ?? "").trim();
  return (
    <section id="venue" aria-label="Venue and location" className="mx-auto w-full max-w-5xl" style={{ backgroundColor: SACRED.cream }}>
      <div className={sectionPad()}>
        <SectionHeading title="Location" />
        <Reveal delay={0.1}>
          {content.venueName ? (
            <p className="mx-auto mt-6 max-w-xl text-center text-[20px] leading-[1.55]" style={{ color: SACRED.brown }}>
              {content.venueName}
            </p>
          ) : null}
          {content.venueAddress ? (
            <p className="mx-auto mt-2 max-w-xl text-center text-[17px] leading-[1.25]" style={{ color: SACRED.brown }}>
              {content.venueAddress}
            </p>
          ) : null}
          <div className="mt-8 text-center">
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border px-6 text-sm font-bold tracking-wide uppercase transition hover:opacity-80"
              style={{ borderColor: SACRED.gold, color: SACRED.gold }}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              View on a map
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
        {venueImage ? (
          <Reveal delay={0.15}>
            <div className="mx-auto mt-10 w-full max-w-2xl overflow-hidden rounded-sm border" style={{ borderColor: SACRED.beige }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={venueImage} alt={content.venueName || "Wedding venue"} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
            </div>
          </Reveal>
        ) : null}
        <Reveal delay={0.18}>
          <div
            className="mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-[15px] border"
            style={{ borderColor: SACRED.beige }}
          >
            <iframe
              title={`Map — ${content.venueName || "wedding venue"}`}
              src={mapsEmbedUrl(query)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-square w-full border-0 sm:aspect-[16/8]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Dress code + gifts ---------- */

export function SacredGardenDressCode({ site }: { site: WeddingSite }) {
  const dressCode = (site.content.dressCode ?? "").trim();
  const giftText = (site.content.giftText ?? "").trim();
  if (!dressCode && !giftText) return null;
  return (
    <section id="dress-code" aria-label="Dress code and gifts" className="mx-auto w-full max-w-4xl" style={{ backgroundColor: SACRED.lighterCream }}>
      <div className={sectionPad()}>
        <div className={`grid gap-12 ${dressCode && giftText ? "sm:grid-cols-2" : ""}`}>
          {dressCode ? (
            <div className="text-center">
              <SectionHeading title="Dress Code" />
              <Reveal delay={0.1}>
                <p className="mx-auto mt-6 max-w-md text-[21px] leading-[1.25]" style={{ color: SACRED.brown }}>
                  {dressCode}
                </p>
              </Reveal>
            </div>
          ) : null}
          {giftText ? (
            <div className="text-center">
              <SectionHeading title="Gift Preference" />
              <Reveal delay={0.1}>
                <p className="mx-auto mt-6 max-w-md text-[21px] leading-[1.25]" style={{ color: SACRED.brown }}>
                  {giftText}
                </p>
              </Reveal>
            </div>
          ) : null}
        </div>
        <Reveal delay={0.2} className="mt-12">
          <TornPaperDivider className="mx-auto h-6 w-64 sm:w-80" style={{ color: SACRED.gold }} />
        </Reveal>
      </div>
    </section>
  );
}
