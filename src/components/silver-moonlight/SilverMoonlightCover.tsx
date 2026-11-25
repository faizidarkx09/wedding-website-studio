// Silver Moonlight opening cover — view 01. Deep night sky (the
// hero photograph), a twinkling-star layer, "UNDER A SILVER MOON",
// the couple names in ice-white script, a silver crescent seal with
// the LIVE monogram overlaid as HTML text (never baked in), and
// "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders). No music on this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { CrescentMoon, TwinklingStars } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, initials } from "./tokens";

export default function SilverMoonlightCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#16202E] px-5 py-12 text-[#F4F7FA] select-none sm:py-16"
    >
      {/* Night-sky hero photograph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      {/* Darken the sky so ice-white type stays high-contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14, 22, 32, 0.42) 0%, rgba(14, 22, 32, 0.12) 40%, rgba(14, 22, 32, 0.48) 100%)",
        }}
      />

      {/* Twinkling-star layer (canvas, ~50 stars, under the text) */}
      <TwinklingStars />

      {/* Double silver hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#C9CDD6]/35 sm:inset-7"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#C9CDD6]/15 sm:inset-9"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6 sm:h-10" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="er-font-display text-xs tracking-[0.38em] text-[#DDE1E8]/95 uppercase sm:text-sm"
        >
          UNDER A SILVER MOON
        </motion.p>

        {/* Handwritten Script Reveal — fade + gentle rise, never a
            left-to-right clip wipe (the wipe cut script swashes
            mid-reveal on Emerald's cover). */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="er-font-script mt-4 px-3 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFFFF] drop-shadow-[0_3px_14px_rgba(14,22,32,0.65)] sm:text-[4.6rem] md:text-[5.5rem]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Silver rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#C9CDD6] to-transparent sm:w-56"
        />
      </div>

      {/* Central-Lower Silver Crescent Seal with live monogram */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.15, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[420px] sm:my-6"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64"
        >
          {/* Silver seal disc — radial silver gradient + ring */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full shadow-[0_18px_36px_rgba(14,22,32,0.65)] ring-2 ring-[#E8EBF0]/50"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #F4F7FA 0%, #DDE1E8 38%, #C9CDD6 62%, #9AA3B0 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-3 rounded-full border border-[#16202E]/25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[18px] rounded-full border border-white/50"
          />
          {/* Crescent moon emblem */}
          <CrescentMoon className="absolute top-6 left-1/2 h-10 w-10 -translate-x-1/2 opacity-90 sm:top-7 sm:h-11 sm:w-11" />

          {/* Real HTML Typography Monogram Overlaid Inside the Seal */}
          <motion.span
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="er-font-display relative z-10 mt-8 text-[1.95rem] font-medium tracking-[0.06em] text-[#16202E] sm:mt-9 sm:text-[2.4rem]"
            style={{
              textShadow:
                "0 1px 0 rgba(255, 255, 255, 0.55), 0 -1px 0 rgba(22, 32, 46, 0.25), 0 2px 3px rgba(22, 32, 46, 0.3)",
            }}
          >
            {initials(site)}
          </motion.span>
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 er-font-display text-xs tracking-[0.34em] text-[#F4F7FA] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9CDD6] sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C9CDD6]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F4F7FA]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
