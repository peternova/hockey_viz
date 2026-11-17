import { useEffect, useRef, useState } from 'react';
import { AttackDirection, Pitch } from '../../pitch/Pitch';
import { project } from '../../pitch/coords';
import { PlayerToken } from '../../engine/PlayerToken';
import { easeInOut, lerpVec } from '../../engine/interpolate';
import type { PositionId, Vec } from '../../engine/types';
import { ALL_POSITIONS, F433_ATTACK, F433_DEFEND, POSITION_LABEL } from '../../content/formations';
import type { PositionGuide } from '../../content/positions';
import { useAutoOrientation, usePrefersReducedMotion } from '../../lib/useMedia';

type Phase = 'defend' | 'attack';
const TWEEN_SECONDS = 1.6;

/** Ball/opposition context for each phase. */
const BALL: Record<Phase, Vec> = { attack: { x: 54.9, y: 27.85 }, defend: { x: 52.1, y: 27.15 } };
const OPPONENT: Vec = { x: 53, y: 27.5 };

/**
 * "Where you live": the whole team in 4-3-3 with this position highlighted and
 * its zone shaded. Toggling between defend/attack animates the team and the
 * zone together (u = 0 is defend, u = 1 is attack).
 */
export function PositionMap({ guide }: { guide: PositionGuide }) {
  const orientation = useAutoOrientation();
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>('defend');
  const [u, setU] = useState(0);
  const uRef = useRef(0);
  uRef.current = u;

  useEffect(() => {
    const target = phase === 'attack' ? 1 : 0;
    if (reducedMotion) {
      setU(target);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const cur = uRef.current;
      const step = dt / TWEEN_SECONDS;
      const next = target > cur ? Math.min(target, cur + step) : Math.max(target, cur - step);
      setU(next);
      if (next !== target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, reducedMotion]);

  const e = easeInOut(u);
  const pos = (r: PositionId) => lerpVec(F433_DEFEND[r], F433_ATTACK[r], e);
  const zone = guide.zone.defend.map((p, i) => lerpVec(p, guide.zone.attack[i], e));
  const ball = project(lerpVec(BALL.defend, BALL.attack, e), orientation);
  const opp = project(OPPONENT, orientation);
  const mine = new Set<PositionId>(guide.roles);

  return (
    <div className="posmap">
      <div className="posmap__toggle" role="group" aria-label="Show the team when">
        <button
          type="button"
          className={phase === 'defend' ? 'seg seg--on' : 'seg'}
          aria-pressed={phase === 'defend'}
          onClick={() => setPhase('defend')}
        >
          They have the ball
        </button>
        <button
          type="button"
          className={phase === 'attack' ? 'seg seg--on' : 'seg'}
          aria-pressed={phase === 'attack'}
          onClick={() => setPhase('attack')}
        >
          We have the ball
        </button>
      </div>
      <div className={`viewer__stage viewer__stage--${orientation}`}>
        <Pitch
          orientation={orientation}
          ariaLabel={`Where the ${guide.name} plays when ${phase === 'attack' ? 'we have' : 'they have'} the ball`}
          underlay={
            <polygon
              className="zone zone--mine"
              points={zone.map((p) => `${p.x},${p.y}`).join(' ')}
            />
          }
        >
          <g style={{ opacity: 1 - e }}>
            <PlayerToken at={opp} team="them" label="" title="Opponent with the ball" />
          </g>
          {ALL_POSITIONS.map((r) => (
            <PlayerToken
              key={r}
              at={project(pos(r), orientation)}
              team="us"
              label={POSITION_LABEL[r]}
              highlighted={mine.has(r)}
              dimmed={!mine.has(r)}
              title={POSITION_LABEL[r]}
            />
          ))}
          <circle className="ball" cx={ball.x} cy={ball.y} r={0.6} />
        </Pitch>
        <AttackDirection />
      </div>
      <p className="posmap__note" aria-live="polite">
        <strong>{phase === 'attack' ? 'We have the ball:' : 'They have the ball:'}</strong>{' '}
        {phase === 'attack' ? guide.zoneNotes.attack : guide.zoneNotes.defend}
      </p>
    </div>
  );
}
