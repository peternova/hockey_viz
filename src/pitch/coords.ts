import type { Vec } from '../engine/types';

/** FIH Rules of Hockey 2027, Rule 1 and Field Specifications 1.3–1.4. */
export const PITCH = {
  length: 91.4,
  width: 55,
  line23: 22.9,
  circleRadius: 14.63,
  /** Half of the 3.66 m goal width: distance from centre to each post. */
  halfGoal: 1.83,
  /** Dotted line is 5 m outside the circle. */
  dottedRadius: 19.63,
  penaltySpot: 6.475,
  goalDepth: 1.2,
  /** Injection marks on the back-line, measured from the nearer post. */
  backlineMarks: [5, 10],
  /** Side-line marks, measured from the back-line. */
  sidelineMark: 14.63,
} as const;

export const CENTRE_Y = PITCH.width / 2;

/**
 * landscape: our attack goes left → right (laptop).
 * portrait:  our attack goes bottom → top (phone).
 */
export type Orientation = 'landscape' | 'portrait';

const MARGIN = 3;

export function viewBox(o: Orientation): string {
  return o === 'landscape'
    ? `${-MARGIN} ${-MARGIN} ${PITCH.length + 2 * MARGIN} ${PITCH.width + 2 * MARGIN}`
    : `${-MARGIN} ${-MARGIN} ${PITCH.width + 2 * MARGIN} ${PITCH.length + 2 * MARGIN}`;
}

/** Pitch coordinates → SVG screen coordinates. */
export function project(p: Vec, o: Orientation): Vec {
  return o === 'landscape' ? { x: p.x, y: p.y } : { x: p.y, y: PITCH.length - p.x };
}

/** SVG screen coordinates → pitch coordinates (for dragging). */
export function unproject(s: Vec, o: Orientation): Vec {
  return o === 'landscape' ? { x: s.x, y: s.y } : { x: PITCH.length - s.y, y: s.x };
}

/** SVG transform that maps pitch coordinates into screen coordinates. */
export function groupTransform(o: Orientation): string | undefined {
  return o === 'landscape' ? undefined : `matrix(0,-1,1,0,0,${PITCH.length})`;
}

export function clampToPitch(p: Vec, slack = 2): Vec {
  return {
    x: Math.max(-slack, Math.min(PITCH.length + slack, p.x)),
    y: Math.max(-slack, Math.min(PITCH.width + slack, p.y)),
  };
}
