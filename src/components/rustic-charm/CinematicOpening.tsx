// Cinematic opening helpers for Rustic Charm — barn-light theme.
// Phase 1: fireflies drifting over the barn photo, dust motes in the
// lantern light, the wood sign breathing with a warm glow.
// Phase 2 (on tap, ~1.5s): the wood-disc monogram flares warm like a
// lantern, one gentle swing of the sign, a burst of golden firefly
// particles, button fades.
// Phase 3–4 (renderer): two barn doors on a rail slide apart,
// revealing the invitation card; a lantern glow blooms where the
// card sits, echoing the card's own slow zoom-in, and a warm light
// sweep crosses. Web Audio SFX only (low wooden thock + warm chime,
// synthesised — no audio files, no autoplay). Everything is
// transform/opacity (canvas excepted) and respects
// prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Thock = low sine knock; chime = warm */
/* C4–E4–G4–C5 arpeggio.                                             */
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

/** Low wooden thock: sine knock at 110 Hz with a fast decay. */
export function playThockSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.22);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Warm chime: C4–E4–G4–C5, sine + soft triangle octave, ~1.8s decay. */
export function playChimeSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const notes = [261.63, 329.63, 392, 523.25];
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
/* DustCanvas — one canvas, one rAF loop. Warm fireflies drifting    */
/* with a slow blink, and dust motes hanging in the lantern light;   */
/* when burstKey increments, ~20 golden firefly particles burst     */
/* from burstOrigin and fade over ~1.4s. Renders nothing at all     */
/* under prefers-reduced-motion.                                     */
/* ------------------------------------------------------------------ */

interface Firefly {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  alpha: number;
}

interface Mote {
  x: number;
  y: number;
  r: number;
  vy: number;
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

export function DustCanvas({
  particleCount = 14,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.55 },
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
    let flies: Firefly[] = [];
    let motes: Mote[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flies = Array.from({ length: particleCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1.2 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0008 + Math.random() * 0.0012,
        alpha: 0.4 + Math.random() * 0.45,
      }));
      motes = Array.from({ length: 10 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1,
        vy: 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.3,
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 20 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.35 + Math.random() * 1.4;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.55,
          r: 1 + Math.random() * 2,
          life: 0,
          maxLife: 900 + Math.random() * 600,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy * dt * 0.06;
        if (m.y < -8) {
          m.y = h + 8;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(t / 3000 + m.phase) * 6;
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 243, 199, ${m.alpha.toFixed(3)})`;
        ctx.fill();
      }
      for (const f of flies) {
        f.x += f.vx * dt * 0.06 + Math.sin(t / 2400 + f.phase) * 0.12;
        f.y += f.vy * dt * 0.06 + Math.cos(t / 2800 + f.phase) * 0.1;
        if (f.x < -10) f.x = w + 10;
        if (f.x > w + 10) f.x = -10;
        if (f.y < -10) f.y = h + 10;
        if (f.y > h + 10) f.y = -10;
        const blink = 0.45 + 0.55 * Math.sin(t * f.speed + f.phase);
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${(f.alpha * blink).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r * 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${(f.alpha * blink * 0.12).toFixed(3)})`;
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
        ctx.fillStyle = `rgba(253, 230, 138, ${(0.9 * k).toFixed(3)})`;
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#FDE68A]/40 bg-[#2D1F14]/70 text-[#FEF3C7] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDE68A]"
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
      className="rc-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#FEF3C7]/60 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDE68A]"
      style={{ opacity: 0.75 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* BarnDoorOverlay — Phase 3 + 4. Two wood-plank barn doors on a     */
/* rail slide apart, revealing the invitation card mounted          */
/* underneath; fireflies drift around them; on "fading" the doors   */
/* dissolve, a warm lantern glow blooms where the card sits —       */
/* starting small and growing, echoing the card's slow zoom-in —    */
/* and a golden light sweep crosses. Fixed positioning,             */
/* pointer-events-none except for the Skip / sound controls.        */
/* ------------------------------------------------------------------ */

export type PanelsPhase = "closed" | "opening" | "fading";

const PLANK_BG =
  "repeating-linear-gradient(90deg, #78350F 0px, #78350F 44px, #5C2A08 44px, #5C2A08 48px, #92400E 48px, #92400E 92px, #5C2A08 92px, #5C2A08 96px)";

export function BarnDoorOverlay({
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
      data-rc-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Barn-door rail across the top */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-20 h-3 bg-[#1C1209]"
          style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
        />

        {/* Left barn door — slides left on its rail */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{ backgroundImage: PLANK_BG, backgroundColor: "#78350F" }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "-102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[30%] h-9 bg-[#451A03]/55"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[68%] h-9 bg-[#451A03]/55"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 right-3 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-[#2D1F14] bg-[#1C1209]/70"
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-8"
            style={{
              background: "linear-gradient(270deg, rgba(253,230,138,0.35), transparent)",
              boxShadow: "0 0 20px rgba(253,230,138,0.25)",
            }}
          />
        </motion.div>

        {/* Right barn door — slides right on its rail */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{ backgroundImage: PLANK_BG, backgroundColor: "#78350F" }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[30%] h-9 bg-[#451A03]/55"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[68%] h-9 bg-[#451A03]/55"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-3 h-10 w-10 -translate-y-1/2 rounded-full border-2 border-[#2D1F14] bg-[#1C1209]/70"
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-8"
            style={{
              background: "linear-gradient(90deg, rgba(253,230,138,0.35), transparent)",
              boxShadow: "0 0 20px rgba(253,230,138,0.25)",
            }}
          />
        </motion.div>

        {/* Fireflies drifting around the opening doors */}
        <DustCanvas particleCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — warm lantern glow bloom + golden light sweep.
          The bloom sits where the invitation card mounts (upper
          third) and grows from small, echoing the card's slow
          zoom-in from far away. */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-[26%] left-1/2 z-20 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-80 sm:w-80"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(253, 230, 138, 0.55) 0%, rgba(253, 230, 138, 0.12) 55%, transparent 75%)",
            }}
            initial={{ scale: 0.45, opacity: 0 }}
            animate={{ scale: [0.45, 1, 1.4], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(253,230,138,0.4) 50%, transparent 100%)",
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
