import type { Play, PositionId, Vec } from '../../engine/types';
import { ALL_POSITIONS, ourTeam, theirPlayer } from '../formations';
import { rect } from './helpers';

/**
 * D4: the same opposition build-up met with three press heights: a full press
 * (with a side-line trap), a half press with a trigger, and a zone press.
 */
type Shape = Record<PositionId, Vec>;

const FULL: Shape = {
  GK: { x: 17, y: 27.5 },
  LB: { x: 40, y: 10 },
  LCB: { x: 38, y: 26 },
  RCB: { x: 34, y: 33 },
  RB: { x: 40, y: 45 },
  LM: { x: 66, y: 9 },
  CM: { x: 62, y: 28 },
  RM: { x: 57, y: 39 },
  LW: { x: 73, y: 21 },
  CF: { x: 75, y: 30 },
  RW: { x: 67, y: 45 },
};

const HALF: Shape = {
  GK: { x: 4, y: 27.5 },
  LB: { x: 31, y: 11 },
  LCB: { x: 29, y: 23 },
  RCB: { x: 29, y: 32 },
  RB: { x: 31, y: 44 },
  LM: { x: 44, y: 15 },
  CM: { x: 43, y: 27.5 },
  RM: { x: 44, y: 40 },
  LW: { x: 53, y: 18 },
  CF: { x: 55, y: 29 },
  RW: { x: 53, y: 39 },
};

const ZONE: Shape = {
  GK: { x: 3, y: 27.5 },
  LB: { x: 23, y: 12 },
  LCB: { x: 20, y: 23 },
  RCB: { x: 20, y: 32 },
  RB: { x: 23, y: 43 },
  LM: { x: 35, y: 16 },
  CM: { x: 34, y: 27.5 },
  RM: { x: 35, y: 39 },
  LW: { x: 43, y: 19 },
  CF: { x: 45, y: 30 },
  RW: { x: 43, y: 38 },
};

/** Their team building from the back (they attack towards x = 0). */
const THEM_DEEP: Record<string, Vec> = {
  't-GK': { x: 89.5, y: 27.5 },
  't-LCB': { x: 79, y: 33 },
  't-RCB': { x: 79, y: 22 },
  't-LB': { x: 71, y: 49 },
  't-RB': { x: 71, y: 6 },
  't-CM': { x: 66, y: 27.5 },
  't-LM': { x: 61, y: 40 },
  't-RM': { x: 61, y: 15 },
  't-LW': { x: 44, y: 46 },
  't-CF': { x: 42, y: 27.5 },
  't-RW': { x: 44, y: 9 },
};

const THEM_HALF: Record<string, Vec> = {
  ...THEM_DEEP,
  't-LW': { x: 38, y: 46 },
  't-CF': { x: 36, y: 27.5 },
  't-RW': { x: 38, y: 9 },
};

const THEM_HIGH: Record<string, Vec> = {
  't-GK': { x: 88, y: 27.5 },
  't-LCB': { x: 58, y: 33 },
  't-RCB': { x: 61, y: 21 },
  't-LB': { x: 54, y: 49 },
  't-RB': { x: 54, y: 6 },
  't-CM': { x: 52, y: 27.5 },
  't-LM': { x: 48, y: 41 },
  't-RM': { x: 49, y: 13 },
  't-LW': { x: 30, y: 46 },
  't-CF': { x: 28, y: 27.5 },
  't-RW': { x: 30, y: 9 },
};

const THEIR_ROLES: PositionId[] = ['GK', 'LCB', 'RCB', 'LB', 'RB', 'CM', 'LM', 'RM', 'LW', 'CF', 'RW'];

