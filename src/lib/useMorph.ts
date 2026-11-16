import { useEffect, useRef, useState } from 'react';
import { easeInOut, lerpVec } from '../engine/interpolate';
import type { Vec } from '../engine/types';

/**
 * Smoothly moves a set of named points to new targets whenever the targets
 * change (e.g. switching formations). Jumps straight there with reduced motion.
 */
export function useMorph(target: Record<string, Vec>, seconds: number, reducedMotion: boolean): Record<string, Vec> {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(shown);
  shownRef.current = shown;
  const targetRef = useRef(target);
  targetRef.current = target;
  const key = JSON.stringify(target);

  useEffect(() => {
    const to = targetRef.current;
    const from = shownRef.current;
    if (reducedMotion) {
      setShown(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const u = Math.min(1, (now - start) / (seconds * 1000));
      const e = easeInOut(u);
      setShown(Object.fromEntries(Object.keys(to).map((k) => [k, lerpVec(from[k] ?? to[k], to[k], e)])));
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, seconds, reducedMotion]);

  return shown;
}
