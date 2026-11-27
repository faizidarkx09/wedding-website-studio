// Ocean Pearl cinematic opening — "Tide".
// Phase 1: rising bubbles + a gentle wave sway on the cover photo.
// Phase 2 (tap, ~1.5s): a burst of bubbles from the names, a
// watery chime (D major: D5–F#5–A5–D6), one gentle glow pulse on
// the names, a light sweep across the wave photo. Phase 3: THE
// TIDE — a full-screen wave shape washes DOWN over the cover and
// recedes off the bottom, revealing the invitation mounted
// underneath. Phase 4: bubbles drift, a pearl scales + fades, an
// aqua shimmer sweeps across, invitation zooms 1.04 → 1.
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
/* down; watery chime = gentle D-major arpeggio D5–F#5–A5–D6.       */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setOceanPearlSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export function isOceanPearlSoundEnabled() {
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
export function playOceanPearlPaperSound() {
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

/** Watery chime: D5–F#5–A5–D6, sine + soft triangle octave, ~1.8s decay. */
export function playWaterChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [587.33, 739.99, 880.0, 1174.66];
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
/* BubbleBurstCanvas — renders nothing until burstKey increments,   */
/* then ~26 bubbles (stroked circles with a highlight) burst from  */
/* burstOrigin, rise + fade over ~1.6s. Renders nothing at all      */
/* under prefers-reduced-motion.                                      */
/* ------------------------------------------------------------------ */

interface BurstBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export function BubbleBurstCanvas({
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
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
    let burst: BurstBubble[] = [];

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
      burst = Array.from({ length: 26 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.6;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.8,
          size: 3 + Math.random() * 7,
          life: 0,
          maxLife: 1000 + Math.random() * 700,
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
        b.vy -= 0.0008 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(216, 237, 239, ${(0.85 * k).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${(0.8 * k).toFixed(3)})`;
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

export function OceanPearlSoundToggle({
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#7FC4CE]/50 bg-[#0E3A45]/70 text-[#F7FBFC] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7FC4CE]"
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

export function OceanPearlSkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="op-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#F7FBFC]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7FC4CE]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* TideOverlay — Phase 3 + 4. A full-screen wave washes DOWN over   */
/* the cover (its bottom edge is a wave shape) and recedes off the  */
/* bottom, revealing the invitation mounted underneath; on "fading" */
/* a pearl scales + fades and an aqua shimmer sweeps across. Fixed  */
/* positioning, pointer-events-none except for the Skip / sound     */
/* controls.                                                         */
/* ------------------------------------------------------------------ */

export type TidePhase = "closed" | "opening" | "fading";

export function TideOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: TidePhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-op-tide={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-full"
        initial={{ y: "-105%" }}
        animate={
          phase === "fading"
            ? { y: "105%", opacity: 0 }
            : opening
              ? { y: ["-105%", "0%", "105%"], opacity: 1 }
              : { y: "-105%", opacity: 1 }
        }
        transition={
          phase === "fading"
            ? { duration: 1.2, ease: [0.65, 0, 0.35, 1] }
            : opening
              ? { duration: 2.5, times: [0, 0.32, 1], ease: [0.22, 1, 0.36, 1] }
              : { duration: 0.01 }
        }
      >
        {/* The wave body */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0E3A45 0%, #146B7A 55%, #2E8B9A 100%)",
          }}
        />
        {/* Foam highlight near the wave's leading edge */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-16 h-24"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(216, 237, 239, 0.35) 70%, rgba(247, 251, 252, 0.55) 100%)",
          }}
        />
        {/* Wave-shaped bottom edge */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 90"
          preserveAspectRatio="none"
          className="absolute -bottom-[1px] left-0 h-[70px] w-full sm:h-[90px]"
        >
          <path
            d="M0 45 C 150 10, 300 80, 450 45 S 750 10, 900 45 S 1100 80, 1200 45 L 1200 90 L 0 90 Z"
            fill="#2E8B9A"
          />
          <path
            d="M0 60 C 200 30, 400 85, 600 60 S 1000 30, 1200 60 L 1200 90 L 0 90 Z"
            fill="#F7FBFC"
            opacity="0.35"
          />
        </svg>
        {/* Bubbles drifting inside the wave */}
        <BubbleBurstCanvas burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — pearl + aqua shimmer sweep */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-44 sm:w-44"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #D8EDEF 40%, #7FC4CE 70%, rgba(127, 196, 206, 0) 100%)",
              boxShadow: "0 0 60px 20px rgba(216, 237, 239, 0.5)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1, 1.5], opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(216, 237, 239, 0.4) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      {/* Controls stay usable through the sequence */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <OceanPearlSoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <OceanPearlSkipButton onSkip={onSkip} />
      </div>
    </div>
  );
}
