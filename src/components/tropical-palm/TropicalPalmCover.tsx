// Tropical Palm opening cover — view 01. Full-bleed beach
// photograph with real palm-leaf shadows, a floating-leaf particle
// layer, a palm-leaf crest with the LIVE monogram overlaid as HTML
// text (never baked in), and the couple names + date + "OPEN THE
// INVITATION" on a sand-cream card anchored to the bottom third —
// a different composition from Golden Hour's centred stack. Only
// the data comes from the site (Partner A / Partner B placeholders).
// No music on this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FloatingLeaves, PalmCrest } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

export default function TropicalPalmCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#14532D] px-5 pt-10 pb-8 text-[#FFFBEB] select-none"
    >
      {/* Full-bleed beach photograph with palm shadows */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="A tropical beach at golden hour with palm-leaf shadows across white sand"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Deep-green overlays so the cream type stays readable over
          the bright sand and sea: heavier at top and bottom, lighter
          in the middle where the turquoise water glows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 46, 25, 0.66) 0%, rgba(10, 46, 25, 0.14) 32%, rgba(10, 46, 25, 0.10) 55%, rgba(10, 46, 25, 0.72) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 42%, rgba(6, 182, 212, 0.10) 0%, rgba(10, 46, 25, 0.26) 100%)",
        }}
      />

      {/* Floating leaves — ~40 slow drifting palm leaves over the photo */}
      {!prefersReducedMotion && <FloatingLeaves />}

      {/* Double sand hairline inner border framing the beach-card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#FDE68A]/50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#06B6D4]/25"
      />

      {/* Top eyebrow */}
      <motion.p
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="tp-font-display relative z-10 text-xs tracking-[0.38em] text-[#FEF3C7] uppercase drop-shadow-[0_2px_6px_rgba(10,46,25,0.8)]"
      >
        TOGETHER WITH THEIR FAMILIES
      </motion.p>

      {/* Upper-middle palm-leaf crest with the live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px]"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative mx-auto aspect-square w-full max-w-[260px]"
        >
          <PalmCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(10,46,25,0.6)]" />

          {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="tp-font-display tp-palm-embossed-text text-[1.9rem] font-medium tracking-[0.06em]"
            >
              {initials(site)}
            </motion.span>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom sand-cream card: names + date + open action */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[520px]"
      >
        <div className="relative overflow-hidden bg-[#FFFDF6]/95 px-6 pt-7 pb-6 text-center text-[#14301C] shadow-[0_24px_48px_-16px_rgba(10,46,25,0.6)]">
          {/* Palm-green double border */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 border border-[#15803D]/70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[13px] border border-[#06B6D4]/40"
          />

          <div className="relative z-10 flex flex-col items-center">
            <p className="tp-font-display text-[10px] tracking-[0.34em] text-[#166534] uppercase">
              WE INVITE YOU
            </p>

            <h1 className="tp-font-script mt-3 px-2 text-[3rem] leading-[1.08] font-normal text-[#14532D] drop-shadow-[0_1px_2px_rgba(20,83,45,0.15)]">
              {coupleNames(site)}
            </h1>

            <div
              aria-hidden="true"
              className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-[#15803D] to-transparent"
            />

            <p className="tp-font-display mt-3 text-[11px] tracking-[0.3em] text-[#0E7490] uppercase">
              {formatDateDisplay(site.weddingDate, site.timezone)}
            </p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="group relative mt-4 inline-flex min-h-[48px] items-center justify-center px-6 py-3 tp-font-display text-xs tracking-[0.34em] text-[#14532D] uppercase transition-colors duration-300 hover:text-[#15803D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15803D]"
            >
              <span>OPEN THE INVITATION</span>
              <span
                aria-hidden="true"
                className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#06B6D4] to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#15803D]"
              />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
