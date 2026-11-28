// Eternal Moment hero — this IS the cover: a full-bleed hero photo
// with a monogram ring, small-caps eyebrow, Cormorant couple names,
// tagline, date + venue lines and the shared countdown. There is no
// separate cover file and no intro screen — the page opens directly
// on this hero.
"use client";

import type { CSSProperties } from "react";
import type { WeddingSite } from "@/lib/types";
import Countdown from "../Countdown";
import Reveal from "../Reveal";
import { EditorialFrame, MonogramRing } from "./Decor";
import {
  ETERNAL,
  FONT_BODY,
  FONT_DISPLAY,
  coupleNames,
  formatCardDate,
  formatDateTime,
  initials,
  resolveHeroSrc,
  venueLines,
  willRenderSection,
} from "./tokens";

export default function EternalMomentHero({ site }: { site: WeddingSite }) {
  const heroSrc = resolveHeroSrc(site);
  const names = coupleNames(site);
  const eyebrow = (site.content.subtitle ?? "").trim() || "AN ETERNAL MOMENT";
  const tagline = (site.content.tagline ?? "").trim();
  const dateLine = formatDateTime(site.weddingDate, site.timezone);
  const cardDate = formatCardDate(site.weddingDate, site.timezone);
  const venues = venueLines(site);
  const showCountdown = willRenderSection(site, "countdown");
  const year = (() => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: site.timezone,
        year: "numeric",
      }).format(new Date(site.weddingDate));
    } catch {
      return "";
    }
  })();

  return (
    <section
      id="home"
      aria-label={`${names} — wedding hero`}
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={{ backgroundColor: ETERNAL.espresso }}
    >
      {/* Photo */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt={`${names} — wedding photo`}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/65" />
      </div>

      <EditorialFrame className="z-10" />

      {/* Copy */}
      <div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 pt-28 pb-24 text-center"
        style={{ color: ETERNAL.paper }}
      >
        <Reveal>
          <MonogramRing initials={initials(site)} dark className="mx-auto" />
        </Reveal>
        <p className="mt-7 font-mono text-[0.65rem] tracking-[0.3em] text-[#E8CF9E] uppercase sm:text-[0.7rem] sm:tracking-[0.45em]">
          {eyebrow}
        </p>

        <h1
          className={`${FONT_DISPLAY} mt-6 text-[clamp(2.5rem,10vw,7rem)] leading-[1.02] font-medium tracking-[0.06em] text-balance`}
        >
          {site.content.partnerA}{" "}
          <span className="italic" style={{ color: ETERNAL.champagne }}>
            &amp;
          </span>{" "}
          {site.content.partnerB}
        </h1>

        <svg aria-hidden="true" viewBox="0 0 320 12" className="mt-6 h-3 w-56 sm:w-80" fill="none">
          <path d="M4 6 H 140 M 180 6 H 316" stroke={ETERNAL.gold} strokeWidth="1.2" />
          <path d="M160 2 L 166 6 L 160 10 L 154 6 Z" fill={ETERNAL.gold} />
        </svg>

        {tagline ? (
          <p className={`${FONT_DISPLAY} mt-6 text-2xl italic sm:text-3xl`}>{tagline}</p>
        ) : null}
        <p className="mt-5 font-mono text-[0.7rem] tracking-[0.3em] uppercase sm:text-[0.75rem] sm:tracking-[0.4em]">
          {dateLine}
        </p>
        {venues.map((line) => (
          <p
            key={line}
            className="mt-2 font-mono text-[0.65rem] tracking-[0.25em] uppercase sm:text-[0.7rem] sm:tracking-[0.3em]"
          >
            {line}
          </p>
        ))}
        <p className="mt-2 font-mono text-[0.65rem] tracking-[0.3em] text-[#E8CF9E] uppercase">
          {cardDate}
        </p>

        {showCountdown ? (
          <div className="mt-10 w-full max-w-2xl text-[#FFFEFC]">
            <Countdown
              date={site.weddingDate}
              timezone={site.timezone}
              style={site.settings.countdownStyle}
              postMessage={site.content.postWeddingMessage}
            />
          </div>
        ) : null}

        <a
          href="#story"
          className="mt-10 flex flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.35em] text-white/90 uppercase transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ outlineColor: ETERNAL.gold } as CSSProperties}
          aria-label="Scroll to our story"
        >
          Scroll
          <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-white/30">
            <span className="absolute top-0 left-0 block h-2.5 w-px animate-bounce" style={{ backgroundColor: ETERNAL.gold }} />
          </span>
        </a>
      </div>

      {/* Bottom corner meta — desktop editorial detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden items-end justify-between px-8 pb-5 font-mono text-[0.6rem] tracking-[0.35em] text-white/60 sm:flex"
      >
        <span>
          {initials(site)} — {year}
        </span>
        <span>{venues[venues.length - 1]?.toUpperCase() ?? ""}</span>
      </div>
    </section>
  );
}
