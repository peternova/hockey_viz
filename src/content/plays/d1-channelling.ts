import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * D1: the right back channels an attacker down the side-line, with the
 * centre back covering, then wins the ball on the open stick.
 */
export const d1Channelling: Play = {
  id: 'd1-channelling',
  title: 'Channelling an attacker to the side-line',
  summary:
    'Close down while the ball travels, then slow down, stay goal-side and inside, and show the attacker the side-line. Tackle when they run out of room.',
  category: 'defence',
  featuredRoles: ['RB', 'RCB', 'RM', 'LB'],
  defaultFollow: 'RB',
  players: [
    ...ourTeam(['GK', 'LCB', 'RCB', 'RB', 'RM']),
    theirPlayer('LW'),
    theirPlayer('LM'),
    theirPlayer('CF'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        GK: { x: 2.5, y: 27.5 },
        LCB: { x: 22, y: 26 },
        RCB: { x: 24, y: 34 },
        RB: { x: 40, y: 42 },
        RM: { x: 52, y: 37 },
        't-LW': { x: 54, y: 49 },
        't-LM': { x: 60, y: 40 },
        't-CF': { x: 34, y: 30 },
      },
      ball: { with: 't-LM' },
    },
    {
      t: 1.6,
      pos: { RB: { x: 44, y: 45 }, 't-LW': { x: 52.5, y: 49.5 }, RM: { x: 54, y: 39 } },
      ball: { with: 't-LW' },
    },
    {
      t: 3.5,
      pos: { RB: { x: 45, y: 46.3 }, 't-LW': { x: 50, y: 49.8 }, RCB: { x: 25, y: 37 } },
    },
    {
      t: 7.5,
      pos: {
        RB: { x: 35.5, y: 50.3 },
        't-LW': { x: 38.5, y: 52.6 },
        RCB: { x: 28, y: 41 },
        LCB: { x: 24, y: 31 },
        RM: { x: 45, y: 43 },
        't-LM': { x: 50, y: 43 },
        't-CF': { x: 30, y: 33 },
      },
    },
    {
      t: 8.8,
      pos: { RB: { x: 34.4, y: 51.9 }, 't-LW': { x: 36, y: 53.4 } },
      ball: { with: 'RB' },
    },
    { t: 9.5, pos: { RB: { x: 34, y: 51.5 }, 't-LW': { x: 36.5, y: 53.8 } } },
    {
      t: 11,
      pos: { RM: { x: 41, y: 44 }, 't-LM': { x: 47, y: 42 } },
      ball: { with: 'RM' },
    },
    {
      t: 13,
      pos: {
        RM: { x: 48, y: 42 },
        RB: { x: 38, y: 49 },
        RCB: { x: 30, y: 38 },
        LCB: { x: 27, y: 28 },
      },
    },
  ],
  steps: [
    {
      t0: 0,
      t1: 1.6,
      title: 'Close the gap while the ball travels',
      caption:
        'Their midfielder passes wide. The right back sprints towards the receiver while the ball is moving — that’s the cheapest time to cover ground.',
    },
    {
      t0: 1.6,
      t1: 3.5,
      title: 'Slow down before you arrive',
      caption:
        'Arriving at full speed gets you beaten. Brake, get low, and stop about 3–4 m away: goal-side (between them and the goal) and slightly inside them.',
      think: 'Where is the attacker’s easiest route to goal right now — along the line, or inside?',
    },
    {
      t0: 3.5,
      t1: 7.5,
      title: 'Show them the line (jockey)',
      caption:
        'By standing on the inside shoulder, the right back shuts the route inside and “shows” the side-line. The line becomes an extra defender. On the right, the defender’s open stick (forehand) faces the side-line — their strong side — while the attacker is pushed onto their reverse side. Meanwhile the centre back slides across to cover.',
      think: 'Why doesn’t the right back dive in for the ball yet?',
    },
    {
      t0: 7.5,
      t1: 9.5,
      title: 'Tackle when they run out of room',
      caption:
        'Patience wins: diving in early lets the attacker go past. When the ball gets a little loose or they run out of space at the line, the right back makes a block tackle on the open stick.',
    },
    {
      t0: 9.5,
      t1: 13,
      title: 'Win it, then use it',
      caption:
        'A quick pass to the right midfielder, who has tracked back to support. The defence steps up again to get back into shape.',
    },
  ],
  annotations: [
    { kind: 'run', from: { x: 40, y: 42 }, to: { x: 45, y: 46.3 }, t0: 0, t1: 3.5 },
    { kind: 'pass', from: { x: 59, y: 40 }, to: { x: 53.5, y: 49.5 }, t0: 0, t1: 1.6 },
    {
      kind: 'zone',
      tone: 'danger',
      label: 'Shut the inside',
      labelAt: { x: 37, y: 36.5 },
      points: [
        { x: 44, y: 34 },
        { x: 44, y: 45 },
        { x: 30, y: 45 },
        { x: 30, y: 34 },
      ],
      t0: 3.5,
      t1: 7.5,
    },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Show the line',
      labelAt: { x: 33, y: 53.4 },
      points: [
        { x: 48, y: 51 },
        { x: 48, y: 55 },
        { x: 30, y: 55 },
        { x: 30, y: 51 },
      ],
      t0: 3.5,
      t1: 7.5,
    },
    { kind: 'run', from: { x: 25, y: 37 }, to: { x: 28, y: 41 }, t0: 3.5, t1: 7.5 },
    { kind: 'pass', from: { x: 35, y: 51.8 }, to: { x: 41, y: 44 }, t0: 9.5, t1: 11 },
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
  variesByCoach:
    'Some coaches prefer to force attackers infield, into a covering defender, instead of towards the line. This is more common on the left side, where the side-line is on the defender’s reverse stick.',
};
