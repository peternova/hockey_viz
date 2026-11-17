import type { Vec } from './types';

export function dist(a: Vec, b: Vec): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Even-odd ray casting: is p inside the polygon? */
export function pointInPolygon(p: Vec, poly: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > p.y !== b.y > p.y && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function distToSegment(p: Vec, a: Vec, b: Vec): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  const u = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return dist(p, { x: a.x + u * dx, y: a.y + u * dy });
}

/** Distance from p to the polygon: 0 inside, otherwise to the nearest edge. */
export function distToPolygon(p: Vec, poly: Vec[]): number {
  if (pointInPolygon(p, poly)) return 0;
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) best = Math.min(best, distToSegment(p, poly[i], poly[(i + 1) % poly.length]));
  return best;
}

/**
 * A strip along the line from `from` towards `to`, between distances s0 and
 * s1 from `from`, `halfWidth` either side. Used for "on the line between the
 * ball and the goal" answers.
 */
export function strip(from: Vec, to: Vec, s0: number, s1: number, halfWidth: number): Vec[] {
  const len = dist(from, to) || 1;
  const d = { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
  const n = { x: -d.y, y: d.x };
  const at = (s: number, w: number): Vec => ({
    x: from.x + d.x * s + n.x * w,
    y: from.y + d.y * s + n.y * w,
  });
  return [at(s0, -halfWidth), at(s1, -halfWidth), at(s1, halfWidth), at(s0, halfWidth)];
}

/** The point s metres from `from` towards `to`. */
export function along(from: Vec, to: Vec, s: number): Vec {
  const len = dist(from, to) || 1;
  return { x: from.x + ((to.x - from.x) / len) * s, y: from.y + ((to.y - from.y) / len) * s };
}
