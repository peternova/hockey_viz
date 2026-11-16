import { rect, type PositionGuide } from './types';

const PC_DEFENCE_HALFWAY =
  'If you’re not one of the five defenders behind the back-line, you must wait beyond halfway until the ball is injected (Rule 13.3). Then sprint back for rebounds, or stay up as an outlet if your coach wants a counter-attack option.';

const FREE_HIT_23 =
  'From a free hit to us inside their 23 m area, the ball can’t enter the circle until it has travelled 5 m or been touched by a defender (Rule 13.2 f). Offer a short option, or take a self-pass and carry it 5 m first.';

export const leftMid: PositionGuide = {
  id: 'LM',
  line: 'midfield',
  side: 'left',
  name: 'Left midfield',
  aka: ['Left inner / inside left (older name)', 'Left link', 'Left midfielder'],
  oneLiner:
    'Links defence and attack on the left. The busiest runner on the team, supporting both the left back and the left wing.',
  roles: ['LM'],
  zone: { attack: rect(42, 84, 3, 28), defend: rect(18, 56, 7, 31) },
  zoneNotes: {
    attack: 'Left of centre, from halfway to the edge of their circle: behind, inside or beyond the left wing.',
    defend: 'Left of centre between our 23 and halfway, in front of the left back.',
  },
  moments: {
    haveBall: [
      'Show for the ball from the defenders at an angle, not in a straight line.',
      'Receive side-on so you can see forward and switch play.',
      'Support the left wing: be a passing option behind or inside them, or run beyond them.',
      'When the ball is on the right, come inside to help in the middle.',
    ],
    theyHaveBall: [
      'Mark the opposition midfielder on your side, goal-side.',
      'Press their wide defender when they get the ball, angled the way your team’s press plan says.',
      'Protect the left back: if their winger gets past, get back and make it 2v1 for us.',
      'Squeeze infield when the ball is on the far side.',
    ],
    wonIt: [
      'Look forward first: a pass to the left wing or centre forward.',
      'Carry the ball into space if it opens in front of you.',
      'Switch to the right if the left is crowded.',
    ],
    lostIt: [
      'If you’re nearest, press immediately. A few seconds of hard work can win it straight back.',
      'Otherwise recover goal-side and pick up your player.',
      'Cover the left back if they were caught upfield.',
    ],
  },
  setPieces: [
    {
      name: 'Penalty corner (attacking)',
      role: 'Often the stopper (trapping the injection at the top of the circle) or a second shooting option. Good receivers make good stoppers.',
    },
    { name: 'Penalty corner (defending)', role: PC_DEFENCE_HALFWAY },
    { name: 'Centre pass', role: 'Often receives the first pass. Show early and receive side-on.' },
    { name: 'Free hits in their 23', role: FREE_HIT_23 },
  ],
  sideSpecifics: [
    'Passes along the left from the defence often arrive on your reverse side. Receive side-on, or let the ball run across your body onto your forehand.',
    'Switching play to the right is a natural open-stick pass, which makes it a big weapon from the left.',
    'When pressing on the left, your forehand faces infield, so your tackles come from the inside.',
  ],
  keySkills: [
    'Receiving on your reverse side on the move',
    'Turning with the ball under pressure',
    'Passing on the move off both sides',
    'Repeated running (support, then recovery)',
  ],
  mistakes: [
    'Receiving square-on (facing the passer) and being unable to see forward',
    'Ball-watching and losing your runner',
    'Getting caught too high and leaving the left back 2v1',
    'Holding the ball too long',
  ],
  playSmart: [
    'Midfield needs the most running, so use rolling subs early and often.',
    'Move smart, not more. A 5 m move into the right angle beats a 30 m sprint.',
    'Look around before you receive, so you know your next pass before the ball arrives.',
    'Let the ball do the work: one- and two-touch passing saves your legs.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};

export const centreHalf: PositionGuide = {
  id: 'CM',
  line: 'midfield',
  side: 'centre',
  name: 'Centre half',
  aka: ['Centre midfielder', 'Centre link', 'Pivot'],
  oneLiner: 'The hub of the team: receives from the defence, switches play, and screens the centre backs.',
  roles: ['CM'],
  zone: { attack: rect(38, 76, 15, 40), defend: rect(14, 52, 15, 40) },
  zoneNotes: {
    attack: 'The middle of the pitch, just behind the forwards, available to everyone.',
    defend: 'In front of the centre backs, blocking the route through the middle.',
  },
  moments: {
    haveBall: [
      'Be available: always give the defenders an angle to pass to you.',
      'Switch play: if one side is crowded, move the ball to the other.',
      'Receive on the half-turn (side-on) so you can play forward.',
      'Stay roughly central and let the wide players provide the width.',
    ],
    theyHaveBall: [
      'Screen the centre backs: stand between the ball and the middle of our defence.',
      'Mark their attacking midfielder and block passes into their centre forward.',
      'Press when the ball comes into the middle. Let it go wide, where it’s less dangerous.',
    ],
    wonIt: [
      'Look up: a quick pass forward catches the opposition out of shape.',
      'If nothing is on, keep possession by playing back or across.',
    ],
    lostIt: [
      'Be the first defender: delay the ball carrier and stop the forward pass.',
      'Get goal-side and protect the middle.',
    ],
  },
  setPieces: [
    {
      name: 'Penalty corner (attacking)',
      role: 'Often the stopper, the injector, or a second shooter at the top of the circle.',
    },
    {
      name: 'Penalty corner (defending)',
      role: `Sometimes one of the five behind the back-line. ${PC_DEFENCE_HALFWAY}`,
    },
    {
      name: 'Centre pass',
      role: 'Often takes it or receives the first pass. The ball may go in any direction (Rule 6.4).',
    },
    {
      name: 'Free hits',
      role: 'Restart quickly (a pass or a self-pass) when the opposition isn’t set. The ball must be stationary first.',
    },
  ],
  sideSpecifics: [
    'Practise receiving on both sides. In the middle, the ball comes from every direction.',
    'Switching right is an open-stick pass. Switching left needs a reverse-stick pass or a turn to your left.',
    'Open your body towards the side the play is going so you don’t have to turn blind.',
  ],
  keySkills: [
    'Receiving and turning on the half-turn',
    'Short and long passes off both sides',
    'Interceptions',
    'Looking around before you receive',
  ],
  mistakes: [
    'Receiving with your back to play and passing backwards every time',
    'Drifting wide and leaving the middle empty',
    'Diving into tackles and leaving the centre backs exposed',
    'Not talking',
  ],
  playSmart: [
    'Positioning beats pace in the middle: be in the passing lane before the pass is played.',
    'Organise the midfield: “Squeeze!”, “Switch!”, “Man on!”.',
    'Keep it simple. The team plays better when the ball moves quickly through you.',
    'Recover at stoppages and when the ball is far away. It’s a long game.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};

export const rightMid: PositionGuide = {
  id: 'RM',
  line: 'midfield',
  side: 'right',
  name: 'Right midfield',
  aka: ['Right inner / inside right (older name)', 'Right link', 'Right midfielder'],
  oneLiner: 'Links defence and attack on the right, supporting the right back and the right wing.',
  roles: ['RM'],
  zone: { attack: rect(42, 84, 27, 52), defend: rect(18, 56, 24, 48) },
  zoneNotes: {
    attack: 'Right of centre, from halfway to the edge of their circle: behind, inside or beyond the right wing.',
    defend: 'Right of centre between our 23 and halfway, in front of the right back.',
  },
  moments: {
    haveBall: [
      'Show for the ball from the defenders at an angle, not in a straight line.',
      'Receive side-on so you can see forward.',
      'Support the right wing: be an option behind or inside them, or run beyond them.',
      'Commit defenders by running at them, then release the pass (see the 2v1 overlap play).',
    ],
    theyHaveBall: [
      'Mark the opposition midfielder on your side, goal-side.',
      'Press their wide defender when they receive, angled the way your team’s press plan says.',
      'Protect the right back: track their runners back.',
      'Squeeze infield when the ball is on the far side.',
    ],
    wonIt: [
      'Look forward first: a pass to the right wing or centre forward.',
      'Carry the ball into space if it opens in front of you.',
      'Switch to the left if the right is crowded.',
    ],
    lostIt: [
      'If you’re nearest, press immediately.',
      'Otherwise recover goal-side and pick up your player.',
      'Cover the right back if they were caught upfield.',
    ],
  },
  setPieces: [
    {
      name: 'Penalty corner (attacking)',
      role: 'Often the stopper or a second shooting option at the top of the circle.',
    },
    { name: 'Penalty corner (defending)', role: PC_DEFENCE_HALFWAY },
    { name: 'Centre pass', role: 'Often receives the first pass. Show early and receive side-on.' },
    { name: 'Free hits in their 23', role: FREE_HIT_23 },
  ],
  sideSpecifics: [
    'On the right you can receive and carry the ball on your open stick, with the side-line on your right.',
    'Switching play to the left needs a reverse-stick pass or a turn, so practise the reverse slap and pass.',
    'Passes into the circle from the right are on your reverse side. Cutting infield onto your forehand opens up more options.',
  ],
  keySkills: [
    'Carrying the ball at speed on the open stick',
    'Reverse-stick passes and slaps',
    'Committing a defender, then passing (2v1s)',
    'Repeated running (support, then recovery)',
  ],
  mistakes: [
    'Running down the line into a dead end instead of switching',
    'Ball-watching and losing your runner',
    'Getting caught too high and leaving the right back 2v1',
    'Holding the ball too long',
  ],
  playSmart: [
    'Midfield needs the most running, so use rolling subs early and often.',
    'Make the defender commit before you pass. Timing beats pace.',
    'Look around before you receive.',
    'One- and two-touch passing saves your legs and speeds up the team.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};
