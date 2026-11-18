import { describe, expect, it } from 'vitest';
import { addFrame, boardFile, fileNameFor, fromTemplate, movePlayer, toPlay, type BoardPlay } from '../src/features/board/model';
import { TEAM_PLAYS, TEAM_PROBLEMS, readTeamFiles, teamFrom, teamPlayFrom } from '../src/features/board/teamPlays';
import { PITCH } from '../src/pitch/coords';

/* ---------- The real files in team-plays/ ---------- */

describe('team-plays folder', () => {
  it('every file can be read (fix or delete the file named below)', () => {
    // A readable message in the GitHub Actions log, e.g.
    // "hockey-iq-press.json: That file isn’t a tactics board export."
    expect(TEAM_PROBLEMS.map((p) => `${p.file}: ${p.message}`)).toEqual([]);
  });

  it('every team play has its own address', () => {
    const slugs = TEAM_PLAYS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it('every team play turns into a playable animation on the pitch', () => {
    for (const t of TEAM_PLAYS) {
      const play = toPlay(t.play);
      expect(play.steps.length, t.file).toBe(t.play.frames.length);
      for (const k of play.keyframes) {
        for (const v of Object.values(k.pos)) {
          expect(v.x, t.file).toBeGreaterThanOrEqual(-2);
          expect(v.x, t.file).toBeLessThanOrEqual(PITCH.length + 2);
          expect(v.y, t.file).toBeGreaterThanOrEqual(-2);
          expect(v.y, t.file).toBeLessThanOrEqual(PITCH.width + 2);
        }
      }
    }
  });
});

/* ---------- Reading files ---------- */

function makePlay(title: string, now = 1_700_000_000_000): BoardPlay {
  let b = fromTemplate('us-433', now);
  b = { ...b, title };
  b = addFrame(b, 0);
  const lw = b.players.find((p) => p.label === 'LW')!;
  return movePlayer(b, 1, lw.id, { x: 70, y: 6 });
}

describe('readTeamFiles', () => {
  const press = makePlay('Left side press');
  const overlap = makePlay('Right side overlap');

  it('reads single-play exports, multi-play exports and bare plays, sorted by title', () => {
    const r = readTeamFiles({
      '../../../team-plays/b.json': boardFile([overlap]),
      '../../../team-plays/a.json': JSON.stringify(press),
    });
    expect(r.problems).toEqual([]);
    expect(r.plays.map((t) => [t.slug, t.file])).toEqual([
      ['left-side-press', 'a.json'],
      ['right-side-overlap', 'b.json'],
    ]);
    const multi = readTeamFiles({ 'team-plays/all.json': boardFile([overlap, press]) });
    expect(multi.plays.map((t) => t.slug)).toEqual(['left-side-press', 'right-side-overlap']);
  });

  it('names the file when one can’t be read, and still reads the others', () => {
    const r = readTeamFiles({
      'team-plays/good.json': boardFile([press]),
      'team-plays/broken.json': '{"kind": "hockey-iq-tactics-board", "plays": [',
      'team-plays/other.json': '{"hello": 1}',
    });
    expect(r.plays.map((t) => t.file)).toEqual(['good.json']);
    expect(r.problems.map((p) => p.file)).toEqual(['broken.json', 'other.json']);
    expect(r.problems[0].message).toMatch(/isn’t a tactics board export/);
  });

  it('reports plays inside a file that couldn’t be read', () => {
    const text = JSON.stringify({ kind: 'hockey-iq-tactics-board', version: 1, plays: [press, { nope: true }] });
    const r = readTeamFiles({ 'team-plays/x.json': text });
    expect(r.plays).toHaveLength(1);
    expect(r.problems).toEqual([{ file: 'x.json', message: '1 of the plays in it couldn’t be read.' }]);
  });

  it('shows the same play once when it was exported twice', () => {
    const r = readTeamFiles({
      'team-plays/hockey-iq-left-side-press.json': boardFile([press]),
      'team-plays/hockey-iq-plays-2026-11-18.json': boardFile([press, overlap]),
    });
    expect(r.plays.map((t) => t.slug)).toEqual(['left-side-press', 'right-side-overlap']);
    expect(r.plays[0].file).toBe('hockey-iq-left-side-press.json');
  });

  it('keeps two different plays with the same title apart', () => {
    const other = movePlayer(press, 1, press.players[0].id, { x: 20, y: 20 });
    const r = readTeamFiles({ 'team-plays/a.json': boardFile([press]), 'team-plays/b.json': boardFile([other]) });
    expect(r.plays.map((t) => t.slug)).toEqual(['left-side-press', 'left-side-press-2']);
  });

  it('gives an untitled play an address', () => {
    const r = readTeamFiles({ 'team-plays/a.json': boardFile([{ ...press, title: '!!!' }]) });
    expect(r.plays[0].slug).toBe('play');
  });

  it('a copy keeps the title, so its export has the same file name as the original', () => {
    const [t] = readTeamFiles({ 'team-plays/hockey-iq-left-side-press.json': boardFile([press]) }).plays;
    expect(fileNameFor([{ ...t.play, id: 'new' }])).toBe(t.file);
  });
});

describe('teamFrom / teamPlayFrom', () => {
  it('links a copied board play back to its team play', () => {
    for (const t of TEAM_PLAYS) expect(teamPlayFrom(teamFrom(t))).toBe(t);
    expect(teamPlayFrom('team:no-such-play')).toBeUndefined();
    expect(teamPlayFrom('s1-team-shape')).toBeUndefined();
    expect(teamPlayFrom(undefined)).toBeUndefined();
  });
});
