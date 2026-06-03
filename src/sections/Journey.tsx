import { motion } from 'framer-motion';
import { JOURNEY } from '../data/content';
import { RevealText } from '../components/RevealText';

export function Journey() {
  return (
    <section className="section" id="journey">
      <div className="section-head">
        <span className="eyebrow">App · Logbook</span>
        <h2><RevealText text="The journey." /></h2>
        <p>From a story writer's instinct to production-grade AI systems — logged in order.</p>
      </div>

      <div className="timeline">
        {JOURNEY.map((entry, i) => (
          <motion.div
            className="tl-item"
            key={entry.title}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="tl-tag mono">{entry.tag}</span>
            <h3>{entry.title}</h3>
            <p>{entry.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
