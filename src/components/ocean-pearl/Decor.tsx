// Ocean Pearl decorations — PaperSurface (pearl / aqua / deep-sea),
// RisingBubbles (lightweight canvas bubble layer, ~36 bubbles),
// WaveDivider (a wave line for cards) and the ShellSeal SVG (the
// live shell seal — never baked into the artwork). Font classes are
// the scoped .op-* variants from globals.css (never the bare source
// class names, which would collide with other templates). The .op-*
// classes are added by the coordinator — see
// ~/workspace/ocean-pearl-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "aqua" | "pearl" | "deep";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isAqua = variant === "aqua";
  const isDeep = variant === "deep";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isAqua
          ? "bg-[#2E8B9A] text-[#F7FBFC]"
          : isDeep
            ? "bg-[#0E3A45] text-[#F7FBFC]"
            : "bg-[#F7FBFC] text-[#0E3A45]"
      } ${className}`}
    >
      {/* Soft directional light — a pale aqua glow for aqua, a low
          teal glow for deep-sea (kept dark so pearl type stays
          high-contrast), a soft pearl vignette for pearl. No photo
          texture here: the aqua band reads as shallow water, the
          pearl as sea foam, the deep-sea as open water. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isAqua
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(127, 196, 206, 0.5) 0%, rgba(46, 139, 154, 0.55) 55%, rgba(14, 58, 69, 0.72) 100%)"
            : isDeep
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(31, 107, 120, 0.4) 0%, rgba(14, 58, 69, 0.55) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.6) 0%, rgba(216, 237, 239, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* RisingBubbles — ~36 small bubbles rising slowly with a gentle    */
/* sideways wobble, drawn on one canvas with a single rAF loop.     */
/* Pointer-events-none and low opacity, so it never hurts           */
/* readability or performance. Respects prefers-reduced-motion      */
/* (renders one static frame instead of animating). Used on the     */
/* cover only — the one place the brief asks for it.                 */
/* ------------------------------------------------------------------ */

interface BubbleParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  wobble: number;
  phase: number;
  alpha: number;
}

export function RisingBubbles({ className = "" }: { className?: string }) {
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
        r: 1.5 + Math.random() * 4.5,
        speed: 0.12 + Math.random() * 0.35,
        wobble: 0.3 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.45,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2000 + p.phase) * p.wobble * 12;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 24);
        const wrappedY = y < -12 ? y + h + 24 : y;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 1100 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, wrappedY, p.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(247, 251, 252, ${(p.alpha * twinkle).toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        // Tiny highlight so the bubble reads as a bubble, not a dot.
        ctx.beginPath();
        ctx.arc(x - p.r * 0.35, wrappedY - p.r * 0.35, p.r * 0.22, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * 0.7 * twinkle).toFixed(3)})`;
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
/* WaveDivider — a small wave line between two aqua hairlines, for  */
/* card dividers.                                                     */
/* ------------------------------------------------------------------ */

export function WaveDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="58" y2="17" stroke="#2E8B9A" strokeWidth="1.2" />
      <line x1="122" y1="17" x2="180" y2="17" stroke="#2E8B9A" strokeWidth="1.2" />
      <path
        d="M62 17 Q70 8 78 17 T94 17 T110 17"
        stroke="#2E8B9A"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="86" cy="17" r="3.5" fill="#2E8B9A" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* ShellSeal — a scallop shell drawn as SVG (fan of ridges inside a  */
/* circle), the live shell seal for the envelope button. The          */
/* monogram sits in the centre as HTML text (see Envelope).          */
/* ------------------------------------------------------------------ */

export function ShellSeal({ className = "" }: { className?: string }) {
  const ridges = Array.from({ length: 9 }, (_, i) => {
    const angle = -70 + i * 17.5;
    const rad = (angle * Math.PI) / 180;
    return {
      x2: 100 + 62 * Math.sin(rad),
      y2: 108 - 62 * Math.cos(rad),
    };
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="86" stroke="#2E8B9A" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="79" stroke="#7FC4CE" strokeWidth="0.8" opacity="0.8" />
      {ridges.map((r, i) => (
        <line
          key={i}
          x1="100"
          y1="112"
          x2={r.x2}
          y2={r.y2}
          stroke="#2E8B9A"
          strokeWidth={i === 4 ? 2.2 : 1.4}
          strokeLinecap="round"
          opacity={0.85}
        />
      ))}
      <path
        d="M38 112 Q100 158 162 112 Q100 128 38 112 Z"
        fill="#2E8B9A"
        opacity="0.18"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CoverWave — the wave-shaped divider at the bottom of the cover:   */
/* two overlapping sine waves in pearl, so the cover dissolves into  */
/* the pearl invitation below it instead of ending in a hard line.   */
/* ------------------------------------------------------------------ */

export function CoverWave({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[64px] w-full ${className}`}
    >
      <path
        d="M0 70 Q120 30 240 62 T480 58 T720 66 T960 56 T1200 64 T1440 58 V120 H0 Z"
        fill="#F7FBFC"
        opacity="0.55"
      />
      <path
        d="M0 88 Q120 58 240 82 T480 78 T720 86 T960 76 T1200 84 T1440 78 V120 H0 Z"
        fill="#F7FBFC"
      />
    </svg>
  );
}
