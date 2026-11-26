// Tropical Palm decorations — PaperSurface (deep palm / sand /
// cream), FloatingLeaves (lightweight canvas particle layer, ~40
// drifting palm leaves), PalmCrest (palm-leaf ring) and the
// PalmDivider. Font classes are the scoped .tp-* variants from
// globals.css (never the bare source class names, which would
// collide with other templates). The .tp-* classes are added by the
// coordinator — see FONTS.txt in this folder.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "palm" | "sand" | "cream" | "teal";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const bg =
    variant === "palm"
      ? "bg-[#14532D] text-[#FFFBEB]"
      : variant === "teal"
        ? "bg-[#155E75] text-[#FFFBEB]"
        : variant === "sand"
          ? "bg-[#FDE68A] text-[#14301C]"
          : "bg-[#FFFBEB] text-[#14301C]";

  return (
    <section id={id} className={`relative overflow-hidden ${bg} ${className}`}>
      {/* Soft directional light — a low turquoise glow for palm, a
          warm sand glow for sand, a soft cream vignette for cream,
          a deep-sea glow for teal. Dark bands stay dark so cream
          type stays high-contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            variant === "palm"
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(21, 128, 61, 0.5) 0%, rgba(20, 83, 45, 0.55) 55%, rgba(10, 46, 25, 0.72) 100%)"
              : variant === "teal"
                ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(6, 182, 212, 0.35) 0%, rgba(21, 94, 117, 0.5) 55%, rgba(8, 47, 73, 0.72) 100%)"
                : variant === "sand"
                  ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(254, 243, 199, 0.65) 0%, rgba(253, 230, 138, 0.5) 100%)"
                  : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.6) 0%, rgba(254, 249, 195, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FloatingLeaves — ~40 small palm leaves drifting slowly downward   */
/* with a gentle sideways sway, drawn on one canvas with a single    */
/* rAF loop. Pointer-events-none and low opacity, so it never hurts  */
/* readability or performance. Respects prefers-reduced-motion      */
/* (renders one static frame instead of animating). Used on the     */
/* cover only — the one place the brief asks for it.                 */
/* ------------------------------------------------------------------ */

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  rot: number;
  rotSpeed: number;
}

export function FloatingLeaves({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let leaves: LeafParticle[] = [];
    let w = 0;
    let h = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      leaves = Array.from({ length: 40 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 5 + Math.random() * 9,
        speed: 0.06 + Math.random() * 0.22,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.16 + Math.random() * 0.42,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0006,
      }));
    };

    const drawLeaf = (x: number, y: number, size: number, rot: number, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.quadraticCurveTo(size * 0.9, -size * 0.2, 0, size);
      ctx.quadraticCurveTo(-size * 0.9, -size * 0.2, 0, -size);
      ctx.fillStyle = `rgba(187, 247, 208, ${alpha.toFixed(3)})`;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.strokeStyle = `rgba(21, 128, 61, ${(alpha * 0.8).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of leaves) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 16;
        const y = p.y + ((t / 1000) * p.speed * 10) % (h + 24);
        const wrappedY = y > h + 12 ? y - h - 24 : y;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        drawLeaf(x, wrappedY, p.size, p.rot + t * p.rotSpeed, p.alpha * twinkle);
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
/* PalmCrest — a ring of 16 palm fronds radiating outward. The live  */
/* monogram sits in the centre as HTML text (see Cover).              */
/* ------------------------------------------------------------------ */

export function PalmCrest({ className = "" }: { className?: string }) {
  const fronds = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * 360) / 16;
    const rad = (angle * Math.PI) / 180;
    const long = i % 2 === 0;
    const r1 = long ? 84 : 87;
    const r2 = long ? 99 : 95;
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
      {fronds.map((f, i) => (
        <line
          key={i}
          x1={f.x1}
          y1={f.y1}
          x2={f.x2}
          y2={f.y2}
          stroke="#4ADE80"
          strokeWidth={f.long ? 2.6 : 1.5}
          strokeLinecap="round"
        />
      ))}
      <circle cx="100" cy="100" r="80" stroke="#FDE68A" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="74" stroke="#06B6D4" strokeWidth="0.9" opacity="0.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* PalmDivider — a small palm frond between two sand hairlines, for  */
/* card dividers.                                                     */
/* ------------------------------------------------------------------ */

export function PalmDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#15803D" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#15803D" strokeWidth="1.2" />
      {/* Centre frond: a stem with leaflets */}
      <line x1="90" y1="26" x2="90" y2="8" stroke="#15803D" strokeWidth="1.4" strokeLinecap="round" />
      {[-1, 1].map((side) =>
        [0, 1, 2].map((j) => (
          <line
            key={`${side}-${j}`}
            x1={90}
            y1={11 + j * 5}
            x2={90 + side * (7 - j * 1.5)}
            y2={8 + j * 5}
            stroke="#15803D"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        )),
      )}
      <circle cx="90" cy="17" r="6.5" fill="#FDE68A" stroke="#15803D" strokeWidth="1" />
    </svg>
  );
}
