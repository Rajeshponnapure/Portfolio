import { useState } from 'react';
import { motion } from 'framer-motion';
import { ARSENAL, SKILL_GROUPS, PROFILE } from '../data/content';
import { techIcon, monogram } from '../lib/techIcons';
import { RevealText } from '../components/RevealText';

const ALL: string[] = [
  ...new Set([
    ...ARSENAL.flatMap((g) => [...g.items]),
    ...SKILL_GROUPS.flatMap((g) => [...g.items]),
  ]),
];

const third = Math.ceil(ALL.length / 3);
const ROWS = [ALL.slice(0, third), ALL.slice(third, third * 2), ALL.slice(third * 2)];

function LogoTile({ label }: { label: string }) {
  const src = techIcon(label);
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div className="rb-tile">
      <span className="rb-badge">
        {showImg ? (
          <img src={src} alt={label} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        ) : (
          <em>{monogram(label)}</em>
        )}
      </span>
      <small>{label}</small>
    </div>
  );
}

export function Arsenal() {
  return (
    <section className="section arsenal-rainbow" id="arsenal">
      <div className="section-head">
        <span className="eyebrow">Technology Universe</span>
        <h2><RevealText text="The tools I build with." /></h2>
        <p>Every model, agent, language and creative tool in the cockpit — hover a row to pause it.</p>
      </div>

      <div className="rb-stage">
        {ROWS.map((row, ri) => (
          <div className={`rb-row ${ri % 2 ? 'rev' : ''}`} key={ri}>
            <div className="rb-track">
              {[...row, ...row].map((label, i) => (
                <LogoTile key={`${label}-${ri}-${i}`} label={label} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="facet-strip">
        {PROFILE.facets.map((f) => (
          <motion.div
            className="facet"
            key={f.k}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <b>{f.k}</b>
            <span>{f.v}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
