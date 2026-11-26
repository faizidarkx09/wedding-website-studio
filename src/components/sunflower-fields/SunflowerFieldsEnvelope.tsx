// Sunflower Fields envelope — interactive cream envelope with a
// sunflower wax seal and the sliding cream invitation card (tap the
// seal to break it and reveal / tuck the card back). No music on
// this template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SunflowerDivider, SunflowerSeal } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding cream invitation card                 */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFEF5] px-4 py-3 text-center text-[#14532D] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(20,83,45,0.52),0_4px_12px_rgba(20,83,45,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(20,83,45,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 254, 245, 0.4) 0%, rgba(254, 243, 199, 0.55) 100%)",
        }}
      />

      {/* Fine double green & yellow letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#166534]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#EAB308]/50 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#166534]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#166534]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#166534]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#166534]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[9px] tracking-[0.26em] text-[#166534] uppercase @min-[29.375rem]:text-[10px]"
        >
          WE INVITE YOU
        </p>

        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#14532D] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerA}
        </h2>
        <span
          style={{ fontFamily: FONT_EDITORIAL }}
          className="my-0.5 text-base italic text-[#166534] @min-[29.375rem]:text-lg @max-[22rem]:text-sm"
        >
          &amp;
        </span>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#14532D] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerB}
        </h2>

        <SunflowerDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-6 @min-[29.375rem]:my-4 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[9px] tracking-[0.24em] text-[#14532D] uppercase @min-[29.375rem]:text-[10px]"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1 text-[8.5px] tracking-[0.22em] text-[#166534] uppercase @min-[29.375rem]:text-[9.5px]"
        >
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SunflowerSealButton — the sunflower wax-seal open button.        */
/* Tapping it "breaks" the seal (it tilts and fades) and the card   */
/* slides up; tapping again reseals it.                              */
/* ------------------------------------------------------------------ */

function SunflowerSealButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the sunflower envelope"
            : "Break the sunflower wax seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_16px_30px_-8px_rgba(20,83,45,0.6),0_4px_10px_rgba(20,83,45,0.35)] ring-2 ring-[#EAB308]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
      >
        <SunflowerSeal className="absolute inset-0 h-full w-full" />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#14532D]/50"
          />
        )}
      </motion.button>

      <span
        style={{ fontFamily: FONT_EDITORIAL }}
        className="mt-3 text-xs tracking-[0.18em] text-[#166534]/85 uppercase"
      >
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function SunflowerFieldsEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Sunflower Envelope + Sliding Invitation Card */}
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
                : "Open sunflower envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14532D]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the sunflower envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(20,83,45,0.28)]">
              {/* Layer 1: Sunflower envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Cream wedding envelope with a sunflower wax seal and sunflowers along the bottom edge"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Cream Invitation Card */}
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

              {/* Layer 3: REAL pocket — the envelope photo rendered a
                  second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from
                  sunflower-fields-detail.jpg, 1200x800): a classic
                  envelope — triangular V flap with its point at centre
                  ~(50%, 53%), pocket diagonals running from the flap
                  point down to the bottom corners (~8%/92%, 93%), so
                  the true pocket edge is ^-shaped (53% at centre,
                  ~70% at x=32%/68%, ~82% at x=19%/81%).
                  The photo is 3:2 but the container is 4:3, so
                  object-cover crops the sides: visible image x is
                  5.6%–94.4%, y is unscaled. The clip below is in
                  CONTAINER coords, mapped from image coords
                  (x_c = (x_img − 5.6) / 88.9): it sits ABOVE the true
                  pocket edge across the card's sides (58% vs 70%
                  true at x=32%) and ~5% BELOW the flap point at
                  centre (58% vs 53% true) — the card is hidden to
                  58% across its width, so at rest only the names
                  peek (Partner B bottom ≈54–57% in every band) while
                  the divider (top ≈59–62%), date and location stay
                  behind the pocket.
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in THREE bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport:
                  - <352px: compact card (@max-[22rem]: 15px names,
                    tight padding) — 320px: Partner B bottom ~54%,
                    divider top ~59%, card bottom ~78% (behind the
                    pocket, invisible).
                  - 352–383px: small card (17px names), top 25% —
                    390px: Partner B bottom ~56.5%, divider top ~62%.
                  - 384–469px: small card, top 28% + divider mt-6 —
                    the large card does NOT fit here (see below).
                  - >=470px: large card (22px names, py-5), top 25% —
                    desktop 490px container: Partner B bottom ~54.5%,
                    divider top ~58.9%, card bottom ~81.5%.
                  WHY the large card starts at 470px, not 384px: its
                  content is ~207px tall and the names WRAP below
                  ~443px container width (inner width < ~160px), so at
                  430px viewport (398x299 container) it would span
                  25%→~94% with Partner B behind the pocket — the
                  same 430px trap Golden Hour hit. The large card only
                  fits once Partner B bottom clears the 58% pocket
                  line with margin, i.e. container >=470px. On tap the
                  clip's top edge drops to ~97% (the pocket opens)
                  while the card lifts 48px, so divider + date +
                  location are fully revealed with no top clipping.
                  These are ESTIMATES from the image measurement, not
                  live-measured margins — live-verify at 390px /
                  320px / desktop before calling this done. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(15% 96%, 30% 97.5%, 70% 97.5%, 85% 96%, 85% 100%, 15% 100%)"
                    : "polygon(15% 55%, 30% 58%, 70% 58%, 85% 55%, 85% 100%, 15% 100%)",
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
            <p
              style={{ fontFamily: FONT_DISPLAY }}
              className="mt-1 text-center text-[10px] tracking-[0.26em] text-[#166534]/80 uppercase transition-colors group-hover:text-[#14532D]"
            >
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Sunflower Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <SunflowerSealButton isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
