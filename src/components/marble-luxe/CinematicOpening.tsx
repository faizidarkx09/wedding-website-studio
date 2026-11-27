// Cinematic opening helpers for Marble Luxe — Phase 1 drifting
// gold dust, Phase 2 monogram-ring glow on tap, Phase 3 two
// white marble slabs parting left/right slowly and elegantly,
// Phase 4 a gold line expanding + soft shimmer. Web Audio SFX
// only (a single low bell + soft shimmer, synthesised — no audio
// files, no music). Transform/opacity only and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Bell = one low C5 bell with a long    */
/* 2.2s decay + a faint G5 shimmer on top.                          */
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

/** Marble bell: C5 bell (sine + 2.76x partial) + faint G5 shimmer. */
export function playMarbleBell() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const partials: Array<[number, number, number]> = [
      [523.25, 0.12, 2.2],
      [1444.2, 0.05, 1.4],
      [783.99, 0.035, 1.8],
    ];
    for (const [freq, peak, decay] of partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + decay + 0.1);
    }
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Soft gold shimmer: a faint highpass noise wash, 0.9s. */
export function playGoldShimmer() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 0.9;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(3000, ctx.currentTime);
    hp.frequency.exponentialRampToValueAtTime(7000, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(hp);
    hp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* GoldDustCanvas — one canvas, one rAF loop. Tiny gold motes drift */
/* slowly down with a gentle sway at low alpha; when burstKey       */
/* increments, ~20 gold motes burst from burstOrigin and fade over  */
/* ~1.5s. Renders nothing under prefers-reduced-motion.             */
/* ------------------------------------------------------------------ */

interface Mote {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
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
}

export function GoldDustCanvas({
  moteCount = 14,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
  className = "",
}: {
  moteCount?: number;
  burstKey?: number;
  burstOrigin?: { x: number; y: number };
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstKeyPropRef = useRef(burstKey);
  const burstSeenRef = useRef(0);
  const originRef = useRef(burstOrigin);
  burstKeyPropRef.current = burstKey;
  originRef.current = burstOrigin;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: moteCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1 + Math.random() * 1.8,
        vy: 0.06 + Math.random() * 0.14,
        sway: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.3,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 20 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.3 + Math.random() * 1.2;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.5,
          r: 1 + Math.random() * 1.8,
          life: 0,
          maxLife: 1000 + Math.random() * 600,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y += m.vy * dt * 0.06;
        if (m.y > h + 12) {
          m.y = -12;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(t / 2600 + m.phase) * m.sway * 10;
        const twinkle = 0.75 + 0.25 * Math.sin(t / 500 + m.phase * 2);
        ctx.beginPath();
        ctx.arc(x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 162, 98, ${(m.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0008 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 105, ${(0.85 * k).toFixed(3)})`;
        ctx.fill();
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
  }, [moteCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#C4A262]/60 bg-white/60 text-[#4A4438] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C4A262]"
      style={{ opacity: enabled ? 0.85 : 0.55 }}
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
      className="ml-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#4A4438]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C4A262]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MarbleOverlay — Phase 3 + 4. Two white marble slabs (subtle grey */
/* veining via gradient) part left/right SLOWLY (3.0s) like a      */
/* curtain of stone; on "fading" a thin gold line expands across   */
/* the centre while a soft gold shimmer sweeps. Fixed positioning,  */
/* pointer-events-none except for the Skip / sound controls.         */
/* ------------------------------------------------------------------ */

export type MarblePhase = "closed" | "parting" | "fading";

const MARBLE_VEIN =
  "linear-gradient(160deg, transparent 0%, transparent 42%, rgba(120,120,125,0.18) 45%, rgba(120,120,125,0.05) 48%, transparent 52%, transparent 70%, rgba(120,120,125,0.14) 73%, rgba(120,120,125,0.04) 76%, transparent 80%), linear-gradient(200deg, transparent 0%, transparent 60%, rgba(120,120,125,0.12) 63%, transparent 66%)";

export function MarbleOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: MarblePhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const parting = phase !== "closed";
  return (
    <div
      data-ml-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left slab — white marble, slides left slowly */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#FAFAF8]"
          initial={{ x: 0 }}
          animate={{ x: parting ? "-102%" : 0 }}
          transition={{ duration: 3.0, ease: [0.65, 0, 0.35, 1] }}
        >
          <div aria-hidden="true" className="absolute inset-0" style={{ background: MARBLE_VEIN }} />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-px bg-[#C4A262]/60"
          />
        </motion.div>

        {/* Right slab — white marble, slides right slowly */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#FAFAF8]"
          initial={{ x: 0 }}
          animate={{ x: parting ? "102%" : 0 }}
          transition={{ duration: 3.0, ease: [0.65, 0, 0.35, 1] }}
        >
          <div aria-hidden="true" className="absolute inset-0" style={{ background: MARBLE_VEIN }} />
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-0 w-px bg-[#C4A262]/60"
          />
        </motion.div>

        {/* Gold dust drifting over the marble */}
        <GoldDustCanvas moteCount={10} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — gold line expanding + soft shimmer */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-px -translate-x-1/2 -translate-y-1/2 bg-[#C4A262]"
            initial={{ width: "0%", opacity: 0 }}
            animate={{ width: ["0%", "62%", "62%"], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(212,175,105,0.35) 50%, transparent 100%)",
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
