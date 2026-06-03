import { useRef } from 'react';
import { PROFILE } from '../data/content';
import { RevealText } from '../components/RevealText';

const TRAIL = [
  '/portraits/me-1.png',
  '/portraits/me-3.png',
  '/portraits/me-4.png',
  '/portraits/me-5.png',
  '/portraits/Hero.png',
];

/** Spawns a fading image at (x,y) inside the stage — the cursor image-trail effect. */
function spawn(stage: HTMLElement, src: string, x: number, y: number) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'trail-img';
  img.alt = '';
  img.style.left = `${x}px`;
  img.style.top = `${y}px`;
  img.style.setProperty('--rot', `${(Math.random() * 16 - 8).toFixed(1)}deg`);
  stage.appendChild(img);
  requestAnimationFrame(() => img.classList.add('in'));
  window.setTimeout(() => {
    img.classList.remove('in');
    img.classList.add('out');
  }, 480);
  window.setTimeout(() => img.remove(), 1050);
}

export function About() {
  const stage = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0, i: 0, t: 0 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    const moved = Math.hypot(x - last.current.x, y - last.current.y);
    if (moved < 68 && now - last.current.t < 420) return; // throttle by distance + time
    const i = (last.current.i + 1) % TRAIL.length;
    last.current = { x, y, i, t: now };
    spawn(el, TRAIL[i], x, y);
  };

  return (
    <section className="section about-cursor" id="about">
      <div className="section-head">
        <span className="eyebrow">About</span>
        <h2><RevealText text="Move your cursor — meet me." /></h2>
        <p>Story writer turned systems builder. Drag across the space below to develop the frames.</p>
      </div>

      <div className="trail-stage" ref={stage} onPointerMove={onMove}>
        <div className="trail-copy">
          <p>{PROFILE.bio[0]}</p>
          <p className="dim">{PROFILE.bio[1]}</p>
        </div>
        <div className="trail-hint mono">drag your cursor across this space →</div>
      </div>
    </section>
  );
}
