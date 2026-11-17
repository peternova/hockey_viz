import type { PitchFeature } from '../../content/pitch';

/** One pitch marking or area, drawn in pitch coordinates (inside the Pitch underlay). */
export function FeatureShape({ f, on, onSelect }: { f: PitchFeature; on: boolean; onSelect?: () => void }) {
  const cls = `pf pf--${f.draw}${on ? ' pf--on' : ''}`;
  return (
    <g className={cls} onClick={onSelect} aria-hidden="true">
      {f.paths.map((d, i) => (
        <g key={i}>
          {/* What you see */}
          <path className="pf__shape" d={d} fillRule={f.evenOdd ? 'evenodd' : undefined} />
          {/* A larger, invisible target so thin lines and small marks are easy to tap */}
          {f.draw !== 'fill' ? <path className="pf__hit" d={d} /> : null}
        </g>
      ))}
    </g>
  );
}
