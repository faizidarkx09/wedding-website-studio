// Desert Dusk invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (a blurred dune-toned
// surface — sand, terracotta, dusk rose — with a gold sun
// medallion carrying the couple monogram and "TAP TO REVEAL");
// tap dissolves it into fine sand grains that blow away sideways
// in the wind (directional drift + fade), the back thinning to
// nothing to reveal the FRONT (the existing invitation content,
// unchanged). Tap again and the grains settle back, re-forming
// the back. Ambient gold motes drift behind the card; a golden
// grain burst + warm shimmer land the reveal. prefers-reduced-
// motion: instant swap, no ambient animation, no particles. No
// music on this template — the card is the interaction.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { DuneDivider } from "./Decor";
import {
  COVER_IMAGE_URL,
  formatCardDate,
  initials,
  locationLabel,
} from "./tokens";
import { SandGlowCanvas } from "./DesertCinematicOpening";

/* ------------------------------------------------------------------ */
/* InvitationCard — the sand letterpress card (FRONT, unchanged)     */
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
      className={`relative mx-auto w-full overflow-hidden bg-[#FFFDF6] px-4 py-3 text-center text-[#3A2A20] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-5 @max-[22rem]:py-2 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(61,33,51,0.52),0_4px_12px_rgba(61,33,51,0.22)]"
          : "shadow-[0_10px_24px_-8px_rgba(61,33,51,0.45)]"
      }`}
    >
      {/* Warm sand paper glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.4) 0%, rgba(245, 230, 211, 0.55) 100%)",
        }}
      />

      {/* Fine double terracotta & dusk letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C2703D]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#6B3A5C]/30 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#5C4030]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#5C4030]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#5C4030]/65"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#5C4030]/65"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-3 @max-[22rem]:py-0.5">
        <p className="dd-font-display text-[9px] tracking-[0.26em] text-[#8A4A22] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="dd-font-display mt-2 text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3A2A20] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:mt-1.5 @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerA}
        </h2>
        <span className="dd-font-editorial my-0.5 text-base italic text-[#8A4A22] @min-[29.375rem]:text-lg @max-[22rem]:text-sm">
          &amp;
        </span>
        <h2 className="dd-font-display text-[17px] leading-none font-normal tracking-[0.1em] break-words text-[#3A2A20] uppercase @min-[29.375rem]:text-[22px] @min-[29.375rem]:tracking-[0.12em] @max-[22rem]:text-[15px] @max-[22rem]:tracking-[0.08em]">
          {site.content.partnerB}
        </h2>

        <DuneDivider className="mt-4 mb-2 h-6 w-24 @min-[24rem]:mt-12 @min-[29.375rem]:mt-7 @min-[29.375rem]:mb-2.5 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28 @max-[22rem]:mb-1.5 @max-[22rem]:h-5" />

        <p className="dd-font-display text-[9px] tracking-[0.24em] text-[#3A2A20] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="dd-font-display mt-1 text-[8.5px] tracking-[0.22em] text-[#8A4A22] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time warm shimmer sweep across the card on reveal.
          Remounts (key) on every reveal so it replays. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255, 214, 140, 0.5) 50%, transparent 100%)",
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
/* CardBackSurface — the card BACK, full-card size. Rendered once   */
/* per dissolve strip (each strip shows its own slice via an inner  */
/* offset), so this must be purely presentational and fill its     */
/* parent exactly. Dune-toned: blurred desert-dusk photograph       */
/* under a sand → terracotta → dusk-rose wash, gold sun medallion  */
/* with the couple monogram, "TAP TO REVEAL".                      */
/* ------------------------------------------------------------------ */

function CardBackSurface({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#E8D3B3] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(61,33,51,0.45)] @min-[29.375rem]:px-6">
      {/* Blurred dune photograph — the desert itself, out of focus */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={COVER_IMAGE_URL}
        alt=""
        referrerPolicy="no-referrer"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-60"
        style={{ filter: "blur(10px) saturate(1.15)" }}
      />
      {/* Sand → terracotta → dusk-rose wash over the blur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(245, 230, 211, 0.82) 0%, rgba(217, 160, 91, 0.55) 42%, rgba(194, 112, 61, 0.5) 68%, rgba(107, 58, 92, 0.62) 100%)",
        }}
      />
      {/* Soft light vignette — keeps the centre bright for the sun */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 42%, rgba(255, 248, 236, 0.45) 0%, rgba(61, 33, 51, 0.18) 100%)",
        }}
      />

      {/* Fine double terracotta & dusk border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#C2703D]/75 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#6B3A5C]/30 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="dd-font-display text-[9px] tracking-[0.34em] text-[#5C4030] uppercase @min-[29.375rem]:text-[10px]">
          UNDER A DESERT SKY
        </p>

        {/* Gold sun medallion — the template's own emblem, with the
            couple monogram. Not a wax seal: a flat sun disc. */}
        <div
          aria-hidden="true"
          className="relative mt-5 flex h-24 w-24 items-center justify-center rounded-full @min-[29.375rem]:h-28 @min-[29.375rem]:w-28"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #FFE9BE 0%, #D9A05B 42%, #C2703D 72%, #8A4A22 100%)",
            boxShadow:
              "inset 0 2px 6px rgba(255,255,255,0.5), inset 0 -4px 10px rgba(92, 64, 48, 0.45), 0 10px 22px -6px rgba(61,33,51,0.5)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-[#FFF8EC]/60" />
          <span className="dd-font-display relative text-[1.6rem] leading-none font-medium tracking-[0.06em] text-[#FFF8EC] drop-shadow-[0_2px_4px_rgba(61,33,51,0.5)] @min-[29.375rem]:text-[1.8rem]">
            {initials(site)}
          </span>
        </div>

        <DuneDivider className="mt-5 h-6 w-24 @min-[29.375rem]:h-8 @min-[29.375rem]:w-28" />

        <p className="dd-font-display mt-4 text-[9px] tracking-[0.3em] text-[#5C4030] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SandGrainCanvas — the dissolve itself, in fine grains. On every  */
/* burstKey increment, ~90 sand grains (gold / sand / terracotta)   */
/* spawn across the whole card and blow sideways to the right with  */
/* the desert wind, fading over ~1.5s. The loop runs only while     */
/* grains are alive. Renders nothing under reduced motion (the     */
/* parent never mounts it then).                                    */
/* ------------------------------------------------------------------ */

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  color: string;
}

const GRAIN_COLORS = [
  "232, 211, 179",
  "217, 160, 91",
  "245, 230, 211",
  "194, 112, 61",
  "255, 248, 236",
];

function SandGrainCanvas({
  burstKey = 0,
  className = "",
}: {
  burstKey?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstKeyRef = useRef(burstKey);
  burstKeyRef.current = burstKey;

  useEffect(() => {
    if (burstKey <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let grains: Grain[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      grains = Array.from({ length: 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        // Wind blows left-to-right; a little vertical jitter.
        vx: 0.5 + Math.random() * 1.9,
        vy: (Math.random() - 0.5) * 0.5,
        r: 0.8 + Math.random() * 2.2,
        life: 0,
        maxLife: 900 + Math.random() * 700,
        color: GRAIN_COLORS[Math.floor(Math.random() * GRAIN_COLORS.length)],
      }));
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      ctx.clearRect(0, 0, w, h);
      grains = grains.filter((g) => g.life < g.maxLife);
      for (const g of grains) {
        g.life += dt;
        g.x += g.vx * dt * 0.06;
        g.y += g.vy * dt * 0.06;
        const k = 1 - g.life / g.maxLife;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${g.color}, ${(0.95 * k).toFixed(3)})`;
        ctx.fill();
      }
      if (grains.length > 0) {
        raf = requestAnimationFrame(tick);
      }
    };

    seed();
    spawn();
    raf = requestAnimationFrame(tick);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [burstKey]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Sand dissolve — the BACK is sliced into vertical strips; on      */
/* reveal each strip drifts sideways (further + later the further   */
/* right it starts, so the surface thins left-to-right like sand    */
/* blowing off) and fades, while the grain canvas carries fine      */
/* grains across the card. Tap again and the strips settle back     */
/* in reverse order, re-forming the back. Under reduced motion      */
/* every strip swaps instantly (duration 0, no delay, no grains).   */
/* ------------------------------------------------------------------ */

const STRIPS = 12;

export default function DesertDuskEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [grainKey, setGrainKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);

  const toggleCard = () => {
    const next = !isRevealed;
    setIsRevealed(next);
    if (next) {
      // Reveal: grains blow away + shimmer lands on the front.
      setGrainKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
    }
  };

  return (
    <div className="relative overflow-x-clip px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-14">
      <div className="relative z-10 mx-auto flex max-w-[540px] flex-col items-center">
        {/* Invitation card — back at rest, sand-dissolve reveal */}
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
                ? "Cover the wedding invitation card again"
                : "Reveal the wedding invitation card — the card back dissolves into sand"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3A2A20]"
          >
            {/* Ambient gold motes drifting behind the card. Skipped
                under reduced motion (no animation at all). */}
            {!instant && (
              <SandGlowCanvas moteCount={14} burstKey={0} className="z-0" />
            )}

            {/* Card — the FRONT is in flow (it defines the box
                height); the BACK is an absolute inset-0 overlay
                sliced into dissolving strips, so the reveal never
                moves layout. */}
            <div className="relative z-10 mx-auto w-full">
              {/* Soft warm glow behind the card */}
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2rem] blur-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(217,160,91,0.5) 0%, rgba(194,112,61,0.3) 55%, transparent 75%)",
                }}
              />

              <div className="relative w-full overflow-hidden">
                {/* FRONT — the invitation (unchanged content) */}
                <div aria-hidden={!isRevealed} className="relative w-full">
                  <InvitationCard
                    site={site}
                    isOpen={isRevealed}
                    shimmerKey={isRevealed && !instant ? shimmerKey : 0}
                  />
                </div>

                {/* BACK — dune-toned surface, sliced into strips
                    that blow away sideways on reveal. The overlay
                    is pointer-events-none: the parent button owns
                    the tap. */}
                <div
                  aria-hidden={isRevealed}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  {Array.from({ length: STRIPS }, (_, i) => (
                    <motion.div
                      key={i}
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 overflow-hidden"
                      style={{
                        left: `${(i * 100) / STRIPS}%`,
                        width: `${100 / STRIPS + 0.6}%`,
                      }}
                      initial={false}
                      animate={
                        isRevealed
                          ? { x: 14 + i * 7, opacity: 0, filter: "blur(3px)" }
                          : { x: 0, opacity: 1, filter: "blur(0px)" }
                      }
                      transition={{
                        duration: instant ? 0 : 0.7,
                        delay: instant
                          ? 0
                          : isRevealed
                            ? i * 0.045
                            : (STRIPS - 1 - i) * 0.04,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {/* Full-card-width slice: the strip shows
                          only its own vertical slice of the back. */}
                      <div
                        className="absolute inset-y-0"
                        style={{
                          width: `${STRIPS * 100}%`,
                          left: `${-i * 100}%`,
                        }}
                      >
                        <CardBackSurface site={site} />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Fine sand grains blowing sideways on reveal.
                    The canvas renders nothing under reduced
                    motion (never mounted there). */}
                {!instant && <SandGrainCanvas burstKey={grainKey} className="z-20" />}
              </div>
            </div>

            {/* Cue — on a soft pill so it stays legible over the
                sand surface below the card. */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="dd-font-display relative z-10 mt-4 inline-block rounded-full bg-[#FFF8EC]/80 px-4 py-1 text-center text-[10px] tracking-[0.26em] text-[#8A4A22]/80 uppercase backdrop-blur-[2px] transition-colors group-hover:text-[#3A2A20]"
            >
              {isRevealed ? "Tap to Cover Again" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
