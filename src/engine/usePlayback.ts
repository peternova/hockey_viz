import { useCallback, useEffect, useRef, useState } from 'react';
import { advance, stepJumpTarget, type PlaybackState } from './playback';
import type { Step } from './types';

export interface Playback extends PlaybackState {
  speed: number;
  pauseAfterEachStep: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  restart: () => void;
  nextStep: () => void;
  prevStep: () => void;
  setSpeed: (s: number) => void;
  setPauseAfterEachStep: (v: boolean) => void;
}

export function usePlayback(duration: number, steps: Step[], initialSpeed = 0.75): Playback {
  const [state, setState] = useState<PlaybackState>({ t: 0, playing: false, pausedAtStep: null });
  const [speed, setSpeed] = useState(initialSpeed);
  const [pauseAfterEachStep, setPauseAfterEachStep] = useState(true);

  // Keep the latest options in a ref so the animation loop never restarts.
  const opts = useRef({ duration, steps, speed, pauseAfterEachStep });
  opts.current = { duration, steps, speed, pauseAfterEachStep };

  useEffect(() => {
    if (!state.playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Cap dt so a backgrounded tab doesn't jump the play forward.
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setState((s) => advance(s, dt, opts.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state.playing]);

  const play = useCallback(() => {
    setState((s) => ({
      t: s.t >= opts.current.duration ? 0 : s.t,
      playing: true,
      pausedAtStep: null,
    }));
  }, []);
  const pause = useCallback(() => setState((s) => ({ ...s, playing: false })), []);
  const toggle = useCallback(() => {
    setState((s) =>
      s.playing
        ? { ...s, playing: false }
        : { t: s.t >= opts.current.duration ? 0 : s.t, playing: true, pausedAtStep: null },
    );
  }, []);
  const seek = useCallback((t: number) => {
    setState((s) => ({
      ...s,
      t: Math.max(0, Math.min(opts.current.duration, t)),
      pausedAtStep: null,
    }));
  }, []);
  const restart = useCallback(() => setState({ t: 0, playing: true, pausedAtStep: null }), []);
  const nextStep = useCallback(() => {
    setState((s) => ({
      t: stepJumpTarget(opts.current.steps, s.t, 1),
      playing: false,
      pausedAtStep: null,
    }));
  }, []);
  const prevStep = useCallback(() => {
    setState((s) => ({
      t: stepJumpTarget(opts.current.steps, s.t, -1),
      playing: false,
      pausedAtStep: null,
    }));
  }, []);

  return {
    ...state,
    speed,
    pauseAfterEachStep,
    play,
    pause,
    toggle,
    seek,
    restart,
    nextStep,
    prevStep,
    setSpeed,
    setPauseAfterEachStep,
  };
}
