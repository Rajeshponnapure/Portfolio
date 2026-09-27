import { useEffect, useState } from 'react';

/** Hook to detect prefers-reduced-motion preference. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/** Framer Motion transition config that respects reduced motion. */
export function getTransition(transition: object, reduced: boolean) {
  if (reduced) {
    return { duration: 0.01, ...transition };
  }
  return transition;
}

/** Variants that respect reduced motion. */
export function getVariants(variants: object, reduced: boolean) {
  if (reduced) {
    const reducedVariants: Record<string, object> = {};
    for (const [key, value] of Object.entries(variants)) {
      if (typeof value === 'object' && value !== null) {
        reducedVariants[key] = { ...value, transition: { duration: 0.01 } };
      }
    }
    return reducedVariants;
  }
  return variants;
}