import type { Play, Vec } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { circleArea, inTheirGoal } from './helpers';

/**
 * P2: attacking penalty corner. Injection, stop, drag flick. Then a rewind:
 * when the first runner gets out fast, the stopper slips it left for a low
 * hit that the centre forward deflects at the post.
 */
const INJECT: Vec = { x: 91.2, y: 39.6 };

const SET: Record<string, Vec> = {
  RW: { x: 91.9, y: 39.9 },
  CM: { x: 76.2, y: 29.2 },
  RCB: { x: 73.5, y: 26 },
  LM: { x: 77, y: 17 },
  CF: { x: 82.5, y: 12.5 },
  RM: { x: 73.5, y: 33.5 },
  LW: { x: 80, y: 40.5 },
  LB: { x: 57, y: 12 },
  LCB: { x: 56, y: 23.5 },
  RB: { x: 57, y: 43 },
  't-GK': { x: 91.9, y: 27.5 },
  't-LCB': { x: 92.1, y: 31.4 },
  't-RCB': { x: 92.1, y: 23.6 },
  't-LB': { x: 92.2, y: 35.3 },
  't-RB': { x: 92.2, y: 19.7 },
  't-CM': { x: 46.5, y: 27.5 },
  't-LM': { x: 46.5, y: 38 },
  't-RM': { x: 46.5, y: 17 },
  't-CF': { x: 47, y: 31 },
};

/** Their halfway players sprinting back after the injection. */
const THEIR_SPRINT: Record<string, Vec> = {
  't-CM': { x: 54, y: 27.5 },
  't-LM': { x: 54, y: 37 },
  't-RM': { x: 54, y: 18 },
  't-CF': { x: 54, y: 31 },
};

