import { GRID_COLS, GRID_ROWS, guideAt, guideById } from '../../content/positions';
import { href } from '../../lib/router';

/**
 * 3×3 picker laid out like the pitch from behind our goal: forwards at the
 * top, defenders at the bottom, left on the left.
 */
export function PositionGrid({ current, compact }: { current?: string; compact?: boolean }) {
  const gk = guideById('GK')!;
  return (
    <nav className={compact ? 'posgrid posgrid--compact' : 'posgrid'} aria-label="Positions">
      <div className="posgrid__head" aria-hidden="true">
        <span />
        {GRID_COLS.map((c) => (
          <span key={c.side}>{c.label}</span>
        ))}
      </div>
      {GRID_ROWS.map((row) => (
        <div className="posgrid__row" key={row.line}>
          <span className="posgrid__rowlabel">{row.label}</span>
          {GRID_COLS.map((col) => {
            const g = guideAt(row.line, col.side);
            if (!g) return <span key={col.side} />;
            return (
              <a
                key={col.side}
                href={href('positions', g.id)}
                className={g.id === current ? 'posgrid__cell posgrid__cell--on' : 'posgrid__cell'}
                aria-current={g.id === current ? 'page' : undefined}
              >
                <span className="posgrid__name">{g.name}</span>
                {!compact ? <span className="posgrid__aka">{g.aka[0]}</span> : null}
              </a>
            );
          })}
        </div>
      ))}
      <div className="posgrid__row posgrid__row--gk">
        <span className="posgrid__rowlabel">Goal</span>
        <span />
        <a
          href={href('positions', gk.id)}
          className={gk.id === current ? 'posgrid__cell posgrid__cell--on' : 'posgrid__cell'}
          aria-current={gk.id === current ? 'page' : undefined}
        >
          {/* A soft hyphen, so "Goal-keeper" can break on the narrowest phones. */}
          <span className="posgrid__name">{gk.name.replace('keeper', '\u00ADkeeper')}</span>
        </a>
        <span />
      </div>
    </nav>
  );
}
