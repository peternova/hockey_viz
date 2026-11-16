import { useEffect, useState } from 'react';
import type { Orientation } from '../pitch/coords';

export function useMediaQuery(query: string): boolean {
  const get = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Portrait pitch on tall screens (phones), landscape on wide ones. */
export function useAutoOrientation(): Orientation {
  return useMediaQuery('(max-aspect-ratio: 1/1)') ? 'portrait' : 'landscape';
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
