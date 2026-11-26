// Mint Serenity envelope — interactive mint envelope with a sage
// leaf seal and the sliding white invitation card (tap the seal to
// break it and reveal / tuck the card back). No music on this
// template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { BubbleDivider, LeafSeal } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  FONT_DISPLAY,
  FONT_EDITORIAL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding white invitation card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFFFF] px-4 py-3 text-center text-[#052E22] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(6,95,70,0.52),0_4px_12px_rgba(6,95,70,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(6,95,70,0.45)]"
      }`}
    >
      {/* Soft mint paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.4) 0%, rgba(236, 253, 245, 0.55) 100%)",
        }}
      />

      {/* Fine double mint & sage letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#065F46]/60 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#10B981]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#065F46]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#065F46]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#065F46]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#065F46]/65"
      />

      {/* Editable HTML Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p
          style={FONT_DISPLAY}
          className="text-[9px] tracking-[0.26em] text-[#047857] uppercase @min-[29.375rem]:text-[10px]"
        >
          WE INVITE YOU
        </p>

        <h2
          style={FONT_DISPLAY}
          className="mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#052E22] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerA}
        </h2>
        <span
          style={FONT_EDITORIAL}
          className="my-0.5 text-base italic text-[#047857] @min-[29.375rem]:text-lg @max-[22rem]:text-sm"
        >
          &amp;
        </span>
        <h2
          style={FONT_DISPLAY}
          className="text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#052E22] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]"
        >
          {site.content.partnerB}
        </h2>

        <BubbleDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p
          style={FONT_DISPLAY}
          className="text-[9px] tracking-[0.24em] text-[#052E22] uppercase @min-[29.375rem]:text-[10px]"
        >
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p
          style={FONT_DISPLAY}
          className="mt-1 text-[8.5px] tracking-[0.22em] text-[#047857] uppercase @min-[29.375rem]:text-[9.5px]"
        >
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LeafSealButton — the sage leaf-seal open button (pure SVG disc,  */
/* never a photo). Tapping it "breaks" the seal (it splits and      */
/* fades) and the card slides up; tapping again reseals it.          */
/* ------------------------------------------------------------------ */

function LeafSealButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the mint envelope"
            : "Break the leaf seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(6,95,70,0.6),0_4px_10px_rgba(6,95,70,0.35)] ring-2 ring-[#A7F3D0]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
      >
        <LeafSeal className="absolute inset-0 h-full w-full" />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#ECFDF5]/70"
          />
        )}
      </motion.button>

      <span
        style={FONT_EDITORIAL}
        className="mt-3 text-xs tracking-[0.18em] text-[#047857]/90 uppercase"
      >
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function MintSerenityEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Mint Envelope + Sliding Invitation Card */}
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
                : "Open mint envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#065F46]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the mint envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(6,95,70,0.28)]">
              {/* Layer 1: Mint envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Mint-green wedding envelope with a sage leaf sprig along the top edge"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding White Invitation Card */}
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

              {/* Layer 3: REAL mint pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (MEASURED from mint-serenity-detail.jpg,
                  1200x900, cropped tight to the envelope): a classic
                  envelope — triangular flap with its point at centre
                  ~(50%, 61.6%) (centre-column luminance scan + eye
                  check), pocket diagonals running from the flap point
                  down to the bottom corners, so the true pocket edge is
                  ^-shaped (61.6% at centre, ~75.4% at x=32%/68%,
                  ~79.6% at the card's edges).
                  The clip reuses Golden Hour's proven single flat
                  polygon (19% 52%, 32% 65%, 68% 65%, 81% 52%): it sits
                  ABOVE the true pocket edge across the card's sides
                  (65% vs 75.4% true at x=32%) and ~3.4% BELOW the flap
                  point at centre (65% vs 61.6% true) — a ~12px sliver
                  where the card peeks just past the fold point, which
                  reads as the card emerging from behind the fold
                  (the flap tip is rounded and soft, so the sliver is
                  invisible as a seam).
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in THREE bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport
                  (same bands + sizes as Golden Hour, whose card has
                  the identical content structure — eyebrow, two names,
                  &, divider, date, location — so its live-verified
                  numbers transfer):
                  - <352px: compact card (@max-[22rem]: 15px names,
                    tight padding) — 320px: Partner B bottom 63.7%,
                    divider top 71.1%, card bottom 107.6% (behind the
                    pocket, invisible).
                  - 352–383px: small card (17px names), top 25% —
                    390px: Partner B bottom 62.1%, divider top 68%.
                  - 384–469px: small card, top 28%, divider mt-10 —
                    the large card does NOT fit here (see below).
                  - >=470px: large card (22px names, py-5), top 25% —
                    desktop 490px container: Partner B bottom 61.7%,
                    divider top 65.5%, card bottom 95.8%.
                  WHY the large card starts at 470px, not 384px: its
                  content is ~260px tall and the names WRAP below
                  ~443px container width (inner width < ~160px), so at
                  430px viewport (398x299 container) it spanned
                  25%→131.7% — only PARTNER A peeked (wrapped to two
                  lines), Partner B sat at 85% behind the pocket, and
                  when open the location line was clipped mid-glyph at
                  the container's bottom edge. The large card only
                  fits once Partner B bottom (25% + 135px) clears the
                  65% pocket line with margin, i.e. container >=470px
                  (63.3% there, 61.7% at 490px). In the 384–469 band
                  the small card is used with top 28% + divider mt-10
                  (divider offset 139.6px from card top), which keeps
                  Partner B bottom <=62.7% and divider top >=67.6%
                  across the whole band. On tap the clip's top edge
                  drops to ~97% (the pocket opens) while the card
                  lifts 48px, so divider + date + location are fully
                  revealed with no top clipping. */}
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
            <p
              style={FONT_DISPLAY}
              className="mt-1 text-center text-[10px] tracking-[0.26em] text-[#047857]/80 uppercase transition-colors group-hover:text-[#052E22]"
            >
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Sage Leaf Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <LeafSealButton isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
