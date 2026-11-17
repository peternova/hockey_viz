/**
 * Tactics board: your own plays, drawn step by step.
 *
 * A board play is a list of frames. Frame 0 is where everyone starts; every
 * later frame is where everyone is at the end of one step. To play it back,
 * the board is turned into an ordinary `Play`, so the same animation engine,
 * controls and "follow a player" work exactly as for the library plays.
 *
 * Everything here is pure (no React, no storage) so it can be unit-tested.
 */
import { ALL_POSITIONS, F433_NEUTRAL, FORMATIONS, POSITION_LABEL, mirror } from '../../content/formations';
import { dist } from '../../engine/geometry';
import { ballPoint, frameAt, resolveKeyframes } from '../../engine/interpolate';
import type {
  Annotation,
  ArrowKind,
  BallState,
  Keyframe,
  Play,
  PlayerDef,
  PositionId,
  Step,
  Team,
  Vec,
} from '../../engine/types';
import { CENTRE_Y, PITCH, clampToPitch } from '../../pitch/coords';

export interface BoardFrame {
  /** Short line for this step ("CH passes to the right wing"). On frame 0: the set-up. */
  title: string;
  /** Optional longer explanation. */
  caption: string;
  /** Where every player is at the end of this step. Lists every player. */
  pos: Record<string, Vec>;
  ball: BallState;
  /** Seconds the move into this frame takes at normal speed; null = worked out from the distances. */
  secs: number | null;
  /** Draw run, pass and dribble arrows for this step's moves. */
  arrows: boolean;
}

export interface BoardPlay {
  id: string;
  title: string;
  players: PlayerDef[];
  /** frames[0] is where everyone starts; each later frame is the end of a step. */
  frames: BoardFrame[];
  created: number;
  updated: number;
  /** Library play this started as a copy of. */
  from?: string;
}

export const LIMITS = { title: 80, stepTitle: 80, caption: 600, label: 3, id: 40, frames: 40, players: 40 } as const;

/** Typical speeds in the library plays (metres per second at normal speed). */
export const PLAYER_SPEED = 5;
export const BALL_SPEED = 12;
export const MIN_SECS = 1;
export const MAX_SECS = 8;
/** How long the starting positions are shown before the first step. */
export const START_HOLD = 1;
/** Moves shorter than this get no arrow (small shuffles would just be clutter). */
export const ARROW_MIN = 2.5;
/** Drop the ball this close to a player and they have it. */
export const GIVE_RADIUS = 2.5;
/** Players may stand just off the pitch (at a penalty corner, say). */
const SLACK = 1.5;

export const PITCH_CENTRE: Vec = { x: PITCH.length / 2, y: CENTRE_Y };

export const SECS_CHOICES = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8];

