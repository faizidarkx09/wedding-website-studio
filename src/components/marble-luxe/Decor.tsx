// Marble Luxe decorations — PaperSurface (white / marble / ink),
// GoldDust (lightweight canvas particle layer, ~40 particles),
// GoldDivider (thin gold rule with a centre diamond) and
// MonogramRing (thin double gold ring for the cover monogram).
// Font classes are the scoped .ml-* variants from globals.css
// (never the bare source class names, which would collide with
// other templates). The .ml-* classes are added by the coordinator
// — see the Marble Luxe entry in the delivery report.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "white" | "marble" | "ink";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isMarble = variant === "marble";
  const isInk = variant === "ink";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isInk
          ? "bg-[#1F2937] text-white"
          : isMarble
            ? "bg-[#F7F7F5] text-[#1F2937]"
            : "bg-white text-[#1F2937]"
      } ${className}`}
    >
      {/* Soft directional light — a faint cool glow for marble, a
          low warm glow for ink (kept dark so white type stays
          high-contrast), nothing for plain white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isInk
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(180, 154, 112, 0.22) 0%, rgba(31, 41, 55, 0.5) 100%)"
            : isMarble
              ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.7) 0%, rgba(247, 247, 245, 0.4) 100%)"
              : "none",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* GoldDust — ~40 tiny gold particles drifting slowly upward with a  */
/* gentle sideways sway, drawn on one canvas with a single rAF      */
/* loop. Pointer-events-none and low opacity, so it never hurts     */
/* readability or performance. Respects prefers-reduced-motion      */
/* (renders one static frame instead of animating). Used on the     */
/* cover only — the one place the brief asks for it.                 */
/* ------------------------------------------------------------------ */

interface DustParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
}

export function GoldDust({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: DustParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.7 + Math.random() * 1.8,
        speed: 0.06 + Math.random() * 0.22,
        sway: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.4,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 12;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 154, 112, ${(p.alpha * twinkle).toFixed(3)})`;
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
/* GoldDivider — a thin gold hairline with a small centre diamond,  */
/* for card dividers and section breaks.                             */
/* ------------------------------------------------------------------ */

export function GoldDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 12" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="6" x2="78" y2="6" stroke="#B49A70" strokeWidth="1" />
      <line x1="102" y1="6" x2="180" y2="6" stroke="#B49A70" strokeWidth="1" />
      <rect
        x="86"
        y="2"
        width="8"
        height="8"
        transform="rotate(45 90 6)"
        fill="#B49A70"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* MonogramRing — a thin double gold ring. The live monogram sits   */
/* in the centre as HTML text (see Cover).                           */
/* ------------------------------------------------------------------ */

export function MonogramRing({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="88" stroke="#B49A70" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="82" stroke="#B49A70" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}
