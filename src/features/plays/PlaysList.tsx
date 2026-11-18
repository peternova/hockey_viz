import { useState } from 'react';
import { CATEGORY_LABEL, CATEGORY_ORDER, PLAYS } from '../../content/plays';
import { GUIDES, guideById, linkedPlays } from '../../content/positions';
import { href } from '../../lib/router';
import { TEAM_PLAYS } from '../board/teamPlays';
import { TeamPlayCards } from './TeamPlayCards';

const STORAGE_KEY = 'hockeyiq.plays.position';

function readSaved(): string {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY) ?? '';
    return guideById(v) ? v : '';
  } catch {
    return '';
  }
}

export function PlaysList() {
  const [pos, setPos] = useState<string>(readSaved);
  const guide = pos ? guideById(pos) : undefined;
  const plays = guide ? linkedPlays(guide) : PLAYS;

  function choose(v: string) {
    setPos(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* storage unavailable: the filter just won't be remembered */
    }
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1>Plays</h1>
        <p className="lede">
          {PLAYS.length} animated moves you can play, pause, step through and slow down. Pick a player to follow and
          watch their trail.
        </p>
      </header>

      <label className="filter">
        Show plays for{' '}
        <select value={pos} onChange={(e) => choose(e.target.value)}>
          <option value="">Every position</option>
          {GUIDES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </label>
      {guide ? (
        <p className="muted">
          {plays.length} plays feature the {guide.name.toLowerCase()}.{' '}
          <a href={href('positions', guide.id)}>Read the {guide.name.toLowerCase()} guide →</a>
        </p>
      ) : null}

      {!guide && TEAM_PLAYS.length ? (
        <section aria-labelledby="cat-team">
          <h2 id="cat-team">Our team’s plays</h2>
          <TeamPlayCards plays={TEAM_PLAYS} />
        </section>
      ) : null}

      {CATEGORY_ORDER.map((cat) => {
        const inCat = plays.filter((p) => p.category === cat);
        if (!inCat.length) return null;
        return (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <h2 id={`cat-${cat}`}>{CATEGORY_LABEL[cat]}</h2>
            <ul className="card-grid">
              {inCat.map((p) => (
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
      })}
    </section>
  );
}
