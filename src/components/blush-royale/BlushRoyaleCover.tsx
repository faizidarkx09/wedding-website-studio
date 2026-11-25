// Blush Royale opening cover — view 01. Blush watercolor wash,
// "WITH LOVE", the couple names in rose-gold script, the rose-gold
// wax-seal emblem with the LIVE monogram overlaid as HTML text
// (never baked in), and "OPEN THE INVITATION". Only the data comes
// from the site (Partner A / Partner B placeholders).
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { COVER_EMBLEM_URL, WASH_IMAGE_URL, coupleNames, initials } from "./tokens";

export default function BlushRoyaleCover({
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
      exit={{ opacity: 0, y: -48, scale: 0.97, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
      onClick={onOpen}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#F6DDE0] px-5 py-12 text-[#5C323B] select-none sm:py-16"
    >
      {/* Soft blush watercolor-wash backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${WASH_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255, 253, 251, 0.4) 0%, rgba(239, 201, 206, 0.35) 100%)",
        }}
      />

      {/* Delicate hairline inner border framing the card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-[2rem] border border-[#B76E79]/25 sm:inset-7"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6 sm:h-10" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="br-font-display text-xs tracking-[0.38em] text-[#7A4A55]/90 uppercase sm:text-sm"
        >
          WITH LOVE
        </motion.p>

        {/* Rose-gold script reveal */}
        <motion.h1
          initial={
            prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
          }
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="br-font-script mt-4 px-2 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#B76E79] drop-shadow-[0_2px_10px_rgba(183,110,121,0.25)] sm:text-[4.6rem] md:text-[5.5rem]"
        >
          {coupleNames(site)}
        </motion.h1>
      </div>

      {/* Central-Lower Rose-Gold Wax Seal Emblem */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.15, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-4 w-full max-w-[560px] sm:my-6"
      >
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
          className="relative mx-auto w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_EMBLEM_URL}
            alt="Rose-gold wax heart seal emblem framed by blush watercolor roses"
            referrerPolicy="no-referrer"
            className="br-mask-radial-soft mx-auto block w-full max-w-[520px] object-contain drop-shadow-[0_18px_36px_rgba(92,50,59,0.35)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
            }}
          />

          {/* Real HTML Typography Monogram Overlaid Inside the Seal */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="br-font-display br-rose-embossed-text -translate-y-[9%] text-[1.95rem] font-medium tracking-[0.06em] sm:text-[2.75rem] md:text-[3.1rem]"
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 br-font-display text-xs tracking-[0.34em] text-[#5C323B] uppercase transition-colors duration-300 hover:text-[#B76E79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79] sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#B76E79]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#B76E79]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
