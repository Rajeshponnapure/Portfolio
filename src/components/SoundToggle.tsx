import { useState } from 'react';
import { useOs } from '../store';
import { toggleMuted, getMuted } from '../lib/audio';

/** Floating mute / unmute control for the background ambience. */
export function SoundToggle() {
  const phase = useOs((s) => s.phase);
  const [muted, setMuted] = useState(getMuted());

  if (phase === 'boot') return null;

  return (
    <button
      className="sound-toggle"
      onClick={() => setMuted(toggleMuted())}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      title={muted ? 'Sound on' : 'Sound off'}
    >
      <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
    </button>
  );
}
