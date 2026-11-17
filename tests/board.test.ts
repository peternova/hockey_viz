import { describe, expect, it } from 'vitest';
import { PLAYS } from '../src/content/plays';
import { dist } from '../src/engine/geometry';
import { duration, frameAt, resolveKeyframes } from '../src/engine/interpolate';
import type { PositionId } from '../src/engine/types';
import {
  ARROW_MIN,
  BoardFileError,
  FILE_KIND,
  SLOTS,
  START_HOLD,
  TEMPLATES,
  addFrame,
  addPlayer,
  autoSecs,
  boardFile,
  deleteFrame,
  dropBall,
  fileNameFor,
  frameMoves,
  fromLibraryPlay,
  fromTemplate,
  mergeImported,
  movePlayer,
  normalizePlay,
  readBoardFile,
  relabel,
  removePlayer,
  setBall,
  toPlay,
  updateFrame,
  type BoardPlay,
} from '../src/features/board/model';
import { parseBoards } from '../src/lib/boardStore';
import { historyReducer, type HistoryState } from '../src/lib/useHistory';
import { PITCH } from '../src/pitch/coords';

/** A small play: our LB and CM, their LW; the CM has the ball. */
function tiny(): BoardPlay {
  return {
    id: 'tiny',
    title: 'Tiny',
    players: [
      { id: 'LB', team: 'us', label: 'LB', role: 'LB' as PositionId },
      { id: 'CM', team: 'us', label: 'CH', role: 'CM' as PositionId },
      { id: 't-LW', team: 'them', label: 'LW', role: 'LW' as PositionId },
    ],
    frames: [
      {
        title: '',
        caption: '',
        pos: { LB: { x: 20, y: 10 }, CM: { x: 32, y: 27.5 }, 't-LW': { x: 40, y: 47 } },
        ball: { with: 'CM' },
        secs: null,
        arrows: true,
      },
    ],
    created: 1,
    updated: 1,
  };
}

/** The same checks the library plays get in content.test.ts. */
function expectValidPlay(b: BoardPlay) {
  const play = toPlay(b);
  const kfs = resolveKeyframes(play.players, play.keyframes);
  expect(kfs.length).toBe(b.frames.length + 1);
  expect(play.steps[0].t0).toBe(0);
  for (let i = 1; i < play.steps.length; i++) expect(play.steps[i].t0).toBe(play.steps[i - 1].t1);
  expect(play.steps[play.steps.length - 1].t1).toBe(duration(play));
  for (const a of play.annotations ?? []) {
    expect(a.t1).toBeGreaterThan(a.t0);
    expect(a.t1).toBeLessThanOrEqual(duration(play));
  }
  const ids = new Set(play.players.map((p) => p.id));
  expect(ids.size).toBe(play.players.length);
  for (const f of b.frames) {
    expect(Object.keys(f.pos).sort()).toEqual([...ids].sort());
    if ('with' in f.ball) expect(ids).toContain(f.ball.with);
  }
}

describe('board: templates', () => {
  it.each(TEMPLATES.map((t) => [t.id] as const))('%s makes a valid play', (id) => {
    const b = fromTemplate(id, 5);
    expectValidPlay(b);
    expect(b.frames).toHaveLength(1);
    const pts = Object.values(b.frames[0].pos);
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(PITCH.length);
    }
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) expect(dist(pts[i], pts[j])).toBeGreaterThanOrEqual(3);
  });

  it('labels the old formations with their own names', () => {
    expect(fromTemplate('us-235').players.find((p) => p.id === 'LM')?.label).toBe('IL');
    expect(fromTemplate('us-3331').players.find((p) => p.id === 'LCB')?.label).toBe('SW');
    expect(fromTemplate('centre-pass').players).toHaveLength(22);
    expect(fromTemplate('centre-pass').frames[0].ball).toEqual({ with: 'CF' });
    expect(fromTemplate('empty').players).toHaveLength(0);
  });

  it('sets up the centre pass legally (FIH Rule 6.4)', () => {
    const b = fromTemplate('centre-pass');
    const f = b.frames[0];
    for (const p of b.players) {
      const x = f.pos[p.id].x;
      if (p.team === 'us') expect(x, p.id).toBeLessThanOrEqual(PITCH.length / 2);
      else {
        expect(x, p.id).toBeGreaterThanOrEqual(PITCH.length / 2);
        expect(dist(f.pos[p.id], { x: PITCH.length / 2, y: PITCH.width / 2 }), p.id).toBeGreaterThanOrEqual(5);
      }
    }
  });

  it('gives every new play its own id', () => {
    expect(fromTemplate('us-433').id).not.toBe(fromTemplate('us-433').id);
  });
});

