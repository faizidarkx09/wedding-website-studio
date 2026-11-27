// Cinematic opening helpers for Forest Whisper — Phase 1 mist +
// fireflies + falling leaves, Phase 2 firefly/leaf seal activation
// with a soft green-gold glow and one gentle pulse, Phase 3 mist
// panels parting, Phase 4 firefly burst + leaf swirl + soft light.
// Web Audio SFX (leaf rustle + dawn chime, synthesised — no audio
// files). Music is deliberately NOT included: no verified CC0 track
// could be bundled without bloating the template, so the toggle
// controls SFX only. Everything here is transform/opacity (canvas
// excepted) and respects prefers-reduced-motion.
"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Web Audio SFX — created lazily on the first user gesture, never   */
/* before a tap (no autoplay). Rustle = filtered-noise burst         */
/* sweeping down (leaves in a breeze); dawn chime = soft sine /      */
/* triangle arpeggio A4–C#5–E5–A5.                                   */
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

/** Short leaf rustle: white noise through a bandpass sweeping 1400→420 Hz. */
export function playRustleSound() {
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
    bp.Q.value = 0.7;
    bp.frequency.setValueAtTime(1400, ctx.currentTime);
    bp.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch {
    /* audio is decorative — never break the ceremony */
  }
}

/** Dawn chime: A4–C#5–E5–A5, sine + soft triangle octave, ~1.8s decay. */
export function playDawnChimeSound() {
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
/* FireflyLeafCanvas — one canvas, one rAF loop. Warm green-gold     */
/* fireflies drift and pulse; leaves fall slowly with sway +         */
/* rotation; when burstKey increments, ~26 fireflies burst from      */
/* burstOrigin and ~14 leaves swirl outwards, fading over ~1.6s.    */
/* Renders nothing at all under prefers-reduced-motion.              */
/* ------------------------------------------------------------------ */

interface Firefly {
  x: number;
  y: number;
  r: number;
  speedX: number;
  speedY: number;
  sway: number;
  phase: number;
  alpha: number;
}

interface Leaf {
  x: number;
  y: number;
  size: number;
  angle: number;
  rotSpeed: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
  green: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  maxLife: number;
  gold: boolean;
}

const LEAF_GREENS = ["167, 201, 87", "106, 153, 78", "45, 106, 79", "214, 240, 140"];

export function FireflyLeafCanvas({
  fireflyCount = 22,
  leafCount = 10,
  burstKey = 0,
  burstOrigin = { x: 0.5, y: 0.58 },
  className = "",
}: {
  fireflyCount?: number;
  leafCount?: number;
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
    let fireflies: Firefly[] = [];
    let leaves: Leaf[] = [];
    let burst: BurstParticle[] = [];

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fireflies = Array.from({ length: fireflyCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.9 + Math.random() * 1.7,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: -0.04 - Math.random() * 0.16,
        sway: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.5,
      }));
      leaves = Array.from({ length: leafCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 5 + Math.random() * 6,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.0007,
        vy: 0.1 + Math.random() * 0.22,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.35 + Math.random() * 0.35,
        green: Math.floor(Math.random() * LEAF_GREENS.length),
      }));
    };

    const spawnBurst = () => {
      const ox = originRef.current.x * w;
      const oy = originRef.current.y * h;
      const sparks: BurstParticle[] = Array.from({ length: 26 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.4 + Math.random() * 1.7;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.7,
          r: 1 + Math.random() * 2.2,
          life: 0,
          maxLife: 1000 + Math.random() * 600,
          gold: true,
        };
      });
      const swirl: BurstParticle[] = Array.from({ length: 14 }, () => {
        const a = Math.random() * Math.PI * 2;
        const sp = 0.3 + Math.random() * 1.1;
        return {
          x: ox,
          y: oy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.4,
          r: 2 + Math.random() * 3,
          life: 0,
          maxLife: 1100 + Math.random() * 500,
          gold: false,
        };
      });
      burst = [...sparks, ...swirl];
    };

    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const f of fireflies) {
        const x = (((f.x + f.speedX * (t / 1000) * 10 + Math.sin(t / 2600 + f.phase) * f.sway * 16) % (w + 20)) + w + 20) % (w + 20) - 10;
        const y = (((f.y + f.speedY * (t / 1000) * 10) % (h + 20)) + h + 20) % (h + 20) - 10;
        const pulse = 0.5 + 0.5 * Math.sin(t / 1100 + f.phase * 3);
        const glow = f.alpha * (0.25 + 0.75 * pulse);
        ctx.beginPath();
        ctx.arc(x, y, f.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(214, 240, 140, ${(glow * 0.16).toFixed(3)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 245, 160, ${glow.toFixed(3)})`;
        ctx.fill();
      }
      for (const p of leaves) {
        p.y += p.vy * dt * 0.06;
        p.angle += p.rotSpeed * dt;
        if (p.y > h + 16) {
          p.y = -16;
          p.x = Math.random() * w;
        }
        const x = p.x + Math.sin(t / 2800 + p.phase) * p.sway * 14;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${LEAF_GREENS[p.green]}, ${p.alpha.toFixed(3)})`;
        ctx.fill();
        ctx.restore();
      }
      burst = burst.filter((b) => b.life < b.maxLife);
      for (const b of burst) {
        b.life += dt;
        b.x += b.vx * dt * 0.06;
        b.y += b.vy * dt * 0.06;
        b.vy += 0.001 * dt;
        const k = 1 - b.life / b.maxLife;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.gold
          ? `rgba(230, 245, 160, ${(0.9 * k).toFixed(3)})`
          : `rgba(167, 201, 87, ${(0.85 * k).toFixed(3)})`;
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
  }, [fireflyCount, leafCount]);

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
      className="pointer-events-auto absolute top-3 right-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#A7C957]/40 bg-[#1B4332]/70 text-[#E7EAD9] shadow-sm backdrop-blur-sm transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A7C957]"
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
      className="fw-font-display pointer-events-auto absolute right-4 bottom-4 z-30 px-2 py-1 text-[11px] tracking-[0.28em] text-[#E7EAD9]/70 uppercase transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#A7C957]"
      style={{ opacity: 0.8 }}
    >
      Skip →
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* MistPanelsOverlay — Phase 3 + 4. Two mist curtains (forest photo  */
/* left, deep-green fern gradient right) cover the screen, then      */
/* SLIDE apart horizontally to reveal the invitation mounted         */
/* underneath — a mist parting, not a paper unfold. On "fading" the  */
/* panels dissolve, a firefly burst + leaf swirl rises from the      */
/* centre, and a soft green-gold light sweeps across. Fixed          */
/* positioning, pointer-events-none except for the Skip / sound      */
/* controls.                                                         */
/* ------------------------------------------------------------------ */

export type MistPanelsPhase = "closed" | "opening" | "fading";

export function MistPanelsOverlay({
  phase,
  coverUrl,
  soundEnabled,
  onToggleSound,
  onSkip,
}: {
  phase: MistPanelsPhase;
  coverUrl: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSkip: () => void;
}) {
  const opening = phase !== "closed";
  return (
    <div
      data-fw-panels={phase}
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fading" ? 0 : 1 }}
        transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Left mist curtain — forest photo under drifting mist */}
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden"
          style={{ backgroundColor: "#14301F" }}
          initial={{ x: 0 }}
          animate={{ x: opening ? "-102%" : 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${coverUrl})` }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(232, 245, 220, 0.28) 0%, rgba(232, 245, 220, 0.08) 35%, rgba(20, 48, 31, 0.45) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 bottom-0 w-16"
            style={{ background: "linear-gradient(90deg, transparent, rgba(20,48,31,0.35))" }}
          />
        </motion.div>

        {/* Right mist curtain — deep-green fern gradient */}
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 60% 40%, rgba(106, 153, 78, 0.5) 0%, rgba(27, 67, 50, 0.9) 55%, rgba(20, 48, 31, 1) 100%)",
          }}
          initial={{ x: 0 }}
          animate={{ x: opening ? "102%" : 0 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(232, 245, 220, 0.22) 0%, rgba(232, 245, 220, 0.06) 40%, rgba(20, 48, 31, 0.4) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 bottom-0 w-16"
            style={{ background: "linear-gradient(270deg, transparent, rgba(20,48,31,0.35))" }}
          />
          {/* Fern silhouettes along the bottom edge */}
          <svg
            aria-hidden="true"
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="absolute right-0 bottom-0 left-0 h-24 w-full opacity-40"
          >
            <path
              d="M0 60 Q20 20 40 55 Q60 15 80 52 Q100 18 120 55 Q140 12 160 52 Q180 20 200 55 L200 60 Z"
              fill="#2D6A4F"
            />
            <path
              d="M0 60 Q25 35 50 58 Q75 30 100 57 Q125 32 150 58 Q175 35 200 57 L200 60 Z"
              fill="#14301F"
            />
          </svg>
        </motion.div>

        {/* Mist drifting across both curtains */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 22% at 30% 62%, rgba(232, 245, 220, 0.22) 0%, transparent 70%), radial-gradient(ellipse 50% 20% at 72% 38%, rgba(232, 245, 220, 0.18) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 24, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 9, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] }}
        />

        {/* Fireflies + leaves drifting around the parting mist */}
        <FireflyLeafCanvas fireflyCount={16} leafCount={8} burstKey={0} className="z-10" />
      </motion.div>

      {/* Phase 4 — firefly burst + leaf swirl + soft green-gold light */}
      {phase === "fading" && (
        <>
          <FireflyLeafCanvas
            fireflyCount={0}
            leafCount={0}
            burstKey={1}
            burstOrigin={{ x: 0.5, y: 0.5 }}
            className="z-20"
          />
          <motion.div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 z-20 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-96 sm:w-96"
            style={{
              background:
                "radial-gradient(circle, rgba(214, 240, 140, 0.5) 0%, rgba(167, 201, 87, 0.18) 45%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.25, 1.6], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 z-20 w-1/3"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(214, 240, 140, 0.3) 50%, transparent 100%)",
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
