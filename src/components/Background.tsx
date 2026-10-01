import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
}

const LINK_DIST = 125;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

function createNodes(width: number, height: number): NodePoint[] {
  const count = Math.max(24, Math.min(48, Math.floor((width * height) / 30000)));
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.22,
    r: 1 + Math.random() * 2.2,
    hue: [190, 262, 316, 34][i % 4],
  }));
}

/**
 * Ambient network canvas. Desktop-class devices (fine pointer, no reduced-motion) get the
 * animated version, capped at ~48 nodes and ~30 fps equivalent cost; everything else gets a
 * single static frame, so phones and tablets spend zero per-frame time here. The loop also
 * pauses while the tab is hidden.
 */
export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animated = !reducedMotion && window.matchMedia(FINE_POINTER).matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let nodes: NodePoint[] = [];
    const pointer = { x: 0.5, y: 0.45 };

    const render = (time: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);

      const px = pointer.x * width;
      const py = pointer.y * height;
      const bg = ctx.createRadialGradient(px, py, 20, px, py, Math.max(width, height) * 0.8);
      bg.addColorStop(0, 'rgba(67, 224, 255, 0.15)');
      bg.addColorStop(0.28, 'rgba(168, 85, 247, 0.08)');
      bg.addColorStop(1, 'rgba(5, 6, 10, 0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      if (animated) {
        for (let lane = 0; lane < 5; lane += 1) {
          const y = ((time * (0.018 + lane * 0.002) + lane * 131) % (height + 180)) - 90;
          ctx.beginPath();
          ctx.moveTo(-80, y);
          for (let x = -80; x <= width + 80; x += 80) {
            const wave = Math.sin(x * 0.008 + time * 0.0015 + lane) * 26;
            ctx.lineTo(x, y + wave + Math.sin(time * 0.0008 + lane) * 18);
          }
          ctx.strokeStyle = `hsla(${lane % 2 ? 190 : 282}, 92%, 62%, ${0.055 + (lane % 3) * 0.018})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        for (const n of nodes) {
          const dx = n.x - px;
          const dy = n.y - py;
          const distSq = dx * dx + dy * dy;
          if (distSq < 220 * 220) {
            const dist = Math.max(Math.sqrt(distSq), 1);
            n.vx += (dx / dist) * 0.004 * dt;
            n.vy += (dy / dist) * 0.004 * dt;
          }
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          const damp = 0.995 ** dt;
          n.vx *= damp;
          n.vy *= damp;
          if (n.x < -30) n.x = width + 30;
          if (n.x > width + 30) n.x = -30;
          if (n.y < -30) n.y = height + 30;
          if (n.y > height + 30) n.y = -30;
        }

        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i += 1) {
          const a = nodes[i];
          for (let j = i + 1; j < nodes.length; j += 1) {
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dSq = dx * dx + dy * dy;
            if (dSq > LINK_DIST_SQ) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(238, 242, 255, ${0.09 * (1 - Math.sqrt(dSq) / LINK_DIST)})`;
            ctx.stroke();
          }
        }
      }

      // Dots are cheap flat fills; the glow comes from a larger translucent disc, not shadowBlur.
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 95%, 68%, ${animated ? 0.12 : 0.08})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 95%, 68%, ${animated ? 0.6 : 0.35})`;
        ctx.fill();
      }
    };

    const loop = (time: number) => {
      const dt = Math.min((time - last) / 16.667, 3) || 1;
      last = time;
      render(time, dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (animated && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const resize = () => {
      // Mobile paints at 1x (it's a soft backdrop); desktop caps at 1.5x.
      const dpr = animated ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
      // Ignore height-only resizes on touch (URL bar show/hide) to avoid reallocating the canvas.
      if (!animated && width === window.innerWidth && nodes.length) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(width, height);
      if (!animated) render(0, 1);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / Math.max(width, 1);
      pointer.y = e.clientY / Math.max(height, 1);
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    if (animated) window.addEventListener('pointermove', onPointer, { passive: true });
    start();

    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
    </>
  );
}
