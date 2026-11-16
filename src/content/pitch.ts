import { CENTRE_Y, PITCH } from '../pitch/coords';

/**
 * Pitch Explorer content: every marking and area you can tap, with what it is
 * and the rules that apply there. Geometry is SVG path data in pitch metres
 * (x along the length, y across), so it rotates with the pitch on a phone.
 */

export type PitchLayer = 'lines' | 'areas' | 'coaching';

export interface PitchRule {
  text: string;
  /** FIH Rules of Hockey 2027 reference, e.g. "13.3 b". */
  rule?: string;
}

export interface PitchFeature {
  id: string;
  layer: PitchLayer;
  name: string;
  aka?: string[];
  what: string;
  rules: PitchRule[];
  /** How to draw/hit it: along a line, a filled area, or small marks. */
  draw: 'stroke' | 'fill' | 'marks';
  /** SVG path data (pitch coordinates). For 'marks', each path is one mark. */
  paths: string[];
  /** Fill rule for areas with holes. */
  evenOdd?: boolean;
  /** Drawing order within a layer (higher = on top). Smaller areas sit on top so they stay tappable. */
  z?: number;
  /** Glossary term ids. */
  terms?: string[];
  /** Play ids. */
  plays?: string[];
}

export const LAYERS: { id: PitchLayer; label: string }[] = [
  { id: 'lines', label: 'Lines & marks' },
  { id: 'areas', label: 'Rule areas' },
  { id: 'coaching', label: 'Coaching zones' },
];

const L = PITCH.length;
const W = PITCH.width;
const TOP_POST = CENTRE_Y - PITCH.halfGoal;
const BOTTOM_POST = CENTRE_Y + PITCH.halfGoal;

/** Open arc path (quarter circles + straight) around one goal. */
function arc(radius: number, end: 'left' | 'right'): string {
  if (end === 'left') {
    return `M 0 ${TOP_POST - radius} A ${radius} ${radius} 0 0 1 ${radius} ${TOP_POST} L ${radius} ${BOTTOM_POST} A ${radius} ${radius} 0 0 1 0 ${BOTTOM_POST + radius}`;
  }
  return `M ${L} ${TOP_POST - radius} A ${radius} ${radius} 0 0 0 ${L - radius} ${TOP_POST} L ${L - radius} ${BOTTOM_POST} A ${radius} ${radius} 0 0 0 ${L} ${BOTTOM_POST + radius}`;
}

/** Closed area inside an arc (closed along the back-line). */
function arcArea(radius: number, end: 'left' | 'right'): string {
  return `${arc(radius, end)} Z`;
}

function rectPath(x0: number, y0: number, x1: number, y1: number): string {
  return `M ${x0} ${y0} H ${x1} V ${y1} H ${x0} Z`;
}

function line(x0: number, y0: number, x1: number, y1: number): string {
  return `M ${x0} ${y0} L ${x1} ${y1}`;
}

