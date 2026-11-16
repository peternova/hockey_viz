import { rect, type PositionGuide } from './types';

const PC_DEFENCE_FIVE =
  'Up to five defenders, including the goalkeeper, start behind the back-line; everyone else waits beyond halfway until the ball is injected (Rule 13.3). Your team decides who the five are.';

export const leftBack: PositionGuide = {
  id: 'LB',
  line: 'defence',
  side: 'left',
  name: 'Left back',
  aka: ['Left half (older AU/NZ name)', 'Left fullback (US)', 'Left defender'],
  oneLiner:
    'Defends the left side of our 23, then becomes an extra attacker down the left when we have the ball.',
  roles: ['LB'],
  zone: { attack: rect(30, 72, 1, 20), defend: rect(6, 40, 4, 27) },
  zoneNotes: {
    attack: 'Wide on the left, from our half up towards their 23 when overlapping.',
    defend: 'Tucked in towards the middle, inside our half: closer to the centre backs than to the side-line.',
  },
  moments: {
    haveBall: [
      'Get wide and give the centre backs an easy outlet. Open your body so you can see the whole pitch.',
      'When the ball is on the far side, tuck in level with the centre backs as cover.',
      'Push up to support the left midfielder, and overlap down the line when there’s space, but only if someone covers behind you.',
      'Pass early: a short pass inside or down the line beats a long dribble.',
    ],
    theyHaveBall: [
      'Ball on your side: mark the attacker on your side goal-side and inside, so you can see them and the ball.',
      'Ball on the far side: come infield and drop level with the centre backs. The far winger isn’t dangerous yet.',
      'Delay the attacker on the ball: slow them down until help arrives rather than diving in.',
      'Watch for a switch to your side, and be ready to step out to the receiver while the ball travels.',
    ],
    wonIt: [
      'First look: is there a pass forward to the left midfielder or left wing?',
      'If you’re under pressure, play safe: back to the goalkeeper or across to a centre back.',
      'Then get wide again and offer an option.',
    ],
    lostIt: [
      'Sprint goal-side immediately, to get back between the ball and our goal.',
      'If you’re caught upfield, call the left midfielder to cover until you’re back.',
      'Re-join the back line. Don’t chase the ball across the pitch.',
    ],
  },
  setPieces: [
    {
      name: 'Penalty corner (defending)',
      role: `Often one of the five behind the back-line, as a runner covering the left of the goalkeeper or as the post player. ${PC_DEFENCE_FIVE}`,
    },
    {
      name: 'Penalty corner (attacking)',
      role: 'Usually stays back as cover against the counter-attack, or at the top of the circle if you have a strong hit.',
    },
    {
      name: 'Defensive free hit',
      role: 'A free hit to us within 15 m of our back-line is taken up to 15 m out (the old “16-yard hit”). Get wide on the left as an outlet before it’s taken.',
    },
    {
      name: 'Long corner (against us)',
      role: 'Taken on the 23 m line in line with where the ball went out. Mark the nearest attacker goal-side.',
    },
    {
      name: 'Centre pass',
      role: 'Everyone starts in their own half. Hold your position wide-left, ready for their first pass.',
    },
  ],
  sideSpecifics: [
    'The side-line is on your reverse (left) side, so channelling an attacker to the line means tackling on your reverse stick, which is the harder side.',
    'The attacker coming down your side (their right wing) has the side-line on their forehand, so they’re comfortable carrying the ball there.',
    'That’s why some coaches have the left back show attackers infield, onto the left back’s open stick, but only when a centre back is covering.',
    'Going forward, a pass infield is on your open stick (easy). A pass down the line needs a reverse-stick pass or a turn.',
  ],
  keySkills: [
    'Reverse-stick block and jab tackles',
    'Receiving on your reverse side while moving forward',
    'Open-stick passes infield, and long passes to switch play',
    'Reading when to step up and when to drop off',
  ],
  mistakes: [
    'Diving in on the reverse stick and getting beaten on the outside',
    'Staying wide when the ball is on the far side, leaving a gap next to the centre back',
    'Overlapping without cover, so we’re caught short on the counter-attack',
    'Dribbling out of defence under pressure instead of passing',
  ],
  playSmart: [
    'Start a few metres deeper and further inside. You’ll see more of the pitch and rarely have to turn and sprint.',
    'Use the side-line as a teammate: jockey and wait for the attacker’s mistake.',
    'Talk to the left midfielder in front of you: “Down the line!”, “Inside!”, “Time!”.',
    'Pick your overlaps. One well-timed run beats ten tiring ones.',
  ],
  variesByCoach:
    'Whether the left back channels attackers to the side-line (reverse-stick tackle) or shows them inside onto the left back’s open stick (with cover) is a team decision. Ask your coach which they want.',
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};

