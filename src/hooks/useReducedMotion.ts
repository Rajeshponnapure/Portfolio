import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** Hook to detect prefers-reduced-motion preference. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
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