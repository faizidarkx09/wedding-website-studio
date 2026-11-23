// The Sacred Garden music toggle — user-initiated play/pause ONLY,
// never autoplay. The audio element lives in the renderer and is
// SHARED with the envelope: the envelope tap starts the music, and
// this toggle (fixed bottom-right, 60px burgundy circle, white icons,
// audit §0.3) pauses/resumes the same element. It appears only after
// the envelope opens. If the audio file cannot load, the toggle hides
// itself entirely — never a dead button.
"use client";

import { VolumeX, Volume2 } from "lucide-react";
import { SACRED } from "./tokens";

export default function SacredGardenMusicToggle({
  playing,
  available,
  onToggle,
}: {
  playing: boolean;
  available: boolean;
  onToggle: () => void;
}) {
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Pause wedding music" : "Play wedding music"}
      className="fixed right-5 bottom-5 z-40 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full text-white shadow-[0_4px_6px_rgba(0,0,0,0.1)] transition hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ backgroundColor: SACRED.burgundy, outlineColor: SACRED.gold }}
    >
      {playing ? (
        <Volume2 className="h-[30px] w-[30px]" aria-hidden="true" />
      ) : (
        <VolumeX className="h-[30px] w-[30px]" aria-hidden="true" />
      )}
    </button>
  );
}
