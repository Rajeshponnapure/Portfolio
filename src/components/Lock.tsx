import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, type Transition } from 'framer-motion';
import { useOs } from '../store';
import { useNavigate } from 'react-router-dom';
import { PROFILE } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Picture } from './OptimizedImage';

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
      t = window.setTimeout(() => {
        setDel(false);
        setWi((v) => v + 1);
      }, 0);
    } else {
      t = window.setTimeout(() => {
        setText(word.slice(0, del ? text.length - 1 : text.length + 1));
      }, del ? deleteMs : typeMs);
    }
    return () => window.clearTimeout(t);
  }, [text, del, wi, words, typeMs, deleteMs, hold]);

  return text;
}

const focusAreas = [
  { icon: '🤖', title: 'AI & Agentic Systems', desc: 'Local-first LLMs, multi-agent orchestration, RAG pipelines, knowledge graphs, and autonomous coding agents.', accent: '268' },
  { icon: '⚡', title: 'Realtime & Communication', desc: 'WebRTC audio/video, Socket.io messaging, secure disguised communication, presence & file sharing.', accent: '200' },
  { icon: '🏙️', title: 'IoT & Smart City', desc: 'Traffic telemetry, congestion scoring, edge dashboards, citizen reporting, sensor-to-cloud pipelines.', accent: '28' },
  { icon: '🏗️', title: 'Full-Stack Platforms', desc: 'Production-grade apps with auth, payments, admin CRMs, NestJS APIs, post-purchase support.', accent: '330' },
];

