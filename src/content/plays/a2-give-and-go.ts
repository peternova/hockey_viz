import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { inTheirGoal } from './helpers';

/**
 * A2: give-and-go (one-two). The left midfielder draws the defender, passes
 * to the centre forward, sprints past, and gets it straight back.
 */
export const a2GiveAndGo: Play = {
  id: 'a2-give-and-go',
  title: 'Give-and-go (one-two)',
  summary:
    'Draw the defender, pass to a team-mate at an angle, sprint past the defender, and get the ball straight back into space.',
  category: 'attack',
  featuredRoles: ['LM', 'CF', 'LW', 'CM'],
  defaultFollow: 'LM',
  players: [
    ...ourTeam(['LM', 'CF', 'LW', 'CM']),
    theirPlayer('RB'),
    { id: 't-CB', team: 'them', label: 'CB', role: 'RCB' },
    theirPlayer('RM'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        LM: { x: 52, y: 18 },
        CF: { x: 66, y: 27 },
        LW: { x: 68, y: 6 },
        CM: { x: 46, y: 30 },
        't-RB': { x: 63, y: 15 },
        't-CB': { x: 71, y: 28 },
        't-RM': { x: 50, y: 24 },
        't-GK': { x: 89.5, y: 27.5 },
      },
      ball: { with: 'LM' },
    },
    {
      t: 2,
      pos: {
        LM: { x: 57.5, y: 17 },
        't-RB': { x: 61, y: 16 },
        CF: { x: 63, y: 23 },
        't-CB': { x: 68, y: 25 },
        't-RM': { x: 53, y: 22 },
      },
    },
    {
      t: 2.8,
      pos: { LM: { x: 58.5, y: 16 }, CF: { x: 62.5, y: 22.5 }, 't-RB': { x: 60.5, y: 17.5 } },
      ball: { with: 'CF' },
    },
    {
      t: 4.2,
      pos: {
        LM: { x: 66, y: 13 },
        't-RB': { x: 61.5, y: 18.5 },
        't-CB': { x: 66, y: 24 },
        LW: { x: 74, y: 7 },
      },
      ball: { with: 'LM' },
    },
    {
      t: 7,
      pos: {
        LM: { x: 79, y: 20 },
        't-RB': { x: 70, y: 18 },
        't-CB': { x: 82, y: 24 },
        CF: { x: 76, y: 28 },
        't-GK': { x: 89.8, y: 26 },
        LW: { x: 84, y: 12 },
        CM: { x: 60, y: 28 },
      },
    },
    {
      t: 7.7,
      pos: { 't-GK': { x: 90, y: 26.5 } },
      ball: { at: inTheirGoal(1.2) },
    },
    { t: 9.5, pos: {} },
  ],
  steps: [
    {
      t0: 0,
      t1: 2,
      title: 'Draw the defender',
      caption:
        'The left midfielder runs at their right back, making them step up to tackle. Meanwhile the centre forward moves into a spot at an angle to the side, so the ball carrier can pass to them.',
    },
    {
      t0: 2,
      t1: 2.8,
      title: 'Give',
      caption:
        'Just before the tackle comes in, the ball goes to the centre forward. Time this pass for when the defender is committed; too early and they can just turn and follow.',
      think: 'The ball has gone. What does the passer do now?',
    },
    {
      t0: 2.8,
      t1: 4.2,
      title: 'Go!',
      caption:
        'Straight away, the left midfielder sprints past the defender, who is still facing the wrong way. The centre forward returns the ball first time into the space ahead of the runner, so they never have to slow down.',
    },
    {
      t0: 4.2,
      t1: 7,
      title: 'Drive into the circle',
      caption:
        'Two passes have taken a defender out of the game. The left mid carries the ball into the circle, where a goal can be scored, while the centre forward follows in for a rebound.',
    },
    {
      t0: 7,
      t1: 9.5,
      title: 'Shoot',
      caption:
        'A shot from inside the circle, aimed at the far side of the goal, away from the goalkeeper. A goal only counts if the ball is played by an attacker inside the circle (Rule 8.1).',
    },
  ],
  annotations: [
    { kind: 'dribble', from: { x: 52, y: 18 }, to: { x: 57.5, y: 17 }, t0: 0, t1: 2 },
    { kind: 'run', from: { x: 66, y: 27 }, to: { x: 63, y: 23 }, t0: 0, t1: 2, team: 'us' },
    { kind: 'pass', from: { x: 58.5, y: 16.6 }, to: { x: 62.3, y: 22 }, t0: 2, t1: 3 },
    { kind: 'run', from: { x: 58.5, y: 16 }, to: { x: 66, y: 13 }, t0: 2.8, t1: 4.2, team: 'us' },
    { kind: 'pass', from: { x: 63, y: 22.2 }, to: { x: 66, y: 13.6 }, t0: 2.8, t1: 4.4 },
    { kind: 'dribble', from: { x: 66, y: 13 }, to: { x: 79, y: 20 }, t0: 4.2, t1: 7 },
  ],
  sources: ['coaching-consensus', 'ha-coaching', 'footage'],
  reviewed: false,
};
