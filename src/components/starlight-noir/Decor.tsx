// Starlight Noir decorations — NightSurface (black surfaces with
// a faint gold radial glow), Starfield (lightweight canvas
// twinkling-star particle layer), StarCrest (gold constellation
// ring with a star, the live monogram sits in the centre as HTML
// text), ConstellationDivider (gold star between hairlines) and
// StarSeal (the gold star wax-seal button art).
"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { NOIR } from "./tokens";

interface NightSurfaceProps {
  variant: "black" | "panel" | "gold";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function NightSurface({ variant, className = "", children, id }: NightSurfaceProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        variant === "gold"
          ? "bg-[#A8862A] text-[#0A0A0A]"
          : variant === "panel"
            ? "bg-[#111111] text-[#F5EFE0]"
            : "bg-[#0A0A0A] text-[#F5EFE0]"
      } ${className}`}
    >
      {/* Faint gold glow — kept dark so gold/cream type stays
          high-contrast. No photo texture here: the black reads as
          night sky, the panel as a star chart. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            variant === "gold"
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(242, 217, 140, 0.5) 0%, rgba(168, 134, 42, 0.55) 55%, rgba(10, 10, 10, 0.35) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 40%, rgba(212, 175, 55, 0.10) 0%, rgba(10, 10, 10, 0.35) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Starfield — ~70 tiny gold stars twinkling slowly, drawn on one   */
/* canvas with a single rAF loop. Pointer-events-none and low        */
/* opacity, so it never hurts readability or performance. Respects   */
/* prefers-reduced-motion (renders one static frame instead of       */
/* animating). Used on the cover and the black invitation surfaces.  */
/* ------------------------------------------------------------------ */

interface StarParticle {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  alpha: number;
}

export function Starfield({ className = "", density = 70 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let stars: StarParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.7,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.1,
        alpha: 0.25 + Math.random() * 0.6,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        // Twinkle: slow sinusoidal alpha, each star on its own phase.
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 217, 140, ${(s.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
        // A few of the brightest stars get a cross sparkle.
        if (s.r > 1.9) {
          ctx.strokeStyle = `rgba(212, 175, 55, ${(s.alpha * twinkle * 0.5).toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r * 3, s.y);
          ctx.lineTo(s.x + s.r * 3, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3);
          ctx.lineTo(s.x, s.y + s.r * 3);
          ctx.stroke();
        }
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
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* StarCrest — a gold constellation ring: a double ring with a       */
/* five-pointed star in the centre and small stars on the ring. The  */
/* live monogram sits in the centre as HTML text (see Cover) — the   */
/* star is drawn behind it, so the monogram floats on the star.      */
/* ------------------------------------------------------------------ */

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * 36 - 90) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(" ");
}

export function StarCrest({ className = "" }: { className?: string }) {
  // Five small stars placed on the ring, connected by thin gold
  // constellation lines — the crest IS a constellation.
  const ringStars = [0, 72, 144, 216, 288].map((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: 100 + 82 * Math.cos(rad), y: 100 + 82 * Math.sin(rad) };
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {/* Constellation lines between the ring stars */}
      {ringStars.map((s, i) => {
        const next = ringStars[(i + 1) % ringStars.length];
        return (
          <line
            key={i}
            x1={s.x}
            y1={s.y}
            x2={next.x}
            y2={next.y}
            stroke="#D4AF37"
            strokeWidth="0.9"
            opacity="0.75"
          />
        );
      })}
      {/* Centre star */}
      <polygon
        points={starPoints(100, 100, 58, 24)}
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <polygon points={starPoints(100, 100, 58, 24)} fill="#D4AF37" fillOpacity="0.12" />
      {/* Rings */}
      <circle cx="100" cy="100" r="82" stroke="#D4AF37" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="76" stroke="#E8C96A" strokeWidth="0.7" opacity="0.7" />
      {/* Ring stars */}
      {ringStars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="3.2" fill="#F2D98C" stroke="#D4AF37" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ConstellationDivider — a small gold star between two hairlines,   */
/* for card dividers.                                                */
/* ------------------------------------------------------------------ */

export function ConstellationDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#D4AF37" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#D4AF37" strokeWidth="1.2" />
      <polygon
        points={starPoints(90, 17, 12, 5)}
        fill="#D4AF37"
        stroke="#A8862A"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* StarSeal — the gold star wax-seal art for the envelope open       */
/* button: a radial gold disc with a five-pointed star. Rendered as  */
/* inline SVG so it stays crisp at every size.                       */
/* ------------------------------------------------------------------ */

export function StarSeal({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 96" fill="none" className={className}>
      <defs>
        <radialGradient id="sn-seal-gold" cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#F2D98C" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A8862A" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="48" r="46" fill="url(#sn-seal-gold)" />
      <circle cx="48" cy="48" r="41" stroke="#F2D98C" strokeWidth="1" opacity="0.7" />
      <circle cx="48" cy="48" r="36" stroke="#8A6D1F" strokeWidth="0.8" opacity="0.5" />
      <polygon
        points={starPoints(48, 48, 24, 10)}
        fill="#0A0A0A"
        fillOpacity="0.28"
        stroke="#0A0A0A"
        strokeOpacity="0.45"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <polygon
        points={starPoints(48, 48, 24, 10)}
        fill="none"
        stroke="#F5EFE0"
        strokeWidth="0.7"
        opacity="0.55"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export { NOIR };
