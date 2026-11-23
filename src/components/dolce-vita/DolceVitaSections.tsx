// Dolce Vita sections — 1:1 ports of the standalone's sections
// (index.html §§3–7, 9 + styles.css §§3–7, 9 + script.js §5):
// the scratch-reveal date, the welcome letter, the schedule
// timeline, the venue, the dress code and the colours. All values
// (sizes, colours, copy) are the standalone's; only the couple
// names / date / venue are data-driven.
//
// Two DELIBERATE ADDITIONS (Studio brief, not in the standalone):
// a story timeline and a live countdown, both drawn in the same
// Dolce Vita language (Imperial Script headings, Ovo dates/times,
// dusty-blue dots) and both driven by the same single date source
// as the hero and the scratch tiles.
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { WeddingSite } from "@/lib/types";
import {
  DOLCE,
  dateParts,
  formatLongDate,
  mapsEmbedUrl,
  mapsLink,
  visibleMilestones,
} from "./tokens";
import { FloralSpray, IvyCorner } from "./Decor";

/* ---------- shared reveal (standalone .reveal: 1s, +24px) ---------- */

function Reveal({
  children,
  delay = 0,
  y = 24,
  duration = 1,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduceMotion ? 0 : duration, delay: reduceMotion ? 0 : delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="dolce-script" style={{ fontSize: 41, lineHeight: 1.25, color: DOLCE.ink, margin: "0 0 18px" }}>
      {children}
    </h2>
  );
}

/* ---------- 3. Scratch-reveal date (standalone script.js §5) ---------- */

