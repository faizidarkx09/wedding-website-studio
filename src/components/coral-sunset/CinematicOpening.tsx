// Cinematic opening helpers for Coral Sunset — Phase 1 rising
// embers + slow sun wash, Phase 2 sun-disc flare on tap, Phase 3
// top/bottom horizon-split panels (the same sunrise gesture as
// the card's own split — NO envelope anywhere), Phase 4 rising sun
// + warm shimmer. Web Audio SFX only (warm wave + sunset chime,
// synthesised — no audio files, no music). Everything is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Wave = filtered-noise burst sweeping */
/* down; chime = warm major arpeggio E4–G4–B4–E5.                   */
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

/** Soft wave wash: white noise through a lowpass sweeping 1200→300 Hz. */
export function playWaveSound() {
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
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 0.7;
    lp.frequency.setValueAtTime(1200, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Sunset chime: E4–G4–B4–E5, sine + soft triangle octave, ~1.8s decay. */
export function playSunsetChime() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [329.63, 392.0, 493.88, 659.25];
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
/* EmberCanvas — one canvas, one rAF loop. Warm embers rise slowly  */
/* with flicker + sway; when burstKey increments, ~24 golden sparks */
/* burst from burstOrigin and fade over ~1.4s. Renders nothing at   */
/* all under prefers-reduced-motion.                                 */
/* ------------------------------------------------------------------ */

interface Ember {
  x: number;
  y: number;
  size: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  gold: number;
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

const EMBERS = ["255, 127, 80", "255, 165, 0", "255, 215, 130", "232, 93, 61"];

export function EmberCanvas({
  emberCount = 12,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.45 },
  className = "",
}: {
  emberCount?: number;
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
    let embers: Ember[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      embers = Array.from({ length: emberCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.5 + Math.random() * 2.5,
        vy: -(0.1 + Math.random() * 0.25),
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.4,
        gold: Math.floor(Math.random() * EMBERS.length),
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 24 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.6;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of embers) {
        p.y += p.vy * dt * 0.06;
        if (p.y < -16) {
          p.y = h + 16;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2400 + p.phase) * p.sway * 12;
        const flicker = 0.7 + 0.3 * Math.sin(t / 300 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${EMBERS[p.gold]}, ${(p.alpha * flicker).toFixed(3)})`;
        ctx.fill();
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.0012 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 130, ${(0.9 * k).toFixed(3)})`;
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
  }, [emberCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#FFDAB9]/50 bg-[#2E1420]/60 text-[#FFE8D6] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFDAB9]"
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
      className="cs-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#FFE8D6]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFDAB9]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* SunsetOverlay — Phase 3 + 4. Two sunset-gradient panels (plum   */
/* sky above, peach glow below) meet at a horizon line, then split  */
/* apart vertically — top rises, bottom sinks — like the sun rising */
/* over the horizon. This is the SAME gesture as the card's own     */
/* sunrise split, scaled to the full screen: the cinematic IS the   */
/* reveal's overture. The invitation (card back at rest) is mounted */
/* underneath, so phases 3–4 end ON the card, and the guest then    */
/* taps the card itself to split it open. On "fading" a sun disc    */
/* rises and dissolves while a warm shimmer sweeps across. Fixed    */
/* positioning, pointer-events-none except for the Skip / sound     */
/* controls.                                                        */
/* ------------------------------------------------------------------ */

export type SunsetPhase = "closed" | "parting" | "fading";

export function SunsetOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: SunsetPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const parting = phase !== "closed";
  return (
    <div
      data-cs-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Top panel — plum sky, rises */}
        <motion.div
          className="absolute top-0 right-0 left-0 h-1/2"
          style={{
            background: "linear-gradient(180deg, #2E1420 0%, #5C2E3E 55%, #C94A2E 100%)",
          }}
          initial={{ y: 0 }}
          animate={{ y: parting ? "-102%" : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(46,20,32,0.25) 0%, rgba(46,20,32,0.05) 70%, rgba(255,218,185,0.22) 100%)",
            }}
          />
        </motion.div>

        {/* Bottom panel — peach glow, sinks */}
        <motion.div
          className="absolute right-0 bottom-0 left-0 h-1/2"
          style={{
            background: "linear-gradient(180deg, #C94A2E 0%, #FF7F50 55%, #FFDAB9 100%)",
          }}
          initial={{ y: 0 }}
          animate={{ y: parting ? "102%" : 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(255,218,185,0.25) 0%, rgba(255,127,80,0.05) 70%, rgba(46,20,32,0.22) 100%)",
            }}
          />
        </motion.div>

        {/* Horizon glow line — fades as the halves part (mirrors the
            card back's own horizon line) */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-[#FFDAB9] to-transparent"
          initial={false}
          animate={{ opacity: parting ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Embers drifting around the splitting horizon */}
        <EmberCanvas emberCount={10} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — rising sun + warm shimmer */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-60 sm:w-60"
            style={{
              background:
                "radial-gradient(circle, rgba(255,218,185,0.95) 0%, rgba(255,127,80,0.75) 45%, rgba(255,127,80,0) 72%)",
            }}
            initial={{ scale: 0.5, opacity: 0, y: 40 }}
            animate={{ scale: [0.5, 1, 1.4], opacity: [0, 0.9, 0], y: [40, 0, -30] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,218,185,0.4) 50%, transparent 100%)",
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
