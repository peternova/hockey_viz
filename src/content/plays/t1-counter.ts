import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { inTheirGoal } from './helpers';

/**
 * T1: we intercept in our half while they're spread out attacking, look
 * forward first, and break 3v2 before their defence can recover.
 */
export const t1Counter: Play = {
  id: 't1-counter',
  title: 'Counter-attack after winning the ball',
  summary:
    'The moment we win it, their team is spread out and facing the wrong way. Look forward first, move the ball fast, and run hard to make a 3v2 before they recover.',
  category: 'transition',
  featuredRoles: ['RM', 'RW', 'CF', 'LW', 'CM'],
  defaultFollow: 'RW',
  players: [
    ...ourTeam(['RM', 'CM', 'LM', 'RW', 'CF', 'LW', 'RB']),
    theirPlayer('LM'),
    theirPlayer('LW'),
    theirPlayer('CM'),
    theirPlayer('LCB'),
    theirPlayer('RCB'),
    theirPlayer('LB'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        RM: { x: 40, y: 39 },
        CM: { x: 38, y: 28 },
        LM: { x: 40, y: 17 },
        RB: { x: 28, y: 44 },
        RW: { x: 52, y: 41 },
        CF: { x: 55, y: 28 },
        LW: { x: 52, y: 14 },
        't-LM': { x: 45, y: 40 },
        't-LW': { x: 33, y: 49 },
        't-CM': { x: 52, y: 30 },
        't-LCB': { x: 60, y: 33 },
        't-RCB': { x: 60, y: 21 },
        't-LB': { x: 52, y: 48 },
        't-GK': { x: 89.5, y: 27.5 },
      },
      ball: { with: 't-LM' },
    },
    { t: 1, pos: { RM: { x: 39.5, y: 42.5 } } },
    { t: 1.6, pos: { RM: { x: 39.5, y: 43.5 }, 't-LW': { x: 34, y: 48.5 } }, ball: { with: 'RM' } },
    {
      t: 2.4,
      pos: {
        RM: { x: 41, y: 43 },
        RW: { x: 58, y: 44 },
        CF: { x: 58, y: 29 },
        LW: { x: 56, y: 16 },
        't-LM': { x: 43, y: 42 },
        't-LB': { x: 55, y: 47 },
        't-LCB': { x: 63, y: 33 },
        't-RCB': { x: 63, y: 22 },
      },
    },
    {
      t: 3.5,
      pos: {
        RW: { x: 64, y: 45 },
        CF: { x: 62, y: 30 },
        LW: { x: 60, y: 18 },
        RM: { x: 44, y: 43 },
        't-LB': { x: 60, y: 47 },
      },
      ball: { with: 'RW' },
    },
    {
      t: 6.5,
      pos: {
        RW: { x: 77, y: 41 },
        CF: { x: 79, y: 31 },
        LW: { x: 76, y: 19 },
        RM: { x: 58, y: 42 },
        CM: { x: 55, y: 30 },
        't-LB': { x: 70, y: 46 },
        't-LCB': { x: 80.5, y: 37.5 },
        't-RCB': { x: 82, y: 28 },
        't-CM': { x: 62, y: 34 },
        't-LM': { x: 50, y: 40 },
        't-LW': { x: 42, y: 47 },
        't-GK': { x: 90, y: 29 },
      },
    },
    {
      t: 7.2,
      pos: {
        RW: { x: 78.5, y: 38.5 },
        't-LCB': { x: 81, y: 41.2 },
        't-RCB': { x: 84, y: 29.5 },
        CF: { x: 81, y: 31 },
        LW: { x: 78.5, y: 21.5 },
        't-GK': { x: 90, y: 30 },
      },
    },
    {
      t: 8.1,
      pos: { LW: { x: 80, y: 22 }, CF: { x: 82, y: 30 }, 't-RCB': { x: 84.5, y: 28 }, 't-GK': { x: 90, y: 28 } },
      ball: { with: 'LW' },
    },
    { t: 8.6, pos: { 't-GK': { x: 90.2, y: 28.3 } }, ball: { at: inTheirGoal(-1) } },
    { t: 10.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 1.6,
      title: 'Win it',
      caption:
        'They’re attacking down our right with lots of players forward. Our right midfielder reads the pass to their winger and steps in to intercept.',
      think: 'You’ve just won the ball. Where should your first look be?',
    },
    {
      t0: 1.6,
      t1: 3.5,
      title: 'First look forward',
      caption:
        'Look forward first: is someone already free in front of you? Our forwards stayed ready, and the right wing is sprinting into space down the line. One early pass beats four of their players at once.',
    },
    {
      t0: 3.5,
      t1: 6.5,
      title: 'Run with purpose',
      caption:
        'The right wing carries the ball fast at the circle. The centre forward and left wing sprint to get level, so it’s three of ours against their two recovering defenders. The midfielders follow up in support.',
    },
    {
      t0: 6.5,
      t1: 8.1,
      title: 'Commit, then release',
      caption:
        'The right wing commits one defender, so the other has to pick up our centre forward. That leaves the left wing free. The pass goes across, and the centre forward lets it run past (a dummy) to the left wing. Don’t wait: every extra second lets them get back.',
    },
    {
      t0: 8.1,
      t1: 10.5,
      title: 'Finish',
      caption:
        'A first-time shot before the goalkeeper can get across. From the interception to the goal took about nine seconds. That’s why counter-attacks are so dangerous.',
    },
  ],
  annotations: [
    { kind: 'pass', from: { x: 45, y: 40.5 }, to: { x: 33.5, y: 48.6 }, t0: 0, t1: 1.6, team: 'them' },
    { kind: 'run', from: { x: 52, y: 41 }, to: { x: 64, y: 45 }, t0: 1.6, t1: 3.5, team: 'us' },
    { kind: 'pass', from: { x: 41.5, y: 43 }, to: { x: 63.5, y: 45 }, t0: 2.4, t1: 3.7 },
    { kind: 'dribble', from: { x: 64, y: 45 }, to: { x: 77, y: 41 }, t0: 3.5, t1: 6.5 },
    { kind: 'run', from: { x: 62, y: 30 }, to: { x: 79, y: 31 }, t0: 3.5, t1: 6.5, team: 'us' },
    { kind: 'run', from: { x: 60, y: 18 }, to: { x: 76, y: 19 }, t0: 3.5, t1: 6.5, team: 'us' },
    { kind: 'pass', from: { x: 78.7, y: 38 }, to: { x: 80, y: 22.5 }, t0: 7.2, t1: 8.3 },
  ],
  sources: ['coaching-consensus', 'footage'],
  reviewed: false,
};
