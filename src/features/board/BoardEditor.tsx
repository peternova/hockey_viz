import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { playById } from '../../content/plays';
import { AnnotationLayer, ArrowDefs } from '../../engine/Annotations';
import { dist } from '../../engine/geometry';
import { ballPoint } from '../../engine/interpolate';
import { PlayerToken } from '../../engine/PlayerToken';
import { PlayViewer } from '../../engine/PlayViewer';
import { stageProps } from '../../engine/view';
import type { Annotation, PlayerDef, Vec } from '../../engine/types';
import { AttackDirection, Pitch } from '../../pitch/Pitch';
import { FULL_VIEW, project, unproject } from '../../pitch/coords';
import { clientToPitch, pixelsPerMetre } from '../../pitch/pointer';
import { deleteBoard, loadBoards, putBoard } from '../../lib/boardStore';
import { downloadText } from '../../lib/download';
import { href } from '../../lib/router';
import { useAutoOrientation } from '../../lib/useMedia';
import { useHistory } from '../../lib/useHistory';
import { openNewBoard } from './BoardHome';
import {
  GIVE_RADIUS,
  LIMITS,
  SECS_CHOICES,
  SLOTS,
  addFrame,
  addPlayer,
  autoSecs,
  boardFile,
  carrierOf,
  deleteFrame,
  dropBall,
  fileNameFor,
  frameMoves,
  movePlayer,
  nearestPlayer,
  newId,
  relabel,
  removePlayer,
  retitle,
  setBall,
  toPlay,
  updateFrame,
  type BoardPlay,
} from './model';

/** Selection value meaning "the ball" rather than a player. */
const BALL = '#ball';

type Hit = { kind: 'player'; id: string } | { kind: 'ball' } | null;

interface Drag {
  pointerId: number;
  /** Where the press started, in screen pixels (to tell a tap from a drag). */
  x: number;
  y: number;
  hit: Hit;
  moved: boolean;
  /** The play when the drag started: every move is worked out from this. */
  base: BoardPlay;
  frame: number;
  /** Offset from the finger to the thing being dragged, so it doesn't jump. */
  grab: Vec;
  /** Undo group: one drag is one undo step. */
  group: string;
}

const secsLabel = (s: number) => `${s} s`;
const teamWord = (p: PlayerDef) => (p.team === 'us' ? 'our' : 'their');

/**
 * Saves the play shortly after each change, and straight away when you leave
 * the page. `stop()` turns saving off (used when the play is deleted).
 */
