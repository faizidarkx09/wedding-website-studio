// Coral Sunset decorations — SunsetSurface (coral gradient /
// warm cream / deep plum), EmberParticles (lightweight canvas
// particle layer, ~46 warm glowing embers), SunDisc (coral sun
// with rays; the live monogram sits in the centre as HTML text on
// the cover) and the SunsetDivider. Font classes are the scoped
// .cs-* variants from globals.css (never the bare source class
// names, which would collide with other templates). The .cs-*
// classes are added by the coordinator — see fonts-entry.txt in
// this folder.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface SunsetSurfaceProps {
  variant: "sunset" | "cream" | "plum";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function SunsetSurface({ variant, className = "", children, id }: SunsetSurfaceProps) {
  const isSunset = variant === "sunset";
  const isPlum = variant === "plum";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isSunset
          ? "bg-[#FF7F50] text-[#FFF6EE]"
          : isPlum
            ? "bg-[#2E1420] text-[#FFF6EE]"
            : "bg-[#FFF6EE] text-[#3D1F2B]"
      } ${className}`}
    >
      {/* Directional sunset light — coral-to-peach glow for the
          sunset band, a low ember glow for plum (kept dark so cream
          type stays high-contrast), a soft cream vignette for cream. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isSunset
            ? "linear-gradient(180deg, rgba(255, 127, 80, 0.55) 0%, rgba(255, 218, 185, 0.5) 52%, rgba(61, 31, 43, 0.5) 100%)"
            : isPlum
              ? "radial-gradient(ellipse 85% 75% at 50% 30%, rgba(232, 93, 61, 0.4) 0%, rgba(46, 20, 32, 0.55) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 251, 245, 0.6) 0%, rgba(255, 232, 214, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* EmberParticles — ~46 tiny warm embers drifting slowly upward     */
/* with a gentle sideways sway and a flickering glow, drawn on one   */
/* canvas with a single rAF loop. Pointer-events-none and low        */
/* opacity, so it never hurts readability or performance. Respects   */
/* prefers-reduced-motion (renders one static frame instead of       */
/* animating). Used on the cover and the countdown band.             */
/* ------------------------------------------------------------------ */

interface EmberParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  hue: number;
}

export function EmberParticles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: EmberParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.9 + Math.random() * 2.4,
        speed: 0.1 + Math.random() * 0.32,
        sway: 0.2 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.22 + Math.random() * 0.55,
        hue: Math.random(),
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2200 + p.phase) * p.sway * 16;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const flicker = 0.7 + 0.3 * Math.sin(t / 700 + p.phase * 3);
        const color =
          p.hue > 0.66
            ? `255, 218, 185`
            : p.hue > 0.33
              ? `255, 165, 120`
              : `255, 127, 80`;
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${(p.alpha * flicker).toFixed(3)})`;
        ctx.shadowColor = `rgba(255, 127, 80, 0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
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
/* SunDisc — a coral sun: a glowing disc with 24 radiating rays.    */
/* The live monogram sits in the centre as HTML text (see Cover).   */
/* ------------------------------------------------------------------ */

export function SunDisc({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * 360) / 24;
    const long = i % 2 === 0;
    const r1 = long ? 84 : 87;
    const r2 = long ? 100 : 95;
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
      <defs>
        <radialGradient id="cs-sun-core" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#FFE8D6" />
          <stop offset="45%" stopColor="#FFB38A" />
          <stop offset="100%" stopColor="#FF7F50" />
        </radialGradient>
      </defs>
      {rays.map((ray, i) => (
        <line
          key={i}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          stroke="#FFDAB9"
          strokeWidth={ray.long ? 2.6 : 1.5}
          strokeLinecap="round"
        />
      ))}
      <circle cx="100" cy="100" r="78" fill="url(#cs-sun-core)" />
      <circle cx="100" cy="100" r="78" stroke="#E85D3D" strokeWidth="1.4" />
      <circle cx="100" cy="100" r="70" stroke="#FFF6EE" strokeWidth="0.9" opacity="0.65" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SunsetDivider — a small coral sun disc with rays between two      */
/* coral hairlines, for card dividers.                               */
/* ------------------------------------------------------------------ */

export function SunsetDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#E85D3D" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#E85D3D" strokeWidth="1.2" />
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
            stroke="#E85D3D"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="90" cy="17" r="6.5" fill="#FF7F50" stroke="#C94A2E" strokeWidth="1" />
    </svg>
  );
}
