import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * D3: the same attacking move against player-to-player marking (a defender is
 * dragged out and the space behind is used) and against zonal marking
 * (runners are passed on and the pass is cut out).
 */
const START = {
  GK: { x: 3, y: 27.5 },
  CM: { x: 48, y: 27 },
  LB: { x: 31, y: 14 },
  LCB: { x: 30, y: 28 },
  RB: { x: 31, y: 41 },
  't-CM': { x: 55, y: 26 },
  't-RW': { x: 37, y: 13 },
  't-CF': { x: 36, y: 28 },
  't-LW': { x: 37, y: 42 },
};

export const d3Marking: Play = {
  id: 'd3-marking',
  title: 'Marking: player-to-player vs zonal',
  summary:
    'The same attack, defended two ways. Follow your attacker everywhere and you can be dragged out of position. Guard a zone and pass runners on, and the shape stays solid, but only if everyone talks.',
  category: 'defence',
  featuredRoles: ['LB', 'LCB', 'RB', 'CM', 'GK'],
  defaultFollow: 'LCB',
  players: [
    ...ourTeam(['GK', 'CM', 'LB', 'LCB', 'RB']),
    theirPlayer('CM'),
    theirPlayer('RW'),
    theirPlayer('CF'),
    theirPlayer('LW'),
  ],
  keyframes: [
    { t: 0, pos: { ...START }, ball: { with: 't-CM' } },
    { t: 2.5, pos: { LB: { x: 33.4, y: 13.6 }, LCB: { x: 32.4, y: 28 }, RB: { x: 33.4, y: 41.6 } } },
    {
      t: 4.6,
      pos: {
        't-CF': { x: 45, y: 31 },
        LCB: { x: 42, y: 30.5 },
        't-RW': { x: 31, y: 20 },
        LB: { x: 30.5, y: 16.5 },
      },
    },
    {
      t: 5.8,
      pos: {
        't-RW': { x: 25, y: 25 },
        LB: { x: 27, y: 21.5 },
        LCB: { x: 43, y: 30 },
        GK: { x: 5, y: 26.5 },
      },
      ball: { with: 't-RW' },
    },
    {
      t: 7,
      pos: { 't-RW': { x: 19, y: 26 }, LB: { x: 23, y: 23.5 }, GK: { x: 7, y: 26.5 } },
    },
    { t: 7.1, pos: {}, ball: { with: 't-CM' } },
    { t: 9.5, pos: { ...START } },
    {
      t: 11.5,
      pos: {
        't-CF': { x: 45, y: 31 },
        CM: { x: 43, y: 30 },
        LCB: { x: 32, y: 26 },
        't-RW': { x: 31, y: 20 },
        LB: { x: 31, y: 16 },
      },
    },
    {
      t: 12.3,
      pos: { 't-RW': { x: 28, y: 23 }, LCB: { x: 29.5, y: 24.5 }, LB: { x: 31, y: 17 } },
    },
    {
      t: 13.2,
      pos: { LCB: { x: 28.5, y: 24 }, 't-RW': { x: 27, y: 23.5 } },
      ball: { with: 'LCB' },
    },
    {
      t: 16,
      pos: { LCB: { x: 33, y: 20 }, LB: { x: 38, y: 12 }, 't-RW': { x: 30, y: 22 }, CM: { x: 44, y: 26 } },
    },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.5,
      title: 'Player-to-player: one each',
      caption:
        'Each defender picks up one attacker and stays goal-side of them. The left back takes their right wing, the left centre back takes their centre forward, the right back takes their left wing. Clear jobs, and nobody is left free.',
    },
    {
      t0: 2.5,
      t1: 5.8,
      title: 'Dragged out of position',
      caption:
        'Their centre forward drops deep towards the ball, and our left centre back follows. That leaves a big hole in the middle of our defence. Their right wing cuts inside into it, and our left back is a step behind.',
      think: 'Who is guarding the space in front of our goal now?',
    },
    {
      t0: 5.8,
      t1: 7,
      title: 'Ball into the gap',
      caption:
        'One pass through the gap and they’re through on goal. Player-to-player marking works well in the circle, but it can be pulled apart by clever movement further out.',
    },
    {
      t0: 7,
      t1: 9.5,
      title: 'Replay: same attack, zonal marking',
      caption:
        'Let’s rewind and defend it a different way. This time each defender guards an area, and picks up whoever comes into it.',
    },
    {
      t0: 9.5,
      t1: 12.3,
      title: 'Pass them on',
      caption:
        'Their centre forward drops deep again. Our left centre back follows only a few steps, then calls “yours!” and our centre half picks them up. Their right wing cuts inside, and our left back passes them on to the left centre back, who is still guarding the middle.',
    },
    {
      t0: 12.3,
      t1: 16,
      title: 'Shape held, pass cut out',
      caption:
        'The same through pass now runs straight into our left centre back. Most teams mix the two: zonal in midfield, tighter player-to-player marking in and around the circle and at set pieces.',
    },
  ],
  annotations: [
    {
      kind: 'zone',
      tone: 'danger',
      label: 'Hole',
      labelAt: { x: 27, y: 29.5 },
      points: [
        { x: 22, y: 21 },
        { x: 34, y: 21 },
        { x: 34, y: 33 },
        { x: 22, y: 33 },
      ],
      t0: 4,
      t1: 7,
    },
    { kind: 'run', from: { x: 36, y: 28 }, to: { x: 45, y: 31 }, t0: 2.5, t1: 4.6, team: 'them' },
    { kind: 'run', from: { x: 37, y: 13 }, to: { x: 25, y: 25 }, t0: 2.5, t1: 5.8, team: 'them' },
    { kind: 'pass', from: { x: 55, y: 26.5 }, to: { x: 25.5, y: 25 }, t0: 4.6, t1: 6 },
    { kind: 'run', from: { x: 36, y: 28 }, to: { x: 45, y: 31 }, t0: 9.5, t1: 11.5, team: 'them' },
    { kind: 'run', from: { x: 37, y: 13 }, to: { x: 28, y: 23 }, t0: 9.5, t1: 12.3, team: 'them' },
    { kind: 'pass', from: { x: 55, y: 26.5 }, to: { x: 29, y: 24 }, t0: 12.3, t1: 13.4 },
  ],
  sources: ['coaching-consensus', 'ha-coaching'],
  reviewed: false,
  variesByCoach:
    'Coaches mix these differently. Some mark player-to-player everywhere in the defensive 23, some play zonal until the ball enters the circle, and some switch depending on the opposition.',
};
