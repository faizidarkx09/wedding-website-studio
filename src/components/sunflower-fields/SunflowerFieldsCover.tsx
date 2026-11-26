// Sunflower Fields opening cover — view 01. Full-bleed low-angle
// sunflower-field photograph, the couple names over the CLEAR SKY
// in the top third (the hero crop keeps the sky empty in the middle
// for exactly this), the sunflower crest with the LIVE monogram
// overlaid as HTML text (never baked in), a floating-pollen
// particle layer, and "OPEN THE INVITATION". Only the data comes
// from the site (Partner A / Partner B placeholders). No music on
// this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Pollen, SunflowerCrest } from "./Decor";
import {
  COVER_IMAGE_URL,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  coupleNames,
  formatDateDisplay,
  initials,
} from "./tokens";

export default function SunflowerFieldsCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#14532D] px-5 pt-14 pb-12 text-[#14532D] select-none"
    >
      {/* Full-bleed sunflower-field photograph */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A sunflower field under a clear blue sky"
        referrerPolicy="no-referrer"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_18%]"
      />
      {/* Sky readability wash — only behind the names, fading out
          before the flowers, so the deep-green names stay readable
          over the bright sky without dulling the field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-[#FFFBEB]/75 via-[#FFFBEB]/35 to-transparent"
      />
      {/* Bottom readability wash for the open button */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#14532D]/55 via-[#14532D]/20 to-transparent"
      />

      {/* Floating pollen */}
      <Pollen />

      {/* Names over the sky */}
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[10px] font-semibold tracking-[0.34em] text-[#14532D] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_SCRIPT }}
          className="mt-4 max-w-[640px] text-[2.6rem] leading-[1.05] font-normal text-[#14532D] [text-shadow:0_1px_0_rgba(255,251,235,0.7),0_2px_10px_rgba(255,251,235,0.55)]"
        >
          {coupleNames(site)}
        </motion.h1>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-4 text-xs font-semibold tracking-[0.3em] text-[#14532D] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
      </div>

      {/* Sunflower crest with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <div className="relative flex h-36 w-36 items-center justify-center">
          <SunflowerCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_20px_rgba(20,83,45,0.45)]" />
          <span
            style={{ fontFamily: FONT_EDITORIAL }}
            className="relative z-10 text-[1.7rem] font-semibold tracking-[0.08em] text-[#FFFBEB] [text-shadow:0_1px_3px_rgba(69,26,3,0.8)]"
          >
            {initials(site)}
          </span>
        </div>
      </motion.div>

      {/* Open button */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <span
          style={{ fontFamily: FONT_DISPLAY }}
          className="rounded-full bg-[#14532D] px-7 py-3.5 text-[11px] font-semibold tracking-[0.3em] text-[#FFFBEB] uppercase shadow-[0_14px_28px_-8px_rgba(20,83,45,0.7)]"
        >
          Open the Invitation
        </span>
        <motion.span
          animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1] }}
          aria-hidden="true"
          className="mt-3 text-[#FFFBEB] [text-shadow:0_1px_4px_rgba(20,83,45,0.8)]"
        >
          ↓
        </motion.span>
        <span className="sr-only">Tap anywhere to open the invitation</span>
      </motion.div>
    </motion.div>
  );
}
