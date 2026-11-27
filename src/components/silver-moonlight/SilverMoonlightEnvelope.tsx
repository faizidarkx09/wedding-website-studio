// Silver Moonlight invitation card — NO envelope. The card itself
// is the reveal: at rest you see its BACK (blurred moonlit
// photograph under a deep-night wash, silver crescent medallion
// with the couple monogram, "Tap to Reveal"); tap rises the card
// from below while it slowly turns (rotateY) into place, the back
// fades away and the FRONT (the existing invitation content,
// unchanged) rises into place with a burst of starlight. Tap again
// settles it back. prefers-reduced-motion: instant swap, no ambient
// animation, no particles. No music on this template — the card is
// the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { CrescentMoon, MoonDivider, TwinklingStars } from "./Decor";
import {
  COVER_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { StarBurstCanvas } from "./SilverMoonlightCinematic";

/* ------------------------------------------------------------------ */
/* InvitationCard — the ice-white letterpress card (FRONT, unchanged)*/
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-[#F4F7FA] px-4 py-2 text-center text-[#2E3A4A] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-3 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(14,22,32,0.52),0_4px_12px_rgba(14,22,32,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(14,22,32,0.45)]"
      }`}
    >
      {/* Fine double silver & slate letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9CDD6]/90 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#2E3A4A]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#2E3A4A]/65 @min-[29.375rem]:top-3.5 @min-[29.375rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#2E3A4A]/65 @min-[29.375rem]:top-3.5 @min-[29.375rem]:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#2E3A4A]/65 @min-[29.375rem]:bottom-3.5 @min-[29.375rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#2E3A4A]/65 @min-[29.375rem]:right-3.5 @min-[29.375rem]:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-2">
        <p className="er-font-display text-[9px] leading-none tracking-[0.26em] text-[#2E3A4A] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="er-font-display mt-2 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#16202E] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[18px] @min-[29.375rem]:tracking-[0.12em]">
          {site.content.partnerA}
        </h2>
        <span className="er-font-editorial my-0.5 text-sm leading-none italic text-[#2E3A4A] @min-[29.375rem]:text-base">
          &amp;
        </span>
        <h2 className="er-font-display text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#16202E] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[18px] @min-[29.375rem]:tracking-[0.12em]">
          {site.content.partnerB}
        </h2>

        <MoonDivider className="mt-6 mb-2 h-5 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:mt-6 @min-[29.375rem]:h-6 @min-[29.375rem]:w-28" />

        <p className="er-font-display text-[9px] leading-none tracking-[0.24em] text-[#16202E] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-display mt-1 text-[8.5px] leading-none tracking-[0.22em] text-[#2E3A4A] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred moonlit photograph under a deep-night wash,   */
/* silver crescent medallion with the couple monogram, tap hint.    */
/* Same footprint as the front (absolute inset-0 of the reveal box), */
/* so the reveal never changes the layout.                           */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#16202E] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(14,22,32,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred moonlit photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.6) saturate(0.9)", transform: "scale(1.18)" }}
      />

      {/* Deep-night wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(22,32,46,0.3) 0%, rgba(22,32,46,0.66) 100%)",
        }}
      />

      {/* Fine double silver border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9CDD6]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#F4F7FA]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="er-font-display text-[9px] tracking-[0.34em] text-[#DDE1E8] uppercase @min-[29.375rem]:text-[10px]">
          UNDER THE MOON
        </p>

        {/* Silver crescent medallion with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-4 flex h-24 w-24 items-center justify-center rounded-full @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #F4F7FA 0%, #DDE1E8 38%, #C9CDD6 62%, #9AA3B0 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.55), inset 0 -4px 10px rgba(22,32,46,0.4), 0 10px 22px -6px rgba(14,22,32,0.55)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#16202E]/20" />
          <CrescentMoon className="absolute top-2 right-3 h-6 w-6 opacity-80 @min-[29.375rem]:h-7 @min-[29.375rem]:w-7" />
          <span className="er-font-display relative text-[1.35rem] leading-none font-medium tracking-[0.06em] text-[#16202E] @min-[29.375rem]:text-[1.5rem]">
            {initials(site)}
          </span>
        </div>

        <MoonDivider className="mt-4 h-5 w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-6 @min-[29.375rem]:w-28" />

        <p className="er-font-display mt-3 text-[9px] tracking-[0.3em] text-[#DDE1E8] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MoonAmbience — twinkling stars + slow-drifting moonlight behind  */
/* the card. Transform + opacity only (GPU-friendly). Skipped under  */
/* reduced motion.                                                    */
/* ------------------------------------------------------------------ */

function MoonAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,205,214,0.45) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 20, 0], y: [0, -14, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(221,225,232,0.35) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -16, 0], y: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <TwinklingStars className="absolute inset-0" count={36} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Moonrise rise + slow turn". At rest the BACK shows, */
/* the card resting at a slight turn. Tap lifts it from below while  */
/* it slowly turns (rotateY) into place, the back fades away and    */
/* the FRONT rises into place with a burst of starlight. Tap again   */
/* settles it back.                                                  */
/* ------------------------------------------------------------------ */

export default function SilverMoonlightEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) setBurstKey((k) => k + 1);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
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
            aria-expanded={isRevealed}
            aria-label={
              isRevealed
                ? "Hide the wedding invitation card back to its back side"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16202E]"
          >
            {/* Ambient twinkling stars + moonlight behind the card */}
            {!instant && <MoonAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft silver glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(201,205,214,0.45) 0%, rgba(221,225,232,0.28) 55%, transparent 75%)",
                }}
              />

              {/* Rise lift on reveal */}
              <motion.div
                initial={false}
                animate={{ y: isRevealed ? [0, -24, 0] : 0 }}
                transition={{
                  duration: instant ? 0 : 1.15,
                  times: [0, 0.45, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative w-full"
              >
                {/* Slow turn into place — rest is turned slightly,
                    reveal straightens it (a turn, not a flip). */}
                <motion.div
                  initial={false}
                  animate={{ rotateY: isRevealed ? 0 : -16 }}
                  transition={{ duration: instant ? 0 : 1.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative w-full"
                >
                  {/* FRONT — the invitation (unchanged content) */}
                  <motion.div
                    aria-hidden={!isRevealed}
                    initial={false}
                    animate={{
                      opacity: isRevealed ? 1 : 0,
                      y: isRevealed ? 0 : 28,
                    }}
                    transition={{ duration: instant ? 0 : 0.95, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full"
                  >
                    <InvitationCard site={site} isOpen={isRevealed} />
                  </motion.div>

                  {/* BACK — blurred moonlit photo + crescent medallion */}
                  <motion.div
                    aria-hidden={isRevealed}
                    initial={false}
                    animate={{
                      opacity: isRevealed ? 0 : 1,
                      y: isRevealed ? -14 : 0,
                    }}
                    transition={{ duration: instant ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <CardBack site={site} />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Starlight burst on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && (
                <StarBurstCanvas
                  burstKey={burstKey}
                  burstOrigin={{ x: 0.5, y: 0.45 }}
                  className="z-20"
                />
              )}
            </div>

            {/* Cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="er-font-display relative z-10 mt-4 inline-block rounded-full bg-[#F4F7FA]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#2E3A4A]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#16202E]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
