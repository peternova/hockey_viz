import { along, strip } from '../engine/geometry';
import type { BallState, PlayerDef, PositionId, Vec } from '../engine/types';
import { ourTeam, theirPlayer } from './formations';
import { rect, ring } from './plays/helpers';

/*
 * "Where should I be?" situations and rules true/false questions.
 *
 * Coordinates are pitch metres as everywhere else: x 0 → 91.4 towards the goal
 * we attack, y 0 (our left) → 55 (our right). Our players' ids are position
 * ids ("LB"); theirs are "t-<position>", mirrored so their left wing plays on
 * our right.
 */

export interface WhereQuestion {
  id: string;
  title: string;
  /** The player you move. */
  you: PositionId;
  /** The situation, in the second person. */
  prompt: string;
  /** Everyone on the pitch. Your entry is where your token starts. */
  pos: Record<string, Vec>;
  ball: BallState;
  answer: {
    /** The good area: anywhere in here is "spot on". */
    zone: Vec[];
    /** The best single spot, shown as a ghost token on reveal. */
    ideal: Vec;
  };
  /** Metres outside the zone that still count as "close" (default 4). */
  near?: number;
  explain: string;
  /** FIH Rules of Hockey 2027 reference, when a rule shapes the answer. */
  rule?: string;
  plays?: string[];
  terms?: string[];
  variesByCoach?: string;
  sources: string[];
  reviewed: boolean;
}

export const DEFAULT_NEAR = 4;

/** Player definitions for a situation, built from its position ids. */
export function wherePlayers(q: WhereQuestion): PlayerDef[] {
  return Object.keys(q.pos).map((id) =>
    id.startsWith('t-') ? theirPlayer(id.slice(2) as PositionId) : ourTeam([id as PositionId])[0],
  );
}

const OUR_GOAL: Vec = { x: 0, y: 27.5 };

/* GK: their centre forward is through, ball slightly to our right. */
const GK_BALL: Vec = { x: 16.1, y: 33.15 };