const techCategories = [
  { category: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Dart', 'SQL', 'C++'], color: '268' },
  { category: 'AI / ML', items: ['LLMs', 'RAG', 'Agents', 'FastAPI', 'Computer Vision', 'Knowledge Graphs'], color: '268' },
  { category: 'Frontend', items: ['React', 'Next.js', 'Three.js', 'WebGL', 'GSAP', 'Flutter', 'Tailwind'], color: '200' },
  { category: 'Backend', items: ['Node.js', 'NestJS', 'Express', 'Socket.io', 'WebRTC', 'MongoDB', 'SQLite'], color: '158' },
  { category: 'IoT / Edge', items: ['Edge Devices', 'Telemetry', 'MQTT', 'Local-First', 'Realtime Streams'], color: '28' },
  { category: 'Cloud / DevOps', items: ['Razorpay', 'Auth/JWT', 'CI/CD', 'Docker', 'Vercel', 'SEO'], color: '330' },
];

// Child components defined outside to avoid re-creation on render
const FocusAreas = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <motion.div
    className="home-focus"
    initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay: 0.6 }}
    style={{ marginTop: 'clamp(60px, 10vh, 100px)' }}
  >
    <div className="section-head" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
      <span className="eyebrow">Focus Areas</span>
      <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: 'var(--ink)', marginTop: '12px' }}>Where I go deep</h2>
      <p style={{ color: 'var(--soft)', maxWidth: '600px', margin: '16px auto 0', fontSize: 'clamp(15px, 1.7vw, 18px)', lineHeight: 1.6 }}>Four pillars that define every system I build</p>
    </div>
    <div className="focus-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(20px, 3vw, 32px)' }}>
      {focusAreas.map((focus, i) => (
        <motion.div
          key={focus.title}
          className="focus-card"
          initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 * i }}
          style={{
            padding: 'clamp(24px, 3vw, 32px)',
            borderRadius: '20px',
            border: `1px solid hsla(${focus.accent}, 70%, 50%, 0.2)`,
            background: `linear-gradient(145deg, hsla(${focus.accent}, 60%, 40%, 0.08), transparent), rgba(10, 12, 20, 0.6)`,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = `hsla(${focus.accent}, 70%, 50%, 0.5)`;
            e.currentTarget.style.boxShadow = `0 30px 80px hsla(${focus.accent}, 70%, 40%, 0.2), 0 20px 60px rgba(0, 0, 0, 0.5)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = `hsla(${focus.accent}, 70%, 50%, 0.2)`;
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px', lineHeight: 1 }}>{focus.icon}</div>
          <h3 style={{ fontSize: 'clamp(18px, 2.2vw, 22px)', fontWeight: 700, color: 'var(--ink)', marginBottom: '12px', fontFamily: '"Space Grotesk", sans-serif' }}>{focus.title}</h3>
          <p style={{ color: 'var(--soft)', fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.65 }}>{focus.desc}</p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const TechCategories = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <motion.div
    className="home-tech"
    initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay: 0.8 }}
    style={{ marginTop: 'clamp(60px, 10vh, 100px)' }}
  >
    <div className="section-head" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 60px)' }}>
      <span className="eyebrow">Tech Stack Highlights</span>
      <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 700, color: 'var(--ink)', marginTop: '12px' }}>Tools of the trade</h2>
    </div>
    <div className="tech-categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
      {techCategories.map((cat, i) => (
        <motion.div
          key={cat.category}
          className="tech-category-card"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.05 * i }}
          style={{
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid hsla(${cat.color}, 70%, 50%, 0.15)`,
            background: `linear-gradient(145deg, hsla(${cat.color}, 60%, 40%, 0.06), transparent), rgba(10, 12, 20, 0.5)`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: `hsla(${cat.color}, 70%, 50%, 0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: `hsl(${cat.color}, 70%, 50%)`,
              fontFamily: '"Sometype Mono", monospace',
              fontWeight: 700,
              fontSize: '14px'
            }}>»</span>
            <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: 0, fontFamily: '"Space Grotesk", sans-serif' }}>{cat.category}</h4>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {cat.items.map((item) => (
              <span key={item} style={{
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontFamily: '"Sometype Mono", monospace',
                color: 'var(--soft)',
                background: 'rgba(238, 242, 255, 0.04)',
                border: '1px solid var(--line)',
                transition: 'all 0.2s ease',
              }} onMouseEnter={(e) => {
                e.currentTarget.style.background = `hsla(${cat.color}, 70%, 50%, 0.15)`;
                e.currentTarget.style.borderColor = `hsla(${cat.color}, 70%, 50%, 0.4)`;
                e.currentTarget.style.color = 'var(--ink)';
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(238, 242, 255, 0.04)';
                e.currentTarget.style.borderColor = 'var(--line)';
                e.currentTarget.style.color = 'var(--soft)';
              }}>
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const HomeCTA = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <motion.div
    className="home-cta"
    initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay: 1 }}
    style={{ marginTop: 'clamp(60px, 10vh, 100px)', textAlign: 'center' }}
  >
    <p style={{ color: 'var(--muted)', fontSize: 'clamp(14px, 1.5vw, 16px)', marginBottom: '20px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
      Every project tells a story. Dive into the build log, explore the stack, or start a conversation.
    </p>
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <button
        className="ui-cta"
        style={{
          background: 'linear-gradient(100deg, var(--amber), var(--ember))',
          color: '#06070b',
          padding: '16px 32px',
          fontSize: '15px'
        }}
        onClick={() => window.location.href = '/projects'}
      >
        View Projects →
      </button>
      <button
        className="ui-cta ui-ghost"
        style={{ padding: '16px 32px', fontSize: '15px' }}
        onClick={() => window.location.href = '/connect'}
      >
        Get in Touch →
      </button>
    </div>
  </motion.div>
);

const HomeStats = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <motion.div
    className="home-stats"
    initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    <div className="stats-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'clamp(20px, 4vw, 40px)',
      textAlign: 'center'
    }}>
      {[
        { value: '15+', label: 'Projects Shipped' },
        { value: '2+', label: 'Years Experience' },
        { value: '4', label: 'Core Domains' },
        { value: '∞', label: 'Curiosity' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          className="stat-item"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 * i }}
        >
          <div className="stat-number" style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 700, color: 'var(--ink)', fontFamily: '"Space Grotesk", sans-serif', lineHeight: 1 }}>{stat.value}</div>
          <div className="stat-label" style={{ marginTop: '8px', color: 'var(--soft)', fontSize: 'clamp(13px, 1.4vw, 15px)', fontFamily: '"Sometype Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

const ExtendedContent = ({ reducedMotion }: { reducedMotion: boolean }) => (
  <div className="home-extended" style={{ position: 'relative', zIndex: 5, padding: 'clamp(60px, 10vh, 120px) clamp(24px, 6vw, 80px)', maxWidth: '1200px', margin: '0 auto' }}>
    <HomeStats reducedMotion={reducedMotion} />
    <FocusAreas reducedMotion={reducedMotion} />
    <TechCategories reducedMotion={reducedMotion} />
    <HomeCTA reducedMotion={reducedMotion} />
  </div>
);

export function Lock() {
  const login = useOs((s) => s.login);
  const phase = useOs((s) => s.phase);
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: containerRef });
  const titleY = useTransform(scrollY, [0, 560], [0, -95]);
  const figureY = useTransform(scrollY, [0, 560], [0, 70]);
  const fade = useTransform(scrollY, [0, 520], [1, 0.3]); // Don't fade completely

  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 14 });

  const typed = useTypewriter(PROFILE.roles);

  useEffect(() => {
    if (phase !== 'lock') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        login();
        navigate('/projects');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, login, navigate]);

  const handleLogin = () => {
    login();
    navigate('/projects');
  };

  const letterTransition = reducedMotion ? { duration: 0.01 } as Transition : { delay: 0, duration: 0.65 };

  return (
    <section
      ref={containerRef}
      className="lock hero-v2"
      id="home"
      style={{ minHeight: '200vh', overflow: 'auto', position: 'relative' }}
      onPointerMove={reducedMotion ? undefined : (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        ry.set(((e.clientX - cx) / cx) * 10);
        rx.set((-(e.clientY - cy) / cy) * 7);
      }}
    >
      {/* Hero content - visible immediately, doesn't fade out completely */}
      <div className="hero-content" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '100px',
        position: 'relative',
        zIndex: 10
      }}>
        <motion.div className="title-3d-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <motion.h1 className="reference-title hero-name" style={{ y: titleY, opacity: fade, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}>
            <span className="title-kicker">Hi, I&apos;m</span>
            <span className="title-name">
              {DISPLAY.split(' ').map((word, wi, words) => {
                // Letters before this word (plus the spaces removed by split) set the stagger offset.
                const offset = words.slice(0, wi).reduce((n, w) => n + w.length, 0);
                return (
                  <span className="title-word" key={wi}>
                    {word.split('').map((ch, ci) => {
                      const delay = reducedMotion ? 0 : 0.25 + (offset + ci) * 0.028;
                      return (
                        <motion.span
                          className="title-letter"
                          key={ci}
                          initial={{ opacity: 0, y: 44, rotateX: -70 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{ ...letterTransition, delay }}
                        >
                          {ch}
                        </motion.span>
                      );
                    })}
                  </span>
                );
              })}
            </span>
          </motion.h1>
        </motion.div>

        <motion.div className="hero-type mono" style={{ opacity: fade }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          I build <span className="hero-type-word">{typed}</span>
          <span className="hero-caret" />
        </motion.div>

        <motion.div
          className="hero-figure"
          style={{ y: figureY, rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.div className="hero-float" animate={reducedMotion ? {} : { y: [0, -14, 0] }} transition={{ duration: 6.5, repeat: Infinity }}>
            <div className="hero-aura" aria-hidden="true" />
            <button className="hero-img-btn" onClick={handleLogin} aria-label="Open portfolio">
              <Picture kind="portraits" name="Hero" width={840} height={840} sizes="(max-width: 560px) 80vw, 420px" priority alt="Gnana Rajeswara Reddy" className="hero-img" draggable={false} />
              <span className="hero-scan" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>

        <motion.div className="reference-login mono" style={{ opacity: fade }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          Click the portrait or press Enter to explore
        </motion.div>
      </div>

      {/* Scroll indicator - only on hero */}
      <motion.div
        className="scroll-indicator"
        animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--muted)',
          fontSize: '12px',
          fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          zIndex: 10
        }}
      >
        <span>Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animation: 'bounce 2s infinite' }}>
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>

      {/* Extended content sections for home page - always visible, no fade */}
      <ExtendedContent reducedMotion={reducedMotion} />
    </section>
  );
}