// Silver Moonlight cinematic opening — "Moonrise".
// Phase 1: twinkling stars + a slow crescent-moon glow pulse.
// Phase 2 (tap, ~1.5s): a moonbeam sweep across the silver seal,
// a burst of silver stars, a soft high bell chime, one gentle seal
// pulse. Phase 3: an ECLIPSE reveal — a dark night overlay with a
// circular hole that expands from the seal outward, revealing the
// invitation through the growing circle (no panels at all, unlike
// Blush's rotateY panels or Golden Hour's slide-apart panels).
// Phase 4: a silver shimmer sweep + a fading crescent while the
// invitation zooms 1.04 → 1 underneath.
// SFX-only via Web Audio (created lazily on tap, never autoplay);
// the toggle controls SFX only — no music. Everything is
// transform/opacity/clip-path (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Paper = filtered-noise burst sweeping */
/* down; moon chime = soft high bell arpeggio C6–E6–G6–C7.          */
/* ------------------------------------------------------------------ */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export function setSilverMoonlightSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export function isSilverMoonlightSoundEnabled() {
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
export function playSilverMoonlightPaperSound() {
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

/** Moon chime: C6–E6–G6–C7, sine + soft triangle octave, ~1.8s decay. */
export function playMoonChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [1046.5, 1318.5, 1568.0, 2093.0];
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
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
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
/* StarBurstCanvas — renders nothing until burstKey increments, then */
/* ~26 silver/white star particles burst from burstOrigin and fade   */
/* over ~1.4s. Renders nothing at all under prefers-reduced-motion. */
/* ------------------------------------------------------------------ */

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  color: number;
}

const STAR_COLORS = ["232, 235, 240", "221, 225, 232", "244, 247, 250", "201, 205, 214"];

export function StarBurstCanvas({
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.6 },
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
      burst = Array.from({ length: 26 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.5 + Math.random() * 1.8;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
          color: Math.floor(Math.random() * STAR_COLORS.length),
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
        b.vy += 0.0009 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${STAR_COLORS[b.color]}, ${(0.95 * k).toFixed(3)})`;
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

export function SilverMoonlightSoundToggle({
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#C9CDD6]/40 bg-[#16202E]/70 text-[#F4F7FA] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9CDD6]"
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

export function SilverMoonlightSkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSkip();
      }}
      className="er-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#F4F7FA]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9CDD6]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* EclipseOverlay — Phase 3 + 4. A deep-night overlay covers the    */
/* screen; a circular hole opens from the seal's position and       */
/* expands (clip-path circle) until the whole invitation is         */
/* revealed — an eclipse in reverse. On "fading" the overlay        */
/* dissolves, a crescent moon scales + fades, and a silver light    */
/* sweep crosses the screen. Fixed positioning,                   */
/* pointer-events-none except for the Skip / sound controls.         */
/* ------------------------------------------------------------------ */

export type EclipsePhase = "closed" | "opening" | "fading";

export function EclipseOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: EclipsePhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-sm-eclipse={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, #2E3A4A 0%, #16202E 55%, #0E1620 100%)",
        }}
        initial={{ clipPath: "circle(6% at 50% 60%)", opacity: 1 }}
        animate={{
          clipPath: opening ? "circle(125% at 50% 60%)" : "circle(6% at 50% 60%)",
          opacity: phase === "fading" ? 0 : 1,
        }}
        transition={
          phase === "fading"
            ? { duration: 1.2, ease: [0.65, 0, 0.35, 1] }
            : { duration: 2.4, ease: [0.22, 1, 0.36, 1] }
        }
      >
        {/* Faint stars inside the night overlay while it opens */}
        <StarBurstCanvas burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — crescent moon + silver light sweep */}
      {phase === "fading" && (
        <>
          <motion.svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-56"
            initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
            animate={{ scale: [0.6, 1, 1.4], opacity: [0, 0.8, 0], rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <path
              d="M62 8 A42 42 0 1 0 62 92 A34 34 0 1 1 62 8 Z"
              fill="#DDE1E8"
            />
            <path
              d="M62 8 A42 42 0 1 0 62 92 A34 34 0 1 1 62 8 Z"
              fill="none"
              stroke="#F4F7FA"
              strokeWidth="1.5"
              opacity="0.7"
            />
          </motion.svg>
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(221,225,232,0.4) 50%, transparent 100%)",
            }}
            initial={{ x: "-120%" }}
            animate={{ x: "320%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </>
      )}

      {/* Controls stay usable through the sequence */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <SilverMoonlightSoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <SilverMoonlightSkipButton onSkip={onSkip} />
      </div>
    </div>
  );
}
