import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * B4: the centre forward loses a tight marker by leading one way and then
 * sharply checking back the other (the re-lead), receives, and lays it off.
 */
export const b4Leading: Play = {
  id: 'b4-leading',
  title: 'Leading and re-leading to get free',
  summary:
    'Standing still makes you easy to mark. Take the defender one way, then check back sharply into the space you want. Time the lead for when the passer can see you.',
  category: 'build-up',
  featuredRoles: ['CF', 'LW', 'RW', 'CM', 'RM'],
  defaultFollow: 'CF',
  players: [
    ...ourTeam(['CM', 'RM', 'LM', 'CF', 'RW']),
    { id: 't-CB', team: 'them', label: 'CB', role: 'RCB' },
    theirPlayer('LB'),
    theirPlayer('CM'),
    theirPlayer('GK'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        CM: { x: 46, y: 29 },
        RM: { x: 55, y: 41 },
        LM: { x: 55, y: 15 },
        CF: { x: 70, y: 27 },
        RW: { x: 72, y: 47 },
        't-CB': { x: 73, y: 27.5 },
        't-LB': { x: 75, y: 44 },
        't-CM': { x: 53, y: 30 },
        't-GK': { x: 89.5, y: 27.5 },
      },
      ball: { with: 'CM' },
    },
    { t: 2, pos: { CM: { x: 47, y: 29 } } },
    {
      t: 4,
      pos: {
        CF: { x: 76, y: 34 },
        't-CB': { x: 79, y: 32.5 },
        CM: { x: 49, y: 29 },
        't-CM': { x: 54, y: 31 },
      },
    },
    {
      t: 5.5,
      pos: {
        CF: { x: 66, y: 29 },
        't-CB': { x: 74, y: 32 },
        CM: { x: 50, y: 29 },
        RM: { x: 58, y: 41 },
      },
    },
    {
      t: 6.4,
      pos: { CF: { x: 64.5, y: 28.5 }, 't-CB': { x: 70, y: 30 } },
      ball: { with: 'CF' },
    },
    {
      t: 7.4,
      pos: { CF: { x: 64.5, y: 29 }, 't-CB': { x: 67.8, y: 29.8 }, RM: { x: 63, y: 40 } },
      ball: { with: 'RM' },
    },
    {
      t: 10,
      pos: {
        RM: { x: 71, y: 41 },
        CF: { x: 78, y: 30 },
        't-CB': { x: 74.5, y: 32.5 },
        't-LB': { x: 76, y: 42 },
        RW: { x: 78, y: 49 },
      },
    },
  ],
  steps: [
    {
      t0: 0,
      t1: 2,
      title: 'Marked tight',
      caption:
        'Our centre forward is standing still with their centre back right behind. A pass now would be intercepted or tackled from behind. The centre half is ready to pass, but there’s no one to pass to.',
      think: 'How can the centre forward get a metre or two of space?',
    },
    {
      t0: 2,
      t1: 4,
      title: 'Lead away first',
      caption:
        'The centre forward runs hard towards goal, as if they want the ball in behind. The defender has to follow, because if they don’t, that pass is on. The centre forward is taking the defender away from the space they really want.',
    },
    {
      t0: 4,
      t1: 6.4,
      title: 'Check back: the re-lead',
      caption:
        'Then a sharp stop and a burst back towards the ball, at an angle. The defender is running the wrong way and needs time to turn, so there’s a 4–5 m gap. The centre half passes into the lead, ahead of the forward, as soon as they see the change of direction.',
    },
    {
      t0: 6.4,
      t1: 7.4,
      title: 'Lay it off first time',
      caption:
        'The defender recovers and closes in from behind, so the forward doesn’t try to turn. They lay the ball off first time to the right midfielder running forward.',
    },
    {
      t0: 7.4,
      t1: 10,
      title: 'Spin and go again',
      caption:
        'Having passed, the forward spins and runs back towards goal for the return ball: another lead. Good forwards lead, re-lead and lead again all game. Each lead is short, sharp and timed for when the passer looks up.',
    },
  ],
  annotations: [
    { kind: 'run', from: { x: 70, y: 27 }, to: { x: 76, y: 34 }, t0: 2, t1: 4, team: 'us' },
    { kind: 'run', from: { x: 76, y: 34 }, to: { x: 66, y: 29 }, t0: 4, t1: 5.5, team: 'us' },
    {
      kind: 'zone',
      tone: 'space',
      label: 'Gap',
      labelAt: { x: 68.5, y: 26 },
      points: [
        { x: 64, y: 25 },
        { x: 72, y: 25 },
        { x: 72, y: 33 },
        { x: 64, y: 33 },
      ],
      t0: 5,
      t1: 6.4,
    },
    { kind: 'pass', from: { x: 50.5, y: 29 }, to: { x: 64, y: 28.6 }, t0: 5.4, t1: 6.6 },
    { kind: 'pass', from: { x: 64.5, y: 29.2 }, to: { x: 63, y: 39.6 }, t0: 6.4, t1: 7.6 },
    { kind: 'run', from: { x: 64.5, y: 29 }, to: { x: 78, y: 30 }, t0: 7.4, t1: 10, team: 'us' },
  ],
  sources: ['coaching-consensus', 'ha-coaching', 'footage'],
  reviewed: false,
};