export const d4Pressing: Play = {
  id: 'd4-pressing',
  title: 'Pressing: full, half and zone',
  summary:
    'Three choices for where to start winning the ball back: right up at their goal (full press), from halfway (half press), or from our own half (zone press). Higher wins the ball nearer their goal but costs more energy and leaves space behind.',
  category: 'defence',
  featuredRoles: [...ALL_POSITIONS],
  defaultFollow: 'CF',
  players: [...ourTeam(), ...THEIR_ROLES.map(theirPlayer)],
  keyframes: [
    { t: 0, pos: { ...FULL, ...THEM_DEEP }, ball: { with: 't-LCB' } },
    { t: 4, pos: {} },
    {
      t: 4.9,
      pos: { RW: { x: 68.5, y: 46 }, CF: { x: 75, y: 35 } },
      ball: { with: 't-LB' },
    },
    {
      t: 6.6,
      pos: {
        RW: { x: 70, y: 48.5 },
        RM: { x: 63, y: 47 },
        CF: { x: 74, y: 40 },
        CM: { x: 64, y: 36 },
        't-LB': { x: 70.5, y: 51 },
        't-LM': { x: 61, y: 43 },
        't-CM': { x: 67, y: 31 },
      },
    },
    { t: 7.4, pos: { RW: { x: 70.2, y: 49.5 } }, ball: { with: 'RW' } },
    { t: 7.5, pos: {} },
    { t: 7.6, pos: {}, ball: { with: 't-LCB' } },
    { t: 10.5, pos: { ...HALF, ...THEM_HALF } },
    {
      t: 11.5,
      pos: { 't-RCB': { x: 78, y: 21 } },
      ball: { with: 't-RCB' },
    },
    {
      t: 12.7,
      pos: { 't-RM': { x: 59, y: 15 }, LM: { x: 49, y: 15 } },
      ball: { with: 't-RM' },
    },
    {
      t: 14,
      pos: {
        LM: { x: 56, y: 14.5 },
        LW: { x: 61, y: 19 },
        CM: { x: 50, y: 22 },
        LB: { x: 35, y: 11.5 },
        't-RM': { x: 58.5, y: 14 },
      },
    },
    {
      t: 15.2,
      pos: { 't-RB': { x: 70, y: 7 }, 't-RM': { x: 59, y: 13.5 } },
      ball: { with: 't-RB' },
    },
    { t: 16.4, pos: { 't-RCB': { x: 76, y: 21 } }, ball: { with: 't-RCB' } },
    { t: 18.5, pos: { ...ZONE, ...THEM_HIGH } },
    { t: 21.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 4,
      title: 'Full press: hunt them at their goal',
      caption:
        'They have the ball at the back. In a full press our forwards go right up to their defenders and everyone behind marks someone tight, so there’s no easy pass. The centre forward curves their run to push the ball one way. Our goalkeeper pushes up to the edge of our 23 m area, ready for a long ball.',
      think: 'Everyone is marking someone. What happens if they get a long ball over the top?',
    },
    {
      t0: 4,
      t1: 7.5,
      title: 'The trap',
      caption:
        'The ball goes wide to their left back. That’s the trigger: our right wing closes from the inside, the right mid blocks the pass down the line, and the centre forward cuts off the pass back. The side-line is the extra defender. We win it 20 m from their goal.',
    },
    {
      t0: 7.5,
      t1: 10.5,
      title: 'Half press: let them have the back',
      caption:
        'Rewind. This time we drop to around halfway in a compact block. Their defenders can pass across the back, and we let them. Our forwards stay narrow so the passes into the middle are blocked.',
    },
    {
      t0: 10.5,
      t1: 15.2,
      title: 'The trigger: pounce',
      caption:
        'As soon as the ball goes into their midfield, the nearest players pounce: our left mid pressures, the left wing cuts off the pass back, and the centre half blocks the inside. Forced backwards, they have to go back to the start.',
    },
    {
      t0: 15.2,
      t1: 18.5,
      title: 'Zone press: hold our half',
      caption:
        'In a zone (or “drop”) press we let them bring the ball almost to halfway, and keep a compact shape in our own half. Less running, very hard to play through, but we win the ball further from their goal.',
    },
    {
      t0: 18.5,
      t1: 21.5,
      title: 'Which one, when?',
      caption:
        'Full press: short bursts when we need a goal, or right after they restart. Half press: a good everyday default. Zone press: protecting a lead, or saving legs late in the game. Whatever the choice, the whole team has to do it together.',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'danger', label: 'We hunt here', labelAt: { x: 82, y: 2.6 }, points: rect(68.5, 0, 91.4, 55), t0: 0, t1: 7.5 },
    { kind: 'zone', tone: 'danger', label: 'Press starts here', labelAt: { x: 54, y: 2.6 }, points: rect(45.7, 0, 62, 55), t0: 7.5, t1: 15.2 },
    { kind: 'zone', tone: 'danger', label: 'Press starts here', labelAt: { x: 40, y: 2.6 }, points: rect(32, 0, 48, 55), t0: 15.2, t1: 21.5 },
    { kind: 'pass', from: { x: 79, y: 33.5 }, to: { x: 71, y: 48.5 }, t0: 4, t1: 5.1 },
    { kind: 'pass', from: { x: 78.5, y: 22 }, to: { x: 59.5, y: 15 }, t0: 11.5, t1: 12.9 },
    { kind: 'pass', from: { x: 59, y: 13.5 }, to: { x: 70, y: 7.2 }, t0: 14, t1: 15.4 },
  ],
  sources: ['coaching-consensus', 'fih-academy', 'footage'],
  reviewed: false,
  variesByCoach:
    'Press names vary a lot: “full court”, “half court”, “50 press”, “23 press”, “W press”, “drop”. The heights here are typical, but your coach will set the exact lines and triggers.',
};
