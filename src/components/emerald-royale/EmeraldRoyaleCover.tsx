// Emerald Royale opening cover — view 01. Deep emerald leather,
// "WITH LOVE", the couple names in gold script, the gold filigree
// heart crest with the LIVE monogram overlaid as HTML text (never
// baked in), a slow gold shimmer sweep, and "OPEN THE INVITATION".
// Only the data comes from the site (Partner A / Partner B
// placeholders). No music on this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { COVER_EMBLEM_URL, LEATHER_IMAGE_URL, coupleNames, initials } from "./tokens";

export default function EmeraldRoyaleCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0B3D2E] px-5 py-12 text-[#F7F3E8] select-none sm:py-16"
    >
      {/* Deep emerald leather-textured backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LEATHER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(20, 84, 61, 0.18) 0%, rgba(4, 26, 19, 0.56) 100%)",
        }}
      />

      {/* Slow gold shimmer sweep across the whole cover */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(201, 162, 39, 0.14) 45%, rgba(232, 213, 160, 0.22) 50%, rgba(201, 162, 39, 0.14) 55%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "420%" }}
          transition={{ duration: 7, repeat: Infinity, repeatDelay: 4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      )}

      {/* Double gold hairline inner border framing the luxury card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#C9A227]/35 sm:inset-7"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#C9A227]/15 sm:inset-9"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6 sm:h-10" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-xs tracking-[0.38em] text-[#EFE7D3]/90 uppercase sm:text-sm"
        >
          WITH LOVE
        </motion.p>

        {/* Handwritten Script Reveal — fade + gentle rise, never a
            left-to-right clip wipe: the wipe's clip-path cut the
            script's swashes mid-reveal, which read on the live site
            as the heading clipped at its right edge (no persistent
            overflow was measurable — scrollWidth == clientWidth at
            1440 / 1920 / 390 — the wipe itself was the clip). */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="er-font-script mt-4 px-3 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFDF9] drop-shadow-[0_3px_14px_rgba(4,26,19,0.5)] sm:text-[4.6rem] md:text-[5.5rem]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Gold rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent sm:w-56"
        />
      </div>

      {/* Central-Lower Gold Filigree Heart Crest */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.15, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[660px] sm:my-6"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative mx-auto w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_EMBLEM_URL}
            alt="Ornate gold filigree heart crest framed by golden botanical branches on deep emerald leather"
            referrerPolicy="no-referrer"
            className="er-mask-radial-soft mx-auto block w-full max-w-[640px] object-contain drop-shadow-[0_18px_36px_rgba(4,26,19,0.65)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
            }}
          />

          {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="er-font-display er-wax-embossed-text -translate-y-[9%] text-[1.95rem] font-medium tracking-[0.06em] sm:text-[2.75rem] md:text-[3.1rem]"
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
        transition={{ duration: 0.9, delay: 1.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 pb-2 text-center"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 er-font-display text-xs tracking-[0.34em] text-[#F7F3E8] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9A227] sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C9A227]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F7F3E8]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
