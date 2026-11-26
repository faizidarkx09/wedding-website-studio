// Vintage Lace envelope — interactive ivory envelope with a
// crocheted-lace doily seal (drawn SVG) and the sliding ivory
// letterpress card (tap the seal to break it and reveal / tuck the
// card back). No music on this template — the seal is the
// interaction.
//
// ENVELOPE GEOMETRY (the hard lesson, proven on Golden Hour): the
// card MUST be tucked INSIDE at rest — names peeking above the
// pocket, divider/date/location hidden — and slide out ONLY on tap.
// The pocket is a second render of the envelope photo ABOVE the
// card, clipped to the pocket's shape. The envelope photo
// (vintage-lace-detail.jpg, 1200x854, cropped to the envelope
// itself) has its flap point at ~(50%, 63%) with pocket diagonals
// running from the flap point down to the bottom corners — the same
// geometry as Golden Hour's envelope, so the same proven clip
// polygon applies: rest "polygon(19% 52%, 32% 65%, 68% 65%, 81%
// 52%, 81% 100%, 19% 100%)", open drops the top edge to ~97% while
// the card lifts 48px. The card is sized by CONTAINER width
// (@container on the outer wrapper — never viewport `sm:` — so the
// editor's Mobile (390px) preview gets the mobile card), in three
// bands, because the card's content is fixed px while the 4:3
// container shrinks: <352px compact (15px names), 352–469px small
// card (17px names, top 28% in the 384–469 band), >=470px large
// card (22px names, py-5, top 25%). The large card starts at
// 470px, not 384px: at 430px viewport (398x299 container) the
// large card spanned 25%→131.7% and Partner B sat behind the
// pocket — the proven 430px trap. DO NOT "simplify" these bands.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { LaceDivider, LaceSeal } from "./Decor";
import { ENVELOPE_IMAGE_URL, formatCardDate, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ivory letterpress card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF8] px-4 py-3 text-center text-[#4A3A2E] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(74,58,46,0.52),0_4px_12px_rgba(74,58,46,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(74,58,46,0.45)]"
      }`}
    >
      {/* Ivory paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 248, 0.4) 0%, rgba(247, 235, 217, 0.55) 100%)",
        }}
      />

      {/* Fine double sepia & rose letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#8B7355]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#C08A8E]/45 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#6B563E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#6B563E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#6B563E]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#6B563E]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="vl-font-display text-[9px] font-semibold tracking-[0.26em] text-[#6B563E] uppercase @min-[29.375rem]:text-[10px]">
          We invite you
        </p>

        <h2 className="vl-font-display mt-2 text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#4A3A2E] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="vl-font-editorial my-0.5 text-base italic text-[#A66A6E] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="vl-font-display text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#4A3A2E] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <LaceDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="vl-font-display text-[9px] font-semibold tracking-[0.24em] text-[#4A3A2E] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="vl-font-display mt-1 text-[8.5px] font-semibold tracking-[0.22em] text-[#6B563E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LaceSealButton — the crocheted-lace doily seal open button.      */
/* Tapping it "breaks" the seal (it tilts and fades) and the card   */
/* slides up; tapping again reseals it.                               */
/* ------------------------------------------------------------------ */

function LaceSealButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen ? "Reseal the lace envelope" : "Break the lace seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_16px_30px_-8px_rgba(74,58,46,0.6),0_4px_10px_rgba(74,58,46,0.35)] ring-2 ring-[#8B7355]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
      >
        <LaceSeal className="absolute inset-0 h-full w-full" />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#4A3A2E]/50"
          />
        )}
      </motion.button>

      <span className="vl-font-editorial mt-3 text-xs tracking-[0.18em] text-[#6B563E] uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function VintageLaceEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Lace Envelope + Sliding Letterpress Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px] @container"
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={isCardLifted}
            aria-label={
              isCardLifted
                ? "Tuck wedding invitation card back into the envelope"
                : "Open lace envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A3A2E]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the lace envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(74,58,46,0.28)] ring-1 ring-[#8B7355]/40">
              {/* Layer 1: Lace envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Vintage ivory wedding envelope with a triangular flap"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Ivory Letterpress Invitation Card */}
              <motion.div
                initial={false}
                animate={{
                  y: isCardLifted ? (prefersReducedMotion ? -28 : -48) : 0,
                  scale: isCardLifted ? 1.03 : 1,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-[25%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[24rem]:top-[28%] @min-[29.375rem]:top-[25%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL ivory pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from vintage-lace-detail.jpg,
                  1200x854, cropped to the envelope itself): a classic
                  envelope — triangular flap with its point at centre
                  ~(50%, 63%), pocket diagonals running from the flap
                  point down to the bottom corners, so the true pocket
                  edge is ^-shaped (63% at centre, ~76% at x=32%/68%,
                  ~80% at the card's edges). The clip reuses Golden
                  Hour's proven single flat polygon (19% 52%, 32%
                  65%, 68% 65%, 81% 52%): it sits ABOVE the true
                  pocket edge across the card's sides (65% vs 76%
                  true at x=32%) and ~2% BELOW the flap point at
                  centre (65% vs 63% true) — a ~7px sliver where the
                  card peeks just past the fold point, which reads as
                  the card emerging from behind the fold. On tap the
                  clip's top edge drops to ~97% (the pocket opens)
                  while the card lifts 48px, so divider + date +
                  location are fully revealed with no top clipping. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(19% 96%, 32% 97.5%, 68% 97.5%, 81% 96%, 81% 100%, 19% 100%)"
                    : "polygon(19% 52%, 32% 65%, 68% 65%, 81% 52%, 81% 100%, 19% 100%)",
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute inset-0 z-20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ENVELOPE_IMAGE_URL}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="block h-full w-full object-cover"
                />
              </motion.div>
            </div>

            {/* Subtle interactive cue */}
            <p className="vl-font-display mt-1 text-center text-[10px] font-semibold tracking-[0.26em] text-[#6B563E] uppercase transition-colors group-hover:text-[#4A3A2E]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Crocheted Lace Doily Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <LaceSealButton isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
