// Sapphire Royale envelope — navy + silver art-deco envelope with
// the sliding ice invitation card (tap to reveal / tuck back).
// No corner ornaments: the envelope art already carries the deco,
// and the 144px dark corner squares read as stray fragments on the
// light ice background. No music engine on this template: there is
// no vinyl medallion and no toggle. Only the data comes from the
// site.
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
      className={`relative mx-auto w-full overflow-hidden bg-[#F2F4F8] px-4 py-5 text-center text-[#12294D] transition-shadow duration-700 sm:px-6 sm:py-7 ${
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
        className="pointer-events-none absolute inset-2.5 border border-[#C0C0C8]/80 sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#12294D]/25 sm:inset-[15px]"
      />

      {/* Deco corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#12294D]/60 sm:top-3.5 sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#12294D]/60 sm:top-3.5 sm:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#12294D]/60 sm:bottom-3.5 sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#12294D]/60 sm:right-3.5 sm:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-2 sm:py-3">
        <p className="sr-font-display text-[9px] tracking-[0.26em] text-[#12294D] uppercase sm:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="sr-font-display mt-3 text-xl leading-none font-normal tracking-[0.18em] text-[#0A1F44] uppercase sm:mt-4 sm:text-[1.75rem]">
          {site.content.partnerA}
        </h2>
        <span className="sr-font-editorial my-1 text-base italic text-[#12294D] sm:text-lg">
          &amp;
        </span>
        <h2 className="sr-font-display text-xl leading-none font-normal tracking-[0.18em] text-[#0A1F44] uppercase sm:text-[1.75rem]">
          {site.content.partnerB}
        </h2>

        <DecoDivider className="my-2.5 h-4 w-24 sm:my-3.5 sm:h-5 sm:w-28" />

        <p className="sr-font-display text-[9px] tracking-[0.24em] text-[#0A1F44] uppercase sm:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="sr-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#12294D] uppercase sm:text-[9.5px]">
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
            {/* Envelope Container preserving the exact 4:3 geometry of the navy envelope */}
            <div className="relative aspect-[4/3] w-full">
              {/* Layer 1: Full Open Navy Art-Deco Envelope Backdrop */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DETAIL_IMAGE_URL}
                alt="Deep midnight navy open wedding envelope with silver art-deco geometric lines and a silver wax seal"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover drop-shadow-[0_24px_34px_rgba(6,18,43,0.35)]"
              />

              {/* Layer 2: Interactive Sliding Ice Invitation Card */}
              <motion.div
                initial={false}
                animate={{
                  y: isCardLifted ? (prefersReducedMotion ? -28 : -54) : 0,
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
