// Blush Royale envelope — interactive blush envelope with the
// cream invitation card tucked BEHIND it (tap to reveal / tuck
// back) and blush floral corner sprigs. No music medallion: this
// template has no music engine by design.
//
// Geometry note: the envelope artwork is a CLOSED blush envelope
// (rose-gold wax seal, roses at the corner) on a plain cream field,
// so there is no open pocket to slide a card out of. The card lives
// in an overflow-hidden wrapper whose height animates 0 → auto: at
// rest the wrapper is 0px tall, so 0px of the card is visible and
// it takes no space; on tap the wrapper grows down from behind the
// envelope's bottom edge (the -mt-16 overlap keeps the open card
// tucked 64px up over the envelope art, exactly the old open look).
// A spacer div above the cue (pt-16 / sm:pt-20, collapsing on open)
// compensates the overlap, so the cue sits 16px below the envelope
// at rest and 16px below the card when open.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FloralCorner, FloralDivider } from "./Decor";
import { ENVELOPE_IMAGE_URL, formatCardDate, locationLabel } from "./tokens";

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-[1.5rem] bg-[#FFFDFB] px-4 py-5 text-center text-[#5C323B] transition-shadow duration-700 sm:px-6 sm:py-7 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(92,50,59,0.4),0_4px_12px_rgba(92,50,59,0.18)]"
          : "shadow-[0_10px_24px_-8px_rgba(92,50,59,0.3)]"
      }`}
    >
      {/* Cream watercolor paper texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(/images/themes/blush-royale/cream.jpg)` }}
      />

      {/* Fine double rose-gold letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 rounded-[1.25rem] border border-[#B76E79]/60 sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] rounded-[1rem] border border-[#E8B4B8]/50 sm:inset-[15px]"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-2 sm:py-3">
        <p className="br-font-display text-[9px] tracking-[0.26em] text-[#7A4A55] uppercase sm:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="br-font-script mt-3 text-[2rem] leading-none font-normal text-[#B76E79] sm:mt-4 sm:text-[2.4rem]">
          {site.content.partnerA}
        </h2>
        <span className="br-font-editorial my-1 text-base italic text-[#7A4A55] sm:text-lg">
          &amp;
        </span>
        <h2 className="br-font-script text-[2rem] leading-none font-normal text-[#B76E79] sm:text-[2.4rem]">
          {site.content.partnerB}
        </h2>

        <FloralDivider className="my-2.5 h-8 w-24 sm:my-3.5 sm:h-10 sm:w-28" />

        <p className="br-font-display text-[9px] tracking-[0.24em] text-[#5C323B] uppercase sm:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="br-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#7A4A55] uppercase sm:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

export default function BlushRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  // One shared reveal timing for the height growth + cue margin so
  // the cue tracks the card's bottom edge while it emerges.
  const revealDuration = prefersReducedMotion ? 0.2 : 0.85;

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      {/* Corner blush floral sprigs */}
      <FloralCorner position="top-left" />
      <FloralCorner position="bottom-right" />

      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
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
                ? "Tuck wedding invitation card back behind the envelope"
                : "Open blush envelope and slide the wedding invitation card out from behind it"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B76E79]"
          >
            {/* Blush envelope artwork (closed envelope, wax seal) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ENVELOPE_IMAGE_URL}
              alt="Soft blush watercolor wedding envelope with a rose-gold wax seal and blush roses"
              referrerPolicy="no-referrer"
              className="pointer-events-none block h-auto w-full rounded-[1.5rem] object-contain drop-shadow-[0_24px_34px_rgba(92,50,59,0.22)]"
            />

            {/* Invitation card — tucked BEHIND the envelope at rest.
                The wrapper is overflow-hidden with height animated
                0 → auto, so at rest 0px of the card is visible and
                the wrapper takes no space; on tap it grows down from
                behind the envelope's bottom edge. The -mt-16 overlap
                is on the wrapper (not the card: a negative margin on
                the card would be clipped by the overflow-hidden
                wrapper and lose the card's top 64px) and reproduces
                the old open look — card tucked 64px up over the
                envelope art. No y/scale animation on the card: a
                translate would clip its top / leave a gap at the
                wrapper's bottom while the height animates. */}
            <motion.div
              initial={false}
              animate={{ height: isCardLifted ? "auto" : 0 }}
              transition={{
                duration: revealDuration,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden={!isCardLifted}
              className="relative z-10 mx-auto -mt-16 w-[86%] overflow-hidden sm:-mt-20 sm:w-[84%]"
            >
              <InvitationCard site={site} isOpen={isCardLifted} />
            </motion.div>

            {/* Subtle interactive cue. The spacer div's top padding
                (64px mobile / 80px sm+, matching the wrapper's
                -mt-16 / sm:-mt-20) compensates the overlap when the
                card is tucked, so the cue sits 16px below the
                envelope at rest and 16px below the card when open;
                it animates away on the same timing as the reveal so
                the cue tracks the card's bottom edge. */}
            <div
              className={`transition-[padding-top] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isCardLifted ? "pt-0" : "pt-16 sm:pt-20"
              }`}
              style={{ transitionDuration: `${revealDuration}s` }}
            >
              <p className="br-font-display mt-4 text-center text-[10px] tracking-[0.26em] text-[#7A4A55]/80 uppercase transition-colors group-hover:text-[#5C323B]">
                {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
