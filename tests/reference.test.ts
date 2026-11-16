import { describe, expect, it } from 'vitest';
import { GLOSSARY, termById, termSources } from '../src/content/glossary';
import { PITCH_FEATURES, LAYERS, pitchFeatureById } from '../src/content/pitch';
import { ALL_POSITIONS, FORMATIONS, OLD_NAMES } from '../src/content/formations';
import { PLAYS, playById } from '../src/content/plays';
import { guideById, linkedPlays, GUIDES } from '../src/content/positions';
import { SOURCE_IDS } from '../src/content/sources';
import { PITCH } from '../src/pitch/coords';

describe('content: glossary', () => {
  it('has about 100 terms with unique ids', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(100);
    const ids = GLOSSARY.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no duplicate term names', () => {
    const names = GLOSSARY.map((t) => t.term.toLowerCase());
    expect(new Set(names).size).toBe(names.length);
  });

  for (const t of GLOSSARY) {
    it(`${t.id}: definition and links resolve`, () => {
      expect(t.def.length, 'definition').toBeGreaterThan(15);
      for (const id of t.plays ?? []) expect(playById(id), `play ${id}`).toBeDefined();
      for (const id of t.positions ?? []) expect(guideById(id), `position ${id}`).toBeDefined();
      if (t.pitch) expect(pitchFeatureById(t.pitch), `pitch ${t.pitch}`).toBeDefined();
      for (const id of t.related ?? []) {
        expect(termById(id), `related ${id}`).toBeDefined();
        expect(id).not.toBe(t.id);
      }
      for (const s of termSources(t)) expect(SOURCE_IDS).toContain(s);
    });
  }

  it('every term links somewhere or explains a rule (so it can be learned visually or checked)', () => {
    const bare = GLOSSARY.filter((t) => !t.plays && !t.positions && !t.pitch && !t.related && !t.rule).map((t) => t.id);
    // A handful of plain-language terms are fine; flag if this grows.
    expect(bare.length).toBeLessThanOrEqual(12);
  });
});

describe('content: pitch explorer', () => {
  it('has unique ids and every layer has features', () => {
    const ids = PITCH_FEATURES.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of LAYERS) expect(PITCH_FEATURES.some((f) => f.layer === l.id), l.id).toBe(true);
  });

  for (const f of PITCH_FEATURES) {
    it(`${f.id}: has content, geometry and valid links`, () => {
      expect(f.what.length).toBeGreaterThan(10);
      expect(f.rules.length).toBeGreaterThan(0);
      expect(f.paths.length).toBeGreaterThan(0);
      for (const d of f.paths) {
        expect(d).toMatch(/^M /);
        expect(d).not.toMatch(/NaN|undefined/);
        // All coordinates stay on or right next to the pitch (goals stick out 1.2 m).
        const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
        for (const n of nums) {
          expect(n).toBeGreaterThanOrEqual(-PITCH.goalDepth - 1);
          expect(n).toBeLessThanOrEqual(PITCH.length + PITCH.goalDepth + 1);
        }
      }
      for (const id of f.terms ?? []) expect(termById(id), `term ${id}`).toBeDefined();
      for (const id of f.plays ?? []) expect(playById(id), `play ${id}`).toBeDefined();
    });
  }
});

describe('content: formations', () => {
  for (const f of FORMATIONS) {
    it(`${f.name}: places every player on our half of the pitch with a label`, () => {
      for (const r of ALL_POSITIONS) {
        const s = f.slots[r];
        expect(s, r).toBeDefined();
        expect(s.label.length).toBeGreaterThan(0);
        expect(s.at.x).toBeGreaterThan(0);
        expect(s.at.x).toBeLessThan(PITCH.length / 2 + 15);
        expect(s.at.y).toBeGreaterThan(0);
        expect(s.at.y).toBeLessThan(PITCH.width);
      }
      expect(termById(f.term), f.term).toBeDefined();
    });
  }

  it('old names map onto real positions', () => {
    for (const n of OLD_NAMES) for (const r of n.roles) expect(ALL_POSITIONS).toContain(r);
  });
});

describe('content: plays coverage', () => {
  it('has about 20 plays covering every category', () => {
    expect(PLAYS.length).toBeGreaterThanOrEqual(20);
    const cats = new Set(PLAYS.map((p) => p.category));
    expect(cats.size).toBe(6);
  });

  it('every position page links to at least two plays', () => {
    for (const g of GUIDES) expect(linkedPlays(g).length, g.id).toBeGreaterThanOrEqual(2);
  });
});
