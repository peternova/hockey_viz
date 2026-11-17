import type { Vec } from '../engine/types';
import { unproject, type Orientation } from './coords';

/** Browser pointer position → pitch metres. */
export function clientToPitch(svg: SVGSVGElement, clientX: number, clientY: number, o: Orientation): Vec | null {
  const m = svg.getScreenCTM();
  if (!m) return null;
  const s = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
  return unproject({ x: s.x, y: s.y }, o);
}

/** Screen pixels per metre on this pitch right now (for finger-sized hit areas). */
export function pixelsPerMetre(svg: SVGSVGElement): number {
  const m = svg.getScreenCTM();
  return m ? Math.hypot(m.a, m.b) || 1 : 1;
}
