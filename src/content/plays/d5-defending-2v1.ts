import type { Play } from '../../engine/types';
import { ourTeam, theirPlayer } from '../formations';

/**
 * D5: one defender against two attackers. Retreat to buy time, sit between
 * them, fake the tackle, and cut out the pass as help arrives.
 */
export const d5Defending2v1: Play = {
  id: 'd5-defending-2v1',
  title: 'Defending a 2v1',
  summary:
    'Outnumbered? Don’t dive in. Back off to buy time, sit between the two attackers, fake the tackle to make them decide early, and cut out the pass while help races back.',
  category: 'defence',
  featuredRoles: ['LCB', 'RCB', 'LM', 'GK'],
  defaultFollow: 'LCB',
  players: [
    ...ourTeam(['GK', 'LCB', 'RCB', 'LM']),
    theirPlayer('CF'),
    theirPlayer('RW'),
    theirPlayer('LW'),
  ],
  keyframes: [
    {
      t: 0,
      pos: {
        GK: { x: 3, y: 27.5 },
        LCB: { x: 37, y: 22 },
        RCB: { x: 30, y: 38 },
        LM: { x: 56, y: 17 },
        't-CF': { x: 50, y: 26 },
        't-RW': { x: 50, y: 12 },
        't-LW': { x: 40, y: 45 },
      },
      ball: { with: 't-CF' },
    },
    {
      t: 2.5,
      pos: {
        LCB: { x: 33, y: 21 },
        't-CF': { x: 44, y: 25 },
        't-RW': { x: 44, y: 13 },
        LM: { x: 48, y: 18 },
        't-LW': { x: 36, y: 44 },
        RCB: { x: 28, y: 37 },
      },
    },
    {
      t: 5,
      pos: {
        LCB: { x: 30.5, y: 20.5 },
        't-CF': { x: 37.5, y: 24 },
        't-RW': { x: 37.5, y: 13.5 },
        LM: { x: 40, y: 18.5 },
        GK: { x: 4, y: 26 },
      },
    },
    { t: 5.6, pos: { LCB: { x: 32, y: 21.5 }, 't-CF': { x: 36.5, y: 23.8 } } },
    {
      t: 6.5,
      pos: {
        LCB: { x: 32.5, y: 18.5 },
        't-RW': { x: 35, y: 14 },
        't-CF': { x: 35.5, y: 23.5 },
        LM: { x: 37, y: 17 },
      },
      ball: { with: 'LCB' },
    },
    { t: 7.6, pos: { LCB: { x: 33, y: 18 }, LM: { x: 39, y: 15 } } },
    { t: 8.5, pos: { LM: { x: 41, y: 13 } }, ball: { with: 'LM' } },
    {
      t: 10.5,
      pos: { LM: { x: 48, y: 10 }, 't-RW': { x: 40, y: 12 }, 't-CF': { x: 38, y: 21 }, LCB: { x: 33, y: 20 } },
    },
  ],
  steps: [
    {
      t0: 0,
      t1: 2.5,
      title: 'Outnumbered: don’t dive in',
      caption:
        'Two attackers are coming at our left centre back, and our left midfielder is racing back to help. If the defender tackles now and misses, both attackers are through. So the first job is to back off and buy time.',
      think: 'Should the defender tackle the ball carrier straight away?',
    },
    {
      t0: 2.5,
      t1: 5,
      title: 'Sit between them',
      caption:
        'The defender backs off at the same pace as the attackers, staying between the ball carrier and the second attacker, a little closer to the ball. Body side-on, stick low in the passing lane. Every second of delay brings the left mid closer.',
    },
    {
      t0: 5,
      t1: 6.5,
      title: 'Fake, then cut out the pass',
      caption:
        'A quick step towards the ball carrier (a fake tackle) makes them decide early. They pass to the other attacker, and the defender, who was already half in the lane, steps across and intercepts.',
    },
    {
      t0: 6.5,
      t1: 10.5,
      title: 'Help has arrived: move it on',
      caption:
        'The left midfielder has recovered and offers an outlet. A quick pass and we’re attacking. If the pass hadn’t come, the defender would keep delaying and let the goalkeeper deal with a shot from a tight angle.',
    },
  ],
  annotations: [
    { kind: 'run', from: { x: 56, y: 17 }, to: { x: 40, y: 18.5 }, t0: 0, t1: 5, team: 'us' },
    {
      kind: 'zone',
      tone: 'danger',
      label: 'Passing lane',
      labelAt: { x: 36, y: 10.2 },
      points: [
        { x: 36.5, y: 22.5 },
        { x: 37.5, y: 23.5 },
        { x: 36.5, y: 14.5 },
        { x: 35.5, y: 14 },
      ],
      t0: 3.5,
      t1: 6.5,
    },
    { kind: 'pass', from: { x: 35.6, y: 23 }, to: { x: 32.6, y: 18.8 }, t0: 5.6, t1: 6.6 },
    { kind: 'pass', from: { x: 33.4, y: 17.6 }, to: { x: 40.8, y: 13.3 }, t0: 7.6, t1: 8.7 },
  ],
  sources: ['coaching-consensus', 'ha-coaching'],
  reviewed: false,
  variesByCoach:
    'Some coaches teach “always play the ball carrier and force them wide”, others “sit in the passing lane and let the goalkeeper take the shooter”. Inside the circle, agree with your goalkeeper who takes the ball and who takes the pass.',
};