describe('board: copying a library play', () => {
  it.each(PLAYS.map((p) => [p.id, p] as const))('%s', (_id, play) => {
    const b = fromLibraryPlay(play, 5);
    expectValidPlay(b);
    expect(b.frames).toHaveLength(play.steps.length + 1);
    expect(b.from).toBe(play.id);
    // Each frame is the picture at the end of the matching step, timed the same.
    const kfs = resolveKeyframes(play.players, play.keyframes);
    play.steps.forEach((s, i) => {
      const f = frameAt(play.players, kfs, s.t1);
      for (const p of play.players) expect(dist(b.frames[i + 1].pos[p.id], f.players[p.id])).toBeLessThan(0.1);
      expect(b.frames[i + 1].title).toBe(s.title);
      expect(b.frames[i + 1].secs).toBeCloseTo(s.t1 - s.t0);
    });
    expect(duration(toPlay(b))).toBeCloseTo(duration(play) + START_HOLD);
    // Survives saving and loading unchanged.
    expect(normalizePlay(JSON.parse(JSON.stringify(b)))).toEqual(b);
  });
});

describe('board: editing', () => {
  it('moving someone carries forward to later steps where they hadn’t moved', () => {
    let b = tiny();
    b = addFrame(b, 0);
    b = addFrame(b, 1);
    b = movePlayer(b, 2, 'CM', { x: 40, y: 27.5 }); // CM moves in step 2 only
    b = movePlayer(b, 0, 'LB', { x: 22, y: 12 }); // change the start
    expect(b.frames.map((f) => f.pos.LB)).toEqual([
      { x: 22, y: 12 },
      { x: 22, y: 12 },
      { x: 22, y: 12 },
    ]);
    b = movePlayer(b, 0, 'CM', { x: 30, y: 27.5 });
    expect(b.frames.map((f) => f.pos.CM)).toEqual([
      { x: 30, y: 27.5 },
      { x: 30, y: 27.5 },
      { x: 40, y: 27.5 }, // already moved here: left alone
    ]);
  });

  it('keeps players on the pitch and rounds to 10 cm', () => {
    const b = movePlayer(tiny(), 0, 'LB', { x: -20, y: 10.04 });
    expect(b.frames[0].pos.LB).toEqual({ x: -1.5, y: 10 });
  });

  it('drops the ball to a nearby player, or leaves it loose', () => {
    let b = dropBall(tiny(), 0, { x: 21, y: 11 });
    expect(b.frames[0].ball).toEqual({ with: 'LB' });
    b = dropBall(b, 0, { x: 26, y: 20 });
    expect(b.frames[0].ball).toEqual({ at: { x: 26, y: 20 } });
  });

  it('ignores giving the ball to someone who isn’t there', () => {
    const b = tiny();
    expect(setBall(b, 0, { with: 'nobody' })).toBe(b);
  });

  it('ball changes carry forward like player moves', () => {
    let b = addFrame(addFrame(tiny(), 0), 1);
    b = setBall(b, 2, { with: 'LB' });
    b = setBall(b, 0, { with: 't-LW' });
    expect(b.frames.map((f) => f.ball)).toEqual([{ with: 't-LW' }, { with: 't-LW' }, { with: 'LB' }]);
  });

  it('adds, edits and deletes steps', () => {
    let b = addFrame(tiny(), 0);
    expect(b.frames).toHaveLength(2);
    b = updateFrame(b, 1, { title: 'Pass', secs: 2 });
    expect(b.frames[1]).toMatchObject({ title: 'Pass', secs: 2 });
    expect(deleteFrame(b, 0)).toBe(b); // the start can't be deleted
    expect(deleteFrame(b, 1).frames).toHaveLength(1);
  });

  it('adds a player to every frame, clear of everyone else', () => {
    let b = addFrame(tiny(), 0);
    const slot = SLOTS.find((s) => s.id === 't-CF')!;
    b = addPlayer(b, slot, 0);
    expect(b.players.map((p) => p.id)).toContain('t-CF');
    for (const f of b.frames) {
      const others = Object.entries(f.pos).filter(([id]) => id !== 't-CF');
      for (const [, q] of others) expect(dist(f.pos['t-CF'], q)).toBeGreaterThanOrEqual(3);
    }
    expect(addPlayer(b, slot)).toBe(b); // already on
  });

  it('removing the ball carrier leaves the ball where it was', () => {
    const b = removePlayer(tiny(), 'CM');
    expect(b.players.map((p) => p.id)).not.toContain('CM');
    expect(b.frames[0].pos.CM).toBeUndefined();
    expect('at' in b.frames[0].ball).toBe(true);
    expectValidPlay(b);
  });

  it('labels are at most three characters', () => {
    expect(relabel(tiny(), 'LB', 'Sammy').players[0].label).toBe('Sam');
  });
});

