import { useEffect, useRef } from 'react';

/** Focus trap for modals/dialogs */
export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [active, containerRef]);
}

/** Announce messages to screen readers */
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!announcerRef.current) {
      const div = document.createElement('div');
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', 'polite');
      div.setAttribute('aria-atomic', 'true');
      div.style.position = 'absolute';
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.padding = '0';
      div.style.margin = '-1px';
      div.style.overflow = 'hidden';
      div.style.clip = 'rect(0, 0, 0, 0)';
      div.style.whiteSpace = 'nowrap';
      div.style.border = '0';
      document.body.appendChild(div);
      announcerRef.current = div;
    }
    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;
    }
  };

  return { announce };
}

/** Skip link for keyboard navigation */
export function SkipLink({ target = '#main-content', children = 'Skip to main content' }: { target?: string; children?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <a
      href={target}
      className="skip-link"
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      style={{
        position: 'absolute',
        top: '-100%',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px',
        background: 'var(--amber)',
        color: '#06070b',
        fontWeight: 700,
        borderRadius: '8px',
        zIndex: 9999,
        transition: 'top 0.2s ease',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        top: visible ? '16px' : '-100%',
      }}
    >
      {children}
    </a>
  );
}

import { useState } from 'react';

/** Keyboard navigation helper */
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key handling
      if (e.key === 'Escape') {
        // Close modals, dropdowns, etc.
        document.dispatchEvent(new CustomEvent('keyboard-escape'));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

/** Reduced motion detection */
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

/** Focus visible polyfill for better keyboard focus styles */
export function useFocusVisible() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :focus:not(:focus-visible) {
        outline: none;
      }
      :focus-visible {
        outline: 2px solid var(--cyan);
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
}