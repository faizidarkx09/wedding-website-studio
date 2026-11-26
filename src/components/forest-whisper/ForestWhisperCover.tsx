// Forest Whisper opening cover — view 01. SPLIT-SCREEN (never a
// full-bleed centred cover): the forest-trail photograph on the left
// (~55%) and a deep-green panel on the right with the couple names,
// the leaf-ring crest with the LIVE monogram overlaid as HTML text
// (never baked in), and "OPEN THE INVITATION". Fireflies drift over
// the whole cover. In narrow containers the two halves stack (photo
// on top, panel below); in wide containers they sit side by side —
// container queries only (@container / @min-[40rem]:), so the
// editor preview renders the stacked layout. Only the data comes
// from the site (Partner A / Partner B placeholders). No music on
// this template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { Fireflies, LeafCrest } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatCardDate, initials } from "./tokens";

export default function ForestWhisperCover({
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
      className="@container relative flex min-h-[100dvh] w-full cursor-pointer flex-col overflow-hidden bg-[#1B4332] text-[#F4F1E6] select-none @min-[40rem]:flex-row"
    >
      {/* Left half — the forest-trail photograph (~55% wide on wide
          containers; the top block when stacked). */}
      <div className="relative h-[38dvh] w-full shrink-0 overflow-hidden @min-[40rem]:h-auto @min-[40rem]:w-[55%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={COVER_IMAGE_URL}
          alt="A couple holding hands, walking down a mossy forest trail"
          referrerPolicy="no-referrer"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
        {/* Soft green shade so the panel edge reads cleanly and the
            photo never glares. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20, 48, 31, 0.18) 0%, rgba(20, 48, 31, 0.05) 50%, rgba(20, 48, 31, 0.42) 100%)",
          }}
        />
        {/* A thin moss seam where the photo meets the panel on wide
            containers. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-[3px] bg-[#6A994E]/70 @min-[40rem]:block"
        />
        {/* Eyebrow on the photo, bottom-left — cream on the darker
            foot of the photograph. */}
        <p className="fw-font-display absolute bottom-5 left-5 z-10 text-[10px] tracking-[0.34em] text-[#F4F1E6] uppercase drop-shadow-[0_2px_6px_rgba(20,48,31,0.9)] @min-[40rem]:bottom-8 @min-[40rem]:left-8">
          BENEATH THE CANOPY
        </p>
      </div>

      {/* Right half — deep-green panel with the names (~45% wide on
          wide containers; the lower block when stacked). */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 text-center @min-[40rem]:py-12">
        {/* Deep-green panel glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, rgba(106, 153, 78, 0.28) 0%, rgba(27, 67, 50, 0.35) 60%, rgba(20, 48, 31, 0.55) 100%)",
          }}
        />

        {/* Fireflies over the whole cover (photo + panel). */}
        {!prefersReducedMotion && <Fireflies />}

        {/* Leaf-ring crest with the live monogram */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.15, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-[240px] @min-[40rem]:max-w-[260px]"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative mx-auto aspect-square w-full max-w-[220px] @min-[40rem]:max-w-[240px]"
          >
            <LeafCrest className="absolute inset-0 h-full w-full drop-shadow-[0_10px_24px_rgba(20,48,31,0.6)]" />

            {/* Real HTML Typography Monogram Overlaid Inside the Crest Center */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="fw-font-display text-[1.7rem] font-medium tracking-[0.06em] text-[#E7EAD9] drop-shadow-[0_2px_8px_rgba(20,48,31,0.8)]"
              >
                {initials(site)}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        {/* Couple names in cream script */}
        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fw-font-script relative z-10 mt-6 px-3 text-[3rem] leading-[1.08] font-normal tracking-normal text-[#FBF9F1] drop-shadow-[0_3px_14px_rgba(20,48,31,0.75)] @min-[40rem]:mt-8 @min-[40rem]:text-[3.4rem]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Moss rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="relative z-10 mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#A7C957] to-transparent"
        />

        {/* Date line */}
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fw-font-display relative z-10 mt-5 text-[11px] tracking-[0.3em] text-[#E7EAD9] uppercase"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </motion.p>

        {/* Bottom Invitation Open Action */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mt-8 pb-2 text-center"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="group relative inline-flex min-h-[48px] items-center justify-center border border-[#A7C957]/70 px-6 py-3 fw-font-display text-xs tracking-[0.34em] text-[#F4F1E6] uppercase transition-colors duration-300 hover:border-[#F4F1E6] hover:bg-[#F4F1E6] hover:text-[#1B4332] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#A7C957]"
          >
            OPEN THE INVITATION
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
