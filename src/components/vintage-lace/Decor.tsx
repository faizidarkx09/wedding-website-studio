// Vintage Lace decorations — PaperSurface (ivory linen / deep
// sepia / dusty rose), DustMotes (lightweight canvas particle
// layer, ~45 soft sepia-rose motes), LaceDivider, LaceCorner
// ornaments for the cover frame, and the LaceSeal doily (drawn SVG,
// never a baked-in image). Font classes are the scoped .vl-*
// variants defined by VintageLaceRenderer's self-contained <style>
// block (this template touches no shared file, so it cannot add
// classes to globals.css).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "ivory" | "sepia" | "rose";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isSepia = variant === "sepia";
  const isRose = variant === "rose";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isSepia
          ? "bg-[#4A3A2E] text-[#FDF8F0]"
          : isRose
            ? "bg-[#EAD3D3] text-[#4A3A2E]"
            : "bg-[#FDF8F0] text-[#4A3A2E]"
      } ${className}`}
    >
      {/* Soft directional light — ivory linen glow, a low rose glow
          for sepia (kept dark so ivory type stays high-contrast),
          a pale rose wash for the rose band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isSepia
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(139, 115, 85, 0.38) 0%, rgba(74, 58, 46, 0.5) 100%)"
            : isRose
              ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 248, 0.55) 0%, rgba(234, 211, 211, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 248, 0.6) 0%, rgba(247, 235, 217, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* DustMotes — ~45 tiny sepia-rose dust motes drifting slowly        */
/* upward with a gentle sideways sway, drawn on one canvas with a    */
/* single rAF loop. Pointer-events-none and low opacity, so it never */
/* hurts readability or performance. Respects                        */
/* prefers-reduced-motion (renders one static frame instead of       */
/* animating). Used on the cover and the countdown band.              */
/* ------------------------------------------------------------------ */

interface MoteParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  rose: boolean;
}

export function DustMotes({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: MoteParticle[] = [];
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
        r: 0.8 + Math.random() * 2.0,
        speed: 0.06 + Math.random() * 0.24,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.16 + Math.random() * 0.45,
        rose: Math.random() < 0.35,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 14;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.rose
          ? `rgba(192, 138, 142, ${(p.alpha * twinkle).toFixed(3)})`
          : `rgba(180, 155, 125, ${(p.alpha * twinkle).toFixed(3)})`;
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
/* LaceDivider — a small lace rosette between two sepia hairlines,   */
/* for card dividers.                                                 */
/* ------------------------------------------------------------------ */

export function LaceDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="62" y2="17" stroke="#8B7355" strokeWidth="1.2" />
      <line x1="118" y1="17" x2="180" y2="17" stroke="#8B7355" strokeWidth="1.2" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 360) / 8;
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={i}
            cx={90 + 11 * Math.cos(rad)}
            cy={17 + 11 * Math.sin(rad)}
            r="2.6"
            fill="#EAD3D3"
            stroke="#A66A6E"
            strokeWidth="1"
          />
        );
      })}
      <circle cx="90" cy="17" r="6" fill="#C08A8E" stroke="#8B7355" strokeWidth="1" />
      <circle cx="90" cy="17" r="2.2" fill="#FDF8F0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LaceCorner — one ornate lace corner ornament (a quarter fan of    */
/* scallops + dots). Four of them frame the cover photograph.         */
/* `flipX` / `flipY` mirror it into the other corners.                */
/* ------------------------------------------------------------------ */

export function LaceCorner({
  className = "",
  flipX = false,
  flipY = false,
}: {
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={{ transform: `scaleX(${flipX ? -1 : 1}) scaleY(${flipY ? -1 : 1})` }}
    >
      <path
        d="M4 60 V14 Q4 4 14 4 H60"
        stroke="#8B7355"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M10 60 V20 Q10 10 20 10 H60"
        stroke="#C08A8E"
        strokeWidth="1"
        opacity="0.8"
      />
      {[0, 1, 2, 3].map((i) => {
        const a = (18 + i * 18) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={30 + 20 * Math.cos(a)}
            cy={30 + 20 * Math.sin(a)}
            r="2.4"
            fill="#EAD3D3"
            stroke="#A66A6E"
            strokeWidth="0.8"
          />
        );
      })}
      <circle cx="14" cy="14" r="3.4" fill="#C08A8E" stroke="#8B7355" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LaceSeal — a crocheted-lace doily seal: scalloped outer ring,    */
/* dashed inner ring, rose centre with a heart. Drawn SVG so the    */
/* seal is crisp at every size and never baked into the envelope    */
/* photograph.                                                        */
/* ------------------------------------------------------------------ */

export function LaceSeal({ className = "" }: { className?: string }) {
  const scallops = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    const rad = (angle * Math.PI) / 180;
    return { cx: 100 + 88 * Math.cos(rad), cy: 100 + 88 * Math.sin(rad) };
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {scallops.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r="11" fill="#FFFDF8" stroke="#8B7355" strokeWidth="1.4" />
      ))}
      <circle cx="100" cy="100" r="80" fill="#FFFDF8" stroke="#8B7355" strokeWidth="1.6" />
      <circle
        cx="100"
        cy="100"
        r="68"
        stroke="#C08A8E"
        strokeWidth="1.2"
        strokeDasharray="4 5"
      />
      <circle cx="100" cy="100" r="52" fill="#EAD3D3" stroke="#A66A6E" strokeWidth="1" />
      {/* Heart */}
      <path
        d="M100 124 C78 108 74 88 86 78 C94 71 102 76 100 84 C98 76 106 71 114 78 C126 88 122 108 100 124 Z"
        fill="#A66A6E"
      />
      <circle cx="100" cy="100" r="52" stroke="#8B7355" strokeWidth="0.6" opacity="0.5" />
    </svg>
  );
}
