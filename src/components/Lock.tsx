import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useOs } from '../store';
import { PROFILE } from '../data/content';
import { smoothScrollTo } from '../lib/smoothScroll';

const EASE = [0.23, 1, 0.32, 1] as const;
const NAV = [
  { id: 'home', glyph: '⌂', label: 'Home' },
  { id: 'about', glyph: '◆', label: 'About' },
  { id: 'projects', glyph: '▥', label: 'Work' },
  { id: 'arsenal', glyph: '◎', label: 'Stack' },
  { id: 'journey', glyph: '◷', label: 'Journey' },
  { id: 'connect', glyph: '✦', label: 'Connect' },
];
const DISPLAY = 'P. GNANA RAJESWARA REDDY';

function useTypewriter(words: readonly string[], typeMs = 65, deleteMs = 32, hold = 1400) {
  const [text, setText] = useState('');
  const [wi, setWi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const word = words[wi % words.length];
    let t = 0;
    if (!del && text === word) {
      t = window.setTimeout(() => setDel(true), hold);
    } else if (del && text === '') {
      setDel(false);
      setWi((v) => v + 1);
    } else {
      t = window.setTimeout(() => {
        setText(word.slice(0, del ? text.length - 1 : text.length + 1));
      }, del ? deleteMs : typeMs);
    }
    return () => window.clearTimeout(t);
  }, [text, del, wi, words, typeMs, deleteMs, hold]);

  return text;
}

export function Lock() {
  const login = useOs((s) => s.login);
  const phase = useOs((s) => s.phase);
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 560], [0, -95]);
  const figureY = useTransform(scrollY, [0, 560], [0, 70]);
  const fade = useTransform(scrollY, [0, 520], [1, 0]);

  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });

  const typed = useTypewriter(PROFILE.roles);

  useEffect(() => {
    if (phase !== 'lock') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') login();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, login]);

  return (
    <section
      className="lock hero-v2"
      id="home"
      onPointerMove={(e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        ry.set(((e.clientX - cx) / cx) * 10);
        rx.set((-(e.clientY - cy) / cy) * 7);
      }}
    >
      <motion.nav className="reference-nav" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: EASE }}>
        <button className="nav-brand" onClick={() => smoothScrollTo('home')} aria-label="Home">
          <span className="brand-mark">R</span>
          <b>{PROFILE.short} Reddy</b>
        </button>
        <i />
        {NAV.map((item) => (
          <button key={item.id} aria-label={item.label} title={item.label} onClick={() => smoothScrollTo(item.id)}>
            <span aria-hidden="true">{item.glyph}</span>
            <em className="nav-tip">{item.label}</em>
          </button>
        ))}
      </motion.nav>

      <div className="title-3d-wrap">
        <motion.h1 className="reference-title hero-name" style={{ y: titleY, opacity: fade, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}>
          <span className="title-kicker">Hi, I&apos;m</span>
          <span className="title-name">
            {(() => {
              let gi = 0;
              return DISPLAY.split(' ').map((word, wi) => (
                <span className="title-word" key={wi}>
                  {word.split('').map((ch, ci) => {
                    const delay = 0.25 + gi * 0.028;
                    gi += 1;
                    return (
                      <motion.span
                        className="title-letter"
                        key={ci}
                        initial={{ opacity: 0, y: 44, rotateX: -70 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay, duration: 0.65, ease: EASE }}
                      >
                        {ch}
                      </motion.span>
                    );
                  })}
                </span>
              ));
            })()}
          </span>
        </motion.h1>
      </div>

      <motion.div className="hero-type mono" style={{ opacity: fade }}>
        I build <span className="hero-type-word">{typed}</span>
        <span className="hero-caret" />
      </motion.div>

      <motion.div
        className="hero-figure"
        style={{ y: figureY, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.4, duration: 1, ease: EASE }}
      >
        <motion.div className="hero-float" animate={{ y: [0, -14, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="hero-aura" aria-hidden="true" />
          <button className="hero-img-btn" onClick={login} aria-label="Open portfolio">
            <img className="hero-img" src="/portraits/Hero.png" alt="Gnana Rajeswara Reddy" draggable={false} />
            <span className="hero-scan" aria-hidden="true" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div className="reference-login mono" style={{ opacity: fade }}>
        Click the portrait or press Enter to open the portfolio
      </motion.div>
    </section>
  );
}
