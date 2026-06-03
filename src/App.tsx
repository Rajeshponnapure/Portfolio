import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOs } from './store';
import { Background } from './components/Background';
import { Cursor } from './components/Cursor';
import { Boot } from './components/Boot';
import { Lock } from './components/Lock';
import { SoundToggle } from './components/SoundToggle';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { Arsenal } from './sections/Arsenal';
import { Journey } from './sections/Journey';
import { Connect } from './sections/Connect';
import { PROFILE } from './data/content';
import { initSmoothScroll, pauseSmoothScroll, resumeSmoothScroll, smoothScrollTo } from './lib/smoothScroll';

function App() {
  const phase = useOs((s) => s.phase);

  useEffect(() => {
    initSmoothScroll();
  }, []);

  // freeze scroll while the boot intro plays
  useEffect(() => {
    if (phase === 'boot') {
      document.body.style.overflow = 'hidden';
      pauseSmoothScroll();
    } else {
      document.body.style.overflow = '';
      resumeSmoothScroll();
    }
  }, [phase]);

  // logging in glides the user down into the desktop
  useEffect(() => {
    if (phase === 'desktop') smoothScrollTo('projects');
  }, [phase]);

  return (
    <>
      <Cursor />
      <Background />

      <AnimatePresence>{phase === 'boot' && <Boot key="boot" />}</AnimatePresence>

      <main className="desktop">
        <Lock />
        <About />
        <Projects />
        <Arsenal />
        <Journey />
        <Connect />
        <footer className="foot">
          <div className="sig mono">
            {PROFILE.fullName} <b>· RAJESH·OS</b>
          </div>
          <div className="copy">Designed with logic, code and a lot of chai · © 2026</div>
        </footer>
      </main>

      <SoundToggle />
    </>
  );
}

export default App;
