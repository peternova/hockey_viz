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
