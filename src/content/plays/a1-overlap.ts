import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * A1: 2v1 down the right. The right midfielder commits the defender, the
 * right back overlaps outside, the winger clears the space, and the centre
 * forward finishes at the near post.
 */
export const a1Overlap: Play = {
  id: 'a1-overlap',
  title: '2v1 overlap down the right',
  summary:
    'Run at the defender to commit them, overlap on the outside, release the pass at the right moment, and finish at the post.',
  category: 'attack',
  featuredRoles: ['RB', 'RM', 'RW', 'CF'],
  defaultFollow: 'RB',
  players: [
    ...ourTeam(['RB', 'RM', 'RW', 'CF']),
    theirPlayer('LM'),
    theirPlayer('LB'),
    { id: 't-CB', team: 'them', label: 'CB', role: 'LCB' },
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        RM: { x: 50, y: 42 },
        RB: { x: 42, y: 46 },
        RW: { x: 72, y: 50 },
        CF: { x: 76, y: 30 },
        't-LM': { x: 60, y: 44 },
        't-LB': { x: 75, y: 47 },
        't-CB': { x: 80, y: 31 },
        't-GK': { x: 89.5, y: 27.5 },
      },
      ball: { with: 'RM' },
    },
    {
      t: 2.5,
      pos: {
        RM: { x: 56, y: 42.5 },
        RB: { x: 52, y: 50 },
        RW: { x: 78, y: 40 },
        't-LB': { x: 81, y: 42.5 },
        't-LM': { x: 61, y: 43.5 },
      },
    },
    {
      t: 4.5,
      pos: {
        RB: { x: 62, y: 51.5 },
        RM: { x: 58, y: 43 },
        't-LM': { x: 60.5, y: 44.5 },
      },
    },
    {
      t: 6,
      pos: {
        RB: { x: 68, y: 51.5 },
        RM: { x: 64, y: 42 },
        't-LM': { x: 63, y: 46 },
      },
      ball: { with: 'RB' },
    },
    {
      t: 8,
      pos: {
        RB: { x: 77, y: 49.5 },
        CF: { x: 83, y: 34 },
        't-CB': { x: 84, y: 31 },
        RW: { x: 76, y: 38 },
        't-LB': { x: 79, y: 40 },
        RM: { x: 69, y: 41 },
        't-LM': { x: 67, y: 46.5 },
        't-GK': { x: 89.8, y: 30 },
      },
    },
    {
      t: 9,
      pos: { CF: { x: 85, y: 33 }, RB: { x: 79, y: 49 }, 't-CB': { x: 85.5, y: 31.5 } },
      ball: { with: 'CF' },
    },
    {
      t: 9.7,
      pos: { CF: { x: 86, y: 32.5 }, 't-GK': { x: 90, y: 30.5 } },
      ball: { at: { x: 92, y: 28.4 } },
    },
    { t: 11.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.5,
      title: 'Commit the defender',
      caption:
        'The right midfielder runs straight at their defender to make them commit. Meanwhile our right wing pulls infield, taking their left back away and clearing space down the line.',
      think: 'The defender can only stop one of two players. What should the ball carrier watch?',
    },
    {
      t0: 2.5,
      t1: 4.5,
      title: 'The overlap',
      caption:
        'The right back sprints round the OUTSIDE of the ball carrier and calls “overlap!”. Now it’s 2v1. The ball carrier reads the defender: if the defender sticks to the ball, pass; if they drift across to the runner, keep it and drive inside.',
    },
    {
      t0: 4.5,
      t1: 6,
      title: 'Release the pass into space',
      caption:
        'The defender stays with the ball carrier, so the pass goes into the runner’s path, ahead of them, so they don’t need to slow down. Then the passer keeps moving to support: pass and move.',
    },
    {
      t0: 6,
      t1: 9,
      title: 'Drive, then find the striker',
      caption:
        'The right back carries towards the circle. The centre forward leads to the near post, getting in front of their marker.',
    },
    {
      t0: 9,
      t1: 11.5,
      title: 'Finish at the post',
      caption:
        'A first-time deflection at the near post beats the goalkeeper before they can set. Goals must be scored from inside the circle.',
    },
  ],
  annotations: [
    { kind: 'dribble', from: { x: 50, y: 42 }, to: { x: 57, y: 42.5 }, t0: 0, t1: 2.5 },
    { kind: 'run', from: { x: 72, y: 50 }, to: { x: 78, y: 40 }, t0: 0, t1: 2.5 },
    { kind: 'run', from: { x: 52, y: 50 }, to: { x: 68, y: 51.5 }, t0: 2.5, t1: 6 },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Space created',
      labelAt: { x: 75, y: 53.2 },
      points: [
        { x: 64, y: 48 },
        { x: 80, y: 48 },
        { x: 80, y: 54.5 },
        { x: 64, y: 54.5 },
      ],
      t0: 1.5,
      t1: 6,
    },
    { kind: 'pass', from: { x: 58.9, y: 43.3 }, to: { x: 68.9, y: 51.8 }, t0: 4.5, t1: 6 },
    { kind: 'run', from: { x: 76, y: 30 }, to: { x: 85, y: 33 }, t0: 6, t1: 9 },
    { kind: 'pass', from: { x: 78, y: 49.3 }, to: { x: 84.5, y: 33.5 }, t0: 8, t1: 9.2 },
  ],
  sources: ['coaching-consensus', 'fih-2027', 'footage'],
  reviewed: false,
};
