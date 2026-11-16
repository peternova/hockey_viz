import type { Play } from '../../engine/types';
import { ALL_POSITIONS, ourTeam, theirPlayer } from '../formations';
import { rect } from './helpers';

/**
 * S2: the whole team slides across together as the opposition moves the ball
 * from one side to the other. Nearest player presses, far side tucks in.
 */
export const s2Shifting: Play = {
  id: 's2-shifting',
  title: 'Shifting as a unit when the ball switches sides',
  summary:
    'When they move the ball across the pitch, the whole team slides across together while the ball is travelling, keeping the gaps between players small.',
  category: 'shape',
  featuredRoles: [...ALL_POSITIONS],
  defaultFollow: 'LB',
  players: [
    ...ourTeam(),
    theirPlayer('RM'),
    theirPlayer('RW'),
    theirPlayer('CM'),
    theirPlayer('CF'),
    theirPlayer('LM'),
    theirPlayer('LW'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        GK: { x: 3, y: 25.5 },
        LB: { x: 33, y: 9 },
        LCB: { x: 22, y: 20 },
        RCB: { x: 22, y: 28.5 },
        RB: { x: 26, y: 36 },
        LM: { x: 43, y: 17 },
        CM: { x: 40, y: 25 },
        RM: { x: 42, y: 33 },
        LW: { x: 51, y: 13 },
        CF: { x: 50, y: 24 },
        RW: { x: 50, y: 33 },
        't-RM': { x: 56, y: 12 },
        't-RW': { x: 39, y: 6 },
        't-CF': { x: 34, y: 27 },
        't-CM': { x: 61, y: 26 },
        't-LM': { x: 58, y: 42 },
        't-LW': { x: 42, y: 49 },
      },
      ball: { with: 't-RM' },
    },
    { t: 3, pos: {} },
    {
      t: 4.2,
      pos: {
        't-CM': { x: 60, y: 27 },
        CF: { x: 54, y: 26 },
        LW: { x: 52, y: 15 },
      },
      ball: { with: 't-CM' },
    },
    {
      t: 5.2,
      pos: {
        CF: { x: 55, y: 27 },
        't-CM': { x: 59.5, y: 28 },
        LB: { x: 32, y: 12 },
        LCB: { x: 22, y: 22.5 },
        RCB: { x: 22, y: 31 },
        RB: { x: 27, y: 39 },
        LM: { x: 43, y: 19.5 },
        CM: { x: 40, y: 27.5 },
        RM: { x: 42, y: 36 },
        RW: { x: 51, y: 36 },
        LW: { x: 51, y: 18 },
        GK: { x: 3, y: 27.5 },
      },
    },
    {
      t: 6.6,
      pos: { 't-LM': { x: 57, y: 43 } },
      ball: { with: 't-LM' },
    },
    {
      t: 8.5,
      pos: {
        GK: { x: 3, y: 29.5 },
        LB: { x: 26, y: 19 },
        LCB: { x: 22, y: 26.5 },
        RCB: { x: 22, y: 35 },
        RB: { x: 33, y: 46 },
        LM: { x: 42, y: 22 },
        CM: { x: 40, y: 30 },
        RM: { x: 43, y: 38 },
        LW: { x: 50, y: 22 },
        CF: { x: 51, y: 31 },
        RW: { x: 52, y: 42 },
        't-LM': { x: 56, y: 43.5 },
        't-LW': { x: 40, y: 50 },
        't-RW': { x: 41, y: 8 },
        't-CF': { x: 35, y: 31 },
        't-CM': { x: 58, y: 29 },
        't-RM': { x: 57, y: 14 },
      },
    },
    { t: 11, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3,
      title: 'Ball on our left: the team leans left',
      caption:
        'Their right midfielder has the ball on our left. Our nearest player (the left wing) pressures it. Everyone else slides towards the ball and stays close together: about 10–15 m between team-mates. The right-side players tuck in towards the middle.',
      think: 'Their left wing is free on the far side. Why doesn’t our right back go out to mark them?',
    },
    {
      t0: 3,
      t1: 5.2,
      title: 'Ball back to the middle: shuffle with it',
      caption:
        'They pass back to their centre half. Our centre forward pressures and blocks the easy pass forward. The rest of the team shuffles back towards the middle, a few steps at a time, still facing the ball.',
    },
    {
      t0: 5.2,
      t1: 8.5,
      title: 'The switch: slide while the ball travels',
      caption:
        'They switch it to their left midfielder. This is the moment to move: everyone slides across together while the ball is in the air or rolling, not after it arrives. The right wing becomes the presser; the left-side players become the far side and tuck in.',
    },
    {
      t0: 8.5,
      t1: 11,
      title: 'Same shape, mirrored',
      caption:
        'We’re back to the same compact shape, now leaning right. The right back steps out to their winger, the centre backs slide across behind, and the left back tucks in to cover the middle.',
      think: 'You’re the left back now. Are you marking their right wing out wide, or guarding the space in front of goal?',
    },
  ],
  annotations: [
    {
      kind: 'zone',
      tone: 'space',
      label: 'Far side: OK to leave',
      labelAt: { x: 40, y: 52 },
      points: rect(24, 42, 56, 55),
      t0: 0,
      t1: 3,
    },
    { kind: 'pass', from: { x: 56, y: 12.5 }, to: { x: 60, y: 26.5 }, t0: 3, t1: 4.4 },
    { kind: 'pass', from: { x: 59.5, y: 28 }, to: { x: 57, y: 42.5 }, t0: 5.2, t1: 6.8 },
    { kind: 'run', from: { x: 27, y: 39 }, to: { x: 33, y: 46 }, t0: 5.2, t1: 8.5, team: 'us' },
    { kind: 'run', from: { x: 32, y: 12 }, to: { x: 26, y: 19 }, t0: 5.2, t1: 8.5, team: 'us' },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Far side: OK to leave',
      labelAt: { x: 40, y: 2.6 },
      points: rect(24, 0, 56, 12),
      t0: 8.5,
      t1: 11,
    },
  ],
  sources: ['coaching-consensus', 'ha-coaching', 'footage'],
  reviewed: false,
};