/** An id that is unique enough on one device (crypto.randomUUID needs https, which a phone on the LAN doesn't have). */
export function newId(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Keep a point on (or just off) the pitch, rounded to 10 cm. */
export function place(v: Vec): Vec {
  const c = clampToPitch(v, SLACK);
  return { x: r1(c.x), y: r1(c.y) };
}

function blankFrame(pos: Record<string, Vec>, ball: BallState): BoardFrame {
  return { title: '', caption: '', pos, ball, secs: null, arrows: true };
}

/* ---------------- Players you can add ---------------- */

export interface Slot {
  id: string;
  team: Team;
  role: PositionId;
  label: string;
  /** Where they go when added: their usual 4-3-3 spot. */
  home: Vec;
}

/** Our eleven (id = position) and theirs ("t-<position>", mirrored). */
export const SLOTS: Slot[] = [
  ...ALL_POSITIONS.map((r): Slot => ({ id: r, team: 'us', role: r, label: POSITION_LABEL[r], home: F433_NEUTRAL[r] })),
  ...ALL_POSITIONS.map(
    (r): Slot => ({ id: `t-${r}`, team: 'them', role: r, label: POSITION_LABEL[r], home: mirror(F433_NEUTRAL[r]) }),
  ),
];

/* ---------------- Starting points ---------------- */

export interface Template {
  id: string;
  name: string;
  text: string;
}

export const TEMPLATES: Template[] = [
  { id: 'centre-pass', name: 'Centre pass: both teams', text: 'Eleven a side, each team in its own half, ready for our centre pass.' },
  { id: 'us-433', name: 'Our team: 4-3-3', text: 'Just us. Add opponents as you need them.' },
  { id: 'us-3331', name: 'Our team: 3-3-3-1', text: 'Just us, with a sweeper behind three backs.' },
  { id: 'us-235', name: 'Our team: 2-3-5', text: 'Just us, in the old pyramid with five forwards.' },
  { id: 'empty', name: 'Empty pitch', text: 'Only the ball. Add the players you need.' },
];

/**
 * Both teams set for our centre pass: everyone in their own half and the
 * opposition 5 m from the ball (as in the "Centre pass options" play).
 */
const CENTRE_PASS_US: Record<PositionId, Vec> = {
  GK: { x: 3, y: 27.5 },
  LB: { x: 30, y: 10 },
  LCB: { x: 24, y: 22 },
  RCB: { x: 24, y: 33 },
  RB: { x: 30, y: 45 },
  LM: { x: 40, y: 15 },
  CM: { x: 39, y: 27.5 },
  RM: { x: 40, y: 40 },
  LW: { x: 44.5, y: 6 },
  CF: { x: 44.8, y: 27.5 },
  RW: { x: 44.5, y: 49 },
};
const CENTRE_PASS_THEM: Record<PositionId, Vec> = {
  GK: { x: 88.4, y: 27.5 },
  LB: { x: 61.4, y: 45 },
  LCB: { x: 67.4, y: 33 },
  RCB: { x: 67.4, y: 22 },
  RB: { x: 61.4, y: 10 },
  LM: { x: 53, y: 38 },
  CM: { x: 57, y: 27.5 },
  RM: { x: 53, y: 17 },
  LW: { x: 48.5, y: 46 },
  CF: { x: 51.5, y: 27.5 },
  RW: { x: 48.5, y: 9 },
};

export function fromTemplate(templateId: string, now = Date.now()): BoardPlay {
  const formationId = templateId === 'us-3331' ? 'f3331' : templateId === 'us-235' ? 'f235' : 'f433';
  const formation = FORMATIONS.find((f) => f.id === formationId)!;
  const centrePass = templateId === 'centre-pass';
  const withUs = templateId !== 'empty';

  const players: PlayerDef[] = [];
  const pos: Record<string, Vec> = {};
  if (withUs) {
    for (const r of ALL_POSITIONS) {
      players.push({ id: r, team: 'us', label: formation.slots[r].label, role: r });
      pos[r] = centrePass ? CENTRE_PASS_US[r] : formation.slots[r].at;
    }
  }
  if (centrePass) {
    for (const r of ALL_POSITIONS) {
      players.push({ id: `t-${r}`, team: 'them', label: POSITION_LABEL[r], role: r });
      pos[`t-${r}`] = CENTRE_PASS_THEM[r];
    }
  }
  const ball: BallState = centrePass ? { with: 'CF' } : withUs ? { with: 'CM' } : { at: PITCH_CENTRE };
  return { id: newId(), title: 'New play', players, frames: [blankFrame(pos, ball)], created: now, updated: now };
}

/**
 * A library play as a board play: one frame at the start and one at the end
 * of each of its steps, with the same titles, captions and timing. (Curved
 * runs inside a step become straight lines.)
 */
export function fromLibraryPlay(play: Play, now = Date.now()): BoardPlay {
  const kfs = resolveKeyframes(play.players, play.keyframes);
  const snap = (t: number): { pos: Record<string, Vec>; ball: BallState } => {
    const f = frameAt(play.players, kfs, t);
    const pos = Object.fromEntries(Object.entries(f.players).map(([id, v]) => [id, place(v)]));
    return { pos, ball: f.carrier ? { with: f.carrier } : { at: place(f.ball) } };
  };
  const start = snap(0);
  const frames: BoardFrame[] = [blankFrame(start.pos, start.ball)];
  for (const s of play.steps) {
    const end = snap(s.t1);
    frames.push({
      title: s.title.slice(0, LIMITS.stepTitle),
      caption: s.caption.slice(0, LIMITS.caption),
      pos: end.pos,
      ball: end.ball,
      secs: Math.round((s.t1 - s.t0) * 100) / 100,
      arrows: true,
    });
  }
  return {
    id: newId(),
    title: `${play.title} (my version)`.slice(0, LIMITS.title),
    players: play.players.map((p) => ({ ...p, label: p.label.slice(0, LIMITS.label) })),
    frames,
    created: now,
    updated: now,
    from: play.id,
  };
}

/* ---------------- Edits (each returns a new play) ---------------- */

function samePoint(a: Vec | undefined, b: Vec | undefined): boolean {
  return Boolean(a && b) && Math.abs(a!.x - b!.x) < 0.05 && Math.abs(a!.y - b!.y) < 0.05;
}

function sameBall(a: BallState, b: BallState): boolean {
  if ('with' in a) return 'with' in b && a.with === b.with;
  return 'at' in b && samePoint(a.at, b.at);
}

/**
 * Move a player in frame k. Later frames where they hadn't moved yet follow
 * along, so changing the start doesn't make someone jump back in step 3.
 */
export function movePlayer(b: BoardPlay, k: number, id: string, to: Vec): BoardPlay {
  const old = b.frames[k]?.pos[id];
  if (!old) return b;
  const at = place(to);
  const frames = b.frames.slice();
  frames[k] = { ...frames[k], pos: { ...frames[k].pos, [id]: at } };
  for (let j = k + 1; j < frames.length && samePoint(frames[j].pos[id], old); j++) {
    frames[j] = { ...frames[j], pos: { ...frames[j].pos, [id]: at } };
  }
  return { ...b, frames };
}

/** Set the ball in frame k (later frames with the same ball follow, as for players). */
export function setBall(b: BoardPlay, k: number, ball: BallState): BoardPlay {
  const f = b.frames[k];
  if (!f) return b;
  if ('with' in ball && !b.players.some((p) => p.id === ball.with)) return b;
  const next: BallState = 'at' in ball ? { at: place(ball.at) } : ball;
  const old = f.ball;
  const frames = b.frames.slice();
  frames[k] = { ...f, ball: next };
  for (let j = k + 1; j < frames.length && sameBall(frames[j].ball, old); j++) frames[j] = { ...frames[j], ball: next };
  return { ...b, frames };
}

/** The player nearest a point in frame k, if one is within `radius` metres. */
export function nearestPlayer(b: BoardPlay, k: number, at: Vec, radius: number): string | null {
  let best: string | null = null;
  let bestD = radius;
  for (const p of b.players) {
    const d = dist(b.frames[k].pos[p.id], at);
    if (d <= bestD) {
      best = p.id;
      bestD = d;
    }
  }
  return best;
}

/** Let go of the ball at a point: next to a player, they have it; otherwise it's loose there. */
export function dropBall(b: BoardPlay, k: number, at: Vec, radius = GIVE_RADIUS): BoardPlay {
  const who = nearestPlayer(b, k, at, radius);
  return setBall(b, k, who ? { with: who } : { at });
}

/** Copy frame k as a new step straight after it. */
export function addFrame(b: BoardPlay, k: number): BoardPlay {
  if (b.frames.length >= LIMITS.frames || !b.frames[k]) return b;
  const src = b.frames[k];
  const frames = b.frames.slice();
  frames.splice(k + 1, 0, blankFrame({ ...src.pos }, src.ball));
  return { ...b, frames };
}

export function deleteFrame(b: BoardPlay, k: number): BoardPlay {
  if (k < 1 || k >= b.frames.length) return b;
  return { ...b, frames: b.frames.filter((_, i) => i !== k) };
}

export function updateFrame(
  b: BoardPlay,
  k: number,
  patch: Partial<Pick<BoardFrame, 'title' | 'caption' | 'secs' | 'arrows'>>,
): BoardPlay {
  if (!b.frames[k]) return b;
  const frames = b.frames.slice();
  frames[k] = { ...frames[k], ...patch };
  return { ...b, frames };
}

/** A spot near `want` that isn't on top of anyone in frame k. */
function freeSpot(b: BoardPlay, k: number, want: Vec): Vec {
  const taken = Object.values(b.frames[k]?.pos ?? {});
  for (let ring = 0; ring < 6; ring++) {
    const tries = ring === 0 ? 1 : 8;
    for (let i = 0; i < tries; i++) {
      const a = (i / tries) * Math.PI * 2;
      const p = place({ x: want.x + ring * 3.5 * Math.cos(a), y: want.y + ring * 3.5 * Math.sin(a) });
      if (taken.every((q) => dist(p, q) >= 3)) return p;
    }
  }
  return place(want);
}

/** Put a player on the pitch, at the same spot in every frame. */
export function addPlayer(b: BoardPlay, slot: Slot, k = 0): BoardPlay {
  if (b.players.some((p) => p.id === slot.id) || b.players.length >= LIMITS.players) return b;
  const at = freeSpot(b, k, slot.home);
  return {
    ...b,
    players: [...b.players, { id: slot.id, team: slot.team, label: slot.label, role: slot.role }],
    frames: b.frames.map((f) => ({ ...f, pos: { ...f.pos, [slot.id]: at } })),
  };
}

/** Take a player off in every frame. If they had the ball, it's left where it was. */
export function removePlayer(b: BoardPlay, id: string): BoardPlay {
  if (!b.players.some((p) => p.id === id)) return b;
  return {
    ...b,
    players: b.players.filter((p) => p.id !== id),
    frames: b.frames.map((f) => {
      const pos = { ...f.pos };
      delete pos[id];
      const ball: BallState =
        'with' in f.ball && f.ball.with === id ? { at: place(ballPoint(b.players, f.pos, f.ball)) } : f.ball;
      return { ...f, pos, ball };
    }),
  };
}

export function relabel(b: BoardPlay, id: string, label: string): BoardPlay {
  return { ...b, players: b.players.map((p) => (p.id === id ? { ...p, label: label.slice(0, LIMITS.label) } : p)) };
}

export function retitle(b: BoardPlay, title: string): BoardPlay {
  return { ...b, title: title.slice(0, LIMITS.title) };
}

/* ---------------- Reading a play ---------------- */

/** Who has the ball in a frame, if anyone. */
export function carrierOf(f: BoardFrame): string | null {
  return 'with' in f.ball ? f.ball.with : null;
}

export interface Move {
  kind: ArrowKind;
  from: Vec;
  to: Vec;
  team: Team;
}

/**
 * The arrows for step k, worked out from where things were and where they
 * ended up: a run for each player who moved, a dribble if they kept the ball,
 * and a pass if the ball went somewhere else.
 */
export function frameMoves(b: BoardPlay, k: number): Move[] {
  if (k < 1 || !b.frames[k]) return [];
  const a = b.frames[k - 1];
  const c = b.frames[k];
  const kept = carrierOf(a) !== null && carrierOf(a) === carrierOf(c) ? carrierOf(a) : null;
  const moves: Move[] = [];
  for (const p of b.players) {
    const from = a.pos[p.id];
    const to = c.pos[p.id];
    if (dist(from, to) >= ARROW_MIN) moves.push({ kind: p.id === kept ? 'dribble' : 'run', from, to, team: p.team });
  }
  if (!kept) {
    const from = ballPoint(b.players, a.pos, a.ball);
    const to = ballPoint(b.players, c.pos, c.ball);
    const passer = b.players.find((p) => p.id === carrierOf(a));
    if (dist(from, to) >= ARROW_MIN) moves.push({ kind: 'pass', from, to, team: passer?.team ?? 'us' });
  }
  return moves;
}

/** A sensible time for step k from how far people and the ball travel. */
export function autoSecs(b: BoardPlay, k: number): number {
  if (k < 1 || !b.frames[k]) return MIN_SECS;
  const a = b.frames[k - 1];
  const c = b.frames[k];
  let run = 0;
  for (const p of b.players) run = Math.max(run, dist(a.pos[p.id], c.pos[p.id]));
  const pass = dist(ballPoint(b.players, a.pos, a.ball), ballPoint(b.players, c.pos, c.ball));
  const s = Math.max(run / PLAYER_SPEED, pass / BALL_SPEED);
  return Math.min(MAX_SECS, Math.max(MIN_SECS, Math.ceil(s * 2) / 2));
}

export function frameSecs(b: BoardPlay, k: number): number {
  return b.frames[k]?.secs ?? autoSecs(b, k);
}

/** The board play as a normal Play for the animation engine. */
export function toPlay(b: BoardPlay): Play {
  const [f0, ...rest] = b.frames;
  const keyframes: Keyframe[] = [
    { t: 0, pos: f0.pos, ball: f0.ball },
    { t: START_HOLD, pos: f0.pos, ball: f0.ball },
  ];
  const steps: Step[] = [
    {
      t0: 0,
      t1: START_HOLD,
      title: f0.title.trim() || 'Starting positions',
      caption: f0.caption.trim(),
      // Nothing moves in it: Play goes straight on into step 1.
      noPause: true,
    },
  ];
  const annotations: Annotation[] = [];
  let t = START_HOLD;
  rest.forEach((f, i) => {
    const k = i + 1;
    const t1 = Math.round((t + frameSecs(b, k)) * 100) / 100;
    keyframes.push({ t: t1, pos: f.pos, ball: f.ball });
    steps.push({ t0: t, t1, title: f.title.trim() || `Step ${k}`, caption: f.caption.trim() });
    if (f.arrows) for (const m of frameMoves(b, k)) annotations.push({ ...m, t0: t, t1 });
    t = t1;
  });
  return {
    id: `board-${b.id}`,
    title: b.title.trim() || 'Untitled play',
    summary: '',
    category: 'shape',
    featuredRoles: [],
    players: b.players,
    keyframes,
    steps,
    annotations,
    sources: [],
    reviewed: true,
  };
}

/* ---------------- Checking saved and imported data ---------------- */

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.slice(0, max) : '');

