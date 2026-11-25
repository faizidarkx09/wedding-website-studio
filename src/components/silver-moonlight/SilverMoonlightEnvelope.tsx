// Silver Moonlight envelope — interactive slate-blue envelope
// with a silver crescent wax seal and the sliding ice-white
// letterpress card (tap the seal to break it and reveal / tuck the
// card back). No music on this template — the seal is the
// interaction, not a vinyl medallion.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { CrescentMoon, MoonDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ice-white letterpress card           */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#F4F7FA] px-4 py-2 text-center text-[#2E3A4A] transition-shadow duration-700 @min-[24rem]:px-6 @min-[24rem]:py-3 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(14,22,32,0.52),0_4px_12px_rgba(14,22,32,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(14,22,32,0.45)]"
      }`}
    >
      {/* Fine double silver & slate letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9CDD6]/90 @min-[24rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#2E3A4A]/25 @min-[24rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#2E3A4A]/65 @min-[24rem]:top-3.5 @min-[24rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#2E3A4A]/65 @min-[24rem]:top-3.5 @min-[24rem]:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#2E3A4A]/65 @min-[24rem]:bottom-3.5 @min-[24rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#2E3A4A]/65 @min-[24rem]:right-3.5 @min-[24rem]:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[24rem]:py-2">
        <p className="er-font-display text-[9px] leading-none tracking-[0.26em] text-[#2E3A4A] uppercase @min-[24rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="er-font-display mt-2 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#16202E] uppercase @min-[24rem]:mt-3 @min-[24rem]:text-[18px] @min-[24rem]:tracking-[0.12em]">
          {site.content.partnerA}
        </h2>
        <span className="er-font-editorial my-0.5 text-sm leading-none italic text-[#2E3A4A] @min-[24rem]:text-base">
          &amp;
        </span>
        <h2 className="er-font-display text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#16202E] uppercase @min-[24rem]:text-[18px] @min-[24rem]:tracking-[0.12em]">
          {site.content.partnerB}
        </h2>

        <MoonDivider className="mt-6 mb-2 h-5 w-24 @min-[24rem]:h-6 @min-[24rem]:w-28" />

        <p className="er-font-display text-[9px] leading-none tracking-[0.24em] text-[#16202E] uppercase @min-[24rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-display mt-1 text-[8.5px] leading-none tracking-[0.22em] text-[#2E3A4A] uppercase @min-[24rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SilverSeal — the silver crescent wax-seal open button. Tapping   */
/* it "breaks" the seal (it splits and fades) and the card slides   */
/* up; tapping again reseals it. The seal is pure CSS/SVG (no baked */
/* seal in the envelope artwork), so the sliding card can never     */
/* hide it.                                                          */
/* ------------------------------------------------------------------ */

function SilverSeal({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the silver moonlight envelope"
            : "Break the silver wax seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(14,22,32,0.6),0_4px_10px_rgba(14,22,32,0.35)] ring-2 ring-[#E8EBF0]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16202E] @min-[24rem]:h-28 @min-[24rem]:w-28"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #F4F7FA 0%, #DDE1E8 38%, #C9CDD6 62%, #9AA3B0 100%)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-2 rounded-full border border-[#16202E]/20"
        />
        <CrescentMoon className="relative h-9 w-9 drop-shadow-[0_1px_2px_rgba(22,32,46,0.35)] @min-[24rem]:h-10 @min-[24rem]:w-10" />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#16202E]/50"
          />
        )}
      </motion.button>

      <span className="er-font-editorial mt-3 text-xs tracking-[0.18em] text-[#2E3A4A]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function SilverMoonlightEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  // NOTE: the outer wrapper below is NOT inside a @container (the
  // container starts at the motion.div inside it), so its padding is
  // fixed — container queries there would never match.
  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Slate Envelope + Sliding Letterpress Card */}
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
                : "Open silver moonlight envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16202E]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the
                cropped envelope artwork (1200x895, tight-cropped to
                the envelope itself, so object-cover maps ~1:1). */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(14,22,32,0.28)]">
              {/* Layer 1: Slate-blue envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Deep slate-blue wedding envelope with a silver sheen and a pocket panel"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Ice-White Letterpress
                  Invitation Card.
                  Card top is a CONTAINER query (@min-[24rem]: =
                  container >= 384px — the desktop 490px container
                  qualifies, the 342–358px mobile containers do not;
                  NEVER a viewport `sm:` here, or the editor's
                  Mobile (390px) preview on a desktop viewport gets
                  desktop geometry in a mobile-sized box, exactly
                  the Emerald round-2 failure). Mobile top 16% and
                  desktop top 26% land the card so the names peek
                  above the pocket line while the divider, date and
                  location sit below it at BOTH sizes (see the
                  pocket-geometry note on Layer 3). */}
              <motion.div
                initial={false}
                animate={{
                  y: isCardLifted ? (prefersReducedMotion ? -14 : -28) : 0,
                  scale: isCardLifted ? 1.03 : 1,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-[16%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[24rem]:top-[26%] @min-[24rem]:w-[46%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL slate pocket — the envelope photo
                  rendered a second time ABOVE the card, clipped to
                  the pocket's shape, so the card is physically
                  tucked inside at rest.
                  MEASURED on the cropped artwork (1200x895,
                  pixel-profiled 2026-11-25): the pocket panel's
                  flat top edge sits at y = 52.2% and spans
                  x ≈ 13–82%; its sides angle out to the bottom
                  corners (≈1% / 99% at y = 100%). The polygon
                  follows that edge exactly, so the overlay is
                  pixel-seamless with Layer 1 (same image, same
                  object-cover mapping).
                  Rest geometry, verified arithmetically at both
                  container sizes (card content is fixed px, so the
                  card top differs by container — mobile 16%,
                  desktop 26% via @min-[24rem]:):
                  - Mobile (editor 342x256.5): card top 41px,
                    names bottom ≈ 116px (45.2%), pocket line
                    134px (52.2%) — names peek with ~17px margin;
                    divider top ≈ 140px (54.6%) — hidden with
                    ~7px margin; card bottom ≈ 210px (82%), hidden
                    behind the pocket.
                  - Desktop (490x367.5): card top 96px, names
                    bottom ≈ 184px (50.0%) — peek with ~8px margin;
                    divider top ≈ 208px (56.5%) — hidden with
                    ~16px margin; card bottom ≈ 269px (73%), hidden.
                  The card bottom sits below the pocket line in
                  both cases (invisible behind the overlay), which
                  is what "tucked" means here — the 85–95% nominal
                  bottom from the Emerald rounds cannot apply to
                  this artwork, whose pocket line is at 52%
                  rather than 65%.
                  On tap the clip's top edge drops to 97% (the
                  pocket opens) while the card lifts 28px — the
                  lift is capped at 28px because the mobile card
                  top is only 41px: a 48px lift (Emerald's) would
                  push "WE INVITE YOU" out of the overflow-hidden
                  container. With 28px the eyebrow stays visible
                  (top ≈ 13px) and divider + date + location are
                  fully revealed with no top clipping. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(13% 97%, 82% 97%, 99% 100%, 1% 100%)"
                    : "polygon(13% 52%, 82% 52%, 99% 100%, 1% 100%)",
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
            <p className="er-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#2E3A4A]/80 uppercase transition-colors group-hover:text-[#16202E]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Silver Crescent Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <SilverSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
