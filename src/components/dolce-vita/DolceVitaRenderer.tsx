// Dolce Vita renderer — assembles the template in the STANDALONE's
// order (index.html §§1–11): envelope → hero → scratch date →
// welcome letter → story → countdown → schedule → venue → dress
// code → gallery slider → colours → RSVP → closing footer. NO top
// nav (the original has none). The page is the standalone's narrow
// 390px centred column on #fffdfb — that IS the approved design,
// not a mobile-only treatment. Story + countdown are the two
// deliberate additions (Studio brief); everything else is the
// standalone 1:1.
//
// MUSIC: one <audio> element lives here and is shared by the
// envelope and the toggle — the envelope tap starts it, the floating
// dusty-blue toggle pauses/resumes it. Never autoplay.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import {
  CLOSING_IMAGE_URL,
  DOLCE,
  coupleNames,
  formatLongDate,
  musicUrl,
  resolveHeroSrc,
  willRenderSection,
} from "./tokens";
import { IvyCorner } from "./Decor";
import DolceVitaEnvelope from "./DolceVitaEnvelope";
import DolceVitaHero from "./DolceVitaHero";
import {
  DolceVitaColours,
  DolceVitaCountdown,
  DolceVitaDressCode,
  DolceVitaEvents,
  DolceVitaScratchDate,
  DolceVitaStory,
  DolceVitaVenue,
  DolceVitaWelcome,
} from "./DolceVitaSections";
import DolceVitaGallery from "./DolceVitaGallery";
import { DolceVitaRsvpModal } from "./DolceVitaRsvpForm";
import DolceVitaMusicToggle from "./DolceVitaMusicToggle";

