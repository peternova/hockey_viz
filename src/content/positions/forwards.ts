import { rect, type PositionGuide } from './types';

const PC_DEFENCE_OUTLET =
  'Wait beyond halfway until the ball is injected (Rule 13.3), ready to be the outlet for a quick counter-attack.';

const FREE_HIT_23 =
  'From a free hit to us inside their 23 m area, the ball can’t enter the circle until it has travelled 5 m or been touched by a defender (Rule 13.2 f). Lead to give a short option, or take a self-pass and carry it 5 m first.';

const LONG_CORNER =
  'Our long corner is taken on their 23 m line, in line with where the ball went over the back-line (Rule 7.4 b). Offer a short option or lead into the circle.';

export const leftWing: PositionGuide = {
  id: 'LW',
  line: 'forward',
  side: 'left',
  name: 'Left wing',
  aka: ['Left forward', 'Outside left (older name)', 'Left striker (US)'],
  oneLiner:
    'Stretches their defence on the left, creates chances, and is our first defender when we lose the ball.',
  roles: ['LW'],
  zone: { attack: rect(56, 90, 1, 24), defend: rect(38, 70, 6, 30) },
  zoneNotes: {
    attack: 'Wide on the left, from halfway to their back-line. Come in to the far post when the ball is on the right.',
    defend: 'Around halfway on the left, pressing their right-side defenders.',
  },
  moments: {
    haveBall: [
      'Hold your width: stay near the side-line so their defence has to spread.',
      'Lead to receive: move away, then sharply back towards the ball (leading and re-leading).',
      'Attack the circle: dribble in, pass to the post, or win a penalty corner.',
      'When the ball is on the right, come in to the far post for crosses.',
    ],
    theyHaveBall: [
      'You are the first defender: press their right-side defenders when they receive, the way your team’s press plan says.',
      'Block the easy pass up their line.',
      'If they break past you, get back behind the ball.',
    ],
    wonIt: [
      'Get wide and forward immediately to be the outlet.',
      'Look for a run behind their defence.',
    ],
    lostIt: [
      'Press straight away for a few seconds (counter-press).',
      'Then recover to the midfield line.',
    ],
  },
  setPieces: [
    { name: 'Penalty corner (attacking)', role: 'Often the injector, or a post player for deflections and rebounds.' },
    { name: 'Penalty corner (defending)', role: PC_DEFENCE_OUTLET },
    { name: 'Long corner (ours)', role: LONG_CORNER },
    { name: 'Free hits in their 23', role: FREE_HIT_23 },
  ],
  sideSpecifics: [
    'Crossing from the left into the circle is a natural open-stick pass, which is a big advantage of the left wing.',
    'Carrying the ball down the left line uses your reverse stick, so many left wings cut inside onto their forehand.',
    'In the circle on the left, the goal is on your forehand side, so forehand shots and passes come naturally.',
  ],
  keySkills: [
    'Leading and re-leading',
    'Receiving on your reverse side while running',
    'Open-stick crosses and passes to the post',
    'Beating a defender 1v1',
  ],
  mistakes: [
    'Standing still waiting for the ball',
    'Drifting inside and losing width',
    'Switching off when we lose possession',
    'Taking the ball over the back-line instead of passing',
  ],
  playSmart: [
    'Short, sharp leads beat long runs. Make 3 m of space, not 30.',
    'Time your lead to the passer’s head: go when they look up.',
    'Press smart: angle your run to cut off a pass instead of chasing the ball.',
    'Forwards sub often. Sprinting is your job, so go hard and then rest.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};

export const centreForward: PositionGuide = {
  id: 'CF',
  line: 'forward',
  side: 'centre',
  name: 'Centre forward',
  aka: ['Striker', 'Centre striker'],
  oneLiner:
    'Our main goal threat: leads to receive in front of defenders, holds up the ball, and finishes in the circle.',
  roles: ['CF'],
  zone: { attack: rect(62, 90, 14, 41), defend: rect(40, 72, 15, 40) },
  zoneNotes: {
    attack: 'Central, between their 23 and the goal, and especially around the posts.',
    defend: 'Around halfway, pressing their centre backs and blocking passes into the middle.',
  },
  moments: {
    haveBall: [
      'Lead into space to receive, timed with the passer.',
      'Hold the ball up with your back to goal and lay it off to supporting players.',
      'Get to the post. Most goals come from close range: deflections and rebounds.',
      'Stretch their defence by running behind it, making space for the midfielders.',
    ],
    theyHaveBall: [
      'Press their centre backs. Stop easy passes forward and switches.',
      'Block the pass into their centre half.',
    ],
    wonIt: ['Make yourself available high and central for the counter-attack.'],
    lostIt: ['Counter-press straight away, then drop back to the midfield line.'],
  },
  setPieces: [
    {
      name: 'Penalty corner (attacking)',
      role: 'Usually on the post for deflections and rebounds. Stay on your toes, ready to react.',
    },
    { name: 'Penalty corner (defending)', role: PC_DEFENCE_OUTLET },
    { name: 'Centre pass', role: 'Start in our half (Rule 6.4), ready to lead forward.' },
    { name: 'Free hits in their 23', role: FREE_HIT_23 },
  ],
  sideSpecifics: [
    'On the left of the circle, the goal is on your forehand side: strong pushes and hits.',
    'On the right of the circle, the goal is on your reverse side: reverse-stick shots, or a quick shift onto your forehand.',
    'A good centre forward can finish off both sides, so practise reverse-stick shooting.',
  ],
  keySkills: [
    'Leading and re-leading',
    'Receiving with your back to goal and laying off',
    'Deflections and first-time shots',
    'Reverse-stick shooting',
  ],
  mistakes: [
    'Standing behind defenders instead of leading in front of them',
    'Taking too many touches in the circle',
    'Not following up shots for rebounds',
    'Shielding the ball from a tackle with your body or stick, which is obstruction (Rule 9.12)',
  ],
  playSmart: [
    'Be in the right place: positioning at the post scores more than sprinting.',
    'Make your lead when the passer is ready, not before.',
    'Rest when the ball is in our defence, and be sharp when it’s coming forward.',
    'Talk to the midfielders behind you about where you want the ball.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};

export const rightWing: PositionGuide = {
  id: 'RW',
  line: 'forward',
  side: 'right',
  name: 'Right wing',
  aka: ['Right forward', 'Outside right (older name)', 'Right striker (US)'],
  oneLiner:
    'Stretches their defence on the right, takes on defenders on the open stick, and is our first defender when we lose the ball.',
  roles: ['RW'],
  zone: { attack: rect(56, 90, 31, 54), defend: rect(38, 70, 25, 49) },
  zoneNotes: {
    attack: 'Wide on the right, from halfway to their back-line. Come in to the far post when the ball is on the left.',
    defend: 'Around halfway on the right, pressing their left-side defenders.',
  },
  moments: {
    haveBall: [
      'Hold your width: stay near the side-line.',
      'Lead and re-lead to get free of your marker.',
      'Pull infield to drag your defender away and clear space for an overlap (see the 2v1 overlap play).',
      'When the ball is on the left, come in to the far post.',
    ],
    theyHaveBall: [
      'You are the first defender: press their left-side defenders when they receive.',
      'Block the easy pass up their line.',
      'If they break past you, get back behind the ball.',
    ],
    wonIt: ['Get wide and forward immediately to be the outlet.', 'Look for a run behind their defence.'],
    lostIt: ['Press straight away for a few seconds.', 'Then recover to the midfield line.'],
  },
  setPieces: [
    { name: 'Penalty corner (attacking)', role: 'Often the injector, or a post player for deflections and rebounds.' },
    { name: 'Penalty corner (defending)', role: PC_DEFENCE_OUTLET },
    { name: 'Long corner (ours)', role: LONG_CORNER },
    { name: 'Free hits in their 23', role: FREE_HIT_23 },
  ],
  sideSpecifics: [
    'Carrying the ball down the right line comes naturally on your open stick.',
    'Crossing into the circle from the right needs a reverse-stick pass or hit, a key skill to practise.',
    'In the circle on the right, the goal is on your reverse side: reverse-stick shots, or cutting back onto your forehand.',
  ],
  keySkills: [
    'Running with the ball at speed on the open stick',
    'Reverse-stick crosses and passes into the circle',
    'Leading and re-leading',
    'Beating a defender 1v1',
  ],
  mistakes: [
    'Running into the corner with no pass on',
    'Drifting inside and losing width (unless you’re clearing space on purpose)',
    'Switching off when we lose possession',
    'Taking the ball over the back-line instead of passing',
  ],
  playSmart: [
    'Short, sharp leads beat long runs.',
    'Use your movement to create space for others. A decoy run is a real contribution.',
    'Press smart: cut off the pass rather than chase the ball.',
    'Sub often. Sprint hard, then rest.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};
