// Marble Luxe invitation card — NO envelope. The card itself is the
// reveal: at rest you see its BACK as TWO white-marble panels
// (DOUBLE-DOOR UNFOLD); tap swings the panels open outward on
// hinges at the outer left and right edges (rotateY) to reveal the
// FRONT (the existing invitation content, unchanged) beneath. Tap
// again swings them closed. This is two panels on edge hinges —
// NOT a single card flipping 180 degrees. Slow gold motes drift
// behind the card; a gold particle burst + shimmer land the open.
// prefers-reduced-motion: instant swap, no ambient animation, no
// particles. No music on this template.
"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { GoldDivider } from "./Decor";
import { formatCardDate, initials, locationLabel } from "./tokens";
import { GoldDustCanvas, playGoldShimmer } from "./CinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the white invitation card (front face, kept      */
/* as-is: same markup, typography and colours as before).            */
/* ------------------------------------------------------------------ */

function InvitationCard({
  site,
  isOpen,
  shimmerKey = 0,
}: {
  site: WeddingSite;
  isOpen: boolean;
  shimmerKey?: number;
}) {
  return (
    <div
      className={`relative mx-auto w-full overflow-hidden bg-white px-4 py-3 text-center text-[#1F2937] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(31,41,55,0.4),0_4px_12px_rgba(31,41,55,0.18)]"
          : "shadow-[0_10px_24px_-8px_rgba(31,41,55,0.35)]"
      }`}
    >
      {/* Fine double gold hairline border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#B49A70]/70 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#6B7280]/25 @min-[29.375rem]:inset-[15px] @max-[22rem]:inset-[7px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#6B7280]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#6B7280]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#6B7280]/60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#6B7280]/60"
      />

      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="ml-font-display text-[9px] font-medium tracking-[0.26em] text-[#8C7355] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="ml-font-display mt-2 text-[17px] leading-none font-medium tracking-[0.1em] break-words text-[#1F2937] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="ml-font-editorial my-0.5 text-base italic text-[#8C7355] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="ml-font-display text-[17px] leading-none font-medium tracking-[0.1em] break-words text-[#1F2937] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <GoldDivider className="mt-6 h-6 w-24 @min-[22rem]:mt-10 @min-[29.375rem]:mt-12 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:h-5" />

        <p className="ml-font-display mt-2 text-[9px] font-medium tracking-[0.24em] text-[#1F2937] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="ml-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#8C7355] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time gold shimmer sweep across the card on reveal.
          Remounts (key) on every open so it replays; unmounted when
          the doors close again. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(212,175,105,0.45) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card back — two marble door panels. Each panel is one half of    */
/* the card back: white marble with soft grey veining (the vein     */
/* layer is blurred, the monogram stays crisp), a fine gold         */
/* hairline, and half of the live gold monogram — the two halves    */
/* read as one monogram across the centre seam while closed. The    */
/* left panel hinges on its outer left edge, the right panel on     */
/* its outer right edge; opening swings their free (centre) edges  */
/* out toward the viewer.                                           */
/* ------------------------------------------------------------------ */

const MARBLE_VEIN =
  "linear-gradient(160deg, transparent 0%, transparent 42%, rgba(120,120,125,0.18) 45%, rgba(120,120,125,0.05) 48%, transparent 52%, transparent 70%, rgba(120,120,125,0.14) 73%, rgba(120,120,125,0.04) 76%, transparent 80%), linear-gradient(200deg, transparent 0%, transparent 60%, rgba(120,120,125,0.12) 63%, transparent 66%)";

function DoorPanel({
  side,
  monogram,
  isOpen,
  transition,
}: {
  side: "left" | "right";
  monogram: string;
  isOpen: boolean;
  transition: Transition;
}) {
  const isLeft = side === "left";
  // Hinge at the OUTER edge; the free edge (centre seam) swings out.
  // rotateY past 90deg + backface hidden: the panel vanishes edge-on
  // instead of showing a mirrored back.
  const openAngle = isLeft ? -102 : 102;
  return (
    <motion.div
      aria-hidden="true"
      initial={false}
      animate={{ rotateY: isOpen ? openAngle : 0 }}
      transition={transition}
      style={{
        transformOrigin: isLeft ? "left center" : "right center",
        backfaceVisibility: "hidden",
      }}
      className={`absolute top-0 h-full w-1/2 overflow-hidden bg-[#FDFDFC] ${
        isLeft ? "left-0" : "right-0"
      }`}
    >
      {/* Blurred marble veining */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 blur-[2px]"
        style={{ background: MARBLE_VEIN }}
      />
      {/* Soft light wash so the back reads calm, never stark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(255,255,255,0.55) 0%, rgba(247,247,245,0.15) 100%)",
        }}
      />

      {/* Fine gold hairline frame (the seam edge carries the gold
          centre line where the two doors meet) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-2.5 border border-[#B49A70]/60 @min-[29.375rem]:inset-3 @max-[22rem]:inset-1.5 ${
          isLeft ? "border-r-0" : "border-l-0"
        }`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 w-px bg-[#B49A70]/70 ${
          isLeft ? "right-0" : "left-0"
        }`}
      />

      {/* Half of the monogram, set tight against the seam so the two
          halves read as one while the doors are closed */}
      <div
        className={`relative z-10 flex h-full items-center ${
          isLeft ? "justify-end pr-2 @min-[29.375rem]:pr-3" : "justify-start pl-2 @min-[29.375rem]:pl-3"
        }`}
      >
        <span className="ml-font-display text-[1.55rem] leading-none font-medium tracking-[0.04em] text-[#8C7355] @min-[29.375rem]:text-[1.9rem] @max-[22rem]:text-[1.3rem]">
          {monogram}
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* MarbleLuxeEnvelope — card-only double-door reveal (file and      */
/* export name kept so the Renderer import is unchanged).           */
/* ------------------------------------------------------------------ */

export default function MarbleLuxeEnvelope({ site }: { site: WeddingSite }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      // Reveal: gold burst + shimmer land the doors opening.
      setBurstKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
      playGoldShimmer();
    }
  };

  const doorTransition: Transition = instant
    ? { duration: 0 }
    : { duration: 1.05, ease: [0.22, 1, 0.36, 1] };

  // Split the "A&B" monogram across the seam: first initial on the
  // left door, "&B" on the right door.
  const mono = initials(site);
  const leftMono = mono.charAt(0);
  const rightMono = mono.slice(1);

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
            aria-expanded={isOpen}
            aria-label={
              isOpen
                ? "Close the marble double doors to hide the invitation again"
                : "Open the marble double doors to reveal the invitation"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F2937]"
          >
            {/* Slow gold motes drifting behind the card. Skipped
                under reduced motion (no animation at all). */}
            {!instant && (
              <GoldDustCanvas
                moteCount={10}
                burstKey={burstKey}
                burstOrigin={{ x: 0.5, y: 0.45 }}
                className="z-0"
              />
            )}

            {/* Double-door scene — perspective on the wrapper so the
                panels swing in 3D. The FRONT is in flow (it defines
                the box height); the two BACK panels are absolute
                inset-0 halves hinged at the outer edges. Rest =
                panels closed, covering the front; open = panels
                swung out past 90deg (backface-hidden, so they
                vanish edge-on) and the front shows. The doors layer
                is pointer-events-none: the outer button owns the
                tap, so tapping the revealed front closes the doors
                again. At 102deg a panel's on-screen x-extent is
                ~cos(102deg) of its half-width, so nothing spills
                past the card at 320px. */}
            <div
              className="relative z-10 mx-auto w-[92%] @min-[29.375rem]:w-[90%]"
              style={{ perspective: 1400 }}
            >
              {/* Soft gold glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212,175,105,0.45) 0%, rgba(180,154,112,0.3) 55%, transparent 75%)",
                }}
              />

              {/* FRONT — the invitation (unchanged content) */}
              <div aria-hidden={!isOpen} className="relative w-full">
                <InvitationCard
                  site={site}
                  isOpen={isOpen}
                  shimmerKey={isOpen && !instant ? shimmerKey : 0}
                />
              </div>

              {/* BACK — the two marble doors + centre seam */}
              <div
                aria-hidden={isOpen}
                className="pointer-events-none absolute inset-0 z-20"
              >
                <DoorPanel
                  side="left"
                  monogram={leftMono}
                  isOpen={isOpen}
                  transition={doorTransition}
                />
                <DoorPanel
                  side="right"
                  monogram={rightMono}
                  isOpen={isOpen}
                  transition={doorTransition}
                />

                {/* Centre seam — thin gold line + diamond where the
                    doors meet; fades as they open. */}
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: instant ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 bottom-0 left-1/2 z-30 w-px -translate-x-1/2 bg-[#B49A70]"
                />
                <motion.div
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.6 : 1 }}
                  transition={{ duration: instant ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-1/2 left-1/2 z-30 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#B49A70] shadow-[0_0_0_3px_rgba(253,253,252,0.9)]"
                />

                {/* "Tap to reveal" on the back itself, centred low
                    across the seam; fades as the doors open. */}
                <motion.p
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: instant ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="ml-font-display absolute inset-x-0 bottom-[9%] z-30 text-center text-[9px] font-medium tracking-[0.3em] text-[#8C7355] uppercase @min-[29.375rem]:text-[10px]"
                >
                  Tap to Reveal
                </motion.p>

                {/* Slow sheen drifting across the closed doors. */}
                {!instant && !isOpen && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-y-0 z-20 w-1/4"
                    animate={{ x: ["-120%", "480%"] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        transform: "skewX(-12deg)",
                        background:
                          "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)",
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Cue — on a soft pill so it stays legible */}
            <motion.p
              key={isOpen ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="ml-font-display relative z-10 mt-4 inline-block rounded-full bg-white/80 px-4 py-1 text-center text-[10px] font-medium tracking-[0.26em] text-[#8C7355]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#1F2937]"
            >
              {isOpen ? "Tap to Close the Doors" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
