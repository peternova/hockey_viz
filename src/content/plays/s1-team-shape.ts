import type { Play } from '../../engine/types';
import { ALL_POSITIONS, F433_NEUTRAL, ourTeam, theirPlayer } from '../formations';

/**
 * S1: how a 4-3-3 changes shape between attack and defence.
 * "Big when we have it, small when they have it."
 */
export const s1TeamShape: Play = {
  id: 's1-team-shape',
  title: 'Team shape: big in attack, small in defence',
  summary:
    'How the whole team spreads out when we have the ball, and squeezes narrow and compact the moment we lose it.',
  category: 'shape',
  featuredRoles: [...ALL_POSITIONS],
  defaultFollow: 'LB',
  players: [...ourTeam(), theirPlayer('LW'), theirPlayer('RW'), theirPlayer('CM'), theirPlayer('CF')],
  keyframes: [
    {
      t: 0,
      pos: {
        ...F433_NEUTRAL,
        't-LW': { x: 46, y: 47 },
        't-RW': { x: 44, y: 10 },
        't-CM': { x: 60, y: 24 },
        't-CF': { x: 48, y: 31 },
      },
      ball: { with: 'CM' },
    },
    { t: 3, pos: {} },
    {
      t: 4.5,
      pos: { RM: { x: 41, y: 42 }, RB: { x: 26, y: 46 }, LB: { x: 26, y: 10 } },
      ball: { with: 'RM' },
    },
    {
      t: 8,
      pos: {
        GK: { x: 8, y: 27.5 },
        LB: { x: 42, y: 9 },
        LCB: { x: 32, y: 21 },
        RCB: { x: 34, y: 34 },
        RB: { x: 50, y: 49 },
        LM: { x: 58, y: 16 },
        CM: { x: 52, y: 29 },
        RM: { x: 63, y: 43 },
        LW: { x: 76, y: 6 },
        CF: { x: 78, y: 25 },
        RW: { x: 80, y: 50 },
        't-LW': { x: 67, y: 44.5 },
        't-RW': { x: 61, y: 12 },
        't-CM': { x: 68, y: 32 },
        't-CF': { x: 58, y: 30 },
      },
    },
    { t: 11, pos: {} },
    { t: 11.6, pos: { 't-LW': { x: 64, y: 43.5 } }, ball: { with: 't-LW' } },
    {
      t: 15,
      pos: {
        GK: { x: 2.5, y: 27.5 },
        LB: { x: 27, y: 21 },
        LCB: { x: 22, y: 28 },
        RCB: { x: 24, y: 35 },
        RB: { x: 31, y: 42 },
        LM: { x: 41, y: 24 },
        CM: { x: 45, y: 32 },
        RM: { x: 52, y: 40.5 },
        LW: { x: 54, y: 21 },
        CF: { x: 58, y: 31 },
        RW: { x: 62, y: 44 },
        't-LW': { x: 56, y: 39 },
        't-RW': { x: 42, y: 11 },
        't-CM': { x: 61, y: 28 },
        't-CF': { x: 37, y: 31 },
      },
    },
    { t: 19, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 3,
      title: 'Starting shape: 4-3-3',
      caption:
        'Four defenders, three midfielders, three forwards. The left, centre and right corridors each have a defender, a midfielder and a forward.',
    },
    {
      t0: 3,
      t1: 8,
      title: 'We have the ball: make the pitch BIG',
      caption:
        'The centre half passes wide to the right midfielder. Everyone spreads out: wingers go out to the side-lines (width), the centre forward leads high (depth), and the wide defenders push up towards halfway.',
    },
    {
      t0: 8,
      t1: 11,
      title: 'Attacking shape: wide and long',
      caption:
        'Spread over the full 55 m, the opposition can’t mark everyone, so gaps open. Note the two centre backs still stay behind the ball as a safety net.',
    },
    {
      t0: 11,
      t1: 15,
      title: 'We lose the ball',
      caption:
        'Their left wing tackles our right midfielder. The nearest players press the ball straight away; everyone else sprints goal-side (between their opponent and our goal).',
      think: 'Watch the left back (highlighted). Should they stay out wide, or come infield? Press Continue to see.',
    },
    {
      t0: 15,
      t1: 19,
      title: 'Defending shape: make the pitch SMALL',
      caption:
        'Narrow and compact, shifted towards the ball. The left back came infield: their winger out wide is far from the ball and not dangerous yet. Space in the middle is dangerous; space out on the far side-line is not.',
    },
  ],
  annotations: [
    {
      kind: 'zone',
      tone: 'space',
      label: 'BIG: wide & long',
      labelAt: { x: 43, y: 37 },
      points: [
        { x: 76, y: 5 },
        { x: 81, y: 51 },
        { x: 49, y: 50.5 },
        { x: 33, y: 35 },
        { x: 31, y: 20 },
        { x: 41, y: 8 },
      ],
      t0: 8,
      t1: 11,
    },
    {
      kind: 'zone',
      tone: 'cover',
      label: 'SMALL & compact',
      labelAt: { x: 38, y: 38.5 },
      points: [
        { x: 55, y: 19.5 },
        { x: 63, y: 45.5 },
        { x: 30, y: 43.5 },
        { x: 21, y: 36 },
        { x: 21, y: 26 },
        { x: 26, y: 19.5 },
      ],
      t0: 15,
      t1: 19,
    },
    { kind: 'run', from: { x: 42, y: 9 }, to: { x: 27, y: 21 }, t0: 11.6, t1: 15 },
  ],
  sources: ['coaching-consensus', 'footage'],
  reviewed: false,
};
