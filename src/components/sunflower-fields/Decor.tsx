// Sunflower Fields decorations — PaperSurface (cream / deep-green /
// sunflower-yellow), Pollen (lightweight canvas particle layer,
// ~45 floating pollen grains), SunflowerCrest (a sunflower ring
// with the live monogram in the centre), SunflowerDivider and the
// SunflowerSeal (SVG sunflower wax seal for the envelope button).
// Fonts are inline fontFamily styles from tokens.ts (never bare
// class names, which would collide with other templates, and never
// globals.css, which this folder must not touch).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "yellow" | "cream" | "green";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isYellow = variant === "yellow";
  const isGreen = variant === "green";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isYellow
          ? "bg-[#FACC15] text-[#14532D]"
          : isGreen
            ? "bg-[#14532D] text-[#FFFBEB]"
            : "bg-[#FFFBEB] text-[#14532D]"
      } ${className}`}
    >
      {/* Soft directional light — a warm glow for yellow, a low
          leaf-green glow for green (kept dark so cream type stays
          high-contrast), a soft cream vignette for cream. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isYellow
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(254, 240, 138, 0.65) 0%, rgba(250, 204, 21, 0.5) 55%, rgba(234, 179, 8, 0.55) 100%)"
            : isGreen
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(22, 101, 52, 0.5) 0%, rgba(20, 83, 45, 0.55) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 254, 245, 0.6) 0%, rgba(254, 243, 199, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pollen — ~45 tiny yellow pollen grains drifting slowly sideways   */
/* with a gentle vertical bob, drawn on one canvas with a single     */
/* rAF loop. Pointer-events-none and low opacity, so it never hurts  */
/* readability or performance. Respects prefers-reduced-motion       */
/* (renders one static frame instead of animating). Used on the      */
/* cover and the countdown band — the two places the brief asks      */
/* for it.                                                           */
/* ------------------------------------------------------------------ */

interface PollenParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  bob: number;
  phase: number;
  alpha: number;
}

export function Pollen({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: PollenParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.9 + Math.random() * 2.2,
        speed: 0.06 + Math.random() * 0.22,
        bob: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.22 + Math.random() * 0.5,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + ((t / 1000) * p.speed * 10) % (w + 20);
        const wrappedX = x > w + 10 ? x - w - 20 : x;
        const y = p.y + Math.sin(t / 2000 + p.phase) * p.bob * 12;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(wrappedX, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${(p.alpha * twinkle).toFixed(3)})`;
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
/* SunflowerBloom — a 16-petal sunflower (yellow petals, brown       */
/* centre). Used by the crest, the divider and the wax seal.         */
/* ------------------------------------------------------------------ */

export function SunflowerBloom({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {petals.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const long = i % 2 === 0;
        const x1 = 100 + 52 * Math.cos(rad);
        const y1 = 100 + 52 * Math.sin(rad);
        const x2 = 100 + (long ? 96 : 84) * Math.cos(rad);
        const y2 = 100 + (long ? 96 : 84) * Math.sin(rad);
        const px = 100 + 68 * Math.cos(rad);
        const py = 100 + 68 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FACC15"
            strokeWidth={long ? 13 : 10}
            strokeLinecap="round"
            style={{ transformOrigin: `${px}px ${py}px` }}
          />
        );
      })}
      <circle cx="100" cy="100" r="52" fill="#78350F" stroke="#14532D" strokeWidth="2" />
      <circle cx="100" cy="100" r="40" fill="#92400E" opacity="0.55" />
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i * 360) / 14 + 9;
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={100 + 26 * Math.cos(rad)}
            cy={100 + 26 * Math.sin(rad)}
            r="3.5"
            fill="#451A03"
            opacity="0.7"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SunflowerCrest — the bloom with a ring around it. The live        */
/* monogram sits in the centre as HTML text (see Cover).             */
/* ------------------------------------------------------------------ */

export function SunflowerCrest({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <SunflowerBloom className="h-full w-full" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[16%] rounded-full border border-[#FACC15]/70"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SunflowerDivider — a small sunflower disc between two green       */
/* hairlines, for card dividers.                                     */
/* ------------------------------------------------------------------ */

export function SunflowerDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#166534]/70" />
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0">
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 360) / 12;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={12 + 5 * Math.cos(rad)}
              y1={12 + 5 * Math.sin(rad)}
              x2={12 + 10 * Math.cos(rad)}
              y2={12 + 10 * Math.sin(rad)}
              stroke="#EAB308"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx="12" cy="12" r="4.5" fill="#78350F" stroke="#14532D" strokeWidth="0.8" />
      </svg>
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#166534]/70" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SunflowerSeal — the wax-seal button graphic: a golden sunflower   */
/* disc. The button itself lives in the envelope file.               */
/* ------------------------------------------------------------------ */

export function SunflowerSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-full bg-[#EAB308] ${className}`}>
      <SunflowerBloom className="absolute inset-[6%] h-[88%] w-[88%]" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(255,255,255,0.45),inset_0_-3px_8px_rgba(120,53,15,0.45)]"
      />
    </div>
  );
}
