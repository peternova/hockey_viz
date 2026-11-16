import { PLAYS } from '../../content/plays';
import { href } from '../../lib/router';
import { PositionGrid } from '../positions/PositionGrid';

const COMING = [
  { name: 'Glossary', what: 'Every term, in Australian/NZ wording, with US/UK alternatives' },
  { name: 'Pitch explorer', what: 'Tap any line or area of the pitch to learn its name and rules' },
  { name: '“Where should I be?” quiz', what: 'Drag your player to the right spot in a frozen game moment' },
  { name: 'Tactics board', what: 'Draw and animate your own plays' },
];

export function Home() {
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

      <h2>Watch a play</h2>
      <ul className="card-grid">
        {PLAYS.map((p) => (
          <li key={p.id}>
            <a className="card" href={href('plays', p.id)}>
              <span className="card__title">{p.title}</span>
              <span className="card__text">{p.summary}</span>
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
