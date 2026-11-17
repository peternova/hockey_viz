import { PITCH, viewRect, type LengthView, type Orientation } from '../pitch/coords';
import type { CSSProperties } from 'react';
import type { Play, Vec } from './types';

/** Room around the action so tokens and labels never touch a cropped edge. */
export const VIEW_PAD = 5;
/** If the action comes this close to a back-line, show the whole end. */
export const SNAP_TO_END = 10;
/** Never zoom in tighter than this much of the pitch's length. */
export const MIN_VIEW = 30;

/** Every point a play's players, ball and annotations ever use. */
function playPoints(play: Play): Vec[] {
  const pts: Vec[] = [];
  for (const k of play.keyframes) {
    pts.push(...Object.values(k.pos));
    if (k.ball && 'at' in k.ball) pts.push(k.ball.at);
  }
  for (const a of play.annotations ?? []) {
    if (a.kind === 'zone') pts.push(...a.points, ...(a.labelAt ? [a.labelAt] : []));
    else pts.push(a.from, a.to);
  }
  return pts;
}

/**
 * The part of the pitch's length a play needs, used to zoom in on phones.
 * Movement between keyframes is a straight eased line, so the keyframes bound
 * the whole animation.
 */
export function playView(play: Play): LengthView {
  return fitView(playPoints(play));
}

/** The part of the pitch's length needed to show all these points comfortably. */
export function fitView(points: Vec[], pad = VIEW_PAD): LengthView {
  const xs = points.map((p) => p.x);
  let x0 = Math.min(...xs) - pad;
  let x1 = Math.max(...xs) + pad;
  if (x0 < SNAP_TO_END) x0 = 0;
  if (x1 > PITCH.length - SNAP_TO_END) x1 = PITCH.length;
  if (x1 - x0 < MIN_VIEW) {
    if (x1 >= PITCH.length) x0 = PITCH.length - MIN_VIEW;
    else x0 = Math.max(0, x1 - MIN_VIEW);
  }
  return { x0, x1 };
}

/**
 * Class and style for a pitch stage showing `view`: --aspect lets CSS size a
 * portrait pitch to fit the screen height, and cut edges get a soft shadow.
 */
export function stageProps(orientation: Orientation, view: LengthView): { className: string; style: CSSProperties } {
  const r = viewRect(orientation, view);
  const className = [
    'viewer__stage',
    `viewer__stage--${orientation}`,
    orientation === 'portrait' && view.x1 < PITCH.length ? 'viewer__stage--cut-top' : '',
    orientation === 'portrait' && view.x0 > 0 ? 'viewer__stage--cut-bottom' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return { className, style: { '--aspect': (r.w / r.h).toFixed(4) } as CSSProperties };
}
