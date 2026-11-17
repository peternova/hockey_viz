import { stepIndexAt } from './interpolate';
import type { Step } from './types';

export interface PlaybackState {
  t: number;
  playing: boolean;
  /** Set when playback stopped at the end of a step ("freeze and think"). */
  pausedAtStep: number | null;
}

export interface AdvanceOptions {
  duration: number;
  speed: number;
  steps: Step[];
  /** Stop at the end of every step so the learner can take it in. */
  pauseAfterEachStep: boolean;
}

/**
 * Pure playback update: move time forward by dt (real seconds) and decide
 * whether to stop. Kept separate from React so it can be unit-tested.
 */
export function advance(state: PlaybackState, dt: number, opts: AdvanceOptions): PlaybackState {
  if (!state.playing) return state;
  const next = Math.min(opts.duration, state.t + dt * opts.speed);

  // Did we cross the end of a step that should pause?
  for (let i = 0; i < opts.steps.length; i++) {
    const s = opts.steps[i];
    const isLast = i === opts.steps.length - 1;
    const shouldPause = (opts.pauseAfterEachStep && !s.noPause) || Boolean(s.think);
    if (!isLast && shouldPause && state.t < s.t1 && next >= s.t1) {
      return { t: s.t1, playing: false, pausedAtStep: i };
    }
  }

  if (next >= opts.duration) {
    return { t: opts.duration, playing: false, pausedAtStep: opts.steps.length - 1 };
  }
  return { t: next, playing: true, pausedAtStep: null };
}

/**
 * Time to jump to for the step buttons.
 *  +1 ("skip"): the end of the step being played (shows its final picture).
 *  -1 ("back"): the start of the current step, or of the previous step if
 *               we're already at (or just past) the start of the current one.
 */
export function stepJumpTarget(steps: Step[], t: number, direction: 1 | -1): number {
  if (steps.length === 0) return 0;
  if (direction === 1) {
    return steps[stepIndexAt(steps, t)].t1;
  }
  // Going back: to the start of the current step, or the previous one if
  // we're already (almost) at the start of the current one.
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i].t0 < t - 0.25) return steps[i].t0;
  }
  return 0;
}
