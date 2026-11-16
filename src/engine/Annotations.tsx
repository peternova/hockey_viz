import { PITCH, project, type Orientation } from '../pitch/coords';
import type { Annotation, ArrowAnnotation, Vec, ZoneAnnotation } from './types';

export function ArrowDefs() {
  return (
    <defs>
      {(['pass', 'run-us', 'run-them', 'dribble'] as const).map((k) => (
        <marker
          key={k}
          id={`arrow-${k}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className={`arrowhead arrowhead--${k}`} />
        </marker>
      ))}
    </defs>
  );
}

function visible(a: Annotation, t: number) {
  return t >= a.t0 && t <= a.t1;
}

function Arrow({ a }: { a: ArrowAnnotation }) {
  const marker = a.kind === 'run' ? `run-${a.team ?? 'us'}` : a.kind;
  // Shorten the line slightly so it stops at the token's edge.
  const dx = a.to.x - a.from.x;
  const dy = a.to.y - a.from.y;
  const len = Math.hypot(dx, dy) || 1;
  const trim = Math.min(1.6, len / 3);
  const to = { x: a.to.x - (dx / len) * trim, y: a.to.y - (dy / len) * trim };
  return (
    <line
      className={`arrow arrow--${a.kind} arrow--${a.team ?? 'us'}`}
      x1={a.from.x}
      y1={a.from.y}
      x2={to.x}
      y2={to.y}
      markerEnd={`url(#arrow-${marker})`}
    />
  );
}

function Zone({ z }: { z: ZoneAnnotation }) {
  return (
    <polygon
      className={`zone zone--${z.tone ?? 'space'}`}
      points={z.points.map((p) => `${p.x},${p.y}`).join(' ')}
    />
  );
}

/** Drawn inside the pitch transform group (pitch coordinates). */
export function AnnotationLayer({ annotations, t }: { annotations: Annotation[]; t: number }) {
  return (
    <g className="annotations">
      {annotations.filter((a) => visible(a, t)).map((a, i) =>
        a.kind === 'zone' ? <Zone key={i} z={a} /> : <Arrow key={i} a={a} />,
      )}
    </g>
  );
}

function centroid(points: Vec[]): Vec {
  const n = points.length || 1;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

/** Zone labels are drawn in screen coordinates so text never rotates. */
export function ZoneLabels({
  annotations,
  t,
  orientation,
}: {
  annotations: Annotation[];
  t: number;
  orientation: Orientation;
}) {
  return (
    <g className="zone-labels">
      {annotations
        .filter((a): a is ZoneAnnotation => a.kind === 'zone' && Boolean(a.label) && visible(a, t))
        .map((z, i) => {
          const c = project(z.labelAt ?? centroid(z.points), orientation);
          // Keep labels near the edges from running off the pitch.
          const w = orientation === 'landscape' ? PITCH.length : PITCH.width;
          const anchor = c.x > w * 0.8 ? 'end' : c.x < w * 0.2 ? 'start' : 'middle';
          return (
            <text key={i} x={c.x} y={c.y} textAnchor={anchor} dominantBaseline="central" className="zone-label">
              {z.label}
            </text>
          );
        })}
    </g>
  );
}
