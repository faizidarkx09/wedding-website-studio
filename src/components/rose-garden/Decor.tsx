// Rose Garden decorations — PaperSurface (deep rose / cream /
// leaf green), FallingPetals (lightweight canvas petal layer),
// RoseDivider (a small rose between two hairlines, for card
// dividers) and RoseMark (the timeline's rose marker). Font classes
// are the scoped .rg-* variants from globals.css (never the bare
// source class names, which would collide with other templates).
// The .rg-* classes are added by the coordinator — see
// ~/workspace/rose-garden-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "rose" | "cream" | "leaf";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isRose = variant === "rose";
  const isLeaf = variant === "leaf";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isRose
          ? "bg-[#B3124F] text-[#FFF7F2]"
          : isLeaf
            ? "bg-[#2F5230] text-[#FFF7F2]"
            : "bg-[#FFF7F2] text-[#3D1420]"
      } ${className}`}
    >
      {/* Soft directional light — a rose glow for rose, a leaf glow
          for leaf (kept dark so cream type stays high-contrast), a
          warm cream vignette for cream. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isRose
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(214, 51, 108, 0.5) 0%, rgba(126, 12, 55, 0.55) 55%, rgba(61, 20, 32, 0.7) 100%)"
            : isLeaf
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(62, 107, 58, 0.45) 0%, rgba(47, 82, 48, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 252, 248, 0.6) 0%, rgba(253, 237, 228, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FallingPetals — ~36 rose petals drifting slowly downward with a   */
/* gentle sideways sway, drawn on one canvas with a single rAF loop. */
/* Pointer-events-none and low opacity, so it never hurts            */
/* readability or performance. Respects prefers-reduced-motion       */
/* (renders one static frame instead of animating). Used on the      */
/* cover only — the one place the brief asks for it.                 */
/* ------------------------------------------------------------------ */

interface PetalParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  rot: number;
  rotSpeed: number;
  color: string;
}

const PETAL_COLORS = [
  "179, 18, 79",
  "214, 51, 108",
  "244, 167, 185",
  "250, 220, 227",
];

export function FallingPetals({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let petals: PetalParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      petals = Array.from({ length: 36 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 3 + Math.random() * 5,
        speed: 0.12 + Math.random() * 0.3,
        sway: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.45,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 18;
        const y = p.y + ((t / 1000) * p.speed * 10) % (h + 24);
        const wrappedY = y > h + 12 ? y - h - 24 : y;
        const rot = p.rot + (t / 1000) * p.rotSpeed * 60;
        ctx.save();
        ctx.translate(x, wrappedY);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha.toFixed(3)})`;
        ctx.fill();
        ctx.restore();
      }
    };

    const tick = (t: number) => {
      draw(t);
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    seed();
    raf = requestAnimationFrame(tick);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* RoseMark — a small five-petal rose in a ring, the timeline's      */
/* marker and the wax seal's centre motif. Drawn as SVG so it stays  */
/* crisp at any size and never needs an image.                       */
/* ------------------------------------------------------------------ */

export function RoseMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const cx = 24 + 9.5 * Math.cos(angle);
        const cy = 24 + 9.5 * Math.sin(angle);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="6.5"
            ry="8"
            fill="currentColor"
            opacity="0.85"
            transform={`rotate(${(i * 72) % 360} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx="24" cy="24" r="5" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* RoseDivider — a small rose between two deep-rose hairlines, for   */
/* card dividers.                                                    */
/* ------------------------------------------------------------------ */

export function RoseDivider({ className = "", light = false }: { className?: string; light?: boolean }) {
  const line = light ? "to-[#F4A7B9]/80" : "to-[#B3124F]/70";
  const mark = light ? "text-[#F4A7B9]" : "text-[#B3124F]";
  return (
    <div aria-hidden="true" className={`mx-auto flex items-center justify-center gap-2 ${className}`}>
      <span className={`h-px w-12 bg-gradient-to-r from-transparent ${line}`} />
      <RoseMark className={`h-5 w-5 ${mark}`} />
      <span className={`h-px w-12 bg-gradient-to-l from-transparent ${line}`} />
    </div>
  );
}
