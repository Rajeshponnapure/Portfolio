import { useEffect } from 'react';

/** Core Web Vitals monitoring */
export function useWebVitals() {
  useEffect(() => {
    // Diagnostics are dev-only; production visitors shouldn't pay for five observers.
    if (!import.meta.env.DEV) return;
    // Only run in browser
    if (typeof window === 'undefined') return;

    // LCP - Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            console.log('[LCP]', Math.round(lastEntry.startTime), 'ms');
            // Send to analytics: gtag('event', 'LCP', { value: Math.round(lastEntry.startTime) })
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch {
        // LCP not supported
      }

      try {
        // FID - First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            console.log('[FID]', Math.round(entry.processingStart - entry.startTime), 'ms');
            // Send to analytics
          });
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch {
        // FID not supported
      }

      try {
        // CLS - Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          console.log('[CLS]', clsValue.toFixed(4));
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // CLS not supported
      }

      try {
        // TTFB - Time to First Byte
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              console.log('[TTFB]', Math.round(navEntry.responseStart - navEntry.requestStart), 'ms');
            }
          });
        });
        navObserver.observe({ type: 'navigation', buffered: true });
      } catch {
        // Navigation timing not supported
      }
    }

    // Long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.log('[Long Task]', Math.round(entry.duration), 'ms', entry.name);
          }
        });
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch {
      // Long tasks not supported
    }

    // Resource timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource');
        const slowResources = resources
          .filter((r) => r.duration > 1000)
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 10);
        
        if (slowResources.length > 0) {
          console.log('[Slow Resources]', slowResources.map((r) => ({
            name: r.name,
            duration: Math.round(r.duration),
            type: r.initiatorType,
          })));
        }
      }, 0);
    });
  }, []);
}

/** Error boundary integration for error tracking */
export function useErrorTracking() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handleError = (event: ErrorEvent) => {
      console.error('[Error]', event.message, event.filename, event.lineno, event.colno);
      // Send to error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(event.error)
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('[Unhandled Rejection]', event.reason);
      // Send to error tracking service
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
}

/** Performance marks for custom timing */
export function usePerformanceMarks() {
  const mark = (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  };

  const measure = (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      if (endMark) {
        performance.mark(endMark);
      }
      try {
        performance.measure(name, startMark, endMark);
        const entries = performance.getEntriesByName(name, 'measure');
        if (entries.length > 0) {
          console.log(`[Measure] ${name}:`, Math.round(entries[entries.length - 1].duration), 'ms');
        }
      } catch {
        // Measure failed
      }
    }
  };

  return { mark, measure };
}