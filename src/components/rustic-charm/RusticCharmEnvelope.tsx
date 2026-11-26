// Rustic Charm envelope — interactive kraft envelope with a
// twine bow + live wood seal and the sliding cream invitation card
// (tap the seal to untie it and reveal / tuck the card back). No
// music on this template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { TwineDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding cream invitation card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-2 text-center text-[#451A03] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-4 @max-[22rem]:py-1.5 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(45,26,3,0.52),0_4px_12px_rgba(45,26,3,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(45,26,3,0.45)]"
      }`}
    >
      {/* Warm cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(254, 243, 199, 0.55) 100%)",
        }}
      />

      {/* Fine double bark & twine border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#78350F]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#A16207]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#78350F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#78350F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#78350F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#78350F]/65"
      />

      {/* Card Typography — COMPACT by design (see the geometry note
          in RusticCharmEnvelope): the names must end above the flap
          point (57%) at every width. */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-2 @max-[22rem]:py-0.5">
        <p className="rc-font-display text-[8px] tracking-[0.26em] text-[#92400E] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="rc-font-display mt-1.5 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#451A03] uppercase @min-[29.375rem]:mt-2 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1 @max-[22rem]:text-[14px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="rc-font-editorial my-0.5 text-sm italic text-[#92400E] @min-[29.375rem]:text-lg @max-[22rem]:text-xs">
          &amp;
        </span>
        <h2 className="rc-font-display text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#451A03] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[14px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <TwineDivider className="mt-2 mb-1.5 h-5 w-24 @min-[24rem]:mt-8 @min-[29.375rem]:my-3 @min-[29.375rem]:h-7 @min-[29.375rem]:w-28 @max-[22rem]:mb-1 @max-[22rem]:h-4" />

        <p className="rc-font-display text-[9px] tracking-[0.24em] text-[#451A03] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="rc-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#92400E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WoodSeal — the round wood-seal open button. Tapping it "unties"   */
/* the twine (it rotates and fades) and the card slides up; tapping  */
/* again reseals it.                                                  */
/* ------------------------------------------------------------------ */

function WoodSeal({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the kraft envelope"
            : "Untie the twine and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#451A03] bg-[#78350F] shadow-[0_16px_30px_-8px_rgba(45,26,3,0.6),0_4px_10px_rgba(45,26,3,0.35)] ring-2 ring-[#A16207]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#451A03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(45,26,3,0.28) 0px, rgba(45,26,3,0.28) 1.5px, transparent 1.5px, transparent 9px), radial-gradient(circle at 35% 30%, rgba(254,243,199,0.25) 0%, transparent 55%), linear-gradient(160deg, #92400E 0%, #78350F 55%, #5C2A08 100%)",
        }}
      >
        {/* Heart carved into the wood seal */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-9 w-9 fill-[#FEF3C7]/90">
          <path d="M12 21 C 6 16.5, 2.5 13, 2.5 9.2 C 2.5 6.2, 4.8 4, 7.4 4 C 9.3 4, 11 5.2, 12 7 C 13 5.2, 14.7 4, 16.6 4 C 19.2 4, 21.5 6.2, 21.5 9.2 C 21.5 13, 18 16.5, 12 21 Z" />
        </svg>
        {/* Untie crack line once opened */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#451A03]/50"
          />
        )}
      </motion.button>

      <span className="rc-font-editorial mt-3 text-xs tracking-[0.18em] text-[#92400E]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function RusticCharmEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Kraft Envelope + Sliding Invitation Card */}
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
                : "Open kraft envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#451A03]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the kraft envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(45,26,3,0.28)]">
              {/* Layer 1: Kraft envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="A closed kraft-paper wedding envelope with a twine bow on a weathered wooden table"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Cream Invitation Card */}
              <motion.div
                initial={false}
                animate={{
                  y: isCardLifted ? (prefersReducedMotion ? -20 : -36) : 0,
                  scale: isCardLifted ? 1.03 : 1,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-[20%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[24rem]:top-[22%] @min-[29.375rem]:top-[20%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL kraft pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from rustic-charm-detail.jpg,
                  1920x1280): a closed kraft envelope — triangular flap
                  with its point at centre ~(50%, 57%), flap lower edges
                  running from the top corners ~(8%, 5%) / ~(92%, 5%)
                  down to that point, so the true pocket edge is ^-shaped
                  (57% at centre, ~35% at x=32%/68%, ~28% at the card's
                  edges x=26.5%/73.5%). The photo is 3:2 in a 4:3
                  container (object-cover crops left/right only), so
                  x maps 106.7–1813.3 image px onto the container and
                  the flap point stays at (50%, 57%).
                  The clip traces that flap edge across the card's
                  width (19% 19%, 32% 35%, 50% 57%, 68% 35%, 81% 19%):
                  at x=32% the true edge is 34.7% vs clip 35%, at
                  centre 57% vs 57% — the seam is invisible (both
                  layers show the same photo) and the card peeks
                  exactly like a card emerging from behind the flap.
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in THREE bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport:
                  - <352px: compact card (@max-[22rem]: 14px names,
                    tight padding) — 320px: Partner B bottom ~49%,
                    divider top ~62% (behind the pocket, invisible).
                  - 352–469px: small card (15px names), top 20–22% —
                    390px: Partner B bottom ~46%, divider top ~59%.
                  - >=470px: large card (22px names, py-4), top 20% —
                    desktop 490px container: Partner B bottom ~53%,
                    divider top ~61%, card bottom ~96%.
                  The names end above the 57% flap point in every
                  band, so ONLY the names peek at rest — divider, date
                  and location stay hidden behind the pocket until the
                  tap. The lift is -36px (not -48px): with the card top
                  at 20%, a -48px lift would push the card's top edge
                  above the container at 320px (39px - 48px = -9px).
                  On tap the clip's top edge drops to ~97% (the pocket
                  opens) while the card lifts 36px, so divider + date +
                  location are fully revealed with no top clipping. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(19% 96%, 32% 97.5%, 68% 97.5%, 81% 96%, 81% 100%, 19% 100%)"
                    : "polygon(19% 19%, 32% 35%, 50% 57%, 68% 35%, 81% 19%, 81% 100%, 19% 100%)",
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
            <p className="rc-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#92400E]/80 uppercase transition-colors group-hover:text-[#451A03]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Wood Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <WoodSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
