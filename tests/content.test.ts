import { describe, expect, it } from 'vitest';
import { PLAYS } from '../src/content/plays';
import { SOURCE_IDS } from '../src/content/sources';
import { duration, resolveKeyframes } from '../src/engine/interpolate';
import { PITCH } from '../src/pitch/coords';
import type { Vec } from '../src/engine/types';

/** Players may stand just off the pitch (e.g. at a penalty corner). */
const PLAYER_SLACK = 1;
/** The ball may end up in the goal (1.2 m deep). */
const BALL_SLACK = 1.5;

function inside(p: Vec, slack: number) {
  return p.x >= -slack && p.x <= PITCH.length + slack && p.y >= -slack && p.y <= PITCH.width + slack;
}

describe('content: plays', () => {
  it('have unique ids', () => {
    const ids = PLAYS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const play of PLAYS) {
    describe(play.id, () => {
      const ids = new Set(play.players.map((p) => p.id));

      it('has unique player ids', () => {
        expect(ids.size).toBe(play.players.length);
      });

      it('keyframes resolve (complete first frame, increasing times)', () => {
        expect(() => resolveKeyframes(play.players, play.keyframes)).not.toThrow();
      });

      it('keyframes only reference real players, and the ball carrier exists', () => {
        for (const kf of play.keyframes) {
          for (const id of Object.keys(kf.pos)) expect(ids, `unknown player "${id}" at t=${kf.t}`).toContain(id);
          if (kf.ball && 'with' in kf.ball) expect(ids, `unknown carrier at t=${kf.t}`).toContain(kf.ball.with);
        }
      });

      it('everyone stays on (or right next to) the pitch', () => {
        for (const kf of play.keyframes) {
          for (const [id, p] of Object.entries(kf.pos)) {
            expect(inside(p, PLAYER_SLACK), `${id} off the pitch at t=${kf.t}: ${JSON.stringify(p)}`).toBe(true);
          }
          if (kf.ball && 'at' in kf.ball) {
            expect(inside(kf.ball.at, BALL_SLACK), `ball off the pitch at t=${kf.t}`).toBe(true);
          }
        }
      });

      it('steps are in order, contiguous, and cover the whole play', () => {
        expect(play.steps.length).toBeGreaterThan(0);
        expect(play.steps[0].t0).toBe(0);
        for (let i = 0; i < play.steps.length; i++) {
          const s = play.steps[i];
          expect(s.t1, `step ${i + 1} ends before it starts`).toBeGreaterThan(s.t0);
          expect(s.title.length, `step ${i + 1} has no title`).toBeGreaterThan(0);
          expect(s.caption.length, `step ${i + 1} has no caption`).toBeGreaterThan(0);
          if (i > 0) expect(s.t0, `gap/overlap before step ${i + 1}`).toBe(play.steps[i - 1].t1);
        }
        expect(play.steps[play.steps.length - 1].t1).toBe(duration(play));
      });

      it('annotations are timed within the play', () => {
        for (const a of play.annotations ?? []) {
          expect(a.t1).toBeGreaterThan(a.t0);
          expect(a.t0).toBeGreaterThanOrEqual(0);
          expect(a.t1).toBeLessThanOrEqual(duration(play));
        }
      });

      it('cites at least one known source', () => {
        expect(play.sources.length).toBeGreaterThan(0);
        for (const s of play.sources) expect(SOURCE_IDS, `unknown source "${s}"`).toContain(s);
      });

      it('default follow is a real player', () => {
        if (play.defaultFollow) expect(ids).toContain(play.defaultFollow);
      });
    });
  }
});
