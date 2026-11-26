// Starlight Noir envelope — interactive black envelope with a
// gold star wax seal and the sliding black invitation card (tap the
// seal to break it and reveal / tuck the card back). No music on
// this template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { ConstellationDivider, StarSeal } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  FONT_SCRIPT,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding black invitation card with gold type */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden border border-[#D4AF37]/70 bg-[#0A0A0A] px-4 py-2 text-center text-[#F5EFE0] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.5)]"
          : "shadow-[0_10px_24px_-8px_rgba(0,0,0,0.7)]"
      }`}
    >
      {/* Faint gold glow at the card's heart */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(212, 175, 55, 0.14) 0%, rgba(10, 10, 10, 0.4) 100%)",
        }}
      />

      {/* Fine double gold hairline border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D4AF37]/60 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#D4AF37]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Editable HTML Typography — gold on black, high contrast */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[8px] tracking-[0.26em] text-[#F2D98C] uppercase @min-[29.375rem]:text-[10px]"
        >
          We Invite You
        </p>

        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1.5 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#D4AF37] uppercase @min-[22rem]:mt-2 @min-[22rem]:text-[17px] @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1 @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerA}
        </h2>
        <span
          style={{ fontFamily: FONT_SCRIPT }}
          className="my-0.5 text-sm text-[#F2D98C] @min-[29.375rem]:text-lg @max-[22rem]:text-xs"
        >
          &amp;
        </span>
        <h2
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#D4AF37] uppercase @min-[22rem]:text-[17px] @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerB}
        </h2>

        <ConstellationDivider className="mt-3 mb-1.5 h-5 w-20 @min-[22rem]:mt-4 @min-[22rem]:mb-2 @min-[22rem]:h-6 @min-[22rem]:w-24 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mt-2.5 @max-[22rem]:mb-1 @max-[22rem]:h-4" />

        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="text-[8.5px] tracking-[0.24em] text-[#F5EFE0] uppercase @min-[29.375rem]:text-[10px]"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p
          style={{ fontFamily: FONT_DISPLAY }}
          className="mt-1 text-[8px] tracking-[0.22em] text-[#F2D98C] uppercase @min-[29.375rem]:text-[9.5px]"
        >
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StarSealButton — the gold star wax-seal open button. Tapping it  */
/* "breaks" the seal (it tilts and shows a crack) and the card      */
/* slides up; tapping again reseals it.                              */
/* ------------------------------------------------------------------ */

function StarSealButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the black envelope"
            : "Break the gold star seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(0,0,0,0.8),0_4px_10px_rgba(0,0,0,0.5)] ring-2 ring-[#D4AF37]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
      >
        <StarSeal className="absolute inset-0 h-full w-full" />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#0A0A0A]/60"
          />
        )}
      </motion.button>

      <span
        style={{ fontFamily: FONT_EDITORIAL }}
        className="mt-3 text-xs tracking-[0.18em] text-[#F2D98C]/85 uppercase"
      >
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function StarlightNoirEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Black Envelope + Sliding Gold-Type Card */}
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
                : "Open black envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the black envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(0,0,0,0.6)]">
              {/* Layer 1: Black envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Black wedding envelope with gold constellation lines and a gold star wax seal"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Black Invitation Card */}
              <motion.div
                initial={false}
                animate={{
                  y: isCardLifted ? (prefersReducedMotion ? -24 : -40) : 0,
                  scale: isCardLifted ? 1.03 : 1,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-[22%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[22rem]:top-[24%] @min-[29.375rem]:top-[25%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL black pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from starlight-noir-detail.jpg,
                  1200x900, cropped 4:3): the envelope spans x 11–89%,
                  y 15–83%; the triangular flap's point is the gold star
                  seal at centre ~(50%, 52%); pocket diagonals run from
                  the flap point down to the bottom corners (11%, 83%)
                  and (89%, 83%), slope 0.795 %y per %x. The true pocket
                  edge is ^-shaped: 52% at centre, ~58% at x=42%/58%,
                  ~66% at x=32%/68%, ~71% at the card's edges
                  (x=26.5%/73.5%). The clip below hugs that edge ~2%
                  ABOVE it across the card (64% at x=32%, 56.5% at
                  x=42%, 68.5% at the card's edges) and sits ~2% BELOW
                  the flap point at centre (54% vs 52% true) — the same
                  2% margin Golden Hour uses — so at rest only the
                  names peek above the pocket and the divider, date
                  and location stay hidden behind it.
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in THREE bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport:
                  - <352px: compact card (15px names, tight padding),
                    top 22% — 320px: Partner B bottom ~52.6%, divider
                    top ~58%.
                  - 352–469px: small card (17px names), top 24% —
                    390px: Partner B bottom ~52.6%, divider top ~58%.
                  - >=470px: large card (22px names, py-5), top 25% —
                    desktop 490px container: Partner B bottom ~53.5%,
                    divider top ~58%.
                  WHY the large card starts at 470px, not 384px: the
                  same 430px trap Golden Hour hit — at 430px viewport
                  (398x299 container) the large card's content is
                  ~208px tall and the names WRAP below ~443px container
                  width, so it would span 25%→~95% with Partner B
                  buried behind the pocket and the location clipped
                  when open. The large card only fits once Partner B
                  bottom (25% + ~105px) clears the 54% pocket line
                  with margin, i.e. container >=470px. In the
                  384–469 band the small card is used with top 24%,
                  which keeps Partner B bottom <=53% and divider top
                  >=58% across the whole band. On tap the clip's top
                  edge drops to ~97% (the pocket opens) while the card
                  lifts 40px, so divider + date + location are fully
                  revealed with no top clipping. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(19% 96%, 32% 97.5%, 68% 97.5%, 81% 96%, 81% 100%, 19% 100%)"
                    : "polygon(19% 74%, 26.5% 68.5%, 32% 64%, 42% 56.5%, 50% 54%, 58% 56.5%, 68% 64%, 73.5% 68.5%, 81% 74%, 81% 100%, 19% 100%)",
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
              className="mt-1 text-center text-[10px] tracking-[0.26em] text-[#F2D98C]/80 uppercase transition-colors group-hover:text-[#F5EFE0]"
            >
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Gold Star Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <StarSealButton isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
