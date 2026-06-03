/**
 * Single background-audio element for the whole app.
 * Drop an MP3 at /public/audio/ambient.mp3 and it plays on the power-on click.
 * Until then every call no-ops gracefully (play() rejection is swallowed).
 */
let audio: HTMLAudioElement | null = null;

function get(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio('/audio/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.32;
    audio.preload = 'auto';
  }
  return audio;
}

/** Called from a user gesture (the boot power button) so autoplay policy allows it. */
export function startAudio() {
  const a = get();
  a.muted = false;
  void a.play().catch(() => {});
}

export function toggleMuted(): boolean {
  const a = get();
  a.muted = !a.muted;
  if (!a.muted) void a.play().catch(() => {});
  return a.muted;
}

export function getMuted(): boolean {
  return audio ? audio.muted : true;
}
