import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { circleArea, inTheirGoal } from './helpers';

/**
 * A4: three ways into the circle from the right: drive in, pass to the top,
 * or hit across for a deflection. The drive is blocked, the pass to the top
 * draws a defender out, and the far post is left free.
 */
export const a4CircleEntry: Play = {
  id: 'a4-circle-entry',
  title: 'Circle entry: three options',
  summary:
    'Getting into the circle is where goals come from. Drive in, pass to the top of the circle, or hit across for a deflection: read which one the defence is giving you.',
  category: 'attack',
  featuredRoles: ['RM', 'CM', 'CF', 'LW', 'RW'],
  defaultFollow: 'RM',
  players: [
    ...ourTeam(['RM', 'CM', 'CF', 'LW', 'RW']),
    theirPlayer('LB'),
    theirPlayer('LCB'),
    theirPlayer('RCB'),
    theirPlayer('LM'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        RM: { x: 66, y: 42 },
        CM: { x: 62, y: 30 },
        CF: { x: 77, y: 33 },
        LW: { x: 76, y: 15 },
        RW: { x: 78, y: 50 },
        't-LB': { x: 74, y: 45 },
        't-LCB': { x: 81, y: 33 },
        't-RCB': { x: 81, y: 22 },
        't-LM': { x: 66, y: 36 },
        't-GK': { x: 90, y: 28 },
      },
      ball: { with: 'RM' },
    },
    { t: 3.5, pos: {} },
    {
      t: 5.5,
      pos: {
        RM: { x: 70, y: 41 },
        't-LB': { x: 73, y: 39.5 },
        CM: { x: 70, y: 29 },
        't-LM': { x: 67.5, y: 38 },
        CF: { x: 82, y: 33 },
        't-LCB': { x: 85, y: 31 },
      },
    },
    {
      t: 6.6,
      pos: { CM: { x: 74, y: 28 }, 't-RCB': { x: 79, y: 25 } },
      ball: { with: 'CM' },
    },
    {
      t: 7.6,
      pos: {
        CM: { x: 75, y: 27.5 },
        't-RCB': { x: 78.5, y: 25.5 },
        LW: { x: 83, y: 20 },
        't-GK': { x: 89.8, y: 27 },
      },
    },
    {
      t: 8.5,
      pos: { LW: { x: 86.5, y: 23 }, 't-GK': { x: 90, y: 26.8 } },
      ball: { with: 'LW' },
    },
    { t: 9, pos: { 't-GK': { x: 90.2, y: 26.2 } }, ball: { at: inTheirGoal(1) } },
    { t: 11, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3.5,
      title: 'Three options',
      caption:
        'Our right midfielder has the ball near the circle. Option 1: drive in. Option 2: pass to a team-mate at the top of the circle. Option 3: hit it hard across the circle for a deflection at the post. You can only score from inside the circle.',
      think: 'Their left back is goal-side and inside. Which option are they taking away?',
    },
    {
      t0: 3.5,
      t1: 5.5,
      title: 'The drive is blocked',
      caption:
        'The defender steps across to block the drive, and their centre back stays with our centre forward, so the deflection is covered too. Don’t force it. The centre half has moved up to the top of the circle.',
    },
    {
      t0: 5.5,
      t1: 7.6,
      title: 'Pass to the top',
      caption:
        'The ball goes to the top of the circle. Their other centre back has to step out to stop the shot, and that leaves a gap at the far post.',
    },
    {
      t0: 7.6,
      t1: 11,
      title: 'Find the free player',
      caption:
        'Our left wing has drifted in at the back post where nobody is marking them. A quick pass across, a tap in. The best option was the one the defence left open.',
    },
  ],
  annotations: [
    {
      kind: 'zone',
      tone: 'space',
      label: 'Circle',
      labelAt: { x: 87.5, y: 40.5 },
      points: circleArea('theirs'),
      t0: 0,
      t1: 3.5,
    },
    { kind: 'dribble', from: { x: 66.5, y: 41.5 }, to: { x: 76, y: 38 }, t0: 0, t1: 3.5 },
    { kind: 'pass', from: { x: 66.5, y: 41.5 }, to: { x: 75, y: 29 }, t0: 0, t1: 3.5 },
    { kind: 'pass', from: { x: 66.5, y: 42 }, to: { x: 86, y: 31 }, t0: 0, t1: 3.5 },
    { kind: 'pass', from: { x: 70, y: 40.5 }, to: { x: 74, y: 28.5 }, t0: 5.5, t1: 6.8 },
    { kind: 'pass', from: { x: 75, y: 27 }, to: { x: 86.3, y: 23.2 }, t0: 7.6, t1: 8.7 },
  ],
  sources: ['coaching-consensus', 'footage', 'fih-2027'],
  reviewed: false,
};
