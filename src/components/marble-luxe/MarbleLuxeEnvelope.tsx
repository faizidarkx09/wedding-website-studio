// Marble Luxe envelope — interactive white-and-gold envelope
// photograph with a gold monogram seal and the sliding white
// invitation card (tap the seal to break it and reveal / tuck the
// card back). No music on this template — the seal is the
// interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { GoldDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding white invitation card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-white px-4 py-3 text-center text-[#1F2937] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(31,41,55,0.4),0_4px_12px_rgba(31,41,55,0.18)]"
          : "shadow-[0_10px_24px_-8px_rgba(31,41,55,0.35)]"
      }`}
    >
      {/* Fine double gold hairline border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#B49A70]/70 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#6B7280]/25 @min-[29.375rem]:inset-[15px] @max-[22rem]:inset-[7px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#6B7280]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#6B7280]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#6B7280]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#6B7280]/60"
      />

      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="ml-font-display text-[9px] font-medium tracking-[0.26em] text-[#8C7355] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="ml-font-display mt-2 text-[17px] leading-none font-medium tracking-[0.1em] break-words text-[#1F2937] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="ml-font-editorial my-0.5 text-base italic text-[#8C7355] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="ml-font-display text-[17px] leading-none font-medium tracking-[0.1em] break-words text-[#1F2937] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <GoldDivider className="mt-6 h-6 w-24 @min-[22rem]:mt-10 @min-[29.375rem]:mt-12 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:h-5" />

        <p className="ml-font-display mt-2 text-[9px] font-medium tracking-[0.24em] text-[#1F2937] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="ml-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#8C7355] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MonogramSeal — the gold monogram-seal open button. Tapping it    */
/* "breaks" the seal (it tilts and fades) and the card slides up;  */
/* tapping again reseals it. The monogram is live HTML text.        */
/* ------------------------------------------------------------------ */

function MonogramSeal({
  site,
  isOpen,
  onToggle,
}: {
  site: WeddingSite;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the marble envelope"
            : "Break the gold monogram seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center rounded-full shadow-[0_16px_30px_-8px_rgba(31,41,55,0.45),0_4px_10px_rgba(31,41,55,0.25)] ring-2 ring-[#B49A70]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #E3D3B3 0%, #B49A70 55%, #8C7355 100%)",
        }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-[7px] rounded-full border border-white/50"
        />
        <span className="ml-font-display relative z-10 text-[1.35rem] font-medium tracking-[0.06em] text-white drop-shadow-[0_1px_2px_rgba(60,45,20,0.5)]">
          {initials(site)}
        </span>
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#1F2937]/50"
          />
        )}
      </motion.button>

      <span className="ml-font-editorial mt-3 text-xs tracking-[0.18em] text-[#8C7355] uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function MarbleLuxeEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Marble Envelope + Sliding White Card */}
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
                : "Open marble envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the marble envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(31,41,55,0.22)]">
              {/* Layer 1: Marble envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="White wedding envelope with a thin gold border on white marble"
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

              {/* Layer 3: REAL marble pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from marble-luxe-detail.jpg,
                  1920x1280, object-cover cropped 3:2 → 4:3): the
                  envelope spans x ~23–78%, y ~24–76% of the container
                  and its flap point sits at ~(50%, 57%). The clip
                  reuses the Golden Hour ^-polygon shape but shifted
                  to THIS envelope's edges (23%/77% instead of
                  19%/81%): it sits ABOVE the true pocket edge across
                  the card's span (65% flat band vs the flap's ~57%
                  apex) so the names peek and the divider, date and
                  location stay hidden behind the pocket at rest.
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in THREE bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport:
                  - <352px: compact card (@max-[22rem]: 15px names,
                    tight padding, divider mt-6) — 320px: Partner B
                    bottom 58.8%, divider top 69.9%, card bottom 98%
                    (behind the pocket, invisible). Verified by
                    arithmetic against the polygon.
                  - 352–383px: small card (17px names), top 25%,
                    divider mt-10 — 390px: Partner B bottom 56.6%,
                    divider top 71.5%.
                  - 384–469px: small card, top 28%, divider mt-10 —
                    the large card does NOT fit here (see below).
                  - >=470px: large card (22px names, py-5), top 25%,
                    divider mt-12 — desktop 490px container: Partner
                    B bottom 54.9%, divider top 68.0%, card bottom
                    91.7%.
                  WHY the large card starts at 470px, not 384px: its
                  content is ~245px tall and the names WRAP below
                  ~443px container width (inner width < ~160px), so at
                  430px viewport (398x299 container) it would span
                  25%→131% — only PARTNER A peeked, Partner B sat
                  behind the pocket, and when open the location line
                  was clipped mid-glyph at the container's bottom
                  edge. The large card only fits once Partner B bottom
                  (25% + ~110px) clears the 65% pocket line with
                  margin, i.e. container >=470px. In the 384–469 band
                  the small card is used with top 28% + divider mt-10,
                  which keeps Partner B bottom <=56.5% and divider top
                  >=69.9% across the whole band. On tap the clip's top
                  edge drops to ~97% (the pocket opens) while the card
                  lifts 48px, so divider + date + location are fully
                  revealed with no top clipping (lifted card bottom
                  <=79% in every band). */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(23% 96%, 34% 97.5%, 66% 97.5%, 77% 96%, 77% 100%, 23% 100%)"
                    : "polygon(23% 52%, 34% 65%, 66% 65%, 77% 52%, 77% 100%, 23% 100%)",
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="pointer-events-none absolute inset-0 z-20 [filter:drop-shadow(0_-2px_3px_rgba(31,41,55,0.18))]"
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
            <p className="ml-font-display mt-1 text-center text-[10px] font-medium tracking-[0.26em] text-[#8C7355]/80 uppercase transition-colors group-hover:text-[#1F2937]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Gold Monogram Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <MonogramSeal site={site} isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
