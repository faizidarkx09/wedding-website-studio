// Desert Dusk opening cover — view 01. Dune-HORIZON composition:
// the full-bleed desert-dusk photograph has its horizon low (the
// dunes sit in the bottom third), so the couple names are written
// IN THE SKY ITSELF — upper third, cream script over the dusk
// gradient — with the low sun glowing on the horizon behind the
// "OPEN THE INVITATION" action. A drifting-sand-motes particle
// layer floats over the photograph. Only the data comes from the
// site (Partner A / Partner B placeholders). No music on this
// template.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SandMotes, SunEmblem } from "./Decor";
import { COVER_IMAGE_URL, coupleNames, formatDateDisplay, initials } from "./tokens";

export default function DesertDuskCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#3D2133] px-5 pt-14 pb-12 text-[#FFF8EC] select-none"
    >
      {/* Full-bleed desert-dusk photograph — low dune horizon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt="Desert dunes at dusk under a terracotta and purple sky"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      />
      {/* Dusk overlays so the cream type stays readable over the
          bright sky: heavier at the top (where the names sit) and
          at the bottom (where the action sits), lightest across the
          glowing horizon band in the middle. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(61, 33, 51, 0.78) 0%, rgba(61, 33, 51, 0.34) 28%, rgba(61, 33, 51, 0.10) 52%, rgba(61, 33, 51, 0.30) 72%, rgba(61, 33, 51, 0.72) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 62%, rgba(217, 160, 91, 0.14) 0%, rgba(61, 33, 51, 0.30) 100%)",
        }}
      />

      {/* Drifting sand motes over the photograph */}
      {!prefersReducedMotion && <SandMotes />}

      {/* Double terracotta hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#D9A05B]/45"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#D9A05B]/20"
      />

      {/* Names in the sky — upper third */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display text-xs tracking-[0.38em] text-[#F5E6D3] uppercase drop-shadow-[0_2px_6px_rgba(61,33,51,0.85)]"
        >
          UNDER A DESERT SKY
        </motion.p>

        <motion.h1
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="dd-font-script mt-5 px-3 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFDF9] drop-shadow-[0_3px_14px_rgba(61,33,51,0.8)]"
        >
          {coupleNames(site)}
        </motion.h1>

        {/* Terracotta rule under the names */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-[#D9A05B] to-transparent"
        />

        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="dd-font-display mt-4 text-[11px] tracking-[0.3em] text-[#FFF8EC] uppercase drop-shadow-[0_2px_6px_rgba(61,33,51,0.85)]"
        >
          {formatDateDisplay(site.weddingDate, site.timezone)}
        </motion.p>
      </div>

      {/* Middle spacer — the open sky and glowing horizon breathe here */}
      <div className="flex-1" />

      {/* Lower third — sun emblem with live monogram + open action */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[260px]"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative mx-auto w-full max-w-[220px]"
          >
            <SunEmblem className="h-auto w-full drop-shadow-[0_10px_24px_rgba(61,33,51,0.6)]" />
            {/* Live monogram overlaid on the sun disc */}
            <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-[16%]">
              <motion.span
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="dd-font-display dd-sun-embossed-text text-[1.5rem] font-medium tracking-[0.06em]"
              >
                {initials(site)}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="mt-2 pb-2 text-center"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 dd-font-display text-xs tracking-[0.34em] text-[#FFF8EC] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D9A05B]"
          >
            <span className="drop-shadow-[0_2px_6px_rgba(61,33,51,0.85)]">OPEN THE INVITATION</span>
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D9A05B]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#FFF8EC]"
            />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
