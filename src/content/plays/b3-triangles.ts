import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * B3: a supporting player hidden behind a defender moves to open a passing
 * lane, forming a triangle. Then pass and move makes the next triangle.
 */
export const b3Triangles: Play = {
  id: 'b3-triangles',
  title: 'Support triangles and passing angles',
  summary:
    'Get out of the defender’s shadow so the ball carrier can see you. Two supporters at angles make a triangle, which gives two passing options that one defender can’t block.',
  category: 'build-up',
  featuredRoles: ['LM', 'CM', 'RM', 'LW', 'LB'],
  defaultFollow: 'LM',
  players: [
    ...ourTeam(['LB', 'LM', 'CM', 'RM', 'LW', 'CF']),
    theirPlayer('RM'),
    theirPlayer('CM'),
    theirPlayer('RB'),
    theirPlayer('LM'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        CM: { x: 44, y: 28 },
        LM: { x: 57, y: 17 },
        LW: { x: 66, y: 7 },
        CF: { x: 70, y: 29 },
        RM: { x: 55, y: 42 },
        LB: { x: 35, y: 9 },
        't-RM': { x: 51, y: 22 },
        't-CM': { x: 52, y: 31 },
        't-RB': { x: 63, y: 9 },
        't-LM': { x: 58, y: 38 },
      },
      ball: { with: 'CM' },
    },
    { t: 2.5, pos: {} },
    {
      t: 4.5,
      pos: {
        LM: { x: 48, y: 12 },
        LW: { x: 62, y: 7 },
        't-RB': { x: 65.5, y: 9.5 },
        't-RM': { x: 51, y: 21 },
        LB: { x: 36, y: 8 },
      },
    },
    {
      t: 5.6,
      pos: { LM: { x: 47.5, y: 12.5 }, 't-RM': { x: 49.5, y: 16 } },
      ball: { with: 'LM' },
    },
    {
      t: 7,
      pos: {
        CM: { x: 54, y: 23 },
        't-RM': { x: 50, y: 15.5 },
        't-CM': { x: 54, y: 29 },
        LM: { x: 48, y: 12.5 },
      },
    },
    { t: 8, pos: { CM: { x: 55.5, y: 22.5 } }, ball: { with: 'CM' } },
    {
      t: 10.5,
      pos: {
        CM: { x: 62, y: 22 },
        CF: { x: 68, y: 27 },
        LM: { x: 54, y: 14 },
        't-CM': { x: 58, y: 27 },
        LW: { x: 68, y: 6 },
      },
    },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.5,
      title: 'Hidden behind a defender',
      caption:
        'The centre half has the ball, but our left midfielder is standing directly behind their midfielder, in their “shadow”. The pass is blocked, so the left mid is no help even though they’re close.',
      think: 'Where should the left midfielder move so that the pass is on?',
    },
    {
      t0: 2.5,
      t1: 4.5,
      title: 'Move to make a triangle',
      caption:
        'The left mid drops off and wide until they can see the ball past the defender. Now the centre half, the left mid and the left wing form a triangle. A defender can block one passing lane, but not two.',
    },
    {
      t0: 4.5,
      t1: 8,
      title: 'Pass and move',
      caption:
        'The pass goes to the left mid, who receives side-on so they can see forward. The defender steps across to close them down, which leaves a gap behind. The centre half doesn’t stand and watch: they run straight into that gap. Pass, then move.',
    },
    {
      t0: 8,
      t1: 10.5,
      title: 'A new triangle, facing forward',
      caption:
        'The left mid gives it straight back, and the centre half is now past their marker and facing goal, with the centre forward and left wing ahead. Every pass should end with a new triangle forming around the ball.',
    },
  ],
  annotations: [
    {
      kind: 'zone',
      tone: 'danger',
      label: 'Shadow',
      labelAt: { x: 54.5, y: 21.5 },
      points: [
        { x: 50, y: 20 },
        { x: 59, y: 14 },
        { x: 59, y: 20 },
        { x: 52, y: 24 },
      ],
      t0: 0,
      t1: 2.5,
    },
    { kind: 'run', from: { x: 57, y: 17 }, to: { x: 48, y: 12 }, t0: 2.5, t1: 4.5, team: 'us' },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Triangle',
      labelAt: { x: 51, y: 15 },
      points: [
        { x: 44, y: 28 },
        { x: 48, y: 12 },
        { x: 62, y: 7 },
      ],
      t0: 4,
      t1: 5.6,
    },
    { kind: 'pass', from: { x: 44.5, y: 27.5 }, to: { x: 47.8, y: 13 }, t0: 4.5, t1: 5.8 },
    { kind: 'run', from: { x: 45, y: 27 }, to: { x: 55, y: 23 }, t0: 5.6, t1: 8, team: 'us' },
    { kind: 'pass', from: { x: 48.3, y: 13 }, to: { x: 55.2, y: 22.4 }, t0: 7, t1: 8.2 },
  ],
  sources: ['coaching-consensus', 'ha-coaching'],
  reviewed: false,
};
