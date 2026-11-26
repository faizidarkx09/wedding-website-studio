// Peacock Royale decorations — PeacockSurface (deep teal / ivory),
// ShimmeringSparkles (lightweight canvas sparkle layer, gold
// glints), FeatherEye (peacock feather eye SVG), FeatherDivider
// and FeatherFan (radial fan of feather eyes for the cover).
// Font classes are the scoped .er-* variants from globals.css
// (already loaded — never the bare source class names, which would
// collide with other templates).
"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface PeacockSurfaceProps {
  variant: "teal" | "ivory";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PeacockSurface({ variant, className = "", children, id }: PeacockSurfaceProps) {
  const isTeal = variant === "teal";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isTeal ? "bg-[#062E2B] text-[#FDFBF5]" : "bg-[#FDFBF5] text-[#062E2B]"
      } ${className}`}
    >
      {/* Subtle peacock vignette — lighter at the top centre, deeper
          at the edges, so ivory text stays legible on teal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isTeal
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(18, 140, 126, 0.30) 0%, rgba(4, 33, 31, 0.55) 100%)"
            : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.55) 0%, rgba(212, 175, 55, 0.16) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/** Deterministic pseudo-random generator so the sparkle field is
 * identical on server and client (no hydration mismatch). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Sparkle {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
}

/** ShimmeringSparkles — a lightweight canvas layer of ~60 gold
 * sparkles that gently shimmer (alpha oscillation only — no
 * movement, no blur, no layout work). One rAF loop,
 * devicePixelRatio-capped, paused when the tab is hidden (rAF stops
 * on its own) and fully static when the user prefers reduced
 * motion. Pointer-events-none, aria-hidden, and always layered
 * UNDER the text so it can never hurt readability. Each sparkle is
 * drawn as a small 4-point star (two crossed lines) so it reads as
 * a glint, not a dot. */
export function ShimmeringSparkles({
  className = "",
  count = 60,
  seed = 20261126,
  color = "#E7C86A",
}: {
  className?: string;
  count?: number;
  seed?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rand = mulberry32(seed);
    const sparkles: Sparkle[] = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      r: 1.5 + rand() * 3.2,
      phase: rand() * Math.PI * 2,
      speed: 0.35 + rand() * 0.85,
    }));

    let raf = 0;
    let running = true;

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const time = t / 1000;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      for (const s of sparkles) {
        // Static alpha when reduced motion is preferred; otherwise a
        // slow sine shimmer between ~0.25 and 0.95.
        const alpha = prefersReducedMotion
          ? 0.7
          : 0.25 + 0.7 * Math.abs(Math.sin(time * s.speed + s.phase));
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(0.7, s.r * 0.28);
        const cx = s.x * w;
        const cy = s.y * h;
        const r = s.r;
        ctx.beginPath();
        ctx.moveTo(cx - r, cy);
        ctx.lineTo(cx + r, cy);
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx, cy + r);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      if (!prefersReducedMotion && running) {
        raf = requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }
    const onResize = () => draw(performance.now());
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, seed, prefersReducedMotion, color]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/** FeatherEye — a peacock feather "eye" drawn as concentric
 * ellipses: gold outer ring, teal ring, deep-blue centre. Used on
 * the envelope seal, as a small ornament, and as the fan blades. */
export function FeatherEye({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 140" fill="none" className={className}>
      <ellipse cx="50" cy="70" rx="46" ry="66" fill="#D4AF37" opacity="0.28" />
      <ellipse cx="50" cy="70" rx="38" ry="56" fill="#D4AF37" />
      <ellipse cx="50" cy="70" rx="31" ry="47" fill="#0F766E" />
      <ellipse cx="50" cy="70" rx="23" ry="36" fill="#0B4F4A" />
      <ellipse cx="50" cy="70" rx="15" ry="24" fill="#1E5AA8" />
      <ellipse cx="50" cy="70" rx="8" ry="13" fill="#062E2B" />
      <ellipse cx="46" cy="62" rx="3" ry="5" fill="#E7C86A" opacity="0.9" />
    </svg>
  );
}

/** FeatherDivider — a small feather eye flanked by gold hairlines,
 * the section divider for this template. */
export function FeatherDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
      <FeatherEye className="h-5 w-4 shrink-0" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
    </div>
  );
}

/** FeatherFan — a radial fan of feather eyes arcing over a pivot
 * point (the top of the cover's photo arch). `blades` feather eyes
 * spread from `fromDeg` to `toDeg` around the pivot; each blade is
 * absolutely positioned and rotated so its tip points outward.
 * Pure SVG/CSS — no image — so it scales crisply at every width. */
export function FeatherFan({
  className = "",
  blades = 9,
  fromDeg = -72,
  toDeg = 72,
}: {
  className?: string;
  blades?: number;
  fromDeg?: number;
  toDeg?: number;
}) {
  const angles =
    blades <= 1
      ? [0]
      : Array.from({ length: blades }, (_, i) => fromDeg + ((toDeg - fromDeg) * i) / (blades - 1));
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {angles.map((deg, i) => {
        const mid = Math.abs(deg) < 18;
        const len = mid ? 92 : 78;
        return (
          <span
            key={i}
            className="absolute bottom-0 left-1/2 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${deg}deg) translateY(-${len}px)`,
              width: 26,
              height: 36,
            }}
          >
            <FeatherEye className="h-full w-full opacity-90 drop-shadow-[0_2px_6px_rgba(4,33,31,0.55)]" />
          </span>
        );
      })}
    </div>
  );
}
