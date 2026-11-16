import { PlayViewer } from '../../engine/PlayViewer';
import type { Play } from '../../engine/types';
import { sourceById } from '../../content/sources';
import { CATEGORY_LABEL } from '../../content/plays';
import { guideForRole } from '../../content/positions';
import { href } from '../../lib/router';

export function PlayPage({ play }: { play: Play }) {
  return (
    <article className="page">
      <a className="back-link" href={href('plays')}>
        ← All plays
      </a>
      <header className="page__header">
        <div className="eyebrow">
          {CATEGORY_LABEL[play.category]}
          {!play.reviewed ? (
            <span className="badge badge--draft" title="Not yet checked by a player or coach">
              Draft
            </span>
          ) : null}
        </div>
        <h1>{play.title}</h1>
        <p className="lede">{play.summary}</p>
      </header>

      <PlayViewer play={play} />

      {play.variesByCoach ? (
        <aside className="note">
          <strong>Varies by coach:</strong> {play.variesByCoach}
        </aside>
      ) : null}

      <section className="meta">
        <h2>Most useful for</h2>
        <ul className="chips">
          {[...new Set(play.featuredRoles.map((r) => guideForRole(r)).filter((g) => g !== undefined))].map((g) => (
            <li key={g.id}>
              <a className="chip" href={href('positions', g.id)}>
                {g.name}
              </a>
            </li>
          ))}
        </ul>
        <h2>Sources</h2>
        <ul>
          {play.sources.map((id) => {
            const s = sourceById(id);
            if (!s) return <li key={id}>{id}</li>;
            return <li key={id}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}</li>;
          })}
        </ul>
      </section>
    </article>
  );
}
