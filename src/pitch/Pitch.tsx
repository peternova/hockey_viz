import type { ReactNode } from 'react';
import { CENTRE_Y, PITCH, groupTransform, viewBox, type LengthView, type Orientation } from './coords';

const { length: L, width: W } = PITCH;

/** Circle outline (quarter-circles joined by a straight) at one end. */
function circlePath(radius: number, end: 'left' | 'right'): string {
  const topPost = CENTRE_Y - PITCH.halfGoal;
  const bottomPost = CENTRE_Y + PITCH.halfGoal;
  if (end === 'left') {
    return [
      `M 0 ${topPost - radius}`,
      `A ${radius} ${radius} 0 0 1 ${radius} ${topPost}`,
      `L ${radius} ${bottomPost}`,
      `A ${radius} ${radius} 0 0 1 0 ${bottomPost + radius}`,
    ].join(' ');
  }
  return [
    `M ${L} ${topPost - radius}`,
    `A ${radius} ${radius} 0 0 0 ${L - radius} ${topPost}`,
    `L ${L - radius} ${bottomPost}`,
    `A ${radius} ${radius} 0 0 0 ${L} ${bottomPost + radius}`,
  ].join(' ');
}

function PitchMarkings() {
  const lw = 0.25;
  const topPost = CENTRE_Y - PITCH.halfGoal;
  const bottomPost = CENTRE_Y + PITCH.halfGoal;
  const ends: Array<{ end: 'left' | 'right'; x: number; dir: 1 | -1 }> = [
    { end: 'left', x: 0, dir: 1 },
    { end: 'right', x: L, dir: -1 },
  ];
  return (
    <g className="pitch-lines" fill="none" stroke="var(--pitch-line)" strokeWidth={lw}>
      <rect x={0} y={0} width={L} height={W} />
      <line x1={L / 2} y1={0} x2={L / 2} y2={W} />
      <line x1={PITCH.line23} y1={0} x2={PITCH.line23} y2={W} />
      <line x1={L - PITCH.line23} y1={0} x2={L - PITCH.line23} y2={W} />
      {ends.map(({ end, x, dir }) => (
        <g key={end}>
          <path d={circlePath(PITCH.circleRadius, end)} />
          <path d={circlePath(PITCH.dottedRadius, end)} strokeDasharray="1.2 1.2" />
          <circle
            cx={x + dir * PITCH.penaltySpot}
            cy={CENTRE_Y}
            r={0.3}
            fill="var(--pitch-line)"
            stroke="none"
          />
          {/* Goal (outside the field) */}
          <rect
            x={dir === 1 ? -PITCH.goalDepth : L}
            y={topPost}
            width={PITCH.goalDepth}
            height={PITCH.halfGoal * 2}
            fill="var(--goal-net)"
            strokeWidth={0.2}
          />
          {/* Back-line marks at 5 m and 10 m from each post */}
          {PITCH.backlineMarks.flatMap((d) => [
            <line key={`t${d}`} x1={x} y1={topPost - d} x2={x - dir * 0.6} y2={topPost - d} />,
            <line key={`b${d}`} x1={x} y1={bottomPost + d} x2={x - dir * 0.6} y2={bottomPost + d} />,
          ])}
          {/* Side-line marks 14.63 m from the back-line */}
          <line x1={x + dir * PITCH.sidelineMark} y1={0} x2={x + dir * PITCH.sidelineMark} y2={-0.6} />
          <line x1={x + dir * PITCH.sidelineMark} y1={W} x2={x + dir * PITCH.sidelineMark} y2={W + 0.6} />
        </g>
      ))}
    </g>
  );
}

/** Light stripes like a freshly mown pitch: helps judge distance. */
function Stripes() {
  const n = 10;
  const w = L / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) =>
        i % 2 === 0 ? null : (
          <rect key={i} x={i * w} y={0} width={w} height={W} fill="var(--pitch-stripe)" />
        ),
      )}
    </g>
  );
}

export interface PitchProps {
  orientation: Orientation;
  /** Show only part of the pitch's length (defaults to all of it). */
  view?: LengthView;
  /** Extra layers drawn in pitch coordinates (zones etc.), under the players. */
  underlay?: ReactNode;
  /** Layers drawn in screen coordinates (players, ball, labels). */
  children?: ReactNode;
  ariaLabel?: string;
  svgRef?: React.Ref<SVGSVGElement>;
  onPointerDown?: React.PointerEventHandler<SVGSVGElement>;
  onPointerMove?: React.PointerEventHandler<SVGSVGElement>;
  onPointerUp?: React.PointerEventHandler<SVGSVGElement>;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export function Pitch({
  orientation,
  view,
  underlay,
  children,
  ariaLabel,
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onClick,
}: PitchProps) {
  return (
    <svg
      ref={svgRef}
      className={`pitch pitch--${orientation}`}
      viewBox={viewBox(orientation, view)}
      role="img"
      aria-label={ariaLabel ?? 'Hockey pitch'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClick={onClick}
    >
      <rect x={-50} y={-50} width={300} height={300} fill="var(--pitch-runoff)" />
      <g transform={groupTransform(orientation)}>
        <rect x={0} y={0} width={L} height={W} fill="var(--pitch-turf)" />
        <Stripes />
        <PitchMarkings />
        {underlay}
      </g>
      {children}
    </svg>
  );
}

/** "Our attack" arrow drawn over the pitch's edge (runs up the side in portrait). */
export function AttackDirection() {
  return (
    <div className="viewer__direction" aria-hidden="true">
      {/* Portrait turns this text on its side with CSS, so the arrow points up. */}
      Our attack →
    </div>
  );
}
