// ÉTERNEL music toggle — user-initiated play/pause ONLY, never autoplay.
// The track is the template default (CC0 "Romantic Inspiration" by Rafael
// Krux) unless the couple set their own music URL in Settings. If the
// audio file cannot load (e.g. before the Phase B upload), the toggle
// hides itself entirely — never a dead button.
"use client";

import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import type { WeddingSite } from "@/lib/types";
import { ETERNEL, musicUrl } from "./tokens";

export default function MusicToggle({
  site,
  dark = false,
}: {
  site: WeddingSite;
  /** True while the nav is transparent over the dark hero photo. */
  dark?: boolean;
}) {
  const url = musicUrl(site);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  // If the file 404s, hide the toggle (no dead button). The check runs
  // once per URL: a HEAD request would be another round-trip, so the
  // audio element's own error event is the signal.
  useEffect(() => {
    setAvailable(true);
    setPlaying(false);
  }, [url]);

  if (!url || !available) return null;

  async function toggle() {
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
      // Autoplay policy or a missing file — hide rather than show a
      // button that does nothing.
      setAvailable(false);
      setPlaying(false);
    }
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={url}
        loop
        preload="none"
        onError={() => setAvailable(false)}
        onEnded={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={() => void toggle()}
        aria-pressed={playing}
        aria-label={playing ? "Pause wedding music" : "Play wedding music"}
        className={`flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 ${
          dark ? "border-white/50 text-white" : "border-current"
        }`}
        style={
          dark
            ? { outlineColor: "#FFFFFF" }
            : { color: ETERNEL.espresso, borderColor: ETERNEL.taupe, outlineColor: ETERNEL.gold }
        }
      >
        {playing ? <VolumeX className="h-5 w-5" aria-hidden="true" /> : <Music className="h-5 w-5" aria-hidden="true" />}
      </button>
    </>
  );
}
