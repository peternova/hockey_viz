import { useMemo, useRef, useState } from 'react';
import { termById } from '../../content/glossary';
import { playById } from '../../content/plays';
import { guideForRole } from '../../content/positions';
import { POSITION_NAME } from '../../content/formations';
import { DEFAULT_NEAR, WHERE_QUESTIONS, wherePlayers, type WhereQuestion } from '../../content/quiz';
import { AnnotationLayer, ArrowDefs } from '../../engine/Annotations';
import { distToPolygon } from '../../engine/geometry';
import { frameAt, resolveKeyframes } from '../../engine/interpolate';
import { PlayerToken } from '../../engine/PlayerToken';
import { fitView, stageProps } from '../../engine/view';
import type { Annotation, Vec } from '../../engine/types';
import { AttackDirection, Pitch } from '../../pitch/Pitch';
import {
  FULL_VIEW,
  PITCH,
  clampToPitch,
  isFullView,
  project,
  unproject,
  type LengthView,
} from '../../pitch/coords';
import { clientToPitch } from '../../pitch/pointer';
import { href } from '../../lib/router';
import { useProgress, type Progress, type WhereResult } from '../../lib/progress';
import { useAutoOrientation } from '../../lib/useMedia';

const VERDICT: Record<WhereResult, string> = {
  spot: 'Spot on!',
  close: 'Close',
  miss: 'Not quite',
};

export function resultFor(q: WhereQuestion, spot: Vec): { result: WhereResult; metres: number } {
  const d = distToPolygon(spot, q.answer.zone);
  const result: WhereResult = d === 0 ? 'spot' : d <= (q.near ?? DEFAULT_NEAR) ? 'close' : 'miss';
  return { result, metres: d };
}

/** The next situation to try: the first after this one you haven't got spot on. */
function nextQuestion(current: string, progress: Progress): WhereQuestion {
  const i = WHERE_QUESTIONS.findIndex((q) => q.id === current);
  const order = [...WHERE_QUESTIONS.slice(i + 1), ...WHERE_QUESTIONS.slice(0, i + 1)];
  return order.find((q) => progress.where[q.id]?.best !== 'spot' && q.id !== current) ?? order[0];
}

function firstUnsolved(progress: Progress): WhereQuestion {
  return WHERE_QUESTIONS.find((q) => progress.where[q.id]?.best !== 'spot') ?? WHERE_QUESTIONS[0];
}

function statusIcon(r: WhereResult | undefined): string {
  return r === 'spot' ? '✓' : r === 'close' ? '≈' : r === 'miss' ? '•' : '';
}

function clampToView(p: Vec, v: LengthView): Vec {
  const c = clampToPitch(p, 2);
  const lo = v.x0 > 0 ? v.x0 + 1.5 : c.x;
  const hi = v.x1 < PITCH.length ? v.x1 - 1.5 : c.x;
  return { x: Math.min(Math.max(c.x, lo), hi), y: c.y };
}

