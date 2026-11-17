import { useCallback, useEffect, useState } from 'react';
import { mergeImported, normalizePlay, type BoardPlay } from '../features/board/model';

/**
 * Tactics board plays, kept on this device only (localStorage). As with quiz
 * progress, every read and write is wrapped so blocked storage never breaks
 * the page; writes report whether they worked so the board can warn you.
 */

export const BOARD_KEY = 'hockeyiq.board.v1';

export function parseBoards(raw: string | null): BoardPlay[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as { v?: unknown; plays?: unknown };
    if (data?.v !== 1 || !Array.isArray(data.plays)) return [];
    return data.plays.map((p) => normalizePlay(p)).filter((p): p is BoardPlay => p !== null);
  } catch {
    return [];
  }
}

export function loadBoards(): BoardPlay[] {
  try {
    return parseBoards(window.localStorage.getItem(BOARD_KEY));
  } catch {
    return [];
  }
}

function writeBoards(plays: BoardPlay[]): boolean {
  try {
    window.localStorage.setItem(BOARD_KEY, JSON.stringify({ v: 1, plays }));
    return true;
  } catch {
    return false;
  }
}

/** Save one play (new or changed). Returns false if it couldn't be saved. */
export function putBoard(play: BoardPlay): boolean {
  const plays = loadBoards();
  const i = plays.findIndex((p) => p.id === play.id);
  if (i >= 0) plays[i] = play;
  else plays.unshift(play);
  return writeBoards(plays);
}

export function deleteBoard(id: string): boolean {
  return writeBoards(loadBoards().filter((p) => p.id !== id));
}

export function importBoards(incoming: BoardPlay[]): { ok: boolean; added: number; same: number } {
  const r = mergeImported(loadBoards(), incoming);
  return { ok: r.added === 0 || writeBoards(r.plays), added: r.added, same: r.same };
}

/** Saved plays, most recently changed first, kept up to date with other tabs. */
export function useBoardList() {
  const read = () => loadBoards().sort((a, b) => b.updated - a.updated);
  const [plays, setPlays] = useState<BoardPlay[]>(read);
  const refresh = useCallback(() => setPlays(read()), []);
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === BOARD_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);
  return { plays, refresh };
}
