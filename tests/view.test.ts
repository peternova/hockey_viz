import { describe, expect, it } from 'vitest';
import { PLAYS } from '../src/content/plays';
import { duration, frameAt, resolveKeyframes } from '../src/engine/interpolate';
import { MIN_VIEW, playView } from '../src/engine/view';
import { FULL_VIEW, PITCH, isFullView, viewBox, viewRect } from '../src/pitch/coords';
import type { Play } from '../src/engine/types';

describe('viewRect / viewBox', () => {
  it('shows the whole pitch plus a 3 m margin by default', () => {
    expect(viewBox('landscape')).toBe('-3 -3 97.4 61');
    expect(viewBox('portrait')).toBe('-3 -3 61 97.4');
  });

  it('cuts a cropped edge flush but keeps the margin at a real back-line', () => {
    // Attacking 23 to their back-line: their end is at the top in portrait.
    const top = viewRect('portrait', { x0: 60, x1: PITCH.length });
    expect(top).toMatchObject({ x: -3, y: -3, w: 61 });
    expect(top.h).toBeCloseTo(34.4);
    // Our end only.
    expect(viewRect('portrait', { x0: 0, x1: 50 })).toEqual({ x: -3, y: PITCH.length - 50, w: 61, h: 53 });
    expect(viewRect('landscape', { x0: 30, x1: 70 })).toEqual({ x: 30, y: -3, w: 40, h: 61 });
  });

  it('recognises the full view', () => {
    expect(isFullView(FULL_VIEW)).toBe(true);
    expect(isFullView({ x0: 0, x1: 80 })).toBe(false);
  });
});

/** Every player and the ball, sampled through the whole play. */
function sampledXs(play: Play): number[] {
  const kfs = resolveKeyframes(play.players, play.keyframes);
  const end = duration(play);
  const xs: number[] = [];
  for (let t = 0; t <= end + 1e-9; t += 0.1) {
    const f = frameAt(play.players, kfs, t);
    xs.push(f.ball.x, ...Object.values(f.players).map((p) => p.x));
  }
  return xs;
}

describe('playView (zooming in on phones)', () => {
  it.each(PLAYS.map((p) => [p.id, p] as const))('%s keeps everything on screen with room to spare', (_id, play) => {
    const v = playView(play);
    expect(v.x0).toBeGreaterThanOrEqual(0);
    expect(v.x1).toBeLessThanOrEqual(PITCH.length);
    expect(v.x1 - v.x0).toBeGreaterThanOrEqual(MIN_VIEW - 1e-9);
    // Token radius is 1.8 m: keep at least 3 m between any centre and a cut edge.
    for (const x of sampledXs(play)) {
      if (v.x0 > 0) expect(x).toBeGreaterThanOrEqual(v.x0 + 3);
      if (v.x1 < PITCH.length) expect(x).toBeLessThanOrEqual(v.x1 - 3);
    }
  });

  it('zooms in on plays that stay in one half', () => {
    const pcAttack = PLAYS.find((p) => p.id === 'p2-pc-attack')!;
    const v = playView(pcAttack);
    expect(v.x1).toBe(PITCH.length);
    expect(v.x0).toBeGreaterThan(30);
  });
});
