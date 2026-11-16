import type { Play, Vec } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { CENTRE_Y, PITCH } from '../../pitch/coords';
import { ring } from './helpers';

/**
 * P1: a centre pass that goes back to the centre half, out to the left back
 * pushing up, and down the line to the left wing.
 */
const SPOT: Vec = { x: PITCH.length / 2, y: CENTRE_Y };

export const p1CentrePass: Play = {
  id: 'p1-centre-pass',
  title: 'Centre pass options',
  summary:
    'Everyone starts in their own half and the opposition must be 5 m away. The ball can go in any direction, so most teams go back first to draw the press, then out wide.',
  category: 'set-piece',
  featuredRoles: ['CF', 'CM', 'LB', 'LW', 'LM', 'RM'],
  defaultFollow: 'LB',
  players: [
    ...ourTeam(),
    theirPlayer('CF'),
    theirPlayer('LW'),
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
        LB: { x: 30, y: 10 },
        LCB: { x: 24, y: 22 },
        RCB: { x: 24, y: 33 },
        RB: { x: 30, y: 45 },
        LM: { x: 40, y: 15 },
        CM: { x: 39, y: 27.5 },
        RM: { x: 40, y: 40 },
        LW: { x: 44.5, y: 6 },
        CF: { x: 45, y: 27.9 },
        RW: { x: 44.5, y: 49 },
        't-CF': { x: 51.5, y: 27.5 },
        't-LW': { x: 48.5, y: 46 },
        't-RW': { x: 48.5, y: 9 },
        't-LM': { x: 53, y: 38 },
        't-CM': { x: 57, y: 27.5 },
        't-RM': { x: 53, y: 17 },
      },
      ball: { at: SPOT },
    },
    { t: 3, pos: {} },
    {
      t: 4,
      pos: { CF: { x: 45.5, y: 27.5 } },
      ball: { with: 'CF' },
    },
    {
      t: 4.9,
      pos: { CM: { x: 38, y: 27.5 }, CF: { x: 50, y: 26 }, 't-CF': { x: 47, y: 27.5 } },
      ball: { with: 'CM' },
    },
    {
      t: 6.5,
      pos: {
        't-CF': { x: 42, y: 27 },
        't-RM': { x: 45.5, y: 18.5 },
        LM: { x: 48, y: 21 },
        LB: { x: 34, y: 8 },
        CM: { x: 38, y: 26 },
      },
    },
    {
      t: 7.5,
      pos: { LB: { x: 36, y: 7.5 }, 't-RW': { x: 44, y: 10 }, 't-RM': { x: 45, y: 17 } },
      ball: { with: 'LB' },
    },
    {
      t: 9.5,
      pos: {
        LB: { x: 43, y: 7 },
        't-RW': { x: 45.5, y: 10.5 },
        LW: { x: 56, y: 5 },
        LM: { x: 52, y: 20 },
        CF: { x: 60, y: 24 },
      },
    },
    {
      t: 10.5,
      pos: { LW: { x: 55, y: 5 }, LB: { x: 44, y: 7.5 } },
      ball: { with: 'LW' },
    },
    { t: 12.5, pos: { LW: { x: 62, y: 7 }, CF: { x: 66, y: 25 }, LM: { x: 58, y: 18 } } },
  ],
  steps: [
    {
      t0: 0,
      t1: 3,
      title: 'The set-up',
      caption:
        'A centre pass starts each quarter and restarts play after a goal (Rule 6.3). The ball is placed at the centre of the field. Every player except the taker must be in their own half, and the opposition must be 5 m from the ball (Rule 6.4). The ball can go in any direction. Three common options: back to the centre half, square to a midfielder, or long into space.',
    },
    {
      t0: 3,
      t1: 4.9,
      title: 'Back to the centre half',
      caption:
        'The centre forward plays it back to the centre half, then runs forward to join the attack. Their centre forward chases the ball, which is exactly what we want.',
    },
    {
      t0: 4.9,
      t1: 7.5,
      title: 'Out to the free side',
      caption:
        'Their forwards press towards the ball. Our left midfielder moves inside, taking their right midfielder with them, and that opens space for the left back, who pushes up wide to receive.',
    },
    {
      t0: 7.5,
      t1: 10.5,
      title: 'Carry, then up the line',
      caption:
        'The left back carries forward until their wing has to come and close them down, then plays it down the line to our left wing.',
    },
    {
      t0: 10.5,
      t1: 12.5,
      title: 'Into their half',
      caption:
        'We’re into their half with the ball under control. Many teams have two or three rehearsed centre-pass moves and the taker calls one with a number or a word.',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'danger', label: '5 m', labelAt: { x: 45.7, y: 21.2 }, points: ring(SPOT, 5), t0: 0, t1: 3 },
    { kind: 'pass', from: { x: 45.7, y: 27.5 }, to: { x: 39.5, y: 27.5 }, t0: 0, t1: 3 },
    { kind: 'pass', from: { x: 45.7, y: 28 }, to: { x: 40.5, y: 39.5 }, t0: 0, t1: 3 },
    { kind: 'pass', from: { x: 46, y: 28.5 }, to: { x: 66, y: 50 }, t0: 0, t1: 3 },
    { kind: 'pass', from: { x: 45.3, y: 27.5 }, to: { x: 38.5, y: 27.5 }, t0: 3, t1: 5 },
    { kind: 'run', from: { x: 40, y: 15 }, to: { x: 48, y: 21 }, t0: 4.9, t1: 7.5, team: 'us' },
    { kind: 'pass', from: { x: 38.3, y: 26 }, to: { x: 35.6, y: 8 }, t0: 6.5, t1: 7.7 },
    { kind: 'dribble', from: { x: 36, y: 7.5 }, to: { x: 43, y: 7 }, t0: 7.5, t1: 9.5 },
    { kind: 'pass', from: { x: 43.5, y: 7.3 }, to: { x: 54.8, y: 5.3 }, t0: 9.5, t1: 10.7 },
  ],
  sources: ['fih-2027', 'coaching-consensus'],
  reviewed: false,
};