export default function DolceVitaRenderer({
  site,
  envelope = true,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  const names = coupleNames(site);
  const heroSrc = resolveHeroSrc(site);
  const url = musicUrl(site);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [musicAvailable, setMusicAvailable] = useState(true);
  // The music toggle appears only after the envelope opens; with no
  // envelope (editor preview) it is visible at once.
  const [opened, setOpened] = useState(!envelope);
  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Reset the toggle state when the track changes.
  useEffect(() => {
    setMusicAvailable(true);
    setPlaying(false);
  }, [url]);

  /** Touchstart prime (Android fix): silently unlock the audio
   * element so the click's play() is accepted. Errors swallowed. */
  const primeAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    void audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
      })
      .catch(() => undefined);
  }, []);

  /** Start the shared music (envelope tap). */
  const startMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setMusicAvailable(false);
      setPlaying(false);
    }
  }, []);

  const handleEnvelopeOpen = useCallback(
    (withMusic: boolean) => {
      setOpened(true);
      if (withMusic) void startMusic();
    },
    [startMusic],
  );

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setMusicAvailable(false);
      setPlaying(false);
    }
  }

  const rsvpAccepting =
    site.settings.rsvpEnabled &&
    (!site.settings.rsvpDeadline || Date.parse(site.settings.rsvpDeadline) > Date.now());
  const rsvpClosed =
    site.settings.rsvpEnabled &&
    site.settings.rsvpDeadline &&
    Date.parse(site.settings.rsvpDeadline) <= Date.now();

  return (
    <div
      className="dolce-paper min-h-svh"
      style={{ backgroundColor: DOLCE.bg, color: DOLCE.inkSoft, fontFamily: "var(--font-rufina), Georgia, serif" }}
    >
      {preview ? (
        <div
          className="relative z-50 px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white"
          style={{ backgroundColor: DOLCE.blueDeep }}
        >
          Preview — this is how the Dolce Vita template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      {envelope ? (
        <DolceVitaEnvelope site={site} onPrimeAudio={primeAudio} onOpen={handleEnvelopeOpen} />
      ) : null}

      {/* The ONE shared audio element (envelope + toggle). */}
      {url ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio
          ref={audioRef}
          src={url}
          loop
          preload="none"
          onError={() => setMusicAvailable(false)}
          onEnded={() => setPlaying(false)}
        />
      ) : null}
      {opened && url ? (
        <DolceVitaMusicToggle playing={playing} available={musicAvailable} onToggle={() => void toggleMusic()} />
      ) : null}

      {/* Hero preload (fast-load fix): the hero fetch starts with the
          document, not after hydration (Blossom/ÉTERNEL pattern). */}
      {heroSrc ? <link rel="preload" as="image" href={heroSrc} fetchPriority="high" /> : null}

      <main className="dolce-column">
        <DolceVitaHero site={site} />
        <DolceVitaScratchDate site={site} />
        {willRenderSection(site, "welcome") ? <DolceVitaWelcome site={site} /> : null}
        {willRenderSection(site, "story") ? <DolceVitaStory site={site} /> : null}
        {willRenderSection(site, "countdown") ? <DolceVitaCountdown site={site} /> : null}
        {willRenderSection(site, "events") ? <DolceVitaEvents site={site} /> : null}
        {willRenderSection(site, "venue") ? <DolceVitaVenue site={site} /> : null}
        {willRenderSection(site, "dress-code") ? <DolceVitaDressCode site={site} /> : null}
        {willRenderSection(site, "gallery") ? <DolceVitaGallery site={site} /> : null}
        <DolceVitaColours />

        {/* RSVP — the standalone's call-to-action: intro line,
            "Confirm Your Attendance", sky-blue RSVP button with its
            shine sweep, opening the modal form. */}
        {site.settings.rsvpEnabled ? (
          <section id="rsvp" aria-label="RSVP" className="dolce-section">
            <motion.p
              className="dolce-rsvp-intro"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduceMotion ? 0 : 2, ease: "ease" }}
            >
              To help us prepare for a joyful celebration, kindly confirm your attendance.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: reduceMotion ? 0 : 1, ease: "ease" }}
            >
              <h2 className="dolce-script" style={{ fontSize: 41, lineHeight: 1.25, color: DOLCE.ink, margin: "0 0 18px" }}>
                Confirm Your Attendance
              </h2>
              {rsvpAccepting ? (
                <button type="button" onClick={() => setRsvpModalOpen(true)} className="dolce-btn-rsvp">
                  <span>RSVP</span>
                </button>
              ) : rsvpClosed ? (
                <div className="dolce-rsvp-closed">
                  <Clock className="h-5 w-5 shrink-0" style={{ color: DOLCE.blueDeep }} aria-hidden="true" />
                  <p>
                    RSVPs for this wedding are now closed
                    {site.settings.rsvpDeadline
                      ? ` (the deadline was ${formatLongDate(site.settings.rsvpDeadline, site.timezone)})`
                      : ""}
                    . If you still need to reply, please contact the couple directly.
                  </p>
                </div>
              ) : null}
            </motion.div>
          </section>
        ) : null}

        {/* Closing footer — the standalone's closing: couple photo
            with rounded bottom corners, "Hope to see you there!",
            the couple names, ivy corner ornament. */}
        <footer className="dolce-closing" aria-label="Closing">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: reduceMotion ? 0 : 1, ease: "ease" }}
          >
            <figure className="dolce-closing-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CLOSING_IMAGE_URL} alt={`${names} watching a beach sunset`} loading="lazy" decoding="async" />
            </figure>
            <h2 className="dolce-script dolce-closing-heading">Hope to see you there!</h2>
            <p className="dolce-rufina dolce-closing-names">
              {site.content.partnerA} &amp; {site.content.partnerB}
            </p>
            <IvyCorner className="dolce-closing-ornament dolce-float-anim" />
          </motion.div>
        </footer>
      </main>

      {rsvpModalOpen ? (
        <DolceVitaRsvpModal site={site} onClose={() => setRsvpModalOpen(false)} />
      ) : null}
    </div>
  );
}
