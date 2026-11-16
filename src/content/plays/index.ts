import type { Play } from '../../engine/types';
import { a1Overlap } from './a1-overlap';
import { a2GiveAndGo } from './a2-give-and-go';
import { a3Baseline } from './a3-baseline';
import { a4CircleEntry } from './a4-circle-entry';
import { b1Outlet } from './b1-outlet';
import { b2Switch } from './b2-switch';
import { b3Triangles } from './b3-triangles';
import { b4Leading } from './b4-leading';
import { d1Channelling } from './d1-channelling';
import { d2CoverBalance } from './d2-cover-balance';
import { d3Marking } from './d3-marking';
import { d4Pressing } from './d4-pressing';
import { d5Defending2v1 } from './d5-defending-2v1';
import { p1CentrePass } from './p1-centre-pass';
import { p2PcAttack } from './p2-pc-attack';
import { p3PcDefence } from './p3-pc-defence';
import { p4LongCorner } from './p4-long-corner';
import { p5FreeHit23 } from './p5-free-hit-23';
import { s1TeamShape } from './s1-team-shape';
import { s2Shifting } from './s2-shifting';
import { t1Counter } from './t1-counter';
import { t2Recover } from './t2-recover';

/** In teaching order within each category. */
export const PLAYS: Play[] = [
  s1TeamShape,
  s2Shifting,
  b1Outlet,
  b2Switch,
  b3Triangles,
  b4Leading,
  a1Overlap,
  a2GiveAndGo,
  a3Baseline,
  a4CircleEntry,
  d1Channelling,
  d2CoverBalance,
  d3Marking,
  d4Pressing,
  d5Defending2v1,
  t1Counter,
  t2Recover,
  p1CentrePass,
  p2PcAttack,
  p3PcDefence,
  p4LongCorner,
  p5FreeHit23,
];

export function playById(id: string): Play | undefined {
  return PLAYS.find((p) => p.id === id);
}

export const CATEGORY_LABEL: Record<Play['category'], string> = {
  shape: 'Team shape',
  'build-up': 'Build-up',
  attack: 'Attack',
  defence: 'Defence',
  transition: 'Transition',
  'set-piece': 'Set pieces',
};

export const CATEGORY_ORDER: Play['category'][] = ['shape', 'build-up', 'attack', 'defence', 'transition', 'set-piece'];
