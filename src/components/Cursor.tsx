import { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  hue: number;
  size: number;
}

/** Custom OS-style cursor with professional colored tail effect. */
export function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useRef(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);
  const lastPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const hueRef = useRef(0);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mediaQuery.matches;
    const handler = (e: MediaQueryListEvent) => { reducedMotion.current = e.matches; };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const move = (e: PointerEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      document.body.style.setProperty('--cx', `${e.clientX}px`);
      document.body.style.setProperty('--cy', `${e.clientY}px`);
      document.documentElement.style.setProperty('--mx', `${((e.clientX / window.innerWidth) * 100).toFixed(1)}%`);
      document.documentElement.style.setProperty('--my', `${((e.clientY / window.innerHeight) * 100).toFixed(1)}%`);

      if (!reducedMotion.current) {
        // Add trail point with cycling hue (ember -> cyan -> violet)
        hueRef.current = (hueRef.current + 8) % 360;
        setTrail(prev => [
          ...prev.slice(-30),
          {
            x: e.clientX,
            y: e.clientY,
            life: 1,
            hue: hueRef.current,
            size: 4 + Math.random() * 3,
          }
        ]);
      }
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hot = !!target?.closest('a, button, .xray, [data-hover], .hero-img-btn, .proj-card, .dock-app, .chip, .cat-chip, .b-tab, .nav-brand, .lock-portrait');
      document.body.classList.toggle('pointer-active', hot);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mouseover', over);

    const animate = () => {
      if (reducedMotion.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      setTrail(prev => {
        const next = prev.map(p => ({
          ...p,
          life: p.life - 0.015,
          size: p.size * 0.985,
        })).filter(p => p.life > 0);

        // Draw trail segments with gradient
        for (let i = 0; i < next.length - 1; i++) {
          const p1 = next[i];
          const p2 = next[i + 1];
          const alpha = p1.life * 0.4;

          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, `hsla(${p1.hue}, 85%, 60%, ${alpha})`);
          grad.addColorStop(1, `hsla(${p2.hue}, 85%, 60%, ${alpha * 0.5})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = p1.size;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Glow effect
          ctx.shadowColor = `hsla(${p1.hue}, 85%, 60%, ${alpha * 0.8})`;
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Draw particles at each point
        for (const p of next) {
          const alpha = p.life * 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${alpha})`;
          ctx.shadowColor = `hsla(${p.hue}, 85%, 60%, ${alpha})`;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9998 }} />
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}