export const centreBack: PositionGuide = {
  id: 'CB',
  line: 'defence',
  side: 'centre',
  name: 'Centre back',
  aka: ['Fullback (traditional AU/NZ name)', 'Sweeper (in a back three)', 'Central defender'],
  oneLiner:
    'The heart of the defence: protects the middle of our circle, organises the back line, and starts attacks from the back. A 4-3-3 has two.',
  roles: ['LCB', 'RCB'],
  zone: { attack: rect(22, 52, 12, 43), defend: rect(4, 30, 14, 41) },
  zoneNotes: {
    attack: 'Spread across the middle of our half, ready to recycle the ball and switch play. One always stays behind the ball.',
    defend: 'Central and deep, protecting the top of our circle.',
  },
  moments: {
    haveBall: [
      'Split wide, one either side of the circle, to give the goalkeeper and each other passing options.',
      'Look forward first: centre half, then the midfielders, then a long ball down the line.',
      'If one side is crowded, switch play through the back. A pass to the other centre back opens the far side.',
      'One centre back always stays behind the ball as cover.',
    ],
    theyHaveBall: [
      'Protect the middle: stay between the ball and the centre of our goal.',
      'One marks the centre forward goal-side; the other covers behind at an angle (cover and balance).',
      'When a wide defender steps out to the ball, slide across to cover the space behind them.',
      'Never both go to the same attacker.',
    ],
    wonIt: [
      'Play safe and early. The first pass out of defence must reach a teammate.',
      'If space opens, a long pass to a leading forward can catch them out of shape.',
      'Then get into position to receive again.',
    ],
    lostIt: [
      'Drop and protect the middle. Don’t chase out wide.',
      'Organise: call who marks whom (“I’ve got 9!”, “Left back, drop!”).',
      'Delay the attacker to buy time for the midfielders to recover.',
    ],
  },
  setPieces: [
    {
      name: 'Penalty corner (defending)',
      role: `Often the first runner (the most aggressive job: rushing the shooter) or the post player. Wear a face mask if you’re one of the five. ${PC_DEFENCE_FIVE}`,
    },
    {
      name: 'Penalty corner (attacking)',
      role: 'Strong hitters or drag flickers take the shot. The other centre back stays back as cover.',
    },
    {
      name: 'Defensive free hit',
      role: 'Usually taken by a centre back, up to 15 m from the back-line. Look for a quick self-pass or an early pass before the opposition sets up.',
    },
    {
      name: 'Long corner (against us)',
      role: 'Mark the most dangerous attacker near the top of the circle.',
    },
    {
      name: 'Centre pass',
      role: 'Stay deep. You’re the last line if their centre pass goes long.',
    },
  ],
  sideSpecifics: [
    'Left centre back: a pass out to the left back is on your reverse side. Open your body early so you can use your forehand instead.',
    'Right centre back: a pass to the right back is a natural forehand pass, so that side is often the easier outlet.',
    'Both: when defending, stay side-on with your stick low so you can tackle either way.',
  ],
  keySkills: [
    'Block and jab tackles while staying on your feet',
    'Long, accurate hits and slaps to switch play',
    'Intercepting by reading the pass early',
    'Clear, loud organising calls',
  ],
  mistakes: [
    'Both centre backs drawn to the ball, leaving their centre forward free',
    'Dribbling across the top of your own circle',
    'Diving in at the edge of the circle and giving away a penalty corner',
    'Standing level (flat) with the other centre back instead of one covering behind',
  ],
  playSmart: [
    'This is a reading position. Anticipation and positioning matter more than pace, and experienced players often excel here.',
    'Drop off a few metres against quick forwards and let the play come to you.',
    'Be the voice: organise the players in front of you so they do the running.',
    'Make simple passes. The safest pass out of defence is the best one.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};

export const rightBack: PositionGuide = {
  id: 'RB',
  line: 'defence',
  side: 'right',
  name: 'Right back',
  aka: ['Right half (older AU/NZ name)', 'Right fullback (US)', 'Right defender'],
  oneLiner:
    'Defends the right side of our 23 and supports attacks down the right, where the side-line is on your open stick.',
  roles: ['RB'],
  zone: { attack: rect(30, 72, 35, 54), defend: rect(6, 40, 28, 51) },
  zoneNotes: {
    attack: 'Wide on the right, from our half up towards their 23 when overlapping.',
    defend: 'Tucked in towards the middle, inside our half: closer to the centre backs than to the side-line.',
  },
  moments: {
    haveBall: [
      'Get wide and give the centre backs an outlet. Open your body to see the whole pitch.',
      'When the ball is on the far side, tuck in level with the centre backs as cover.',
      'Overlap the right midfielder when there’s space. The right suits carrying the ball on your open stick down the line.',
      'Pass early: forward down the line, or inside to the centre half.',
    ],
    theyHaveBall: [
      'Ball on your side: get goal-side and inside of the attacker on your side, so you can see them and the ball.',
      'Ball on the far side: come infield and drop level with the centre backs.',
      'Channel the attacker towards the side-line, where your open stick does the tackling.',
      'Be patient: jockey until they run out of room or the ball gets loose.',
    ],
    wonIt: [
      'First look: forward down the line to the right midfielder or right wing.',
      'Under pressure: back to the goalkeeper or across to a centre back.',
      'Then get wide again and offer an option.',
    ],
    lostIt: [
      'Sprint goal-side immediately.',
      'If you’re caught upfield, call the right midfielder to cover until you’re back.',
      'Re-join the back line. Don’t chase the ball across the pitch.',
    ],
  },
  setPieces: [
    {
      name: 'Penalty corner (defending)',
      role: `Often one of the five, as a runner covering the right of the goalkeeper or as the post player. ${PC_DEFENCE_FIVE}`,
    },
    {
      name: 'Penalty corner (attacking)',
      role: 'Usually stays back as cover against the counter-attack.',
    },
    {
      name: 'Defensive free hit',
      role: 'Taken up to 15 m from our back-line. Get wide on the right as an outlet before it’s taken.',
    },
    {
      name: 'Long corner (against us)',
      role: 'Taken on the 23 m line in line with where the ball went out. Mark the nearest attacker goal-side.',
    },
    {
      name: 'Centre pass',
      role: 'Everyone starts in their own half. Hold wide-right, ready for their first pass.',
    },
  ],
  sideSpecifics: [
    'The side-line is on your open (forehand) side, so channelling attackers to the line lets you block tackle on your strong side.',
    'Showing the attacker on your side (their left wing) the line pushes them onto their reverse stick.',
    'Passing infield needs your reverse stick, or turning your body to get the ball onto your forehand. Practise both.',
    'Going forward, you can carry the ball comfortably on your open stick down the line.',
  ],
  keySkills: [
    'Open-stick block tackle while moving backwards (jockeying)',
    'Reverse-stick pass or slap to move the ball infield',
    'Receiving a switched ball from the left on the run',
    'Timing your overlaps',
  ],
  mistakes: [
    'Arriving at the attacker at full speed and being beaten by a simple move',
    'Letting the attacker cut inside, onto their forehand and towards goal',
    'Staying wide when the ball is on the far side',
    'Overlapping without cover',
  ],
  playSmart: [
    'Start a few metres deeper. Being early to the right spot saves you a sprint.',
    'Let the side-line do half your defending: show them the line and wait.',
    'Talk to the right midfielder in front of you so they track runners for you.',
    'Pick your overlaps. Go when the right midfielder has the ball facing forward, not when they’re under pressure.',
  ],
  sources: ['coaching-consensus', 'fih-2027'],
  reviewed: false,
};