describe('board: arrows and timing', () => {
  it('works out runs, dribbles and passes', () => {
    let b = addFrame(tiny(), 0);
    b = movePlayer(b, 1, 'CM', { x: 40, y: 27.5 }); // CM carries the ball forward
    b = movePlayer(b, 1, 'LB', { x: 21, y: 10 }); // a shuffle: no arrow
    expect(frameMoves(b, 1).map((m) => m.kind)).toEqual(['dribble']);

    b = addFrame(b, 1);
    b = movePlayer(b, 2, 'LB', { x: 35, y: 8 });
    b = setBall(b, 2, { with: 'LB' });
    const kinds = frameMoves(b, 2).map((m) => m.kind).sort();
    expect(kinds).toEqual(['pass', 'run']);
    expect(frameMoves(b, 0)).toEqual([]);
  });

  it('times a step from the distances, within limits', () => {
    let b = addFrame(tiny(), 0);
    expect(autoSecs(b, 1)).toBe(1); // nothing moves
    b = movePlayer(b, 1, 'LB', { x: 40, y: 10 }); // a 20 m run at 5 m/s
    expect(autoSecs(b, 1)).toBe(4);
    b = movePlayer(b, 1, 'LB', { x: 90, y: 10 }); // 70 m: capped
    expect(autoSecs(b, 1)).toBe(8);
  });

  it('becomes a play with a hold on the start, then one step per frame', () => {
    let b = addFrame(tiny(), 0);
    b = movePlayer(b, 1, 'CM', { x: 42, y: 27.5 });
    b = updateFrame(b, 1, { title: 'Carry it' });
    const play = toPlay(b);
    expect(play.steps.map((s) => s.title)).toEqual(['Starting positions', 'Carry it']);
    expect(play.steps[0].noPause).toBe(true); // Play runs straight into step 1
    expect(play.steps[1]).toMatchObject({ t0: START_HOLD, t1: START_HOLD + 2 });
    expect(play.annotations).toHaveLength(1);
    expect(toPlay(updateFrame(b, 1, { arrows: false })).annotations).toHaveLength(0);
    expect(toPlay(updateFrame(b, 1, { title: '  ' })).steps[1].title).toBe('Step 1');
  });

  it('only draws arrows for real moves', () => {
    let b = addFrame(tiny(), 0);
    b = movePlayer(b, 1, 'LB', { x: 20 + ARROW_MIN - 0.2, y: 10 });
    expect(frameMoves(b, 1)).toHaveLength(0);
  });
});

