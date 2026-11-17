import type { BallState, Frame, Keyframe, Play, PlayerDef, Step, Vec } from './types';

/** A keyframe with every player's position and the ball state filled in. */
export interface ResolvedKeyframe {
  t: number;
  pos: Record<string, Vec>;
  ball: BallState;
}

/** Ball sits just in front of the carrier's stick, towards the side they attack. */
export const BALL_OFFSET = 0.9;

export function lerp(a: number, b: number, u: number): number {
  return a + (b - a) * u;
}

export function lerpVec(a: Vec, b: Vec, u: number): Vec {
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) };
}

/** Smooth start and stop, so players accelerate and decelerate naturally. */
export function easeInOut(u: number): number {
  const c = Math.min(1, Math.max(0, u));
  return c * c * (3 - 2 * c);
}

/** Passes leave the stick fast and slow down. */
export function easeOut(u: number): number {
  const c = Math.min(1, Math.max(0, u));
  return 1 - (1 - c) * (1 - c);
}

/**
 * Fill in each keyframe so every player and the ball are specified. Throws if
 * keyframes are out of order or the first keyframe is incomplete.
 */
export function resolveKeyframes(players: PlayerDef[], keyframes: Keyframe[]): ResolvedKeyframe[] {
  if (keyframes.length === 0) throw new Error('A play needs at least one keyframe');
  const first = keyframes[0];
  for (const p of players) {
    if (!first.pos[p.id]) throw new Error(`First keyframe is missing player "${p.id}"`);
  }
  if (!first.ball) throw new Error('First keyframe must set the ball');

  const out: ResolvedKeyframe[] = [];
  let prev: ResolvedKeyframe | null = null;
  for (const kf of keyframes) {
    if (prev && kf.t <= prev.t) {
      throw new Error(`Keyframe times must increase (got ${kf.t} after ${prev.t})`);
    }
    const pos: Record<string, Vec> = prev ? { ...prev.pos } : {};
    for (const [id, v] of Object.entries(kf.pos)) pos[id] = v;
    const ball = kf.ball ?? prev!.ball;
    const resolved: ResolvedKeyframe = { t: kf.t, pos, ball };
    out.push(resolved);
    prev = resolved;
  }
  return out;
}

function carrierBallPos(players: PlayerDef[], carrierId: string, at: Vec): Vec {
  const def = players.find((p) => p.id === carrierId);
  // "Us" attack +x, "them" attack -x: the ball sits ahead of the carrier.
  const dir = def?.team === 'them' ? -1 : 1;
  return { x: at.x + BALL_OFFSET * dir, y: at.y + 0.35 * dir };
}

/** Where the ball is drawn for these positions and ball state. */
export function ballPoint(players: PlayerDef[], pos: Record<string, Vec>, ball: BallState): Vec {
  if ('at' in ball) return ball.at;
  return carrierBallPos(players, ball.with, pos[ball.with]);
}

function ballPosAt(players: PlayerDef[], kf: ResolvedKeyframe): Vec {
  return ballPoint(players, kf.pos, kf.ball);
}

/** Index of the last keyframe at or before time t. */
function segmentIndex(kfs: ResolvedKeyframe[], t: number): number {
  let i = 0;
  while (i < kfs.length - 1 && kfs[i + 1].t <= t) i++;
  return i;
}

export function duration(play: Pick<Play, 'keyframes' | 'steps'>): number {
  const lastKf = play.keyframes[play.keyframes.length - 1]?.t ?? 0;
  const lastStep = play.steps[play.steps.length - 1]?.t1 ?? 0;
  return Math.max(lastKf, lastStep);
}

/** Positions of all players and the ball at time t. */
export function frameAt(players: PlayerDef[], kfs: ResolvedKeyframe[], t: number): Frame {
  const i = segmentIndex(kfs, t);
  const a = kfs[i];
  const b = kfs[Math.min(i + 1, kfs.length - 1)];

  if (a === b || t <= a.t) {
    return {
      players: { ...a.pos },
      ball: ballPosAt(players, a),
      carrier: 'with' in a.ball ? a.ball.with : null,
    };
  }

  const raw = (t - a.t) / (b.t - a.t);
  const u = easeInOut(raw);
  const pos: Record<string, Vec> = {};
  for (const id of Object.keys(a.pos)) pos[id] = lerpVec(a.pos[id], b.pos[id], u);

  // Same player keeps the ball across the segment: ball follows them.
  if ('with' in a.ball && 'with' in b.ball && a.ball.with === b.ball.with) {
    const c = a.ball.with;
    return { players: pos, ball: carrierBallPos(players, c, pos[c]), carrier: c };
  }

  // Otherwise the ball travels (a pass, a shot, or a loose ball).
  const ball = lerpVec(ballPosAt(players, a), ballPosAt(players, b), easeOut(raw));
  return { players: pos, ball, carrier: null };
}

/** Sampled path of one player from 0 to tEnd (for trails). */
export function trail(
  players: PlayerDef[],
  kfs: ResolvedKeyframe[],
  id: string,
  tEnd: number,
  dt = 0.1,
): Vec[] {
  const pts: Vec[] = [];
  for (let t = 0; t < tEnd; t += dt) pts.push(frameAt(players, kfs, t).players[id]);
  pts.push(frameAt(players, kfs, tEnd).players[id]);
  return pts;
}

/** Index of the step containing time t (the last step if past the end). */
export function stepIndexAt(steps: Step[], t: number): number {
  for (let i = 0; i < steps.length; i++) {
    if (t < steps[i].t1) return i;
  }
  return steps.length - 1;
}
