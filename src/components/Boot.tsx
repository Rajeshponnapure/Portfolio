import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOs } from '../store';
import { startAudio } from '../lib/audio';

const LOG = [
  'powering on…',
  'mounting /creative',
  'loading neural modules…',
  'calibrating x-ray sensor…',
  'spinning up agents…',
  'session ready.',
];
const EASE = [0.23, 1, 0.32, 1] as const;

type Stage = 'off' | 'opening' | 'booting' | 'zoom';

/**
 * Interactive boot: the laptop sits closed until the user clicks the power button.
 * Click → lid swings open → boot loader → the screen zooms to the front and reveals the OS.
 */
export function Boot() {
  const setPhase = useOs((s) => s.setPhase);
  const setBootProgress = useOs((s) => s.setBootProgress);
  const skipBoot = useOs((s) => s.skipBoot);
  const [stage, setStage] = useState<Stage>('off');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'booting') return;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(1, p + 0.018 + Math.random() * 0.022);
        setBootProgress(next);
        if (next >= 1) {
          window.clearInterval(id);
          window.setTimeout(() => setStage('zoom'), 520);
        }
        return next;
      });
    }, 60);
    return () => window.clearInterval(id);
  }, [stage, setBootProgress]);

  const powerOn = () => {
    startAudio();
    setStage('opening');
  };
  const logIndex = Math.min(LOG.length - 1, Math.floor(progress * LOG.length));
  const lidOpen = stage !== 'off';

  return (
    <motion.div className="boot" exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: EASE }}>
      <motion.div
        className="laptop"
        animate={stage === 'zoom' ? { scale: 4.3, y: '8%', opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.95, ease: EASE }}
        onAnimationComplete={() => {
          if (stage === 'zoom') setPhase('lock');
        }}
      >
        <motion.div
          className="laptop-screen"
          initial={{ rotateX: -88 }}
          animate={{ rotateX: lidOpen ? 0 : -88 }}
          transition={{ duration: 1.1, ease: EASE }}
          onAnimationComplete={() => {
            if (stage === 'opening') setStage('booting');
          }}
        >
          <div className="boot-screen-inner">
            {stage !== 'off' && (
              <>
                <div className="boot-logo">
                  RAJESH<b>·</b>OS
                </div>
                <div className="boot-bar">
                  <i style={{ width: `${progress * 100}%` }} />
                </div>
                <div className="boot-log mono">{LOG[logIndex]}</div>
              </>
            )}
          </div>
        </motion.div>
        <div className="laptop-base" />
      </motion.div>

      {stage === 'off' && (
        <motion.button
          className="power-btn"
          onClick={powerOn}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
          whileTap={{ scale: 0.93 }}
        >
          <span className="power-glyph">⏻</span>
          <span className="power-label mono">click to power on</span>
        </motion.button>
      )}

      <button className="boot-skip" onClick={skipBoot}>
        skip intro →
      </button>
    </motion.div>
  );
}
