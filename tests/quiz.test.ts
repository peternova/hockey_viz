import { describe, expect, it } from 'vitest';
import { GLOSSARY, termById } from '../src/content/glossary';
import { PITCH_FEATURES } from '../src/content/pitch';
import { playById } from '../src/content/plays';
import { GUIDES, guideForRole } from '../src/content/positions';
import { DEFAULT_NEAR, RULE_QUESTIONS, WHERE_QUESTIONS, wherePlayers } from '../src/content/quiz';
import { SOURCE_IDS } from '../src/content/sources';
import { dist, distToPolygon, pointInPolygon, strip } from '../src/engine/geometry';
import { PITCH } from '../src/pitch/coords';
import {
  definitionQuestion,
  maskTerm,
  namesOf,
  pickFresh,
  pictureQuestion,
  ruleQuestion,
  rulesRound,
  termsRound,
} from '../src/features/quiz/questions';
import { emptyProgress, parseProgress, withAnswer, withWhere } from '../src/lib/progress';

/** Small seeded random number generator so generated rounds are repeatable. */
function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

describe('geometry', () => {
  const square = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  it('finds points inside and outside a polygon', () => {
    expect(pointInPolygon({ x: 5, y: 5 }, square)).toBe(true);
    expect(pointInPolygon({ x: 11, y: 5 }, square)).toBe(false);
  });
  it('measures distance to the nearest edge (0 inside)', () => {
    expect(distToPolygon({ x: 5, y: 5 }, square)).toBe(0);
    expect(distToPolygon({ x: 13, y: 5 }, square)).toBeCloseTo(3);
    expect(distToPolygon({ x: 13, y: 14 }, square)).toBeCloseTo(5);
  });
  it('builds a strip along a line', () => {
    const s = strip({ x: 0, y: 0 }, { x: 10, y: 0 }, 2, 5, 1);
    expect(pointInPolygon({ x: 3, y: 0 }, s)).toBe(true);
    expect(pointInPolygon({ x: 1, y: 0 }, s)).toBe(false);
    expect(pointInPolygon({ x: 3, y: 1.5 }, s)).toBe(false);
  });
});

describe('content: "Where should I be?"', () => {
  it('has about a dozen situations with unique ids', () => {
    expect(WHERE_QUESTIONS.length).toBeGreaterThanOrEqual(12);
    expect(new Set(WHERE_QUESTIONS.map((q) => q.id)).size).toBe(WHERE_QUESTIONS.length);
  });

  it('covers every position guide at least once', () => {
    const covered = new Set(WHERE_QUESTIONS.map((q) => guideForRole(q.you)?.id));
    for (const g of GUIDES) expect(covered, g.id).toContain(g.id);
  });

  it.each(WHERE_QUESTIONS.map((q) => [q.id, q] as const))('%s is complete and sensible', (_id, q) => {
    const players = wherePlayers(q);
    const you = players.find((p) => p.id === q.you);
    expect(you?.team).toBe('us');

    // Ball: a carrier who is on the pitch and isn't you, or a point on the pitch.
    if ('with' in q.ball) {
      expect(q.pos[q.ball.with], q.ball.with).toBeDefined();
      expect(q.ball.with).not.toBe(q.you);
    }

    // Everyone on (or just off) the pitch, and not on top of each other.
    const ids = Object.keys(q.pos);
    for (const id of ids) {
      const p = q.pos[id];
      expect(p.x, id).toBeGreaterThanOrEqual(-1.5);
      expect(p.x, id).toBeLessThanOrEqual(PITCH.length + 1.5);
      expect(p.y, id).toBeGreaterThanOrEqual(0);
      expect(p.y, id).toBeLessThanOrEqual(PITCH.width);
    }
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        expect(dist(q.pos[ids[i]], q.pos[ids[j]]), `${ids[i]} / ${ids[j]}`).toBeGreaterThanOrEqual(3);
      }
    }

    // The answer: the ideal spot is inside the zone; where you start isn't even close.
    expect(q.answer.zone.length).toBeGreaterThanOrEqual(3);
    expect(pointInPolygon(q.answer.ideal, q.answer.zone)).toBe(true);
    expect(distToPolygon(q.pos[q.you], q.answer.zone)).toBeGreaterThan(q.near ?? DEFAULT_NEAR);

    // Links and sources resolve.
    for (const id of q.plays ?? []) expect(playById(id), id).toBeDefined();
    for (const id of q.terms ?? []) expect(termById(id), id).toBeDefined();
    expect(q.sources.length).toBeGreaterThan(0);
    for (const s of q.sources) expect(SOURCE_IDS.has(s), s).toBe(true);
    expect(q.explain.length).toBeGreaterThan(80);
  });
});

