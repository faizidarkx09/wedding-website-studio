// Cinematic opening helpers for Aurora — northern-lights theme.
// Phase 1: twinkling stars + falling snow + aurora sparkles over the
// cover, the monogram ring breathing with a teal glow.
// Phase 2 (on tap, ~1.5s): the ring flares teal→violet, one light
// sweep, one gentle pulse, a burst of star particles, button fades.
// Phase 3–4 (renderer): two night-sky panels slide apart like the
// sky parting, an aurora ribbon sweeps across, a starburst blooms.
// Web Audio SFX only (wind whoosh + airy chime, synthesised — no
// audio files, no autoplay). Everything is transform/opacity (canvas
// excepted) and respects prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Whoosh = filtered-noise sweep rising; */
/* chime = airy A4–C#5–E5–A5 arpeggio.                               */
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

/** Airy wind whoosh: white noise through a bandpass sweeping 400→2400 Hz. */
export function playWhooshSound() {
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
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(400, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Airy chime: A4–C#5–E5–A5, sine + soft triangle octave, ~1.8s decay. */
export function playChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const t = ctx.currentTime + i * 0.16;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = freq * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.03, t + 0.03);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc2.connect(g2);
      g2.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.7);
      osc2.start(t);
      osc2.stop(t + 1.7);
    });
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/* ------------------------------------------------------------------ */
/* AuroraCanvas — one canvas, one rAF loop. Twinkling stars, slow    */
/* falling snow with sway, and teal/violet aurora sparkles drifting; */
/* when burstKey increments, ~24 tiny star particles burst from     */
/* burstOrigin and fade over ~1.4s. Renders nothing at all under    */
/* prefers-reduced-motion.                                          */
/* ------------------------------------------------------------------ */

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  alpha: number;
}

interface Flake {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  vy: number;
  phase: number;
  teal: boolean;
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
  color: string;
}

const BURST_COLORS = ["255, 255, 255", "94, 234, 212", "167, 139, 250", "45, 212, 191"];

export function AuroraCanvas({
  particleCount = 16,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
  className = "",
}: {
  particleCount?: number;
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
    let stars: Star[] = [];
    let flakes: Flake[] = [];
    let sparkles: Sparkle[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.7,
        r: 0.6 + Math.random() * 1.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0006 + Math.random() * 0.0012,
        alpha: 0.35 + Math.random() * 0.5,
      }));
      flakes = Array.from({ length: Math.max(6, Math.floor(particleCount / 2)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1 + Math.random() * 2.2,
        vy: 0.1 + Math.random() * 0.22,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.45,
      }));
      sparkles = Array.from({ length: 6 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.55,
        size: 1.5 + Math.random() * 2.5,
        vy: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        teal: Math.random() > 0.5,
        alpha: 0.3 + Math.random() * 0.4,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 24 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.7;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          r: 0.8 + Math.random() * 2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
          color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(s.alpha * tw).toFixed(3)})`;
        ctx.fill();
      }
      for (const f of flakes) {
        f.y += f.vy * dt * 0.06;
        if (f.y > h + 8) {
          f.y = -8;
          f.x = Math.random() * w;
        }
        const x = f.x + Math.sin(t / 2800 + f.phase) * f.sway * 12;
        ctx.beginPath();
        ctx.arc(x, f.y, f.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${f.alpha.toFixed(3)})`;
        ctx.fill();
      }
      for (const s of sparkles) {
        s.y -= s.vy * dt * 0.06;
        if (s.y < -10) {
          s.y = h * 0.55;
          s.x = Math.random() * w;
        }
        const glow = 0.6 + 0.4 * Math.sin(t / 1200 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.teal
          ? `rgba(94, 234, 212, ${(s.alpha * glow).toFixed(3)})`
          : `rgba(167, 139, 250, ${(s.alpha * glow).toFixed(3)})`;
        ctx.fill();
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0009 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${b.color}, ${(0.9 * k).toFixed(3)})`;
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
  }, [particleCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#5EEAD4]/40 bg-[#0F172A]/70 text-[#E2E8F0] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5EEAD4]"
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
      className="au-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#E2E8F0]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5EEAD4]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* AuroraSkyOverlay — Phase 3 + 4. Two night-sky panels (deep night  */
/* with aurora ribbons) slide apart horizontally like the sky        */
/* parting, revealing the invitation mounted underneath; stars drift */
/* around them; on "fading" the panels dissolve, a starburst blooms  */
/* and an aurora ribbon sweeps across. Fixed positioning,            */
/* pointer-events-none except for the Skip / sound controls.         */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

const STAR_PATH =
  "M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z";

export function AuroraSkyOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: PanelsPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-au-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left night panel — slides left, aurora ribbon on its seam */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            background:
              "linear-gradient(160deg, #020617 0%, #0F172A 55%, #134E4A 100%)",
          }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "-102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(45,212,191,0.35) 48%, rgba(139,92,246,0.3) 62%, transparent 80%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-10"
            style={{
              background:
                "linear-gradient(270deg, rgba(94,234,212,0.55), rgba(139,92,246,0.35) 55%, transparent)",
              boxShadow: "0 0 24px rgba(94,234,212,0.45)",
            }}
          />
        </motion.div>

        {/* Right night panel — slides right, aurora ribbon on its seam */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            background:
              "linear-gradient(200deg, #020617 0%, #0F172A 55%, #4C1D95 100%)",
          }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "linear-gradient(245deg, transparent 30%, rgba(139,92,246,0.3) 48%, rgba(45,212,191,0.35) 62%, transparent 80%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-10"
            style={{
              background:
                "linear-gradient(90deg, rgba(139,92,246,0.55), rgba(94,234,212,0.35) 55%, transparent)",
              boxShadow: "0 0 24px rgba(139,92,246,0.45)",
            }}
          />
        </motion.div>

        {/* Stars drifting around the parting sky */}
        <AuroraCanvas particleCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — starburst bloom + aurora ribbon sweep */}
      {phase === "fading" && (
        <>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 z-20 h-44 w-44 -translate-x-1/2 -translate-y-1/2 sm:h-60 sm:w-60"
            initial={{ scale: 0.5, opacity: 0, rotate: 0 }}
            animate={{ scale: [0.5, 1, 1.5], opacity: [0, 0.85, 0], rotate: 45 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d={STAR_PATH} fill="#5EEAD4" />
            <path d={STAR_PATH} fill="none" stroke="#A78BFA" strokeWidth="1.5" opacity="0.7" />
          </motion.svg>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(94,234,212,0.4) 35%, rgba(139,92,246,0.35) 60%, transparent 100%)",
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
