import { useEffect, useMemo, useState } from 'react';
import { Pitch } from '../pitch/Pitch';
import { project, type Orientation } from '../pitch/coords';
import { useAutoOrientation, usePrefersReducedMotion } from '../lib/useMedia';
import { AnnotationLayer, ArrowDefs, ZoneLabels } from './Annotations';
import { duration as playDuration, frameAt, resolveKeyframes, stepIndexAt, trail } from './interpolate';
import { PlayerToken } from './PlayerToken';
import { usePlayback } from './usePlayback';
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
      <div className={`viewer__stage viewer__stage--${orientation}`}>
        <Pitch
          orientation={orientation}
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
        <div className="viewer__direction" aria-hidden="true">
          {orientation === 'landscape' ? 'Our attack →' : 'Our attack ↑'}
        </div>
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

      <div className="controls" role="group" aria-label="Playback controls">
        <button type="button" className="btn" onClick={pb.prevStep} aria-label="Back a step" title="Back a step (←)">
          ◀◀
        </button>
        <button type="button" className="btn btn--primary" onClick={pb.toggle} title="Play / pause (space)">
          {pb.playing ? '❚❚' : '▶'} {playLabel}
        </button>
        <button type="button" className="btn" onClick={pb.nextStep} aria-label="Skip to end of step" title="Skip to end of step (→)">
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
