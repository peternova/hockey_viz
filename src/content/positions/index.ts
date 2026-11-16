import type { Play, PositionId } from '../../engine/types';
import { PLAYS } from '../plays';
import { centreBack, leftBack, rightBack } from './defence';
import { centreForward, leftWing, rightWing } from './forwards';
import { goalkeeper } from './goalkeeper';
import { centreHalf, leftMid, rightMid } from './midfield';
import type { GuideId, Line, PositionGuide, Side } from './types';

export const GUIDES: PositionGuide[] = [
  leftWing,
  centreForward,
  rightWing,
  leftMid,
  centreHalf,
  rightMid,
  leftBack,
  centreBack,
  rightBack,
  goalkeeper,
];

export function guideById(id: string): PositionGuide | undefined {
  return GUIDES.find((g) => g.id === id);
}

export const GRID_ROWS: { line: Line; label: string }[] = [
  { line: 'forward', label: 'Forwards' },
  { line: 'midfield', label: 'Midfield' },
  { line: 'defence', label: 'Defence' },
];

export const GRID_COLS: { side: Side; label: string }[] = [
  { side: 'left', label: 'Left' },
  { side: 'centre', label: 'Centre' },
  { side: 'right', label: 'Right' },
];

export function guideAt(line: Line, side: Side): PositionGuide | undefined {
  return GUIDES.find((g) => g.line === line && g.side === side);
}

/** The guide that covers a token on the pitch (e.g. LCB → Centre back). */
export function guideForRole(role: PositionId): PositionGuide | undefined {
  return GUIDES.find((g) => g.roles.includes(role));
}

/** Plays that feature any of this position's tokens. */
export function linkedPlays(guide: PositionGuide, plays: Play[] = PLAYS): Play[] {
  return plays.filter((p) => p.featuredRoles.some((r) => guide.roles.includes(r)));
}

export const LINE_LABEL: Record<Line, string> = {
  forward: 'Forward',
  midfield: 'Midfield',
  defence: 'Defence',
  goal: 'Goal',
};

export type { GuideId, PositionGuide };
