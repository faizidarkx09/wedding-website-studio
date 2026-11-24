// Royal Burgundy opening cover — 1:1 port of the source's
// OpeningCover.tsx (view 01). Deep burgundy leather, "WITH LOVE",
// the couple names in gold script, the sculpted heart emblem with
// the LIVE monogram overlaid as HTML text (never baked in), and
// "OPEN THE INVITATION". Same values, same animation timings; only
// the data comes from the site (Partner A / Partner B placeholders)
// and framer-motion replaces the source's `motion` package.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { COVER_EMBLEM_URL, COVER_IMAGE_URL, coupleNames, initials } from "./tokens";

export default function RoyalBurgundyCover({
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
      exit={{ opacity: 0, y: -28, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
      onClick={onOpen}
      className="relative flex min-h-[100dvh] w-full cursor-pointer flex-col items-center justify-between overflow-hidden bg-[#460C1A] px-5 py-12 text-[#F5EBDD] select-none sm:py-16"
    >
      {/* Deep burgundy leather-textured handmade paper backdrop */}
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
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(114, 29, 49, 0.18) 0%, rgba(32, 6, 13, 0.56) 100%)",
        }}
      />

      {/* Subtle hairline inner border framing desktop/tablet luxury card feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 border border-[#B58A72]/20 sm:inset-7"
      />

      {/* Top spacer for classic upper-middle placement matching reference */}
      <div className="h-6 sm:h-10" />

      {/* Upper-Middle Couple Typography */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="rb-font-display text-xs tracking-[0.38em] text-[#EDE2D1]/90 uppercase sm:text-sm"
        >
          WITH LOVE
        </motion.p>

        {/* Handwritten Script Reveal */}
        <motion.h1
          initial={
            prefersReducedMotion ? false : { opacity: 0, clipPath: "inset(0 100% 0 0)" }
          }
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 1.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rb-font-script mt-4 px-2 text-[3.4rem] leading-[1.08] font-normal tracking-normal text-[#FFFDF9] drop-shadow-[0_3px_14px_rgba(24,4,9,0.5)] sm:text-[4.6rem] md:text-[5.5rem]"
        >
          {coupleNames(site)}
        </motion.h1>
      </div>

      {/* Central-Lower Sculpted 3D Embossed Heart & Botanical Branches */}
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
            ease: "easeInOut",
          }}
          className="relative mx-auto w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_EMBLEM_URL}
            alt="Embossed deep burgundy wax heart emblem framed by antique rose-gold botanical branches"
            referrerPolicy="no-referrer"
            className="rb-mask-radial-soft mx-auto block w-full max-w-[640px] object-contain drop-shadow-[0_18px_36px_rgba(22,3,8,0.65)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 48% 45% at 50% 50%, #000 62%, rgba(0,0,0,0.85) 78%, transparent 100%)",
            }}
          />

          {/* Real HTML Typography Monogram Overlaid Inside the Sculpted Heart Center */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="rb-font-display rb-wax-embossed-text -translate-y-[9%] text-[1.95rem] font-medium tracking-[0.06em] sm:text-[2.75rem] md:text-[3.1rem]"
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
          className="group relative inline-flex min-h-[48px] items-center justify-center px-6 py-3 rb-font-display text-xs tracking-[0.34em] text-[#F5EBDD] uppercase transition-colors duration-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B58A72] sm:text-sm"
        >
          <span>OPEN THE INVITATION</span>
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 h-px w-20 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#B58A72]/80 to-transparent transition-all duration-300 group-hover:w-36 group-hover:via-[#F5EBDD]"
          />
        </button>
      </motion.div>
    </motion.div>
  );
}
