import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavIcon } from './Icons';
import { PROFILE } from '../data/content';
import { useReducedMotion } from '../hooks/useReducedMotion';

const NAV = [
  { id: 'home', icon: 'home', label: 'Home', path: '/' },
  { id: 'about', icon: 'about', label: 'About', path: '/about' },
  { id: 'projects', icon: 'work', label: 'Projects', path: '/projects' },
  { id: 'arsenal', icon: 'stack', label: 'Arsenal', path: '/arsenal' },
  { id: 'journey', icon: 'journey', label: 'Journey', path: '/journey' },
  { id: 'connect', icon: 'connect', label: 'Connect', path: '/connect' },
];

export function Header() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  return (
    <motion.header
      className="global-header"
      initial={reducedMotion ? {} : { opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      role="banner"
    >
      <nav className="header-nav" aria-label="Main navigation">
        <button className="header-brand" onClick={() => window.location.href = '/'} aria-label="Home">
          <span className="header-brand-mark">R</span>
          <b>{PROFILE.short} Reddy</b>
        </button>
        <ul className="header-links">
          {NAV.map((item) => (
            <li key={item.id}>
              <button
                className={`header-link ${location.pathname === item.path || (item.path === '/' && location.pathname === '/') ? 'active' : ''}`}
                onClick={() => window.location.href = item.path}
                aria-current={location.pathname === item.path || (item.path === '/' && location.pathname === '/') ? 'page' : undefined}
              >
                <NavIcon name={item.icon} className="header-ico" aria-hidden="true" />
                <span className="header-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}