// Cinematic opening helpers for Starlight Noir — constellation
// draw + gold starlight. Phase 1 twinkling stars + a constellation
// slowly drawing itself (thin gold lines connecting stars); Phase 2
// constellation flare + burst of gold starlight + one slow pulse;
// Phase 3 two midnight panels part like night sky; Phase 4 gold
// star transition + light sweep + soft chime. The panels part to
// reveal the invitation CARD underneath — its BACK at rest, blurred
// night sky with the gold crest ("Tap to Reveal"); the guest then
// taps the card itself and its two back halves slide apart to
// reveal the front. There is no envelope anywhere in this opening:
// no envelope shape, no flap, no seal on an envelope. Web Audio SFX
// (star twinkle + reveal chime, synthesised — no audio files).
// Music is deliberately NOT included: no autoplay, the toggle
// controls SFX only. Everything here is transform/opacity (canvas
// excepted) and respects prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Twinkle = three soft high sine       */
/* plinks; chime = warm G-major arpeggio G4–B4–D5–G5, sine + soft   */
/* triangle octave, ~1.8s decay.                                    */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setCinematicSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export function isCinematicSoundEnabled() {
  return soundEnabled;
}

function ac(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function pluck(ctx: AudioContext, freq: number, t: number, peak: number, decay: number) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + decay + 0.05);
}

/** Star twinkle: three soft high plinks (E6–G6–B6), ~1s. */
export function playStarTwinkleSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    [1318.51, 1567.98, 1975.53].forEach((freq, i) => {
      pluck(ctx, freq, ctx.currentTime + i * 0.13, 0.06, 0.9);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Reveal chime: G4–B4–D5–G5, sine + soft triangle octave, ~1.8s decay. */
export function playStarChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [392.0, 493.88, 587.33, 783.99];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.16;
      pluck(ctx, freq, t, 0.1, 1.6);
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.03);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc2.start(t);
      osc2.stop(t + 1.3);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* StarlightCanvas — one canvas, one rAF loop. Ambient gold stars   */
/* twinkle slowly; a fixed constellation draws itself line by line  */
/* (autoDrawMs > 0 draws once from 0 → 1, 0 = fully drawn at once); */
/* when flareKey increments the constellation flares bright for     */
/* ~1.6s; when burstKey increments, ~40 gold starlight particles   */
/* burst from burstOrigin and fade over ~1.6s. Renders nothing at   */
/* all under prefers-reduced-motion.                                */
/* ------------------------------------------------------------------ */

interface AmbientStar {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  alpha: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  cross: boolean;
}

/** The Starlight Noir constellation — a sweeping arc of 8 stars
 * across the upper sky, like a crown tilted over the couple. */
const CONSTELLATION: Array<{ x: number; y: number; r: number }> = [
  { x: 0.1, y: 0.34, r: 2.4 },
  { x: 0.24, y: 0.18, r: 1.8 },
  { x: 0.4, y: 0.26, r: 2.6 },
  { x: 0.53, y: 0.12, r: 2.0 },
  { x: 0.67, y: 0.24, r: 2.8 },
  { x: 0.81, y: 0.16, r: 1.9 },
  { x: 0.91, y: 0.34, r: 2.2 },
  { x: 0.73, y: 0.46, r: 1.7 },
];

const CONSTELLATION_LINES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [4, 7],
  [2, 7],
];