export function DolceVitaScratchDate({ site }: { site: WeddingSite }) {
  const reduceMotion = useReducedMotion();
  const parts = dateParts(site.weddingDate, site.timezone);
  const tiles = [
    { label: "Day", value: parts.day, month: false },
    { label: "Month", value: parts.month, month: true },
    { label: "Year", value: parts.year, month: false },
  ];
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [celebrated, setCelebrated] = useState(false);
  const doneRef = useRef<boolean[]>([false, false, false]);
  const celebratedRef = useRef(false);

  // Paint the champagne coating on every tile, exactly as the
  // standalone does (gradient + diagonal sheen + sparkle dots).
  useEffect(() => {
    const ctxs = canvasRefs.current.map((canvas) => {
      if (!canvas) return null;
      const r = canvas.parentElement?.getBoundingClientRect();
      if (!r) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, r.width * dpr);
      canvas.height = Math.max(1, r.height * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "#dce8ee");
      g.addColorStop(0.45, "#c8d7df");
      g.addColorStop(1, "#e3d3c4");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, r.width, r.height);
      ctx.strokeStyle = "rgba(255,255,255,.35)";
      ctx.lineWidth = 1;
      for (let x = -r.height; x < r.width; x += 18) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + r.height, r.height);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,.5)";
      for (let i = 0; i < 26; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * r.width, Math.random() * r.height, 1 + Math.random() * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      return ctx;
    });

    const onResize = () => {
      ctxs.forEach((ctx, i) => {
        if (!ctx || doneRef.current[i]) return;
        const canvas = canvasRefs.current[i];
        if (!canvas) return;
        const r = canvas.parentElement?.getBoundingClientRect();
        if (!r) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, r.width * dpr);
        canvas.height = Math.max(1, r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const g = ctx.createLinearGradient(0, 0, r.width, r.height);
        g.addColorStop(0, "#dce8ee");
        g.addColorStop(0.45, "#c8d7df");
        g.addColorStop(1, "#e3d3c4");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, r.width, r.height);
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearedFraction(canvas: HTMLCanvasElement): number {
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    let data: Uint8ClampedArray;
    try {
      data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch {
      return 0;
    }
    let cleared = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 12 * 4) {
      total++;
      if (data[i] < 128) cleared++;
    }
    return total ? cleared / total : 0;
  }

  function launchConfetti() {
    if (reduceMotion) return;
    const confettiCanvas = confettiRef.current;
    if (!confettiCanvas) return;
    const section = confettiCanvas.parentElement;
    if (!section) return;
    const r = section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = Math.max(1, r.width * dpr);
    confettiCanvas.height = Math.max(1, r.height * dpr);
    const ctx = confettiCanvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = DOLCE.confetti;
    const pieces: {
      x: number; y: number; w: number; h: number; vy: number; vx: number;
      rot: number; vr: number; color: string; circle: boolean;
    }[] = [];
    for (let i = 0; i < 80; i++) {
      pieces.push({
        x: Math.random() * r.width,
        y: -10 - Math.random() * r.height * 0.4,
        w: 6 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        vy: 1.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 1.4,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.15,
        color: colors[i % colors.length],
        circle: Math.random() < 0.3,
      });
    }
    let frames = 0;
    const maxFrames = 300;
    (function frame() {
      ctx.clearRect(0, 0, r.width, r.height);
      pieces.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin((frames + p.w * 10) * 0.02) * 0.6;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.circle) {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      });
      frames++;
      if (frames < maxFrames) requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, r.width, r.height);
    })();
  }

  function celebrate() {
    if (celebratedRef.current) return;
    celebratedRef.current = true;
    setTimeout(() => {
      setCelebrated(true);
      const flash = flashRef.current;
      if (flash) {
        flash.classList.remove("flash");
        void flash.offsetWidth; // restart the animation
        flash.classList.add("flash");
      }
      launchConfetti();
    }, 550);
  }

  function finishTile(index: number) {
    if (doneRef.current[index]) return;
    const next = [...doneRef.current];
    next[index] = true;
    doneRef.current = next;
    setDone(next);
    if (next.every(Boolean)) celebrate();
  }

  function bindTile(index: number) {
    const canvasRaw = canvasRefs.current[index];
    if (!canvasRaw) return;
    // Non-nullable aliases: TS does not carry the null-check narrowing
    // into the nested pos()/erase() closures below.
    const canvas: HTMLCanvasElement = canvasRaw;
    let scratching = false;
    let lastCheck = 0;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    function pos(e: React.PointerEvent) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function erase(e: React.PointerEvent) {
      const p = pos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); // 36px eraser
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      const now = Date.now();
      if (now - lastCheck > 200) {
        lastCheck = now;
        if (clearedFraction(canvas) > 0.4) finishTile(index);
      }
    }

    canvas.onpointerdown = (e) => {
      if (doneRef.current[index]) return;
      scratching = true;
      canvas.setPointerCapture(e.pointerId);
      erase(e as unknown as React.PointerEvent);
      e.preventDefault();
    };
    canvas.onpointermove = (e) => {
      if (!scratching) return;
      erase(e as unknown as React.PointerEvent);
      e.preventDefault();
    };
    const endScratch = () => {
      if (!scratching) return;
      scratching = false;
      if (clearedFraction(canvas) > 0.4) finishTile(index);
    };
    canvas.onpointerup = endScratch;
    canvas.onpointercancel = endScratch;
  }

  useEffect(() => {
    tiles.forEach((_, i) => bindTile(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="date" aria-label="Wedding date" className="dolce-section">
      <Reveal>
        <SectionTitle>The Date</SectionTitle>
        <p className="dolce-scratch-hint">✦ Scratch to reveal the date ✦</p>
        <div className="dolce-scratch-row">
          {tiles.map((tile, i) => (
            <div key={tile.label} className={`dolce-scratch-tile${done[i] ? " done" : ""}`}>
              <div className="dolce-scratch-value">
                <span className={`dolce-scratch-num${tile.month ? " dolce-scratch-month" : ""}`}>
                  {tile.value}
                </span>
                <span className="dolce-scratch-lbl">{tile.label}</span>
              </div>
              <canvas
                ref={(el) => {
                  canvasRefs.current[i] = el;
                }}
                className="dolce-scratch-canvas"
                aria-label={`Scratch card: ${tile.label.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
        <p aria-live="polite" className={`dolce-married${celebrated ? " show" : ""}`}>
          You&rsquo;re invited!
        </p>
        <div ref={flashRef} aria-hidden="true" className="dolce-gold-flash" />
        <canvas ref={confettiRef} aria-hidden="true" className="dolce-confetti" />
      </Reveal>
    </section>
  );
}

/* ---------- 4. Welcome letter ---------- */

export function DolceVitaWelcome({ site }: { site: WeddingSite }) {
  return (
    <section id="welcome" aria-label="Welcome letter" className="dolce-section">
      <Reveal>
        <div className="dolce-letter-card">
          <FloralSpray className="dolce-letter-ornament" />
          <h2 className="dolce-script dolce-letter-heading">Dear friends and family,</h2>
          <p className="dolce-letter-body">{site.content.welcome}</p>
          <IvyCorner className="dolce-letter-ornament-small dolce-float-anim" />
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Story timeline (DELIBERATE ADDITION — see header) ---------- */

export function DolceVitaStory({ site }: { site: WeddingSite }) {
  const milestones = visibleMilestones(site);
  if (!site.settings.showStory) return null;
  return (
    <section id="story" aria-label="Our story" className="dolce-section">
      <Reveal>
        <SectionTitle>Our Story</SectionTitle>
      </Reveal>
      {milestones.length > 0 ? (
        <div className="dolce-story-list">
          {milestones.map((m) => (
            <Reveal key={m.id} className="dolce-story-item">
              <span aria-hidden="true" className="dolce-story-dot" />
              {m.image ? (
                <div className="dolce-story-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.image} alt={m.title || "A favourite photo"} loading="lazy" decoding="async" />
                </div>
              ) : null}
              <p className="dolce-ovo dolce-story-date">{m.date}</p>
              <h3 className="dolce-rufina dolce-story-title">{m.title}</h3>
              <p className="dolce-story-text">{m.text}</p>
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <p className="dolce-body">{site.content.story}</p>
        </Reveal>
      )}
    </section>
  );
}

/* ---------- Countdown (DELIBERATE ADDITION — see header) ---------- */

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function diffParts(targetMs: number, nowMs: number): CountdownParts {
  const total = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
    done: total <= 0,
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function DolceVitaCountdown({ site }: { site: WeddingSite }) {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!site.settings.showCountdown || !site.settings.countdownEnabled) return null;

  // The wedding date is the SINGLE source of truth — the same date
  // the hero shows and the scratch tiles reveal.
  const parts = diffParts(Date.parse(site.weddingDate), now);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);

  if (parts.done) {
    return (
      <section id="countdown" aria-label="Countdown" className="dolce-section">
        <Reveal>
          <SectionTitle>Counting Down</SectionTitle>
          <p className="dolce-script" style={{ fontSize: 33, lineHeight: 1.3, color: DOLCE.blueDeep }}>
            {site.content.postWeddingMessage || "See you there!"}
          </p>
          <p className="dolce-countdown-date">{dateLine}</p>
        </Reveal>
      </section>
    );
  }

  const units: { value: number; label: string; display: string }[] = [
    { value: parts.days, label: "Days", display: String(parts.days) },
    { value: parts.hours, label: "Hours", display: pad(parts.hours) },
    { value: parts.minutes, label: "Minutes", display: pad(parts.minutes) },
    { value: parts.seconds, label: "Seconds", display: pad(parts.seconds) },
  ];

  return (
    <section id="countdown" aria-label="Countdown to the wedding" className="dolce-section">
      <Reveal>
        <SectionTitle>Counting Down</SectionTitle>
        <div className="dolce-countdown-row" role="timer" aria-label="Countdown to the wedding">
          {units.map((u, i) => (
            <span key={u.label} className="dolce-countdown-group">
              {i > 0 ? (
                <span aria-hidden="true" className="dolce-ovo dolce-countdown-sep">
                  :
                </span>
              ) : null}
              <span className="dolce-countdown-unit">
                <span className="dolce-ovo dolce-countdown-num">{u.display}</span>
                <span className="dolce-countdown-lbl">{u.label}</span>
              </span>
            </span>
          ))}
        </div>
        <p className="dolce-countdown-date">{dateLine}</p>
      </Reveal>
    </section>
  );
}

/* ---------- 5. Schedule of Events ---------- */

export function DolceVitaEvents({ site }: { site: WeddingSite }) {
  if (!site.settings.showEvents || site.events.length === 0) return null;
  return (
    <section id="events" aria-label="Schedule of events" className="dolce-section">
      <Reveal>
        <SectionTitle>Schedule of Events</SectionTitle>
        <div className="dolce-timeline">
          {site.events.map((event, i) => (
            <div key={event.id} className={`dolce-tl-item ${i % 2 === 0 ? "dolce-tl-left" : "dolce-tl-right"}`}>
              <span aria-hidden="true" className="dolce-tl-dot" />
              <div className="dolce-ovo dolce-tl-time">{event.time}</div>
              <div className="dolce-ovo dolce-tl-name">{event.name}</div>
              {event.description ? <p className="dolce-tl-desc">{event.description}</p> : null}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- 6. Wedding Venue ---------- */

export function DolceVitaVenue({ site }: { site: WeddingSite }) {
  const { content } = site;
  if (!content.venueName?.trim() && !content.venueAddress?.trim()) return null;
  const query = [content.venueName, content.venueAddress].filter(Boolean).join(", ");
  const directions = content.mapLink?.trim() || mapsLink(query);
  const venueImage = (content.venueImage ?? "").trim() || "/images/themes/dolce-vita/venue-01.jpg";
  return (
    <section id="venue" aria-label="Wedding venue" className="dolce-section">
      <Reveal>
        <SectionTitle>Wedding Venue</SectionTitle>
        <figure className="dolce-venue-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={venueImage} alt={content.venueName || "Wedding venue"} loading="lazy" decoding="async" />
        </figure>
        <p className="dolce-venue-name">{content.venueName}</p>
        <p className="dolce-venue-addr">Address: {content.venueAddress}</p>
        <a className="dolce-venue-link" href={directions} target="_blank" rel="noopener">
          View the location
        </a>
        {/* Embedded map — a Studio-brief addition (the standalone
            has only the link above); same narrow column, sand border. */}
        {query ? (
          <div className="dolce-venue-map">
            <iframe
              title={`Map — ${content.venueName || "wedding venue"}`}
              src={mapsEmbedUrl(query)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="dolce-venue-iframe"
            />
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

/* ---------- 7. Dress Code ---------- */

export function DolceVitaDressCode({ site }: { site: WeddingSite }) {
  return (
    <section id="dress-code" aria-label="Dress code" className="dolce-section">
      <Reveal>
        <SectionTitle>Dress Code</SectionTitle>
        <p className="dolce-body">{site.content.dressCode}</p>
        <FloralSpray className="dolce-dress-ornament dolce-float-anim-x" />
      </Reveal>
    </section>
  );
}

/* ---------- 9. Colours ---------- */

export function DolceVitaColours() {
  return (
    <section id="colours" aria-label="Dress code colours" className="dolce-section">
      <Reveal>
        <p className="dolce-colours-label">Colours:</p>
        <div className="dolce-swatches">
          {DOLCE.swatches.map((c, i) => (
            <span
              key={c}
              className="dolce-swatch"
              style={{ backgroundColor: c, animationDelay: `${0.05 + i * 0.15}s` }}
              title={c}
            />
          ))}
        </div>
        <p className="dolce-body dolce-colours-body">
          Ladies: Light, elegant summer dresses in pastel tones &mdash; a hat and sunglasses will
          keep you comfortable in the afternoon sun. Gentlemen: A suit or smart shirt in classic
          shades &mdash; grey, blue, brown or beige all fit the day beautifully.
        </p>
      </Reveal>
    </section>
  );
}
