// Desert Dusk decorations — PaperSurface (sand / cream / dusk /
// terra), SandMotes (lightweight canvas particle layer, ~46
// wind-blown sand motes drifting sideways), DuneDivider (a small
// sun disc with rays between two terracotta hairlines), DuneRidge
// (layered dune curves for section transitions) and SunEmblem.
// Font classes are the scoped .dd-* variants from globals.css
// (never the bare source class names, which would collide with
// other templates). The .dd-* classes are added by the coordinator
// — same block as Golden Hour's .gh-* classes, dd- prefix, same
// font vars (Cinzel / Great Vibes / Cormorant Garamond / Lora).
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface PaperSurfaceProps {
  variant: "sand" | "cream" | "dusk" | "terra";
  className?: string;
  children: ReactNode;
  id?: string;
}

export function PaperSurface({ variant, className = "", children, id }: PaperSurfaceProps) {
  const isDusk = variant === "dusk";
  const isTerra = variant === "terra";
  const isSand = variant === "sand";

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${
        isDusk
          ? "bg-[#3D2133] text-[#FFF8EC]"
          : isTerra
            ? "bg-[#8A4A22] text-[#FFF8EC]"
            : isSand
              ? "bg-[#F5E6D3] text-[#3A2A20]"
              : "bg-[#FFF8EC] text-[#3A2A20]"
      } ${className}`}
    >
      {/* Warm directional light — dusk glow for dusk, terracotta
          glow for terra, soft sand vignette for sand, warm paper
          for cream. Dusk stays dark so cream type stays
          high-contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDusk
            ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(107, 58, 92, 0.55) 0%, rgba(61, 33, 51, 0.6) 100%)"
            : isTerra
              ? "radial-gradient(ellipse 85% 75% at 50% 38%, rgba(217, 160, 91, 0.5) 0%, rgba(138, 74, 34, 0.55) 55%, rgba(92, 64, 48, 0.6) 100%)"
              : isSand
                ? "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 248, 236, 0.65) 0%, rgba(232, 211, 179, 0.5) 100%)"
                : "radial-gradient(ellipse 90% 80% at 50% 45%, rgba(255, 253, 246, 0.6) 0%, rgba(245, 230, 211, 0.5) 100%)",
        }}
      />

      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* SandMotes — ~46 tiny terracotta-gold motes drifting sideways     */
/* with the desert wind, drawn on one canvas with a single rAF      */
/* loop. Pointer-events-none and low opacity, so it never hurts     */
/* readability or performance. Respects prefers-reduced-motion      */
/* (renders one static frame instead of animating). Used on the     */
/* cover and the dusk countdown band.                                */
/* ------------------------------------------------------------------ */

interface MoteParticle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  alpha: number;
}

export function SandMotes({ className = "" }: { className?: string }) {
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
      particles = Array.from({ length: 46 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 2.0,
        speed: 0.12 + Math.random() * 0.4,
        drift: 0.3 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.18 + Math.random() * 0.5,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // Wind blows left-to-right with a gentle vertical bob.
        const x = p.x + ((t / 1000) * p.speed * 14) % (w + 20);
        const wrappedX = x > w + 10 ? x - w - 20 : x;
        const y = p.y + Math.sin(t / 2600 + p.phase) * p.drift * 10;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 900 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(wrappedX, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 211, 179, ${(p.alpha * twinkle).toFixed(3)})`;
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
/* DuneDivider — a small sun disc with rays between two terracotta  */
/* hairlines, for card dividers.                                     */
/* ------------------------------------------------------------------ */

export function DuneDivider({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 180 34" fill="none" className={`mx-auto ${className}`}>
      <line x1="0" y1="17" x2="66" y2="17" stroke="#C2703D" strokeWidth="1.2" />
      <line x1="114" y1="17" x2="180" y2="17" stroke="#C2703D" strokeWidth="1.2" />
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
            stroke="#C2703D"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="90" cy="17" r="6.5" fill="#D9A05B" stroke="#8A4A22" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SunEmblem — a setting-sun disc half-sunk behind a dune ridge,    */
/* for the cover's lower edge and the footer.                        */
/* ------------------------------------------------------------------ */

export function SunEmblem({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={className}>
      <circle cx="100" cy="72" r="34" fill="#D9A05B" />
      {Array.from({ length: 12 }, (_, i) => {
        const angle = Math.PI + (i * Math.PI) / 11;
        const rad = angle;
        return (
          <line
            key={i}
            x1={100 + 42 * Math.cos(rad)}
            y1={72 + 42 * Math.sin(rad)}
            x2={100 + 52 * Math.cos(rad)}
            y2={72 + 52 * Math.sin(rad)}
            stroke="#D9A05B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      <path
        d="M0 96 Q 50 78 100 92 T 200 88 V 120 H 0 Z"
        fill="#8A4A22"
        opacity="0.85"
      />
      <path
        d="M0 106 Q 60 92 120 102 T 200 100 V 120 H 0 Z"
        fill="#3D2133"
        opacity="0.9"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* DuneRidge — two layered dune curves, used as a section divider   */
/* between the sand invitation body and the dusk countdown band.    */
/* ------------------------------------------------------------------ */

export function DuneRidge({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      fill="none"
      className={className}
    >
      <path
        d="M0 55 Q 240 20 480 48 T 960 42 T 1440 52 V 90 H 0 Z"
        fill="#E8D3B3"
      />
      <path
        d="M0 70 Q 300 42 620 64 T 1440 66 V 90 H 0 Z"
        fill="#F5E6D3"
      />
    </svg>
  );
}
