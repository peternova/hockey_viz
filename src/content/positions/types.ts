import type { PositionId, Vec } from '../../engine/types';

/** The 3×3 grid positions plus the goalkeeper. CB covers both centre backs. */
export type GuideId = 'GK' | 'LB' | 'CB' | 'RB' | 'LM' | 'CM' | 'RM' | 'LW' | 'CF' | 'RW';

export type Line = 'forward' | 'midfield' | 'defence' | 'goal';
export type Side = 'left' | 'centre' | 'right';

export interface SetPieceRole {
  name: string;
  role: string;
}

export interface PositionGuide {
  id: GuideId;
  line: Line;
  side: Side;
  name: string;
  /** Other names for the same position (older AU/NZ names, US/UK names). */
  aka: string[];
  oneLiner: string;
  /** Which tokens on the pitch represent this position. */
  roles: PositionId[];
  /** "Where you live" areas (pitch coordinates). Both polygons have the same number of points. */
  zone: { attack: Vec[]; defend: Vec[] };
  zoneNotes: { attack: string; defend: string };
  moments: {
    haveBall: string[];
    theyHaveBall: string[];
    wonIt: string[];
    lostIt: string[];
  };
  setPieces: SetPieceRole[];
  /** How playing on this side of the pitch changes things (stick asymmetry). */
  sideSpecifics: string[];
  keySkills: string[];
  mistakes: string[];
  /** Tips for experienced players: anticipation, positioning, organising, energy. */
  playSmart: string[];
  variesByCoach?: string;
  sources: string[];
  reviewed: boolean;
}

/** Rectangle helper for zones: x from x0→x1 (length), y from y0→y1 (width). */
export function rect(x0: number, x1: number, y0: number, y1: number): Vec[] {
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
}
