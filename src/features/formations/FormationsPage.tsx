import { useState } from 'react';
import { ALL_POSITIONS, FORMATIONS, OLD_NAMES, POSITION_NAME, type Formation } from '../../content/formations';
import { guideForRole } from '../../content/positions';
import { PlayerToken } from '../../engine/PlayerToken';
import { AttackDirection, Pitch } from '../../pitch/Pitch';
import { project } from '../../pitch/coords';
import { href } from '../../lib/router';
import { useAutoOrientation, usePrefersReducedMotion } from '../../lib/useMedia';
import { useMorph } from '../../lib/useMorph';
import type { PositionId } from '../../engine/types';

/** Players in reading order: back to front by line, then left to right. */
function byLine(f: Formation): PositionId[] {
  const sorted = [...ALL_POSITIONS].sort((a, b) => f.slots[a].at.x - f.slots[b].at.x);
  const lines: PositionId[][] = [];
  for (const r of sorted) {
    const line = lines[lines.length - 1];
    if (line && f.slots[r].at.x - f.slots[line[0]].at.x <= 6) line.push(r);
    else lines.push([r]);
  }
  return lines.flatMap((l) => l.sort((a, b) => f.slots[a].at.y - f.slots[b].at.y));
}

export function FormationsPage() {
  const orientation = useAutoOrientation();
  const reducedMotion = usePrefersReducedMotion();
  const [id, setId] = useState<Formation['id']>('f433');
  const [picked, setPicked] = useState<PositionId | null>(null);
  const f = FORMATIONS.find((x) => x.id === id) ?? FORMATIONS[0];
  const target = Object.fromEntries(ALL_POSITIONS.map((r) => [r, f.slots[r].at]));
  const shown = useMorph(target, 1.4, reducedMotion);

  return (
    <article className="page">
      <header className="page__header">
        <h1>Formations</h1>
        <p className="lede">
          Switch between formations and watch each player move. Every token is the same player, so you can see where
          today’s positions came from.
        </p>
      </header>

      <div className="formations">
        <div className="seg-group" role="group" aria-label="Formation">
          {FORMATIONS.map((x) => (
            <button
              key={x.id}
              type="button"
              className={x.id === id ? 'seg seg--on' : 'seg'}
              aria-pressed={x.id === id}
              onClick={() => setId(x.id)}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div className={`viewer__stage viewer__stage--${orientation}`}>
          <Pitch orientation={orientation} ariaLabel={`The ${f.name} formation`}>
            {ALL_POSITIONS.map((r) => (
              <g key={r} onClick={() => setPicked(r)} style={{ cursor: 'pointer' }}>
                <PlayerToken
                  at={project(shown[r], orientation)}
                  team="us"
                  label={f.slots[r].label}
                  highlighted={picked === r}
                  title={`${f.slots[r].name} (today: ${POSITION_NAME[r]})`}
                />
              </g>
            ))}
          </Pitch>
          <AttackDirection />
        </div>

        <p className="posmap__note" aria-live="polite">
          {picked ? (
            <>
              <strong>{f.slots[picked].name}</strong> in the {f.name}. Today’s equivalent:{' '}
              {guideForRole(picked) ? (
                <a href={href('positions', guideForRole(picked)!.id)}>{POSITION_NAME[picked]}</a>
              ) : (
                POSITION_NAME[picked]
              )}
              .
            </>
          ) : (
            <>Tap a player to see what they’re called in each formation.</>
          )}
        </p>
        <ul className="whoswho" aria-label={`Players in the ${f.name}`}>
          {byLine(f).map((r) => (
            <li key={r}>
              <button
                type="button"
                className={picked === r ? 'whoswho__btn whoswho__btn--on' : 'whoswho__btn'}
                aria-pressed={picked === r}
                onClick={() => setPicked(r)}
              >
                <span className="whoswho__label">{f.slots[r].label}</span> {f.slots[r].name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="about">
        <h2 id="about">
          {f.name} <span className="muted">· {f.aka}</span>
        </h2>
        <p>{f.summary}</p>
        <div className="two-col">
          <div>
            <h3>Strengths</h3>
            <ul className="bullets">
              {f.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Weaknesses</h3>
            <ul className="bullets">
              {f.weaknesses.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p>
          <a href={href('glossary', f.term)}>{f.name} in the glossary →</a>
        </p>
      </section>

      <section aria-labelledby="old">
        <h2 id="old">What the old names mean today</h2>
        <p className="muted">
          Watch the 2-3-5 change into the 4-3-3: the halves drop into the back four, and the inside forwards drop into
          midfield.
        </p>
        <div className="table-wrap">
          <table className="names">
            <thead>
              <tr>
                <th scope="col">Old name (2-3-5)</th>
                <th scope="col">Today (4-3-3)</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {OLD_NAMES.map((n) => {
                const g = guideForRole(n.roles[0]);
                return (
                  <tr key={n.old}>
                    <th scope="row">{n.old}</th>
                    <td>{g ? <a href={href('positions', g.id)}>{n.modern}</a> : n.modern}</td>
                    <td>{n.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="note">
        <strong>Varies by coach and club:</strong> formations are only a starting shape. In a game the team stretches
        and squeezes all the time (see{' '}
        <a href={href('plays', 's1-team-shape')}>Team shape</a>), and many teams switch formation during a match.
      </aside>
    </article>
  );
}
