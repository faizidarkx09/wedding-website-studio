// Winter Frost envelope — interactive ice-blue envelope with a
// snowflake wax seal and the sliding white letterpress card (tap the
// seal to break it and reveal / tuck the card back). No music on
// this template — the seal is the interaction.
//
// GEOMETRY — copied from Golden Hour's live-verified envelope
// (same card, same three container bands, same clip polygon): the
// card is sized by CONTAINER width (@container on the outer
// wrapper — never viewport `sm:` — so the editor's Mobile (390px)
// preview gets the mobile card and desktop (490px container) gets
// the larger card), in THREE bands, because the card's content is
// fixed px while the 4:3 container shrinks with the viewport:
//   - <352px: compact card (@max-[22rem]: 15px names, tight padding)
//   - 352–383px: small card (17px names), top 25%
//   - 384–469px: small card, top 28%, divider mt-10 — the large
//     card does NOT fit here (at 430px viewport / 398x299
//     container it spanned 25%→131.7% — only PARTNER A peeked,
//     Partner B sat at 85% behind the pocket, and when open the
//     location line was clipped mid-glyph).
//   - >=470px: large card (22px names, py-5), top 25%.
// The clip polygon (19% 52%, 32% 65%, 68% 65%, 81% 52%) sits ABOVE
// the true pocket edge across the card's sides and ~2% BELOW the
// flap point at centre — a ~7px sliver where the card peeks just
// past the fold point, which reads as the card emerging from
// behind the fold. At rest the names peek above the pocket while
// divider/date/location stay hidden behind it; on tap the clip's
// top edge drops to ~97% (the pocket opens) while the card lifts
// 48px, so divider + date + location are fully revealed with no
// top clipping. DO NOT resize the bands without re-verifying at
// 320 / 390 / 430 / desktop.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { SnowflakeDivider } from "./Decor";
import { ENVELOPE_IMAGE_URL, formatCardDate, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding white letterpress card                */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#FDFEFF] px-4 py-3 text-center text-[#12395B] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(11,37,64,0.55),0_4px_12px_rgba(11,37,64,0.25)]"
          : "shadow-[0_10px_24px_-8px_rgba(11,37,64,0.45)]"
      }`}
    >
      {/* Cool white paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(253, 254, 255, 0.4) 0%, rgba(214, 235, 249, 0.55) 100%)",
        }}
      />

      {/* Fine double ice-blue & deep-blue letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#7FB3D9]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#12395B]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#12395B]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#12395B]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#12395B]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#12395B]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="wf-font-display text-[9px] tracking-[0.26em] text-[#1B4A6B] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="wf-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#12395B] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="wf-font-editorial my-0.5 text-base italic text-[#1B4A6B] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="wf-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#12395B] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <SnowflakeDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="wf-font-display text-[9px] tracking-[0.24em] text-[#12395B] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="wf-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#1B4A6B] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* WaxSeal — the snowflake wax-seal open button. Tapping it "breaks" */
/* the seal (it splits and fades) and the card slides up; tapping   */
/* again reseals it. The seal is pure SVG/CSS (ice-blue wax disc    */
/* with a white six-arm snowflake) — no photo crop needed.           */
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
            ? "Reseal the winter envelope"
            : "Break the snowflake wax seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_35%_30%,#7FB3D9_0%,#1B4A6B_55%,#12395B_100%)] shadow-[0_16px_30px_-8px_rgba(11,37,64,0.6),0_4px_10px_rgba(11,37,64,0.35)] ring-2 ring-[#BDE0F5]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B]"
      >
        {/* Snowflake on the wax */}
        <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full p-4">
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * 60 - 90) * (Math.PI / 180);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            return (
              <g key={i} stroke="#FFFFFF" strokeLinecap="round">
                <line x1="50" y1="50" x2={50 + 34 * cos} y2={50 + 34 * sin} strokeWidth="2.4" />
                <line
                  x1={50 + 20 * cos}
                  y1={50 + 20 * sin}
                  x2={50 + 20 * cos + 8 * -sin}
                  y2={50 + 20 * sin + 8 * cos}
                  strokeWidth="1.5"
                />
                <line
                  x1={50 + 20 * cos}
                  y1={50 + 20 * sin}
                  x2={50 + 20 * cos - 8 * -sin}
                  y2={50 + 20 * sin - 8 * cos}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
          <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
        </svg>
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 h-px rotate-[-14deg] bg-white/70"
          />
        )}
      </motion.button>

      <span className="wf-font-editorial mt-3 text-xs tracking-[0.18em] text-[#1B4A6B]/90 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Seal to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function WinterFrostEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Winter Envelope + Sliding Letterpress Card */}
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
                : "Open winter envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#12395B]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the winter envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(11,37,64,0.3)]">
              {/* Layer 1: Winter envelope artwork (frosted pine detail photo) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Frosted pine branches with a white ribbon in falling snow"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding White Letterpress Invitation Card */}
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

              {/* Layer 3: REAL ice pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry copied from Golden Hour (live-verified):
                  polygon (19% 52%, 32% 65%, 68% 65%, 81% 52%). On tap
                  the clip's top edge drops to ~97% (the pocket opens)
                  while the card lifts 48px. */}
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
            <p className="wf-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#1B4A6B]/80 uppercase transition-colors group-hover:text-[#12395B]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Snowflake Wax Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <WaxSeal isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
