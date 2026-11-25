// Sapphire Royale opening cover (view 01). Midnight navy velvet,
// "UNDER A MIDNIGHT SKY", the couple names in silver script, the
// silver art-deco seal with the LIVE monogram overlaid as HTML text
// (never baked in), a silver sunburst rising behind it, and
// "OPEN THE INVITATION". Only the data comes from the site
// (Partner A / Partner B placeholders).
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SparkleField } from "./Decor";
import { COVER_IMAGE_URL, MONOGRAM_SEAL_URL, SUNBURST_URL, coupleNames, initials } from "./tokens";

export default function SapphireRoyaleCover({
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
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#0A1F44] px-5 py-12 text-[#F2F4F8] select-none sm:py-16"
    >
      {/* Midnight navy velvet backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${COVER_IMAGE_URL})` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(18, 41, 77, 0.18) 0%, rgba(6, 18, 43, 0.6) 100%)",
        }}
      />
      <SparkleField className="opacity-60" />

      {/* Silver sunburst rising behind the seal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[62vh] w-[110vw] max-w-[1100px] -translate-x-1/2 opacity-70"
        style={{
          backgroundImage: `url(${SUNBURST_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
          maskImage:
            "linear-gradient(to top, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, #000 55%, transparent 100%)",
        }}
      />

      {/* Silver geometric double border framing the cover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#C0C0C8]/35 sm:inset-7"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[22px] border border-[#C0C0C8]/15 sm:inset-9"
      />

      {/* Top spacer for classic upper-middle placement */}
      <div className="h-6 sm:h-10" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="sr-font-display text-xs tracking-[0.38em] text-[#D9D9DE]/90 uppercase sm:text-sm"
        >
          UNDER A MIDNIGHT SKY
        </motion.p>

        <motion.h1
          initial={
            prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
          }
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="sr-font-script mt-4 px-2 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFFFF] drop-shadow-[0_3px_14px_rgba(6,18,43,0.6)] sm:text-[4.6rem] md:text-[5.5rem]"
        >
          {coupleNames(site)}
        </motion.h1>
      </div>

      {/* Central-Lower Silver Art-Deco Seal with live monogram */}
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
            ease: [0.45, 0, 0.55, 1],
          }}
          className="relative mx-auto w-full max-w-[440px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={MONOGRAM_SEAL_URL}
            alt="Silver art-deco geometric seal with an empty centre for the couple's monogram"
            referrerPolicy="no-referrer"
            className="sr-mask-radial-soft mx-auto block w-full object-contain drop-shadow-[0_18px_36px_rgba(6,18,43,0.7)]"
          />

          {/* Real HTML Typography Monogram Overlaid Inside the Seal */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="sr-font-display sr-silver-embossed-text text-[1.95rem] font-medium tracking-[0.06em] sm:text-[2.75rem] md:text-[3.1rem]"
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 sr-font-display text-xs tracking-[0.34em] text-[#F2F4F8] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8] sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#C0C0C8]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F2F4F8]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
