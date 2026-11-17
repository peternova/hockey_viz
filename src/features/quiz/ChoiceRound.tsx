import { useState } from 'react';
import { pitchFeatureById } from '../../content/pitch';
import { stageProps } from '../../engine/view';
import { AttackDirection, Pitch } from '../../pitch/Pitch';
import { FULL_VIEW } from '../../pitch/coords';
import { href } from '../../lib/router';
import { useProgress, type Progress } from '../../lib/progress';
import { useAutoOrientation } from '../../lib/useMedia';
import { FeatureShape } from '../pitch/FeatureShape';
import type { ChoiceQuestion } from './questions';

function Picture({ featureId }: { featureId: string }) {
  const orientation = useAutoOrientation();
  const f = pitchFeatureById(featureId);
  if (!f) return null;
  const stage = stageProps(orientation, FULL_VIEW);
  return (
    <div className={`${stage.className} round__picture`} style={stage.style}>
      <Pitch
        orientation={orientation}
        ariaLabel="Pitch with one marking or area highlighted"
        underlay={
          <g className="pf-overlay">
            <FeatureShape f={f} on />
          </g>
        }
      />
      <AttackDirection />
    </div>
  );
}

export function ChoiceRound({
  title,
  lede,
  makeRound,
}: {
  title: string;
  lede: string;
  makeRound: (p: Progress) => ChoiceQuestion[];
}) {
  const { progress, recordAnswer } = useProgress();
  const [round, setRound] = useState(() => makeRound(progress));
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= round.length;
  const q = round[i];

  const choose = (k: number) => {
    if (chosen !== null) return;
    setChosen(k);
    const ok = k === q.answer;
    if (ok) setScore((s) => s + 1);
    recordAnswer(q.key, ok);
  };

  const next = () => {
    setChosen(null);
    setI((n) => n + 1);
    window.scrollTo({ top: 0 });
  };

  const again = () => {
    setRound(makeRound(progress));
    setI(0);
    setChosen(null);
    setScore(0);
  };

  return (
    <article className="page round">
      <a className="back-link" href={href('quiz')}>
        ← All quizzes
      </a>
      <header className="page__header">
        <h1>{title}</h1>
        <p className="lede">{lede}</p>
      </header>

      {done ? (
        <section className="round__done" aria-live="polite">
          <h2>
            You got {score} of {round.length}
          </h2>
          <p>
            {score === round.length
              ? 'A perfect round.'
              : score >= round.length * 0.7
                ? 'Nicely done.'
                : 'Each round starts with the ones you haven’t got yet, so keep going.'}
          </p>
          <div className="wq__actions">
            <button type="button" className="btn btn--primary" onClick={again}>
              Play another round
            </button>
            <a className="btn" href={href('quiz')}>
              Back to quizzes
            </a>
          </div>
        </section>
      ) : (
        <section className="round__q" aria-labelledby="round-prompt">
          <div className="round__meta">
            <span>
              Question {i + 1} of {round.length}
            </span>
            <span>Score {score}</span>
          </div>
          <div className="round__bar" aria-hidden="true">
            <span style={{ width: `${(i / round.length) * 100}%` }} />
          </div>

          {q.feature ? <Picture featureId={q.feature} /> : null}

          <p id="round-prompt" className={q.kind === 'definition' ? 'round__prompt round__prompt--def' : 'round__prompt'}>
            {q.kind === 'definition' ? <span className="muted small">Which word means: </span> : null}
            {q.prompt}
          </p>

          <ul className={q.options.length === 2 ? 'round__options round__options--tf' : 'round__options'}>
            {q.options.map((o, k) => {
              const state =
                chosen === null ? '' : k === q.answer ? ' round__opt--right' : k === chosen ? ' round__opt--wrong' : ' round__opt--off';
              return (
                <li key={o}>
                  <button
                    type="button"
                    className={`round__opt${state}`}
                    onClick={() => choose(k)}
                    disabled={chosen !== null}
                    aria-describedby={chosen !== null ? 'round-feedback' : undefined}
                  >
                    {o}
                    {chosen !== null && k === q.answer ? <span className="visually-hidden"> (right answer)</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {chosen !== null ? (
            <div id="round-feedback" className="round__feedback" role="status">
              <p className={`verdict verdict--${chosen === q.answer ? 'spot' : 'miss'}`}>
                <strong>{chosen === q.answer ? 'Right!' : `Not quite: it’s “${q.options[q.answer]}”.`}</strong>
              </p>
              <p>{q.explain}</p>
              {q.rule ? <p className="rule-ref">FIH Rule {q.rule}</p> : null}
              {q.link ? (
                <p>
                  <a href={q.link.to}>{q.link.label} →</a>
                </p>
              ) : null}
              <button type="button" className="btn btn--primary" onClick={next} autoFocus>
                {i + 1 < round.length ? 'Next question →' : 'See my score'}
              </button>
            </div>
          ) : null}
        </section>
      )}
    </article>
  );
}
