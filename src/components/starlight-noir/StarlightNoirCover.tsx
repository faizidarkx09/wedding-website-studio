// Starlight Noir opening cover — view 01. Full-bleed night-sky
// photograph with a gold constellation-line SVG overlay, "UNDER A
// SKY OF STARS", the couple names in gold Cinzel caps, the gold
// star constellation crest with the LIVE monogram overlaid as HTML
// text (never baked in), a twinkling-star particle layer, and
// "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders). No music on this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { StarCrest, Starfield } from "./Decor";
import {
  COVER_IMAGE_URL,
  FONT_DISPLAY,
  FONT_SCRIPT,
  coupleNames,
  initials,
} from "./tokens";

/** Gold constellation lines drawn over the cover photo — a few
 * star polygons linked across the sky, echoing the photo's own
 * constellations. Pure SVG, no baked-in text. */
function CoverConstellations({ className = "" }: { className?: string }) {
  const stars: Array<[number, number, number]> = [
    [8, 12, 2.2],
    [22, 7, 1.6],
    [38, 14, 2.4],
    [55, 8, 1.8],
    [71, 13, 2.2],
    [86, 9, 1.7],
    [93, 22, 2.0],
    [14, 26, 1.5],
    [30, 30, 1.8],
    [63, 28, 1.6],
    [80, 32, 1.9],
  ];
  const links: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [2, 8],
    [7, 8],
    [8, 9],
    [9, 10],
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="none"
      className={`pointer-events-none absolute inset-x-0 top-0 h-[42%] w-full ${className}`}
    >
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={stars[a][0]}
          y1={stars[a][1]}
          x2={stars[b][0]}
          y2={stars[b][1]}
          stroke="#D4AF37"
          strokeWidth="0.18"
          opacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#F2D98C" opacity="0.9" />
      ))}
    </svg>
  );
}

export default function StarlightNoirCover({
  site,
  onOpen,
}: {
  site: WeddingSite;
  onOpen: () => void;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      role="region"
      aria-label="Wedding Invitation Cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -96, scale: 0.97, transition: { duration: 1.05, ease: [0.33, 0, 0.67, 1] } }}
      onClick={onOpen}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0A0A0A] px-5 py-12 text-[#F5EFE0] select-none"
    >
      {/* Full-bleed night-sky photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A couple standing beneath a black night sky full of gold stars and constellation lines"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Dark overlays so the gold type stays readable over the
          bright star field: heavier at top and bottom, lighter in
          the middle where the couple stands. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 10, 10, 0.78) 0%, rgba(10, 10, 10, 0.22) 30%, rgba(10, 10, 10, 0.18) 55%, rgba(10, 10, 10, 0.72) 100%)",
        }}
      />

      {/* Gold constellation lines over the photo */}
      <CoverConstellations className="opacity-80" />

      {/* Twinkling stars — ~60 slow gold stars over the photograph */}
      {!prefersReducedMotion && <Starfield density={60} />}

      {/* Double gold hairline inner border framing the night-sky feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#D4AF37]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#D4AF37]/20"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography — gold Cinzel caps, not script */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-xs tracking-[0.38em] text-[#F2D98C] uppercase drop-shadow-[0_2px_6px_rgba(10,10,10,0.9)]"
        >
          Under a Sky of Stars
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 px-3 text-[2.6rem] leading-[1.12] font-normal tracking-[0.06em] text-[#D4AF37] uppercase drop-shadow-[0_3px_14px_rgba(10,10,10,0.85)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Gold rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_SCRIPT }}
          className="mt-4 text-[1.7rem] leading-none text-[#F5EFE0] drop-shadow-[0_2px_8px_rgba(10,10,10,0.9)]"
        >
          written in the stars
        </motion.p>
      </div>

      {/* Central-Lower Star Constellation Crest with live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative mx-auto aspect-square w-full max-w-[280px]"
        >
          <StarCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(10,10,10,0.7)]" />

          {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: FONT_DISPLAY }}
              className="text-[1.7rem] font-medium tracking-[0.08em] text-[#F2D98C] drop-shadow-[0_2px_8px_rgba(10,10,10,0.9)]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Invitation Open Action */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 text-xs tracking-[0.34em] text-[#F5EFE0] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <span className="drop-shadow-[0_2px_6px_rgba(10,10,10,0.9)]">Open the Invitation</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F5EFE0]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
