import { useCallback, useEffect, useState } from 'react';

/**
 * Quiz progress, kept on this device only (localStorage). Every read and
 * write is wrapped: private windows and blocked storage just mean progress
 * isn't remembered, never a broken page.
 */

export type WhereResult = 'spot' | 'close' | 'miss';

export interface Progress {
  v: 1;
  /** "Where should I be?": best result and number of checks per situation. */
  where: Record<string, { best: WhereResult; tries: number }>;
  /** Multiple choice and true/false, keyed "pic:<id>", "def:<id>", "rule:<id>". */
  answers: Record<string, { right: number; wrong: number }>;
}

export const STORAGE_KEY = 'hockeyiq.progress.v1';

export function emptyProgress(): Progress {
  return { v: 1, where: {}, answers: {} };
}

const RANK: Record<WhereResult, number> = { miss: 0, close: 1, spot: 2 };

export function withWhere(p: Progress, id: string, result: WhereResult): Progress {
  const prev = p.where[id];
  const best = prev && RANK[prev.best] >= RANK[result] ? prev.best : result;
  return { ...p, where: { ...p.where, [id]: { best, tries: (prev?.tries ?? 0) + 1 } } };
}

export function withAnswer(p: Progress, key: string, correct: boolean): Progress {
  const prev = p.answers[key] ?? { right: 0, wrong: 0 };
  const next = correct ? { ...prev, right: prev.right + 1 } : { ...prev, wrong: prev.wrong + 1 };
  return { ...p, answers: { ...p.answers, [key]: next } };
}

/** Accepts anything (old or hand-edited data) and returns a valid Progress. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const data = JSON.parse(raw) as Partial<Progress>;
    if (data?.v !== 1 || typeof data.where !== 'object' || typeof data.answers !== 'object') return emptyProgress();
    return { v: 1, where: data.where ?? {}, answers: data.answers ?? {} };
  } catch {
    return emptyProgress();
  }
}

export function loadProgress(): Progress {
  try {
    return parseProgress(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return emptyProgress();
  }
}

function saveProgress(p: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: keep going without saving */
  }
}

/** Progress state shared by the quiz pages, saved after every change. */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  // Another tab (or the quiz home in a second window) changed it.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setProgress(parseProgress(e.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((f: (p: Progress) => Progress) => {
    setProgress((p) => {
      const next = f(p);
      saveProgress(next);
      return next;
    });
  }, []);

  return {
    progress,
    recordWhere: useCallback((id: string, r: WhereResult) => update((p) => withWhere(p, id, r)), [update]),
    recordAnswer: useCallback((key: string, ok: boolean) => update((p) => withAnswer(p, key, ok)), [update]),
    reset: useCallback(() => update(() => emptyProgress()), [update]),
  };
}
