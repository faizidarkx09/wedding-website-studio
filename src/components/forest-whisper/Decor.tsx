// Forest Whisper decorations — PaperSurface (deep forest / cream /
// moss), Fireflies (lightweight canvas particle layer, warm
// green-gold fireflies), LeafCrest (a leaf-ring crest for the cover
// panel) and the LeafDivider. Font classes are the scoped .fw-*
// variants from globals.css (never the bare source class names,
// which would collide with other templates). The .fw-* classes are
// added by the coordinator — see
// ~/workspace/forest-whisper-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "forest" | "cream" | "moss";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isForest = variant === "forest";
  const isMoss = variant === "moss";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isForest
          ? "bg-[#1B4332] text-[#F4F1E6]"
          : isMoss
            ? "bg-[#6A994E] text-[#F4F1E6]"
            : "bg-[#F4F1E6] text-[#1B4332]"
      } ${className}`}
    >
      {/* Soft directional light — a moss glow for forest, a cream
          vignette for cream, a deep-green glow for moss (kept dark
          enough that cream type stays high-contrast). No photo
          texture here: the forest band reads as dusk under the
          canopy, the cream as paper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isForest
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(106, 153, 78, 0.35) 0%, rgba(27, 67, 50, 0.55) 55%, rgba(20, 48, 31, 0.75) 100%)"
            : isMoss
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(167, 201, 87, 0.45) 0%, rgba(106, 153, 78, 0.5) 55%, rgba(45, 106, 79, 0.65) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(251, 249, 241, 0.6) 0%, rgba(231, 234, 217, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fireflies — ~36 tiny warm green-gold fireflies drifting slowly    */
/* with a pulsing glow, drawn on one canvas with a single rAF loop.  */
/* Pointer-events-none and low opacity, so they never hurt           */
/* readability or performance. Respects prefers-reduced-motion       */
/* (renders one static frame instead of animating). Used on the      */
/* cover only — the one place the brief asks for it.                  */
/* ------------------------------------------------------------------ */

interface FireflyParticle {
  x: number;
  y: number;
  r: number;
  speedX: number;
  speedY: number;
  sway: number;
  phase: number;
  alpha: number;
}

export function Fireflies({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: FireflyParticle[] = [];
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
        r: 0.9 + Math.random() * 1.9,
        speedX: (Math.random() - 0.5) * 0.22,
        speedY: -0.05 - Math.random() * 0.18,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.55,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // Slow drift + sway; wrap around the edges so the field
        // never empties.
        const x = (((p.x + p.speedX * (t / 1000) * 10 + Math.sin(t / 2600 + p.phase) * p.sway * 16) % (w + 20)) + w + 20) % (w + 20) - 10;
        const y = (((p.y + p.speedY * (t / 1000) * 10) % (h + 20)) + h + 20) % (h + 20) - 10;
        // Firefly pulse: glow swells and fades on its own rhythm.
        const pulse = 0.5 + 0.5 * Math.sin(t / 1100 + p.phase * 3);
        const glow = p.alpha * (0.25 + 0.75 * pulse);
        ctx.beginPath();
        ctx.arc(x, y, p.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 240, 140, ${(glow * 0.16).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 245, 160, ${glow.toFixed(3)})`;
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
/* LeafCrest — a ring of leaves around a circle. The live monogram   */
/* sits in the centre as HTML text (see Cover).                       */
/* ------------------------------------------------------------------ */

export function LeafCrest({ className = "" }: { className?: string }) {
  const leaves = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 360) / 12;
    return angle;
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      {leaves.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 100 + 88 * Math.cos(rad);
        const cy = 100 + 88 * Math.sin(rad);
        return (
          <g key={i} transform={`rotate(${angle + 90} ${cx} ${cy})`}>
            <path
              d={`M ${cx} ${cy - 9} Q ${cx + 6} ${cy} ${cx} ${cy + 9} Q ${cx - 6} ${cy} ${cx} ${cy - 9} Z`}
              fill="#A7C957"
              opacity={i % 2 === 0 ? 0.95 : 0.6}
            />
          </g>
        );
      })}
      <circle cx="100" cy="100" r="78" stroke="#6A994E" strokeWidth="1.6" />
      <circle cx="100" cy="100" r="72" stroke="#A7C957" strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LeafDivider — a small leaf between two moss hairlines, for card   */
/* dividers.                                                          */
/* ------------------------------------------------------------------ */

export function LeafDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#6A994E" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#6A994E" strokeWidth="1.2" />
      <path
        d="M 90 7 Q 98 17 90 27 Q 82 17 90 7 Z"
        fill="#A7C957"
        stroke="#2D6A4F"
        strokeWidth="1"
      />
      <line x1="90" y1="8" x2="90" y2="26" stroke="#2D6A4F" strokeWidth="0.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* LeafSealMark — a single leaf for the leaf-seal button (see        */
/* Envelope). Drawn as SVG so the seal is live, never baked into    */
/* the artwork.                                                       */
/* ------------------------------------------------------------------ */

export function LeafSealMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M 24 6 Q 40 20 24 42 Q 8 20 24 6 Z"
        fill="#A7C957"
        stroke="#F4F1E6"
        strokeWidth="1.4"
      />
      <line x1="24" y1="10" x2="24" y2="38" stroke="#1B4332" strokeWidth="1.2" />
      <line x1="24" y1="18" x2="31" y2="24" stroke="#1B4332" strokeWidth="0.9" />
      <line x1="24" y1="18" x2="17" y2="24" stroke="#1B4332" strokeWidth="0.9" />
      <line x1="24" y1="27" x2="30" y2="32" stroke="#1B4332" strokeWidth="0.9" />
      <line x1="24" y1="27" x2="18" y2="32" stroke="#1B4332" strokeWidth="0.9" />
    </svg>
  );
}