describe('board: saved data and files', () => {
  it('repairs what it can and refuses what it can’t', () => {
    expect(normalizePlay(null)).toBeNull();
    expect(normalizePlay({ players: [], frames: [] })).toBeNull();
    const fixed = normalizePlay({
      id: 'x',
      title: '',
      players: [
        { id: 'A', team: 'us', label: 'TOOLONG' },
        { id: 'A', team: 'us', label: 'dup' },
        { id: 'B', team: 'referee', label: 'no' },
        { id: 'C', team: 'them', label: '', role: 'nonsense' },
      ],
      frames: [
        { pos: { A: { x: 500, y: 'x' }, C: { x: 10, y: 10 } }, ball: { with: 'B' }, secs: 99 },
        { pos: { A: { x: 30, y: 30 } }, ball: { at: { x: 1, y: 2 } }, arrows: false },
        'junk',
      ],
    })!;
    expect(fixed.title).toBe('Untitled play');
    expect(fixed.players).toEqual([
      { id: 'A', team: 'us', label: 'TOO' },
      { id: 'C', team: 'them', label: 'C' },
    ]);
    expect(fixed.frames).toHaveLength(2);
    expect(fixed.frames[0].ball).toEqual({ at: { x: PITCH.length / 2, y: PITCH.width / 2 } });
    expect(fixed.frames[0].secs).toBeNull();
    expect(fixed.frames[1].pos.C).toEqual({ x: 10, y: 10 }); // carried from the frame before
    expect(fixed.frames[1].arrows).toBe(false);
    expectValidPlay(fixed);
  });

  it('round-trips through an export file', () => {
    const plays = [fromTemplate('us-433'), fromLibraryPlay(PLAYS[0])];
    const text = boardFile(plays);
    expect(JSON.parse(text).kind).toBe(FILE_KIND);
    expect(readBoardFile(text)).toEqual({ plays, skipped: 0 });
  });

  it('reads a single bare play too', () => {
    const b = tiny();
    expect(readBoardFile(JSON.stringify(b)).plays[0]).toEqual(b);
  });

  it('explains files it can’t read', () => {
    expect(() => readBoardFile('not json')).toThrow(BoardFileError);
    expect(() => readBoardFile('{"hello":1}')).toThrow(/isn’t a Hockey IQ/);
    expect(() => readBoardFile(JSON.stringify({ kind: FILE_KIND, version: 9, plays: [] }))).toThrow(/newer version/);
    expect(() => readBoardFile(JSON.stringify({ kind: FILE_KIND, version: 1, plays: [1, 2] }))).toThrow(/No plays/);
  });

  it('imports without overwriting', () => {
    const a = tiny();
    const changed = { ...a, title: 'Changed' };
    const r = mergeImported([a], [a, changed, fromTemplate('empty')], 9);
    expect(r).toMatchObject({ added: 2, same: 1 });
    expect(r.plays).toHaveLength(3);
    expect(new Set(r.plays.map((p) => p.id)).size).toBe(3);
    expect(r.plays.find((p) => p.title === 'Tiny')).toBe(a);
  });

  it('names files after the play', () => {
    expect(fileNameFor([{ ...tiny(), title: 'Our PC: “drag” to the post!' }])).toBe('hockey-iq-our-pc-drag-to-the-post.json');
    expect(fileNameFor([tiny(), tiny()], new Date('2026-11-17T10:00:00Z'))).toBe('hockey-iq-plays-2026-11-17.json');
  });

  it('survives missing or broken saved data', () => {
    expect(parseBoards(null)).toEqual([]);
    expect(parseBoards('nope')).toEqual([]);
    expect(parseBoards('{"v":2,"plays":[]}')).toEqual([]);
    expect(parseBoards(JSON.stringify({ v: 1, plays: [tiny(), 'junk'] }))).toEqual([tiny()]);
  });
});

describe('undo history', () => {
  const start: HistoryState<number> = { past: [], present: 0, future: [], group: null };

  it('undoes and redoes', () => {
    let h = historyReducer(start, { type: 'commit', next: 1 });
    h = historyReducer(h, { type: 'commit', next: 2 });
    h = historyReducer(h, { type: 'undo' });
    expect(h.present).toBe(1);
    h = historyReducer(h, { type: 'redo' });
    expect(h.present).toBe(2);
  });

  it('merges a drag (or typing in one box) into one undo step', () => {
    let h = historyReducer(start, { type: 'commit', next: 1, group: 'drag-1' });
    h = historyReducer(h, { type: 'commit', next: 2, group: 'drag-1' });
    h = historyReducer(h, { type: 'commit', next: 3, group: 'drag-1' });
    h = historyReducer(h, { type: 'commit', next: 4, group: 'drag-2' });
    h = historyReducer(h, { type: 'undo' });
    expect(h.present).toBe(3);
    h = historyReducer(h, { type: 'undo' });
    expect(h.present).toBe(0);
  });

  it('a new change clears redo', () => {
    let h = historyReducer(start, { type: 'commit', next: 1 });
    h = historyReducer(h, { type: 'undo' });
    h = historyReducer(h, { type: 'commit', next: 5 });
    expect(h.future).toEqual([]);
  });
});
