// Peacock Royale envelope — interactive deep-teal envelope with
// a gold peacock-feather wax seal and the sliding ivory
// letterpress card (tap the seal to break it and reveal / tuck the
// card back). No music on this template — the seal is the
// interaction, not a vinyl medallion.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FeatherDivider, FeatherEye } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ivory letterpress card               */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FDFBF5] px-4 py-2 text-center text-[#0B4F4A] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-3 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(4,33,31,0.55),0_4px_12px_rgba(4,33,31,0.25)]"
          : "shadow-[0_10px_24px_-8px_rgba(4,33,31,0.45)]"
      }`}
    >
      {/* Fine double gold & teal letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D4AF37]/90 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#0B4F4A]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#0B4F4A]/65 @min-[29.375rem]:top-3.5 @min-[29.375rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#0B4F4A]/65 @min-[29.375rem]:top-3.5 @min-[29.375rem]:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#0B4F4A]/65 @min-[29.375rem]:bottom-3.5 @min-[29.375rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#0B4F4A]/65 @min-[29.375rem]:right-3.5 @min-[29.375rem]:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-2">
        <p className="er-font-display text-[9px] leading-none tracking-[0.26em] text-[#0B4F4A] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="er-font-display mt-2 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#062E2B] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[18px] @min-[29.375rem]:tracking-[0.12em]">
          {site.content.partnerA}
        </h2>
        <span className="er-font-editorial my-0.5 text-sm leading-none italic text-[#0B4F4A] @min-[29.375rem]:text-base">
          &amp;
        </span>
        <h2 className="er-font-display text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#062E2B] uppercase @min-[29.375rem]:text-[18px] @min-[29.375rem]:tracking-[0.12em]">
          {site.content.partnerB}
        </h2>

        <FeatherDivider className="mt-6 mb-2 h-5 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:mt-6 @min-[29.375rem]:h-6 @min-[29.375rem]:w-28" />

        <p className="er-font-display text-[9px] leading-none tracking-[0.24em] text-[#062E2B] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-display mt-1 text-[8.5px] leading-none tracking-[0.22em] text-[#0B4F4A] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FeatherSeal — the gold peacock-feather wax-seal open button.     */
/* Tapping it "breaks" the seal (it splits and fades) and the card  */
/* slides up; tapping again reseals it. The seal is pure CSS/SVG    */
/* (no baked seal in the envelope artwork), so the sliding card can */
/* never hide it.                                                    */
/* ------------------------------------------------------------------ */

function FeatherSeal({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the peacock feather envelope"
            : "Break the gold feather wax seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-[0_16px_30px_-8px_rgba(4,33,31,0.6),0_4px_10px_rgba(4,33,31,0.35)] ring-2 ring-[#E7C86A]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B] @min-[24rem]:h-28 @min-[24rem]:w-28"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #F6E27A 0%, #E7C86A 34%, #D4AF37 60%, #9A7B2D 100%)",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-2 rounded-full border border-[#062E2B]/25"
        />
        <FeatherEye className="relative h-12 w-9 drop-shadow-[0_1px_2px_rgba(6,46,43,0.4)] @min-[24rem]:h-14 @min-[24rem]:w-10" />
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-[#062E2B]/50"
          />
        )}
      </motion.button>

      <span className="er-font-editorial mt-3 text-xs tracking-[0.18em] text-[#0B4F4A]/90 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function PeacockRoyaleEnvelope({ site }: { site: WeddingSite }) {
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
        {/* Interactive Teal Envelope + Sliding Ivory Card */}
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
                : "Open peacock royale envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the
                cropped envelope artwork (1200x879, tight-cropped to
                the envelope itself, so object-cover maps ~1:1). */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(4,33,31,0.3)]">
              {/* Layer 1: Teal envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Deep teal wedding envelope with gold peacock-feather trim and a pocket panel"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Ivory Letterpress
                  Invitation Card.
                  Card top and size are CONTAINER queries (NEVER a
                  viewport `sm:` here, or the editor's Mobile (390px)
                  preview on a desktop viewport gets desktop geometry
                  in a mobile-sized box, exactly the Emerald round-2
                  failure). Three bands, because the card's content is
                  fixed px while the 4:3 container shrinks with the
                  viewport — the large card does NOT fit at 430px
                  (398x299 container): with top 26% + 18px names,
                  Partner B bottom sat at 58.8%, 20px below the 52%
                  pocket line.
                  - <384px: small card (15px names), top 16% — 390px:
                    Partner B bottom 44.7%, divider top 53.6%;
                    320px: Partner B bottom 51.6% (~1px clearance
                    above the 52.7% pocket line, reads complete by
                    eye).
                  - 384–469px: small card, top 22%, divider mt-10.
                  - >=470px: large card (18px names), top 23% —
                    lowered from 26% because the live-measured names
                    section is ~98px, not the 88px the builder assumed:
                    at 26% Partner B bottom was 52.7% at desktop,
                    ON the pocket line. At 23% it is 49.7%
                    (~12px clearance) at the 490px container and
                    50.9% (~4px) at 470px.
                  At every band the names peek above the pocket line
                  while the divider, date and location sit below it
                  (see the pocket-geometry note on Layer 3). */}
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
                className="absolute top-[16%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[24rem]:top-[22%] @min-[24rem]:w-[46%] @min-[29.375rem]:top-[23%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL teal pocket — the envelope photo
                  rendered a second time ABOVE the card, clipped to
                  the pocket's shape, so the card is physically
                  tucked inside at rest.
                  MEASURED on the cropped artwork (1200x879,
                  pixel-profiled 2026-11-26): the pocket panel's
                  flat top edge sits at y = 52.7% (strongest
                  darkening edge in the 35–65% band, luminance
                  171 → 59 across the edge) and spans x ≈ 11–89%;
                  its sides angle out to the bottom corners
                  (≈1% / 99% at y = 100%). The polygon follows
                  that edge exactly, so the overlay is
                  pixel-seamless with Layer 1 (same image, same
                  object-cover mapping).
                  Rest geometry (same card content as Silver
                  Moonlight, same fixed-px sizes, so the same
                  measured offsets apply against the 52.7% line):
                  - Mobile small card, top 16%: 390px (358x269) —
                    names bottom 44.7%, divider top 53.6% (hidden,
                    just below the 52.7% line); card bottom 76.5%,
                    hidden behind the pocket. 320px (288x216) —
                    names bottom 51.6% (~1px clearance, reads
                    complete by eye), divider top 62.8%.
                  - Band 384–469px, small card, top 22%, divider
                    mt-10 (divider offset 117.2px from card top):
                    Partner B bottom 43.9–48.8%, divider top
                    55.2–62.7% — both clear of the 52.7% line across
                    the whole band.
                  - Desktop large card, top 23% (490x367.5): names
                    bottom 49.7% (~12px clearance), divider top
                    56.3% — hidden with ~13px margin; card bottom
                    ~80%, hidden.
                  The card bottom sits below the pocket line in
                  every case (invisible behind the overlay), which
                  is what "tucked" means here.
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
                    ? "polygon(11% 97%, 89% 97%, 99% 100%, 1% 100%)"
                    : "polygon(11% 52.7%, 89% 52.7%, 99% 100%, 1% 100%)",
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
            <p className="er-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#0B4F4A]/85 uppercase transition-colors group-hover:text-[#062E2B]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Gold Peacock-Feather Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <FeatherSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
