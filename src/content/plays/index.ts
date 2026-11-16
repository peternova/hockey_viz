import type { Play } from '../../engine/types';
import { a1Overlap } from './a1-overlap';
import { d1Channelling } from './d1-channelling';
import { s1TeamShape } from './s1-team-shape';

export const PLAYS: Play[] = [s1TeamShape, d1Channelling, a1Overlap];

export function playById(id: string): Play | undefined {
  return PLAYS.find((p) => p.id === id);
}

export const CATEGORY_LABEL: Record<Play['category'], string> = {
  shape: 'Team shape',
  'build-up': 'Build-up',
  attack: 'Attack',
  defence: 'Defence',
  transition: 'Transition',
  'set-piece': 'Set pieces',
};
