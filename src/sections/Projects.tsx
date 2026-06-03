import { useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { CATEGORIES, CATEGORY_ORDER } from '../data/content';
import { RevealText } from '../components/RevealText';

function ProjectCard({ p }: { p: Project }) {
  const meta = CATEGORIES[p.cat];
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });

  return (
    <motion.article
      className="proj-card"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, '--h': meta.hue } as React.CSSProperties}
      whileHover={{ y: -10 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ry.set(px * 11);
        rx.set(-py * 11);
        e.currentTarget.style.setProperty('--card-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <div className="proj-visual" data-cat={p.cat}>
        <img src={p.image} alt={`${p.name} project visual`} loading="lazy" decoding="async" />
      </div>
      <span className="proj-id mono">{p.id}</span>
      <span className="proj-cat mono">{meta.label}</span>
      <h3>{p.name}</h3>
      <p className="proj-obj">{p.obj}</p>
      <p className="proj-desc">{p.desc}</p>
      <div className="proj-tags">
        {p.stack.slice(0, 4).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </motion.article>
  );
}

function buildTrack(arr: Project[]): Project[] {
  if (arr.length === 0) return [];
  const filled: Project[] = [];
  while (filled.length < 8) filled.push(...arr);
  return [...filled, ...filled];
}

export function Projects() {
  const [filter, setFilter] = useState<string>('all');
  const list = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)),
    [filter],
  );
  const accentHue = filter === 'all' ? 210 : CATEGORIES[filter].hue;

  const rowA = list.filter((_, i) => i % 2 === 0);
  const rowB = list.filter((_, i) => i % 2 === 1);
  const trackA = buildTrack(rowA);
  const trackB = buildTrack(rowB);

  return (
    <section className="section" id="projects">
      <div className="section-head">
        <span className="eyebrow">Mission Manifest</span>
        <h2><RevealText text="Projects in motion." /></h2>
        <p>Selected systems from the build log, each with its own generated project visual.</p>
      </div>

      <div className="projects-board" style={{ '--accent-hue': accentHue } as React.CSSProperties}>
        <div className="cat-bar">
          <button className={`cat-chip ${filter === 'all' ? 'on' : ''}`} onClick={() => setFilter('all')}>
            All systems
          </button>
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              className={`cat-chip ${filter === c ? 'on' : ''}`}
              style={{ '--accent-hue': CATEGORIES[c].hue } as React.CSSProperties}
              onClick={() => setFilter(c)}
            >
              {CATEGORIES[c].label}
            </button>
          ))}
        </div>

        <motion.div
          className="proj-reveal"
          initial={{ rotateX: 36, opacity: 0 }}
          whileInView={{ rotateX: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformPerspective: 1300 }}
        >
          <div className="proj-ticker-wrap" key={filter}>
            <div className="proj-row">
              <div className="proj-track">
                {trackA.map((p, i) => (
                  <ProjectCard key={`${p.id}-a-${i}`} p={p} />
                ))}
              </div>
            </div>
            {rowB.length > 0 && (
              <div className="proj-row rev">
                <div className="proj-track">
                  {trackB.map((p, i) => (
                    <ProjectCard key={`${p.id}-b-${i}`} p={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
