// Cinematic opening helpers for Desert Dusk — Phase 1 rising sun +
// drifting sand glow, Phase 2 sun flare + gold-dust rise, Phase 3
// dune panels parting, Phase 4 sun-disc transition + Web Audio SFX
// (desert wind + warm chime, synthesised — no audio files). Music is
// deliberately NOT included: no verified CC0 track could be bundled
// without bloating the template, so the toggle controls SFX only.
// Everything here is transform/opacity (canvas excepted) and respects
// prefers-reduced-motion. Deliberately different from Blush Royale:
// Blush rotates paper panels open around a centre seam with falling
// petals; Desert Dusk SLIDES two dune-coloured panels apart
// horizontally while golden dust RISES, and its transition emblem is
// a sun disc, not a heart. The panels are plain dune-coloured
// curtains — never an envelope shape — and they part to reveal the
// invitation CARD itself (its dune-toned back at rest); the card's
// own sand-dissolve reveal then follows on tap.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Wind = filtered-noise swell sweeping */
/* low; chime = warm pentatonic arpeggio A4–C#5–E5–A5, sine + soft  */
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

/** Desert wind: warm noise through a lowpass sweeping 500→180 Hz. */
export function playWindSound() {
  if (!soundEnabled) return;
  const ctx = ac();
  if (!ctx) return;
  try {
    const dur = 1.2;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const k = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * k;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 0.7;
    lp.frequency.setValueAtTime(520, ctx.currentTime);
    lp.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Warm desert chime: A4–C#5–E5–A5, sine + soft triangle octave. */
export function playDesertChimeSound() {
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
/* SandGlowCanvas — one canvas, one rAF loop. Warm sand-glow dust   */
/* rises slowly (gold motes drifting up with a sideways wind) while */
/* fainter sand motes drift sideways; when burstKey increments,    */
/* ~28 golden dust motes burst upward from burstOrigin and fade    */
/* over ~1.6s. Renders nothing at all under prefers-reduced-motion. */
/* ------------------------------------------------------------------ */

interface RisingMote {
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

const GOLDS = ["217, 160, 91", "232, 211, 179", "245, 230, 211", "194, 112, 61"];

export function SandGlowCanvas({
  moteCount = 18,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.62 },
  className = "",
}: {
  moteCount?: number;
  burstKey?: number;
  burstOrigin?: { x: number; y: number };
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // burstKey arrives via a ref so the rAF loop (created once) sees
  // every increment; burstSeenRef tracks what it already fired.
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
    let motes: RisingMote[] = [];
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
        size: 1 + Math.random() * 2.4,
        vy: 0.08 + Math.random() * 0.22,
        sway: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.45,
        gold: Math.floor(Math.random() * GOLDS.length),
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      burst = Array.from({ length: 28 }, () => {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
        const sp = 0.5 + Math.random() * 1.8;
        return {
          x: ox + (Math.random() - 0.5) * 40,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          r: 1 + Math.random() * 2.4,
          life: 0,
          maxLife: 1000 + Math.random() * 700,
        };
      });
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of motes) {
        // Sand glow rises: slow upward drift, sideways wind sway.
        p.y -= p.vy * dt * 0.06;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2400 + p.phase) * p.sway * 16;
        const twinkle = 0.7 + 0.3 * Math.sin(t / 1100 + p.phase * 3);
        ctx.beginPath();
        ctx.arc(x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLDS[p.gold]}, ${(p.alpha * twinkle).toFixed(3)})`;
        ctx.fill();
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy -= 0.0006 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 190, 110, ${(0.95 * k).toFixed(3)})`;
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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#D9A05B]/50 bg-[#3D2133]/60 text-[#FFF8EC] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9A05B]"
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
      className="dd-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#FFF8EC]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D9A05B]"
      style={{ opacity: 0.8 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* DunePanelsOverlay — Phase 3 + 4. Two plain dune-coloured panels */
/* cover the screen, then SLIDE apart horizontally (left panel to  */
/* the left, right panel to the right — no 3D rotation, unlike     */
/* Blush) to reveal the invitation card mounted underneath (its    */
/* dune-toned back at rest); gold dust rises around them; on       */
/* "fading" the panels dissolve, a sun disc scales + fades in the  */
/* centre, and a golden light sweep crosses the screen. The panels */
/* are dune curtains, not an envelope: no flap, no seal, no card   */
/* tucked inside anything. Fixed positioning, pointer-events-none  */
/* except for the Skip / sound controls.                           */
/* ------------------------------------------------------------------ */

export type DunePanelsPhase = "closed" | "opening" | "fading";

export function DunePanelsOverlay({
  phase,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: DunePanelsPhase;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-dd-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left dune panel — slides left, dusk purple over terracotta */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2"
          style={{
            background:
              "linear-gradient(160deg, #3D2133 0%, #6B3A5C 55%, #8A4A22 100%)",
          }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "-102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 200 120"
            preserveAspectRatio="none"
            className="absolute right-0 bottom-0 h-1/3 w-full opacity-60"
          >
            <path d="M0 70 Q 60 40 120 62 T 200 58 V 120 H 0 Z" fill="#3D2133" />
            <path d="M0 92 Q 80 66 140 84 T 200 82 V 120 H 0 Z" fill="#2A1622" />
          </svg>
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-10"
            style={{ background: "linear-gradient(90deg, transparent, rgba(61,33,51,0.35))" }}
          />
        </motion.div>

        {/* Right dune panel — slides right, sand over terracotta */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2"
          style={{
            background:
              "linear-gradient(200deg, #F5E6D3 0%, #D9A05B 55%, #8A4A22 100%)",
          }}
          initial={{ x: "0%" }}
          animate={{ x: opening ? "102%" : "0%" }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 h-1/3 w-full opacity-60"
          >
            <path d="M0 58 Q 60 40 120 62 T 200 70 V 120 H 0 Z" fill="#8A4A22" />
            <path d="M0 82 Q 80 66 140 84 T 200 92 V 120 H 0 Z" fill="#3D2133" />
          </svg>
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-10"
            style={{ background: "linear-gradient(270deg, transparent, rgba(61,33,51,0.35))" }}
          />
        </motion.div>

        {/* Gold dust rising around the parting panels */}
        <SandGlowCanvas moteCount={12} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — sun-disc transition + golden light sweep */}
      {phase === "fading" && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-56"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1, 1.6], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: "9999px",
              background:
                "radial-gradient(circle, rgba(255, 236, 190, 0.95) 0%, rgba(217, 160, 91, 0.75) 45%, rgba(217, 160, 91, 0) 72%)",
              boxShadow: "0 0 90px 30px rgba(217, 160, 91, 0.45)",
            }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255, 214, 140, 0.4) 50%, transparent 100%)",
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
