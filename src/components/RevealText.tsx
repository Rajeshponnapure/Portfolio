import { motion } from 'framer-motion';

/** Splits text into words that slide up from a clipped baseline as they scroll into view. */
export function RevealText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span className="reveal-word" key={`${word}-${i}`} aria-hidden="true">
          <motion.span
            className="reveal-inner"
            initial={{ y: '115%', opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ delay: i * 0.06, duration: 0.62, ease: [0.23, 1, 0.32, 1] }}
          >
            {word}
          </motion.span>
          {' '}
        </span>
      ))}
    </span>
  );
}
