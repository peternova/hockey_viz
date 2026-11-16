import { useState } from 'react';
import { LAYERS, PITCH_FEATURES, pitchFeatureById, type PitchFeature, type PitchLayer } from '../../content/pitch';
import { termById } from '../../content/glossary';
import { playById } from '../../content/plays';
import { Pitch } from '../../pitch/Pitch';
import { href } from '../../lib/router';
import { useAutoOrientation } from '../../lib/useMedia';

const DEFAULT_ID = 'circle';

function FeatureShape({ f, on, onSelect }: { f: PitchFeature; on: boolean; onSelect: () => void }) {
  const cls = `pf pf--${f.draw}${on ? ' pf--on' : ''}`;
  return (
    <g className={cls} onClick={onSelect} aria-hidden="true">
      {f.paths.map((d, i) => (
        <g key={i}>
          {/* What you see */}
          <path className="pf__shape" d={d} fillRule={f.evenOdd ? 'evenodd' : undefined} />
          {/* A larger, invisible target so thin lines and small marks are easy to tap */}
          {f.draw !== 'fill' ? <path className="pf__hit" d={d} /> : null}
        </g>
      ))}
    </g>
  );
}

export function PitchExplorer({ initial }: { initial?: string }) {
  const orientation = useAutoOrientation();
  const start = (initial && pitchFeatureById(initial)) || pitchFeatureById(DEFAULT_ID)!;
  const [layer, setLayer] = useState<PitchLayer>(start.layer);
  const [selectedId, setSelectedId] = useState(start.id);
  const selected = pitchFeatureById(selectedId) ?? start;
  const features = PITCH_FEATURES.filter((f) => f.layer === layer);
  const layerLabel = LAYERS.find((l) => l.id === layer)?.label;

  function select(id: string) {
    setSelectedId(id);
    try {
      // Update the address so the page can be shared, without re-rendering the route.
      window.history.replaceState(null, '', href('pitch', id));
    } catch {
      /* ignore (e.g. sandboxed previews) */
    }
  }

  function chooseLayer(l: PitchLayer) {
    setLayer(l);
    const first = PITCH_FEATURES.find((f) => f.layer === l);
    if (first) select(first.id);
  }

  // Smaller areas are drawn on top so they stay tappable; the highlight is a
  // separate overlay that doesn't block taps on anything underneath.
  const ordered = [...features].sort((a, b) => (a.z ?? 0) - (b.z ?? 0));

  return (
    <article className="page">
      <header className="page__header">
        <h1>Pitch Explorer</h1>
        <p className="lede">Tap any line, mark or area to see what it’s called and which rules apply there.</p>
      </header>

      <div className="explorer">
        <div className="explorer__pitch">
          <div className="seg-group" role="group" aria-label="Show">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className={l.id === layer ? 'seg seg--on' : 'seg'}
                aria-pressed={l.id === layer}
                onClick={() => chooseLayer(l.id)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className={`viewer__stage viewer__stage--${orientation}`}>
            <Pitch
              orientation={orientation}
              ariaLabel={`Pitch with ${selected.name} highlighted`}
              underlay={
                <g className={`explorer__layer explorer__layer--${layer}`}>
                  {ordered.map((f) => (
                    <FeatureShape key={f.id} f={f} on={false} onSelect={() => select(f.id)} />
                  ))}
                  <g className="pf-overlay">
                    <FeatureShape f={selected} on onSelect={() => undefined} />
                  </g>
                </g>
              }
            />
            <div className="viewer__direction" aria-hidden="true">
              {orientation === 'landscape' ? 'Our attack →' : 'Our attack ↑'}
            </div>
          </div>
          <ul className="chips explorer__list" aria-label={layerLabel}>
            {features.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className={f.id === selected.id ? 'chip chip--on' : 'chip'}
                  aria-pressed={f.id === selected.id}
                  onClick={() => select(f.id)}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <section className="explorer__info" aria-live="polite" aria-labelledby="feature-name">
          <div className="eyebrow">{LAYERS.find((l) => l.id === selected.layer)?.label}</div>
          <h2 id="feature-name">{selected.name}</h2>
          {selected.aka ? <p className="aka">Also called: {selected.aka.join(' · ')}</p> : null}
          <p>{selected.what}</p>
          <h3>Rules here</h3>
          <ul className="bullets">
            {selected.rules.map((r) => (
              <li key={r.text}>
                {r.text} {r.rule ? <span className="rule-ref">Rule {r.rule}</span> : null}
              </li>
            ))}
          </ul>
          {selected.terms?.length ? (
            <>
              <h3>Words to know</h3>
              <ul className="chips">
                {selected.terms.map((id) => {
                  const t = termById(id);
                  return t ? (
                    <li key={id}>
                      <a className="chip" href={href('glossary', id)}>
                        {t.term}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </>
          ) : null}
          {selected.plays?.length ? (
            <>
              <h3>See it in a play</h3>
              <ul className="chips">
                {selected.plays.map((id) => {
                  const p = playById(id);
                  return p ? (
                    <li key={id}>
                      <a className="chip" href={href('plays', id)}>
                        {p.title}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </>
          ) : null}
        </section>
      </div>

      <p className="muted small">
        Measurements and rule numbers are from the FIH Rules of Hockey 2027 (international from 1 November 2026). Your
        local competition may adopt them later.
      </p>
    </article>
  );
}
