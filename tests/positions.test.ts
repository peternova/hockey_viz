import { describe, expect, it } from 'vitest';
import { GRID_COLS, GRID_ROWS, GUIDES, guideAt, linkedPlays } from '../src/content/positions';
import { SOURCE_IDS } from '../src/content/sources';
import { ALL_POSITIONS } from '../src/content/formations';
import { PLAYS } from '../src/content/plays';
import { PITCH } from '../src/pitch/coords';

describe('content: position guides', () => {
  it('fill every cell of the 3×3 grid, plus the goalkeeper', () => {
    for (const r of GRID_ROWS) for (const c of GRID_COLS) expect(guideAt(r.line, c.side), `${r.line}/${c.side}`).toBeDefined();
    expect(GUIDES.find((g) => g.id === 'GK')).toBeDefined();
    expect(new Set(GUIDES.map((g) => g.id)).size).toBe(GUIDES.length);
  });

  it('cover every token in the 4-3-3 exactly once', () => {
    const covered = GUIDES.flatMap((g) => g.roles);
    expect(new Set(covered).size).toBe(covered.length);
    expect([...covered].sort()).toEqual([...ALL_POSITIONS].sort());
  });

  it('every play role belongs to some guide', () => {
    const covered = new Set(GUIDES.flatMap((g) => g.roles));
    for (const p of PLAYS) for (const r of p.featuredRoles) expect(covered).toContain(r);
  });

  for (const g of GUIDES) {
    describe(g.id, () => {
      it('has the same number of zone points in attack and defence (so it can animate)', () => {
        expect(g.zone.attack.length).toBeGreaterThanOrEqual(3);
        expect(g.zone.attack.length).toBe(g.zone.defend.length);
      });

      it('zones are on the pitch', () => {
        for (const p of [...g.zone.attack, ...g.zone.defend]) {
          expect(p.x).toBeGreaterThanOrEqual(0);
          expect(p.x).toBeLessThanOrEqual(PITCH.length);
          expect(p.y).toBeGreaterThanOrEqual(0);
          expect(p.y).toBeLessThanOrEqual(PITCH.width);
        }
      });

      it('has content in every section', () => {
        expect(g.oneLiner.length).toBeGreaterThan(10);
        expect(g.aka.length).toBeGreaterThan(0);
        for (const k of ['haveBall', 'theyHaveBall', 'wonIt', 'lostIt'] as const) {
          expect(g.moments[k].length, `moment ${k}`).toBeGreaterThan(0);
        }
        expect(g.setPieces.length).toBeGreaterThan(0);
        expect(g.sideSpecifics.length).toBeGreaterThan(0);
        expect(g.keySkills.length).toBeGreaterThan(0);
        expect(g.mistakes.length).toBeGreaterThan(0);
        expect(g.playSmart.length).toBeGreaterThan(0);
      });

      it('cites known sources', () => {
        expect(g.sources.length).toBeGreaterThan(0);
        for (const s of g.sources) expect(SOURCE_IDS).toContain(s);
      });
    });
  }

  it('links plays to positions', () => {
    const rb = GUIDES.find((g) => g.id === 'RB')!;
    expect(linkedPlays(rb).map((p) => p.id)).toContain('d1-channelling');
  });
});
