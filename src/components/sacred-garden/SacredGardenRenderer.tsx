// The Sacred Garden renderer — assembles the template in audit
// order: envelope → hero → welcome → countdown → schedule → venue →
// gallery → dress-code → RSVP → closing footer. NO top nav (the
// original has none) and NO story timeline (the original has none).
// Every section reads from the site document; the sections
// themselves decide whether they render (visibility settings,
// presence of data). Used by the shared SiteRenderer branch and by
// the /w/[slug]/rsvp page via SacredGardenRsvpForm.
//
// MUSIC: one <audio> element lives here and is shared by the
// envelope and the toggle — the envelope tap starts it, the floating
// burgundy toggle pauses/resumes it. Never autoplay.
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ChevronDown, Clock } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { SACRED, coupleNames, formatLongDate, initials, musicUrl, willRenderSection } from "./tokens";
import { Divider, Flower, FloralDrift, WaxSeal } from "./Decor";
import SacredGardenEnvelope from "./SacredGardenEnvelope";
import SacredGardenHero from "./SacredGardenHero";
import {
  SacredGardenCountdown,
  SacredGardenDressCode,
  SacredGardenEvents,
  SacredGardenVenue,
  SacredGardenWelcome,
} from "./SacredGardenSections";
import SacredGardenGallery from "./SacredGardenGallery";
import SacredGardenRsvpForm from "./SacredGardenRsvpForm";
import SacredGardenMusicToggle from "./SacredGardenMusicToggle";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
      }
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 10 }}
      transition={{ duration: 0.3 }}
      // Bottom-LEFT: bottom-right is the music toggle's corner.
      className="fixed bottom-5 left-5 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white shadow-lg"
      style={{ backgroundColor: SACRED.burgundy, pointerEvents: visible ? "auto" : "none" }}
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </motion.button>
  );
}

