import { useEffect, useMemo, useRef, useState } from 'react';
import { AttackDirection, Pitch } from '../pitch/Pitch';
import { FULL_VIEW, isFullView, project, type Orientation } from '../pitch/coords';
import { useAutoOrientation, useMediaQuery, usePrefersReducedMotion } from '../lib/useMedia';
import { AnnotationLayer, ArrowDefs, ZoneLabels } from './Annotations';
import { duration as playDuration, frameAt, resolveKeyframes, stepIndexAt, trail } from './interpolate';
import { PlayerToken } from './PlayerToken';
import { usePlayback } from './usePlayback';
import { playView, stageProps } from './view';
import type { Play } from './types';

const SPEEDS = [0.25, 0.5, 0.75, 1];

export function PlayViewer({ play }: { play: Play }) {
  const kfs = useMemo(() => resolveKeyframes(play.players, play.keyframes), [play]);
  const dur = useMemo(() => playDuration(play), [play]);
  const reducedMotion = usePrefersReducedMotion();
  const pb = usePlayback(dur, play.steps, reducedMotion ? 0.5 : 0.75);

  const auto = useAutoOrientation();
  const [override, setOverride] = useState<Orientation | null>(null);
  const orientation = override ?? auto;

  // Portrait (phones): zoom in on the part of the pitch the play uses.
  const fitted = useMemo(() => playView(play), [play]);
  const [wholePitch, setWholePitch] = useState(false);
  const canZoom = orientation === 'portrait' && !isFullView(fitted);
  const view = canZoom && !wholePitch ? fitted : FULL_VIEW;
  const stage = stageProps(orientation, view);

  // Stacked layout (phones, tablets): bring the pitch fully into view when a
  // control is pressed, so you never scroll between the pitch and the buttons.
  const stacked = useMediaQuery('(max-width: 979px)');
  const stageRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const revealPitch = () => {
    const el = stageRef.current;
    if (!stacked || !el) return;
    const r = el.getBoundingClientRect();
    const covered = controlsRef.current?.offsetHeight ?? 0;
    if (r.top >= 0 && r.bottom <= window.innerHeight - covered) return;
    window.scrollBy({ top: r.top - 8, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const [follow, setFollow] = useState<string>(play.defaultFollow ?? '');
  useEffect(() => setFollow(play.defaultFollow ?? ''), [play]);

  const frame = frameAt(play.players, kfs, pb.t);
  const stepIdx = stepIndexAt(play.steps, pb.t);
  const step = play.steps[stepIdx];
  const thinkStep = pb.pausedAtStep !== null ? play.steps[pb.pausedAtStep] : null;
  const followTrail = follow ? trail(play.players, kfs, follow, pb.t) : [];
  const atEnd = pb.t >= dur - 1e-6;

  // Keyboard: space = play/pause, ← → = steps.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target instanceof HTMLSelectElement || e.target instanceof HTMLInputElement) return;
    if (e.key === ' ') {
      e.preventDefault();
      pb.toggle();
    } else if (e.key === 'ArrowRight') {
      pb.nextStep();
    } else if (e.key === 'ArrowLeft') {
      pb.prevStep();
    }
  };

  const playLabel = pb.playing ? 'Pause' : atEnd ? 'Replay' : pb.t > 0 ? 'Continue' : 'Play';

  return (
    <div className="viewer" tabIndex={0} onKeyDown={onKeyDown} aria-label={`Animation: ${play.title}`}>
      <div ref={stageRef} className={stage.className} style={stage.style}>
        <Pitch
          orientation={orientation}
          view={view}
          ariaLabel={`${play.title}. Step ${stepIdx + 1}: ${step?.title ?? ''}`}
          underlay={
            <>
              <ArrowDefs />
              <AnnotationLayer annotations={play.annotations ?? []} t={pb.t} />
            </>
          }
        >
          <ZoneLabels annotations={play.annotations ?? []} t={pb.t} orientation={orientation} />
          {followTrail.length > 1 ? (
            <polyline
              className="trail"
              points={followTrail.map((p) => project(p, orientation)).map((p) => `${p.x},${p.y}`).join(' ')}
            />
          ) : null}
          {play.players.map((p) => (
            <PlayerToken
              key={p.id}
              at={project(frame.players[p.id], orientation)}
              team={p.team}
              label={p.label}
              highlighted={p.id === follow}
              dimmed={Boolean(follow) && p.id !== follow && p.team === 'us'}
              hasBall={frame.carrier === p.id}
              title={`${p.team === 'us' ? 'Our' : 'Their'} ${p.label}`}
            />
          ))}
          {(() => {
            const b = project(frame.ball, orientation);
            return <circle className="ball" cx={b.x} cy={b.y} r={0.6} />;
          })()}
        </Pitch>
        <AttackDirection />
      </div>

      <div className="caption" aria-live="polite">
        <div className="caption__meta">
          Step {stepIdx + 1} of {play.steps.length}
        </div>
        <h3 className="caption__title">{step?.title}</h3>
        <p className="caption__text">{step?.caption}</p>
        {thinkStep?.think && !pb.playing ? (
          <div className="think">
            <strong>Think:</strong> {thinkStep.think}
          </div>
        ) : null}
      </div>

      <div ref={controlsRef} className="controls" role="group" aria-label="Playback controls">
        <button
          type="button"
          className="btn"
          onClick={() => {
            pb.prevStep();
            revealPitch();
          }}
          aria-label="Back a step"
          title="Back a step (←)"
        >
          ◀◀
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            if (!pb.playing) revealPitch();
            pb.toggle();
          }}
          title="Play / pause (space)"
        >
          {pb.playing ? '❚❚' : '▶'} {playLabel}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            pb.nextStep();
            revealPitch();
          }}
          aria-label="Skip to end of step"
          title="Skip to end of step (→)"
        >
          ▶▶
        </button>
        <input
          className="scrubber"
          type="range"
          min={0}
          max={dur}
          step={0.05}
          value={pb.t}
          onChange={(e) => {
            pb.pause();
            pb.seek(Number(e.target.value));
          }}
          aria-label="Scrub through the play"
        />
      </div>

      <div className="options">
        <label>
          Speed{' '}
          <select value={pb.speed} onChange={(e) => pb.setSpeed(Number(e.target.value))}>
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
        <label>
          Follow{' '}
          <select value={follow} onChange={(e) => setFollow(e.target.value)}>
            <option value="">Nobody</option>
            {play.players
              .filter((p) => p.team === 'us')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  Our {p.label}
                </option>
              ))}
            {play.players
              .filter((p) => p.team === 'them')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  Their {p.label}
                </option>
              ))}
          </select>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={pb.pauseAfterEachStep}
            onChange={(e) => pb.setPauseAfterEachStep(e.target.checked)}
          />
          Pause after each step
        </label>
        <button
          type="button"
          className="btn btn--small"
          onClick={() => setOverride(orientation === 'landscape' ? 'portrait' : 'landscape')}
        >
          Rotate pitch
        </button>
        {canZoom ? (
          <button type="button" className="btn btn--small" onClick={() => setWholePitch((w) => !w)}>
            {wholePitch ? 'Zoom in on the play' : 'Show the whole pitch'}
          </button>
        ) : null}
      </div>

      <ol className="steps">
        {play.steps.map((s, i) => (
          <li key={i} className={i === stepIdx ? 'steps__item steps__item--current' : 'steps__item'}>
            <button
              type="button"
              className="steps__btn"
              onClick={() => {
                pb.seek(s.t0);
                pb.play();
                revealPitch();
              }}
            >
              <span className="steps__num">{i + 1}</span>
              <span>{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
