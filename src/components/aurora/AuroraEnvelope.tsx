// Aurora envelope — interactive deep-navy aurora envelope with a
// teal-violet aurora seal orb and the sliding ice-white letter card
// (tap the seal to break it and reveal / tuck the card back). No
// music on this template — the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { AuroraDivider, AuroraSeal } from "./Decor";
import { ENVELOPE_IMAGE_URL, formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ice-white letter card                 */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#F4F7FB] px-4 py-3 text-center text-[#0F172A] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(2,6,23,0.7),0_4px_12px_rgba(2,6,23,0.4)]"
          : "shadow-[0_10px_24px_-8px_rgba(2,6,23,0.6)]"
      }`}
    >
      {/* Ice-white paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(244, 247, 251, 0.5) 0%, rgba(226, 232, 240, 0.55) 100%)",
        }}
      />

      {/* Fine double teal & violet letter border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#14B8A6]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#8B5CF6]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#0F172A]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#0F172A]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#0F172A]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#0F172A]/60"
      />

      {/* Editable HTML Letter Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="au-font-display text-[9px] font-semibold tracking-[0.26em] text-[#0F766E] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="au-font-display mt-2 text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#0F172A] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="au-font-editorial my-0.5 text-base italic text-[#0F766E] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="au-font-display text-[17px] leading-none font-semibold tracking-[0.1em] break-words text-[#0F172A] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <AuroraDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:my-3.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="au-font-display text-[9px] font-semibold tracking-[0.24em] text-[#0F172A] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="au-font-display mt-1 text-[8.5px] font-semibold tracking-[0.22em] text-[#0F766E] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function AuroraEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Aurora Envelope + Sliding Ice Letter Card */}
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
                : "Open aurora envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5EEAD4]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the aurora envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] shadow-[0_24px_34px_rgba(2,6,23,0.5)]">
              {/* Layer 1: Aurora envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Deep navy wedding envelope with teal and violet aurora light streaks"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Ice Letter Card */}
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

              {/* Layer 3: REAL aurora pocket — the envelope photo rendered
                  a second time ABOVE the card, clipped to the pocket's
                  shape, so the card is physically tucked inside at rest.
                  Geometry (eye-measured from aurora-envelope.jpg,
                  1200x900, cropped to the envelope bounds): a classic
                  envelope — triangular flap with its point at centre
                  ~(50%, 66%), pocket diagonals running from the flap
                  point down to the bottom corners, so the true pocket
                  edge is ^-shaped (66% at centre, ~79% at x=32%/68%,
                  ~84% at the card's edges).
                  The clip reuses Golden Hour's proven single flat
                  polygon (19% 52%, 32% 65%, 68% 65%, 81% 52%): it sits
                  ABOVE the true pocket edge across the card's sides
                  (65% vs 79% true at x=32%) and ~1% BELOW the flap
                  point at centre (65% vs 66% true) — a ~4px sliver
                  where the card peeks just past the fold point, which
                  reads as the card emerging from behind the fold.
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in THREE bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport:
                  - <352px: compact card (@max-[22rem]: 15px names,
                    tight padding) — 320px: Partner B bottom 63.7%,
                    divider top 71.1%, card bottom 107.6% (behind the
                    pocket, invisible). Same bands as Golden Hour —
                    coordinator must live-verify at 320/390/desktop.
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
            <p className="au-font-display mt-1 text-center text-[10px] font-semibold tracking-[0.26em] text-[#5EEAD4]/85 uppercase transition-colors group-hover:text-[#F4F7FB]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Aurora Seal Orb */}
          <div className="relative z-30 mt-4 flex justify-center">
            <AuroraSeal monogram={initials(site)} isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
