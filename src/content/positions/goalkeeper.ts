import { rect, type PositionGuide } from './types';

export const goalkeeper: PositionGuide = {
  id: 'GK',
  line: 'goal',
  side: 'centre',
  name: 'Goalkeeper',
  aka: ['Keeper', 'Goalie'],
  oneLiner: 'Last line of defence with the best view on the pitch. Organises the defence as well as saving shots.',
  roles: ['GK'],
  zone: { attack: rect(0, 20, 14, 41), defend: rect(0, 9, 19, 36) },
  zoneNotes: {
    attack: 'Up to the edge of our 23 m area to support the defence. A goalkeeper can’t take part in play outside it (Rule 10.1).',
    defend: 'In and around the goal, adjusting your angle as the ball moves.',
  },
  moments: {
    haveBall: [
      'Give the centre backs a safe back-pass option.',
      'Clear the ball wide, never across the front of the circle.',
    ],
    theyHaveBall: [
      'Talk constantly: who’s marking whom, and where the danger is.',
      'Set your angle: stay on the line between the ball and the centre of the goal.',
      'Come off your line to close down a 1v1 when it’s on.',
      'Outside the circle you may only play the ball with your stick (Rule 10.4).',
    ],
    wonIt: ['Clear wide to a teammate or out of danger.'],
    lostIt: ['Organise the defence back into shape.'],
  },
  setPieces: [
    {
      name: 'Penalty corner (defending)',
      role: 'Lead the defence. You’re one of up to five defenders behind the back-line; set up centrally and react to the shot.',
    },
    {
      name: 'Penalty stroke',
      role: 'Stand with both feet on the goal-line. You may not leave the line or move either foot until the ball is played (Rule 13.7 e).',
    },
  ],
  sideSpecifics: [
    'Your stick is in your right hand, so low shots to your right are often stopped with the stick or kicker, and shots to your left with the left hand protector and pads.',
    'Inside the circle you may use your stick and body to deflect the ball in any direction, including over the back-line (Rule 10.2).',
  ],
  keySkills: ['Kicking clearances', 'Positioning and angles', 'Organising calls', 'Saves in 1v1s'],
  mistakes: [
    'Kicking the ball into the middle of the circle',
    'Being caught off your line',
    'Staying quiet',
  ],
  playSmart: [
    'Reading shooters is a skill that keeps improving with experience.',
    'Keep warm and alert when the ball is at the other end: stay on your toes.',
    'Your calls are worth a defender. Organise early, before the danger arrives.',
  ],
  sources: ['fih-2027', 'coaching-consensus'],
  reviewed: false,
};
