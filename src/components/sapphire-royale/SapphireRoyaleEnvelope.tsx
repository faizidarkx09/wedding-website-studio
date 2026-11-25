// Sapphire Royale envelope — navy + silver art-deco envelope with
// the sliding ice invitation card (tap to reveal / tuck back).
// No corner ornaments: the envelope art already carries the deco,
// and the 144px dark corner squares read as stray fragments on the
// light ice background. No music engine on this template: there is
// no vinyl medallion and no toggle. Only the data comes from the
// site.
//
// CARD GEOMETRY (round 2, 2026-11-25 — live-measured, not assumed):
// the round-1 card was fixed-px (259.8px tall at 390px, 272.5px at
// 320px) inside a 4:3 container (268.5px / 216px tall), so its bottom
// landed 58px / 110px BELOW the container — the whole card read as
// "already outside the envelope", with the date/location floating
// under the photo. A fixed-px stack cannot satisfy the rest pose at
// both 320px and 390px: the pocket V sits at 62% of container height
// and the pocket bottom at 94%, so the visible band above the V is
// 37% of a container height that shrinks with the viewport, while a
// px stack does not. The card is therefore sized in cqw against the
// envelope container (containerType: inline-size below): the band
// above the V is a constant 27.75cqw and the stack below is tuned to
// it — "WE INVITE YOU" + Partner A + "&" + Partner B end at
// 25.4cqw (2.35cqw clear of the V), the divider starts at 28.4cqw
// (just behind the pocket), and the card bottom lands at 85.6% of
// container height (inside the 94% pocket bottom) at EVERY width.
// The lift is "-38%" of the card's own height, so the travel scales
// with the card too: date + location rise fully above the V while
// the card bottom lands just below it (~63.5%).
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { DecoDivider } from "./Decor";
import { DETAIL_IMAGE_URL, formatCardDate, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ice letterpress card                  */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#F2F4F8] px-[4.5cqw] py-[3.4cqw] text-center text-[#12294D] transition-shadow duration-700 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(6,18,43,0.55),0_4px_12px_rgba(6,18,43,0.25)]"
          : "shadow-[0_10px_24px_-8px_rgba(6,18,43,0.45)]"
      }`}
    >
      {/* Ice-silver texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60"
        style={{ backgroundImage: `url(/images/themes/sapphire-royale/ice-texture.jpg)` }}
      />

      {/* Fine double silver art-deco border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2.8cqw] border border-[#C0C0C8]/80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3.6cqw] border border-[#12294D]/25"
      />

      {/* Deco corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[3.4cqw] left-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-t border-l border-[#12294D]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-[3.4cqw] right-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-t border-r border-[#12294D]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[3.4cqw] left-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-b border-l border-[#12294D]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[3.4cqw] bottom-[3.4cqw] h-[2.8cqw] w-[2.8cqw] border-r border-b border-[#12294D]/60"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-[1.1cqw]">
        <p className="sr-font-display text-[2.5cqw] leading-[1.5] tracking-[0.26em] text-[#12294D] uppercase">
          WE INVITE YOU
        </p>

        <h2 className="sr-font-display mt-[1.7cqw] text-[4.2cqw] leading-none font-normal tracking-[0.1em] text-[#0A1F44] uppercase">
          {site.content.partnerA}
        </h2>
        <span className="sr-font-editorial my-[0.6cqw] text-[3.9cqw] leading-[1.5] italic text-[#12294D]">
          &amp;
        </span>
        <h2 className="sr-font-display text-[4.2cqw] leading-none font-normal tracking-[0.1em] text-[#0A1F44] uppercase">
          {site.content.partnerB}
        </h2>

        <DecoDivider className="mt-[3cqw] mb-[1.7cqw] h-auto w-[27cqw]" />

        <p className="sr-font-display text-[2.5cqw] leading-[1.5] tracking-[0.24em] text-[#0A1F44] uppercase">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="sr-font-display mt-[0.56cqw] text-[2.4cqw] leading-[1.5] tracking-[0.12em] text-[#12294D] uppercase">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function SapphireRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Navy Envelope + Sliding Ice Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px]"
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={isCardLifted}
            aria-label={
              isCardLifted
                ? "Tuck wedding invitation card back into the envelope"
                : "Open navy envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C0C0C8]"
          >
            {/* Envelope Container preserving the exact 4:3 geometry of the navy envelope.
                containerType makes the invitation card scale with the
                envelope via cqw units (see the geometry note at the top
                of this file) — same pattern as Sacred Garden. */}
            <div
              className="relative aspect-[4/3] w-full"
              style={{ containerType: "inline-size" }}
            >
              {/* Layer 1: Full Open Navy Art-Deco Envelope Backdrop */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DETAIL_IMAGE_URL}
                alt="Deep midnight navy open wedding envelope with silver art-deco geometric lines and a silver wax seal"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover drop-shadow-[0_24px_34px_rgba(6,18,43,0.35)]"
              />

              {/* Layer 2: Interactive Sliding Ice Invitation Card.
                  Lift is -38% of the card's own height, so the travel
                  scales with the card at every width (~64px at 390px,
                  ~52px at 320px, ~88px at desktop): the divider, date
                  and location all rise fully above the pocket V (62%)
                  while the card bottom lands just below it (~63.5%),
                  still reading as emerging from the envelope. The old
                  fixed -54px lift left the date/location hidden behind
                  the pocket at every width (live-measured 2026-11-25).
                  Reduced motion keeps the full travel (the content must
                  still be revealed) but snaps it in 0.2s. */}
              <motion.div
                initial={false}
                animate={{
                  y: isCardLifted ? "-38%" : 0,
                  scale: isCardLifted ? 1.03 : 1,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0.2 : 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute top-[25%] left-1/2 z-10 w-[47%] -translate-x-1/2 sm:w-[46%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: Front Navy Pocket Flaps Overlay (masks the bottom
                  of the card so it physically slides out of the pocket) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20"
                style={{
                  clipPath:
                    "polygon(19% 37%, 40% 62%, 60% 62%, 81% 37%, 81% 94%, 19% 94%)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={DETAIL_IMAGE_URL}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="block h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Subtle interactive cue */}
            <p className="sr-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#12294D]/80 uppercase transition-colors group-hover:text-[#0A1F44]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
