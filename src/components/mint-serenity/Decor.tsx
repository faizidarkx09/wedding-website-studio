// Mint Serenity decorations — PaperSurface (mint wash / white /
// deep sage), SoftBubbles (lightweight canvas bubble layer), the
// LeafWreath (sage leaf ring for the live monogram) and the
// BubbleDivider (a small bubble between two sage hairlines).
"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "wash" | "white" | "sage";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isWhite = variant === "white";
  const isSage = variant === "sage";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isSage
          ? "bg-[#065F46] text-[#ECFDF5]"
          : isWhite
            ? "bg-[#FFFFFF] text-[#052E22]"
            : "bg-[#ECFDF5] text-[#052E22]"
      } ${className}`}
    >
      {/* Soft directional light — a pale mint glow for the wash, a
          clean white for the paper, a low mint glow for the deep
          sage band (kept dark so white type stays high-contrast). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isSage
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(16, 185, 129, 0.35) 0%, rgba(6, 95, 70, 0.5) 100%)"
            : isWhite
              ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.6) 0%, rgba(236, 253, 245, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.55) 0%, rgba(209, 250, 229, 0.55) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SoftBubbles — ~36 translucent mint bubbles drifting slowly       */
/* upward with a gentle sideways sway, drawn on one canvas with a    */
/* single rAF loop. Pointer-events-none and low opacity, so it never */
/* hurts readability or performance. Respects                        */
/* prefers-reduced-motion (renders one static frame instead of       */
/* animating). Used on the cover and the invitation wash.            */
/* ------------------------------------------------------------------ */

interface BubbleParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
}

export function SoftBubbles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: BubbleParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 36 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 3 + Math.random() * 13,
        speed: 0.06 + Math.random() * 0.2,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.1 + Math.random() * 0.32,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 16;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 30);
        const wrappedY = y < -15 ? y + h + 30 : y;
        const twinkle = 0.8 + 0.2 * Math.sin(t / 1000 + p.phase * 3);
        // Bubble body: a soft mint fill with a brighter rim.
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * 0.55 * twinkle).toFixed(3)})`;
        ctx.fill();
        ctx.lineWidth = 1.1;
        ctx.strokeStyle = `rgba(6, 95, 70, ${(p.alpha * twinkle).toFixed(3)})`;
        ctx.stroke();
        // Tiny highlight dot, upper-left of the bubble.
        ctx.beginPath();
        ctx.arc(x - p.r * 0.35, wrappedY - p.r * 0.35, Math.max(1, p.r * 0.16), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * 1.4 * twinkle).toFixed(3)})`;
        ctx.fill();
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
/* LeafWreath — a sage leaf ring: 16 small leaves around two thin   */
/* circles. The live monogram sits in the centre as HTML text (see   */
/* Cover).                                                            */
/* ------------------------------------------------------------------ */

export function LeafWreath({ className = "" }: { className?: string }) {
  const leaves = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    return { angle, long: i % 2 === 0 };
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="84" stroke="#065F46" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="78" stroke="#10B981" strokeWidth="0.8" opacity="0.7" />
      {leaves.map((leaf, i) => (
        <g key={i} transform={`rotate(${leaf.angle} 100 100)`}>
          <path
            d="M100 8 C106 16, 106 26, 100 32 C94 26, 94 16, 100 8 Z"
            fill={leaf.long ? "#047857" : "#10B981"}
            opacity={leaf.long ? 0.9 : 0.65}
          />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* BubbleDivider — a small bubble with a highlight between two sage  */
/* hairlines, for card dividers.                                     */
/* ------------------------------------------------------------------ */

export function BubbleDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#065F46" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#065F46" strokeWidth="1.2" />
      <circle cx="90" cy="17" r="9" fill="#FFFFFF" stroke="#065F46" strokeWidth="1.2" />
      <circle cx="90" cy="17" r="9" fill="#A7F3D0" opacity="0.35" />
      <circle cx="87" cy="14" r="2.4" fill="#FFFFFF" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LeafSeal — the mint leaf-seal disc: a deep-sage disc with a sage  */
/* leaf sprig, used as the envelope open button (pure SVG, no photo  */
/* — so the sliding card can never hide it).                         */
/* ------------------------------------------------------------------ */

export function LeafSeal({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" fill="none" className={className}>
      <circle cx="60" cy="60" r="58" fill="#065F46" />
      <circle cx="60" cy="60" r="58" stroke="#A7F3D0" strokeWidth="1.6" />
      <circle cx="60" cy="60" r="50" stroke="#A7F3D0" strokeWidth="0.8" opacity="0.6" />
      {/* Leaf sprig: a stem with six leaves. */}
      <path
        d="M60 92 C58 74, 58 56, 60 34"
        stroke="#D1FAE5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {[
        "M60 84 C50 80, 44 72, 44 62 C54 64, 59 72, 60 84 Z",
        "M60 84 C70 80, 76 72, 76 62 C66 64, 61 72, 60 84 Z",
        "M60 66 C51 62, 46 55, 46 46 C55 48, 59 55, 60 66 Z",
        "M60 66 C69 62, 74 55, 74 46 C65 48, 61 55, 60 66 Z",
        "M60 48 C53 44, 50 38, 50 31 C57 33, 59 39, 60 48 Z",
        "M60 48 C67 44, 70 38, 70 31 C63 33, 61 39, 60 48 Z",
      ].map((d, i) => (
        <path key={i} d={d} fill="#A7F3D0" />
      ))}
    </svg>
  );
}
