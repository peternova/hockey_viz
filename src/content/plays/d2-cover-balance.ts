import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { ring } from './helpers';

/**
 * D2: pressure, cover and balance in the back four, and how the jobs pass
 * from player to player as the ball moves.
 */
export const d2CoverBalance: Play = {
  id: 'd2-cover-balance',
  title: 'Cover and balance: the three defending jobs',
  summary:
    'The nearest defender pressures the ball, the next one covers behind them, and the far-side defender balances by tucking in. When the ball moves, the jobs move too.',
  category: 'defence',
  featuredRoles: ['LB', 'LCB', 'RCB', 'RB'],
  defaultFollow: 'RCB',
  players: [
    ...ourTeam(['GK', 'LB', 'LCB', 'RCB', 'RB']),
    theirPlayer('LW'),
    theirPlayer('CF'),
    theirPlayer('RW'),
    theirPlayer('LM'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        GK: { x: 3, y: 28.5 },
        RB: { x: 37, y: 44.5 },
        RCB: { x: 31, y: 39 },
        LCB: { x: 30, y: 30 },
        LB: { x: 29, y: 21 },
        't-LW': { x: 42, y: 46 },
        't-CF': { x: 36, y: 31 },
        't-RW': { x: 44, y: 10 },
        't-LM': { x: 50, y: 37 },
      },
      ball: { with: 't-LW' },
    },
    { t: 3.5, pos: {} },
    {
      t: 6,
      pos: {
        't-LW': { x: 35, y: 41 },
        RB: { x: 32, y: 44 },
        RCB: { x: 32.5, y: 40 },
        LCB: { x: 28.5, y: 32.5 },
        LB: { x: 27, y: 24 },
        't-CF': { x: 33, y: 31 },
        GK: { x: 3, y: 29 },
      },
    },
    {
      t: 7.2,
      pos: { 't-LW': { x: 36, y: 41.5 }, 't-LM': { x: 46, y: 36 } },
      ball: { with: 't-LM' },
    },
    {
      t: 9,
      pos: {
        't-RW': { x: 43, y: 12 },
        't-LM': { x: 45, y: 34 },
        LB: { x: 33, y: 16 },
        LCB: { x: 29, y: 27 },
        RCB: { x: 29, y: 35 },
        RB: { x: 31, y: 41.5 },
      },
      ball: { with: 't-RW' },
    },
    {
      t: 10.5,
      pos: {
        LB: { x: 37, y: 13 },
        LCB: { x: 30, y: 19 },
        RCB: { x: 29, y: 28.5 },
        RB: { x: 28, y: 36 },
        GK: { x: 3, y: 26.5 },
        't-CF': { x: 34, y: 28.5 },
        't-LW': { x: 38, y: 44 },
      },
    },
    { t: 13, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3.5,
      title: 'Pressure, cover, balance',
      caption:
        'Their left wing has the ball on our right. The right back is the 1st defender: pressure the ball. The right centre back is the 2nd defender: cover, a few metres behind and inside, ready if the 1st is beaten. The left centre back marks their striker, and the left back is the far-side defender: balance, tucked in to guard the middle.',
    },
    {
      t0: 3.5,
      t1: 6,
      title: 'Beaten? Cover steps in',
      caption:
        'The winger beats our right back on the inside. Because the right centre back was covering, they step straight in and become the new pressure. The right back makes a recovery run goal-side to help. The left centre back slides across to become the new cover, and the left back tucks in further.',
      think: 'Why is the covering defender a few metres back, not right next to the right back?',
    },
    {
      t0: 6,
      t1: 9,
      title: 'The ball switches',
      caption:
        'The winger is stuck and plays it back, and their midfielder switches it to the other side. As the ball travels, everyone slides across together.',
    },
    {
      t0: 9,
      t1: 13,
      title: 'New ball, new jobs',
      caption:
        'Now the left back is the pressure, the left centre back covers, the right centre back takes the striker, and the right back is the balance, tucked in. Same three jobs, different people. Talk constantly: “I’ve got ball!”, “Cover!”, “Tuck in!”.',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'danger', label: '1 Pressure', labelAt: { x: 37, y: 49.5 }, points: ring({ x: 37, y: 44.5 }, 3), t0: 0, t1: 3.5 },
    { kind: 'zone', tone: 'cover', label: '2 Cover', labelAt: { x: 31, y: 34.6 }, points: ring({ x: 31, y: 39 }, 3), t0: 0, t1: 3.5 },
    { kind: 'zone', tone: 'space', label: '3 Balance', labelAt: { x: 29, y: 16.6 }, points: ring({ x: 29, y: 21 }, 3), t0: 0, t1: 3.5 },
    { kind: 'run', from: { x: 37, y: 44.5 }, to: { x: 32, y: 44 }, t0: 3.5, t1: 6, team: 'us' },
    { kind: 'pass', from: { x: 36, y: 41.5 }, to: { x: 46, y: 36 }, t0: 6, t1: 7.4 },
    { kind: 'pass', from: { x: 46, y: 35.5 }, to: { x: 43.5, y: 12 }, t0: 7.2, t1: 9.2 },
    { kind: 'zone', tone: 'danger', label: '1 Pressure', labelAt: { x: 37, y: 8 }, points: ring({ x: 37, y: 13 }, 3), t0: 10.5, t1: 13 },
    { kind: 'zone', tone: 'cover', label: '2 Cover', labelAt: { x: 30, y: 23.4 }, points: ring({ x: 30, y: 19 }, 3), t0: 10.5, t1: 13 },
    { kind: 'zone', tone: 'space', label: '3 Balance', labelAt: { x: 28, y: 40.4 }, points: ring({ x: 28, y: 36 }, 3), t0: 10.5, t1: 13 },
  ],
  sources: ['coaching-consensus', 'ha-coaching'],
  reviewed: false,
};
