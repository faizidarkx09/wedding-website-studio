// Golden Hour envelope — interactive golden envelope with a gold
// sunburst wax seal and the sliding cream letterpress card (tap the
// seal to break it and reveal / tuck the card back). No music on
// this template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SunburstDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  WAX_SEAL_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding cream letterpress card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-3 text-center text-[#3B2A12] transition-shadow duration-700 @sm:px-6 @sm:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(36,23,8,0.52),0_4px_12px_rgba(36,23,8,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(36,23,8,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(251, 238, 211, 0.55) 100%)",
        }}
      />

      {/* Fine double honey-gold & brown letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9920E]/75 @sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#5C4423]/30 @sm:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C4423]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C4423]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C4423]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C4423]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @sm:py-3 @max-[22rem]:py-0.5">
        <p className="gh-font-display text-[9px] tracking-[0.26em] text-[#8A6408] uppercase @sm:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="gh-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3B2A12] uppercase @sm:mt-3 @sm:text-[22px] @sm:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="gh-font-editorial my-0.5 text-base italic text-[#8A6408] @sm:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="gh-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3B2A12] uppercase @sm:text-[22px] @sm:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <SunburstDivider className="mt-4 mb-2 h-6 w-24 @sm:my-3.5 @sm:h-8 @sm:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="gh-font-display text-[9px] tracking-[0.24em] text-[#3B2A12] uppercase @sm:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="gh-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#8A6408] uppercase @sm:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WaxSeal — the gold sunburst wax-seal open button. Tapping it      */
/* "breaks" the seal (it splits and fades) and the card slides up;  */
/* tapping again reseals it.                                          */
/* ------------------------------------------------------------------ */

function WaxSeal({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the golden envelope"
            : "Break the gold wax seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(36,23,8,0.6),0_4px_10px_rgba(36,23,8,0.35)] ring-2 ring-[#C9920E]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2A12]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WAX_SEAL_URL}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#3B2A12]/50"
          />
        )}
      </motion.button>

      <span className="gh-font-editorial mt-3 text-xs tracking-[0.18em] text-[#8A6408]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function GoldenHourEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Golden Envelope + Sliding Letterpress Card */}
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
                : "Open golden envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2A12]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the golden envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(36,23,8,0.28)]">
              {/* Layer 1: Golden envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Warm golden wedding envelope with a sun-ray ornament along the top edge"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Cream Letterpress Invitation Card */}
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
                className="absolute top-[25%] left-1/2 z-10 w-[47%] -translate-x-1/2"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL golden pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from golden-hour-detail.jpg,
                  1792x1344): a classic envelope — triangular flap with
                  its point at centre ~(50%, 63%), pocket diagonals
                  running from the flap point down to the bottom corners,
                  so the true pocket edge is ^-shaped (63% at centre,
                  ~76% at x=32%/68%, ~80% at the card's edges).
                  The clip reuses Emerald Royale's proven single flat
                  polygon (19% 52%, 32% 65%, 68% 65%, 81% 52%): it sits
                  ABOVE the true pocket edge across the card's sides
                  (65% vs 76% true at x=32%) and ~2% BELOW the flap
                  point at centre (65% vs 63% true) — a ~7px sliver
                  where the card peeks just past the fold point, which
                  reads as the card emerging from behind the fold.
                  The card's internals are Emerald's exact sizes
                  (17px names / 22px @sm, divider h-6/h-8 @sm), so its
                  measured rest positions transfer: Partner B bottom
                  ~62% of container height (above the 65% clip),
                  divider top ~68% (below it) — names peek, divider /
                  date / location stay hidden at rest. On tap the
                  clip's top edge drops to ~97% (the pocket opens)
                  while the card lifts 48px, so divider + date +
                  location are fully revealed with no top clipping.
                  ONE polygon for every width: the card sizes by
                  CONTAINER width (@container on the outer wrapper,
                  @sm: = container >= 384px, @max-[22rem]: for narrow
                  containers) — never viewport `sm:` — so the editor's
                  Mobile (390px) preview gets the mobile card and
                  desktop (490px container) gets the larger card. */}
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
            <p className="gh-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#8A6408]/80 uppercase transition-colors group-hover:text-[#3B2A12]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Gold Sunburst Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <WaxSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
