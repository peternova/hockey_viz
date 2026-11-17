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

/** The stretch of the pitch's length that is shown, in metres along x. */
export interface LengthView {
  x0: number;
  x1: number;
}

export const FULL_VIEW: LengthView = { x0: 0, x1: PITCH.length };

export function isFullView(v: LengthView): boolean {
  return v.x0 <= 0 && v.x1 >= PITCH.length;
}

/**
 * Visible rectangle in SVG screen coordinates. Real back-lines get a margin
 * (so the goals show); a cropped edge is cut flush.
 */
export function viewRect(o: Orientation, v: LengthView = FULL_VIEW): { x: number; y: number; w: number; h: number } {
  const before = v.x0 <= 0 ? MARGIN : 0;
  const after = v.x1 >= PITCH.length ? MARGIN : 0;
  const x0 = Math.max(0, v.x0) - before;
  const x1 = Math.min(PITCH.length, v.x1) + after;
  return o === 'landscape'
    ? { x: x0, y: -MARGIN, w: x1 - x0, h: PITCH.width + 2 * MARGIN }
    : { x: -MARGIN, y: PITCH.length - x1, w: PITCH.width + 2 * MARGIN, h: x1 - x0 };
}

export function viewBox(o: Orientation, v: LengthView = FULL_VIEW): string {
  const r = viewRect(o, v);
  return `${r.x} ${r.y} ${r.w} ${r.h}`;
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
