// Sakura Dream opening cover — view 01. NOT a full-bleed photo:
// a branch-framed CIRCLE photo — the couple's photo inside a
// circle ringed by sakura branches, on a blush-white ground, with
// the names in deep-plum script above it, a live monogram disc
// overlapping the circle's foot, the date line, falling petals and
// "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders). No music on this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Blossom, BlossomBranch, SakuraPetals } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

export default function SakuraDreamCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#FDF2F8] px-5 py-12 text-[#2E0A3D] select-none"
    >
      {/* Soft blush ground — pink glow at the top, white at the foot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(249, 168, 212, 0.45) 0%, rgba(253, 242, 248, 0.0) 60%), radial-gradient(ellipse 80% 50% at 50% 100%, rgba(251, 207, 232, 0.5) 0%, rgba(253, 242, 248, 0.0) 65%)",
        }}
      />

      {/* Falling sakura petals */}
      {!prefersReducedMotion && <SakuraPetals />}

      {/* Double pink hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#EC4899]/40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#EC4899]/20"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6" />

      {/* Upper-Middle Couple Typography — deep plum on blush, high contrast */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display text-xs tracking-[0.38em] text-[#6B21A8] uppercase"
        >
          WITH LOVE
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="sd-font-script mt-4 px-3 text-[3.2rem] leading-[1.08] font-normal tracking-normal text-[#2E0A3D]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Pink rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 flex items-center gap-3"
        >
          <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#EC4899]/90" />
          <Blossom className="h-5 w-5" />
          <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#EC4899]/90" />
        </motion.div>

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="sd-font-display mt-4 text-[11px] tracking-[0.3em] text-[#6B21A8] uppercase"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
      </div>

      {/* Branch-framed CIRCLE photo — the cover composition that
          makes Sakura Dream different: the photo lives in a circle,
          sakura branches arch over its top from both sides, and the
          live monogram sits in a plum disc overlapping its foot. */}
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
          className="relative mx-auto aspect-square w-full max-w-[320px]"
        >
          {/* Circle photo */}
          <div className="absolute inset-0 overflow-hidden rounded-full shadow-[0_20px_44px_-12px_rgba(107,33,168,0.45)] ring-4 ring-white ring-offset-4 ring-offset-[#FBCFE8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={COVER_IMAGE_URL}
              alt="A couple holding hands beneath blooming cherry blossom trees"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Sakura branches arching over the circle — left branch
              and its mirror, meeting above the top of the circle */}
          <BlossomBranch className="pointer-events-none absolute -top-6 -left-10 w-[62%] -rotate-[8deg] drop-shadow-[0_4px_10px_rgba(107,33,168,0.25)]" />
          <BlossomBranch className="pointer-events-none absolute -top-6 -right-10 w-[62%] -scale-x-100 rotate-[8deg] drop-shadow-[0_4px_10px_rgba(107,33,168,0.25)]" />

          {/* Live monogram disc overlapping the circle's foot */}
          <div className="absolute -bottom-3 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-[#6B21A8] shadow-[0_12px_24px_-6px_rgba(46,10,61,0.55)] ring-4 ring-white">
            <span className="sd-font-display text-lg font-medium tracking-[0.06em] text-white">
              {initials(site)}
            </span>
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 sd-font-display text-xs tracking-[0.34em] text-[#6B21A8] uppercase transition-colors duration-300 hover:text-[#2E0A3D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#EC4899]"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#EC4899]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#6B21A8]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