/** A small round mark (drawn as a closed path so it can be filled). */
function dot(x: number, y: number, r = 0.6): string {
  return `M ${x - r} ${y} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
}

const L23 = PITCH.line23;
const THIRD = W / 3;

export const PITCH_FEATURES: PitchFeature[] = [
  // ---------- Lines & marks ----------
  {
    id: 'side-line',
    layer: 'lines',
    name: 'Side-line',
    aka: ['Sideline', 'Touchline'],
    what: 'The two long edges of the pitch, 91.40 m long. Lines are 75 mm wide and count as part of the field.',
    rules: [
      { text: 'The ball is out when it has passed completely over the line.', rule: '7.1' },
      {
        text: 'Restart with a free hit where it went out, to the team that didn’t touch it last. All the usual free-hit rules apply, including the self-pass.',
        rule: '7.3',
      },
    ],
    draw: 'stroke',
    paths: [line(0, 0, L, 0), line(0, W, L, W)],
    terms: ['side-line', 'free-hit', 'self-pass'],
  },
  {
    id: 'back-line',
    layer: 'lines',
    name: 'Back-line',
    aka: ['Baseline', 'End line'],
    what: 'The two short edges of the pitch, 55.00 m long, at each end.',
    rules: [
      {
        text: 'Off an attacker: the defence restarts with a free hit up to 15 m out, in line with where it crossed.',
        rule: '7.4 a',
      },
      {
        text: 'Off a defender by accident (or deflected by the goalkeeper): the attack restarts on the 23 m line, in line with where it crossed. This is the long corner.',
        rule: '7.4 b',
      },
      { text: 'Played over on purpose by a defender: penalty corner.', rule: '7.4 c' },
    ],
    draw: 'stroke',
    paths: [line(0, 0, 0, W), line(L, 0, L, W)],
    terms: ['back-line', 'long-corner', 'penalty-corner'],
    plays: ['b1-outlet', 'p4-long-corner', 'a3-baseline'],
  },
  {
    id: 'goal-line',
    layer: 'lines',
    name: 'Goal-line',
    what: 'The part of the back-line between the goal-posts.',
    rules: [
      {
        text: 'A goal is scored when the ball, played inside the circle by an attacker, passes completely over the goal-line under the cross-bar.',
        rule: '8.1',
      },
      { text: 'At a penalty stroke, the defender stands with both feet on the goal-line.', rule: '13.7 e' },
    ],
    draw: 'stroke',
    paths: [line(0, TOP_POST, 0, BOTTOM_POST), line(L, TOP_POST, L, BOTTOM_POST)],
    terms: ['goal', 'penalty-stroke'],
  },
  {
    id: 'centre-line',
    layer: 'lines',
    name: 'Centre-line',
    aka: ['Halfway line', '50-yard line (US)'],
    what: 'Across the middle of the pitch. It splits the field into our half and their half.',
    rules: [
      { text: 'Centre pass: everyone except the taker starts in their own half.', rule: '6.4 c' },
      {
        text: 'Penalty corner: defenders who aren’t among the five behind the back-line must wait beyond the centre-line until the ball is played.',
        rule: '13.3 g',
      },
      { text: 'Substitutions are made in the substitution area at the centre-line.', rule: '2.3' },
    ],
    draw: 'stroke',
    paths: [line(L / 2, 0, L / 2, W)],
    terms: ['centre-pass', 'penalty-corner', 'rolling-subs'],
    plays: ['p1-centre-pass', 'p3-pc-defence'],
  },
  {
    id: 'line-23',
    layer: 'lines',
    name: '23 m line',
    aka: ['23-metre line', '25-yard line (old/US)'],
    what: 'Lines across the pitch 22.90 m from each back-line. The line itself is part of the 23 m area.',
    rules: [
      { text: 'Long corners are taken on this line, in line with where the ball went out.', rule: '7.4 b' },
      { text: 'The goalkeeper may not take part in play beyond their own 23 m line.', rule: '10.1' },
    ],
    draw: 'stroke',
    paths: [line(L23, 0, L23, W), line(L - L23, 0, L - L23, W)],
    terms: ['area-23', 'long-corner', 'goalkeeper'],
    plays: ['p4-long-corner'],
  },
  {
    id: 'circle-line',
    layer: 'lines',
    name: 'Circle line',
    aka: ['Edge of the D', 'Top of the circle (the straight part)'],
    what: 'Two quarter-circles of 14.63 m radius centred on the goal-posts, joined by a 3.66 m straight line. The line is part of the circle.',
    rules: [
      { text: 'Penalty corner: attackers wait outside the circle until the ball is played.', rule: '13.3 d' },
    ],
    draw: 'stroke',
    paths: [arc(PITCH.circleRadius, 'left'), arc(PITCH.circleRadius, 'right')],
    terms: ['circle', 'top-of-the-circle'],
  },
  {
    id: 'dotted-line',
    layer: 'lines',
    name: 'Dotted line',
    aka: ['Broken line', '5 m line'],
    what: 'A dashed line 5 m outside the circle.',
    rules: [
      { text: 'A penalty corner is over when the ball travels beyond this line.', rule: '13.5 c' },
      { text: 'A bully can’t be taken within 5 m of the circle.', rule: '6.5 a' },
      {
        text: 'Free hit to the attack within 5 m of the circle and taken immediately: defenders inside the circle may shadow a self-pass, but can’t play the ball until it has gone 5 m.',
        rule: '13.2 f',
      },
    ],
    draw: 'stroke',
    paths: [arc(PITCH.dottedRadius, 'left'), arc(PITCH.dottedRadius, 'right')],
    terms: ['dotted-line', 'penalty-corner', 'bully'],
  },
  {
    id: 'penalty-spot',
    layer: 'lines',
    name: 'Penalty spot',
    aka: ['Stroke mark', 'Spot'],
    what: 'A 150 mm spot in front of the centre of each goal, 6.475 m from the outer edge of the goal-line.',
    rules: [
      {
        text: 'Penalty strokes are taken from here. The taker must push, flick or scoop, and may raise the ball to any height.',
        rule: '13.7',
      },
      { text: 'Everyone else waits outside the 23 m area during the stroke.', rule: '13.7 b' },
    ],
    draw: 'marks',
    paths: [dot(PITCH.penaltySpot, CENTRE_Y), dot(L - PITCH.penaltySpot, CENTRE_Y)],
    terms: ['penalty-stroke'],
  },
  {
    id: 'backline-marks',
    layer: 'lines',
    name: 'Back-line marks (5 m and 10 m)',
    what: 'Short lines just outside the field on the back-line, 5 m and 10 m from the outer edge of each goal-post.',
    rules: [
      {
        text: 'At a penalty corner the ball is placed on the back-line at least 10 m from the goal-post, on whichever side the attack prefers.',
        rule: '13.3 b',
      },
    ],
    draw: 'marks',
    paths: PITCH.backlineMarks.flatMap((d) => [
      dot(0, TOP_POST - d),
      dot(0, BOTTOM_POST + d),
      dot(L, TOP_POST - d),
      dot(L, BOTTOM_POST + d),
    ]),
    terms: ['penalty-corner', 'injector'],
    plays: ['p2-pc-attack'],
  },
  {
    id: 'sideline-marks',
    layer: 'lines',
    name: 'Side-line marks (14.63 m)',
    what: 'Short lines just outside each side-line, 14.63 m from the back-line: the same distance as the circle’s radius.',
    rules: [{ text: 'Part of the standard pitch markings (Field specifications 1.3 f).' }],
    draw: 'marks',
    paths: [
      dot(PITCH.sidelineMark, 0),
      dot(PITCH.sidelineMark, W),
      dot(L - PITCH.sidelineMark, 0),
      dot(L - PITCH.sidelineMark, W),
    ],
  },
  {
    id: 'goal',
    layer: 'lines',
    name: 'Goal',
    aka: ['Cage', 'Net'],
    what: 'Outside the field, touching the back-line: 3.66 m wide between the posts and 2.14 m high. The backboard along the bottom is 460 mm high.',
    rules: [
      {
        text: 'At a penalty corner, if the first shot at goal is a hit, it must cross the goal-line no higher than the 460 mm backboard.',
        rule: '13.3 l',
      },
      { text: 'Players must not intentionally enter the goal or run behind it.', rule: '9.14' },
    ],
    draw: 'fill',
    paths: [
      rectPath(-PITCH.goalDepth, TOP_POST, 0, BOTTOM_POST),
      rectPath(L, TOP_POST, L + PITCH.goalDepth, BOTTOM_POST),
    ],
    terms: ['goal', 'backboard'],
  },

  // ---------- Rule areas ----------
  {
    id: 'circle',
    z: 4,
    layer: 'areas',
    name: 'The circle',
    aka: ['Shooting circle', 'Striking circle', 'The D', 'Scoring circle'],
    what: 'The area inside the circle line around each goal, including the line itself.',
    rules: [
      { text: 'Goals can only be scored from inside the circle.', rule: '8.1' },
      { text: 'A defender’s offence in their circle gives a penalty corner…', rule: '12.3 a' },
      { text: '…or a penalty stroke if it stops a probable goal or is intentional against a player with the ball.', rule: '12.4' },
      { text: 'Inside their circle, the goalkeeper may use their body and kickers to play the ball.', rule: '10.2' },
    ],
    draw: 'fill',
    paths: [arcArea(PITCH.circleRadius, 'left'), arcArea(PITCH.circleRadius, 'right')],
    terms: ['circle', 'penalty-corner', 'penalty-stroke', 'goalkeeper'],
    plays: ['a4-circle-entry', 'a3-baseline'],
  },
  {
    id: 'band-5m',
    z: 3,
    layer: 'areas',
    name: 'The 5 m band',
    aka: ['Between the circle and the dotted line'],
    what: 'The strip between the circle line and the dotted line.',
    rules: [
      {
        text: 'Attacking free hits here: if taken immediately, defenders in the circle may shadow a self-pass, but can’t play the ball until it has travelled 5 m.',
        rule: '13.2 f',
      },
      { text: 'When the ball leaves this band outwards, a penalty corner is over.', rule: '13.5 c' },
    ],
    draw: 'fill',
    evenOdd: true,
    paths: [
      `${arcArea(PITCH.dottedRadius, 'left')} ${arcArea(PITCH.circleRadius, 'left')}`,
      `${arcArea(PITCH.dottedRadius, 'right')} ${arcArea(PITCH.circleRadius, 'right')}`,
    ],
    terms: ['dotted-line', 'five-metre-rule', 'self-pass'],
    plays: ['p5-free-hit-23'],
  },
  {
    id: 'area-23',
    z: 1,
    layer: 'areas',
    name: 'The 23 m area',
    aka: ['The 23', 'The 25 (old/US)', 'Defensive/attacking 23'],
    what: 'The area between the back-line and the 23 m line at each end, including the line.',
    rules: [
      { text: 'The goalkeeper must stay inside their own 23 m area.', rule: '10.1' },
      { text: 'Attacking free hit inside the 23: every player except the taker must be 5 m from the ball.', rule: '13.2 c' },
      {
        text: '…and the ball can’t enter the circle until it has travelled 5 m or been touched by a defender.',
        rule: '13.2 f',
      },
      { text: 'An intentional offence by a defender inside their 23 (outside the circle) gives a penalty corner.', rule: '12.3 c' },
      { text: 'An unintentional one gives a free hit.', rule: '12.2 c' },
    ],
    draw: 'fill',
    paths: [rectPath(0, 0, L23, W), rectPath(L - L23, 0, L, W)],
    terms: ['area-23', 'five-metre-rule', 'self-pass', 'goalkeeper'],
    plays: ['p5-free-hit-23', 'p4-long-corner'],
  },
  {
    id: 'zone-15m',
    z: 2,
    layer: 'areas',
    name: 'Defensive 15 m zone (not marked)',
    what: 'An unmarked strip 15 m deep in front of each back-line.',
    rules: [
      {
        text: 'A free hit to the defence awarded inside 15 m of their back-line may be taken up to 15 m out, in line with the offence.',
        rule: '13.1 b',
      },
      { text: 'A free hit to the defence awarded in the circle may be taken anywhere in the circle.', rule: '13.1 b' },
      { text: 'A bully can’t be taken within 15 m of the back-line.', rule: '6.5 a' },
    ],
    draw: 'fill',
    paths: [rectPath(0, 0, 15, W), rectPath(L - 15, 0, L, W)],
    terms: ['free-hit', 'outlet', 'bully'],
    plays: ['b1-outlet'],
  },
  {
    id: 'midfield',
    layer: 'areas',
    name: 'Midfield (between the 23s)',
    aka: ['The middle'],
    what: 'Everything between the two 23 m lines, about 45.6 m. Coaches often split the pitch into the defensive 23, midfield and attacking 23 rather than thirds.',
    rules: [
      { text: 'Any offence here, by either team, gives a free hit to the other team.', rule: '12.2 a' },
      { text: 'Opponents must be 5 m from a free hit, but team-mates don’t have to be.', rule: '13.2 b' },
    ],
    draw: 'fill',
    paths: [rectPath(L23, 0, L - L23, W)],
    terms: ['free-hit', 'five-metre-rule', 'midfielder'],
    plays: ['b3-triangles', 'd4-pressing'],
  },

  // ---------- Coaching zones ----------
  {
    id: 'corridor-left',
    layer: 'coaching',
    name: 'Left corridor',
    aka: ['Left channel', 'Left flank'],
    what: 'The left third of the pitch’s width (facing the goal you attack). The left back, left mid and left wing mostly work here. Attacking down the left needs more reverse-stick skill, because the open stick faces infield.',
    rules: [{ text: 'A coaching idea, not a marking: there’s no rule about corridors.' }],
    draw: 'fill',
    paths: [rectPath(0, 0, L, THIRD)],
    terms: ['corridor', 'reverse-stick', 'width'],
    plays: ['b2-switch', 'a2-give-and-go'],
  },
  {
    id: 'corridor-centre',
    layer: 'coaching',
    name: 'Centre corridor',
    aka: ['Central channel', 'The middle'],
    what: 'The middle third of the width. The most direct route to goal, so it’s the most crowded. Defenders try to keep the ball out of it; attackers try to get it in.',
    rules: [{ text: 'A coaching idea, not a marking.' }],
    draw: 'fill',
    paths: [rectPath(0, THIRD, L, 2 * THIRD)],
    terms: ['corridor', 'channelling', 'compact'],
    plays: ['d1-channelling', 's2-shifting'],
  },
  {
    id: 'corridor-right',
    layer: 'coaching',
    name: 'Right corridor',
    aka: ['Right channel', 'Right flank'],
    what: 'The right third of the width. The right back, right mid and right wing work here. The open stick faces the side-line, which makes running down the line and passing up it feel natural.',
    rules: [{ text: 'A coaching idea, not a marking.' }],
    draw: 'fill',
    paths: [rectPath(0, 2 * THIRD, L, W)],
    terms: ['corridor', 'open-stick', 'overlap'],
    plays: ['a1-overlap', 'a3-baseline'],
  },
  {
    id: 'top-of-circle',
    z: 1,
    layer: 'coaching',
    name: 'Top of the circle',
    aka: ['Top of the D', 'The top'],
    what: 'The area just outside and inside the straight part of the circle, straight in front of goal. Penalty corner stoppers and shooters set up here, and a pass here often draws a defender out.',
    rules: [{ text: 'At a penalty corner, attackers must be outside the circle until the ball is played.', rule: '13.3 d' }],
    draw: 'fill',
    paths: [
      rectPath(PITCH.circleRadius - 4, CENTRE_Y - 7, PITCH.circleRadius + 4, CENTRE_Y + 7),
      rectPath(L - PITCH.circleRadius - 4, CENTRE_Y - 7, L - PITCH.circleRadius + 4, CENTRE_Y + 7),
    ],
    terms: ['top-of-the-circle', 'stopper', 'drag-flick'],
    plays: ['a4-circle-entry', 'p2-pc-attack'],
  },
];

export function pitchFeatureById(id: string): PitchFeature | undefined {
  return PITCH_FEATURES.find((f) => f.id === id);
}
