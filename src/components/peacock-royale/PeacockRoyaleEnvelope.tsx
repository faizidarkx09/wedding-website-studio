// Peacock Royale invitation card — NO envelope. The card itself is
// the reveal: at rest you see its BACK (deep teal + gold feather
// pattern, softly blurred, with a gold feather seal carrying the
// couple monogram and "TAP TO REVEAL"); on tap the back PARTICLE
// DISSOLVES — it thins, blurs and scatters into drifting gold and
// teal dust — revealing the FRONT (the existing ivory letterpress
// invitation, unchanged). Tap again returns to the back.
// prefers-reduced-motion: instant swap, no ambient dust, no
// particles. No music on this template — the seal is the
// interaction, not a vinyl medallion.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import { FeatherDivider, FeatherEye } from "./Decor";
import { formatCardDate, initials, locationLabel } from "./tokens";

/* ------------------------------------------------------------------ */
/* InvitationCard — the ivory letterpress card (FRONT). Content     */
/* unchanged from the previous version; only a one-time gold        */
/* shimmer sweep was added, landing the dissolve reveal.            */
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
      className={`relative mx-auto w-full overflow-hidden bg-[#FDFBF5] px-4 py-2 text-center text-[#0B4F4A] transition-shadow duration-700 @min-[29.375rem]:px-6 @min-[29.375rem]:py-3 ${
        isOpen
          ? "shadow-[0_22px_42px_-12px_rgba(4,33,31,0.55),0_4px_12px_rgba(4,33,31,0.25)]"
          : "shadow-[0_10px_24px_-8px_rgba(4,33,31,0.45)]"
      }`}
    >
      {/* Fine double gold & teal letterpress border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D4AF37]/90 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#0B4F4A]/25 @min-[29.375rem]:inset-[15px]"
      />

      {/* Delicate corner ticks */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-3 h-2.5 w-2.5 border-t border-l border-[#0B4F4A]/65 @min-[29.375rem]:top-3.5 @min-[29.375rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3 right-3 h-2.5 w-2.5 border-t border-r border-[#0B4F4A]/65 @min-[29.375rem]:top-3.5 @min-[29.375rem]:right-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-[#0B4F4A]/65 @min-[29.375rem]:bottom-3.5 @min-[29.375rem]:left-3.5"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 bottom-3 h-2.5 w-2.5 border-r border-b border-[#0B4F4A]/65 @min-[29.375rem]:right-3.5 @min-[29.375rem]:bottom-3.5"
      />

      {/* Editable HTML Letterpress Typography */}
      <div className="relative z-10 flex flex-col items-center py-1 @min-[29.375rem]:py-2">
        <p className="er-font-display text-[9px] leading-none tracking-[0.26em] text-[#0B4F4A] uppercase @min-[29.375rem]:text-[10px]">
          WE INVITE YOU
        </p>

        <h2 className="er-font-display mt-2 text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#062E2B] uppercase @min-[29.375rem]:mt-3 @min-[29.375rem]:text-[18px] @min-[29.375rem]:tracking-[0.12em]">
          {site.content.partnerA}
        </h2>
        <span className="er-font-editorial my-0.5 text-sm leading-none italic text-[#0B4F4A] @min-[29.375rem]:text-base">
          &amp;
        </span>
        <h2 className="er-font-display text-[15px] leading-none font-normal tracking-[0.1em] break-words text-[#062E2B] uppercase @min-[29.375rem]:text-[18px] @min-[29.375rem]:tracking-[0.12em]">
          {site.content.partnerB}
        </h2>

        <FeatherDivider className="mt-6 mb-2 h-5 w-24 @min-[24rem]:mt-10 @min-[29.375rem]:mt-6 @min-[29.375rem]:h-6 @min-[29.375rem]:w-28" />

        <p className="er-font-display text-[9px] leading-none tracking-[0.24em] text-[#062E2B] uppercase @min-[29.375rem]:text-[10px]">
          {formatCardDate(site.weddingDate, site.timezone)}
        </p>
        <p className="er-font-display mt-1 text-[8.5px] leading-none tracking-[0.22em] text-[#0B4F4A] uppercase @min-[29.375rem]:text-[9.5px]">
          {locationLabel(site)}
        </p>
      </div>

      {/* One-time gold shimmer sweep across the card on reveal.
          Remounts (key) on every reveal so it replays. */}
      {shimmerKey > 0 && (
        <motion.div
          key={shimmerKey}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-20 w-1/3"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(212,175,55,0.35) 50%, transparent 100%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "320%" }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CardBack — the card's BACK at rest. Deep teal + gold feather     */
/* pattern, softly blurred (large out-of-focus feather eyes), with  */
/* a gold feather seal carrying the live monogram and the tap hint. */
/* Same footprint as the front (absolute inset-0 of the card box),  */
/* so the dissolve never moves layout.                              */
/* ------------------------------------------------------------------ */

function CardBack({ site }: { site: WeddingSite }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#062E2B] px-4 py-8 text-center shadow-[0_10px_24px_-8px_rgba(4,33,31,0.45)] @min-[29.375rem]:px-6">
      {/* Deep teal radial wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 38%, rgba(18, 140, 126, 0.5) 0%, rgba(6, 46, 43, 0.9) 62%, #04211F 100%)",
        }}
      />

      {/* Blurred feather pattern — large feather eyes, out of focus,
          drifting nowhere (the dust canvas supplies the motion). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 blur-[3px]"
      >
        <FeatherEye className="absolute -top-6 -left-4 h-28 w-20 rotate-[-18deg] opacity-60" />
        <FeatherEye className="absolute top-1/3 -right-6 h-32 w-24 rotate-[14deg] opacity-50" />
        <FeatherEye className="absolute -bottom-8 left-1/4 h-28 w-20 rotate-[24deg] opacity-45" />
        <FeatherEye className="absolute top-6 right-1/4 h-20 w-14 rotate-[-8deg] opacity-40" />
      </div>

      {/* Soft light vignette — keeps the centre bright for the seal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(253,251,245,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Fine double gold border, matching the front */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-2.5 border border-[#D4AF37]/70 @min-[29.375rem]:inset-3"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[13px] border border-[#E7C86A]/35 @min-[29.375rem]:inset-[15px]"
      />

      <div className="relative z-10 flex flex-col items-center py-2">
        <p className="er-font-display text-[9px] tracking-[0.34em] text-[#E7C86A] uppercase @min-[29.375rem]:text-[10px]">
          WITH LOVE
        </p>

        {/* Gold feather seal — disc with feather eye + live monogram,
            the same seal language as the cover. */}
        <div
          aria-hidden="true"
          className="relative mt-5 flex h-28 w-28 items-center justify-center rounded-full shadow-[0_16px_30px_-8px_rgba(4,33,31,0.6),0_4px_10px_rgba(4,33,31,0.35)] ring-2 ring-[#E7C86A]/60 @min-[24rem]:h-32 @min-[24rem]:w-32"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #F6E27A 0%, #E7C86A 34%, #D4AF37 60%, #9A7B2D 100%)",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-2 rounded-full border border-[#062E2B]/25"
          />
          <FeatherEye className="absolute top-3 left-1/2 h-8 w-6 -translate-x-1/2 opacity-95 @min-[24rem]:top-4" />
          <span
            className="er-font-display relative z-10 mt-7 text-[1.5rem] font-semibold tracking-[0.06em] text-[#062E2B] @min-[24rem]:mt-8 @min-[24rem]:text-[1.7rem]"
            style={{
              textShadow:
                "0 1px 0 rgba(255, 255, 255, 0.5), 0 -1px 0 rgba(6, 46, 43, 0.25), 0 2px 3px rgba(6, 46, 43, 0.3)",
            }}
          >
            {initials(site)}
          </span>
        </div>

        <FeatherDivider className="mt-5 h-5 w-24 @min-[29.375rem]:h-6 @min-[29.375rem]:w-28" />

        <p className="er-font-display mt-4 text-[9px] tracking-[0.3em] text-[#FDFBF5] uppercase @min-[29.375rem]:text-[10px]">
          TAP TO REVEAL
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DissolveCanvas — one canvas, one rAF loop. Gold + teal dust      */
/* motes drift slowly over the card back at rest; when dissolveKey  */
/* increments, ~120 dust particles spawn across the WHOLE card      */
/* surface and scatter outward from the centre, fading over ~1.2s  */
/* — the back thinning into dust. Renders nothing at all under      */
/* prefers-reduced-motion (the parent never mounts it then).        */
/* ------------------------------------------------------------------ */

interface DustMote {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  gold: boolean;
  colorIdx: number;
}

interface DustParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  gold: boolean;
}

const DUST_GOLDS = ["231, 200, 106", "246, 226, 122", "212, 175, 55"];
const DUST_TEALS = ["45, 212, 191", "94, 234, 212", "18, 140, 126"];

function DissolveCanvas({
  dissolveKey = 0,
  ambient = true,
  className = "",
}: {
  dissolveKey?: number;
  ambient?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // dissolveKey arrives via a ref so the rAF loop (created once)
  // sees every increment; dissolveSeenRef tracks what it fired.
  const dissolveKeyRef = useRef(dissolveKey);
  const dissolveSeenRef = useRef(0);
  dissolveKeyRef.current = dissolveKey;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let motes: DustMote[] = [];
    let dust: DustParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: 16 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.5 + Math.random() * 2.5,
        vy: 0.08 + Math.random() * 0.18,
        sway: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.4,
        gold: Math.random() < 0.65,
        colorIdx: Math.floor(Math.random() * 3),
      }));
    };

    const spawnDissolve = () => {
      const cx = w / 2;
      const cy = h / 2;
      dust = Array.from({ length: 120 }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        // Drift outward, away from the card centre, so the back
        // reads as scattering into dust.
        const dx = x - cx;
        const dy = y - cy;
        const len = Math.max(1, Math.hypot(dx, dy));
        const sp = 0.4 + Math.random() * 1.9;
        return {
          x,
          y,
          vx: (dx / len) * sp + (Math.random() - 0.5) * 0.4,
          vy: (dy / len) * sp - 0.35 - Math.random() * 0.4,
          r: 1 + Math.random() * 2.2,
          life: 0,
          maxLife: 650 + Math.random() * 600,
          gold: Math.random() < 0.65,
        };
      });
    };

    const drawDiamond = (
      x: number,
      y: number,
      r: number,
      angle: number,
      fill: string,
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r * 0.7, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r * 0.7, 0);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      if (ambient) {
        for (const m of motes) {
          // Dust motes rise slowly and recycle at the bottom.
          m.y -= m.vy * dt * 0.06;
          if (m.y < -12) {
            m.y = h + 12;
            m.x = Math.random() * w;
          }
          const x = m.x + Math.sin(t / 2600 + m.phase) * m.sway * 10;
          const palette = m.gold ? DUST_GOLDS : DUST_TEALS;
          drawDiamond(
            x,
            m.y,
            m.size,
            t * 0.0002 + m.phase,
            `rgba(${palette[m.colorIdx]}, ${m.alpha.toFixed(3)})`,
          );
        }
      }
      dust = dust.filter((p) => p.life < p.maxLife);
      for (const p of dust) {
        p.life += dt;
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        p.vy += 0.0009 * dt;
        const k = 1 - p.life / p.maxLife;
        const palette = p.gold ? DUST_GOLDS : DUST_TEALS;
        const idx = Math.floor(p.r * 10) % palette.length;
        drawDiamond(p.x, p.y, p.r, p.life * 0.002, `rgba(${palette[idx]}, ${(0.95 * k).toFixed(3)})`);
      }
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      if (dissolveKeyRef.current !== dissolveSeenRef.current) {
        dissolveSeenRef.current = dissolveKeyRef.current;
        if (dissolveKeyRef.current > 0) spawnDissolve();
      }
      draw(t, dt);
      raf = requestAnimationFrame(tick);
    };

    seed();
    raf = requestAnimationFrame(tick);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambient]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* PeacockRoyaleEnvelope — the card-only reveal (kept file name +   */
/* default export so the renderer import is unchanged). The FRONT   */
/* is in flow (it defines the box height); the BACK is absolute     */
/* inset-0 over it. At rest the back shows; on tap it dissolves    */
/* (fade + blur + dust burst) and the front fades in beneath it.   */
/* Tap again returns to the back (it re-materialises).              */
/* ------------------------------------------------------------------ */

export default function PeacockRoyaleEnvelope({ site }: { site: WeddingSite }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [dissolveKey, setDissolveKey] = useState(0);
  const [shimmerKey, setShimmerKey] = useState(0);
  const [backKey, setBackKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const instant = Boolean(prefersReducedMotion);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const toggleCard = () => {
    // Double-tap guard while the dust is still settling.
    if (isDissolving) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isRevealed) {
      if (instant) {
        setIsRevealed(true);
        return;
      }
      setIsDissolving(true);
      setDissolveKey((k) => k + 1);
      setShimmerKey((k) => k + 1);
      timerRef.current = setTimeout(() => {
        setIsRevealed(true);
        setIsDissolving(false);
      }, 1150);
    } else {
      // Back to the card back — it re-materialises (fade + un-blur).
      setBackKey((k) => k + 1);
      setIsRevealed(false);
    }
  };

  // NOTE: the outer wrapper below is NOT inside a @container (the
  // container starts at the motion.div inside it), so its padding is
  // fixed — container queries there would never match.
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
                ? "Show the back of the wedding invitation card"
                : "Reveal the wedding invitation card"
            }
            onClick={toggleCard}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard();
              }
            }}
            className="group relative mx-auto w-full cursor-pointer text-center select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#062E2B]"
          >
            {/* Soft teal-gold glow behind the card */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] blur-2xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(212,175,55,0.45) 0%, rgba(18,140,126,0.3) 55%, transparent 75%)",
              }}
            />

            {/* Card box — the front defines the height; the back and
                the dust canvas sit absolute over it. No fixed widths
                anywhere, so 390px and 320px cannot clip. */}
            <div className="relative z-10 w-full">
              {/* FRONT — the invitation (unchanged content) */}
              <motion.div
                aria-hidden={!isRevealed}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.985 }}
                transition={{
                  duration: instant ? 0 : isRevealed ? 0.6 : 0.35,
                  delay: isRevealed && !instant ? 0.55 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative w-full"
              >
                <InvitationCard
                  site={site}
                  isOpen={isRevealed}
                  shimmerKey={isRevealed && !instant ? shimmerKey : 0}
                />
              </motion.div>

              {/* BACK — deep teal feather back, dissolving on tap */}
              {(!isRevealed || isDissolving) && (
                <motion.div
                  key={backKey}
                  aria-hidden={isRevealed}
                  initial={instant ? false : { opacity: 0, filter: "blur(8px)", scale: 1.02 }}
                  animate={{
                    opacity: isDissolving ? 0 : 1,
                    filter: isDissolving ? "blur(8px)" : "blur(0px)",
                    scale: isDissolving ? 1.03 : 1,
                  }}
                  transition={{
                    duration: instant ? 0 : isDissolving ? 0.9 : 0.6,
                    delay: isDissolving ? 0.12 : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 z-10"
                >
                  <CardBack site={site} />
                </motion.div>
              )}

              {/* Gold + teal dust — ambient drift at rest, full
                  surface burst on dissolve. Skipped entirely under
                  reduced motion. */}
              {!instant && (!isRevealed || isDissolving) && (
                <DissolveCanvas dissolveKey={dissolveKey} className="z-20" />
              )}
            </div>

            {/* Interactive cue */}
            <motion.p
              key={isRevealed ? "front" : "back"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: instant ? 0 : 0.4 }}
              className="er-font-display relative z-10 mt-4 text-center text-[10px] tracking-[0.26em] text-[#0B4F4A]/85 uppercase transition-colors group-hover:text-[#062E2B]"
            >
              {isRevealed ? "Tap to Show Back" : "Tap Card to Reveal"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
