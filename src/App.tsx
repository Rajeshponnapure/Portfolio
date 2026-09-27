import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useOs } from './store';
import { Layout } from './components/Layout';
import { initSmoothScroll, pauseSmoothScroll, resumeSmoothScroll } from './lib/smoothScroll';
import { useWebVitals, useErrorTracking } from './hooks/usePerformanceMonitoring';
import { SkipLink, useFocusVisible, useReducedMotion } from './hooks/useAccessibility';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ArsenalPage = lazy(() => import('./pages/ArsenalPage'));
const JourneyPage = lazy(() => import('./pages/JourneyPage'));
const ConnectPage = lazy(() => import('./pages/ConnectPage'));

function LoadingFallback() {
  return (
    <div className="loading-fallback" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      color: 'var(--muted)',
      fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
      fontSize: '14px'
    }}>
      Loading…
    </div>
  );
}

function App() {
  const { phase, login } = useOs();

  useWebVitals();
  useErrorTracking();
  useFocusVisible();
  useReducedMotion();

  useEffect(() => {
    initSmoothScroll();
  }, []);

  // Handle lock screen scroll - allow scrolling on home page for parallax
  useEffect(() => {
    if (phase === 'lock') {
      document.body.style.overflow = '';
      resumeSmoothScroll();
    } else {
      document.body.style.overflow = '';
      resumeSmoothScroll();
    }
  }, [phase]);

  return (
    <BrowserRouter>
      <SkipLink target="#main-content" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="arsenal" element={<ArsenalPage />} />
            <Route path="journey" element={<JourneyPage />} />
            <Route path="connect" element={<ConnectPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;