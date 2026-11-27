// Golden Hour cinematic opening — "Sunrise".
// Phase 1: golden dust + a slow rotating sun-ray halo behind the
// crest. Phase 2 (tap, ~1.5s): sunburst flash from the crest, a
// burst of golden dust, warm G-major chime, one gentle crest pulse.
// Phase 3: two golden panels SLIDE apart horizontally (translateX —
// not Blush's rotateY panels), like sunrise curtains parting.
// Phase 4: a rising sun disc scales + fades with a golden light
// sweep while the invitation zooms 1.04 → 1 underneath.
// SFX-only via Web Audio (created lazily on tap, never autoplay);
// the toggle controls SFX only — no music. Everything is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Paper = filtered-noise burst sweeping */
/* down; sun chime = warm G-major arpeggio G4–B4–D5–G5.             */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setGoldenHourSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export function isGoldenHourSoundEnabled() {
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

/** Short paper-rustle: white noise through a bandpass sweeping 900→280 Hz. */
export function playGoldenHourPaperSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 0.7;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(900, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Sun chime: G4–B4–D5–G5, sine + soft triangle octave, ~1.8s decay. */
export function playSunChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [392.0, 493.88, 587.33, 783.99];
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
      g.gain.exponentialRampToValueAtTime(0.11, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.exponentialRampToValueAtTime(0.035, t + 0.03);
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
/* SunburstCanvas — renders nothing until burstKey increments, then  */
/* ~28 golden dust particles burst from burstOrigin and fade over    */
/* ~1.4s. Renders nothing at all under prefers-reduced-motion.      */
/* ------------------------------------------------------------------ */

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
}

export function SunburstCanvas({
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.62 },
  className = "",
}: {
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
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 28 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 1.9;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.8,
          r: 1 + Math.random() * 2.4,
          life: 0,
          maxLife: 900 + Math.random() * 600,
        };
      });
    };

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      if (burstKeyPropRef.current !== burstSeenRef.current) {
        burstSeenRef.current = burstKeyPropRef.current;
        if (burstKeyPropRef.current > 0) spawnBurst();
      }
      ctx.clearRect(0, 0, w, h);
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0011 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246, 214, 138, ${(0.95 * k).toFixed(3)})`;
        ctx.fill();
      }
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
/* SoundToggle — small discreet top-corner toggle, visible through   */
/* the whole sequence. Never autoplays; SFX start only after a tap.  */
/* ------------------------------------------------------------------ */

export function GoldenHourSoundToggle({
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#C9920E]/40 bg-[#FFF8EC]/80 text-[#3B2A12] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9920E]"
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

export function GoldenHourSkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="gh-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#FFF8EC]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8A93D]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* SunPanelsOverlay — Phase 3 + 4. Two golden panels cover the      */
/* screen, then SLIDE apart horizontally (translateX) to reveal the  */
/* invitation mounted underneath; on "fading" the panels dissolve,  */
/* a rising sun disc scales + fades, and a golden light sweep       */
/* crosses the screen. Fixed positioning, pointer-events-none       */
/* except for the Skip / sound controls.                             */
/* ------------------------------------------------------------------ */

export type SunPanelsPhase = "closed" | "opening" | "fading";

export function SunPanelsOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: SunPanelsPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-gh-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left golden panel — slides left */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            background:
              "linear-gradient(135deg, #C9920E 0%, #8A6408 55%, #3B2A12 100%)",
          }}
          initial={{ x: 0 }}
          animate={{ x: opening ? "-100%" : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "repeating-conic-gradient(from 0deg at 100% 50%, rgba(246,214,138,0.5) 0deg 6deg, transparent 6deg 18deg)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-16"
            style={{ background: "linear-gradient(90deg, transparent, rgba(36,23,8,0.35))" }}
          />
        </motion.div>

        {/* Right golden panel — slides right */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            background:
              "linear-gradient(225deg, #E8A93D 0%, #C9920E 55%, #3B2A12 100%)",
          }}
          initial={{ x: 0 }}
          animate={{ x: opening ? "100%" : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-25"
            style={{
              background:
                "repeating-conic-gradient(from 0deg at 0% 50%, rgba(246,214,138,0.5) 0deg 6deg, transparent 6deg 18deg)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-16"
            style={{ background: "linear-gradient(270deg, transparent, rgba(36,23,8,0.35))" }}
          />
        </motion.div>

        {/* Golden dust drifting across the parting panels */}
        <SunburstCanvas burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — rising sun disc + golden light sweep */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-56 sm:w-56"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #F6D68A 0%, #E8A93D 45%, rgba(232,169,61,0) 72%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1, 1.6], opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(246,214,138,0.45) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      {/* Controls stay usable through the sequence */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <GoldenHourSoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <GoldenHourSkipButton onSkip={onSkip} />
      </div>
    </div>
  );
}
