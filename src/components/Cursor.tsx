import { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  hue: number;
  size: number;
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/**
 * Custom OS-style cursor with a coloured tail. Only activates on devices that have a real
 * pointer; touch devices do no work. All state lives in refs and the canvas loop sleeps
 * whenever the trail is empty, so there are no React re-renders.
 */
export function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia(FINE_POINTER);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !fine.matches) return;

    const root = document.documentElement;
    let trail: TrailPoint[] = [];
    let hue = 0;
    let raf = 0;
    let last = 0;
    let width = 0;
    let height = 0;
    let pending: PointerEvent | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (time: number) => {
      raf = 0;
      // Delta-time keeps the fade identical on 60/90/120/144 Hz displays.
      const dt = Math.min((time - last) / 16.667, 3) || 1;
      last = time;

      if (pending) {
        const e = pending;
        pending = null;
        root.style.setProperty('--cx', `${e.clientX}px`);
        root.style.setProperty('--cy', `${e.clientY}px`);
        if (!motion.matches) {
          hue = (hue + 8) % 360;
          trail.push({ x: e.clientX, y: e.clientY, life: 1, hue, size: 4 + Math.random() * 3 });
          if (trail.length > 28) trail.shift();
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      for (const p of trail) {
        p.life -= 0.015 * dt;
        p.size *= 0.985 ** dt;
      }
      trail = trail.filter((p) => p.life > 0);

      for (let i = 0; i < trail.length - 1; i += 1) {
        const a = trail[i];
        const b = trail[i + 1];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${a.hue}, 85%, 60%, ${a.life * 0.4})`;
        ctx.lineWidth = a.size;
        ctx.stroke();
      }

      // Keep running only while there is something to animate or draw.
      if (trail.length > 0 || pending) raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const move = (e: PointerEvent) => {
      pending = e;
      schedule();
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hot = !!target?.closest('a, button, [data-hover], .hero-img-btn, .proj-card, .dock-app, .chip, .cat-chip, .b-tab, .nav-brand, .lock-portrait');
      document.body.classList.toggle('pointer-active', hot);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
