import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * B1: getting out from a defensive free hit 15 m from our back-line when
 * they press the ball side. Forward options are marked, so we go square and
 * switch to the free left back.
 */
export const b1Outlet: Play = {
  id: 'b1-outlet',
  title: 'Outletting from a defensive free hit',
  summary:
    'Their forwards press our free hit near the back-line. The forward passes are marked, so we go square, switch to the free side, and carry it out.',
  category: 'build-up',
  featuredRoles: ['RCB', 'LCB', 'LB', 'RB', 'CM', 'RM', 'LW', 'GK'],
  defaultFollow: 'LB',
  players: [
    ...ourTeam(['GK', 'LB', 'LCB', 'RCB', 'RB', 'LM', 'CM', 'RM', 'LW']),
    theirPlayer('LW'),
    theirPlayer('CF'),
    theirPlayer('RW'),
    theirPlayer('LM'),
    theirPlayer('CM'),
    theirPlayer('RM'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        GK: { x: 3, y: 27.5 },
        RCB: { x: 15, y: 38 },
        LCB: { x: 13, y: 22 },
        LB: { x: 24, y: 8 },
        RB: { x: 27, y: 51 },
        CM: { x: 27, y: 29 },
        RM: { x: 35, y: 44 },
        LM: { x: 37, y: 17 },
        LW: { x: 52, y: 6 },
        't-LW': { x: 24, y: 46 },
        't-CF': { x: 21, y: 34 },
        't-RW': { x: 28, y: 20 },
        't-LM': { x: 38, y: 47 },
        't-CM': { x: 33, y: 30.5 },
        't-RM': { x: 41, y: 15 },
      },
      ball: { with: 'RCB' },
    },
    { t: 2.5, pos: {} },
    {
      t: 4.2,
      pos: {
        RM: { x: 29, y: 43 },
        't-LM': { x: 32, y: 46 },
        CM: { x: 24, y: 31 },
        't-CM': { x: 28, y: 33.5 },
        LB: { x: 22, y: 6 },
        LCB: { x: 14, y: 21 },
      },
    },
    { t: 5, pos: {} },
    {
      t: 6,
      pos: {
        't-CF': { x: 19, y: 28 },
        't-RW': { x: 23, y: 18 },
        LCB: { x: 14.5, y: 20 },
      },
      ball: { with: 'LCB' },
    },
    {
      t: 6.7,
      pos: { 't-CF': { x: 17.5, y: 24 }, 't-RW': { x: 20, y: 17 } },
    },
    {
      t: 7.6,
      pos: { LB: { x: 23, y: 6.5 }, 't-RW': { x: 18.5, y: 16 }, 't-RM': { x: 40, y: 13 } },
      ball: { with: 'LB' },
    },
    {
      t: 10,
      pos: {
        LB: { x: 36, y: 6.5 },
        't-RM': { x: 39, y: 9.5 },
        LW: { x: 46, y: 5 },
        LM: { x: 44, y: 16 },
        't-RW': { x: 24, y: 14 },
        't-CF': { x: 20, y: 24 },
        LCB: { x: 22, y: 20 },
        CM: { x: 30, y: 27 },
        RCB: { x: 18, y: 32 },
      },
    },
    {
      t: 11,
      pos: { LW: { x: 47, y: 5 }, LB: { x: 37, y: 7 } },
      ball: { with: 'LW' },
    },
    {
      t: 13,
      pos: { LW: { x: 54, y: 7 }, LM: { x: 50, y: 15 }, LB: { x: 41, y: 8 } },
    },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.5,
      title: 'Set up the options',
      caption:
        'Their attacker hit the ball over our back-line, so we restart up to 15 m out, in line with where it went off (Rule 7.4 a). The right centre back takes it. The right back holds the width high, the midfielders get ready to lead, and the left centre back stays flat and square as the safe option.',
    },
    {
      t0: 2.5,
      t1: 5,
      title: 'Lead and re-lead',
      caption:
        'The right midfielder leads back towards the ball and the centre half shows inside, but both are followed tightly. Their forwards are pressing our right side hard.',
      think: 'Both forward options are marked. Where is the free player?',
    },
    {
      t0: 5,
      t1: 7.6,
      title: 'Go square, then switch',
      caption:
        'A square pass to the left centre back moves the ball away from the press. Their forwards chase it, so the left centre back moves it on quickly to the left back, who has stayed wide and deep. Don’t dwell on the ball when the press is coming.',
    },
    {
      t0: 7.6,
      t1: 10,
      title: 'Carry into the space',
      caption:
        'The left back has time, so they carry the ball forward into the open space. Their right midfielder has to come across to stop them, and that frees up our left wing.',
    },
    {
      t0: 10,
      t1: 13,
      title: 'Up the line: we’re out',
      caption:
        'The left wing leads back down the line and receives. Their whole press has been beaten with three passes. Coaches call this “playing out from the back” or “outletting”.',
    },
  ],
  annotations: [
    { kind: 'run', from: { x: 35, y: 44 }, to: { x: 29, y: 43 }, t0: 2.5, t1: 5, team: 'us' },
    { kind: 'run', from: { x: 27, y: 29 }, to: { x: 24, y: 31 }, t0: 2.5, t1: 5, team: 'us' },
    { kind: 'pass', from: { x: 15, y: 38 }, to: { x: 14.5, y: 20.5 }, t0: 5, t1: 6.2 },
    { kind: 'pass', from: { x: 14.5, y: 20 }, to: { x: 23, y: 7 }, t0: 6.5, t1: 7.8 },
    { kind: 'dribble', from: { x: 23, y: 6.5 }, to: { x: 36, y: 6.5 }, t0: 7.6, t1: 10 },
    { kind: 'pass', from: { x: 36.5, y: 6.8 }, to: { x: 47, y: 5.2 }, t0: 10, t1: 11.3 },
  ],
  sources: ['fih-2027', 'ha-coaching', 'coaching-consensus'],
  reviewed: false,
};
