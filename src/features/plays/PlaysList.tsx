import { CATEGORY_LABEL, PLAYS } from '../../content/plays';
import { href } from '../../lib/router';

export function PlaysList() {
  return (
    <section className="page">
      <header className="page__header">
        <h1>Plays</h1>
        <p className="lede">
          Animated moves you can play, pause, step through and slow down. Pick a player to follow and watch their
          trail.
        </p>
      </header>
      <ul className="card-grid">
        {PLAYS.map((p) => (
          <li key={p.id}>
            <a className="card" href={href('plays', p.id)}>
              <span className="eyebrow">
                {CATEGORY_LABEL[p.category]}
                {!p.reviewed ? <span className="badge badge--draft">Draft</span> : null}
              </span>
              <span className="card__title">{p.title}</span>
              <span className="card__text">{p.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