export const p2PcAttack: Play = {
  id: 'p2-pc-attack',
  title: 'Penalty corner attack',
  summary:
    'Injection, stop, shot. Watch the drag flick first, then a rewind showing the “slip” when their first runner gets out fast: a pass left for a low hit and a deflection at the post.',
  category: 'set-piece',
  featuredRoles: ['RW', 'CM', 'RCB', 'LM', 'CF', 'LW', 'RM'],
  defaultFollow: 'RCB',
  players: [
    ...ourTeam(['RW', 'CM', 'RCB', 'LM', 'CF', 'RM', 'LW', 'LB', 'LCB', 'RB']),
    theirPlayer('GK'),
    { id: 't-LCB', team: 'them', label: 'R1', role: 'LCB' },
    { id: 't-RCB', team: 'them', label: 'P', role: 'RCB' },
    { id: 't-LB', team: 'them', label: 'R2', role: 'LB' },
    { id: 't-RB', team: 'them', label: 'R3', role: 'RB' },
    theirPlayer('CM'),
    theirPlayer('LM'),
    theirPlayer('RM'),
    theirPlayer('CF'),
  ],
  keyframes: [
    { t: 0, pos: { ...SET }, ball: { at: INJECT } },
    { t: 3, pos: {} },
    {
      t: 4,
      pos: {
        CM: { x: 76.3, y: 29.1 },
        't-LCB': { x: 85, y: 29 },
        't-GK': { x: 89.6, y: 27.6 },
        't-RCB': { x: 91.1, y: 24.2 },
        't-LB': { x: 88.5, y: 32.5 },
        't-RB': { x: 88.5, y: 22.5 },
        CF: { x: 85.5, y: 21.5 },
        LW: { x: 85, y: 37 },
        RW: { x: 90, y: 38.5 },
        ...THEIR_SPRINT,
      },
      ball: { with: 'CM' },
    },
    {
      t: 4.6,
      pos: { RCB: { x: 76.6, y: 28.6 }, 't-LCB': { x: 82, y: 28.7 }, CM: { x: 77.6, y: 31.6 } },
      ball: { with: 'RCB' },
    },
    { t: 5.1, pos: { RCB: { x: 78.6, y: 28 }, 't-LCB': { x: 81, y: 28.4 } } },
    { t: 5.5, pos: { 't-GK': { x: 89.6, y: 28 } }, ball: { at: inTheirGoal(-1.3) } },
    { t: 6.8, pos: {} },
    { t: 6.9, pos: {}, ball: { at: INJECT } },
    { t: 9, pos: { ...SET } },
    {
      t: 10,
      pos: {
        CM: { x: 76.3, y: 29.1 },
        't-LCB': { x: 82.5, y: 28.9 },
        't-GK': { x: 89.6, y: 27.6 },
        't-RCB': { x: 91.1, y: 24.2 },
        't-LB': { x: 88.5, y: 32.5 },
        't-RB': { x: 88.5, y: 22 },
        CF: { x: 85.5, y: 21.5 },
        LW: { x: 85, y: 37 },
        RW: { x: 90, y: 38.5 },
        RCB: { x: 73.8, y: 26.4 },
        LM: { x: 77.6, y: 18 },
        ...THEIR_SPRINT,
      },
      ball: { with: 'CM' },
    },
    { t: 10.4, pos: { 't-LCB': { x: 79.6, y: 28.4 }, RCB: { x: 74.6, y: 26.6 } } },
    {
      t: 11,
      pos: {
        LM: { x: 79, y: 18.8 },
        CF: { x: 87.4, y: 24 },
        't-RB': { x: 87, y: 19.5 },
        't-GK': { x: 89.6, y: 27 },
        't-LCB': { x: 79.8, y: 27.6 },
      },
      ball: { with: 'LM' },
    },
    { t: 11.6, pos: { CF: { x: 87.7, y: 24.2 }, 't-GK': { x: 89.8, y: 26.4 } }, ball: { with: 'CF' } },
    { t: 12, pos: {}, ball: { at: inTheirGoal(-1.7) } },
    { t: 14, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3,
      title: 'The set-up',
      caption:
        'The ball is on the back-line at least 10 m from the post. The injector has at least one foot off the field, and the other attackers wait outside the circle. Up to five defenders, including the goalkeeper, wait behind the back-line (R1 = first runner, P = post, R2/R3 = second runners), and the rest of their team must be beyond halfway (Rule 13.3). Teams should be ready within about 40 seconds.',
      think: 'Their first runner (R1) will sprint at our shooter. How long do we have from the injection to the shot?',
    },
    {
      t0: 3,
      t1: 4,
      title: 'Injection',
      caption:
        'The injector pushes the ball hard and flat to the top of the circle. Everyone can now move: their defenders sprint out, and their halfway players race back. A goal can’t be scored until the ball has been outside the circle (Rule 13.3 k), so the stop is made just outside it.',
    },
    {
      t0: 4,
      t1: 5.1,
      title: 'Stop, then drag',
      caption:
        'The stopper traps the ball dead, just outside the circle. The drag flicker is already moving and picks it up straight away, dragging it into the circle in one movement.',
    },
    {
      t0: 5.1,
      t1: 6.8,
      title: 'Drag flick',
      caption:
        'A drag flick can be raised to any height as long as it isn’t dangerous (Rule 13.3 m). Aimed at the corners, it’s past the goalkeeper before R1 arrives. All of this takes about 2 seconds.',
    },
    {
      t0: 6.8,
      t1: 10,
      title: 'Rewind: R1 is too fast',
      caption:
        'Same corner again. This time their first runner gets out quicker and will block the flick. The shooter still shapes to flick, to keep the defence guessing.',
    },
    {
      t0: 10,
      t1: 11,
      title: 'The slip',
      caption:
        'Instead of the flick, the stopper slips the ball to our left midfielder, who has stepped into the circle on the left. R1 is now on the wrong side.',
    },
    {
      t0: 11,
      t1: 14,
      title: 'Low hit, deflection at the post',
      caption:
        'A low, hard hit towards the near post, and our centre forward deflects it in. If the first shot at goal is a hit, it must cross the goal-line no higher than 460 mm, the height of the backboard (Rule 13.3 l), so keep the hit low.',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'space', label: 'Circle', labelAt: { x: 87.5, y: 10.5 }, points: circleArea('theirs'), t0: 0, t1: 3 },
    { kind: 'pass', from: { x: 91.2, y: 39.6 }, to: { x: 76.5, y: 29.4 }, t0: 3, t1: 4.1 },
    { kind: 'run', from: { x: 92.1, y: 31.4 }, to: { x: 81, y: 28.4 }, t0: 3, t1: 5.1, team: 'them' },
    { kind: 'dribble', from: { x: 76.6, y: 28.6 }, to: { x: 78.6, y: 28 }, t0: 4.6, t1: 5.1 },
    { kind: 'pass', from: { x: 79.2, y: 28 }, to: { x: 92, y: 26.2 }, t0: 5.1, t1: 6.8 },
    { kind: 'pass', from: { x: 76.5, y: 28.8 }, to: { x: 78.8, y: 19.4 }, t0: 10.3, t1: 11.2 },
    { kind: 'pass', from: { x: 79.4, y: 19 }, to: { x: 87.4, y: 24 }, t0: 11, t1: 11.8 },
  ],
  sources: ['fih-2027', 'footage', 'coaching-consensus'],
  reviewed: false,
  variesByCoach:
    'Who injects, stops and shoots varies by team: pick your best trapper as stopper and your strongest hitter or flicker as shooter. Teams inject from either side, and most have several rehearsed variations called with a code.',
};
