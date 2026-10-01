import { useMemo, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { CATEGORIES, CATEGORY_ORDER } from '../data/content';
import { RevealText } from '../components/RevealText';
import { Picture } from '../components/OptimizedImage';

// Tilt + spring physics only make sense with a real hover-capable pointer.
const CAN_HOVER = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function ProjectCard({ p, dup = false }: { p: Project; dup?: boolean }) {
  const meta = CATEGORIES[p.cat];
  const rx = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 160, damping: 16 });

  return (
    <motion.article
      className={`proj-card${dup ? ' dup' : ''}`}
      aria-hidden={dup || undefined}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, '--h': meta.hue } as React.CSSProperties}
      whileHover={CAN_HOVER ? { y: -10 } : undefined}
      onMouseMove={!CAN_HOVER ? undefined : (e) => {
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
        <Picture kind="projects" name={p.image} width={800} height={450} sizes="358px" alt={`${p.name} project visual`} />
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

/** One real copy plus one decorative copy (`dup`) that makes the CSS marquee loop seamlessly. */
function buildTrack(arr: Project[]): { p: Project; dup: boolean }[] {
  if (arr.length === 0) return [];
  const base = arr.length >= 5 ? arr : [...arr, ...arr, ...arr];
  return [...base.map((p) => ({ p, dup: false })), ...base.map((p) => ({ p, dup: true }))];
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
                {trackA.map(({ p, dup }, i) => (
                  <ProjectCard key={`${p.id}-a-${i}`} p={p} dup={dup} />
                ))}
              </div>
            </div>
            {rowB.length > 0 && (
              <div className="proj-row rev">
                <div className="proj-track">
                  {trackB.map(({ p, dup }, i) => (
                    <ProjectCard key={`${p.id}-b-${i}`} p={p} dup={dup} />
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
