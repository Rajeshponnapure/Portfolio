import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrandIcon } from './Icons';

const BG: Record<string, string> = {
  gmail: 'radial-gradient(circle at 50% 50%, #ea4335, #b3261e 45%, #2a0a08 82%)',
  github: 'radial-gradient(circle at 50% 50%, #30363d, #0d1117 72%)',
  linkedin: 'radial-gradient(circle at 50% 50%, #0a66c2, #053a73 58%, #021b35 86%)',
  instagram: 'radial-gradient(circle at 32% 28%, #fbcf61, #ee2a7b 46%, #6228d7 82%)',
  x: 'radial-gradient(circle at 50% 50%, #1d9bf0, #08080a 72%)',
};

export interface PortalChannel {
  icon: string;
  label: string;
  domain: string;
}

/** Full-screen "dive in" transition played before opening a social link. */
export function Portal({ channel, onDone }: { channel: PortalChannel; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 760);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="portal"
      style={{ background: BG[channel.icon] ?? 'radial-gradient(circle at 50% 50%, #8b5cf6, #05060a 72%)' }}
      initial={{ clipPath: 'circle(0% at 50% 55%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.62, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="portal-rings" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <motion.div
        className="portal-core"
        initial={{ scale: 0.3, opacity: 0, filter: 'blur(10px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ delay: 0.18, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <span className="portal-logo"><BrandIcon name={channel.icon} /></span>
        <b>Entering {channel.label}…</b>
        <small className="mono">{channel.domain}</small>
      </motion.div>
    </motion.div>
  );
}
