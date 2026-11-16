import { LINE_LABEL, linkedPlays, type PositionGuide } from '../../content/positions';
import { CATEGORY_LABEL } from '../../content/plays';
import { sourceById } from '../../content/sources';
import { href } from '../../lib/router';
import { PositionGrid } from './PositionGrid';
import { PositionMap } from './PositionMap';

const MOMENTS: { key: keyof PositionGuide['moments']; title: string; icon: string }[] = [
  { key: 'haveBall', title: 'We have the ball', icon: '●' },
  { key: 'theyHaveBall', title: 'They have the ball', icon: '○' },
  { key: 'wonIt', title: 'We just won it', icon: '↗' },
  { key: 'lostIt', title: 'We just lost it', icon: '↩' },
];

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="bullets">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

export function PositionPage({ guide }: { guide: PositionGuide }) {
  const plays = linkedPlays(guide);
  const sideLabel = guide.side === 'centre' ? 'Centre' : guide.side === 'left' ? 'Left' : 'Right';
  return (
    <article className="page">
      <a className="back-link" href={href('positions')}>
        ← All positions
      </a>
      <header className="page__header">
        <div className="eyebrow">
          {LINE_LABEL[guide.line]}
          {guide.line !== 'goal' ? ` · ${sideLabel}` : ''}
          {!guide.reviewed ? (
            <span className="badge badge--draft" title="Not yet checked by a player or coach">
              Draft
            </span>
          ) : null}
        </div>
        <h1>{guide.name}</h1>
        <p className="aka">Also called: {guide.aka.join(' · ')}</p>
        <p className="lede">{guide.oneLiner}</p>
      </header>

      <section aria-labelledby="where">
        <h2 id="where">Where you play</h2>
        <PositionMap guide={guide} />
      </section>

      <section aria-labelledby="moments">
        <h2 id="moments">Your job in the four moments</h2>
        <div className="moments">
          {MOMENTS.map((m) => (
            <div className="moment" key={m.key}>
              <h3>
                <span className="moment__icon" aria-hidden="true">
                  {m.icon}
                </span>{' '}
                {m.title}
              </h3>
              <Bullets items={guide.moments[m.key]} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="side">
        <h2 id="side">{guide.side === 'centre' ? 'Left and right' : `Playing on the ${guide.side}`}</h2>
        <p className="muted">
          You can only play the ball with the flat (left) face of the stick, so the left and right sides of the pitch
          feel different.
        </p>
        <Bullets items={guide.sideSpecifics} />
      </section>

      <section aria-labelledby="set">
        <h2 id="set">Set pieces</h2>
        <dl className="setpieces">
          {guide.setPieces.map((s) => (
            <div key={s.name}>
              <dt>{s.name}</dt>
              <dd>{s.role}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="two-col">
        <section aria-labelledby="skills">
          <h2 id="skills">Key skills</h2>
          <Bullets items={guide.keySkills} />
        </section>
        <section aria-labelledby="mistakes">
          <h2 id="mistakes">Common mistakes</h2>
          <Bullets items={guide.mistakes} />
        </section>
      </div>

      <section className="smart" aria-labelledby="smart">
        <h2 id="smart">Play smart: tips for experienced players</h2>
        <Bullets items={guide.playSmart} />
      </section>

      {guide.variesByCoach ? (
        <aside className="note">
          <strong>Varies by coach:</strong> {guide.variesByCoach}
        </aside>
      ) : null}

      <section aria-labelledby="plays">
        <h2 id="plays">Watch it in action</h2>
        {plays.length ? (
          <ul className="card-grid">
            {plays.map((p) => (
              <li key={p.id}>
                <a className="card" href={href('plays', p.id)}>
                  <span className="eyebrow">{CATEGORY_LABEL[p.category]}</span>
                  <span className="card__title">{p.title}</span>
                  <span className="card__text">{p.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">More plays featuring this position are coming in the next milestone.</p>
        )}
      </section>

      <section aria-labelledby="other">
        <h2 id="other">Other positions</h2>
        <PositionGrid current={guide.id} compact />
      </section>

      <section className="meta" aria-labelledby="src">
        <h2 id="src">Sources</h2>
        <ul>
          {guide.sources.map((id) => {
            const s = sourceById(id);
            if (!s) return <li key={id}>{id}</li>;
            return (
              <li key={id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer">
                    {s.title}
                  </a>
                ) : (
                  s.title
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </article>
  );
}
