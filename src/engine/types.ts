/**
 * Core data model for animated plays.
 *
 * Pitch coordinates are in metres:
 *   x: 0 → 91.4 along the length. "Us" always attack towards x = 91.4.
 *   y: 0 → 55 across the width. Facing our attack, y = 0 is our LEFT side
 *      and y = 55 is our RIGHT side.
 */

export interface Vec {
  x: number;
  y: number;
}

export type Team = 'us' | 'them';

/** Positions in the default 4-3-3 shape (plus GK). */
export type PositionId =
  | 'GK'
  | 'LB'
  | 'LCB'
  | 'RCB'
  | 'RB'
  | 'LM'
  | 'CM'
  | 'RM'
  | 'LW'
  | 'CF'
  | 'RW';

export interface PlayerDef {
  id: string;
  team: Team;
  /** Short label shown on the token, e.g. "RB". */
  label: string;
  /** Which position this player represents (used for "follow a position"). */
  role?: PositionId;
}

/** The ball is either loose at a point, or being carried by a player. */
export type BallState = { at: Vec } | { with: string };

export interface Keyframe {
  /** Time in seconds from the start of the play. */
  t: number;
  /**
   * Player positions at this time. Players left out keep their position from
   * the previous keyframe (the first keyframe must list everyone).
   */
  pos: Record<string, Vec>;
  /** Ball at this time. Left out = same state as the previous keyframe. */
  ball?: BallState;
}

export interface Step {
  /** Step start/end in seconds. Steps should cover the play end-to-end. */
  t0: number;
  t1: number;
  title: string;
  caption: string;
  /** "Freeze and think": a question shown when this step ends. */
  think?: string;
  /**
   * Carry straight on at the end of this step even when pausing after each
   * step (a board play's starting picture, which has nothing moving in it).
   */
  noPause?: boolean;
}

export type ArrowKind = 'run' | 'pass' | 'dribble';

export interface ArrowAnnotation {
  kind: ArrowKind;
  from: Vec;
  to: Vec;
  /** Visible during [t0, t1]. */
  t0: number;
  t1: number;
  team?: Team;
}

export interface ZoneAnnotation {
  kind: 'zone';
  /** Polygon points in pitch coordinates. */
  points: Vec[];
  label?: string;
  /** Where to draw the label (defaults to the polygon's centre). */
  labelAt?: Vec;
  t0: number;
  t1: number;
  tone?: 'space' | 'danger' | 'cover';
}

export type Annotation = ArrowAnnotation | ZoneAnnotation;

export type PlayCategory =
  | 'shape'
  | 'build-up'
  | 'attack'
  | 'defence'
  | 'transition'
  | 'set-piece';

export interface Play {
  id: string;
  title: string;
  summary: string;
  category: PlayCategory;
  /** Position IDs this play is most useful for (drives "linked plays"). */
  featuredRoles: PositionId[];
  /** Default player to follow when the play opens. */
  defaultFollow?: string;
  players: PlayerDef[];
  keyframes: Keyframe[];
  steps: Step[];
  annotations?: Annotation[];
  /** IDs from src/content/sources.ts */
  sources: string[];
  /** True once a player/coach has checked the content. */
  reviewed: boolean;
  /** Notes on where coaching practice varies. */
  variesByCoach?: string;
}

/** Positions of everything at one instant. */
export interface Frame {
  players: Record<string, Vec>;
  ball: Vec;
  /** Player carrying the ball, if any. */
  carrier: string | null;
}
