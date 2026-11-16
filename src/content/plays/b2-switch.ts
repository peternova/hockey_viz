import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * B2: the right side is crowded, so the ball goes back and across through the
 * centre backs to a left back who has pushed high and wide.
 */
export const b2Switch: Play = {
  id: 'b2-switch',
  title: 'Switching play through the back',
  summary:
    'When one side gets crowded, go back and across through the centre backs. Quick, firm passes move the ball faster than they can shift.',
  category: 'build-up',
  featuredRoles: ['LCB', 'RCB', 'LB', 'RB', 'LM', 'LW'],
  defaultFollow: 'LCB',
  players: [
    ...ourTeam(['LB', 'LCB', 'RCB', 'RB', 'LM', 'CM', 'RM', 'LW']),
    theirPlayer('LW'),
    theirPlayer('LM'),
    theirPlayer('CF'),
    theirPlayer('CM'),
    theirPlayer('RM'),
    theirPlayer('RW'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        RB: { x: 40, y: 48 },
        RM: { x: 50, y: 46 },
        CM: { x: 41, y: 31 },
        LM: { x: 50, y: 17 },
        LW: { x: 64, y: 6 },
        RCB: { x: 30, y: 35 },
        LCB: { x: 30, y: 21 },
        LB: { x: 40, y: 9 },
        't-LW': { x: 46, y: 45 },
        't-LM': { x: 53, y: 43 },
        't-CF': { x: 40, y: 38 },
        't-CM': { x: 47, y: 32 },
        't-RM': { x: 53, y: 26 },
        't-RW': { x: 44, y: 23 },
      },
      ball: { with: 'RB' },
    },
    { t: 1.5, pos: { 't-LW': { x: 43, y: 46.5 } } },
    {
      t: 2.6,
      pos: { RCB: { x: 31, y: 33.5 }, 't-CF': { x: 38, y: 34 }, RB: { x: 39, y: 49 } },
      ball: { with: 'RCB' },
    },
    {
      t: 4,
      pos: {
        LCB: { x: 31, y: 22 },
        't-CF': { x: 36, y: 30 },
        't-RW': { x: 40, y: 20 },
        LB: { x: 43, y: 8 },
      },
      ball: { with: 'LCB' },
    },
    {
      t: 5.4,
      pos: {
        LB: { x: 45, y: 7 },
        't-RW': { x: 37, y: 19 },
        't-RM': { x: 51, y: 18 },
        't-CM': { x: 46, y: 27 },
        LW: { x: 64, y: 5 },
      },
      ball: { with: 'LB' },
    },
    {
      t: 8.5,
      pos: {
        LB: { x: 57, y: 8 },
        't-RM': { x: 54, y: 12 },
        LM: { x: 58, y: 19 },
        LW: { x: 70, y: 5 },
        CM: { x: 47, y: 25 },
        RM: { x: 58, y: 38 },
        't-LM': { x: 54, y: 36 },
        't-LW': { x: 45.5, y: 41 },
        't-CM': { x: 51, y: 22 },
        RCB: { x: 32, y: 32 },
        LCB: { x: 34, y: 23 },
        RB: { x: 42, y: 44 },
      },
    },
    { t: 9.6, pos: { LM: { x: 61, y: 19 }, LB: { x: 58, y: 8.5 } }, ball: { with: 'LM' } },
    { t: 11.5, pos: { LM: { x: 67, y: 20 }, LW: { x: 74, y: 6 } } },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.6,
      title: 'Too crowded: go back',
      caption:
        'Our right back is being squeezed against the side-line and their whole team has shifted across. Forcing it down the line here loses the ball. Instead, play it back to the right centre back, who has dropped to give an easy angle.',
      think: 'Where is the space on the pitch right now?',
    },
    {
      t0: 2.6,
      t1: 5.4,
      title: 'Across the back, quickly',
      caption:
        'The right centre back passes straight across to the left centre back, and the left centre back moves it on with as few touches as possible. Each pass beats their shift. Firm, flat passes on the ground are faster than any defender can run.',
    },
    {
      t0: 5.4,
      t1: 8.5,
      title: 'Attack the space on the far side',
      caption:
        'Our left back pushed high and wide while the ball was on the right, so they receive with time and space. They carry it forward and draw a defender, while the left midfielder moves into a gap to receive.',
    },
    {
      t0: 8.5,
      t1: 11.5,
      title: 'Into midfield, facing forward',
      caption:
        'The left midfielder receives facing forward with the left wing ahead. A switch is only worth it if someone on the far side is ready, so the wide players must hold their width while the ball is on the other side.',
    },
  ],
  annotations: [
    {
      kind: 'zone',
      tone: 'danger',
      label: 'Crowded',
      labelAt: { x: 46, y: 52.5 },
      points: [
        { x: 36, y: 38 },
        { x: 56, y: 38 },
        { x: 56, y: 55 },
        { x: 36, y: 55 },
      ],
      t0: 0,
      t1: 2.6,
    },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Space',
      labelAt: { x: 50, y: 3 },
      points: [
        { x: 36, y: 0 },
        { x: 62, y: 0 },
        { x: 62, y: 14 },
        { x: 36, y: 14 },
      ],
      t0: 0,
      t1: 5.4,
    },
    { kind: 'pass', from: { x: 39.5, y: 48.5 }, to: { x: 31.5, y: 34 }, t0: 1.5, t1: 2.8 },
    { kind: 'pass', from: { x: 31, y: 33.5 }, to: { x: 31, y: 22.5 }, t0: 2.6, t1: 4.2 },
    { kind: 'pass', from: { x: 31, y: 21.5 }, to: { x: 44.5, y: 7.5 }, t0: 4, t1: 5.6 },
    { kind: 'run', from: { x: 40, y: 9 }, to: { x: 45, y: 7 }, t0: 2.6, t1: 5.4, team: 'us' },
    { kind: 'dribble', from: { x: 45, y: 7 }, to: { x: 57, y: 8 }, t0: 5.4, t1: 8.5 },
    { kind: 'pass', from: { x: 57.5, y: 8.5 }, to: { x: 61, y: 18.5 }, t0: 8.5, t1: 9.8 },
  ],
  sources: ['coaching-consensus', 'ha-coaching', 'footage'],
  reviewed: false,
};
