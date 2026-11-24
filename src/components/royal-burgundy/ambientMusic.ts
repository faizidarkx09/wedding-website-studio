// Romantic chamber music player — VERBATIM port of the source's
// src/lib/ambientMusic.ts (Royal Burgundy app): an optional
// user-provided audio URL, or a warm, expressive Web Audio
// harp-and-strings waltz fallback ("Clair de Lune — Chamber Waltz").
// Never autoplays — it only starts from the VinylPlayer toggle
// (a user gesture), exactly as in the source's App.tsx.
// No changes to the engine itself.
class WeddingMusicEngine {
  private audioEl: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private schedulerId: number | null = null;
  private stepIndex = 0;
  private playing = false;
  private customUrl: string;

  // Romantic D-major / B-minor chamber progression (frequencies in Hz)
  private readonly chords: number[][] = [
    [146.83, 220.0, 293.66, 369.99, 440.0, 587.33], // Dmaj7
    [123.47, 185.0, 246.94, 369.99, 440.0, 493.88], // Bm7
    [98.0, 196.0, 246.94, 293.66, 369.99, 493.88], // Gmaj7
    [110.0, 220.0, 277.18, 329.63, 440.0, 554.37], // A6
    [146.83, 220.0, 293.66, 369.99, 554.37, 587.33], // Dmaj9
    [185.0, 220.0, 277.18, 369.99, 440.0, 554.37], // F#m7
    [98.0, 196.0, 246.94, 329.63, 369.99, 493.88], // Gmaj9
    [110.0, 196.0, 246.94, 329.63, 369.99, 440.0], // A13sus4
  ];

  private readonly pattern = [0, 2, 3, 4, 5, 4, 3, 2, 1, 3, 4, 5];

  constructor(customUrl = "") {
    this.customUrl = customUrl;
  }

  public isPlaying(): boolean {
    return this.playing;
  }

  public async toggle(): Promise<boolean> {
    if (this.playing) {
      this.pause();
      return false;
    }
    await this.play();
    return true;
  }

  public async play(): Promise<void> {
    if (this.playing) return;

    if (this.customUrl) {
      if (!this.audioEl) {
        this.audioEl = new Audio(this.customUrl);
        this.audioEl.loop = true;
        this.audioEl.volume = 0.55;
      }
      await this.audioEl.play();
      this.playing = true;
      return;
    }

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    this.masterGain?.gain.cancelScheduledValues(now);
    this.masterGain?.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain?.gain.exponentialRampToValueAtTime(0.24, now + 1.1);

    this.playing = true;
    this.scheduleNextNote();
    this.schedulerId = window.setInterval(() => {
      if (this.playing) {
        this.scheduleNextNote();
      }
    }, 520);
  }

  public pause(): void {
    if (!this.playing) return;
    this.playing = false;

    if (this.audioEl) {
      this.audioEl.pause();
      return;
    }

    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    }
  }

  public dispose(): void {
    this.pause();
    if (this.audioEl) {
      this.audioEl.src = "";
      this.audioEl = null;
    }
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }

  private scheduleNextNote(): void {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const chordIdx = Math.floor(this.stepIndex / this.pattern.length) % this.chords.length;
    const notePos = this.pattern[this.stepIndex % this.pattern.length];
    const chord = this.chords[chordIdx];
    const freq = chord[notePos];

    // Warm harp-piano pluck
    this.triggerVoice(freq, now, 2.2, 0.24, "triangle");
    // Delicate upper harmonic shimmer
    this.triggerVoice(freq * 2, now, 1.4, 0.045, "sine");

    // Warm sustained cello/pad root on downbeat of each bar
    if (this.stepIndex % this.pattern.length === 0) {
      this.triggerPad(chord[0], now, 5.6, 0.14);
      this.triggerPad(chord[2], now, 5.6, 0.07);
    }

    this.stepIndex += 1;
  }

  private triggerVoice(
    freq: number,
    startTime: number,
    duration: number,
    peak: number,
    type: OscillatorType,
  ): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1750, startTime);
    filter.frequency.exponentialRampToValueAtTime(520, startTime + duration);

    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peak, startTime + 0.045);
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }

  private triggerPad(freq: number, startTime: number, duration: number, peak: number): void {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const env = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(680, startTime);

    env.gain.setValueAtTime(0.0001, startTime);
    env.gain.linearRampToValueAtTime(peak, startTime + 1.2);
    env.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const createWeddingMusicEngine = (customUrl = "") => new WeddingMusicEngine(customUrl);
