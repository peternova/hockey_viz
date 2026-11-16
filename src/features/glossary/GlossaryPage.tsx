import { useEffect, useMemo, useState } from 'react';
import { CATEGORY_LABELS, GLOSSARY, termById, type GlossaryTerm, type TermCategory } from '../../content/glossary';
import { pitchFeatureById } from '../../content/pitch';
import { playById } from '../../content/plays';
import { guideById } from '../../content/positions';
import { href } from '../../lib/router';

type Filter = TermCategory | 'all';

const SORTED = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'en', { numeric: true }));

function matches(t: GlossaryTerm, q: string): boolean {
  if (!q) return true;
  const hay = [t.term, ...(t.aka ?? []), t.def].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

/** "Terminology, 9.9" → "Defined in the FIH Rules · Rule 9.9". */
function ruleLabel(rule: string): string {
  if (!rule.startsWith('Terminology')) return `FIH Rule ${rule}`;
  const rest = rule.replace(/^Terminology,?\s*/, '');
  return rest ? `Defined in the FIH Rules · Rule ${rest}` : 'Defined in the FIH Rules';
}

function TermCard({ t, focused }: { t: GlossaryTerm; focused: boolean }) {
  const feature = t.pitch ? pitchFeatureById(t.pitch) : undefined;
  const links: { label: string; to: string; kind: string }[] = [
    ...(t.plays ?? []).flatMap((id) => {
      const p = playById(id);
      return p ? [{ label: p.title, to: href('plays', id), kind: 'Watch' }] : [];
    }),
    ...(t.positions ?? []).flatMap((id) => {
      const g = guideById(id);
      return g ? [{ label: g.name, to: href('positions', id), kind: 'Position' }] : [];
    }),
    ...(feature ? [{ label: feature.name, to: href('pitch', feature.id), kind: 'On the pitch' }] : []),
    ...(t.related ?? []).flatMap((id) => {
      const r = termById(id);
      return r ? [{ label: r.term, to: href('glossary', id), kind: 'See also' }] : [];
    }),
  ];
  return (
    <li id={`term-${t.id}`} className={focused ? 'term term--focus' : 'term'} tabIndex={-1}>
      <div className="term__head">
        <h3 className="term__name">{t.term}</h3>
        <span className="tag">{CATEGORY_LABELS[t.category]}</span>
      </div>
      {t.aka?.length ? <p className="aka">Also: {t.aka.join(' · ')}</p> : null}
      <p className="term__def">{t.def}</p>
      {t.rule ? <p className="rule-ref">{ruleLabel(t.rule)}</p> : null}
      {links.length ? (
        <ul className="term__links">
          {links.map((l) => (
            <li key={l.kind + l.to}>
              <span className="muted">{l.kind}:</span> <a href={l.to}>{l.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function GlossaryPage({ focus }: { focus?: string }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Filter>('all');

  // Arriving at #/glossary/<id>: clear filters so the term is visible, then scroll to it.
  useEffect(() => {
    if (!focus) return;
    setQ('');
    setCat('all');
    const id = window.setTimeout(() => {
      const el = document.getElementById(`term-${focus}`);
      el?.scrollIntoView({ block: 'center' });
      el?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(id);
  }, [focus]);

  const shown = useMemo(() => SORTED.filter((t) => (cat === 'all' || t.category === cat) && matches(t, q)), [q, cat]);
  const filters: Filter[] = ['all', 'pitch', 'rules', 'positions', 'skills', 'tactics'];

  return (
    <article className="page">
      <header className="page__header">
        <h1>Glossary</h1>
        <p className="lede">
          {GLOSSARY.length} hockey words, in Australian/NZ wording first, with the US, UK and older names you might
          also hear.
        </p>
      </header>

      <div className="glossary__tools">
        <label className="search">
          <span className="visually-hidden">Search the glossary</span>
          <input
            type="search"
            placeholder="Search, e.g. “obstruction” or “one-two”"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <div className="seg-group" role="group" aria-label="Category">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              className={cat === f ? 'seg seg--on' : 'seg'}
              aria-pressed={cat === f}
              onClick={() => setCat(f)}
            >
              {f === 'all' ? 'All' : CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <p className="muted" aria-live="polite">
        {shown.length === GLOSSARY.length ? 'Showing every term.' : `Showing ${shown.length} of ${GLOSSARY.length}.`}
      </p>

      {shown.length ? (
        <ul className="terms">
          {shown.map((t) => (
            <TermCard key={t.id} t={t} focused={t.id === focus} />
          ))}
        </ul>
      ) : (
        <p>No terms match. Try a shorter word.</p>
      )}

      <p className="muted small">
        Rule numbers refer to the FIH Rules of Hockey 2027. Definitions of tactics and skills are drafted from common
        coaching usage and haven’t been checked by a coach yet.
      </p>
    </article>
  );
}