describe('content: rules true/false', () => {
  it('has unique ids, a rule reference and a glossary link each', () => {
    expect(new Set(RULE_QUESTIONS.map((r) => r.id)).size).toBe(RULE_QUESTIONS.length);
    for (const r of RULE_QUESTIONS) {
      expect(r.rule, r.id).toMatch(/^\d+\.\d+/);
      if (r.term) expect(termById(r.term), r.term).toBeDefined();
    }
  });
  it('mixes true and false statements', () => {
    const t = RULE_QUESTIONS.filter((r) => r.answer).length;
    expect(t / RULE_QUESTIONS.length).toBeGreaterThan(0.3);
    expect(t / RULE_QUESTIONS.length).toBeLessThan(0.7);
  });
});

describe('question generator', () => {
  it('hides a term inside its own definition', () => {
    expect(maskTerm('An overlap is when overlaps happen.', ['Overlap'])).toBe('An … is when … happen.');
    expect(maskTerm('Play the long corner.', ['Long corner', 'Corner'])).toBe('Play the ….');
    expect(maskTerm('A dragging flick, pushing it.', ['Drag', 'Push'])).toBe('A … flick, … it.');
    expect(maskTerm('Disadvantaged, in the middle.', ['Advantage', 'Mid'])).toBe('Disadvantaged, in the middle.');
  });

  it.each(GLOSSARY.map((t) => [t.id, t] as const))('definition question for %s', (_id, t) => {
    const q = definitionQuestion(t, seeded(3));
    expect(q.options).toHaveLength(4);
    expect(new Set(q.options).size).toBe(4);
    expect(q.options[q.answer]).toBe(t.term);
    // Nothing left to hide: no name (or simple form of it) survives in the prompt.
    expect(maskTerm(q.prompt, namesOf(t))).toBe(q.prompt);
    expect(q.prompt).not.toMatch(new RegExp(`\\b${t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
  });

  it.each(PITCH_FEATURES.map((f) => [f.id, f] as const))('picture question for %s', (_id, f) => {
    const q = pictureQuestion(f, seeded(5));
    expect(q.options).toHaveLength(4);
    expect(new Set(q.options).size).toBe(4);
    expect(q.options[q.answer]).toBe(f.name);
  });

  it('turns rules into true/false questions', () => {
    for (const r of RULE_QUESTIONS) {
      const q = ruleQuestion(r);
      expect(q.options[q.answer]).toBe(r.answer ? 'True' : 'False');
    }
  });

  it('builds rounds of ten without repeats', () => {
    const t = termsRound(emptyProgress(), seeded(7));
    expect(t).toHaveLength(10);
    expect(new Set(t.map((q) => q.key)).size).toBe(10);
    expect(t.some((q) => q.kind === 'picture')).toBe(true);
    const r = rulesRound(emptyProgress(), seeded(7));
    expect(r).toHaveLength(10);
    expect(new Set(r.map((q) => q.key)).size).toBe(10);
  });

  it('asks the ones you haven’t got right first', () => {
    let p = emptyProgress();
    for (const r of RULE_QUESTIONS.slice(0, RULE_QUESTIONS.length - 3)) p = withAnswer(p, `rule:${r.id}`, true);
    const picked = pickFresh(RULE_QUESTIONS, (r) => `rule:${r.id}`, p, 3, seeded(9)).map((r) => r.id);
    expect(new Set(picked)).toEqual(new Set(RULE_QUESTIONS.slice(-3).map((r) => r.id)));
  });
});

describe('progress', () => {
  it('keeps the best "where" result and counts tries', () => {
    let p = emptyProgress();
    p = withWhere(p, 'a', 'close');
    p = withWhere(p, 'a', 'miss');
    expect(p.where.a).toEqual({ best: 'close', tries: 2 });
    p = withWhere(p, 'a', 'spot');
    expect(p.where.a).toEqual({ best: 'spot', tries: 3 });
  });
  it('counts right and wrong answers', () => {
    let p = emptyProgress();
    p = withAnswer(p, 'rule:x', false);
    p = withAnswer(p, 'rule:x', true);
    expect(p.answers['rule:x']).toEqual({ right: 1, wrong: 1 });
  });
  it('survives missing or broken saved data', () => {
    expect(parseProgress(null)).toEqual(emptyProgress());
    expect(parseProgress('not json')).toEqual(emptyProgress());
    expect(parseProgress('{"v":2}')).toEqual(emptyProgress());
    const saved = JSON.stringify(withWhere(emptyProgress(), 'w', 'spot'));
    expect(parseProgress(saved).where.w.best).toBe('spot');
  });
});
