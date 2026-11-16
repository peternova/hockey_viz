import type { Play, Vec } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { PITCH } from '../../pitch/coords';
import { circleArea, inTheirGoal, ring } from './helpers';

/**
 * P4: our long corner. The ball went off their stick over the back-line, so
 * we restart on their 23 m line in line with where it went out. A self-pass
 * carries it 5 m, then a hard pass to the post.
 */
const SPOT: Vec = { x: PITCH.length - PITCH.line23, y: 50 };

export const p4LongCorner: Play = {
  id: 'p4-long-corner',
  title: 'Long corner',
  summary:
    'When a defender knocks the ball over their own back-line by accident, we restart on the 23 m line in line with where it went out. Free-hit rules apply, including the 5 m rule before the circle.',
  category: 'set-piece',
  featuredRoles: ['RW', 'RM', 'CF', 'LW', 'RB'],
  defaultFollow: 'RW',
  players: [
    ...ourTeam(['RW', 'RM', 'RB', 'CF', 'LW', 'CM']),
    theirPlayer('LB'),
    theirPlayer('LM'),
    theirPlayer('LCB'),
    theirPlayer('RCB'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        RW: { x: 68, y: 50.6 },
        RM: { x: 63, y: 44 },
        RB: { x: 58, y: 51 },
        CF: { x: 77, y: 34 },
        LW: { x: 77, y: 20 },
        CM: { x: 66, y: 30 },
        't-LB': { x: 73.2, y: 46.8 },
        't-LM': { x: 64, y: 40 },
        't-LCB': { x: 80, y: 33 },
        't-RCB': { x: 80, y: 23 },
        't-GK': { x: 90.3, y: 29 },
      },
      ball: { at: SPOT },
    },
    { t: 3, pos: {} },
    { t: 3.5, pos: { RW: { x: 68.4, y: 50.3 } }, ball: { with: 'RW' } },
    {
      t: 5.5,
      pos: {
        RW: { x: 73.5, y: 47.5 },
        't-LB': { x: 76.5, y: 45 },
        CF: { x: 80, y: 35 },
        't-LCB': { x: 83, y: 33.5 },
        LW: { x: 82, y: 19 },
        RM: { x: 67, y: 44 },
      },
    },
    {
      t: 6.3,
      pos: { CF: { x: 85.5, y: 32 }, 't-LCB': { x: 85.5, y: 34 }, RW: { x: 74, y: 47 }, 't-GK': { x: 90.2, y: 30 } },
    },
    {
      t: 7.1,
      pos: { CF: { x: 87, y: 30.6 }, 't-LCB': { x: 86.5, y: 33 }, LW: { x: 85, y: 24.5 } },
      ball: { with: 'CF' },
    },
    { t: 7.5, pos: { 't-GK': { x: 90.3, y: 29.4 } }, ball: { at: inTheirGoal(1.2) } },
    { t: 9.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3,
      title: 'Where it’s taken',
      caption:
        'Their defender played the ball over their back-line by accident, so we restart on their 23 m line, in line with where it went out (Rule 7.4 b). It counts as a free hit in their 23, so everyone except the taker, team-mates included, must be 5 m away (Rule 13.2 c).',
      think: 'Can the taker hit it straight into the circle to the centre forward?',
    },
    {
      t0: 3,
      t1: 5.5,
      title: 'Self-pass, carry 5 m',
      caption:
        'No: the ball can’t enter the circle until it has travelled 5 m or been touched by a defender (Rule 13.2 f). So the taker plays a self-pass and carries it more than 5 m towards the circle, drawing their left back.',
    },
    {
      t0: 5.5,
      t1: 7.1,
      title: 'Now it can go in',
      caption:
        'Having travelled 5 m, the ball can now go into the circle. The centre forward times a lead to the near post, getting in front of their marker, and the wing hits it hard and flat across.',
    },
    {
      t0: 7.1,
      t1: 9.5,
      title: 'Deflection',
      caption:
        'A deflection at the post. The left wing arrives at the back post in case it runs through. Other options from a long corner: a short pass to the right mid, or recycling it back to keep the ball.',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'danger', label: '5 m', labelAt: { x: 65.5, y: 46.5 }, points: ring(SPOT, 5), t0: 0, t1: 3.5 },
    { kind: 'zone', tone: 'space', label: 'Not yet!', labelAt: { x: 85, y: 41.5 }, points: circleArea('theirs'), t0: 0, t1: 5.5 },
    { kind: 'dribble', from: { x: 68.4, y: 50.3 }, to: { x: 73.5, y: 47.5 }, t0: 3, t1: 5.5 },
    { kind: 'run', from: { x: 80, y: 35 }, to: { x: 87, y: 30.6 }, t0: 5.5, t1: 7.1, team: 'us' },
    { kind: 'pass', from: { x: 74, y: 46.8 }, to: { x: 86.8, y: 31 }, t0: 6.3, t1: 7.3 },
  ],
  sources: ['fih-2027', 'coaching-consensus'],
  reviewed: false,
};