function vec(v: unknown): Vec | null {
  return isObj(v) && isNum(v.x) && isNum(v.y) ? place({ x: v.x, y: v.y }) : null;
}

/** Somewhere to put a player whose position is missing altogether. */
function fallbackSpot(i: number): Vec {
  return { x: r1(PITCH.length / 2), y: 4 + ((i * 4) % 48) };
}

/**
 * Turn anything (saved data, an imported file, something hand-edited) into a
 * valid board play, repairing what it can. Returns null if there's nothing usable.
 */
export function normalizePlay(raw: unknown, now = Date.now()): BoardPlay | null {
  if (!isObj(raw) || !Array.isArray(raw.players) || !Array.isArray(raw.frames)) return null;

  const players: PlayerDef[] = [];
  const ids = new Set<string>();
  for (const p of raw.players.slice(0, LIMITS.players)) {
    if (!isObj(p) || typeof p.id !== 'string' || !p.id || p.id.length > LIMITS.id || ids.has(p.id)) continue;
    if (p.team !== 'us' && p.team !== 'them') continue;
    const label = str(p.label, LIMITS.label).trim() || p.id.replace(/^t-/, '').slice(0, LIMITS.label);
    const role = typeof p.role === 'string' && (ALL_POSITIONS as string[]).includes(p.role) ? (p.role as PositionId) : null;
    ids.add(p.id);
    players.push(role ? { id: p.id, team: p.team, label, role } : { id: p.id, team: p.team, label });
  }

  const frames: BoardFrame[] = [];
  let prev: BoardFrame | null = null;
  for (const f of raw.frames.slice(0, LIMITS.frames)) {
    if (!isObj(f)) continue;
    const rawPos = isObj(f.pos) ? f.pos : {};
    const pos: Record<string, Vec> = {};
    players.forEach((p, i) => {
      pos[p.id] = vec(rawPos[p.id]) ?? prev?.pos[p.id] ?? fallbackSpot(i);
    });
    let ball: BallState | null = null;
    if (isObj(f.ball)) {
      if (typeof f.ball.with === 'string' && ids.has(f.ball.with)) ball = { with: f.ball.with };
      else {
        const at = vec(f.ball.at);
        if (at) ball = { at };
      }
    }
    const frame: BoardFrame = {
      title: str(f.title, LIMITS.stepTitle),
      caption: str(f.caption, LIMITS.caption),
      pos,
      ball: ball ?? prev?.ball ?? { at: PITCH_CENTRE },
      secs: isNum(f.secs) && f.secs >= 0.5 && f.secs <= 10 ? Math.round(f.secs * 100) / 100 : null,
      arrows: f.arrows !== false,
    };
    frames.push(frame);
    prev = frame;
  }
  if (frames.length === 0) return null;

  const play: BoardPlay = {
    id: typeof raw.id === 'string' && raw.id && raw.id.length <= LIMITS.id ? raw.id : newId(),
    title: str(raw.title, LIMITS.title).trim() || 'Untitled play',
    players,
    frames,
    created: isNum(raw.created) ? raw.created : now,
    updated: isNum(raw.updated) ? raw.updated : now,
  };
  if (typeof raw.from === 'string' && raw.from) play.from = raw.from.slice(0, LIMITS.id);
  return play;
}