export default function SacredGardenRenderer({
  site,
  envelope = true,
  preview = false,
}: {
  site: WeddingSite;
  envelope?: boolean;
  preview?: boolean;
}) {
  const names = coupleNames(site);
  const dateLine = formatLongDate(site.weddingDate, site.timezone);
  const url = musicUrl(site);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [musicAvailable, setMusicAvailable] = useState(true);
  // The music toggle appears only after the envelope opens (audit
  // §0.3); with no envelope (editor preview) it is visible at once.
  const [opened, setOpened] = useState(!envelope);

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

  const handleEnvelopeOpen = useCallback(() => {
    setOpened(true);
    void startMusic();
  }, [startMusic]);

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

  const rsvpOpen =
    site.settings.rsvpEnabled &&
    (!site.settings.rsvpDeadline || Date.parse(site.settings.rsvpDeadline) > Date.now());
  const rsvpClosed =
    site.settings.rsvpEnabled &&
    site.settings.rsvpDeadline &&
    Date.parse(site.settings.rsvpDeadline) <= Date.now();

  // Closing photo: Phase A reuses the hero photograph (the only
  // couple photo that exists yet). Phase B replaces it with the
  // dedicated closing photo (see SLOT_MAP.md, slot "closing").
  const closingSrc =
    !site.content.heroImage || site.content.heroImage.includes("picsum.photos")
      ? (site.templateSnapshot.heroImage ?? site.content.heroImage)
      : site.content.heroImage;

  return (
    <div
      className="sacred-paper min-h-svh"
      style={{ backgroundColor: SACRED.cream, color: SACRED.brown, fontFamily: "var(--font-cormorant), Georgia, serif" }}
    >
      {preview ? (
        <div
          className="relative z-50 px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white"
          style={{ backgroundColor: SACRED.burgundy }}
        >
          Preview — this is how The Sacred Garden template looks with placeholder content. Your
          couple&rsquo;s details will appear here once the website is customised.
        </div>
      ) : null}

      {envelope ? (
        <SacredGardenEnvelope site={site} onPrimeAudio={primeAudio} onOpen={handleEnvelopeOpen} />
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
        <SacredGardenMusicToggle playing={playing} available={musicAvailable} onToggle={() => void toggleMusic()} />
      ) : null}

      <main>
        <SacredGardenHero site={site} />
        {willRenderSection(site, "welcome") ? <SacredGardenWelcome site={site} /> : null}
        {willRenderSection(site, "countdown") ? <SacredGardenCountdown site={site} /> : null}
        {willRenderSection(site, "events") ? <SacredGardenEvents site={site} /> : null}
        {willRenderSection(site, "venue") ? <SacredGardenVenue site={site} /> : null}
        {willRenderSection(site, "gallery") ? <SacredGardenGallery site={site} /> : null}
        {willRenderSection(site, "dress-code") ? <SacredGardenDressCode site={site} /> : null}

        {/* RSVP — wax seal + pulsing cue that scrolls to the INLINE
            form (audit bug #4: the source's text-link trigger is too
            easy to miss; no popup). */}
        {site.settings.rsvpEnabled ? (
          <section id="rsvp" aria-label="RSVP" className="mx-auto w-full max-w-4xl" style={{ backgroundColor: SACRED.lighterCream }}>
            <div className="px-5 py-20 sm:py-24">
              <div className="text-center">
                <WaxSeal className="mx-auto h-24 w-24" style={{ color: SACRED.burgundy }} />
                <h2 className="sacred-script mt-6 text-[41px] leading-[1.55]" style={{ color: SACRED.gold }}>
                  Confirm Your Attendance
                </h2>
                <Divider className="mx-auto mt-2 h-4 w-44" style={{ color: SACRED.gold }} />
                <p className="mx-auto mt-4 max-w-xl text-[21px] leading-[1.25]" style={{ color: SACRED.brown }}>
                  To help us prepare for a joyful celebration, kindly confirm your attendance.
                  {site.settings.rsvpDeadline
                    ? ` Please RSVP before ${formatLongDate(site.settings.rsvpDeadline, site.timezone)}.`
                    : ""}
                </p>
                {rsvpOpen ? (
                  <motion.a
                    href="#rsvp-form"
                    aria-label="Open the RSVP form"
                    className="mt-8 inline-flex flex-col items-center gap-1"
                    style={{ color: SACRED.gold }}
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                    <span className="sacred-script text-[32px] leading-[1.55]">Click to open</span>
                  </motion.a>
                ) : null}
              </div>
              <div className="mt-10">
                {rsvpOpen ? (
                  <SacredGardenRsvpForm site={site} />
                ) : rsvpClosed ? (
                  <div className="mx-auto flex max-w-xl items-start gap-3 rounded-sm border bg-white px-5 py-4" style={{ borderColor: SACRED.beige }}>
                    <Clock className="mt-0.5 h-5 w-5 shrink-0" style={{ color: SACRED.gold }} aria-hidden="true" />
                    <p className="text-sm leading-relaxed">
                      RSVPs for this wedding are now closed
                      {site.settings.rsvpDeadline
                        ? ` (the deadline was ${formatLongDate(site.settings.rsvpDeadline, site.timezone)})`
                        : ""}
                      . If you still need to reply, please contact the couple directly.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* Closing footer */}
      <footer className="relative overflow-hidden" style={{ backgroundColor: SACRED.beige, color: SACRED.brown }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center"
        >
          {closingSrc ? (
            <div className="w-full max-w-md overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={closingSrc} alt={`${names} — closing photograph`} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
            </div>
          ) : null}
          <FloralDrift>
            <Flower className="mt-10 h-10 w-10 opacity-70" style={{ color: SACRED.gold }} />
          </FloralDrift>
          <p className="sacred-script mt-4 text-[41px] leading-[1.55]" style={{ color: SACRED.gold }}>
            Hope to see you there!
          </p>
          <p className="mt-3 text-[21px] leading-[1.25]" style={{ color: SACRED.brown }}>
            {site.content.partnerA} and {site.content.partnerB}
          </p>
          <Divider className="mt-6 h-4 w-44" style={{ color: SACRED.gold }} />
          <p className="mt-8 text-[11px] font-semibold tracking-[0.3em] uppercase opacity-50">
            The Sacred Garden · {initials(site)}
          </p>
        </motion.div>
      </footer>

      <BackToTop />
    </div>
  );
}
