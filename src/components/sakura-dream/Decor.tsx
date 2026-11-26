// Sakura Dream decorations — PaperSurface (blush pink / white /
// deep plum), SakuraPetals (lightweight canvas particle layer of
// falling sakura petals), BlossomBranch (an SVG sakura branch for
// the cover's circle frame), PetalDivider and FanPleats (folding-fan
// pleat header for the details panels). Font classes are the scoped
// .sd-* variants from globals.css (never the bare source class
// names, which would collide with other templates). The .sd-*
// classes are added by the coordinator — see
// ~/workspace/sakura-dream-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "blush" | "cream" | "plum";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isPlum = variant === "plum";
  const isBlush = variant === "blush";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isPlum
          ? "bg-[#6B21A8] text-[#FFF7FB]"
          : isBlush
            ? "bg-[#FDF2F8] text-[#2E0A3D]"
            : "bg-[#FFF7FB] text-[#2E0A3D]"
      } ${className}`}
    >
      {/* Soft directional light — pink glow for blush, soft cream
          vignette for cream, a low plum glow for the plum band (kept
          dark so cream type stays high-contrast). No photo texture
          here: the blush band reads as spring light, the cream as
          petal paper, the plum as evening under the blossoms. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isPlum
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(236, 72, 153, 0.38) 0%, rgba(107, 33, 168, 0.55) 55%, rgba(46, 10, 61, 0.72) 100%)"
            : isBlush
              ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.6) 0%, rgba(251, 207, 232, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 251, 0.6) 0%, rgba(253, 242, 248, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SakuraPetals — ~36 small pink petals drifting slowly downward    */
/* with a gentle sideways sway and slow rotation, drawn on one      */
/* canvas with a single rAF loop. Pointer-events-none and low        */
/* opacity, so it never hurts readability or performance. Respects  */
/* prefers-reduced-motion (renders one static frame instead of      */
/* animating). Used on the cover and the plum countdown band.        */
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
}

export function SakuraPetals({ className = "" }: { className?: string }) {
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
        r: 3 + Math.random() * 4.5,
        speed: 0.12 + Math.random() * 0.3,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.45,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0012,
      }));
    };

    // A sakura petal: a small notched ellipse (two arcs meeting at a
    // point at the top, rounded at the bottom).
    const drawPetal = (p: PetalParticle, t: number) => {
      const x = p.x + Math.sin(t / 2600 + p.phase) * p.sway * 18;
      const y = (p.y + (t / 1000) * p.speed * 12) % (h + 24);
      const wrappedY = y > h + 12 ? y - h - 24 : y;
      const twinkle = 0.8 + 0.2 * Math.sin(t / 1100 + p.phase * 3);
      ctx.save();
      ctx.translate(x, wrappedY);
      ctx.rotate(p.rot + t * p.rotSpeed);
      ctx.beginPath();
      ctx.moveTo(0, -p.r);
      ctx.bezierCurveTo(p.r * 0.9, -p.r * 0.4, p.r * 0.9, p.r * 0.7, 0, p.r);
      ctx.bezierCurveTo(-p.r * 0.9, p.r * 0.7, -p.r * 0.9, -p.r * 0.4, 0, -p.r);
      ctx.fillStyle = `rgba(249, 168, 212, ${(p.alpha * twinkle).toFixed(3)})`;
      ctx.fill();
      ctx.restore();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) drawPetal(p, t);
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
/* Blossom — one five-petalled sakura blossom, drawn as SVG. Used   */
/* by the cover frame, the seal, the dividers and the petal path.    */
/* ------------------------------------------------------------------ */

export function Blossom({
  className = "",
  fill = "#F9A8D4",
  center = "#FDE68A",
}: {
  className?: string;
  fill?: string;
  center?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className={className}>
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const cx = 20 + 8.5 * Math.cos(angle);
        const cy = 20 + 8.5 * Math.sin(angle);
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx="6.4"
            ry="8.6"
            fill={fill}
            transform={`rotate(${(i * 72).toFixed(1)} ${cx.toFixed(2)} ${cy.toFixed(2)})`}
          />
        );
      })}
      <circle cx="20" cy="20" r="3.4" fill={center} />
      {Array.from({ length: 5 }, (_, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={20 + 5.6 * Math.cos(angle)}
            cy={20 + 5.6 * Math.sin(angle)}
            r="0.9"
            fill="#6B21A8"
            opacity="0.55"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* BlossomBranch — a curved sakura branch with blossoms and buds,   */
/* for framing the cover's circle photo. Rendered twice (mirrored)  */
/* so the branches meet over the top of the circle.                  */
/* ------------------------------------------------------------------ */

export function BlossomBranch({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 220 120" fill="none" className={className}>
      <path
        d="M6 112 C 60 92, 120 78, 214 22"
        stroke="#5B2A6E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M52 100 C 70 78, 78 66, 84 44"
        stroke="#5B2A6E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M128 70 C 146 52, 158 40, 176 26"
        stroke="#5B2A6E"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Blossoms along the branch */}
      <g>
        <circle cx="42" cy="104" r="9" fill="#F9A8D4" />
        <circle cx="42" cy="104" r="3" fill="#FDE68A" />
        <circle cx="88" cy="82" r="11" fill="#FBCFE8" />
        <circle cx="88" cy="82" r="3.4" fill="#FDE68A" />
        <circle cx="140" cy="62" r="10" fill="#F9A8D4" />
        <circle cx="140" cy="62" r="3.2" fill="#FDE68A" />
        <circle cx="196" cy="30" r="12" fill="#FBCFE8" />
        <circle cx="196" cy="30" r="3.6" fill="#FDE68A" />
        <circle cx="84" cy="44" r="8" fill="#F9A8D4" />
        <circle cx="84" cy="44" r="2.6" fill="#FDE68A" />
        <circle cx="176" cy="26" r="8" fill="#F9A8D4" />
        <circle cx="176" cy="26" r="2.6" fill="#FDE68A" />
      </g>
      {/* Buds */}
      <circle cx="66" cy="92" r="3.4" fill="#EC4899" />
      <circle cx="112" cy="72" r="3" fill="#EC4899" />
      <circle cx="160" cy="46" r="3.4" fill="#EC4899" />
      <circle cx="212" cy="20" r="3" fill="#EC4899" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* PetalDivider — a small blossom between two pink hairlines, for   */
/* card dividers.                                                    */
/* ------------------------------------------------------------------ */

export function PetalDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`mx-auto flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#EC4899]/80" />
      <Blossom className="h-6 w-6" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#EC4899]/80" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FanPleats — the folding-fan pleat header for a details panel: a  */
/* semicircle of radiating pleats over a fan pivot.                  */
/* ------------------------------------------------------------------ */

export function FanPleats({ className = "" }: { className?: string }) {
  const pleats = Array.from({ length: 9 }, (_, i) => {
    const angle = (-80 + i * 20) * (Math.PI / 180);
    return {
      x2: 100 + 62 * Math.cos(angle),
      y2: 92 + 62 * Math.sin(angle),
    };
  });
  return (
    <svg aria-hidden="true" viewBox="0 0 200 100" fill="none" className={className}>
      <path d="M 20 92 A 80 80 0 0 1 180 92 Z" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.4" />
      {pleats.map((p, i) => (
        <line
          key={i}
          x1="100"
          y1="92"
          x2={p.x2}
          y2={p.y2}
          stroke="#EC4899"
          strokeWidth="1.1"
          opacity="0.65"
        />
      ))}
      <circle cx="100" cy="92" r="7" fill="#6B21A8" />
      <circle cx="100" cy="92" r="3" fill="#FDE68A" />
    </svg>
  );
}
