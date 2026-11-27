// Emerald Royale invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (blurred emerald photograph
// under a deep-emerald wash, gold wax-seal medallion with the couple
// monogram, "Tap to Reveal"); tap breaks the gold wax seal — it
// splits apart — and the card rises from below with a gentle tilt,
// the back fades away and the FRONT (the existing invitation
// content, unchanged) rises into place with a gold light sweep and
// a gold sparkle burst. Tap again settles it back and the seal
// reforms. prefers-reduced-motion: instant swap, no ambient
// animation, no sparkles. No music on this template — the card is
// the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { BotanicalCardDivider, GoldLeafSprig } from "./Decor";
import {
  COVER_IMAGE_URL,
  WAX_SEAL_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the ivory letterpress card (FRONT, unchanged)    */
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
/* SealMedallion — the gold wax seal. On reveal it splits into two   */
/* halves that slide apart and fade (the seal breaks); on flip-back  */
/* it reforms. The monogram is live HTML text, never baked in.       */
/* ------------------------------------------------------------------ */

function SealMedallion({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-24 w-24 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
      style={{
        filter:
          "drop-shadow(0 10px 22px rgba(4,26,19,0.55))",
      }}
    >
      {/* Left half of the seal */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ clipPath: "inset(0 50% 0 0)" }}
        initial={false}
        animate={
          isOpen
            ? { x: -16, opacity: 0, rotate: -14 }
            : { x: 0, opacity: 1, rotate: 0 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WAX_SEAL_URL}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
      {/* Right half of the seal */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ clipPath: "inset(0 0 0 50%)" }}
        initial={false}
        animate={
          isOpen
            ? { x: 16, opacity: 0, rotate: 14 }
            : { x: 0, opacity: 1, rotate: 0 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WAX_SEAL_URL}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
      {/* Live monogram over the seal's centre (fades as it breaks) */}
      <motion.span
        className="er-font-display absolute inset-0 z-10 flex items-center justify-center text-[1.05rem] font-medium tracking-[0.06em] text-[#FFF8EC]"
        style={{ textShadow: "0 1px 4px rgba(4,26,19,0.6)" }}
        initial={false}
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {initials(site)}
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred emerald photograph under a deep-emerald wash,  */
/* gold wax-seal medallion with the couple monogram, tap hint. Same  */
/* footprint as the front (absolute inset-0 of the reveal box), so   */
/* the reveal never changes the layout.                               */
/* ------------------------------------------------------------------ */

function CardBack({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#0B3D2E] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(4,26,19,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred emerald photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.72) saturate(1.15)", transform: "scale(1.18)" }}
      />

      {/* Deep-emerald wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(11,61,46,0.25) 0%, rgba(11,61,46,0.62) 100%)",
        }}
      />

      {/* Fine double antique-gold border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C9A227]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#F7F3E8]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="er-font-display text-[9px] tracking-[0.34em] text-[#F7F3E8] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        <div className="relative mt-4 @min-[29.375rem]:mt-5">
          <SealMedallion site={site} isOpen={isOpen} />
        </div>

        <BotanicalCardDivider className="mt-4 h-6 w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="er-font-display mt-3 text-[9px] tracking-[0.3em] text-[#F7F3E8] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EmeraldAmbience — soft gold light + gold-leaf glow behind the     */
/* card. Transform + opacity only (GPU-friendly). Skipped under      */
/* reduced motion.                                                    */
/* ------------------------------------------------------------------ */

function EmeraldAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,39,0.5) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(20,84,61,0.5) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GoldSparkleBurst — on reveal, gold sparkles rise from the card   */
/* and fade, like gold leaf catching the light. Renders nothing     */
/* under reduced motion.                                              */
/* ------------------------------------------------------------------ */

const BURST_SPARKLES = [
  { x: -70, y: -120, size: 7, delay: 0.05, dur: 1.1 },
  { x: -40, y: -150, size: 9, delay: 0.12, dur: 1.25 },
  { x: -12, y: -110, size: 6, delay: 0.08, dur: 1.0 },
  { x: 14, y: -160, size: 10, delay: 0.05, dur: 1.3 },
  { x: 42, y: -125, size: 7, delay: 0.15, dur: 1.1 },
  { x: 68, y: -145, size: 8, delay: 0.1, dur: 1.2 },
  { x: 92, y: -105, size: 6, delay: 0.18, dur: 1.0 },
  { x: -95, y: -135, size: 7, delay: 0.2, dur: 1.1 },
];

function GoldSparkleBurst({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      {BURST_SPARKLES.map((s, i) => (
        <motion.span
          key={`${burstKey}-${i}`}
          className="absolute rotate-45 rounded-[2px]"
          style={{
            width: s.size,
            height: s.size,
            background: "#C9A227",
            boxShadow: "0 0 10px 3px rgba(201,162,39,0.7)",
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
          animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: s.dur, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Seal-break rise". At rest the BACK shows. Tap      */
/* breaks the gold wax seal (it splits apart) and lifts the card    */
/* from below with a gentle tilt, the back fades away and the FRONT  */
/* rises into place with a gold light sweep and a gold sparkle      */
/* burst. Tap again settles it back and the seal reforms.            */
/* ------------------------------------------------------------------ */

export default function EmeraldRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [sweepKey, setSweepKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      setBurstKey((k) => k + 1);
      setSweepKey((k) => k + 1);
    }
  };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      {/* Corner Gold-Leaf Sprigs */}
      <GoldLeafSprig position="top-left" />
      <GoldLeafSprig position="bottom-right" />

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
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D2E]"
          >
            {/* Ambient gold light behind the card */}
            {!instant && <EmeraldAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft gold glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(201,162,39,0.4) 0%, rgba(247,243,232,0.28) 55%, transparent 75%)",
                }}
              />

              {/* Rise + gentle tilt lift on reveal */}
              <motion.div
                initial={false}
                animate={{
                  y: isRevealed ? [0, -26, 0] : 0,
                  rotateX: isRevealed ? [0, 7, 0] : 0,
                }}
                transition={{
                  duration: instant ? 0 : 1.05,
                  times: [0, 0.45, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
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
                  transition={{ duration: instant ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full"
                >
                  <InvitationCard site={site} isOpen={isRevealed} />
                </motion.div>

                {/* BACK — blurred emerald photo + gold seal medallion */}
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
                  <CardBack site={site} isOpen={isRevealed} />
                </motion.div>
              </motion.div>

              {/* Gold light sweep across the card on reveal */}
              {isRevealed && !instant && (
                <motion.div
                  key={sweepKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(201,162,39,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Gold sparkle burst on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && <GoldSparkleBurst burstKey={burstKey} />}
            </div>

            {/* Cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="er-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FBF8EF]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#14543D]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#0B3D2E]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
