// Ocean Pearl envelope — interactive aqua envelope with a live
// shell seal (SVG scallop + monogram, never baked into the artwork)
// and the sliding pearl invitation card (tap the seal to break it
// and reveal / tuck the card back). No music on this template —
// the seal is the interaction.
"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { ShellSeal, WaveDivider } from "./Decor";
import {
  ENVELOPE_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sliding pearl invitation card                 */
/* ------------------------------------------------------------------ */

function InvitationCard({ site, isOpen }: { site: WeddingSite; isOpen: boolean }) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-white px-4 py-3 text-center text-[#0E3A45] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(14,58,69,0.52),0_4px_12px_rgba(14,58,69,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(14,58,69,0.45)]"
      }`}
    >
      {/* Pearl paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.4) 0%, rgba(216, 237, 239, 0.55) 100%)",
        }}
      />

      {/* Fine double aqua & deep-sea border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#2E8B9A]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#0E3A45]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#0E3A45]/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#0E3A45]/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#0E3A45]/55"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#0E3A45]/55"
      />

      {/* Editable HTML Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="op-font-display text-[9px] font-semibold tracking-[0.26em] text-[#1F6B78] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="op-font-display mt-2 text-[17px] leading-none font-bold tracking-[0.08em] break-words text-[#0E3A45] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.1em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.06em]">
          {site.content.partnerA}
        </h2>
        <span className="op-font-body my-0.5 text-base text-[#2E8B9A] italic @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="op-font-display text-[17px] leading-none font-bold tracking-[0.08em] break-words text-[#0E3A45] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.1em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.06em]">
          {site.content.partnerB}
        </h2>

        <WaveDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:mt-6 @min-[29.375rem]:mb-3 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="op-font-display text-[9px] font-semibold tracking-[0.24em] text-[#0E3A45] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="op-font-display mt-1 text-[8.5px] font-semibold tracking-[0.22em] text-[#1F6B78] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ShellSeal — the live shell-seal open button. Tapping it "breaks"  */
/* the seal (it tilts and fades) and the card slides up; tapping     */
/* again reseals it. The monogram is live HTML text, never baked in. */
/* ------------------------------------------------------------------ */

function ShellSealButton({ site, isOpen, onToggle }: { site: WeddingSite; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={isOpen}
        aria-label={
          isOpen
            ? "Reseal the shell-seal envelope"
            : "Break the shell seal and open the envelope"
        }
        animate={isOpen ? { rotate: -8, scale: 0.94 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#F7FBFC] shadow-[0_16px_30px_-8px_rgba(14,58,69,0.6),0_4px_10px_rgba(14,58,69,0.35)] ring-2 ring-[#2E8B9A]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45]"
      >
        <ShellSeal className="absolute inset-0 h-full w-full" />
        {/* Live monogram overlaid in the shell's centre */}
        <span className="op-font-display relative z-10 mt-5 text-[1.05rem] font-bold tracking-[0.06em] text-[#0E3A45]">
          {initials(site)}
        </span>
        {/* Crack line once broken */}
        {isOpen && (
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-1/2 z-10 h-px rotate-[-14deg] bg-[#0E3A45]/50"
          />
        )}
      </motion.button>

      <span className="op-font-body mt-3 text-xs font-medium tracking-[0.18em] text-[#1F6B78]/85 uppercase">
        {isOpen ? "Tap to Reseal" : "Tap the Shell to Open"}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* EnvelopeInvitation                                                */
/* ------------------------------------------------------------------ */

export default function OceanPearlEnvelope({ site }: { site: WeddingSite }) {
  const [isCardLifted, setIsCardLifted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleEnvelope = () => {
    setIsCardLifted((prev) => !prev);
  };

  return (
    <div className="relative px-4 pt-16 pb-10">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Interactive Aqua Envelope + Sliding Pearl Card */}
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
                : "Open shell-seal envelope and slide up wedding invitation card"
            }
            onClick={toggleEnvelope}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleEnvelope();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E3A45]"
          >
            {/* Envelope Container preserving the 4:3 geometry of the aqua envelope */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#F6F4F5] shadow-[0_24px_34px_rgba(14,58,69,0.28)]">
              {/* Layer 1: Aqua envelope artwork */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ENVELOPE_IMAGE_URL}
                alt="Aqua wedding envelope with a scalloped pocket edge"
                referrerPolicy="no-referrer"
                className="pointer-events-none block h-full w-full object-cover"
              />

              {/* Layer 2: Interactive Sliding Pearl Invitation Card */}
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
                className="absolute top-[25%] left-1/2 z-10 w-[47%] -translate-x-1/2 @min-[22rem]:top-[22%] @min-[24rem]:top-[25%] @min-[29.375rem]:top-[25%]"
              >
                <InvitationCard site={site} isOpen={isCardLifted} />
              </motion.div>

              {/* Layer 3: REAL scalloped pocket — the envelope photo
                  rendered a second time ABOVE the card, clipped to
                  the pocket's shape, so the card is physically
                  tucked inside at rest.
                  Geometry (eye-measured from ocean-pearl-detail.jpg,
                  1200x900, envelope spans x 0-100%, y ~6-94%): the
                  flap's scalloped edge runs ~35% at the far sides,
                  scallop peaks ~38-41% and troughs ~48-52%, dipping
                  to ~55% at the centre trough; the diagonal pocket
                  creases run from ~(27%, 47%) to the bottom corners.
                  The clip follows the TRUE scallops outside the
                  card's x-span (26.5%-73.5%) and dips smoothly to
                  64.5% at centre across the card — the same proven
                  trick as Golden Hour's flat clip vs its ^-shaped
                  true edge: the card's visible boundary reads as
                  the pocket mouth, with the scalloped flap visible
                  on both sides of the card.
                  The card is sized by CONTAINER width (@container on
                  the outer wrapper — never viewport `sm:` — so the
                  editor's Mobile (390px) preview gets the mobile card
                  and desktop (490px container) gets the larger card),
                  in FOUR bands, because the card's content is fixed
                  px while the 4:3 container shrinks with the viewport:
                  - <352px: compact card (@max-[22rem]: 15px names),
                    top 25% — 320px: Partner B bottom ~61.7%, divider
                    top ~70.8% (clip 64.5% sits between them).
                  - 352–383px: small card (17px names), top 22% —
                    352px: Partner B bottom ~62.9%, divider top
                    ~69.7%.
                  - 384–469px: small card, top 25% — 384px: Partner B
                    bottom ~62.5%, divider top ~68.8%.
                  - >=470px: large card (22px names, py-5), top 25% —
                    470px: Partner B bottom ~63.3%, divider top
                    ~70.4%; 490px: Partner B bottom ~61.7%, divider
                    top ~68.5%.
                  WHY the large card starts at 470px, not 384px: its
                  content is ~270px tall and the names WRAP below
                  ~443px container width, so at 430px viewport
                  (398x299 container) it would span 25%→~115% — only
                  PARTNER A would peek and the location line would be
                  clipped at the container's bottom edge when open
                  (the proven 430px trap — see Golden Hour). The
                  large card only fits once Partner B bottom (25% +
                  ~135px) clears the 64.5% pocket line with margin,
                  i.e. container >=470px (63.3% there, 61.7% at
                  490px). In the 352–469 bands the small/compact card
                  is used. ALL of these margins are ESTIMATES from
                  the image measurement + Golden Hour's empirical
                  card heights, NOT live-measured — the coordinator
                  must live-verify at 390px / 430px / desktop before
                  calling this done. On tap the clip's top edge drops
                  to ~97% (the pocket opens) while the card lifts
                  48px, so divider + date + location are fully
                  revealed with no top clipping. */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{
                  clipPath: isCardLifted
                    ? "polygon(0% 96%, 25% 97.5%, 75% 97.5%, 100% 96%, 100% 100%, 0% 100%)"
                    : "polygon(0% 35%, 4% 39%, 8% 36%, 12% 40%, 16% 37%, 20% 41%, 24% 44%, 26.5% 47%, 32% 55%, 38% 60%, 44% 63%, 50% 64.5%, 56% 63%, 62% 60%, 68% 55%, 73.5% 47%, 76% 44%, 80% 41%, 84% 37%, 88% 40%, 92% 36%, 96% 39%, 100% 35%, 100% 100%, 0% 100%)",
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
            <p className="op-font-display mt-1 text-center text-[10px] font-semibold tracking-[0.26em] text-[#1F6B78]/80 uppercase transition-colors group-hover:text-[#0E3A45]">
              {isCardLifted ? "Tap Envelope to Tuck Card" : "Tap Envelope to Reveal Card"}
            </p>
          </div>

          {/* Live Shell Seal */}
          <div className="relative z-30 mt-4 flex justify-center">
            <ShellSealButton site={site} isOpen={isCardLifted} onToggle={toggleEnvelope} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
