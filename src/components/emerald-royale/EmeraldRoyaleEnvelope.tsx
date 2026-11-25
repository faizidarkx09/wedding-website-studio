// Emerald Royale envelope — interactive emerald leather envelope
// with a gold wax seal and the sliding ivory letterpress card (tap
// the seal to break it and reveal / tuck the card back). Gold-leaf
// corner sprigs. No music on this template — the seal is the
// interaction, not a vinyl medallion.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { BotanicalCardDivider, GoldLeafSprig } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  WAX_SEAL_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ivory letterpress card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FBF8EF] px-4 py-3 text-center text-[#0B3D2E] transition-shadow duration-700 max-[380px]:py-2 @sm:px-6 @sm:py-5 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(4,26,19,0.52),0_4px_12px_rgba(4,26,19,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(4,26,19,0.45)]"
      }`}
    >
      {/* Handmade cotton parchment fibers texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(/images/themes/emerald-royale/bg_ivory_parchment.jpg)` }}
      />

      {/* Fine double antique gold & emerald letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9A227]/75 sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#14543D]/30 sm:inset-[15px]"
      />

      {/* Delicate corner botanical ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#14543D]/65 sm:top-3.5 sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#14543D]/65 sm:top-3.5 sm:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#14543D]/65 sm:bottom-3.5 sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#14543D]/65 sm:right-3.5 sm:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 max-[380px]:py-0.5 @sm:py-3">
        <p className="er-font-display text-[9px] tracking-[0.26em] text-[#14543D] uppercase @sm:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="er-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#0B3D2E] uppercase max-[380px]:mt-1.5 max-[380px]:text-[15px] max-[380px]:tracking-[0.08em] @sm:mt-3 @sm:text-[22px] @sm:tracking-[0.12em]">
          {site.content.partnerA}
        </h2>
        <span className="er-font-editorial my-0.5 text-base italic text-[#14543D] max-[380px]:text-sm @sm:text-lg">
          &amp;
        </span>
        <h2 className="er-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#0B3D2E] uppercase max-[380px]:text-[15px] max-[380px]:tracking-[0.08em] @sm:text-[22px] @sm:tracking-[0.12em]">
          {site.content.partnerB}
        </h2>

        <BotanicalCardDivider className="mt-4 mb-2 h-6 w-24 max-[380px]:mb-1.5 max-[380px]:h-5 @sm:my-3.5 @sm:h-8 @sm:w-28" />

        <p className="er-font-display text-[9px] tracking-[0.24em] text-[#0B3D2E] uppercase @sm:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#14543D] uppercase @sm:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WaxSeal — the gold wax-seal open button. Tapping it "breaks" the  */
/* seal (it splits and fades) and the card slides up; tapping again  */
/* reseals it.                                                        */
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
            ? "Reseal the emerald envelope"
            : "Break the gold wax seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(4,26,19,0.6),0_4px_10px_rgba(4,26,19,0.35)] ring-2 ring-[#C9A227]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E] sm:h-28 sm:w-28"
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
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#06231B]/50"
          />
        )}
      </motion.button>

      <span className="er-font-editorial mt-3 text-xs tracking-[0.18em] text-[#14543D]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function EmeraldRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      {/* Corner Gold-Leaf Sprigs */}
      <GoldLeafSprig position="top-left" />
      <GoldLeafSprig position="bottom-right" />

      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Emerald Envelope + Sliding Letterpress Card */}
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
                : "Open emerald envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the emerald envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(4,26,19,0.28)]">
              {/* Layer 1: Emerald leather envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Deep emerald leather wedding envelope with embossed antique gold botanical ornaments"
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
                className="absolute top-[25%] left-1/2 z-10 w-[47%] -translate-x-1/2 max-[380px]:top-[23%] @sm:w-[46%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL emerald pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest
                  (round 1's bottom gradient only darkened the card and
                  hid nothing — the full card sat visibly on the photo).
                  The clip follows the photo's own pocket: the fold is a
                  shallow V (corners ~40% of container height, V bottom
                  ~57%), so the polygon's top edge sits BELOW the fold
                  everywhere and the overlay is pixel-seamless with
                  Layer 1 (same image, same object-cover mapping).
                  ONE polygon for every width (round 3): round 2 kept
                  separate mobile/desktop polygons keyed to `sm:`, but
                  `sm:` is a VIEWPORT query — in the editor's Mobile
                  (390px) preview the envelope renders inside a
                  390px-wide div on a DESKTOP viewport, so the desktop
                  polygon (flat 71.3%) and desktop card (28px names,
                  py-7, h-10 divider — ~304px tall in a 256.5px
                  container, because the section root's sm:px-6 makes
                  the editor container 342px wide) applied in a
                  mobile-sized box: Partner B ended below the flat
                  ("& HINA" hidden at rest) and the card bottom stayed
                  below the container's bottom edge after the tap
                  (divider visible, date/location clipped). The card
                  now sizes by CONTAINER width instead (@container on
                  the outer wrapper, @sm: = container >= 384px — the
                  same fix Lane 2 applied to the RSVP section): the
                  editor 390px preview gets the mobile card, desktop
                  (490px container) gets the larger card. The larger
                  card is also shortened so it fits: names 28px ->
                  22px @ 0.12em tracking ("PARTNER B" fits one line in
                  the 177px content box — at 28px it wrapped, which
                  alone made the desktop card 360px tall in a 367.5px
                  container), py-7 -> py-5, divider h-10 -> h-8.
                  Live-measured 2026-11-25 (pre-fix): 390px direct —
                  container 358x268.5, Hina bottom 62.1%, divider top
                  68.0%, card 25%->97.2% (rest OK, tap OK: card
                  6%->80.4%, everything visible); 320px — Hina bottom
                  61.7%, divider top 69.1% (rest/tap OK); desktop
                  1280px — container 490x367.5, "Partner A" wrapped
                  to 2 lines (44.3-59.6%), "Partner B" 69.4-84.6%
                  with its 2nd line pocket-covered, date/location
                  103.1-112.1% (clipped by overflow-hidden), card
                  25%->123%; after tap, location 96.2-100.2%
                  (half-clipped at the photo's bottom edge).
                  The single flat at 65% sits inside the
                  Partner-B-bottom / divider-top gap in every case:
                  direct 390 (62.1-68.0%), direct 320 (61.7-69.1%),
                  editor preview (342x256.5 container: Hina bottom
                  ~63.8%, divider top ~70.0%), desktop fixed card
                  (~61.8-65.6%). On tap the clip's top edge drops to
                  ~97% (the pocket opens) while the card lifts 48px,
                  so divider + date + location are fully revealed
                  with no top clipping (a pure 80px+ card lift would
                  push "WE INVITE YOU" out of the overflow-hidden
                  container at 320px). Round 4: bottom edge 98% ->
                  100% — at 320px the card bottom is 105.6% and the
                  98-100% band showed a ~4px sliver of location
                  glyphs at rest; the overlay is the same photo so
                  100% is seamless. Top edge untouched, so the
                  desktop divider clearance is unchanged. */}
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
            <p className="er-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#14543D]/80 uppercase transition-colors group-hover:text-[#0B3D2E]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Gold Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <WaxSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
