import Lenis from 'lenis';

let instance: Lenis | null = null;
let rafId = 0;

/** Buttery inertial scroll (Lenis). Created once for the whole app. */
export function initSmoothScroll(): Lenis {
  if (instance) return instance;
  instance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  });
  const raf = (time: number) => {
    instance?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
  return instance;
}

export function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: 0, duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function pauseSmoothScroll() {
  instance?.stop();
}

export function resumeSmoothScroll() {
  instance?.start();
}

export function destroySmoothScroll() {
  if (!instance) return;
  cancelAnimationFrame(rafId);
  instance.destroy();
  instance = null;
}
