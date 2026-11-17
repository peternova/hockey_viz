import { describe, expect, it } from 'vitest';
import {
  BALL_OFFSET,
  easeInOut,
  frameAt,
  resolveKeyframes,
  stepIndexAt,
  trail,
} from '../src/engine/interpolate';
import { advance, stepJumpTarget } from '../src/engine/playback';
import type { Keyframe, PlayerDef, Step } from '../src/engine/types';

const players: PlayerDef[] = [
  { id: 'a', team: 'us', label: 'A' },
  { id: 'b', team: 'us', label: 'B' },
  { id: 'x', team: 'them', label: 'X' },
];

const keyframes: Keyframe[] = [
  { t: 0, pos: { a: { x: 0, y: 0 }, b: { x: 10, y: 0 }, x: { x: 20, y: 20 } }, ball: { with: 'a' } },
  { t: 2, pos: { a: { x: 10, y: 10 } } },
  { t: 4, pos: { b: { x: 20, y: 0 } }, ball: { with: 'b' } },
  { t: 6, pos: {}, ball: { at: { x: 50, y: 50 } } },
];

describe('resolveKeyframes', () => {
  it('carries positions and ball forward', () => {
    const r = resolveKeyframes(players, keyframes);
    expect(r[1].pos.b).toEqual({ x: 10, y: 0 });
    expect(r[1].ball).toEqual({ with: 'a' });
    expect(r[3].pos.a).toEqual({ x: 10, y: 10 });
  });

  it('rejects an incomplete first keyframe', () => {
    expect(() => resolveKeyframes(players, [{ t: 0, pos: { a: { x: 0, y: 0 } }, ball: { with: 'a' } }])).toThrow(
      /missing player "b"/,
    );
  });

  it('rejects out-of-order times', () => {
    expect(() => resolveKeyframes(players, [keyframes[0], { t: 0, pos: {} }])).toThrow(/must increase/);
  });
});

describe('frameAt', () => {
  const r = resolveKeyframes(players, keyframes);

  it('returns exact keyframe positions at keyframe times', () => {
    expect(frameAt(players, r, 2).players.a).toEqual({ x: 10, y: 10 });
    expect(frameAt(players, r, 0).players.b).toEqual({ x: 10, y: 0 });
  });

  it('eases between keyframes (halfway in time = halfway in space)', () => {
    const f = frameAt(players, r, 1);
    expect(f.players.a.x).toBeCloseTo(5);
    expect(f.players.a.y).toBeCloseTo(5);
  });

  it('keeps the ball with its carrier', () => {
    const f = frameAt(players, r, 1);
    expect(f.carrier).toBe('a');
    expect(f.ball.x).toBeCloseTo(f.players.a.x + BALL_OFFSET);
  });

  it('moves the ball between players during a pass', () => {
    const f = frameAt(players, r, 3);
    expect(f.carrier).toBeNull();
    // Starts near a (10,10)+offset, ends near b (20,0)+offset.
    expect(f.ball.x).toBeGreaterThan(10);
    expect(f.ball.x).toBeLessThan(21);
  });

  it('puts the ball ahead of "them" carriers in their attacking direction', () => {
    const r2 = resolveKeyframes(players, [
      { t: 0, pos: { a: { x: 0, y: 0 }, b: { x: 0, y: 0 }, x: { x: 30, y: 30 } }, ball: { with: 'x' } },
    ]);
    expect(frameAt(players, r2, 0).ball.x).toBeCloseTo(30 - BALL_OFFSET);
  });

  it('clamps before the start and after the end', () => {
    expect(frameAt(players, r, -1).players.a).toEqual({ x: 0, y: 0 });
    expect(frameAt(players, r, 99).ball).toEqual({ x: 50, y: 50 });
  });

  it('produces a trail ending at the current position', () => {
    const pts = trail(players, r, 'a', 2);
    expect(pts[0]).toEqual({ x: 0, y: 0 });
    expect(pts[pts.length - 1]).toEqual({ x: 10, y: 10 });
  });
});

describe('easeInOut', () => {
  it('starts at 0, ends at 1, and is symmetric', () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5);
    expect(easeInOut(2)).toBe(1);
  });
});

const steps: Step[] = [
  { t0: 0, t1: 2, title: 'one', caption: '' },
  { t0: 2, t1: 4, title: 'two', caption: '', think: 'why?' },
  { t0: 4, t1: 6, title: 'three', caption: '' },
];

describe('stepIndexAt', () => {
  it('maps times to steps (boundaries belong to the next step)', () => {
    expect(stepIndexAt(steps, 0)).toBe(0);
    expect(stepIndexAt(steps, 1.99)).toBe(0);
    expect(stepIndexAt(steps, 2)).toBe(1);
    expect(stepIndexAt(steps, 6)).toBe(2);
    expect(stepIndexAt(steps, 100)).toBe(2);
  });
});

describe('advance', () => {
  const base = { duration: 6, speed: 1, steps, pauseAfterEachStep: false };

  it('does nothing when paused', () => {
    const s = { t: 1, playing: false, pausedAtStep: null };
    expect(advance(s, 0.5, base)).toBe(s);
  });

  it('applies speed', () => {
    const s = advance({ t: 0, playing: true, pausedAtStep: null }, 0.5, { ...base, speed: 0.5 });
    expect(s.t).toBeCloseTo(0.25);
    expect(s.playing).toBe(true);
  });

  it('pauses at the end of every step when asked', () => {
    const s = advance({ t: 1.9, playing: true, pausedAtStep: null }, 0.5, { ...base, pauseAfterEachStep: true });
    expect(s).toEqual({ t: 2, playing: false, pausedAtStep: 0 });
  });

  it('carries on through a step marked noPause', () => {
    const noPause = [{ ...steps[0], noPause: true }, ...steps.slice(1)];
    const s = advance({ t: 1.9, playing: true, pausedAtStep: null }, 0.5, { ...base, steps: noPause, pauseAfterEachStep: true });
    expect(s.playing).toBe(true);
    expect(s.t).toBeCloseTo(2.4);
  });

  it('always pauses after a "think" step', () => {
    const s = advance({ t: 3.9, playing: true, pausedAtStep: null }, 0.5, base);
    expect(s).toEqual({ t: 4, playing: false, pausedAtStep: 1 });
  });

  it('continues from a step boundary without re-pausing', () => {
    const s = advance({ t: 2, playing: true, pausedAtStep: null }, 0.1, { ...base, pauseAfterEachStep: true });
    expect(s.playing).toBe(true);
    expect(s.t).toBeCloseTo(2.1);
  });

  it('stops at the end', () => {
    const s = advance({ t: 5.9, playing: true, pausedAtStep: null }, 1, base);
    expect(s).toEqual({ t: 6, playing: false, pausedAtStep: 2 });
  });
});

describe('stepJumpTarget', () => {
  it('skips to the end of the current step', () => {
    expect(stepJumpTarget(steps, 0.5, 1)).toBe(2);
    expect(stepJumpTarget(steps, 2, 1)).toBe(4);
    expect(stepJumpTarget(steps, 6, 1)).toBe(6);
  });

  it('goes back to the start of this step, or the previous one', () => {
    expect(stepJumpTarget(steps, 3, -1)).toBe(2);
    expect(stepJumpTarget(steps, 2.1, -1)).toBe(0);
    expect(stepJumpTarget(steps, 4, -1)).toBe(2);
    expect(stepJumpTarget(steps, 0.1, -1)).toBe(0);
  });
});