export function StarlightCanvas({
  ambientStars = 0,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
  autoDrawMs = 0,
  flareKey = 0,
  className = "",
}: {
  ambientStars?: number;
  burstKey?: number;
  burstOrigin?: { x: number; y: number };
  autoDrawMs?: number;
  flareKey?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Props arrive via refs so the rAF loop (created once) sees
  // every increment; the *Seen refs track what it already fired.
  const burstKeyPropRef = useRef(burstKey);
  const flareKeyPropRef = useRef(flareKey);
  const burstSeenRef = useRef(0);
  const flareSeenRef = useRef(0);
  const originRef = useRef(burstOrigin);
  burstKeyPropRef.current = burstKey;
  flareKeyPropRef.current = flareKey;
  originRef.current = burstOrigin;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const startTime = performance.now();
    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: AmbientStar[] = [];
    let burst: BurstParticle[] = [];
    let flareStart = -1;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: ambientStars }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.1,
        alpha: 0.25 + Math.random() * 0.6,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 40 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 2.1;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.9,
          r: 0.8 + Math.random() * 2.0,
          life: 0,
          maxLife: 1000 + Math.random() * 700,
          cross: Math.random() < 0.3,
        };
      });
    };

    const drawStar = (x: number, y: number, r: number, alpha: number, cross: boolean) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 217, 140, ${alpha.toFixed(3)})`;
      ctx.fill();
      if (cross) {
        ctx.strokeStyle = `rgba(212, 175, 55, ${(alpha * 0.6).toFixed(3)})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(x - r * 3, y);
        ctx.lineTo(x + r * 3, y);
        ctx.moveTo(x, y - r * 3);
        ctx.lineTo(x, y + r * 3);
        ctx.stroke();
      }
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      // Ambient twinkling stars.
      for (const s of stars) {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 1000) * s.speed + s.phase));
        drawStar(s.x, s.y, s.r, s.alpha * twinkle, s.r > 1.9);
      }
      // Constellation draw progress: 0 → 1 over autoDrawMs, else 1.
      const progress =
        autoDrawMs > 0 ? Math.min(1, (t - startTime) / autoDrawMs) : 1;
      // Flare boost: 1 at the flare tap, decaying to 0 over ~1.6s.
      const flare =
        flareStart >= 0 ? Math.max(0, 1 - (t - flareStart) / 1600) : 0;
      const flareGlow = flare * flare;
      // Soft gold glow at the constellation's heart while flaring.
      if (flareGlow > 0.01) {
        const gx = 0.5 * w;
        const gy = 0.26 * h;
        const gr = Math.max(w, h) * 0.32;
        const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
        grad.addColorStop(0, `rgba(212, 175, 55, ${(0.5 * flareGlow).toFixed(3)})`);
        grad.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
      }
      // Constellation lines — each line draws over its own window.
      CONSTELLATION_LINES.forEach(([a, b], i) => {
        const s0 = i * 0.07;
        const p = Math.max(0, Math.min(1, (progress - s0) / 0.3));
        if (p <= 0) return;
        const ax = CONSTELLATION[a].x * w;
        const ay = CONSTELLATION[a].y * h;
        const bx = CONSTELLATION[b].x * w;
        const by = CONSTELLATION[b].y * h;
        ctx.strokeStyle = `rgba(212, 175, 55, ${(0.6 * p + 0.25 * flareGlow).toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + (bx - ax) * p, ay + (by - ay) * p);
        ctx.stroke();
      });
      // Constellation stars fade in as the draw reaches them.
      CONSTELLATION.forEach((s, i) => {
        const s0 = i * 0.07;
        const p = Math.max(0, Math.min(1, (progress - s0) / 0.2));
        if (p <= 0) return;
        const twinkle =
          0.75 + 0.25 * Math.sin(t / 900 + i * 1.7);
        drawStar(
          s.x * w,
          s.y * h,
          s.r * (1 + flareGlow * 0.9),
          Math.min(1, 0.9 * p * twinkle + flareGlow * 0.4),
          s.r >= 2.4
        );
      });
      // Gold starlight burst particles.
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0011 * dt;
        const k = 1 - b.life / b.maxLife;
        drawStar(b.x, b.y, b.r, 0.95 * k, b.cross);
      }
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      if (burstKeyPropRef.current !== burstSeenRef.current) {
        burstSeenRef.current = burstKeyPropRef.current;
        if (burstKeyPropRef.current > 0) spawnBurst();
      }
      if (flareKeyPropRef.current !== flareSeenRef.current) {
        flareSeenRef.current = flareKeyPropRef.current;
        if (flareKeyPropRef.current > 0) flareStart = t;
      }
      draw(t, dt);
      raf = requestAnimationFrame(tick);
    };

    seed();
    raf = requestAnimationFrame(tick);
    const onResize = () => seed();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientStars, autoDrawMs]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* SoundToggle — small discreet top-corner toggle, visible through   */
/* the whole sequence. Never autoplays; SFX start only after a tap.  */
/* ------------------------------------------------------------------ */

export function SoundToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={enabled ? "Sound on — tap to mute" : "Sound off — tap to unmute"}
      aria-pressed={enabled}
      title={enabled ? "Sound on (SFX)" : "Sound off"}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#0A0A0A]/80 text-[#F2D98C] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
      style={{ opacity: enabled ? 0.9 : 0.55 }}
    >
      {enabled ? (
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H2v6h4l5 4V5z" fill="currentColor" stroke="none" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* SkipButton — discreet bottom-corner jump straight to the          */
/* invitation, shown only while the cinematic is running.            */
/* ------------------------------------------------------------------ */

export function SkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#F2D98C]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
      style={{ fontFamily: "var(--font-cinzel), Georgia, 'Times New Roman', serif", opacity: 0.8 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* NightPanelsOverlay — Phase 3 + 4. Two midnight panels cover the  */
/* screen, then part sideways like night sky opening (translateX,   */
/* no rotation — unlike Blush's rotating paper panels) to reveal    */
/* the invitation card underneath, BACK at rest; on "fading" the    */
/* veil dissolves, a gold five-pointed star scales + fades at       */
/* centre, and a gold light sweep crosses, landing on the card.     */
/* The panels are night sky, not an envelope: no flap, no seal,     */
/* no envelope shape anywhere. Fixed positioning,                  */
/* pointer-events-none except for the Skip / sound controls.        */
/* ------------------------------------------------------------------ */

export type NightPanelsPhase = "closed" | "parting" | "fading";

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * 36 - 90) * (Math.PI / 180);
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/** A few static gold stars scattered on a midnight panel. */
function PanelStars() {
  const stars: Array<[number, number, number]> = [
    [18, 14, 2.2],
    [42, 30, 1.5],
    [64, 10, 1.9],
    [80, 42, 1.6],
    [30, 62, 1.8],
    [55, 74, 2.1],
    [76, 66, 1.4],
    [12, 86, 1.7],
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      {stars.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#F2D98C" opacity="0.75" />
      ))}
    </svg>
  );
}

export function NightPanelsOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: NightPanelsPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const parting = phase !== "closed";
  return (
    <div
      data-sn-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden bg-[#050505]"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Live starfield revealed as the panels part */}
        <StarlightCanvas ambientStars={48} autoDrawMs={0} className="z-0" />

        {/* Left midnight panel — parts leftward */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 z-10 w-1/2"
          style={{
            background:
              "linear-gradient(90deg, #050505 0%, #0A0A0A 70%, #141414 100%)",
          }}
          initial={{ x: 0 }}
          animate={{ x: parting ? "-102%" : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <PanelStars />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-10"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.35))" }}
          />
        </motion.div>

        {/* Right midnight panel — parts rightward */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 z-10 w-1/2"
          style={{
            background:
              "linear-gradient(270deg, #050505 0%, #0A0A0A 70%, #141414 100%)",
          }}
          initial={{ x: 0 }}
          animate={{ x: parting ? "102%" : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <PanelStars />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-10"
            style={{ background: "linear-gradient(270deg, transparent, rgba(212,175,55,0.35))" }}
          />
        </motion.div>
      </motion.div>

      {/* Phase 4 — gold star transition + light sweep */}
      {phase === "fading" && (
        <>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 z-20 h-[clamp(10rem,40vw,14rem)] w-[clamp(10rem,40vw,14rem)] -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1, 1.6], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <polygon
              points={starPoints(50, 50, 46, 19)}
              fill="#D4AF37"
              stroke="#F2D98C"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </motion.svg>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(212,175,55,0.4) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      {/* Controls stay usable through the sequence */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <SkipButton onSkip={onSkip} />
      </div>
    </div>
  );
}
