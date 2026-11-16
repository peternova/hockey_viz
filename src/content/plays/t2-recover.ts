import type { Play } from '../../engine/types';
import { ALL_POSITIONS, F433_ATTACK, ourTeam, theirPlayer } from '../formations';

/**
 * T2: we lose the ball in their half. The nearest players counter-press for a
 * few seconds while everyone else sprints back goal-side and tucks in.
 */
export const t2Recover: Play = {
  id: 't2-recover',
  title: 'Recovering shape after losing the ball',
  summary:
    'Lost it? The nearest players hunt the ball straight away to slow them down. Everyone else sprints back towards our goal, not towards the ball, and the team rebuilds its compact shape.',
  category: 'transition',
  featuredRoles: [...ALL_POSITIONS],
  defaultFollow: 'LW',
  players: [...ourTeam(), theirPlayer('LM'), theirPlayer('CF'), theirPlayer('LW'), theirPlayer('RW'), theirPlayer('CM')],
  keyframes: [
    {
      t: 0,
      pos: {
        ...F433_ATTACK,
        't-LM': { x: 61, y: 35 },
        't-CF': { x: 66, y: 27 },
        't-LW': { x: 58, y: 46 },
        't-RW': { x: 60, y: 9 },
        't-CM': { x: 64, y: 22 },
      },
      ball: { with: 'CM' },
    },
    {
      t: 1.3,
      pos: { 't-LM': { x: 59, y: 36 }, CM: { x: 55, y: 28.5 } },
      ball: { with: 't-LM' },
    },
    {
      t: 3.5,
      pos: {
        RM: { x: 58, y: 38 },
        CM: { x: 56, y: 33 },
        't-LM': { x: 56, y: 37 },
        CF: { x: 72, y: 29 },
        't-CF': { x: 58, y: 29 },
        't-LW': { x: 50, y: 47 },
        't-RW': { x: 52, y: 9 },
        LB: { x: 42, y: 10 },
        RB: { x: 42, y: 45 },
        LCB: { x: 32, y: 21 },
        RCB: { x: 32, y: 34 },
        GK: { x: 8, y: 27.5 },
        LM: { x: 56, y: 17 },
        LW: { x: 68, y: 9 },
        RW: { x: 68, y: 46 },
      },
    },
    {
      t: 4.6,
      pos: { 't-LM': { x: 55, y: 35 }, 't-CF': { x: 52, y: 30 } },
      ball: { with: 't-CF' },
    },
    {
      t: 8,
      pos: {
        GK: { x: 3, y: 27.5 },
        LB: { x: 28, y: 15 },
        LCB: { x: 22, y: 24 },
        RCB: { x: 23, y: 32 },
        RB: { x: 29, y: 42 },
        LM: { x: 39, y: 20 },
        CM: { x: 38, y: 29 },
        RM: { x: 41, y: 37 },
        LW: { x: 50, y: 18 },
        CF: { x: 54, y: 28 },
        RW: { x: 51, y: 38 },
        't-CF': { x: 44, y: 30 },
        't-LM': { x: 48.5, y: 34.5 },
        't-LW': { x: 36, y: 47 },
        't-RW': { x: 37, y: 10 },
        't-CM': { x: 57, y: 24 },
      },
    },
    { t: 11, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 1.3,
      title: 'Lost it',
      caption:
        'We’re attacking with the team spread out wide and high. Our centre half’s pass is intercepted by their left midfielder. Now we’re the ones who are spread out and facing the wrong way.',
      think: 'You’re the left wing, 20 m from the ball. Do you chase it, or go somewhere else?',
    },
    {
      t0: 1.3,
      t1: 4.6,
      title: 'Counter-press: hunt it, right now',
      caption:
        'The two nearest players (the right mid and the centre half) pressure the ball straight away. They don’t need to win it. Their job is to stop a quick forward pass and buy a few seconds for everyone else.',
    },
    {
      t0: 4.6,
      t1: 8,
      title: 'Everyone else: recovery runs',
      caption:
        'Everyone else sprints back towards our goal, not towards the ball. The shortest route back to being goal-side of your opponent is a straight line towards our own goal. Wide players tuck in to the middle. The back four drop and narrow first, then step up once they are set.',
    },
    {
      t0: 8,
      t1: 11,
      title: 'Back in shape',
      caption:
        'Eight seconds later, we’re compact and goal-side again, and their attack runs into a set defence. Losing the ball isn’t the problem. Standing still afterwards is.',
    },
  ],
  annotations: [
    { kind: 'pass', from: { x: 54.5, y: 28 }, to: { x: 59, y: 36 }, t0: 0, t1: 1.3 },
    { kind: 'run', from: { x: 76, y: 5 }, to: { x: 50, y: 18 }, t0: 1.3, t1: 8, team: 'us' },
    { kind: 'run', from: { x: 76, y: 50 }, to: { x: 51, y: 38 }, t0: 1.3, t1: 8, team: 'us' },
    { kind: 'run', from: { x: 48, y: 7 }, to: { x: 28, y: 15 }, t0: 1.3, t1: 8, team: 'us' },
    { kind: 'run', from: { x: 48, y: 48 }, to: { x: 29, y: 42 }, t0: 1.3, t1: 8, team: 'us' },
    { kind: 'run', from: { x: 79, y: 27.5 }, to: { x: 54, y: 28 }, t0: 4.6, t1: 8, team: 'us' },
  ],
  sources: ['coaching-consensus', 'footage'],
  reviewed: false,
};
