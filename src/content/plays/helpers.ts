import type { PositionId, Vec } from '../../engine/types';
import { CENTRE_Y, PITCH } from '../../pitch/coords';
import { mirror } from '../formations';

/** Centre of the goal we attack, and of the goal we defend. */
export const THEIR_GOAL: Vec = { x: PITCH.length, y: CENTRE_Y };
export const OUR_GOAL: Vec = { x: 0, y: CENTRE_Y };

/** A point just inside their goal (for a ball that's been scored). */
export function inTheirGoal(dy = 0): Vec {
  return { x: PITCH.length + 0.6, y: CENTRE_Y + dy };
}

/** Our players placed from a formation shape (player id = position id). */
export function ours(shape: Record<PositionId, Vec>, roles: PositionId[], d: Vec = { x: 0, y: 0 }): Record<string, Vec> {
  return Object.fromEntries(roles.map((r) => [r, { x: shape[r].x + d.x, y: shape[r].y + d.y }]));
}

/**
 * Opposition players ("t-<role>") placed by mirroring one of our shapes, so
 * their left wing ends up on our right, attacking towards x = 0.
 */
export function theirs(shape: Record<PositionId, Vec>, roles: PositionId[], d: Vec = { x: 0, y: 0 }): Record<string, Vec> {
  return Object.fromEntries(
    roles.map((r) => {
      const m = mirror(shape[r]);
      return [`t-${r}`, { x: m.x + d.x, y: m.y + d.y }];
    }),
  );
}

export function rect(x0: number, y0: number, x1: number, y1: number): Vec[] {
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
}

/** Polygon approximating a circle (e.g. the 5 m around a free hit). */
export function ring(c: Vec, r: number, n = 20): Vec[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { x: c.x + r * Math.cos(a), y: c.y + r * Math.sin(a) };
  });
}

/**
 * The shooting circle as a polygon: quarter-circles of `radius` around each
 * post, joined by a straight line. `end` is the goal it surrounds.
 */
export function circleArea(end: 'ours' | 'theirs', radius: number = PITCH.circleRadius, n = 10): Vec[] {
  const top = CENTRE_Y - PITCH.halfGoal;
  const bottom = CENTRE_Y + PITCH.halfGoal;
  const pts: Vec[] = [];
  // From the back-line on our left, round the top post, across, round the bottom post.
  for (let i = 0; i <= n; i++) {
    const a = (Math.PI / 2) * (i / n);
    pts.push({ x: radius * Math.sin(a), y: top - radius * Math.cos(a) });
  }
  for (let i = 0; i <= n; i++) {
    const a = (Math.PI / 2) * (i / n);
    pts.push({ x: radius * Math.cos(a), y: bottom + radius * Math.sin(a) });
  }
  const clipped = pts.map((p) => ({ x: p.x, y: Math.max(0, Math.min(PITCH.width, p.y)) }));
  return end === 'ours' ? clipped : clipped.map((p) => ({ x: PITCH.length - p.x, y: p.y }));
}
