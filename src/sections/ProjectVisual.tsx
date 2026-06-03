import type { CategoryMeta } from '../data/content';

/** Per-category animated motif rendered inside each project card. */
export function ProjectVisual({ visual }: { visual: CategoryMeta['visual'] }) {
  switch (visual) {
    case 'agents':
      return (
        <div className="viz viz-agents">
          <div className="orbit a"><span className="node" /></div>
          <div className="orbit b"><span className="node" /></div>
          <div className="viz-core">⌬</div>
        </div>
      );
    case 'automation':
      return (
        <div className="viz viz-automation">
          <div className="gear" />
          <div className="lane l1" />
          <div className="lane l2" />
          <div className="lane l3" />
        </div>
      );
    case 'iot':
      return (
        <div className="viz viz-iot">
          <div className="ring r1" />
          <div className="ring r2" />
          <div className="ring r3" />
          <span className="sensor s1" />
          <span className="sensor s2" />
          <span className="sensor s3" />
          <div className="viz-core">◉</div>
        </div>
      );
    case 'realtime':
      return (
        <div className="viz viz-realtime">
          {Array.from({ length: 9 }).map((_, i) => (
            <i key={i} />
          ))}
        </div>
      );
    case 'fullstack':
      return (
        <div className="viz viz-fullstack">
          <div className="layer f1" />
          <div className="layer f2" />
          <div className="layer f3" />
        </div>
      );
    default:
      return null;
  }
}
