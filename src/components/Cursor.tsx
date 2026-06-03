import { useEffect } from 'react';

/** Custom OS-style cursor: an ember dot + a ring that grows over interactive targets. */
export function Cursor() {
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const b = document.body.style;
      b.setProperty('--cx', `${e.clientX}px`);
      b.setProperty('--cy', `${e.clientY}px`);
      const r = document.documentElement.style;
      r.setProperty('--mx', `${((e.clientX / window.innerWidth) * 100).toFixed(1)}%`);
      r.setProperty('--my', `${((e.clientY / window.innerHeight) * 100).toFixed(1)}%`);
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const hot = !!target?.closest('a, button, .xray, [data-hover]');
      document.body.classList.toggle('pointer-active', hot);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
    </>
  );
}
