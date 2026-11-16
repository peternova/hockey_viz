import type { Play, Vec } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';
import { circleArea } from './helpers';

/**
 * P3: defending a penalty corner. Five behind the back-line (GK, first
 * runner, post, two cover runners), the rest beyond halfway. The flick is
 * saved, the rebound cleared to a forward waiting as the outlet.
 */
const INJECT: Vec = { x: 0.2, y: 15.4 };

export const p3PcDefence: Play = {
  id: 'p3-pc-defence',
  title: 'Penalty corner defence',
  summary:
    'Five defenders behind the back-line, each with one job: the goalkeeper, a first runner who rushes the shooter, a post player, and two runners covering the sides. Everyone else waits beyond halfway.',
  category: 'set-piece',
  featuredRoles: ['GK', 'RCB', 'LCB', 'LB', 'RB', 'CM', 'RW'],
  defaultFollow: 'RCB',
  players: [
    ...ourTeam(),
    { id: 't-RW', team: 'them', label: 'INJ', role: 'RW' },
    { id: 't-CM', team: 'them', label: 'STP', role: 'CM' },
    { id: 't-RCB', team: 'them', label: 'FLK', role: 'RCB' },
    theirPlayer('LM'),
    theirPlayer('RM'),
    theirPlayer('CF'),
    theirPlayer('LW'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        GK: { x: -0.5, y: 27.5 },
        RCB: { x: -0.7, y: 23.6 },
        LCB: { x: -0.7, y: 31.4 },
        LB: { x: -0.8, y: 19.7 },
        RB: { x: -0.8, y: 35.3 },
        LM: { x: 47, y: 16 },
        CM: { x: 47, y: 27.5 },
        RM: { x: 47, y: 39 },
        LW: { x: 48, y: 8 },
        CF: { x: 49, y: 33 },
        RW: { x: 48, y: 48 },
        't-RW': { x: -0.5, y: 15.1 },
        't-CM': { x: 15.2, y: 26.3 },
        't-RCB': { x: 18, y: 29.4 },
        't-LM': { x: 14.5, y: 38 },
        't-RM': { x: 14.4, y: 17 },
        't-CF': { x: 9, y: 42.5 },
        't-LW': { x: 9, y: 12.5 },
      },
      ball: { at: INJECT },
    },
    { t: 3, pos: {} },
    {
      t: 4,
      pos: {
        RCB: { x: 7.5, y: 26.6 },
        GK: { x: 2.6, y: 27.2 },
        LCB: { x: 0.4, y: 30.6 },
        LB: { x: 4.5, y: 21 },
        RB: { x: 4.5, y: 34 },
        LM: { x: 40, y: 17 },
        CM: { x: 40, y: 27.5 },
        RM: { x: 40, y: 38 },
        't-CM': { x: 15.1, y: 26.4 },
        't-LW': { x: 6.5, y: 16 },
        't-CF': { x: 6.5, y: 38 },
        't-RW': { x: 1, y: 16 },
      },
      ball: { with: 't-CM' },
    },
    {
      t: 4.5,
      pos: { 't-RCB': { x: 15.2, y: 27.4 }, RCB: { x: 10, y: 27.2 } },
      ball: { with: 't-RCB' },
    },
    { t: 5, pos: { 't-RCB': { x: 13.2, y: 27.6 }, 't-CM': { x: 16.5, y: 24 }, RCB: { x: 10.4, y: 27.4 }, GK: { x: 2.6, y: 27.4 } } },
    { t: 5.4, pos: { GK: { x: 2.6, y: 27.9 } }, ball: { with: 'GK' } },
    {
      t: 5.9,
      pos: { RB: { x: 5.2, y: 36 }, 't-CF': { x: 6, y: 36.5 } },
      ball: { at: { x: 5.5, y: 37.2 } },
    },
    { t: 6.3, pos: { RB: { x: 5.6, y: 36.8 }, 't-CF': { x: 7.5, y: 34.5 }, 't-RCB': { x: 14.5, y: 30.5 }, RCB: { x: 8.5, y: 25.5 } }, ball: { with: 'RB' } },
    {
      t: 7.2,
      pos: {
        RW: { x: 44, y: 50 },
        CM: { x: 30, y: 28 },
        LM: { x: 30, y: 18 },
        RM: { x: 31, y: 40 },
        RB: { x: 6.5, y: 37.5 },
      },
    },
    {
      t: 8.4,
      pos: { RW: { x: 42, y: 50.5 } },
      ball: { with: 'RW' },
    },
    { t: 10.5, pos: { RW: { x: 52, y: 50 }, CF: { x: 58, y: 30 }, LW: { x: 56, y: 12 } } },
  ],
  steps: [
    {
      t0: 0,
      t1: 3,
      title: 'The set-up: five and the rest',
      caption:
        'Up to five of us, including the goalkeeper, stand behind the back-line with sticks and feet off the field. Everyone else must be beyond halfway (Rule 13.3). Their injector (INJ), stopper (STP) and flicker (FLK) are set around the circle. If a defender crosses the line before the ball is played, they’re sent beyond halfway and we defend with one fewer.',
      think: 'Their shooter (FLK) is at the top. Who has the job of stopping the shot reaching the goal cleanly?',
    },
    {
      t0: 3,
      t1: 4.5,
      title: 'The break',
      caption:
        'The moment the ball is pushed, everyone goes. The first runner sprints straight at the shooter, aiming to get to them before they can shoot. The goalkeeper steps out a couple of metres to narrow the angle, the post player covers the goal-line, and the two other runners cover the sides for slips and deflections. The halfway players sprint back.',
    },
    {
      t0: 4.5,
      t1: 5.9,
      title: 'Shot, save',
      caption:
        'The first runner takes away part of the goal, so the shooter has less to aim at. The goalkeeper is set and makes the save. The ball rebounds wide.',
    },
    {
      t0: 5.9,
      t1: 8.4,
      title: 'Clear it wide, not through the middle',
      caption:
        'Our right-side runner gets to the rebound first and clears it towards the side-line, away from danger. A defender still wearing a face mask may pass immediately from inside our 23, but must take the equipment off before playing on (Rule 13.3 n).',
    },
    {
      t0: 8.4,
      t1: 10.5,
      title: 'The outlet',
      caption:
        'Our forwards stayed up at halfway as outlets. Their defence is short of players after the corner, so a quick clearance to a waiting forward can turn defence into attack.',
    },
  ],
  annotations: [
    { kind: 'zone', tone: 'danger', label: 'Circle', labelAt: { x: 6, y: 40 }, points: circleArea('ours'), t0: 0, t1: 3 },
    { kind: 'pass', from: { x: 0.2, y: 15.4 }, to: { x: 14.9, y: 26.3 }, t0: 3, t1: 4.2, team: 'them' },
    { kind: 'run', from: { x: -0.7, y: 23.6 }, to: { x: 10.4, y: 27.4 }, t0: 3, t1: 5, team: 'us' },
    { kind: 'run', from: { x: 47, y: 27.5 }, to: { x: 30, y: 28 }, t0: 3, t1: 7.2, team: 'us' },
    { kind: 'pass', from: { x: 6.5, y: 37.5 }, to: { x: 41.6, y: 50.2 }, t0: 7.2, t1: 8.6 },
  ],
  sources: ['fih-2027', 'coaching-consensus', 'footage'],
  reviewed: false,
  variesByCoach:
    'Penalty corner defence structures vary a lot: some teams use two runners at the shooter, some send the post player to the other post, and roles change against left- or right-side injections. Your coach will set the exact jobs, and if you’re one of the five, wear the penalty corner protective equipment (face mask, etc.).',
};
