import type { Team, Vec } from './types';

export const TOKEN_R = 1.8;

interface Props {
  at: Vec; // screen coordinates
  team: Team;
  label: string;
  highlighted?: boolean;
  dimmed?: boolean;
  hasBall?: boolean;
  onPointerDown?: React.PointerEventHandler<SVGGElement>;
  title?: string;
}

/**
 * "Us" are round amber tokens and "them" are square blue tokens, so the
 * teams can be told apart by shape as well as colour (colour-blind safe).
 */
export function PlayerToken({ at, team, label, highlighted, dimmed, hasBall, onPointerDown, title }: Props) {
  const r = TOKEN_R;
  const cls = [
    'token',
    `token--${team}`,
    highlighted ? 'token--highlight' : '',
    dimmed ? 'token--dimmed' : '',
    hasBall ? 'token--has-ball' : '',
    onPointerDown ? 'token--draggable' : '',
  ].join(' ');
  return (
    <g className={cls} transform={`translate(${at.x} ${at.y})`} onPointerDown={onPointerDown}>
      {title ? <title>{title}</title> : null}
      {highlighted ? <circle className="token__halo" r={r * 1.9} /> : null}
      {team === 'us' ? (
        <circle className="token__body" r={r} />
      ) : (
        <rect className="token__body" x={-r} y={-r} width={r * 2} height={r * 2} rx={0.35} />
      )}
      <text className="token__label" textAnchor="middle" dominantBaseline="central" fontSize={label.length > 2 ? 1.2 : 1.55}>
        {label}
      </text>
    </g>
  );
}