export const WHERE_QUESTIONS: WhereQuestion[] = [
  {
    id: 'w-lb-far-side',
    title: 'Their free hit on our 23, far side',
    you: 'LB',
    prompt:
      'They have a free hit on our 23 m line, out on our right. You’re the left back, on the far side, still up where you were when we had the ball. Where should you be?',
    pos: {
      GK: { x: 2.5, y: 30.5 },
      RB: { x: 12.6, y: 41.2 },
      RCB: { x: 11.2, y: 27.6 },
      LCB: { x: 11.5, y: 22.5 },
      RM: { x: 26.5, y: 41.5 },
      CM: { x: 25.5, y: 30 },
      LM: { x: 27.5, y: 16.5 },
      CF: { x: 36, y: 34 },
      LW: { x: 38, y: 18 },
      RW: { x: 32, y: 45 },
      LB: { x: 24, y: 7 },
      't-LM': { x: 24.2, y: 47.2 },
      't-LW': { x: 15, y: 44 },
      't-CF': { x: 14.5, y: 29 },
      't-RW': { x: 17, y: 11 },
      't-CM': { x: 29.5, y: 30 },
      't-RM': { x: 31, y: 15 },
      't-LB': { x: 36, y: 50 },
    },
    ball: { at: { x: 22.9, y: 46 } },
    answer: { zone: rect(8.5, 13, 17, 21), ideal: { x: 12.5, y: 16.5 } },
    explain:
      'Tuck in and drop. With the ball on the far side, the danger is the middle of our circle, not your winger out wide. Get goal-side of their right wing and narrow enough to cover the back post. You can still step out to the winger if they switch the ball, because you move while the ball travels. Up and wide, you leave a gap behind our centre backs and their winger is free at the back post.',
    plays: ['d2-cover-balance', 's2-shifting'],
    terms: ['goal-side', 'cover', 'compact'],
    sources: ['coaching-consensus', 'ha-coaching'],
    reviewed: false,
  },
  {
    id: 'w-rm-show',
    title: 'Our centre back has the ball',
    you: 'RM',
    prompt:
      'Our right centre back has the ball near our 23 and wants to pass forward. Their forwards are pressing. You’re the right midfielder, standing high up behind their midfield. Where do you show for the pass?',
    pos: {
      GK: { x: 6, y: 27.5 },
      LCB: { x: 19, y: 22 },
      RCB: { x: 21, y: 33 },
      LB: { x: 26, y: 7 },
      RB: { x: 27, y: 51 },
      CM: { x: 35, y: 25 },
      LM: { x: 37, y: 12 },
      CF: { x: 60, y: 30 },
      LW: { x: 58, y: 10 },
      RW: { x: 59.5, y: 49 },
      RM: { x: 47, y: 48 },
      't-CF': { x: 30, y: 29 },
      't-LW': { x: 31, y: 44 },
      't-RW': { x: 31, y: 14 },
      't-LM': { x: 45, y: 42 },
      't-CM': { x: 44, y: 28 },
      't-RM': { x: 45, y: 15 },
      't-LB': { x: 56, y: 46 },
    },
    ball: { with: 'RCB' },
    answer: { zone: rect(33, 34, 40, 43), ideal: { x: 37, y: 39 } },
    explain:
      'Come back towards the ball, into the gap between their forwards and their midfielders. Stand at an angle so the pass doesn’t go through their left wing, and open your body so you can see forward when it arrives. Up behind their midfield you were hiding: a pass to you would have to get past two of their players.',
    plays: ['b4-leading', 'b3-triangles'],
    terms: ['lead', 'support', 'triangle'],
    sources: ['coaching-consensus', 'ha-coaching'],
    reviewed: false,
  },
  {
    id: 'w-cf-counter-press',
    title: 'We’ve just lost the ball',
    you: 'CF',
    prompt:
      'Our centre half’s pass has just been intercepted in midfield, behind you. You’re the centre forward and you’re the nearest forward to the ball. Where should you be in the next two seconds?',
    pos: {
      LCB: { x: 36, y: 22 },
      RCB: { x: 36, y: 33 },
      LB: { x: 44, y: 8 },
      RB: { x: 44, y: 47 },
      CM: { x: 52, y: 25 },
      LM: { x: 55, y: 13 },
      RM: { x: 55, y: 41 },
      LW: { x: 70, y: 10 },
      RW: { x: 70, y: 45 },
      CF: { x: 68, y: 32 },
      't-CM': { x: 57, y: 27 },
      't-LCB': { x: 72, y: 33 },
      't-RCB': { x: 72, y: 21 },
      't-LB': { x: 66, y: 47 },
      't-RB': { x: 66, y: 8 },
      't-LM': { x: 49, y: 40 },
      't-RM': { x: 49, y: 15 },
      't-CF': { x: 42, y: 29 },
    },
    ball: { with: 't-CM' },
    answer: { zone: ring({ x: 58.5, y: 27.5 }, 4.5), ideal: { x: 60.2, y: 27.8 } },
    explain:
      'Counter-press. You’re the nearest forward, so hunt the ball straight away, for about five seconds. The player who has just won it has their head down and their team is spread out. Coming from behind, you cut off the easy pass back to their defenders and make them rush, while our centre half blocks the way forward. If we haven’t won it back in a few seconds, recover to the midfield line.',
    plays: ['t2-recover', 'd4-pressing'],
    terms: ['counter-press', 'turnover', 'transition'],
    sources: ['coaching-consensus', 'fih-academy'],
    reviewed: false,
  },
  {
    id: 'w-cf-pc-post',
    title: 'Our penalty corner: on the post',
    you: 'CF',
    prompt:
      'Our penalty corner. The ball has just been stopped at the top of the circle and the drag flick is coming. You’re our post player. Where should you be?',
    pos: {
      RW: { x: 90, y: 38.5 },
      CM: { x: 76.3, y: 29.1 },
      RCB: { x: 73.5, y: 26 },
      LM: { x: 77, y: 17 },
      RM: { x: 73.5, y: 33.5 },
      LW: { x: 85, y: 37 },
      LB: { x: 57, y: 12 },
      LCB: { x: 56, y: 23.5 },
      RB: { x: 57, y: 43 },
      CF: { x: 82.5, y: 12.5 },
      't-GK': { x: 89.6, y: 27.6 },
      't-LCB': { x: 84, y: 29 },
      't-RCB': { x: 91.1, y: 24.2 },
      't-LB': { x: 88.5, y: 32.5 },
      't-RB': { x: 89.3, y: 19.6 },
      't-CM': { x: 54, y: 27.5 },
      't-LM': { x: 54, y: 37 },
      't-RM': { x: 54, y: 18 },
    },
    ball: { with: 'CM' },
    answer: { zone: rect(84, 18.5, 89.5, 24.3), ideal: { x: 85.8, y: 21.6 } },
    explain:
      'Get to the far post (the one away from the injector), a few metres out and just wide of the shot’s path. Plenty of corner goals come from deflections and rebounds there. Keep your stick down and stay out of the shooter’s line. Don’t run across or block the goalkeeper or defenders: that’s obstruction.',
    rule: '9.12',
    plays: ['p2-pc-attack'],
    terms: ['penalty-corner', 'deflection', 'post', 'third-party-obstruction'],
    variesByCoach: 'Some teams put a player on both posts, or send the post player in only for the slip and deflection options.',
    sources: ['coaching-consensus', 'fih-2027'],
    reviewed: false,
  },
  {
    id: 'w-cb-first-runner',
    title: 'Their penalty corner: first runner',
    you: 'RCB',
    prompt:
      'Their penalty corner. You’re our first runner, starting behind the back-line beside the goalkeeper. The ball has been injected and is about to be stopped. Where do you need to be when they trap it?',
    pos: {
      GK: { x: 2.6, y: 27.2 },
      LCB: { x: 0.4, y: 30.6 },
      LB: { x: 4.5, y: 21 },
      RB: { x: 4.5, y: 34 },
      LM: { x: 40, y: 17 },
      CM: { x: 40, y: 27.5 },
      RM: { x: 40, y: 38 },
      LW: { x: 48, y: 8 },
      CF: { x: 49, y: 33 },
      RW: { x: 48, y: 48 },
      RCB: { x: -0.7, y: 23.6 },
      't-CM': { x: 15.1, y: 26.4 },
      't-RCB': { x: 18, y: 29.4 },
      't-LW': { x: 6.5, y: 15.5 },
      't-CF': { x: 6.5, y: 38.5 },
      't-RW': { x: 1, y: 11 },
      't-LM': { x: 14.5, y: 38 },
      't-RM': { x: 14.4, y: 17 },
    },
    ball: { with: 't-CM' },
    answer: { zone: rect(6, 24.4, 10.5, 29.2), ideal: { x: 7.8, y: 26.7 } },
    explain:
      'Sprint straight at the ball as soon as it’s played, on the line between the ball and the middle of the goal. You want to be 5 to 8 m from the stopper when they trap it, so the shooter has to hurry or shoot around you. You can’t cross the back-line until the ball is played. Stay on your feet with your stick down: running into the shot without trying to play the ball is dangerous play.',
    rule: '13.3 h, 13.3 m',
    plays: ['p3-pc-defence'],
    terms: ['first-runner', 'penalty-corner', 'pc-equipment'],
    variesByCoach: 'Who runs first, and the exact line, changes with the opposition’s best shot (a drag flick or a hit) and your team’s plan.',
    sources: ['coaching-consensus', 'fih-2027'],
    reviewed: false,
  },
  {
    id: 'w-lw-trap',
    title: 'Full press: the trap',
    you: 'LW',
    prompt:
      'We’re full pressing. Their centre back has just passed wide to their right back, on our left near their 23. You’re the left wing, standing narrow. Where do you go?',
    pos: {
      LCB: { x: 44, y: 22 },
      RCB: { x: 44, y: 33 },
      LB: { x: 50, y: 10 },
      RB: { x: 50, y: 44 },
      CM: { x: 58, y: 24 },
      LM: { x: 62, y: 6.5 },
      RM: { x: 60, y: 38 },
      CF: { x: 75, y: 17 },
      RW: { x: 72, y: 40 },
      LW: { x: 63, y: 21 },
      't-RB': { x: 70, y: 5 },
      't-RCB': { x: 79, y: 20 },
      't-LCB': { x: 78, y: 34 },
      't-LB': { x: 70, y: 49 },
      't-RM': { x: 57, y: 11.5 },
      't-CM': { x: 61, y: 28 },
      't-LM': { x: 57, y: 43 },
      't-GK': { x: 89, y: 27.5 },
      't-CF': { x: 46, y: 28 },
    },
    ball: { with: 't-RB' },
    answer: { zone: rect(66, 7, 73.5, 13), ideal: { x: 69.5, y: 9.3 } },
    explain:
      'That pass wide is the trigger. Close down their right back from the inside, at an angle that shows them the side-line. The side-line is an extra defender: our left mid blocks the pass down the line and our centre forward cuts off the pass back, so they’re trapped. Go hard, but arrive under control with your stick low so they can’t just go round you.',
    plays: ['d4-pressing', 'd1-channelling'],
    terms: ['trigger', 'trap', 'full-press', 'channelling'],
    variesByCoach: 'Teams differ on whether the winger or the midfielder makes this press, and on which side-line they want to trap the ball.',
    sources: ['coaching-consensus', 'fih-academy'],
    reviewed: false,
  },
  {
    id: 'w-lm-balance',
    title: 'We’re attacking down the right',
    you: 'LM',
    prompt:
      'We’re attacking down the right: our right wing has the ball near their 23. You’re the left midfielder, out wide on the far side, level with our left wing. Where should you be?',
    pos: {
      LCB: { x: 40, y: 22 },
      RCB: { x: 40, y: 33 },
      LB: { x: 51, y: 9.5 },
      RB: { x: 56, y: 50 },
      CM: { x: 54, y: 31 },
      RM: { x: 61, y: 42 },
      RW: { x: 68, y: 48 },
      CF: { x: 76, y: 30 },
      LW: { x: 74, y: 10 },
      LM: { x: 69, y: 6 },
      't-LB': { x: 72, y: 45 },
      't-LCB': { x: 80, y: 34 },
      't-RCB': { x: 80, y: 22 },
      't-RB': { x: 76, y: 13 },
      't-LM': { x: 64, y: 40 },
      't-CM': { x: 65, y: 30 },
      't-RM': { x: 63, y: 17 },
      't-CF': { x: 49, y: 27 },
      't-LW': { x: 48, y: 41 },
      't-RW': { x: 48, y: 13 },
    },
    ball: { with: 'RW' },
    answer: { zone: rect(52, 17, 63, 27), ideal: { x: 57.5, y: 22.5 } },
    explain:
      'Tuck in. With the ball on the far side, our left wing holds the width for a switch, so you don’t need to. Come infield into the left inside channel, a little behind the ball. From there you’re the next pass if the right side gets crowded, you can arrive at the top of the circle, and if we lose it you’re already between their midfield and our goal. That’s balance.',
    plays: ['s2-shifting', 'b2-switch', 'd2-cover-balance'],
    terms: ['balance', 'switch', 'width', 'corridor'],
    sources: ['coaching-consensus', 'ha-coaching'],
    reviewed: false,
  },
  {
    id: 'w-cb-cover',
    title: 'Our left back has been beaten',
    you: 'LCB',
    prompt:
      'Their right wing has gone past our left back and is dribbling down our left towards our 23. You’re the left centre back. Where should you be?',
    pos: {
      GK: { x: 2.5, y: 27.5 },
      RCB: { x: 17.5, y: 30.5 },
      RB: { x: 21, y: 44 },
      LB: { x: 34, y: 7 },
      LM: { x: 41, y: 18 },
      CM: { x: 34, y: 27 },
      RM: { x: 35, y: 40 },
      CF: { x: 55, y: 28 },
      LW: { x: 52, y: 12 },
      RW: { x: 52, y: 44 },
      LCB: { x: 16, y: 22 },
      't-RW': { x: 29, y: 8.5 },
      't-CF': { x: 21, y: 30 },
      't-LW': { x: 25, y: 46 },
      't-RM': { x: 40, y: 13 },
      't-CM': { x: 42, y: 28 },
      't-LM': { x: 40, y: 42 },
    },
    ball: { with: 't-RW' },
    answer: { zone: rect(20, 9.5, 27, 17), ideal: { x: 23.5, y: 12.3 } },
    explain:
      'Step across and cover. Get goal-side of the ball, 3 to 5 m away, on the line between the attacker and our goal, so they can’t cut inside to the circle. Slow them down and show them towards the side-line, where they’re less dangerous. Don’t dive in: if you miss, they’re in our circle. Our right centre back tucks across behind you (balance) and our left back sprints back to help.',
    plays: ['d2-cover-balance', 'd1-channelling', 'd5-defending-2v1'],
    terms: ['cover', 'balance', 'channelling', 'delay', 'goal-side'],
    sources: ['coaching-consensus', 'ha-coaching'],
    reviewed: false,
  },
  {
    id: 'w-rw-counter',
    title: 'We’ve just won the ball',
    you: 'RW',
    prompt:
      'Our right midfielder has just intercepted a pass near halfway, and they had lots of players forward. You’re the right wing. Where should you be running to?',
    pos: {
      RM: { x: 39.5, y: 43.5 },
      CM: { x: 38, y: 28 },
      LM: { x: 40, y: 17 },
      RB: { x: 28, y: 44 },
      CF: { x: 55, y: 28 },
      LW: { x: 52, y: 14 },
      RW: { x: 50, y: 37 },
      't-LM': { x: 45, y: 40 },
      't-LW': { x: 34, y: 48.5 },
      't-CM': { x: 51, y: 31 },
      't-LCB': { x: 60, y: 33 },
      't-RCB': { x: 60, y: 21 },
      't-LB': { x: 52, y: 48 },
      't-GK': { x: 89.5, y: 27.5 },
    },
    ball: { with: 'RM' },
    answer: { zone: rect(57, 38.5, 70, 52), ideal: { x: 61.5, y: 45 } },
    explain:
      'Sprint forward into the space down the right, beyond their left back. When we win it their team is spread out and facing the wrong way, so one early pass into space can take four of them out of the game. Stay wide enough to stretch their recovering defenders, and look over your shoulder for the pass.',
    plays: ['t1-counter'],
    terms: ['counter-attack', 'transition', 'turnover', 'width'],
    sources: ['coaching-consensus', 'fih-academy'],
    reviewed: false,
  },
  {
    id: 'w-ch-shift',
    title: 'They’ve switched it to our right',
    you: 'CM',
    prompt:
      'They’ve just switched the ball to their left wing, near halfway on our right. Our right mid is going to close them down. You’re the centre half, still over on the left where the ball was. Where should you be?',
    pos: {
      GK: { x: 3, y: 29 },
      LB: { x: 28, y: 16 },
      LCB: { x: 24, y: 25 },
      RCB: { x: 24, y: 33 },
      RB: { x: 30, y: 45 },
      LM: { x: 40, y: 24 },
      RM: { x: 43, y: 46 },
      LW: { x: 52, y: 22 },
      CF: { x: 51, y: 33 },
      RW: { x: 53, y: 45 },
      CM: { x: 36, y: 20 },
      't-LW': { x: 47, y: 50 },
      't-LM': { x: 52, y: 40 },
      't-CM': { x: 56, y: 27 },
      't-RM': { x: 52, y: 14 },
      't-CF': { x: 37, y: 29.5 },
      't-RW': { x: 40, y: 11 },
    },
    ball: { with: 't-LW' },
    answer: { zone: rect(35, 32, 43, 40), ideal: { x: 39.5, y: 36.5 } },
    explain:
      'Shift across with the ball. The whole team slides towards the ball side and you move with it, staying between the ball and our goal. From here you can cover our right mid if they get past, and you block the pass inside to their midfielders. Our left mid tucks in behind you to fill the middle. A gap between you and the right mid is exactly where they want to pass.',
    plays: ['s2-shifting', 'd2-cover-balance'],
    terms: ['shape', 'compact', 'cover'],
    sources: ['coaching-consensus', 'ha-coaching'],
    reviewed: false,
  },
  {
    id: 'w-gk-angle',
    title: 'Their centre forward is through',
    you: 'GK',
    prompt:
      'Their centre forward has broken through and is about to dribble into our circle, a little to our right. Nobody can catch them. You’re the goalkeeper, on your line. Where should you stand?',
    pos: {
      RCB: { x: 24, y: 31 },
      LCB: { x: 26, y: 21 },
      RB: { x: 30, y: 44 },
      GK: { x: 0.6, y: 24.5 },
      't-CF': { x: 17, y: 33.5 },
      't-LW': { x: 28, y: 47 },
      't-RW': { x: 30, y: 11 },
    },
    ball: { with: 't-CF' },
    answer: { zone: strip(OUR_GOAL, GK_BALL, 2, 5.5, 1.1), ideal: along(OUR_GOAL, GK_BALL, 3.5) },
    near: 1.5,
    explain:
      'Come off your line towards the ball to cut down the angle: about 3 to 4 m out, on the line between the ball and the middle of the goal. You cover far more of the goal from there, but you’re not so far out that they can go round you or lift it over you. Be set, balanced and still, as they shoot, rather than moving.',
    plays: ['d5-defending-2v1'],
    terms: ['goalkeeper', 'circle'],
    variesByCoach: 'How far out to come depends on the keeper and the shooter. Goalkeeper coaches teach this in detail.',
    sources: ['coaching-consensus'],
    reviewed: false,
  },
  {
    id: 'w-rb-outlet',
    title: 'Our free hit, 15 m out',
    you: 'RB',
    prompt:
      'We’ve won a free hit just outside our circle on the right, taken 15 m out from our back-line. Our right centre back is taking it. You’re the right back, standing close to them. Where should you be?',
    pos: {
      GK: { x: 3, y: 27.5 },
      RCB: { x: 13.6, y: 37.4 },
      LCB: { x: 12, y: 22 },
      LB: { x: 20, y: 6 },
      CM: { x: 26, y: 26 },
      LM: { x: 30, y: 12 },
      RM: { x: 30, y: 36 },
      CF: { x: 45, y: 28 },
      LW: { x: 44, y: 8 },
      RW: { x: 44, y: 47 },
      RB: { x: 11, y: 46 },
      't-CF': { x: 20, y: 33 },
      't-LW': { x: 22, y: 40.5 },
      't-RW': { x: 22, y: 15 },
      't-LM': { x: 34, y: 42 },
      't-CM': { x: 34, y: 28 },
      't-RM': { x: 34, y: 14 },
    },
    ball: { at: { x: 14.6, y: 38 } },
    answer: { zone: rect(17, 48.5, 29, 54), ideal: { x: 22, y: 51.5 } },
    explain:
      'Get wide, right on the side-line, and a bit further up the pitch. That stretches their press and opens a clear passing lane down the line, away from the middle of the pitch, where losing the ball is dangerous. Show early with your body open so you can play forward first time. Free hits can be taken quickly, so be there before the taker looks up.',
    rule: '13.1 b',
    plays: ['b1-outlet'],
    terms: ['outlet', 'width', 'free-hit'],
    sources: ['coaching-consensus', 'fih-2027'],
    reviewed: false,
  },
];

