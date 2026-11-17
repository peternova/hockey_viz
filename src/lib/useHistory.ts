import { useCallback, useReducer } from 'react';

/**
 * Undo/redo for an immutable value.
 *
 * `commit(next, group)`: changes with the same group as the change before
 * merge into one undo step. A drag passes one group for all its moves, and
 * typing in a box passes one group per box, so Undo takes back the whole drag
 * or the whole edit rather than one pixel or one letter.
 */

const LIMIT = 200;

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
  group: string | null;
}

export type HistoryAction<T> =
  | { type: 'commit'; next: T | ((present: T) => T); group?: string }
  | { type: 'undo' }
  | { type: 'redo' };

export function historyReducer<T>(h: HistoryState<T>, a: HistoryAction<T>): HistoryState<T> {
  switch (a.type) {
    case 'commit': {
      const next = typeof a.next === 'function' ? (a.next as (p: T) => T)(h.present) : a.next;
      if (next === h.present) return h;
      if (a.group && a.group === h.group) return { ...h, present: next, future: [] };
      return { past: [...h.past, h.present].slice(-LIMIT), present: next, future: [], group: a.group ?? null };
    }
    case 'undo':
      if (h.past.length === 0) return h;
      return {
        past: h.past.slice(0, -1),
        present: h.past[h.past.length - 1],
        future: [h.present, ...h.future],
        group: null,
      };
    case 'redo':
      if (h.future.length === 0) return h;
      return { past: [...h.past, h.present], present: h.future[0], future: h.future.slice(1), group: null };
  }
}

export function useHistory<T>(initial: T) {
  const [h, dispatch] = useReducer(historyReducer<T>, { past: [], present: initial, future: [], group: null });
  return {
    present: h.present,
    canUndo: h.past.length > 0,
    canRedo: h.future.length > 0,
    commit: useCallback((next: T | ((p: T) => T), group?: string) => dispatch({ type: 'commit', next, group }), []),
    undo: useCallback(() => dispatch({ type: 'undo' }), []),
    redo: useCallback(() => dispatch({ type: 'redo' }), []),
  };
}
