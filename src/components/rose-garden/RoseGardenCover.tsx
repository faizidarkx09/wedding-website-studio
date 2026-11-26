// Rose Garden opening cover — view 01. Garden-arch composition:
// the cover photo sits inside a TALL ARCH (rounded-top) on a cream
// field, the couple names below in deep-rose script, a falling-petal
// layer, and "OPEN THE INVITATION". NOT a full-bleed centred cover.
// Only the data comes from the site (Partner A / Partner B
// placeholders). No music on this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FallingPetals, RoseDivider } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

export default function RoseGardenCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-[#FFF7F2] px-5 py-12 text-[#3D1420] select-none"
    >
      {/* Falling rose petals over the cream field */}
      {!prefersReducedMotion && <FallingPetals />}

      {/* Double hairline inner border framing the garden-card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#B3124F]/35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#3E6B3A]/25"
      />

      <div className="relative z-10 flex w-full max-w-[480px] flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display text-xs tracking-[0.38em] text-[#7E0C37] uppercase"
        >
          TOGETHER WITH THEIR FAMILIES
        </motion.p>

        {/* The garden arch — the cover photo inside a tall arch */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.15, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 w-full max-w-[340px]"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[999px] rounded-b-[6px] shadow-[0_28px_48px_-16px_rgba(61,20,32,0.5)] ring-1 ring-[#B3124F]/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={COVER_IMAGE_URL}
              alt="A couple walking beneath a rose-covered garden arch"
              referrerPolicy="no-referrer"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
            {/* Soft rose wash at the arch foot so the frame reads as
                one garden, not a cut-out photo. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(179, 18, 79, 0.05) 0%, rgba(179, 18, 79, 0) 30%, rgba(61, 20, 32, 0.08) 100%)",
              }}
            />
          </div>
          {/* Inner arch hairline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded-t-[999px] rounded-b-[4px] border border-[#FFF7F2]/70"
          />
          {/* Live monogram medallion overlapping the arch foot */}
          <div className="absolute -bottom-5 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#B3124F] text-[#FFF7F2] shadow-[0_10px_20px_-6px_rgba(126,12,55,0.65)] ring-2 ring-[#FFF7F2]">
            <span className="rg-font-display text-sm font-medium tracking-[0.06em]">
              {initials(site)}
            </span>
          </div>
        </motion.div>

        {/* Names below the arch, in deep-rose script */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rg-font-script mt-11 px-3 text-[3.2rem] leading-[1.08] font-normal tracking-normal text-[#B3124F]"
        >
          {coupleNames(site)}
        </motion.h1>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-4 w-full"
        >
          <RoseDivider className="w-40" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          className="rg-font-display mt-4 text-[11px] tracking-[0.3em] text-[#3D1420] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>

        {/* Bottom Invitation Open Action */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-8 pb-2 text-center"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="group relative inline-flex min-h-[48px] items-center justify-center bg-[#B3124F] px-7 py-3 rg-font-display text-xs tracking-[0.3em] text-[#FFF7F2] uppercase shadow-[0_12px_24px_-8px_rgba(126,12,55,0.6)] transition-colors duration-300 hover:bg-[#7E0C37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B3124F]"
          >
            OPEN THE INVITATION
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
