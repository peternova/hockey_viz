import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { inTheirGoal } from './helpers';

/**
 * A3: the right wing beats their left back on the outside, drives along the
 * back-line, and cuts the ball back to the centre forward arriving late.
 */
export const a3Baseline: Play = {
  id: 'a3-baseline',
  title: 'Baseline run and cut-back',
  summary:
    'Beat the defender down the outside, drive along the back-line into the circle, and pull the ball back to a team-mate arriving behind the defenders.',
  category: 'attack',
  featuredRoles: ['RW', 'CF', 'LW', 'RM'],
  defaultFollow: 'RW',
  players: [
    ...ourTeam(['RW', 'CF', 'LW', 'RM']),
    theirPlayer('LB'),
    theirPlayer('LCB'),
    theirPlayer('RCB'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        RW: { x: 68, y: 49 },
        CF: { x: 72, y: 30 },
        LW: { x: 72, y: 15 },
        RM: { x: 60, y: 42 },
        't-LB': { x: 74, y: 46 },
        't-LCB': { x: 79, y: 32 },
        't-RCB': { x: 80, y: 22 },
        't-GK': { x: 90, y: 27.5 },
      },
      ball: { with: 'RW' },
    },
    {
      t: 2.5,
      pos: {
        RW: { x: 77, y: 52 },
        't-LB': { x: 76, y: 49 },
        CF: { x: 74, y: 30 },
        RM: { x: 65, y: 44 },
      },
    },
    {
      t: 5,
      pos: {
        RW: { x: 88, y: 42 },
        't-LB': { x: 83, y: 46.5 },
        't-LCB': { x: 88.5, y: 34 },
        't-RCB': { x: 86.5, y: 31 },
        't-GK': { x: 90.5, y: 30.5 },
        CF: { x: 80, y: 29 },
        LW: { x: 84, y: 20 },
        RM: { x: 72, y: 40 },
      },
    },
    {
      t: 5.9,
      pos: { CF: { x: 83, y: 28.5 }, LW: { x: 86, y: 22 }, 't-RCB': { x: 87, y: 30.5 } },
      ball: { with: 'CF' },
    },
    {
      t: 6.5,
      pos: { 't-GK': { x: 90.6, y: 29 } },
      ball: { at: inTheirGoal(-1.1) },
    },
    { t: 8.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.5,
      title: 'Beat them down the outside',
      caption:
        'Our right wing takes on their left back down the side-line. On the right, the ball carrier’s open stick is towards the line, which makes this a natural move. The centre forward waits outside the circle and doesn’t rush in yet.',
    },
    {
      t0: 2.5,
      t1: 5,
      title: 'Drive along the back-line',
      caption:
        'The wing drives in along the back-line and into the circle. The defenders and the goalkeeper all rush towards the near post to block the obvious shot or pass.',
      think: 'The defenders are running towards the near post. Where is the space now?',
    },
    {
      t0: 5,
      t1: 5.9,
      title: 'Cut it back',
      caption:
        'The space is behind the defenders, around the penalty spot. The wing pulls the ball back (a “cut-back”) to the centre forward, who times their run to arrive late, facing the goal.',
    },
    {
      t0: 5.9,
      t1: 8.5,
      title: 'First-time finish',
      caption:
        'The forward shoots first time, before the goalkeeper can get back across. The left wing arrives at the far post in case of a rebound.',
    },
  ],
  annotations: [
    { kind: 'dribble', from: { x: 68, y: 49 }, to: { x: 77, y: 52 }, t0: 0, t1: 2.5 },
    { kind: 'dribble', from: { x: 77, y: 52 }, to: { x: 88, y: 42 }, t0: 2.5, t1: 5 },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Cut-back zone',
      labelAt: { x: 81, y: 24.5 },
      points: [
        { x: 79, y: 24 },
        { x: 85, y: 24 },
        { x: 85, y: 33 },
        { x: 79, y: 33 },
      ],
      t0: 3.5,
      t1: 5.9,
    },
    { kind: 'run', from: { x: 74, y: 30 }, to: { x: 83, y: 28.5 }, t0: 2.5, t1: 5.9, team: 'us' },
    { kind: 'pass', from: { x: 87.4, y: 41.5 }, to: { x: 83.3, y: 29 }, t0: 5, t1: 6.1 },
  ],
  sources: ['coaching-consensus', 'footage'],
  reviewed: false,
};
