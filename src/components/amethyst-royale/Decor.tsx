// Amethyst Royale decorations — PaperSurface (deep amethyst /
// lavender / white), CrystalSparkles (lightweight canvas particle
// layer, ~45 twinkling 4-point crystal sparkles), CrystalCrest (a
// faceted hexagonal gem — the live monogram sits in its centre as
// HTML text, see Cover), FacetDivider (a small diamond between two
// amethyst hairlines) and FacetCluster (the cover's geometric
// crystal-facet overlay). Font classes are the scoped .ar-* variants
// from globals.css (never the bare source class names, which would
// collide with other templates). The .ar-* classes are added by the
// coordinator — see ~/workspace/amethyst-royale-assets/templates-entry.txt.
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "amethyst" | "lavender" | "white";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isAmethyst = variant === "amethyst";
  const isLavender = variant === "lavender";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isAmethyst
          ? "bg-[#4C1D95] text-[#F5F0FA]"
          : isLavender
            ? "bg-[#F5F0FA] text-[#2E1065]"
            : "bg-[#FFFDFF] text-[#2E1065]"
      } ${className}`}
    >
      {/* Directional light — a violet glow for amethyst (kept dark so
          lavender type stays high-contrast), a soft lilac vignette
          for lavender, a faint crystal sheen for white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isAmethyst
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(124, 58, 237, 0.55) 0%, rgba(76, 29, 149, 0.55) 55%, rgba(46, 16, 101, 0.72) 100%)"
            : isLavender
              ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 255, 0.6) 0%, rgba(233, 213, 255, 0.5) 100%)"
              : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 255, 255, 0.5) 0%, rgba(243, 232, 255, 0.45) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CrystalSparkles — ~45 tiny 4-point crystal sparkles drifting      */
/* slowly upward with a gentle sideways sway and a twinkle, drawn on */
/* one canvas with a single rAF loop. Pointer-events-none and low     */
/* opacity, so it never hurts readability or performance. Respects    */
/* prefers-reduced-motion (renders one static frame instead of        */
/* animating). Used on the cover only.                                */
/* ------------------------------------------------------------------ */

interface SparkleParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
}

export function CrystalSparkles({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let particles: SparkleParticle[] = [];
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
        r: 1.1 + Math.random() * 2.6,
        speed: 0.08 + Math.random() * 0.28,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.55,
      }));
    };

    // A 4-point crystal star: two thin diamonds crossed.
    const drawSparkle = (x: number, y: number, r: number, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.8);
      ctx.lineTo(x + r * 0.42, y - r * 0.42);
      ctx.lineTo(x + r * 1.8, y);
      ctx.lineTo(x + r * 0.42, y + r * 0.42);
      ctx.lineTo(x, y + r * 1.8);
      ctx.lineTo(x - r * 0.42, y + r * 0.42);
      ctx.lineTo(x - r * 1.8, y);
      ctx.lineTo(x - r * 0.42, y - r * 0.42);
      ctx.closePath();
      ctx.fillStyle = `rgba(233, 213, 255, ${alpha.toFixed(3)})`;
      ctx.fill();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2400 + p.phase) * p.sway * 14;
        const y = p.y - ((t / 1000) * p.speed * 10) % (h + 20);
        const wrappedY = y < -10 ? y + h + 20 : y;
        const twinkle = 0.7 + 0.3 * Math.sin(t / 900 + p.phase * 3);
        drawSparkle(x, wrappedY, p.r, p.alpha * twinkle);
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
/* CrystalCrest — a faceted hexagonal gem: an outer hexagon, an     */
/* inner hexagon, and facet lines radiating from the centre to the   */
/* corners. The live monogram sits in the centre as HTML text (see   */
/* Cover).                                                             */
/* ------------------------------------------------------------------ */

export function CrystalCrest({ className = "" }: { className?: string }) {
  // Flat-top hexagon corners (viewBox 200x200, centre 100,100, R 96).
  const corners = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    return { x: 100 + 96 * Math.cos(angle), y: 100 + 96 * Math.sin(angle) };
  });
  const inner = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 * Math.PI) / 180;
    return { x: 100 + 70 * Math.cos(angle), y: 100 + 70 * Math.sin(angle) };
  });
  const hexPoints = corners.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const innerPoints = inner.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");

  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className={className}>
      <polygon points={hexPoints} stroke="#E9D5FF" strokeWidth="1.8" />
      <polygon points={innerPoints} stroke="#C4B5FD" strokeWidth="0.9" opacity="0.75" />
      {corners.map((c, i) => (
        <line
          key={i}
          x1="100"
          y1="100"
          x2={c.x}
          y2={c.y}
          stroke="#A78BFA"
          strokeWidth="0.8"
          opacity="0.55"
        />
      ))}
      {/* Facet glints */}
      <polygon points="100,4 148,52 100,100 52,52" fill="#FFFFFF" opacity="0.08" />
      <polygon points="100,196 148,148 100,100 52,148" fill="#7C3AED" opacity="0.18" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* FacetDivider — a small faceted diamond between two amethyst       */
/* hairlines, for card dividers.                                      */
/* ------------------------------------------------------------------ */

export function FacetDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#7C3AED" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#7C3AED" strokeWidth="1.2" />
      <polygon points="90,4 101,17 90,30 79,17" fill="#E9D5FF" stroke="#5B21B6" strokeWidth="1.2" />
      <line x1="90" y1="4" x2="90" y2="30" stroke="#5B21B6" strokeWidth="0.8" opacity="0.6" />
      <line x1="79" y1="17" x2="101" y2="17" stroke="#5B21B6" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* FacetCluster — the cover's geometric crystal-facet overlay:       */
/* translucent lavender facet polygons clustered in the corners,     */
/* over the photograph, so the couple shows through the middle.      */
/* Pure SVG, no image asset.                                          */
/* ------------------------------------------------------------------ */

export function FacetCluster({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {/* Top-left cluster */}
      <polygon points="0,0 26,0 14,18 0,12" fill="#E9D5FF" opacity="0.16" />
      <polygon points="0,12 14,18 6,34 0,30" fill="#C4B5FD" opacity="0.14" />
      <polygon points="26,0 38,0 30,12 14,18" fill="#FFFFFF" opacity="0.12" />
      {/* Top-right cluster */}
      <polygon points="100,0 74,0 86,18 100,12" fill="#E9D5FF" opacity="0.16" />
      <polygon points="100,12 86,18 94,34 100,30" fill="#C4B5FD" opacity="0.14" />
      <polygon points="74,0 62,0 70,12 86,18" fill="#FFFFFF" opacity="0.12" />
      {/* Bottom-left cluster */}
      <polygon points="0,100 24,100 12,84 0,90" fill="#E9D5FF" opacity="0.14" />
      <polygon points="0,90 12,84 4,68 0,72" fill="#C4B5FD" opacity="0.12" />
      {/* Bottom-right cluster */}
      <polygon points="100,100 76,100 88,84 100,90" fill="#E9D5FF" opacity="0.14" />
      <polygon points="100,90 88,84 96,68 100,72" fill="#C4B5FD" opacity="0.12" />
      {/* Facet edge strokes */}
      <g stroke="#E9D5FF" strokeWidth="0.25" opacity="0.5" fill="none">
        <polyline points="0,0 26,0 14,18 0,12" />
        <polyline points="100,0 74,0 86,18 100,12" />
        <polyline points="0,100 24,100 12,84 0,90" />
        <polyline points="100,100 76,100 88,84 100,90" />
      </g>
    </svg>
  );
}
