// Autumn Harvest decorations — PaperSurface (burnt-orange / warm
// cream / deep-brown), FallingLeaves (lightweight canvas particle
// layer, ~26 drifting maple leaves), LeafWreath (leaf-ring crest
// for the cover monogram), LeafDivider and LeafSeal (a live SVG
// maple-leaf wax seal — no seal image). Font classes are the scoped
// .ah-* variants (defined in the renderer's inline <style> until
// the coordinator moves them into globals.css — see
// ~/workspace/autumn-harvest-assets/templates-entry.txt).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "orange" | "cream" | "brown";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isOrange = variant === "orange";
  const isBrown = variant === "brown";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isOrange
          ? "bg-[#C05621] text-[#FFF7E8]"
          : isBrown
            ? "bg-[#3A2412] text-[#FFF7E8]"
            : "bg-[#FFF7E8] text-[#5C3A21]"
      } ${className}`}
    >
      {/* Warm directional light — amber glow for orange, soft cream
          vignette for cream, a low ember glow for brown (kept dark
          so cream type stays high-contrast). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isOrange
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(232, 160, 92, 0.55) 0%, rgba(156, 61, 18, 0.55) 55%, rgba(58, 36, 18, 0.6) 100%)"
            : isBrown
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(192, 86, 33, 0.35) 0%, rgba(58, 36, 18, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.6) 0%, rgba(251, 238, 211, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FallingLeaves — ~26 small maple leaves drifting slowly downward   */
/* with a gentle sideways sway and slow rotation, drawn on one       */
/* canvas with a single rAF loop. Pointer-events-none and low        */
/* opacity, so it never hurts readability or performance. Respects   */
/* prefers-reduced-motion (renders one static frame instead of       */
/* animating). Used on the cover and the countdown band.             */
/* ------------------------------------------------------------------ */

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  rotSpeed: number;
  alpha: number;
  color: string;
}

const LEAF_COLORS = ["#C05621", "#D98E32", "#E8A05C", "#9C3D12", "#B96A2E"];

function drawLeaf(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rot: number,
  color: string,
  alpha: number,
) {
  // A simple 5-lobed maple leaf: five ellipses fanning from a stem.
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  for (let i = -2; i <= 2; i++) {
    const angle = (i * Math.PI) / 5;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.55, size * 0.22, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.24, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function FallingLeaves({ className = "" }: { className?: string }) {
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
      leaves = Array.from({ length: 26 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 5 + Math.random() * 8,
        speed: 0.12 + Math.random() * 0.3,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0012,
        alpha: 0.25 + Math.random() * 0.45,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const leaf of leaves) {
        const x = leaf.x + Math.sin(t / 2600 + leaf.phase) * leaf.sway * 18;
        const y = (leaf.y + ((t / 1000) * leaf.speed * 10) % (h + 24)) % (h + 24);
        const wrappedY = y < -12 ? y + h + 24 : y;
        const rot = leaf.phase + t * leaf.rotSpeed;
        drawLeaf(ctx, x, wrappedY, leaf.size, rot, leaf.color, leaf.alpha);
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
/* LeafWreath — a ring of small maple leaves around a centre disc,  */
/* for the cover monogram. The live monogram sits in the centre as   */
/* HTML text (see Cover).                                            */
/* ------------------------------------------------------------------ */

export function LeafWreath({ className = "" }: { className?: string }) {
  const leaves = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 360) / 12;
    const rad = (angle * Math.PI) / 180;
    return {
      x: 100 + 84 * Math.cos(rad),
      y: 100 + 84 * Math.sin(rad),
      rot: angle + 90,
      color: i % 3 === 0 ? "#9C3D12" : i % 3 === 1 ? "#C05621" : "#D98E32",
    };
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      <circle cx="100" cy="100" r="70" stroke="#C05621" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="64" stroke="#D98E32" strokeWidth="0.8" opacity="0.7" />
      {leaves.map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot})`}>
          <path
            d="M0 -11 C 5 -6, 5 4, 0 11 C -5 4, -5 -6, 0 -11 Z"
            fill={leaf.color}
            opacity="0.9"
          />
          <line x1="0" y1="-11" x2="0" y2="13" stroke="#5C3A21" strokeWidth="0.8" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LeafDivider — a small maple leaf between two burnt-orange         */
/* hairlines, for card dividers.                                     */
/* ------------------------------------------------------------------ */

export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#C05621" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#C05621" strokeWidth="1.2" />
      <g transform="translate(90 17)">
        <path
          d="M0 -11 C 5 -6, 5 4, 0 11 C -5 4, -5 -6, 0 -11 Z"
          fill="#C05621"
        />
        <path
          d="M-10 -4 C -5 -6, -2 0, -1 7 C -6 5, -9 1, -10 -4 Z"
          fill="#D98E32"
        />
        <path
          d="M10 -4 C 5 -6, 2 0, 1 7 C 6 5, 9 1, 10 -4 Z"
          fill="#D98E32"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LeafSeal — the burnt-orange wax seal: a maple leaf embossed on a  */
/* radial-gradient wax disc, drawn as pure SVG/CSS (no image). The   */
/* seal is the envelope's open button.                               */
/* ------------------------------------------------------------------ */

export function LeafSeal({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 96 96" fill="none" className={className}>
      <defs>
        <radialGradient id="ah-wax" cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#E8A05C" />
          <stop offset="55%" stopColor="#C05621" />
          <stop offset="100%" stopColor="#9C3D12" />
        </radialGradient>
      </defs>
      <circle cx="48" cy="48" r="46" fill="url(#ah-wax)" />
      <circle cx="48" cy="48" r="40" stroke="#FFF7E8" strokeWidth="1" opacity="0.35" />
      <circle cx="48" cy="48" r="46" stroke="#7A2E0D" strokeWidth="1" opacity="0.5" />
      <g transform="translate(48 50)">
        <path
          d="M0 -22 C 8 -12, 10 6, 0 22 C -10 6, -8 -12, 0 -22 Z"
          fill="#FFF7E8"
          opacity="0.92"
        />
        <path
          d="M-18 -8 C -8 -12, -3 -2, -2 12 C -10 8, -16 0, -18 -8 Z"
          fill="#FFF7E8"
          opacity="0.85"
        />
        <path
          d="M18 -8 C 8 -12, 3 -2, 2 12 C 10 8, 16 0, 18 -8 Z"
          fill="#FFF7E8"
          opacity="0.85"
        />
        <line x1="0" y1="-22" x2="0" y2="28" stroke="#C05621" strokeWidth="1.4" opacity="0.7" />
      </g>
    </svg>
  );
}
