import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useOs } from '../store';
import { DOCK } from '../data/content';
import { smoothScrollTo } from '../lib/smoothScroll';

/** macOS-style dock with proximity magnification, scroll-spy and smooth-scroll. */
export function Dock() {
  const phase = useOs((s) => s.phase);
  const activeApp = useOs((s) => s.activeApp);
  const setActiveApp = useOs((s) => s.setActiveApp);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveApp(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    for (const app of DOCK) {
      const el = document.getElementById(app.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [setActiveApp]);

  if (phase === 'boot') return null;

  const go = (id: string) => smoothScrollTo(id);

  // proximity magnification: scale each icon by its distance from the cursor
  const magnify = (clientX: number) => {
    const nav = navRef.current;
    if (!nav) return;
    for (const btn of Array.from(nav.querySelectorAll<HTMLElement>('.dock-app'))) {
      const rect = btn.getBoundingClientRect();
      const dist = Math.abs(clientX - (rect.left + rect.width / 2));
      const scale = Math.max(1, 1.55 - dist / 150);
      btn.style.setProperty('--mag', scale.toFixed(3));
    }
  };
  const reset = () => {
    const nav = navRef.current;
    if (!nav) return;
    for (const btn of Array.from(nav.querySelectorAll<HTMLElement>('.dock-app'))) {
      btn.style.setProperty('--mag', '1');
    }
  };

  return (
    <motion.nav
      ref={navRef}
      className="dock"
      aria-label="Primary"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={(e) => magnify(e.clientX)}
      onMouseLeave={reset}
    >
      {DOCK.map((app) => (
        <button
          key={app.id}
          className={`dock-app ${activeApp === app.id ? 'active' : ''}`}
          onClick={() => go(app.id)}
          aria-label={app.label}
        >
          <span aria-hidden="true">{app.glyph}</span>
          <span className="tip">{app.label}</span>
        </button>
      ))}
    </motion.nav>
  );
}
