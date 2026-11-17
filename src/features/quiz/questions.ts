import { GLOSSARY, termById, type GlossaryTerm } from '../../content/glossary';
import { PITCH_FEATURES, type PitchFeature } from '../../content/pitch';
import { RULE_QUESTIONS, type RuleQuestion } from '../../content/quiz';
import { href } from '../../lib/router';
import type { Progress } from '../../lib/progress';

/** One multiple-choice (or true/false) question, ready to show. */
export interface ChoiceQuestion {
  /** Progress key: "pic:<feature>", "def:<term>" or "rule:<id>". */
  key: string;
  kind: 'picture' | 'definition' | 'rule';
  prompt: string;
  /** Pitch feature to highlight on a small pitch (picture questions). */
  feature?: string;
  options: string[];
  /** Index of the right option. */
  answer: number;
  /** Shown after answering. */
  explain: string;
  rule?: string;
  link?: { label: string; to: string };
}

export type Rng = () => number;

export function shuffle<T>(xs: readonly T[], rng: Rng): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A term's own names: the term plus aliases, without notes like "(US)". */
export function namesOf(t: GlossaryTerm): string[] {
  return [t.term, ...(t.aka ?? [])].map((n) => n.replace(/\s*\(.*?\)\s*/g, ' ').trim()).filter((n) => n.length > 1);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Hide a term's names inside a sentence, so its definition doesn't give it
 * away. Also catches simple word forms: "overlaps", "pushing", "dragging".
 */
export function maskTerm(text: string, names: string[]): string {
  let out = text;
  for (const n of [...names].sort((a, b) => b.length - a.length)) {
    const last = escapeRe(n.slice(-1));
    const re = new RegExp(`(?<![A-Za-z0-9])${escapeRe(n)}(?:${last})?(?:s|es|ed|ing|ers?)?(?![A-Za-z0-9])`, 'gi');
    out = out.replace(re, '…');
  }
  return out;
}

function choices<T>(right: T, pool: T[], label: (t: T) => string, rng: Rng, n = 4) {
  const seen = new Set([label(right)]);
  const wrong: T[] = [];
  for (const t of shuffle(pool, rng)) {
    if (wrong.length >= n - 1) break;
    if (seen.has(label(t))) continue;
    seen.add(label(t));
    wrong.push(t);
  }
  const options = shuffle([right, ...wrong], rng).map(label);
  return { options, answer: options.indexOf(label(right)) };
}

export function pictureQuestion(f: PitchFeature, rng: Rng): ChoiceQuestion {
  const sameLayer = PITCH_FEATURES.filter((x) => x.id !== f.id && x.layer === f.layer);
  const pool = sameLayer.length >= 3 ? sameLayer : PITCH_FEATURES.filter((x) => x.id !== f.id);
  const { options, answer } = choices(f, pool, (x) => x.name, rng);
  return {
    key: `pic:${f.id}`,
    kind: 'picture',
    prompt: f.draw === 'fill' ? 'What’s the highlighted area called?' : 'What’s the highlighted marking called?',
    feature: f.id,
    options,
    answer,
    explain: f.what,
    link: { label: `${f.name} in the Pitch Explorer`, to: href('pitch', f.id) },
  };
}

export function definitionQuestion(t: GlossaryTerm, rng: Rng): ChoiceQuestion {
  const sameCat = GLOSSARY.filter((x) => x.id !== t.id && x.category === t.category);
  const { options, answer } = choices(t, sameCat, (x) => x.term, rng);
  return {
    key: `def:${t.id}`,
    kind: 'definition',
    prompt: maskTerm(t.def, namesOf(t)),
    options,
    answer,
    explain: t.def,
    rule: t.rule && !t.rule.startsWith('Terminology') ? t.rule : undefined,
    link: { label: `${t.term} in the glossary`, to: href('glossary', t.id) },
  };
}

export function ruleQuestion(r: RuleQuestion): ChoiceQuestion {
  const term = r.term ? termById(r.term) : undefined;
  return {
    key: `rule:${r.id}`,
    kind: 'rule',
    prompt: r.statement,
    options: ['True', 'False'],
    answer: r.answer ? 0 : 1,
    explain: `${r.answer ? 'True' : 'False'}. ${r.explain}`,
    rule: r.rule,
    link: term ? { label: `${term.term} in the glossary`, to: href('glossary', term.id) } : undefined,
  };
}

/**
 * Pick n items, the ones you know least first: never answered right, then
 * fewest right answers. Random within each group, so rounds vary.
 */
export function pickFresh<T>(items: readonly T[], key: (t: T) => string, progress: Progress, n: number, rng: Rng): T[] {
  const score = (t: T) => {
    const a = progress.answers[key(t)];
    return a ? a.right : -1;
  };
  return shuffle(items, rng)
    .map((t, i) => ({ t, s: score(t), i }))
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .slice(0, n)
    .map((x) => x.t);
}

/** A "Name it" round: pitch pictures and definitions, mixed. */
export function termsRound(progress: Progress, rng: Rng = Math.random, n = 10): ChoiceQuestion[] {
  const nPics = Math.round(n * 0.4);
  const pics = pickFresh(PITCH_FEATURES, (f) => `pic:${f.id}`, progress, nPics, rng).map((f) => pictureQuestion(f, rng));
  const defs = pickFresh(GLOSSARY, (t) => `def:${t.id}`, progress, n - pics.length, rng).map((t) =>
    definitionQuestion(t, rng),
  );
  return shuffle([...pics, ...defs], rng);
}

export function rulesRound(progress: Progress, rng: Rng = Math.random, n = 10): ChoiceQuestion[] {
  return pickFresh(RULE_QUESTIONS, (r) => `rule:${r.id}`, progress, n, rng).map(ruleQuestion);
}

/** How many of a set you've answered right at least once. */
export function knownCount(progress: Progress, keys: string[]): number {
  return keys.filter((k) => (progress.answers[k]?.right ?? 0) > 0).length;
}

export const TERM_KEYS = [...PITCH_FEATURES.map((f) => `pic:${f.id}`), ...GLOSSARY.map((t) => `def:${t.id}`)];
export const RULE_KEYS = RULE_QUESTIONS.map((r) => `rule:${r.id}`);