function Situation({
  q,
  number,
  onResult,
  next,
}: {
  q: WhereQuestion;
  number: number;
  onResult: (r: WhereResult) => void;
  next: WhereQuestion;
}) {
  const orientation = useAutoOrientation();
  const players = useMemo(() => wherePlayers(q), [q]);
  const others = players.filter((p) => p.id !== q.you);
  const you = players.find((p) => p.id === q.you)!;
  const ball = useMemo(() => {
    const kfs = resolveKeyframes(players, [{ t: 0, pos: q.pos, ball: q.ball }]);
    return frameAt(players, kfs, 0);
  }, [players, q]);

  const fitted = useMemo(
    () => fitView([...Object.values(q.pos), ...q.answer.zone, q.answer.ideal, ball.ball], 8),
    [q, ball],
  );
  const [wholePitch, setWholePitch] = useState(false);
  const canZoom = orientation === 'portrait' && !isFullView(fitted);
  const view = canZoom && !wholePitch ? fitted : FULL_VIEW;
  const stage = stageProps(orientation, view);

  const start = q.pos[q.you];
  const [spot, setSpot] = useState<Vec>(start);
  const [checked, setChecked] = useState<{ result: WhereResult; metres: number } | null>(null);
  const [moved, setMoved] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const justDragged = useRef(false);

  const place = (p: Vec | null) => {
    if (!p || checked) return;
    setSpot(clampToView(p, view));
    setMoved(true);
  };

  const check = () => {
    if (checked) return;
    const r = resultFor(q, spot);
    setChecked(r);
    onResult(r.result);
  };

  const tryAgain = () => {
    setChecked(null);
    setSpot(start);
    setMoved(false);
  };

  // Arrow keys move your player in screen directions; Enter checks.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 5 : 1;
    const d: Record<string, Vec> = {
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    };
    if (d[e.key] && !checked) {
      e.preventDefault();
      const s = project(spot, orientation);
      place(unproject({ x: s.x + d[e.key].x, y: s.y + d[e.key].y }, orientation));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      check();
    }
  };

  const answerLayer: Annotation[] = checked
    ? [
        { kind: 'zone', tone: 'space', points: q.answer.zone, t0: 0, t1: 1 },
        ...(checked.result !== 'spot'
          ? [{ kind: 'run' as const, from: spot, to: q.answer.ideal, t0: 0, t1: 1, team: 'us' as const }]
          : []),
      ]
    : [];

  const guide = guideForRole(q.you);
  const youName = POSITION_NAME[q.you].toLowerCase();

  return (
    <div className="wq">
      <div className="wq__prompt">
        <div className="eyebrow">
          Situation {number} of {WHERE_QUESTIONS.length} · {POSITION_NAME[q.you]}
          {!q.reviewed ? (
            <span className="badge badge--draft" title="Not yet checked by a player or coach">
              Draft
            </span>
          ) : null}
        </div>
        <h2 className="wq__title">{q.title}</h2>
        <p>{q.prompt}</p>
        <p className="muted small">
          {checked
            ? `The shaded box is the best area, and the faded ${you.label} is the best spot.`
            : `Drag the glowing ${you.label}, or tap the pitch, to where you’d be. Then press Check.`}
        </p>
      </div>

      <div
        className={`${stage.className} wq__stage${checked ? '' : ' wq__stage--live'}`}
        style={stage.style}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={`Pitch. You are the ${youName}. Use the arrow keys to move, Enter to check.`}
      >
        <Pitch
          orientation={orientation}
          view={view}
          svgRef={svgRef}
          ariaLabel={`${q.title}: ${q.prompt}`}
          underlay={
            <>
              <ArrowDefs />
              <AnnotationLayer annotations={answerLayer} t={0.5} />
            </>
          }
          onPointerMove={(e) => {
            if (!dragging.current || !svgRef.current) return;
            place(clientToPitch(svgRef.current, e.clientX, e.clientY, orientation));
          }}
          onPointerUp={() => {
            if (dragging.current) justDragged.current = true;
            dragging.current = false;
          }}
          onClick={(e) => {
            if (justDragged.current) {
              justDragged.current = false;
              return;
            }
            if (svgRef.current) place(clientToPitch(svgRef.current, e.clientX, e.clientY, orientation));
          }}
        >
          {others.map((p) => (
            <PlayerToken
              key={p.id}
              at={project(q.pos[p.id], orientation)}
              team={p.team}
              label={p.label}
              hasBall={ball.carrier === p.id}
              title={`${p.team === 'us' ? 'Our' : 'Their'} ${p.label}`}
            />
          ))}
          <circle className="ball" cx={project(ball.ball, orientation).x} cy={project(ball.ball, orientation).y} r={0.6} />
          {checked ? (
            <g className="token-ghost">
              <PlayerToken at={project(q.answer.ideal, orientation)} team="us" label={you.label} title="Best spot" />
            </g>
          ) : null}
          <g
            className="wq__you"
            onPointerDown={(e) => {
              if (checked || !svgRef.current) return;
              e.stopPropagation();
              dragging.current = true;
              svgRef.current.setPointerCapture(e.pointerId);
            }}
          >
            {/* A bigger invisible handle so the token is easy to grab on a phone */}
            {!checked ? (
              <circle className="wq__grab" cx={project(spot, orientation).x} cy={project(spot, orientation).y} r={4.5} />
            ) : null}
            <PlayerToken at={project(spot, orientation)} team="us" label={you.label} highlighted title={`You: ${POSITION_NAME[q.you]}`} />
          </g>
        </Pitch>
        <AttackDirection />
      </div>

      <div className="wq__actions">
        {checked ? (
          <>
            <p className={`verdict verdict--${checked.result}`} role="status">
              <strong>{VERDICT[checked.result]}</strong>
              {checked.result !== 'spot' ? <> about {Math.max(1, Math.round(checked.metres))} m from the best area.</> : null}
            </p>
            <a className="btn btn--primary" href={href('quiz', 'where', next.id)}>
              Next situation →
            </a>
            <button type="button" className="btn" onClick={tryAgain}>
              Try again
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn btn--primary" onClick={check}>
              Check my spot
            </button>
            {moved ? (
              <button type="button" className="btn" onClick={tryAgain}>
                Reset
              </button>
            ) : null}
          </>
        )}
        {canZoom ? (
          <button type="button" className="btn btn--small" onClick={() => setWholePitch((w) => !w)}>
            {wholePitch ? 'Zoom in' : 'Whole pitch'}
          </button>
        ) : null}
      </div>

      {checked ? (
        <section className="wq__feedback" aria-labelledby="why">
          <h3 id="why">Why</h3>
          <p>{q.explain}</p>
          {q.rule ? <p className="rule-ref">FIH Rule {q.rule}</p> : null}
          {q.variesByCoach ? (
            <aside className="note">
              <strong>Varies by coach:</strong> {q.variesByCoach}
            </aside>
          ) : null}
          <ul className="term__links">
            {(q.plays ?? []).map((id) => {
              const p = playById(id);
              return p ? (
                <li key={id}>
                  <span className="muted">Watch:</span> <a href={href('plays', id)}>{p.title}</a>
                </li>
              ) : null;
            })}
            {guide ? (
              <li>
                <span className="muted">Position:</span> <a href={href('positions', guide.id)}>{guide.name}</a>
              </li>
            ) : null}
          </ul>
          {q.terms?.length ? (
            <ul className="chips" aria-label="Words to know">
              {q.terms.map((id) => {
                const t = termById(id);
                return t ? (
                  <li key={id}>
                    <a className="chip" href={href('glossary', id)}>
                      {t.term}
                    </a>
                  </li>
                ) : null;
              })}
            </ul>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export function WhereQuiz({ id }: { id?: string }) {
  const { progress, recordWhere } = useProgress();
  // Which situation to show is decided once per visit, so recording a result doesn't jump ahead.
  const [fallback] = useState(() => firstUnsolved(progress));
  const q = (id && WHERE_QUESTIONS.find((x) => x.id === id)) || fallback;
  const number = WHERE_QUESTIONS.indexOf(q) + 1;
  const spotOn = WHERE_QUESTIONS.filter((x) => progress.where[x.id]?.best === 'spot').length;

  return (
    <article className="page">
      <a className="back-link" href={href('quiz')}>
        ← All quizzes
      </a>
      <header className="page__header">
        <h1>Where should I be?</h1>
        <p className="lede">
          A moment from a game is frozen. Move your player to where you’d be, then check against the best area.
        </p>
      </header>

      <Situation
        key={q.id}
        q={q}
        number={number}
        onResult={(r) => recordWhere(q.id, r)}
        next={nextQuestion(q.id, progress)}
      />

      <section aria-labelledby="all-situations">
        <h2 id="all-situations">
          All situations <span className="muted">· {spotOn} of {WHERE_QUESTIONS.length} spot on</span>
        </h2>
        <ol className="wq__list">
          {WHERE_QUESTIONS.map((x) => {
            const best = progress.where[x.id]?.best;
            return (
              <li key={x.id}>
                <a
                  className={x.id === q.id ? 'wq__item wq__item--on' : 'wq__item'}
                  href={href('quiz', 'where', x.id)}
                  aria-current={x.id === q.id ? 'true' : undefined}
                >
                  <span className={`wq__status wq__status--${best ?? 'none'}`} aria-hidden="true">
                    {statusIcon(best)}
                  </span>
                  <span>
                    {x.title}
                    <span className="muted"> · {POSITION_NAME[x.you]}</span>
                  </span>
                  <span className="visually-hidden">
                    {best === 'spot' ? '(spot on)' : best === 'close' ? '(close)' : best === 'miss' ? '(tried)' : ''}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    </article>
  );
}
