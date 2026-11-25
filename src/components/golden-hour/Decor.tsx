// Golden Hour decorations — PaperSurface (warm honey-gold / warm
// cream), GoldenDust (lightweight canvas particle layer, ~50
// particles), SunRayCrest (gold sunburst) and the SunburstDivider.
// Font classes are the scoped .gh-* variants from globals.css
// (never the bare source class names, which would collide with
// other templates). The .gh-* classes are added by the coordinator
// — see ~/workspace/golden-hour-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "gold" | "cream" | "brown";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isGold = variant === "gold";
  const isBrown = variant === "brown";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isGold
          ? "bg-[#8A6408] text-[#FFF8EC]"
          : isBrown
            ? "bg-[#3B2A12] text-[#FFF8EC]"
            : "bg-[#FFF8EC] text-[#3B2A12]"
      } ${className}`}
    >
      {/* Warm directional light — honey glow for gold, soft cream
          vignette for cream, a low amber glow for brown (kept dark
          so cream type stays high-contrast). No photo texture here:
          the gold band reads as sunset light, the cream as warm
          paper, the brown as evening. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isGold
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(232, 169, 61, 0.55) 0%, rgba(138, 100, 8, 0.55) 55%, rgba(59, 42, 18, 0.72) 100%)"
            : isBrown
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(138, 100, 8, 0.35) 0%, rgba(36, 23, 8, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.6) 0%, rgba(251, 238, 211, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* GoldenDust — ~50 tiny gold particles drifting slowly upward with */
/* a gentle sideways sway, drawn on one canvas with a single rAF    */
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

export function GoldenDust({ className = "" }: { className?: string }) {
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
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.1,
        speed: 0.08 + Math.random() * 0.28,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.18 + Math.random() * 0.5,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2400 + p.phase) * p.sway * 14;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 214, 138, ${(p.alpha * twinkle).toFixed(3)})`;
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
/* SunRayCrest — a gold sunburst: a ring with 24 radiating rays.    */
/* The live monogram sits in the centre as HTML text (see Cover).   */
/* ------------------------------------------------------------------ */

export function SunRayCrest({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const long = i % 2 === 0;
    const r1 = long ? 86 : 88;
    const r2 = long ? 100 : 96;
    const rad = (angle * Math.PI) / 180;
    return {
      x1: 100 + r1 * Math.cos(rad),
      y1: 100 + r1 * Math.sin(rad),
      x2: 100 + r2 * Math.cos(rad),
      y2: 100 + r2 * Math.sin(rad),
      long,
    };
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="#E8A93D"
          strokeWidth={ray.long ? 2.4 : 1.4}
          strokeLinecap="round"
        />
      ))}
      <circle cx="100" cy="100" r="82" stroke="#C9920E" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="76" stroke="#E8A93D" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SunburstDivider — a small sun disc with rays between two gold    */
/* hairlines, for card dividers.                                     */
/* ------------------------------------------------------------------ */

export function SunburstDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#C9920E" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#C9920E" strokeWidth="1.2" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 360) / 12;
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={90 + 9 * Math.cos(rad)}
            y1={17 + 9 * Math.sin(rad)}
            x2={90 + 13.5 * Math.cos(rad)}
            y2={17 + 13.5 * Math.sin(rad)}
            stroke="#C9920E"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="90" cy="17" r="6.5" fill="#E8A93D" stroke="#8A6408" strokeWidth="1" />
    </svg>
  );
}
