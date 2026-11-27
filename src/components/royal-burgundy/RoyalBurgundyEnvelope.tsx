// Royal Burgundy invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (blurred burgundy photograph
// under a deep-burgundy wash, burgundy-and-gold medallion with the
// couple monogram, "Tap to Reveal") behind closed burgundy velvet
// curtains; tap parts the curtains and the card rises from below
// with a gentle tilt, the back fades away and the FRONT (the
// existing invitation content, unchanged) rises into place with a
// rose-gold light sweep and a cherry-blossom burst. Tap again
// settles it back and the curtains close. prefers-reduced-motion:
// instant swap, no ambient animation, no petals. The hanging vinyl
// music medallion below the card is unchanged (the template's music
// toggle).
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BotanicalCardDivider, CherryBlossomSprig } from "./Decor";
import {
  COVER_IMAGE_URL,
  DETAIL_IMAGE_URL,
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
      className={`relative mx-auto w-full overflow-hidden bg-[#F7F0E4] px-4 py-5 text-center text-[#570F20] transition-shadow duration-700 sm:px-6 sm:py-7 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(32,6,13,0.52),0_4px_12px_rgba(32,6,13,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(32,6,13,0.45)]"
      }`}
    >
      {/* Handmade cotton parchment fibers texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url(/images/themes/royal-burgundy/parchment.jpg)` }}
      />

      {/* Fine double antique rose-gold & burgundy letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#B58A72]/75 sm:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#923C4B]/30 sm:inset-[15px]"
      />

      {/* Delicate corner botanical ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#923C4B]/65 sm:top-3.5 sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#923C4B]/65 sm:top-3.5 sm:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#923C4B]/65 sm:bottom-3.5 sm:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#923C4B]/65 sm:right-3.5 sm:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-2 sm:py-3">
        <p className="rb-font-display text-[9px] tracking-[0.26em] text-[#762637] uppercase sm:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="rb-font-display mt-3 text-xl leading-none font-normal tracking-[0.18em] text-[#570F20] uppercase sm:mt-4 sm:text-[1.75rem]">
          {site.content.partnerA}
        </h2>
        <span className="rb-font-editorial my-1 text-base italic text-[#762637] sm:text-lg">
          &amp;
        </span>
        <h2 className="rb-font-display text-xl leading-none font-normal tracking-[0.18em] text-[#570F20] uppercase sm:text-[1.75rem]">
          {site.content.partnerB}
        </h2>

        <BotanicalCardDivider className="my-2.5 h-8 w-24 sm:my-3.5 sm:h-10 sm:w-28" />

        <p className="rb-font-display text-[9px] tracking-[0.24em] text-[#570F20] uppercase sm:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="rb-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#762637] uppercase sm:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VinylPlayer — the hanging vinyl music medallion (the template's    */
/* music toggle). Unchanged. The track is "Clair de Lune — Chamber   */
/* Waltz" (built-in synth; a configured music URL plays through the  */
/* same engine instead).                                              */
/* ------------------------------------------------------------------ */

function VinylPlayer({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Delicate metallic chain hanging the vinyl medallion below the card */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 76"
        className="-mt-10 -mb-2 h-16 w-28 drop-shadow-[0_4px_5px_rgba(24,4,9,0.45)] sm:-mt-12 sm:h-20 sm:w-32"
        fill="none"
      >
        <defs>
          <linearGradient id="silverChain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F3F0" />
            <stop offset="45%" stopColor="#A9A39F" />
            <stop offset="75%" stopColor="#5D5653" />
            <stop offset="100%" stopColor="#DED8D3" />
          </linearGradient>
        </defs>
        {/* Left chain links */}
        <path
          d="M18 2 C25 22, 42 46, 57 62"
          stroke="url(#silverChain)"
          strokeWidth="4.2"
          strokeDasharray="6 3.5"
          strokeLinecap="round"
        />
        <path
          d="M18 2 C25 22, 42 46, 57 62"
          stroke="#2A2424"
          strokeWidth="1.2"
          strokeDasharray="2 7.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Right chain links */}
        <path
          d="M102 2 C95 22, 78 46, 63 62"
          stroke="url(#silverChain)"
          strokeWidth="4.2"
          strokeDasharray="6 3.5"
          strokeLinecap="round"
        />
        <path
          d="M102 2 C95 22, 78 46, 63 62"
          stroke="#2A2424"
          strokeWidth="1.2"
          strokeDasharray="2 7.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Pendant bail clasp */}
        <rect
          x="53"
          y="58"
          width="14"
          height="16"
          rx="5"
          fill="url(#silverChain)"
          stroke="#403938"
          strokeWidth="1.2"
        />
        <circle cx="60" cy="65" r="2.2" fill="#2A2424" />
      </svg>

      {/* Circular Black Metallic Vinyl Medallion Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPlaying}
        aria-label={
          isPlaying
            ? "Pause wedding music (Clair de Lune — Chamber Waltz)"
            : "Play wedding music (Clair de Lune — Chamber Waltz)"
        }
        className="group relative flex h-28 w-28 items-center justify-center rounded-full p-[5px] shadow-[0_16px_30px_-8px_rgba(24,5,10,0.6),0_4px_10px_rgba(24,5,10,0.35)] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#570F20] sm:h-32 sm:w-32"
        style={{
          background:
            "conic-gradient(from 130deg, #E5E0DC, #7E7673, #F8F6F4, #4A4342, #CBC4BF, #655E5B, #E5E0DC)",
        }}
      >
        {/* Inner stepped silver rim */}
        <span
          aria-hidden="true"
          className="relative flex h-full w-full items-center justify-center rounded-full border border-[#2B2525]/80 bg-[#0F0C0D] p-[3px]"
        >
          {/* Rotating Vinyl Grooves Disc */}
          <span
            aria-hidden="true"
            className={`absolute inset-[3px] rounded-full ${isPlaying ? "rb-animate-vinyl-spin" : ""}`}
            style={{
              background: `
                repeating-radial-gradient(
                  circle at center,
                  #141112 0px,
                  #141112 1.5px,
                  #262123 2px,
                  #0B090A 3px
                )
              `,
            }}
          >
            {/* Realistic vinyl diagonal studio sheen */}
            <span
              className="absolute inset-0 rounded-full opacity-55"
              style={{
                background:
                  "conic-gradient(from 30deg, transparent 0deg, rgba(255,255,255,0.22) 32deg, transparent 68deg, transparent 180deg, rgba(255,255,255,0.18) 212deg, transparent 250deg)",
              }}
            />
          </span>

          {/* Curved PLAY / PAUSE engraved serif text along lower arc */}
          <svg
            aria-hidden="true"
            viewBox="0 0 120 120"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <path id="vinylTextArc" d="M 21,67 A 40,40 0 0,0 99,67" />
            </defs>
            <text
              fill="#F2ECE4"
              fontSize="11.5"
              letterSpacing="5.5"
              className="rb-font-display"
              textAnchor="middle"
            >
              <textPath href="#vinylTextArc" startOffset="50%">
                {isPlaying ? "PAUSE" : "PLAY"}
              </textPath>
            </text>
          </svg>

          {/* Center Metallic Spindle / Play-Pause Cap */}
          <span
            className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#FFFFFF]/55 shadow-[inset_0_2px_4px_rgba(255,255,255,0.55),0_4px_10px_rgba(0,0,0,0.7)] transition-transform duration-200 group-hover:scale-105 sm:h-11 sm:w-11"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #F7F4F1 0%, #B7B0AC 52%, #595250 100%)",
            }}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 fill-[#22181A] text-[#22181A]" />
            ) : (
              <Play className="ml-0.5 h-4 w-4 fill-[#22181A] text-[#22181A]" />
            )}
          </span>
        </span>
      </button>

      <span className="rb-font-editorial mt-3 text-xs tracking-[0.18em] text-[#762637]/85 uppercase">
        {isPlaying ? "Now Playing · Tap to Pause" : "Tap to Play Wedding Waltz"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — blurred burgundy photograph under a deep-burgundy     */
/* wash, burgundy-and-gold medallion with the couple monogram, tap  */
/* hint. Same footprint as the front (absolute inset-0 of the       */
/* reveal box), so the reveal never changes the layout.              */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#570F20] px-4 py-6 text-center shadow-[0_10px_24px_-8px_rgba(32,6,13,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred burgundy photograph — softened into a backdrop */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(12px) brightness(0.72) saturate(1.15)", transform: "scale(1.18)" }}
      />

      {/* Deep-burgundy wash so the monogram stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(87,15,32,0.25) 0%, rgba(87,15,32,0.62) 100%)",
        }}
      />

      {/* Fine double rose-gold border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#B58A72]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#F7F0E4]/25 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="rb-font-display text-[9px] tracking-[0.34em] text-[#F7F0E4] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Burgundy-and-gold medallion with the couple monogram */}
        <div
          aria-hidden="true"
          className="relative mt-4 flex h-24 w-24 items-center justify-center rounded-full @min-[29.375rem]:mt-5 @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #8A2A3D 0%, #570F20 45%, #2A0510 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -4px 10px rgba(32,6,13,0.5), 0 10px 22px -6px rgba(32,6,13,0.55)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#B58A72]/70" />
          <div className="absolute inset-[7px] rounded-full border border-[#F7F0E4]/20" />
          <span className="rb-font-display relative text-[1.35rem] leading-none font-medium tracking-[0.06em] text-[#F7F0E4] @min-[29.375rem]:text-[1.5rem]">
            {initials(site)}
          </span>
        </div>

        <BotanicalCardDivider className="mt-4 h-8 w-24 @min-[29.375rem]:mt-5 @min-[29.375rem]:h-10 @min-[29.375rem]:w-28" />

        <p className="rb-font-display mt-3 text-[9px] tracking-[0.3em] text-[#F7F0E4] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BurgundyAmbience — soft rose-gold light behind the card.         */
/* Transform + opacity only (GPU-friendly). Skipped under reduced    */
/* motion.                                                            */
/* ------------------------------------------------------------------ */

function BurgundyAmbience() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -left-10 top-6 h-44 w-44 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(181,138,114,0.5) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
      <motion.div
        className="absolute -right-8 bottom-8 h-52 w-52 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(146,60,75,0.5) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -18, 0], y: [0, 14, 0] }}
        transition={{ duration: 13, repeat: Infinity, repeatType: "mirror", ease: [0.45, 0.05, 0.55, 0.95] }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VelvetCurtains — two burgundy velvet panels over the card at     */
/* rest. On reveal they part (slide left / right) and fade, like a  */
/* theatre curtain opening on the invitation. Renders nothing      */
/* under reduced motion (the back simply swaps).                    */
/* ------------------------------------------------------------------ */

function VelvetCurtains({ isRevealed }: { isRevealed: boolean }) {
  const panelStyle: React.CSSProperties = {
    background:
      "linear-gradient(90deg, rgba(42,5,16,0.96) 0%, rgba(87,15,32,0.94) 30%, rgba(118,38,55,0.94) 55%, rgba(87,15,32,0.94) 80%, rgba(42,5,16,0.96) 100%)",
  };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      {/* Left curtain */}
      <motion.div
        className="absolute inset-y-0 left-0 w-1/2"
        style={panelStyle}
        initial={false}
        animate={isRevealed ? { x: "-105%", opacity: 0 } : { x: "0%", opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Vertical velvet folds */}
        <div className="absolute inset-y-0 left-1/4 w-px bg-black/25" />
        <div className="absolute inset-y-0 left-2/4 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-black/25" />
        <div className="absolute inset-y-0 right-0 w-[3px] bg-[#B58A72]/60" />
      </motion.div>
      {/* Right curtain */}
      <motion.div
        className="absolute inset-y-0 right-0 w-1/2"
        style={panelStyle}
        initial={false}
        animate={isRevealed ? { x: "105%", opacity: 0 } : { x: "0%", opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-y-0 left-1/4 w-px bg-black/25" />
        <div className="absolute inset-y-0 left-2/4 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-black/25" />
        <div className="absolute inset-y-0 left-0 w-[3px] bg-[#B58A72]/60" />
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BlossomBurst — on reveal, cherry-blossom petals drift from the  */
/* card and fade. Renders nothing under reduced motion.              */
/* ------------------------------------------------------------------ */

const BURST_PETALS = [
  { angle: -90, dist: 110, size: 20, color: "#F4C6C6", delay: 0.05 },
  { angle: -45, dist: 96, size: 16, color: "#E8A0A0", delay: 0.1 },
  { angle: 0, dist: 110, size: 20, color: "#D98C8C", delay: 0.05 },
  { angle: 45, dist: 96, size: 16, color: "#F4C6C6", delay: 0.1 },
  { angle: 90, dist: 110, size: 20, color: "#E8A0A0", delay: 0.05 },
  { angle: 135, dist: 96, size: 16, color: "#D98C8C", delay: 0.1 },
  { angle: 180, dist: 110, size: 20, color: "#F4C6C6", delay: 0.05 },
  { angle: -135, dist: 96, size: 16, color: "#E8A0A0", delay: 0.1 },
];

function BlossomBurst({ burstKey }: { burstKey: number }) {
  if (burstKey === 0) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
    >
      {BURST_PETALS.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const x = Math.cos(rad) * p.dist;
        const y = Math.sin(rad) * p.dist;
        return (
          <motion.span
            key={`${burstKey}-${i}`}
            className="absolute rounded-[50%_50%_50%_50%/60%_60%_40%_40%]"
            style={{ width: p.size, height: p.size * 1.25, background: p.color }}
            initial={{ x: 0, y: 0, scale: 0.2, opacity: 0.95, rotate: p.angle }}
            animate={{ x, y, scale: 1, opacity: 0, rotate: p.angle + 40 }}
            transition={{ duration: 1.1, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardReveal — "Curtain part". At rest the BACK shows behind      */
/* closed burgundy velvet curtains. Tap parts the curtains and the   */
/* card rises from below with a gentle tilt, the back fades away    */
/* and the FRONT rises into place with a rose-gold light sweep and  */
/* a cherry-blossom burst. Tap again settles it back and the        */
/* curtains close.                                                   */
/* ------------------------------------------------------------------ */

export default function RoyalBurgundyEnvelope({
  site,
  isMusicPlaying,
  onToggleMusic,
}: {
  site: WeddingSite;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}) {
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
      {/* Corner Cherry Blossom Sprigs */}
      <CherryBlossomSprig position="top-left" />
      <CherryBlossomSprig position="bottom-right" />

      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Burgundy Card + Sliding Letterpress Card */}
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
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#570F20]"
          >
            {/* Ambient rose-gold light behind the card */}
            {!instant && <BurgundyAmbience />}

            {/* Reveal scene — perspective on the wrapper. The FRONT
                is in flow (it defines the box height); the BACK is
                absolute inset-0. Rest = back visible, front hidden;
                revealed = front visible, back hidden. */}
            <div className="relative z-10 mx-auto w-[88%] @min-[29.375rem]:w-[80%]" style={{ perspective: 1200 }}>
              {/* Soft rose-gold glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(181,138,114,0.4) 0%, rgba(247,240,228,0.28) 55%, transparent 75%)",
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

                {/* BACK — blurred burgundy photo + burgundy medallion */}
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

              {/* Burgundy velvet curtains — part on reveal */}
              {!instant && <VelvetCurtains isRevealed={isRevealed} />}

              {/* Rose-gold light sweep across the card on reveal */}
              {isRevealed && !instant && (
                <motion.div
                  key={sweepKey}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 0%, rgba(181,138,114,0.5) 50%, transparent 100%)",
                  }}
                  initial={{ x: "-120%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              )}

              {/* Cherry-blossom burst on reveal. Renders nothing under
                  reduced motion. */}
              {!instant && <BlossomBurst burstKey={burstKey} />}
            </div>

            {/* Cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="rb-font-display relative z-10 mt-4 inline-block rounded-full bg-[#F7F0E4]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#762637]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#570F20]"
            >
              {isRevealed ? "Tap to Flip Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>

          {/* Hanging Metallic Vinyl Record Music Player */}
          <div className="relative z-30 mt-3 flex justify-center">
            <VinylPlayer isPlaying={isMusicPlaying} onToggle={onToggleMusic} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
