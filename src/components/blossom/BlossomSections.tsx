// BLOSSOM & OUD sections — Welcome, Our Story (timeline), Countdown, Events,
// Venue. All content comes from site data; nothing here is hardcoded to
// a sample wedding. Reveals are 600–1000ms, transform/opacity only, and
// respect prefers-reduced-motion via framer-motion's useReducedMotion.
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, MapPin } from "lucide-react";
import type { DetailBlock, WeddingSite } from "@/lib/types";
import {
  BLOSSOM,
  dressCodeNotes,
  formatEventDate,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
  visibleMilestones,
} from "./tokens";
import { BotanicalBranch, Divider, FloralCorner, FloralDrift, Flower } from "./Decor";

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

function SectionHeading({
  eyebrow,
  title,
  intro,
  dividerVariant = 0,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  dividerVariant?: number;
}) {
  return (
    <Reveal className="text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: BLOSSOM.gold }}>
        {eyebrow}
      </p>
      <h2 className="font-blossom mt-3 text-[clamp(2rem,5vw,3rem)] leading-tight font-medium" style={{ color: BLOSSOM.oud }}>
        {title}
      </h2>
      <Divider variant={dividerVariant} className="mx-auto mt-4 h-4 w-44" style={{ color: BLOSSOM.gold }} />
      {intro ? (
        <p className="mx-auto mt-4 max-w-xl leading-relaxed" style={{ color: `${BLOSSOM.oud}CC` }}>
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}

function sectionPad(): string {
  return "px-5 py-20 sm:py-24";
}

/* ---------- 03 · Welcome ---------- */

export function BlossomWelcome({ site }: { site: WeddingSite }) {
  const invitation = (site.content.invitationText ?? "").trim();
  return (
    <section id="welcome" aria-label="Welcome" className="relative mx-auto w-full max-w-3xl overflow-hidden text-center" style={{ backgroundColor: BLOSSOM.ivory }}>
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0">
        <FloralDrift>
          <FloralCorner className="h-36 w-36 opacity-40 sm:h-48 sm:w-48" style={{ color: BLOSSOM.rose }} />
        </FloralDrift>
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0">
        <FloralDrift delay={1.5}>
          <FloralCorner flip className="h-36 w-36 opacity-40 sm:h-48 sm:w-48" style={{ color: BLOSSOM.rose }} />
        </FloralDrift>
      </div>
      <div className={`relative ${sectionPad()}`}>
        <Reveal>
          <p className="blossom-script text-4xl sm:text-5xl" style={{ color: BLOSSOM.gold }}>
            Bienvenue
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          {/* Original Arabic invitation line (written for this template,
              not copied from any reference): "We are delighted to invite
              you to share the joy of our wedding." */}
          <p lang="ar" dir="rtl" className="mx-auto mt-6 max-w-xl text-xl leading-relaxed" style={{ color: BLOSSOM.oud }}>
            يسعدنا أن ندعوكم لمشاركتنا فرحة زفافنا
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: BLOSSOM.oud }}>
            {site.content.welcome}
          </p>
        </Reveal>
        {invitation ? (
          <Reveal delay={0.2}>
            <div
              className="mx-auto mt-10 max-w-xl rounded-sm border px-6 py-8 sm:px-10"
              style={{ backgroundColor: BLOSSOM.white, borderColor: BLOSSOM.blush }}
            >
              <Flower variant={0} className="mx-auto h-10 w-10" style={{ color: BLOSSOM.rose }} />
              <p className="mt-4 text-lg leading-relaxed whitespace-pre-line" style={{ color: BLOSSOM.oud }}>
                {invitation}
              </p>
              <p className="blossom-script mt-5 text-3xl" style={{ color: BLOSSOM.gold }}>
                {site.content.partnerA} &amp; {site.content.partnerB}
              </p>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- 04 · Our Story (timeline) ---------- */

export function BlossomStory({ site }: { site: WeddingSite }) {
  if (!site.settings.showStory) return null;
  const milestones = visibleMilestones(site);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 0.8", "end 0.55"],
  });

  // No milestones yet: a single editorial story block.
  if (milestones.length === 0) {
    return (
      <section id="story" aria-label="Our story" className="mx-auto w-full max-w-3xl text-center" style={{ backgroundColor: BLOSSOM.secondaryBg }}>
        <div className={sectionPad()}>
          <SectionHeading eyebrow="Our story" title="How we got here" dividerVariant={1} />
          <Reveal delay={0.15}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed whitespace-pre-line" style={{ color: BLOSSOM.oud }}>
              {site.content.story}
            </p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="story" aria-label="Our story" className="mx-auto w-full max-w-6xl" style={{ backgroundColor: BLOSSOM.secondaryBg }}>
      <div className={sectionPad()}>
        <SectionHeading
          eyebrow="Our story"
          title="How we got here"
          intro="Four moments that brought us to this day."
          dividerVariant={1}
        />
        <div ref={lineRef} className="relative mt-14">
          {/* Timeline spine — draws progressively as the user scrolls. */}
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px sm:left-1/2 sm:-translate-x-1/2" style={{ backgroundColor: BLOSSOM.rose, opacity: 0.5 }} />
          <motion.span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[7px] w-px origin-top sm:left-1/2 sm:-translate-x-1/2"
            style={{ backgroundColor: BLOSSOM.gold, scaleY: reduceMotion ? 1 : scrollYProgress }}
          />
          <div className="flex flex-col gap-12 sm:gap-16">
            {milestones.map((m, i) => {
              const leftSide = i % 2 === 0;
              return (
                <Reveal key={m.id} delay={0.05} className="relative pl-10 sm:pl-0">
                  {/* Marker */}
                  <span
                    aria-hidden="true"
                    className="absolute top-2 left-0 h-[15px] w-[15px] rotate-45 border-2 sm:left-1/2 sm:-translate-x-1/2"
                    style={{ backgroundColor: BLOSSOM.ivory, borderColor: BLOSSOM.gold }}
                  />
                  <div className="grid items-start gap-6 sm:grid-cols-2 sm:gap-16">
                    <div className={leftSide ? "sm:pr-2 sm:text-right" : "sm:order-2 sm:pl-2"}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BLOSSOM.gold }}>
                        {m.date}
                      </p>
                      <h3 className="font-blossom mt-2 text-2xl font-medium sm:text-[1.75rem]" style={{ color: BLOSSOM.oud }}>
                        {m.title}
                      </h3>
                      <p className="mt-2 leading-relaxed whitespace-pre-line" style={{ color: `${BLOSSOM.oud}D9` }}>
                        {m.text}
                      </p>
                    </div>
                    <div className={leftSide ? "sm:order-2 sm:pl-2" : "sm:pr-2"}>
                      {m.image ? (
                        <motion.div
                          initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                          whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.image}
                            alt={m.title}
                            loading="lazy"
                            decoding="async"
                            className="aspect-[4/5] w-full max-w-sm object-cover sm:mx-0"
                            style={{ border: `1px solid ${BLOSSOM.blush}` }}
                          />
                        </motion.div>
                      ) : (
                        <div aria-hidden="true" className="hidden items-center justify-center sm:flex">
                          <BotanicalBranch variant={i % 4} className="h-28 w-24 opacity-50" style={{ color: BLOSSOM.rose }} />
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 05 · Countdown ---------- */

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
      <div
        className="overflow-hidden rounded-sm border px-2 py-4"
        style={{ borderColor: BLOSSOM.rose, backgroundColor: BLOSSOM.white }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={display}
            initial={{ y: reduceMotion ? 0 : "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduceMotion ? 0 : "100%", opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.2, 0.7, 0.2, 1] }}
            className="font-blossom text-[clamp(2.25rem,7vw,4rem)] leading-none font-medium tabular-nums"
            style={{ color: BLOSSOM.oud }}
          >
            {display}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: BLOSSOM.gold }}>
        {label}
      </p>
    </div>
  );
}

export function BlossomCountdown({ site }: { site: WeddingSite }) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!site.settings.showCountdown || !site.settings.countdownEnabled) return null;

  const parts = diffParts(Date.parse(site.weddingDate), now);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);

  if (parts.done) {
    return (
      <section id="countdown" aria-label="Countdown" className="mx-auto w-full max-w-3xl text-center" style={{ backgroundColor: BLOSSOM.ivory }}>
        <div className={sectionPad()}>
          <SectionHeading eyebrow="The day has come" title="Just married" dividerVariant={2} />
          <Reveal delay={0.15}>
            <p className="blossom-script mt-6 text-4xl" style={{ color: BLOSSOM.gold }}>
              {site.content.postWeddingMessage || "Just married!"}
            </p>
            <p className="mt-3 text-sm opacity-70">{dateLine}</p>
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id="countdown" aria-label="Countdown to the wedding" className="mx-auto w-full max-w-4xl text-center" style={{ backgroundColor: BLOSSOM.ivory }}>
      <div className={sectionPad()}>
        <SectionHeading eyebrow="Counting down" title="Until the celebration begins" dividerVariant={2} />
        <Reveal delay={0.15}>
          <div className="mt-10 flex items-start justify-center gap-2.5 sm:gap-5" role="timer" aria-label="Countdown to the wedding">
            <CountdownUnit value={parts.days} label="Days" />
            <CountdownUnit value={parts.hours} label="Hours" />
            <CountdownUnit value={parts.minutes} label="Minutes" />
            <CountdownUnit value={parts.seconds} label="Seconds" />
          </div>
          <p className="mt-6 text-sm font-medium tracking-wide opacity-75">{dateLine}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 06 · Events ---------- */

export function BlossomEvents({ site }: { site: WeddingSite }) {
  if (!site.settings.showEvents || site.events.length === 0) return null;
  const events = site.events.slice(0, 6);
  const cols = events.length === 1 ? "sm:grid-cols-1 max-w-xl mx-auto" : events.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section id="events" aria-label="Wedding events" className="mx-auto w-full max-w-6xl" style={{ backgroundColor: BLOSSOM.secondaryBg }}>
      <div className={sectionPad()}>
        <SectionHeading eyebrow="When & where" title="Order of the day" intro="Four moments, one unforgettable evening." dividerVariant={3} />
        <div className={`mt-12 grid gap-6 ${cols}`}>
          {events.map((event, i) => {
            const directions = event.directionsUrl?.trim() || mapsLink(`${event.venue} ${event.address}`.trim());
            return (
              <Reveal key={event.id} delay={0.06 * i} className="h-full">
                <article
                  className="flex h-full flex-col overflow-hidden rounded-sm border"
                  style={{ backgroundColor: BLOSSOM.white, borderColor: BLOSSOM.blush }}
                >
                  {event.photo ? (
                    <motion.div
                      initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                      whileInView={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={event.photo} alt={event.name} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
                    </motion.div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BLOSSOM.gold }}>
                      {formatEventDate(event.date)}
                    </p>
                    <h3 className="font-blossom mt-2 text-2xl font-medium" style={{ color: BLOSSOM.oud }}>
                      {event.name}
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm" style={{ color: `${BLOSSOM.oud}D9` }}>
                      <li className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 shrink-0" style={{ color: BLOSSOM.gold }} aria-hidden="true" />
                        {event.time}
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Calendar className="h-4 w-4 shrink-0" style={{ color: BLOSSOM.gold }} aria-hidden="true" />
                        {event.venue}
                      </li>
                      {event.address ? (
                        <li className="flex items-start gap-2.5">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLOSSOM.gold }} aria-hidden="true" />
                          {event.address}
                        </li>
                      ) : null}
                    </ul>
                    {event.description ? (
                      <p className="mt-4 text-sm leading-relaxed" style={{ color: `${BLOSSOM.oud}CC` }}>
                        {event.description}
                      </p>
                    ) : null}
                    <a
                      href={directions}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold tracking-wide uppercase"
                      style={{ color: BLOSSOM.gold }}
                    >
                      Get directions
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- 07 · Venue & location ---------- */

function venueNotes(site: WeddingSite): DetailBlock[] {
  const kinds = new Set(["venue", "travel", "parking", "accessibility"]);
  return (site.content.details ?? []).filter(
    (b) => !b.hidden && kinds.has(b.kind) && (b.title.trim() || b.body.trim()),
  );
}

export function BlossomVenue({ site }: { site: WeddingSite }) {
  const { content } = site;
  if (!content.venueName?.trim() && !content.venueAddress?.trim()) return null;
  const query = [content.venueName, content.venueAddress].filter(Boolean).join(", ");
  const directions = content.mapLink?.trim() || mapsLink(query);
  const notes = venueNotes(site);
  return (
    <section id="venue" aria-label="Venue and location" className="mx-auto w-full max-w-5xl" style={{ backgroundColor: BLOSSOM.ivory }}>
      <div className={sectionPad()}>
        <SectionHeading eyebrow="The venue" title={content.venueName || "Where we celebrate"} dividerVariant={0} />
        <Reveal delay={0.1}>
          {content.venueAddress ? (
            <p className="mx-auto mt-4 max-w-xl text-center leading-relaxed" style={{ color: `${BLOSSOM.oud}D9` }}>
              {content.venueAddress}
            </p>
          ) : null}
          <div className="mt-8 text-center">
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border px-6 text-sm font-bold tracking-wide uppercase transition hover:opacity-80"
              style={{ borderColor: BLOSSOM.gold, color: BLOSSOM.gold }}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              View on a map
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.18}>
          <div
            className="mx-auto mt-10 w-full max-w-4xl overflow-hidden rounded-sm border"
            style={{ borderColor: BLOSSOM.blush }}
          >
            <iframe
              title={`Map — ${content.venueName || "wedding venue"}`}
              src={mapsEmbedUrl(query)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[16/10] w-full border-0 sm:aspect-[16/8]"
            />
          </div>
        </Reveal>
        {notes.length > 0 ? (
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
            {notes.map((note, i) => (
              <Reveal key={note.id} delay={0.05 * i}>
                <div
                  className="h-full rounded-sm border px-6 py-5"
                  style={{ backgroundColor: BLOSSOM.white, borderColor: BLOSSOM.blush }}
                >
                  <h3 className="font-blossom text-xl font-medium" style={{ color: BLOSSOM.oud }}>
                    {note.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-line" style={{ color: `${BLOSSOM.oud}CC` }}>
                    {note.body}
                  </p>
                  {note.linkUrl ? (
                    <a href={note.linkUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold" style={{ color: BLOSSOM.gold }}>
                      {note.linkLabel || "Open link"} ↗
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- 08 · Dress code ---------- */

/** The template's colour palette, shown as swatches so guests can match
 * the day's tones. Colours come from the BLOSSOM tokens, not from
 * couple data — the palette is the template's own. */
const PALETTE_SWATCHES: { label: string; hex: string }[] = [
  { label: "Ivory", hex: BLOSSOM.ivory },
  { label: "Blush", hex: BLOSSOM.blush },
  { label: "Rose", hex: BLOSSOM.rose },
  { label: "Oud", hex: BLOSSOM.oud },
  { label: "Gold", hex: BLOSSOM.gold },
];

export function BlossomDressCode({ site }: { site: WeddingSite }) {
  const notes = dressCodeNotes(site);
  const text = site.content.dressCode.trim();
  if (!site.settings.showDressCode || (!text && notes.length === 0)) return null;
  return (
    <section id="dress-code" aria-label="Dress code" className="mx-auto w-full max-w-5xl text-center" style={{ backgroundColor: BLOSSOM.secondaryBg }}>
      <div className={sectionPad()}>
        <SectionHeading
          eyebrow="Dress code"
          title="What to wear"
          intro={text || undefined}
          dividerVariant={3}
        />
        <Reveal delay={0.12}>
          <p className="mx-auto mt-8 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: BLOSSOM.gold }}>
            Our palette
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3" role="list" aria-label="Wedding colour palette">
            {PALETTE_SWATCHES.map((s) => (
              <span key={s.label} role="listitem" className="flex flex-col items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="block h-11 w-11 rounded-full border"
                  style={{ backgroundColor: s.hex, borderColor: BLOSSOM.blush }}
                />
                <span className="text-xs font-semibold" style={{ color: BLOSSOM.oud }}>
                  {s.label}
                </span>
              </span>
            ))}
          </div>
        </Reveal>
        {notes.length > 0 ? (
          <div className="mx-auto mt-10 grid max-w-3xl gap-5 text-left sm:grid-cols-2">
            {notes.map((note, i) => (
              <Reveal key={note.id} delay={0.05 * i}>
                <div
                  className="h-full rounded-sm border px-6 py-5"
                  style={{ backgroundColor: BLOSSOM.white, borderColor: BLOSSOM.blush }}
                >
                  <h3 className="font-blossom text-xl font-medium" style={{ color: BLOSSOM.oud }}>
                    {note.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-line" style={{ color: `${BLOSSOM.oud}CC` }}>
                    {note.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