export function whereById(id: string): WhereQuestion | undefined {
  return WHERE_QUESTIONS.find((q) => q.id === id);
}

/* ---------------- Rules: true or false ---------------- */

export interface RuleQuestion {
  id: string;
  statement: string;
  answer: boolean;
  /** Shown after answering: what the rule actually says. */
  explain: string;
  /** FIH Rules of Hockey 2027 reference. */
  rule: string;
  /** Glossary term to read more. */
  term?: string;
}

export const RULE_QUESTIONS: RuleQuestion[] = [
  {
    id: 'r-pc-five',
    statement: 'At a penalty corner, up to five defenders, including the goalkeeper, start behind the back-line.',
    answer: true,
    explain: 'Up to five defenders, including the goalkeeper, behind the back-line. Everyone else in their team waits beyond the centre-line until the ball is played.',
    rule: '13.3 f–g',
    term: 'penalty-corner',
  },
  {
    id: 'r-pc-injector',
    statement: 'At a penalty corner, the injector must have both feet on the field.',
    answer: false,
    explain: 'The other way round: the injector must have at least one foot outside the field.',
    rule: '13.3 c',
    term: 'injector',
  },
  {
    id: 'r-pc-leave-circle',
    statement: 'At a penalty corner, a goal can be scored before the ball has left the circle.',
    answer: false,
    explain: 'The ball has to travel outside the circle before a goal can be scored. That’s why it’s stopped at the top of the circle.',
    rule: '13.3 k',
    term: 'penalty-corner',
  },
  {
    id: 'r-pc-hit-height',
    statement: 'At a penalty corner, if the first shot is a hit, it must cross the goal-line no higher than the backboard (460 mm) to count.',
    answer: true,
    explain: 'A first-shot hit must cross the goal-line at no more than 460 mm, the height of the backboard, before any deflection.',
    rule: '13.3 l',
    term: 'backboard',
  },
  {
    id: 'r-pc-flick-height',
    statement: 'A drag flick at a penalty corner can go in at any height, as long as it isn’t dangerous.',
    answer: true,
    explain: 'Flicks, scoops, deflections and second shots can be raised to any height, as long as it isn’t dangerous.',
    rule: '13.3 m',
    term: 'drag-flick',
  },
  {
    id: 'r-pc-subs',
    statement: 'You can make a substitution while a penalty corner is being taken.',
    answer: false,
    explain: 'No substitutions from the award of a penalty corner until it’s completed. The one exception is for an injured or suspended defending goalkeeper.',
    rule: '2.3 a',
    term: 'rolling-subs',
  },
  {
    id: 'r-pc-early',
    statement: 'A defender who breaks over the back-line too early at a penalty corner is sent beyond the centre-line, and can’t be replaced.',
    answer: true,
    explain: 'They go beyond the centre-line, can’t be replaced by another defender, and the corner is taken again with one fewer defender.',
    rule: '13.6 c',
    term: 'first-runner',
  },
  {
    id: 'r-fh-5m',
    statement: 'At a free hit, opponents must be at least 5 m from the ball.',
    answer: true,
    explain: 'Opponents must be at least 5 m away. One who is closer must not interfere with the free hit or try to play the ball.',
    rule: '13.2 b',
    term: 'five-metre-rule',
  },
  {
    id: 'r-fh-23-everyone',
    statement: 'At our free hit inside their 23 m area, our own players must also be 5 m from the ball.',
    answer: true,
    explain: 'For a free hit to the attack inside the 23, everyone except the taker must be at least 5 m from the ball, team-mates included.',
    rule: '13.2 c',
    term: 'five-metre-rule',
  },
  {
    id: 'r-fh-self-pass-circle',
    statement: 'From a free hit inside their 23, you can self-pass and dribble straight into the circle.',
    answer: false,
    explain: 'The ball must travel at least 5 m, or be touched by a defender, before it can go into the circle.',
    rule: '13.2 f',
    term: 'self-pass',
  },
  {
    id: 'r-fh-raised-hit',
    statement: 'You can lift a free hit into the air with a hit.',
    answer: false,
    explain: 'A free hit can be raised straight away with a push, flick or scoop, but not intentionally with a hit.',
    rule: '13.2 e',
    term: 'free-hit',
  },
  {
    id: 'r-fh-15m',
    statement: 'A free hit to the defence within 15 m of its own back-line can be taken up to 15 m out, in line with where the offence happened.',
    answer: true,
    explain: 'It can be moved out to 15 m from the back-line, in line with the offence and parallel to the side-line (the old “16-yard hit”).',
    rule: '13.1 b',
    term: 'free-hit',
  },
  {
    id: 'r-long-corner',
    statement: 'A long corner is taken on the 23 m line, in line with where the ball went over the back-line.',
    answer: true,
    explain: 'When a defender unintentionally plays the ball over the back-line (or the goalkeeper deflects it), play restarts on the 23 m line in line with where it went out.',
    rule: '7.4 b',
    term: 'long-corner',
  },
  {
    id: 'r-centre-pass',
    statement: 'At a centre pass, every player except the passer must be in their own half.',
    answer: true,
    explain: 'Everyone except the player taking it must be in the half they’re defending. The pass can go in any direction.',
    rule: '6.4 b–c',
    term: 'centre-pass',
  },
  {
    id: 'r-score-outside',
    statement: 'A shot from outside the circle counts if it goes straight in.',
    answer: false,
    explain: 'A goal only counts if an attacker played the ball inside the circle and it didn’t go back outside the circle before crossing the goal-line.',
    rule: '8.1',
    term: 'circle',
  },
  {
    id: 'r-backstick',
    statement: 'You may play the ball with the rounded back of the stick.',
    answer: false,
    explain: 'Players must not play the ball with the back of the stick (backstick).',
    rule: '9.5',
    term: 'backstick',
  },
  {
    id: 'r-forehand-edge',
    statement: 'A hard forehand hit with the edge of the stick is allowed.',
    answer: false,
    explain: 'Players must not hit the ball hard on the forehand with the edge of the stick. The rule only covers the forehand side.',
    rule: '9.6',
    term: 'edge',
  },
  {
    id: 'r-aerial-5m',
    statement: 'When an aerial ball is coming down, you must stay 5 m from the player receiving it until they’ve touched it.',
    answer: true,
    explain: 'Players must not approach within 5 m of an opponent receiving a falling raised ball until the receiver has touched it.',
    rule: '9.10',
    term: 'aerial',
  },
  {
    id: 'r-third-party',
    statement: 'You can be penalised for obstruction without having the ball, for example by blocking a defender from tackling a team-mate.',
    answer: true,
    explain: 'Running in front of or blocking an opponent to stop them playing the ball is obstruction, even without the ball. It’s called third-party (or shadow) obstruction.',
    rule: '9.12',
    term: 'third-party-obstruction',
  },
  {
    id: 'r-green-card',
    statement: 'A green card means 2 minutes off the field.',
    answer: true,
    explain: 'A green card is a temporary suspension for 2 minutes of playing time.',
    rule: '14.1 b',
    term: 'green-card',
  },
  {
    id: 'r-yellow-card',
    statement: 'A yellow card is always a 5-minute suspension.',
    answer: false,
    explain: 'A yellow card is a temporary suspension of 5 or 10 minutes of playing time, depending on the offence.',
    rule: '14.1 c',
    term: 'yellow-card',
  },
  {
    id: 'r-bully',
    statement: 'A bully can be taken anywhere on the pitch, including right next to the circle.',
    answer: false,
    explain: 'A bully is taken close to where the ball was, but not within 15 m of the back-line or 5 m of the circle.',
    rule: '6.5 a',
    term: 'bully',
  },
  {
    id: 'r-subs-unlimited',
    statement: 'There’s no limit to how many times a player can be substituted.',
    answer: true,
    explain: 'There’s no limit on how many players are substituted at once, or how often a player goes off and comes back on.',
    rule: '2.3 b',
    term: 'rolling-subs',
  },
];
