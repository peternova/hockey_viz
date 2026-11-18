import { href } from '../../lib/router';
import type { TeamPlay } from '../board/teamPlays';

function blurb(t: TeamPlay): string {
  const intro = t.play.frames[0].caption.trim();
  const steps = t.play.frames.length - 1;
  const count = `${steps} step${steps === 1 ? '' : 's'}`;
  if (!intro) return count;
  return intro.length > 140 ? `${intro.slice(0, 137).trimEnd()}…` : intro;
}

/** Cards linking to the team plays (from the repo's team-plays folder). */
export function TeamPlayCards({ plays }: { plays: TeamPlay[] }) {
  return (
    <ul className="card-grid">
      {plays.map((t) => (
        <li key={t.slug}>
          <a className="card" href={href('plays', 'team', t.slug)}>
            <span className="eyebrow">Team play</span>
            <span className="card__title">{t.play.title}</span>
            <span className="card__text">{blurb(t)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
