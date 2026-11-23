// Dolce Vita music toggle — the standalone's floating play/pause
// button, verbatim (styles.css .audio-control): fixed bottom-right,
// 60px dusty-blue circle, white play/pause SVG icons. The audio
// element lives in the renderer and is SHARED with the envelope:
// the envelope tap starts the music, this toggle pauses/resumes
// the same element. It appears only after the envelope opens. If
// the audio file cannot load, the toggle hides itself entirely —
// never a dead button.
"use client";

import { DOLCE } from "./tokens";

export default function DolceVitaMusicToggle({
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
      className={`dolce-audio-control${playing ? " playing" : ""}`}
      style={{ backgroundColor: DOLCE.blue }}
    >
      <svg className="dolce-icon-play" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 5v14l11-7z" fill="#fff" />
      </svg>
      <svg className="dolce-icon-pause" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="#fff" />
      </svg>
    </button>
  );
}
