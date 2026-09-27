import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
}

function createNodes(width: number, height: number): NodePoint[] {
  const count = Math.max(72, Math.min(150, Math.floor((width * height) / 13000)));
  return Array.from({ length: count }, (_, i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.22,
    r: 1 + Math.random() * 2.2,
    hue: [190, 262, 316, 34][i % 4],
  }));
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const [staticDraw, setStaticDraw] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setStaticDraw(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let nodes: NodePoint[] = [];
    const pointer = { x: 0.5, y: 0.45 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.7);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(width, height);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / Math.max(width, 1);
      pointer.y = e.clientY / Math.max(height, 1);
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const px = pointer.x * width;
      const py = pointer.y * height;
      const bg = ctx.createRadialGradient(px, py, 20, px, py, Math.max(width, height) * 0.8);
      bg.addColorStop(0, 'rgba(67, 224, 255, 0.15)');
      bg.addColorStop(0.28, 'rgba(168, 85, 247, 0.08)');
      bg.addColorStop(1, 'rgba(5, 6, 10, 0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      for (let lane = 0; lane < 9; lane += 1) {
        const y = ((time * (0.018 + lane * 0.002) + lane * 131) % (height + 180)) - 90;
        const alpha = 0.055 + (lane % 3) * 0.018;
        ctx.beginPath();
        ctx.moveTo(-80, y);
        for (let x = -80; x <= width + 80; x += 80) {
          const wave = Math.sin((x * 0.008) + (time * 0.0015) + lane) * 26;
          ctx.lineTo(x, y + wave + Math.sin(time * 0.0008 + lane) * 18);
        }
        ctx.strokeStyle = `hsla(${lane % 2 ? 190 : 282}, 92%, 62%, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (const n of nodes) {
        const dx = n.x - px;
        const dy = n.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist < 220) {
          n.vx += (dx / Math.max(dist, 1)) * 0.004;
          n.vy += (dy / Math.max(dist, 1)) * 0.004;
        }
        n.x += n.vx;
        n.y += n.vy;
        n.vx *= 0.995;
        n.vy *= 0.995;
        if (n.x < -30) n.x = width + 30;
        if (n.x > width + 30) n.x = -30;
        if (n.y < -30) n.y = height + 30;
        if (n.y > height + 30) n.y = -30;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d > 125) continue;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(238, 242, 255, ${0.09 * (1 - d / 125)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 95%, 68%, 0.58)`;
        ctx.shadowColor = `hsla(${n.hue}, 95%, 68%, 0.65)`;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      raf = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer);
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reducedMotion]);

  // Draw static version for reduced motion
  useEffect(() => {
    if (!reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const nodes = createNodes(width, height);
    ctx.clearRect(0, 0, width, height);

    // Static radial gradient
    const bg = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(width, height) * 0.8);
    bg.addColorStop(0, 'rgba(67, 224, 255, 0.15)');
    bg.addColorStop(0.28, 'rgba(168, 85, 247, 0.08)');
    bg.addColorStop(1, 'rgba(5, 6, 10, 0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Static nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue}, 95%, 68%, 0.3)`;
      ctx.fill();
    }
  }, [reducedMotion]);

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />
    </>
  );
}