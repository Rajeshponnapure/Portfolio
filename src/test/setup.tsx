/* eslint-disable @typescript-eslint/no-explicit-any -- loose prop types are fine for test mocks */
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Lenis
class MockLenis {
  raf = vi.fn()
  scrollTo = vi.fn()
  stop = vi.fn()
  start = vi.fn()
  destroy = vi.fn()
  constructor() {}
}

vi.mock('lenis', () => ({
  default: MockLenis,
}))

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
  useSpring: () => ({ get: () => 0, set: vi.fn() }),
  useMotionValue: () => ({ get: () => 0, set: vi.fn() }),
}))

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  BrowserRouter: ({ children }: any) => <>{children}</>,
  Routes: ({ children }: any) => <>{children}</>,
  Route: () => null,
  Navigate: () => null,
  Outlet: () => null,
}))

// Mock react-helmet-async
vi.mock('react-helmet-async', () => ({
  HelmetProvider: ({ children }: any) => <>{children}</>,
  Helmet: () => null,
}))

// Mock store
vi.mock('./store', () => ({
  useOs: () => ({
    phase: 'desktop',
    activeApp: 'home',
    pointerActive: false,
    setPhase: vi.fn(),
    setActiveApp: vi.fn(),
    setPointerActive: vi.fn(),
    login: vi.fn(),
  }),
}))

// Mock matchMedia for reduced motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
if (typeof globalThis !== 'undefined') {
  globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }))
}