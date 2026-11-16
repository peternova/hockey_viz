import { PITCH } from '../pitch/coords';
import type { PlayerDef, PositionId, Vec } from '../engine/types';

/** Our 4-3-3 starting shape with the ball in midfield (we attack → x = 91.4). */
export const F433_NEUTRAL: Record<PositionId, Vec> = {
  GK: { x: 3, y: 27.5 },
  LB: { x: 20, y: 10 },
  LCB: { x: 16, y: 22 },
  RCB: { x: 16, y: 33 },
  RB: { x: 20, y: 45 },
  LM: { x: 36, y: 14 },
  CM: { x: 32, y: 27.5 },
  RM: { x: 36, y: 41 },
  LW: { x: 52, y: 8 },
  CF: { x: 56, y: 27.5 },
  RW: { x: 52, y: 47 },
};

/** Typical 4-3-3 shape when we have the ball in their half (ball central). */
export const F433_ATTACK: Record<PositionId, Vec> = {
  GK: { x: 12, y: 27.5 },
  LB: { x: 48, y: 7 },
  LCB: { x: 36, y: 20 },
  RCB: { x: 36, y: 35 },
  RB: { x: 48, y: 48 },
  LM: { x: 60, y: 15 },
  CM: { x: 54, y: 27.5 },
  RM: { x: 60, y: 40 },
  LW: { x: 76, y: 5 },
  CF: { x: 79, y: 27.5 },
  RW: { x: 76, y: 50 },
};

/** Typical compact 4-3-3 shape when they have the ball around halfway. */
export const F433_DEFEND: Record<PositionId, Vec> = {
  GK: { x: 3, y: 27.5 },
  LB: { x: 23, y: 15 },
  LCB: { x: 19, y: 23.5 },
  RCB: { x: 19, y: 31.5 },
  RB: { x: 23, y: 40 },
  LM: { x: 35, y: 17 },
  CM: { x: 32, y: 27.5 },
  RM: { x: 35, y: 38 },
  LW: { x: 47, y: 17 },
  CF: { x: 49, y: 27.5 },
  RW: { x: 47, y: 38 },
};

/** Labels shown on tokens (AU/NZ style short codes). */
export const POSITION_LABEL: Record<PositionId, string> = {
  GK: 'GK',
  LB: 'LB',
  LCB: 'LCB',
  RCB: 'RCB',
  RB: 'RB',
  LM: 'LM',
  CM: 'CH',
  RM: 'RM',
  LW: 'LW',
  CF: 'CF',
  RW: 'RW',
};

export const POSITION_NAME: Record<PositionId, string> = {
  GK: 'Goalkeeper',
  LB: 'Left back',
  LCB: 'Left centre back',
  RCB: 'Right centre back',
  RB: 'Right back',
  LM: 'Left midfield',
  CM: 'Centre half',
  RM: 'Right midfield',
  LW: 'Left wing',
  CF: 'Centre forward',
  RW: 'Right wing',
};

export const ALL_POSITIONS = Object.keys(F433_NEUTRAL) as PositionId[];

/** Our full team as PlayerDefs, ids equal to position ids. */
export function ourTeam(roles: PositionId[] = ALL_POSITIONS): PlayerDef[] {
  return roles.map((r) => ({ id: r, team: 'us', label: POSITION_LABEL[r], role: r }));
}

/** Opposition player: id is "t-<pos>"; they attack towards x = 0. */
export function theirPlayer(role: PositionId): PlayerDef {
  return { id: `t-${role}`, team: 'them', label: POSITION_LABEL[role], role };
}

/** Mirror a position from our half into theirs (for building opposition shapes). */
export function mirror(v: Vec): Vec {
  return { x: PITCH.length - v.x, y: PITCH.width - v.y };
}

/* ---------------- Formations compared ---------------- */

export interface Formation {
  id: 'f433' | 'f3331' | 'f235';
  name: string;
  aka: string;
  /** Glossary term for this formation. */
  term: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  /**
   * Each modern 4-3-3 role mapped to where that player stands in this
   * formation and what they're called there, so tokens can morph between them.
   */
  slots: Record<PositionId, { at: Vec; label: string; name: string }>;
}

