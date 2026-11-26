// Desert Dusk envelope — interactive terracotta envelope with a
// gold sun wax seal and the sliding sand letterpress card (tap the
// seal to break it and reveal / tuck the card back). No music on
// this template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { DuneDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  SUN_SEAL_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding sand letterpress card                 */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-3 text-center text-[#3A2A20] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(61,33,51,0.52),0_4px_12px_rgba(61,33,51,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(61,33,51,0.45)]"
      }`}
    >
      {/* Warm sand paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(245, 230, 211, 0.55) 100%)",
        }}
      />

      {/* Fine double terracotta & dusk letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C2703D]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#6B3A5C]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C4030]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C4030]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C4030]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C4030]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="dd-font-display text-[9px] tracking-[0.26em] text-[#8A4A22] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="dd-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3A2A20] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="dd-font-editorial my-0.5 text-base italic text-[#8A4A22] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="dd-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3A2A20] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        {/* The divider must stay HIDDEN at rest: it sits below the
            pocket line (66%) in every band. Golden Hour's divider
            margins are pushed down one step here (large band mt-7,
            384–469 band mt-12) because this pocket line sits at
            66%, not 65%. */}
        <DuneDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-12 @min-[29.375rem]:mt-7 @min-[29.375rem]:mb-2.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="dd-font-display text-[9px] tracking-[0.24em] text-[#3A2A20] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="dd-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#8A4A22] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SunSeal — the gold sun wax-seal open button. Tapping it "breaks" */
/* the seal (it splits and fades) and the card slides up; tapping   */
/* again reseals it. The seal photo is a crop of the sealed         */
/* envelope master — the shipped envelope photo itself is seal-free */
/* so the sliding card never hides the seal.                         */
/* ------------------------------------------------------------------ */

function SunSeal({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the desert envelope"
            : "Break the gold sun seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(61,33,51,0.6),0_4px_10px_rgba(61,33,51,0.35)] ring-2 ring-[#C2703D]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3A2A20]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SUN_SEAL_URL}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#3A2A20]/50"
          />
        )}
      </motion.button>

      <span className="dd-font-editorial mt-3 text-xs tracking-[0.18em] text-[#8A4A22]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function DesertDuskEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Terracotta Envelope + Sliding Letterpress Card */}
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
                : "Open desert envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3A2A20]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the terracotta envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(61,33,51,0.28)]">
              {/* Layer 1: Terracotta envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Warm terracotta wedding envelope with a triangular flap, lying on desert sand"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Sand Letterpress Invitation Card */}
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

              {/* Layer 3: REAL terracotta pocket — the envelope photo
                  rendered a second time ABOVE the card, clipped to
                  the pocket's shape, so the card is physically
                  tucked inside at rest.
                  Geometry (eye-measured from desert-dusk-detail.jpg,
                  1920x1280, 3:2): the envelope spans x ~9.8–90.2%,
                  y ~10.5–89.5% of the image, its triangular flap
                  point at centre ~(50%, 63%). In the 4:3 container
                  object-cover crops ~5.5% off each side, so the
                  envelope spans container x ~4.8–95.2% and the flap
                  point stays at (50%, 63%). The clip reuses Golden
                  Hour's proven flat-top polygon, shifted to this
                  photo's pocket line: flat 66% across the card's
                  span (19% 55%, 32% 66%, 68% 66%, 81% 55%). The
                  true flap V is higher at the card's sides, so the
                  flat 66% line sits BELOW the true fold there —
                  the card disappears behind the pocket photo a
                  touch early at the sides, which reads as the card
                  emerging from behind the fold (the same accepted
                  sliver as Golden Hour, ~7px at centre).
                  The card is sized by CONTAINER width (@container
                  on the outer wrapper — never viewport `sm:` — so
                  the editor's Mobile (390px) preview gets the
                  mobile card and desktop (490px container) gets
                  the larger card), in THREE bands, because the
                  card's content is fixed px while the 4:3 container
                  shrinks with the viewport:
                  - <352px: compact card (@max-[22rem]: 15px names,
                    tight padding) — Partner B bottom ~63.7%,
                    divider top ~71.1%, card bottom ~107.6%
                    (behind the pocket, invisible). Clears the 66%
                    pocket line by ~2.3%.
                  - 352–383px: small card (17px names), top 25% —
                    Partner B bottom ~62.1%, divider top ~68%.
                  - 384–469px: small card, top 28%, divider mt-12 —
                    the large card does NOT fit here (see below).
                    Partner B bottom <=62.7%, divider top ~70.3%.
                  - >=470px: large card (22px names, py-5), top 25%,
                    divider mt-7 — Partner B bottom ~61.7%,
                    divider top ~69.3%.
                  WHY the large card starts at 470px, not 384px: its
                  content is ~260px tall and the names WRAP below
                  ~443px container width (inner width < ~160px), so
                  at 430px viewport (398x299 container) it would
                  span 25%→131.7% — only PARTNER A would peek
                  (wrapped to two lines), Partner B would sit behind
                  the pocket, and when open the location line would
                  be clipped mid-glyph at the container's bottom
                  edge. The large card only fits once Partner B
                  bottom (25% + 135px) clears the 66% pocket line
                  with margin, i.e. container >=470px. On tap the
                  clip's top edge drops to ~97% (the pocket opens)
                  while the card lifts 48px, so divider + date +
                  location are fully revealed with no top clipping. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(19% 96%, 32% 97.5%, 68% 97.5%, 81% 96%, 81% 100%, 19% 100%)"
                    : "polygon(19% 55%, 32% 66%, 68% 66%, 81% 55%, 81% 100%, 19% 100%)",
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
            <p className="dd-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#8A4A22]/80 uppercase transition-colors group-hover:text-[#3A2A20]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Gold Sun Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <SunSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
