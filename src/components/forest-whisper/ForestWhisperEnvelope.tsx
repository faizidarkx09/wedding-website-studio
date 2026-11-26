// Forest Whisper envelope — interactive deep-green envelope with
// a twine band and a live leaf seal (tap the seal to break it and
// reveal / tuck the card back). No music on this template — the seal
// is the interaction. The leaf seal and the twine band are LIVE
// HTML/SVG (never baked into the artwork): the envelope photo is
// seal-free and twine-free, so the sliding card never hides them.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { LeafDivider, LeafSealMark } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding cream letterpress card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FBF9F1] px-4 py-3 text-center text-[#1B4332] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(20,48,31,0.52),0_4px_12px_rgba(20,48,31,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(20,48,31,0.45)]"
      }`}
    >
      {/* Cream paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(251, 249, 241, 0.4) 0%, rgba(231, 234, 217, 0.55) 100%)",
        }}
      />

      {/* Fine double moss & pine letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#6A994E]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#2D6A4F]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#2D6A4F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#2D6A4F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#2D6A4F]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#2D6A4F]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="fw-font-display text-[9px] tracking-[0.26em] text-[#2D6A4F] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="fw-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#1B4332] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="fw-font-editorial my-0.5 text-base italic text-[#2D6A4F] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="fw-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#1B4332] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <LeafDivider className="mt-12 mb-2 h-6 w-24 @min-[24rem]:mt-16 @min-[29.375rem]:mt-14 @min-[29.375rem]:mb-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="fw-font-display text-[9px] tracking-[0.24em] text-[#1B4332] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="fw-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#2D6A4F] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LeafSeal — the live leaf-seal open button. Tapping it "breaks"    */
/* the seal (it tilts and shows a crack) and the card slides up;     */
/* tapping again reseals it. The leaf is SVG and the initials are    */
/* live HTML text — nothing is baked into the artwork.                */
/* ------------------------------------------------------------------ */

function LeafSeal({
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
            ? "Reseal the forest envelope"
            : "Break the leaf seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 flex-col items-center justify-center overflow-hidden rounded-full bg-[#1B4332] shadow-[0_16px_30px_-8px_rgba(20,48,31,0.6),0_4px_10px_rgba(20,48,31,0.35)] ring-2 ring-[#6A994E]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
      >
        <LeafSealMark className="h-9 w-9" />
        <span className="fw-font-display mt-0.5 text-[13px] font-medium tracking-[0.08em] text-[#F4F1E6]">
          {initials(site)}
        </span>
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#F4F1E6]/60"
          />
        )}
      </motion.button>

      <span className="fw-font-editorial mt-3 text-xs tracking-[0.18em] text-[#2D6A4F]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Leaf to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function ForestWhisperEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Forest Envelope + Sliding Letterpress Card */}
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
                : "Open forest envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B4332]"
          >
            {/* Envelope Container — aspect-[32/29] matches the
                960x870 tight crop of the flat-lay envelope master
                (flap apex ~(48%, 5%), body top edge ~34%, body
                bottom ~96%), so the envelope fills the container
                edge-to-edge with no letterboxing. */}
            <div className="relative aspect-[32/29] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(20,48,31,0.28)]">
              {/* Layer 1: Forest envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Deep-green wedding envelope with a triangular flap on cream linen"
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
                className="absolute top-[25%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[24rem]:top-[28%] @min-[29.375rem]:top-[25%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL forest pocket — the envelope photo
                  rendered a second time ABOVE the card, clipped to
                  the pocket's shape, so the card is physically
                  tucked inside at rest. The clip reuses Golden
                  Hour's proven single flat polygon (19% 52%, 32%
                  65%, 68% 65%, 81% 52%): it sits ABOVE the card's
                  lower half, hiding the divider + date + location
                  at rest while the names peek above it.
                  The card is sized by CONTAINER width (@container
                  on the outer wrapper — never viewport `sm:` — so
                  the editor's Mobile (390px) preview gets the
                  mobile card and desktop (490px container) gets
                  the larger card), in THREE bands. NOTE: this
                  container is TALLER than Golden Hour's 4:3 (aspect
                  32/29, H = 0.906 × W), so the divider margins are
                  LARGER here — the divider must clear the 65%
                  pocket line at every width, and fixed-px content
                  is a smaller % of a taller container:
                  - <352px: compact card (@max-[22rem]: 15px names,
                    tight padding), top 25%, divider mt-12 —
                    320px: Partner B bottom ~59%, divider top ~73%.
                  - 352–383px: small card (17px names), top 25%,
                    divider mt-12 — 390px: Partner B bottom ~53%,
                    divider top ~68%.
                  - 384–469px: small card, top 28%, divider mt-16
                    (the extra margin is what keeps the divider
                    below the pocket line at 469px, where the tall
                    container would otherwise let it peek) —
                    469px: Partner B bottom ~51%, divider top ~66%.
                  - >=470px: large card (22px names, py-5), top
                    25%, divider mt-14 — desktop 490px container:
                    Partner B bottom ~55%, divider top ~66–68%.
                  These are ESTIMATES from the card's px content
                  heights against the measured crop geometry, NOT
                  live-measured margins — the coordinator must
                  live-verify at 390px / 320px / desktop before
                  calling this done (the Emerald RSVP needed three
                  live rounds for exactly this). On tap the clip's
                  top edge drops to ~97% (the pocket opens) while
                  the card lifts 48px, so divider + date + location
                  are fully revealed with no top clipping. */}
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
                {/* Twine band — two kraft twine lines wrapped
                    horizontally across the pocket front with a small
                    bow at the centre. It lives INSIDE the pocket
                    clip, so it is clipped to the pocket shape, sits
                    on the pocket front below the card's peek zone
                    (y 76–80%, well under the names), and vanishes
                    with the pocket when the envelope opens (the
                    twine is "unwrapped"). */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[76%] h-[2px] bg-[#C8A97A]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[80%] h-[2px] bg-[#C8A97A]/85"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-[78%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[22px] leading-none text-[#C8A97A]"
                >
                  ✦
                </span>
              </motion.div>
            </div>

            {/* Subtle interactive cue */}
            <p className="fw-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#2D6A4F]/80 uppercase transition-colors group-hover:text-[#1B4332]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Live Leaf Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <LeafSeal site={site} isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