export const FORMATIONS: Formation[] = [
  {
    id: 'f433',
    name: '4-3-3',
    aka: 'Back four, three mids, three forwards',
    term: 'formation-433',
    summary:
      'Four defenders in a flat line, three midfielders and three forwards. The default in this app and very common in modern club hockey.',
    strengths: [
      'Balanced: the same number of players in each half of the width.',
      'Four defenders can cover the full width, so the wide backs can push up in attack.',
      'Three forwards can press the opposition’s back line.',
    ],
    weaknesses: [
      'A flat back four can be beaten by a ball in behind if it doesn’t drop together.',
      'Midfielders have a lot of ground to cover.',
    ],
    slots: Object.fromEntries(
      ALL_POSITIONS.map((r) => [r, { at: F433_NEUTRAL[r], label: POSITION_LABEL[r], name: POSITION_NAME[r] }]),
    ) as Formation['slots'],
  },
  {
    id: 'f3331',
    name: '3-3-3-1',
    aka: 'Sweeper system (also written 1-3-3-3)',
    term: 'formation-3331',
    summary:
      'Three forwards, three midfielders, three backs and a sweeper behind them. Usually written front to back. The sweeper is a spare defender who covers whoever is beaten.',
    strengths: [
      'Very safe at the back: there is always a spare defender.',
      'Simple jobs: the three backs mark, the sweeper covers.',
    ],
    weaknesses: [
      'The sweeper often ends up guarding empty space, while the team is a player short further up the pitch.',
      'With one fewer player pushing up, it can be hard to build attacks or press high.',
    ],
    slots: {
      GK: { at: { x: 3, y: 27.5 }, label: 'GK', name: 'Goalkeeper' },
      LCB: { at: { x: 11, y: 27.5 }, label: 'SW', name: 'Sweeper' },
      LB: { at: { x: 21, y: 12 }, label: 'LB', name: 'Left back' },
      RCB: { at: { x: 20, y: 27.5 }, label: 'CB', name: 'Centre back (stopper)' },
      RB: { at: { x: 21, y: 43 }, label: 'RB', name: 'Right back' },
      LM: { at: { x: 36, y: 13 }, label: 'LM', name: 'Left midfield' },
      CM: { at: { x: 34, y: 27.5 }, label: 'CH', name: 'Centre half' },
      RM: { at: { x: 36, y: 42 }, label: 'RM', name: 'Right midfield' },
      LW: { at: { x: 52, y: 8 }, label: 'LW', name: 'Left wing' },
      CF: { at: { x: 56, y: 27.5 }, label: 'CF', name: 'Centre forward' },
      RW: { at: { x: 52, y: 47 }, label: 'RW', name: 'Right wing' },
    },
  },
  {
    id: 'f235',
    name: '2-3-5',
    aka: 'The old style (the “pyramid”)',
    term: 'formation-235',
    summary:
      'Two fullbacks, three halves and five forwards: how hockey was played for most of the 20th century. Many of the position names still used in Australian and NZ clubs come from it.',
    strengths: ['Lots of players in attack.', 'Every forward has a clear lane.'],
    weaknesses: [
      'Only two players at the back, which is very exposed against modern passing.',
      'Today’s game has more players behind the ball, so the halves and inside forwards dropped back over time.',
    ],
    slots: {
      GK: { at: { x: 3, y: 27.5 }, label: 'GK', name: 'Goalkeeper' },
      LCB: { at: { x: 17, y: 19 }, label: 'LFB', name: 'Left fullback' },
      RCB: { at: { x: 17, y: 36 }, label: 'RFB', name: 'Right fullback' },
      LB: { at: { x: 32, y: 10 }, label: 'LH', name: 'Left half' },
      CM: { at: { x: 30, y: 27.5 }, label: 'CH', name: 'Centre half' },
      RB: { at: { x: 32, y: 45 }, label: 'RH', name: 'Right half' },
      LW: { at: { x: 54, y: 5 }, label: 'OL', name: 'Outside left (left wing)' },
      LM: { at: { x: 51, y: 17 }, label: 'IL', name: 'Inside left' },
      CF: { at: { x: 55, y: 27.5 }, label: 'CF', name: 'Centre forward' },
      RM: { at: { x: 51, y: 38 }, label: 'IR', name: 'Inside right' },
      RW: { at: { x: 54, y: 50 }, label: 'OR', name: 'Outside right (right wing)' },
    },
  },
];

/** "What the old names mean today": 2-3-5 name → modern 4-3-3 role. */
export const OLD_NAMES: { old: string; modern: string; roles: PositionId[]; note: string }[] = [
  {
    old: 'Fullbacks (left & right)',
    modern: 'Centre backs',
    roles: ['LCB', 'RCB'],
    note: 'Many AU/NZ clubs still call their central defenders “fullbacks”.',
  },
  {
    old: 'Left half / right half',
    modern: 'Left back / right back',
    roles: ['LB', 'RB'],
    note: 'The wide halves dropped back into the defence. Many clubs still say “left half”.',
  },
  {
    old: 'Centre half',
    modern: 'Centre half (centre mid)',
    roles: ['CM'],
    note: 'The name survived unchanged: still the hub in the middle.',
  },
  {
    old: 'Inside left / inside right (“inners”)',
    modern: 'Left / right midfield (“links”)',
    roles: ['LM', 'RM'],
    note: 'The inside forwards dropped into midfield to link defence and attack.',
  },
  {
    old: 'Outside left / outside right',
    modern: 'Left wing / right wing',
    roles: ['LW', 'RW'],
    note: 'Still wide forwards.',
  },
  {
    old: 'Centre forward',
    modern: 'Centre forward (striker)',
    roles: ['CF'],
    note: 'Unchanged.',
  },
];
