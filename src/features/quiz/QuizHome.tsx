import { RULE_QUESTIONS, WHERE_QUESTIONS } from '../../content/quiz';
import { href } from '../../lib/router';
import { useProgress } from '../../lib/progress';
import { RULE_KEYS, TERM_KEYS, knownCount } from './questions';

function Meter({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span className="meter">
      <span className="meter__bar" aria-hidden="true">
        <span style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </span>
      <span className="meter__text">{label}</span>
    </span>
  );
}

export function QuizHome() {
  const { progress, reset } = useProgress();
  const spotOn = WHERE_QUESTIONS.filter((q) => progress.where[q.id]?.best === 'spot').length;
  const terms = knownCount(progress, TERM_KEYS);
  const rules = knownCount(progress, RULE_KEYS);
  const anything = Object.keys(progress.where).length + Object.keys(progress.answers).length > 0;

  const quizzes = [
    {
      to: href('quiz', 'where'),
      title: 'Where should I be?',
      text: 'A game moment is frozen. Drag your player to where you’d be, then see the best area and why.',
      meter: { value: spotOn, max: WHERE_QUESTIONS.length, label: `${spotOn} of ${WHERE_QUESTIONS.length} spot on` },
    },
    {
      to: href('quiz', 'terms'),
      title: 'Name it',
      text: 'Pitch markings and hockey words: pick the right name from four. Ten questions a round.',
      meter: { value: terms, max: TERM_KEYS.length, label: `${terms} of ${TERM_KEYS.length} known` },
    },
    {
      to: href('quiz', 'rules'),
      title: 'Rules: true or false?',
      text: 'Quick statements about the FIH rules, with the rule number and what it really says.',
      meter: { value: rules, max: RULE_QUESTIONS.length, label: `${rules} of ${RULE_QUESTIONS.length} right` },
    },
  ];

  return (
    <article className="page">
      <header className="page__header">
        <h1>Quiz</h1>
        <p className="lede">Test what you’ve watched. Each round starts with the ones you haven’t got yet.</p>
      </header>

      <ul className="card-grid">
        {quizzes.map((z) => (
          <li key={z.title}>
            <a className="card" href={z.to}>
              <span className="card__title">{z.title}</span>
              <span className="card__text">{z.text}</span>
              <Meter {...z.meter} />
            </a>
          </li>
        ))}
      </ul>

      <p className="muted small">
        Your progress is saved in this browser on this device only. Nothing is sent anywhere.{' '}
        {anything ? (
          <button
            type="button"
            className="linkish"
            onClick={() => {
              if (window.confirm('Clear all your quiz progress on this device?')) reset();
            }}
          >
            Clear my progress
          </button>
        ) : null}
      </p>
    </article>
  );
}