/** Same drawing (title, players and frames), ignoring ids and dates. */
export function sameContent(a: BoardPlay, b: BoardPlay): boolean {
  const pick = (p: BoardPlay) => JSON.stringify([p.title, p.players, p.frames]);
  return pick(a) === pick(b);
}

/* ---------------- Export and import files ---------------- */

export const FILE_KIND = 'hockey-iq-tactics-board';
export const FILE_VERSION = 1;
/** Imported files bigger than this are refused before reading. */
export const MAX_FILE_BYTES = 2_000_000;

export function boardFile(plays: BoardPlay[], now = new Date()): string {
  return JSON.stringify({ kind: FILE_KIND, version: FILE_VERSION, exported: now.toISOString(), plays }, null, 1);
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function fileNameFor(plays: BoardPlay[], now = new Date()): string {
  if (plays.length === 1) return `hockey-iq-${slug(plays[0].title) || 'play'}.json`;
  return `hockey-iq-plays-${now.toISOString().slice(0, 10)}.json`;
}

export class BoardFileError extends Error {}

/** Read an exported file. Throws BoardFileError with a message fit to show. */
export function readBoardFile(text: string): { plays: BoardPlay[]; skipped: number } {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new BoardFileError('That file isn’t a tactics board export (it couldn’t be read as one).');
  }
  if (isObj(data) && data.kind === FILE_KIND && isNum(data.version) && data.version > FILE_VERSION) {
    throw new BoardFileError('That file was made by a newer version of Hockey IQ. Update this copy first.');
  }
  const list: unknown[] | null =
    isObj(data) && data.kind === FILE_KIND && Array.isArray(data.plays)
      ? data.plays
      : isObj(data) && Array.isArray(data.frames)
        ? [data]
        : null;
  if (!list) throw new BoardFileError('That file isn’t a Hockey IQ tactics board export.');
  const plays = list.map((p) => normalizePlay(p)).filter((p): p is BoardPlay => p !== null);
  if (plays.length === 0) throw new BoardFileError('No plays could be read from that file.');
  return { plays, skipped: list.length - plays.length };
}

/**
 * Add imported plays to the ones already here. A play that's already here
 * unchanged is skipped; one with the same id but different content is added
 * as a separate play, so nothing is ever overwritten.
 */
export function mergeImported(
  existing: BoardPlay[],
  incoming: BoardPlay[],
  now = Date.now(),
): { plays: BoardPlay[]; added: number; same: number } {
  const plays = existing.slice();
  let added = 0;
  let same = 0;
  for (const inc of incoming) {
    const match = plays.find((p) => p.id === inc.id);
    if (match && sameContent(match, inc)) {
      same++;
      continue;
    }
    plays.unshift({ ...inc, id: match ? newId() : inc.id, updated: now });
    added++;
  }
  return { plays, added, same };
}
