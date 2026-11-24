// Royal Burgundy envelope — 1:1 port of the source's
// EnvelopeInvitation.tsx + InvitationCard.tsx + VinylPlayer.tsx.
// Interactive burgundy envelope with the sliding ivory letterpress
// card (tap to reveal / tuck back), the hanging vinyl music
// medallion, and cherry-blossom corner sprigs. Same values, same
// geometry; only the data comes from the site and framer-motion
// replaces the source's `motion` package.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { BotanicalCardDivider, CherryBlossomSprig } from "./Decor";
import {
  DETAIL_IMAGE_URL,
  formatCardDate,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding ivory letterpress card                */
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
/* music toggle). The track is the source's own "Clair de Lune —      */
/* Chamber Waltz" (built-in synth; a configured music URL plays       */
/* through the same engine instead).                                  */
/* ------------------------------------------------------------------ */

function VinylPlayer({ isPlaying, onToggle }: { isPlaying: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Delicate metallic chain connecting envelope pocket fold to vinyl medallion */}
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
/* EnvelopeInvitation                                                */
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
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      {/* Corner Cherry Blossom Sprigs */}
      <CherryBlossomSprig position="top-left" />
      <CherryBlossomSprig position="bottom-right" />

      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Open Luxury Burgundy Envelope + Sliding Letterpress Card */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[490px]"
        >
          <div
            role="button"
            tabIndex={0}
            aria-expanded={isCardLifted}
            aria-label={
              isCardLifted
                ? "Tuck wedding invitation card back into the envelope"
                : "Open burgundy envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#570F20]"
          >
            {/* Envelope Container preserving the exact 4:3 geometry of the burgundy envelope */}
            <div className="relative aspect-[4/3] w-full">
              {/* Layer 1: Full Open Burgundy Embossed Envelope Backdrop */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={DETAIL_IMAGE_URL}
                alt="Deep burgundy leather-textured open wedding envelope with embossed antique rose-gold botanical ornaments"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-contain mix-blend-multiply drop-shadow-[0_24px_34px_rgba(40,10,18,0.28)]"
              />

              {/* Layer 2: Interactive Sliding Ivory Letterpress Invitation Card */}
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

              {/* Layer 3: Front Burgundy Pocket Flaps Overlay (Masks the bottom of the card so it physically slides out of the pocket!) */}
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
                  className="block h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Subtle interactive cue */}
            <p className="rb-font-display mt-1 text-center text-[10px] tracking-[0.26em] text-[#762637]/80 uppercase transition-colors group-hover:text-[#570F20]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
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
