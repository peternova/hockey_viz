import type { Play, Vec } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { circleArea, inTheirGoal, ring } from './helpers';

/**
 * P5: a free hit to us inside their 23 m area. Everyone 5 m away, no direct
 * entry into the circle, so self-pass and carry 5 m first.
 */
const SPOT: Vec = { x: 73, y: 13 };

export const p5FreeHit23: Play = {
  id: 'p5-free-hit-23',
  title: 'Free hits inside their 23: the 5 m rule and self-pass',
  summary:
    'Everyone has to be 5 m from the ball, and it can’t go straight into the circle. Take it quickly as a self-pass, carry it 5 m, then attack the circle before they are set.',
  category: 'set-piece',
  featuredRoles: ['LM', 'LW', 'CF', 'CM', 'LB'],
  defaultFollow: 'LM',
  players: [
    ...ourTeam(['LM', 'LW', 'CF', 'CM', 'LB']),
    theirPlayer('RB'),
    theirPlayer('RM'),
    theirPlayer('RCB'),
    theirPlayer('LCB'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        LM: { x: 72.4, y: 13.2 },
        LW: { x: 80, y: 7 },
        CF: { x: 78, y: 25 },
        CM: { x: 66, y: 24 },
        LB: { x: 63, y: 9 },
        't-RB': { x: 78.5, y: 13.5 },
        't-RM': { x: 69, y: 17.5 },
        't-RCB': { x: 81, y: 22 },
        't-LCB': { x: 81, y: 30 },
        't-GK': { x: 90.3, y: 26 },
      },
      ball: { at: SPOT },
    },
    { t: 3.5, pos: {} },
    { t: 3.8, pos: { LM: { x: 72.8, y: 13.3 } }, ball: { with: 'LM' } },
    {
      t: 5.8,
      pos: {
        LM: { x: 78.2, y: 15.6 },
        't-RB': { x: 81.5, y: 14.2 },
        't-RM': { x: 73, y: 18 },
        CF: { x: 80, y: 24 },
        LW: { x: 83, y: 10 },
      },
    },
    {
      t: 6.6,
      pos: { CF: { x: 84, y: 23.5 }, 't-RCB': { x: 85, y: 22 }, 't-GK': { x: 90.2, y: 25.6 }, LM: { x: 78.6, y: 15.9 } },
    },
    {
      t: 7.4,
      pos: { CF: { x: 85.5, y: 24.6 }, 't-RCB': { x: 86.8, y: 21.5 } },
      ball: { with: 'CF' },
    },
    { t: 7.8, pos: { 't-GK': { x: 90.3, y: 26.2 } }, ball: { at: inTheirGoal(-0.7) } },
    { t: 9.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3.5,
      title: 'Everyone 5 m away',
      caption:
        'A free hit to us inside their 23 m area. Every player except the taker, on both teams, must be at least 5 m from the ball (Rule 13.2 c). The ball must be stationary, and it can be moved with a hit, push, flick or scoop.',
      think: 'Can the taker pass it straight to the centre forward at the near post?',
    },
    {
      t0: 3.5,
      t1: 5.8,
      title: 'Self-pass: carry it 5 m',
      caption:
        'No. From a free hit in their 23, the ball can’t enter the circle until it has travelled at least 5 m or been touched by a defender (Rule 13.2 f). So the taker plays it to themselves (a self-pass) and carries it more than 5 m along the edge of the circle. Taking it quickly, before their defence is set, is the big advantage.',
    },
    {
      t0: 5.8,
      t1: 7.4,
      title: 'Now into the circle',
      caption:
        'The ball has travelled 5 m, so it can now go in. The centre forward leads to the near post ahead of the defender, and the pass is played into their path.',
    },
    {
      t0: 7.4,
      t1: 9.5,
      title: 'Finish at the post',
      caption:
        'A touch at the near post. If the free hit is within 5 m of the circle, defenders inside the circle may shadow a self-passing taker but can’t play the ball until it has travelled 5 m (Rule 13.2 f).',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'danger', label: '5 m', labelAt: { x: 73, y: 9.5 }, points: ring(SPOT, 5), t0: 0, t1: 3.8 },
    { kind: 'zone', tone: 'space', label: 'No direct entry', labelAt: { x: 85.5, y: 41.5 }, points: circleArea('theirs'), t0: 0, t1: 5.8 },
    { kind: 'dribble', from: { x: 72.8, y: 13.3 }, to: { x: 78.2, y: 15.6 }, t0: 3.5, t1: 5.8 },
    { kind: 'run', from: { x: 80, y: 24 }, to: { x: 85.5, y: 24.6 }, t0: 5.8, t1: 7.4, team: 'us' },
    { kind: 'pass', from: { x: 78.8, y: 16.2 }, to: { x: 85.3, y: 24.4 }, t0: 6.6, t1: 7.6 },
  ],
  sources: ['fih-2027', 'coaching-consensus'],
  reviewed: false,
};
