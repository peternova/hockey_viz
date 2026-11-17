import { PLAYS, playById } from '../../content/plays';
import { GLOSSARY } from '../../content/glossary';
import { href } from '../../lib/router';
import { PositionGrid } from '../positions/PositionGrid';

const START_HERE = ['s1-team-shape', 's2-shifting', 'd1-channelling', 'a1-overlap'];

const EXPLORE = [
  {
    to: href('formations'),
    title: 'Formations',
    text: '4-3-3, the sweeper system and the old 2-3-5 side by side, and where names like “left half” come from.',
  },
  {
    to: href('pitch'),
    title: 'Pitch Explorer',
    text: 'Tap any line, mark or area of the pitch to learn its name and the rules that apply there.',
  },
  {
    to: href('glossary'),
    title: 'Glossary',
    text: `${GLOSSARY.length} terms in Australian/NZ wording, with the US, UK and older names.`,
  },
];

const COMING = [{ name: 'Tactics board', what: 'Draw and animate your own plays' }];

export function Home() {
  const startPlays = START_HERE.map((id) => playById(id)).filter((p) => p !== undefined);
  return (
    <section className="page">
      <header className="page__header">
        <h1>Learn hockey by watching it move</h1>
        <p className="lede">
          Positions, tactics and terminology for 11-a-side hockey, shown as animations you can pause, slow down and
          step through.
        </p>
      </header>

      <h2>Pick your position</h2>
      <PositionGrid />

      <h2>Start with these plays</h2>
      <ul className="card-grid">
        {startPlays.map((p) => (
          <li key={p.id}>
            <a className="card" href={href('plays', p.id)}>
              <span className="card__title">{p.title}</span>
              <span className="card__text">{p.summary}</span>
            </a>
          </li>
        ))}
      </ul>
      <p>
        <a href={href('plays')}>All {PLAYS.length} plays: build-up, attack, defence, transition and set pieces →</a>
      </p>

      <h2>Test yourself</h2>
      <a className="card card--wide" href={href('quiz', 'where')}>
        <span className="card__title">Where should I be?</span>
        <span className="card__text">
          A moment from a game is frozen. Drag your player to where you’d be, then see the best area and why. Plus
          quick quizzes on hockey words and the rules.
        </span>
      </a>

      <h2>Explore</h2>
      <ul className="card-grid">
        {EXPLORE.map((e) => (
          <li key={e.title}>
            <a className="card" href={e.to}>
              <span className="card__title">{e.title}</span>
              <span className="card__text">{e.text}</span>
            </a>
          </li>
        ))}
      </ul>

      <h2>Coming next</h2>
      <ul className="coming">
        {COMING.map((c) => (
          <li key={c.name}>
            <strong>{c.name}</strong> — {c.what}
          </li>
        ))}
      </ul>

      <aside className="note">
        <strong>How to read the animations:</strong> round amber tokens are <em>us</em> and we always attack →
        (or ↑ on a phone). Square blue tokens are <em>them</em>. The white dot is the ball. Content marked{' '}
        <span className="badge badge--draft">Draft</span> hasn’t been checked by a coach yet.
      </aside>
    </section>
  );
}