function useAutosave(play: BoardPlay, initial: BoardPlay) {
  const [failed, setFailed] = useState(false);
  const saved = useRef(initial);
  const pending = useRef<BoardPlay | null>(null);
  const off = useRef(false);

  const flush = useCallback(() => {
    const p = pending.current;
    pending.current = null;
    if (!p || off.current) return;
    saved.current = p;
    setFailed(!putBoard({ ...p, updated: Date.now() }));
  }, []);

  useEffect(() => {
    if (play === saved.current) return;
    pending.current = play;
    const t = window.setTimeout(flush, 400);
    return () => window.clearTimeout(t);
  }, [play, flush]);

  useEffect(() => {
    window.addEventListener('pagehide', flush);
    return () => {
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [flush]);

  const stop = useCallback(() => {
    off.current = true;
    pending.current = null;
  }, []);
  return { failed, flush, stop };
}

export function BoardEditorPage({ id }: { id: string }) {
  const [initial] = useState(() => loadBoards().find((p) => p.id === id) ?? null);
  if (!initial) {
    return (
      <article className="page">
        <a className="back-link" href={href('board')}>
          ← My plays
        </a>
        <header className="page__header">
          <h1>Play not found</h1>
          <p className="lede">
            This play isn’t saved in this browser. Plays stay on the device where they were made: use Export and Import
            on the tactics board page to move them.
          </p>
        </header>
      </article>
    );
  }
  return <Editor initial={initial} />;
}

function Editor({ initial }: { initial: BoardPlay }) {
  const hist = useHistory(initial);
  const b = hist.present;
  const save = useAutosave(b, initial);
  const { undo, redo } = hist;
  const [mode, setMode] = useState<'edit' | 'watch'>('edit');
  const orientation = useAutoOrientation();
  const stage = stageProps(orientation, FULL_VIEW);

  const [k, setK] = useState(0);
  const fi = Math.min(k, b.frames.length - 1);
  const frame = b.frames[fi];
  const prev = fi > 0 ? b.frames[fi - 1] : null;
  const last = b.frames.length - 1;

  const [sel, setSel] = useState<string | null>(null);
  const selPlayer = b.players.find((p) => p.id === sel) ?? null;
  const ballSelected = sel === BALL;
  const carrier = carrierOf(frame);
  const ballAt = ballPoint(b.players, frame.pos, frame.ball);

  const play = useMemo(() => toPlay(b), [b]);

  // Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z (or Ctrl+Y), except while typing in a box.
  useEffect(() => {
    if (mode !== 'edit') return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, undo, redo]);

  // Keep the current step's button in view in the step strip.
  const framesRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const c = framesRef.current;
    const el = c?.querySelector<HTMLElement>('[aria-current="step"]');
    if (!c || !el) return;
    const left = el.offsetLeft;
    const right = left + el.offsetWidth;
    if (left < c.scrollLeft) c.scrollLeft = left - 8;
    else if (right > c.scrollLeft + c.clientWidth) c.scrollLeft = right - c.clientWidth + 8;
  }, [fi, b.frames.length, mode]);

  /* ---------- Pointer: drag, or tap to choose and place ---------- */

  const svgRef = useRef<SVGSVGElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const drags = useRef(0);

  const ppm = () => (svgRef.current ? pixelsPerMetre(svgRef.current) : 7);
  /** Finger-sized: at least 22 px from a token's centre, whatever the zoom. */
  const grabRadius = () => Math.max(2.4, 22 / ppm());

  const pointerAt = (e: React.PointerEvent) =>
    svgRef.current ? clientToPitch(svgRef.current, e.clientX, e.clientY, orientation) : null;

  const hitTest = (p: Vec): Hit => {
    let hit: Hit = null;
    let best = grabRadius();
    for (const pl of b.players) {
      const d = dist(frame.pos[pl.id], p);
      if (d <= best) {
        hit = { kind: 'player', id: pl.id };
        best = d;
      }
    }
    // A loose ball is small: give it its own target, and prefer it when it's about as close.
    if ('at' in frame.ball) {
      const d = dist(frame.ball.at, p);
      if (d <= Math.max(1.6, 16 / ppm()) && d - 1 <= best) hit = { kind: 'ball' };
    }
    return hit;
  };

  const tap = (p: Vec, hit: Hit) => {
    if (ballSelected) {
      const who = nearestPlayer(b, fi, p, grabRadius());
      hist.commit(setBall(b, fi, who ? { with: who } : { at: p }));
      setSel(null);
      return;
    }
    if (hit?.kind === 'player') {
      setSel(hit.id === sel ? null : hit.id);
      return;
    }
    if (hit?.kind === 'ball') {
      setSel(BALL);
      return;
    }
    if (selPlayer) hist.commit(movePlayer(b, fi, selPlayer.id, p));
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const svg = svgRef.current;
    const p = pointerAt(e);
    if (!svg || !p) return;
    const hit = ballSelected ? null : hitTest(p);
    const origin = hit?.kind === 'player' ? frame.pos[hit.id] : hit?.kind === 'ball' ? ballAt : p;
    drag.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      hit,
      moved: false,
      base: b,
      frame: fi,
      grab: { x: origin.x - p.x, y: origin.y - p.y },
      group: `drag-${++drags.current}`,
    };
    svg.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
    d.moved = true;
    if (!d.hit) return;
    const p = pointerAt(e);
    if (!p) return;
    const to = { x: p.x + d.grab.x, y: p.y + d.grab.y };
    hist.commit(
      d.hit.kind === 'player' ? movePlayer(d.base, d.frame, d.hit.id, to) : setBall(d.base, d.frame, { at: to }),
      d.group,
    );
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    drag.current = null;
    if (e.type === 'pointercancel') return;
    const p = pointerAt(e);
    if (!p) return;
    if (!d.moved) {
      tap(p, d.hit);
      return;
    }
    if (d.hit?.kind === 'ball') {
      const at = { x: p.x + d.grab.x, y: p.y + d.grab.y };
      hist.commit(dropBall(d.base, d.frame, at, Math.max(GIVE_RADIUS, grabRadius())), d.group);
    }
  };

  // Keyboard: with a player chosen, arrows move them 1 m (Shift: 5 m). Escape lets go.
  const onStageKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSel(null);
      return;
    }
    const n = e.shiftKey ? 5 : 1;
    const d: Record<string, Vec> = {
      ArrowUp: { x: 0, y: -n },
      ArrowDown: { x: 0, y: n },
      ArrowLeft: { x: -n, y: 0 },
      ArrowRight: { x: n, y: 0 },
    };
    if (!d[e.key] || !selPlayer) return;
    e.preventDefault();
    const s = project(frame.pos[selPlayer.id], orientation);
    const to = unproject({ x: s.x + d[e.key].x, y: s.y + d[e.key].y }, orientation);
    hist.commit(movePlayer(b, fi, selPlayer.id, to), `keys-${selPlayer.id}-${fi}`);
  };

  /* ---------- Steps ---------- */

  const goTo = (i: number) => {
    setK(i);
    if (ballSelected) setSel(null);
  };
  const appendStep = () => {
    hist.commit(addFrame(b, last));
    setK(last + 1);
  };
  const insertStep = () => {
    hist.commit(addFrame(b, fi));
    setK(fi + 1);
  };
  const removeStep = () => {
    if (fi < 1) return;
    hist.commit(deleteFrame(b, fi));
    setK(fi - 1);
  };

  /* ---------- Chosen player ---------- */

  const rename = () => {
    if (!selPlayer) return;
    const v = window.prompt(`New label for ${teamWord(selPlayer)} ${selPlayer.label} (up to ${LIMITS.label} letters)`, selPlayer.label);
    if (v !== null && v.trim()) hist.commit(relabel(b, selPlayer.id, v.trim()));
  };

  /* ---------- The whole play ---------- */

  const exportPlay = () => {
    save.flush();
    downloadText(fileNameFor([b]), boardFile([{ ...b, updated: Date.now() }]));
  };
  const copyPlay = () => {
    save.flush();
    const now = Date.now();
    openNewBoard({ ...b, id: newId(), title: `${b.title} (copy)`.slice(0, LIMITS.title), created: now, updated: now });
  };
  const deletePlay = () => {
    if (!window.confirm(`Delete “${b.title}”? This can’t be undone.`)) return;
    save.stop();
    deleteBoard(b.id);
    window.location.hash = href('board');
  };

  /* ---------- What to draw ---------- */

  const arrows: Annotation[] = prev && frame.arrows ? frameMoves(b, fi).map((m) => ({ ...m, t0: 0, t1: 1 })) : [];
  const ghosts = prev ? b.players.filter((p) => dist(prev.pos[p.id], frame.pos[p.id]) >= 0.5) : [];
  const onUs = b.players.filter((p) => p.team === 'us').length;
  const onThem = b.players.filter((p) => p.team === 'them').length;
  const source = b.from ? playById(b.from) : undefined;
  const secsChoices =
    frame.secs !== null && !SECS_CHOICES.includes(frame.secs)
      ? [...SECS_CHOICES, frame.secs].sort((x, y) => x - y)
      : SECS_CHOICES;
  const ballScreen = project(ballAt, orientation);

  const hint = ballSelected
    ? 'Tap a player to give them the ball, or tap a spot to put it there.'
    : selPlayer
      ? `Tap the pitch to move ${teamWord(selPlayer)} ${selPlayer.label} there, or drag them.`
      : fi === 0
        ? 'Drag players to where they start. Tap a player for more.'
        : 'Move whoever moves in this step. Faded players show where they were.';

  return (
    <article className="page board">
      <a className="back-link" href={href('board')}>
        ← My plays
      </a>

      <div className="board__head">
        <label className="board__title">
          <span className="visually-hidden">Name of this play</span>
          <input
            value={b.title}
            maxLength={LIMITS.title}
            placeholder="Name this play"
            onChange={(e) => hist.commit(retitle(b, e.target.value), 'title')}
          />
        </label>
        <div className="board__mode" role="group" aria-label="Edit or watch">
          <button
            type="button"
            className={mode === 'edit' ? 'seg seg--on' : 'seg'}
            aria-pressed={mode === 'edit'}
            onClick={() => setMode('edit')}
          >
            Edit
          </button>
          <button
            type="button"
            className={mode === 'watch' ? 'seg seg--on' : 'seg'}
            aria-pressed={mode === 'watch'}
            onClick={() => {
              setSel(null);
              setMode('watch');
            }}
          >
            ▶ Watch
          </button>
        </div>
      </div>

      {save.failed ? (
        <p className="board__msg board__msg--bad" role="alert">
          Changes aren’t being saved: this browser’s storage is full or blocked. Export the play to keep it.
        </p>
      ) : null}

      {mode === 'watch' ? (
        <>
          {b.frames.length < 2 ? (
            <p className="note">
              No steps yet, so this just shows the starting positions. Go back to Edit and press “+ Step” to make it
              move.
            </p>
          ) : null}
          <PlayViewer play={play} firstIsStart />
        </>
      ) : (
        <>
          <details className="note board__how" open={initial.frames.length === 1 && initial.created === initial.updated}>
            <summary>How the board works</summary>
            <ol>
              <li>
                <strong>Start:</strong> drag players to where they begin. Tap a player to give them the ball, rename
                them or take them off.
              </li>
              <li>
                <strong>+ Step</strong> adds the next moment. Move whoever moves in it. Faded players show where they
                were, and the arrows are drawn for you: runs, passes and dribbles.
              </li>
              <li>
                <strong>Move the ball:</strong> press it, then tap the player who gets the ball (a pass) or a spot (into
                space).
              </li>
              <li>
                <strong>▶ Watch</strong> plays it back with the usual controls. Changes save by themselves, on this
                device.
              </li>
            </ol>
          </details>

          <div className="board__edit">
            <div className="board__strip">
              <ol ref={framesRef} className="board__frames" aria-label="Steps">
                {b.frames.map((f, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className={i === fi ? 'board__frame board__frame--on' : 'board__frame'}
                      aria-current={i === fi ? 'step' : undefined}
                      title={f.title || (i ? `Step ${i}` : 'Start')}
                      onClick={() => goTo(i)}
                    >
                      {i === 0 ? 'Start' : i}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="board__frame board__frame--add"
                    onClick={appendStep}
                    disabled={b.frames.length >= LIMITS.frames}
                  >
                    + Step
                  </button>
                </li>
              </ol>
              <span className="board__undo">
                <button
                  type="button"
                  className="btn btn--small"
                  onClick={undo}
                  disabled={!hist.canUndo}
                  aria-label="Undo"
                  title="Undo (Ctrl+Z)"
                >
                  ↶
                </button>
                <button
                  type="button"
                  className="btn btn--small"
                  onClick={redo}
                  disabled={!hist.canRedo}
                  aria-label="Redo"
                  title="Redo (Ctrl+Shift+Z)"
                >
                  ↷
                </button>
              </span>
            </div>

            <div
              ref={stageRef}
              className={`${stage.className} board__stage`}
              style={stage.style}
              tabIndex={0}
              onKeyDown={onStageKey}
              aria-label="Tactics board pitch. Tap a player to choose them; with a player chosen, the arrow keys move them."
            >
              <Pitch
                orientation={orientation}
                svgRef={svgRef}
                ariaLabel={`${b.title}: ${fi === 0 ? 'starting positions' : `step ${fi}`}`}
                underlay={
                  <>
                    <ArrowDefs />
                    <AnnotationLayer annotations={arrows} t={0.5} />
                  </>
                }
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              >
                {prev ? (
                  <g className="token-ghost">
                    {ghosts.map((p) => (
                      <PlayerToken
                        key={p.id}
                        at={project(prev.pos[p.id], orientation)}
                        team={p.team}
                        label={p.label}
                        title={`Where ${teamWord(p)} ${p.label} was`}
                      />
                    ))}
                  </g>
                ) : null}
                {b.players.map((p) => (
                  <PlayerToken
                    key={p.id}
                    at={project(frame.pos[p.id], orientation)}
                    team={p.team}
                    label={p.label || '?'}
                    highlighted={p.id === sel}
                    hasBall={carrier === p.id}
                    title={`${p.team === 'us' ? 'Our' : 'Their'} ${p.label}`}
                  />
                ))}
                {ballSelected ? <circle className="board__ball-halo" cx={ballScreen.x} cy={ballScreen.y} r={1.6} /> : null}
                <circle className="ball" cx={ballScreen.x} cy={ballScreen.y} r={0.6} />
              </Pitch>
              <AttackDirection />
            </div>

            <div className="board__bar">
              <p className="board__hint" aria-live="polite">
                {hint}
              </p>
              <div className="board__actions">
                {selPlayer ? (
                  <>
                    <button
                      type="button"
                      className="btn btn--small"
                      disabled={carrier === selPlayer.id}
                      onClick={() => hist.commit(setBall(b, fi, { with: selPlayer.id }))}
                    >
                      {carrier === selPlayer.id ? 'Has the ball' : 'Give ball'}
                    </button>
                    <button type="button" className="btn btn--small" onClick={rename}>
                      Rename
                    </button>
                    <button
                      type="button"
                      className="btn btn--small"
                      onClick={() => {
                        hist.commit(removePlayer(b, selPlayer.id));
                        setSel(null);
                      }}
                    >
                      Take off
                    </button>
                    <button
                      type="button"
                      className="btn btn--small"
                      onClick={() => setSel(null)}
                      aria-label="Done with this player"
                      title="Done"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className={ballSelected ? 'btn btn--small btn--on' : 'btn btn--small'}
                      aria-pressed={ballSelected}
                      onClick={() => setSel(ballSelected ? null : BALL)}
                    >
                      {ballSelected ? 'Cancel' : 'Move the ball'}
                    </button>
                    {!ballSelected && b.players.length ? (
                      <label className="board__pick">
                        <span className="visually-hidden">Choose a player</span>
                        <select
                          value=""
                          onChange={(e) => {
                            if (!e.target.value) return;
                            setSel(e.target.value);
                            // Straight to the pitch, so the arrow keys move them.
                            window.requestAnimationFrame(() => stageRef.current?.focus());
                          }}
                        >
                          <option value="">Choose a player…</option>
                          {b.players.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.team === 'us' ? 'Our' : 'Their'} {p.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <section className="board__panel" aria-labelledby="board-step">
              <div className="board__panel-head">
                <h2 id="board-step">{fi === 0 ? 'Start' : `Step ${fi} of ${last}`}</h2>
                <span className="board__nav">
                  <button
                    type="button"
                    className="btn btn--small"
                    disabled={fi === 0}
                    onClick={() => goTo(fi - 1)}
                    aria-label="Previous step"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="btn btn--small"
                    disabled={fi === last}
                    onClick={() => goTo(fi + 1)}
                    aria-label="Next step"
                  >
                    →
                  </button>
                </span>
              </div>
              <label className="field">
                <span>{fi === 0 ? 'The set-up' : 'What happens'}</span>
                <input
                  value={frame.title}
                  maxLength={LIMITS.stepTitle}
                  placeholder={fi === 0 ? 'e.g. Our centre pass' : 'e.g. CH passes to the right wing'}
                  onChange={(e) => hist.commit(updateFrame(b, fi, { title: e.target.value }), `title-${fi}`)}
                />
              </label>
              <label className="field">
                <span>
                  More detail <span className="muted">(optional)</span>
                </span>
                <textarea
                  rows={3}
                  value={frame.caption}
                  maxLength={LIMITS.caption}
                  onChange={(e) => hist.commit(updateFrame(b, fi, { caption: e.target.value }), `caption-${fi}`)}
                />
              </label>
              {fi > 0 ? (
                <div className="board__row">
                  <label className="field field--inline">
                    <span>Time</span>
                    <select
                      value={frame.secs === null ? 'auto' : String(frame.secs)}
                      onChange={(e) =>
                        hist.commit(updateFrame(b, fi, { secs: e.target.value === 'auto' ? null : Number(e.target.value) }))
                      }
                    >
                      <option value="auto">Auto ({secsLabel(autoSecs(b, fi))})</option>
                      {secsChoices.map((s) => (
                        <option key={s} value={String(s)}>
                          {secsLabel(s)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      checked={frame.arrows}
                      onChange={(e) => hist.commit(updateFrame(b, fi, { arrows: e.target.checked }))}
                    />
                    Show arrows
                  </label>
                </div>
              ) : null}
              <div className="board__row">
                <button
                  type="button"
                  className="btn btn--small"
                  onClick={insertStep}
                  disabled={b.frames.length >= LIMITS.frames}
                >
                  + Step after this
                </button>
                {fi > 0 ? (
                  <button type="button" className="btn btn--small board__danger" onClick={removeStep}>
                    Delete this step
                  </button>
                ) : null}
              </div>
            </section>

            <details className="board__players">
              <summary>
                Add players <span className="muted">· {onUs} of ours, {onThem} of theirs on</span>
              </summary>
              <p className="muted small">
                New players go to their usual spot in every step. To take someone off, tap them, then “Take off”.
              </p>
              {(['us', 'them'] as const).map((team) => {
                const missing = SLOTS.filter((s) => s.team === team && !b.players.some((p) => p.id === s.id));
                return (
                  <div key={team}>
                    <h3 className="board__sub">{team === 'us' ? 'Us' : 'Them'}</h3>
                    {missing.length ? (
                      <ul className="chips">
                        {missing.map((s) => (
                          <li key={s.id}>
                            <button
                              type="button"
                              className="chip"
                              onClick={() => {
                                hist.commit(addPlayer(b, s, fi));
                                setSel(s.id);
                              }}
                            >
                              + {s.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="muted small">All eleven are on.</p>
                    )}
                  </div>
                );
              })}
            </details>
          </div>
        </>
      )}

      <section className="board__footer" aria-labelledby="board-this-play">
        <h2 id="board-this-play">This play</h2>
        <div className="board__row">
          <button type="button" className="btn" onClick={exportPlay}>
            Export as a file
          </button>
          <button type="button" className="btn" onClick={copyPlay}>
            Make a copy
          </button>
          <button type="button" className="btn board__danger" onClick={deletePlay}>
            Delete
          </button>
        </div>
        {source ? (
          <p className="muted small">
            Started as a copy of the library play <a href={href('plays', source.id)}>{source.title}</a>.
          </p>
        ) : null}
      </section>
    </article>
  );
}
