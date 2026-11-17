# Hockey IQ

Learn 11-a-side field hockey visually: positions, tactics and terminology as
animations you can pause, slow down and step through. Labels use Australian/NZ
wording.

## Run it

```bash
npm install
npm run dev          # then open the printed http://localhost:5173 link
```

## Check it

```bash
npm test                  # engine + content checks
npm run validate:content  # just the content checks
npm run build             # type-check + production build into dist/
```

## Where things live

- `docs/SOURCES.md`: where the content comes from (FIH Rules 2027/2026, Hockey Australia/NZ, ...)
- `docs/content-outline.md`: everything planned (positions, plays, glossary, quiz)
- `src/engine/`: the animation engine (keyframes → smooth movement, playback, viewer)
- `src/pitch/`: the SVG pitch, drawn to FIH dimensions in metres
- `src/content/plays/`: one file per animated play (keyframes, step captions, sources); `helpers.ts` has shared shapes (the circle, 5 m rings)
- `src/content/positions/`: the position guides (defence, midfield, forwards, goalkeeper)
- `src/content/formations.ts`: the 4-3-3 shapes plus the formations comparison (4-3-3, 3-3-3-1, 2-3-5) and old names
- `src/content/pitch.ts`: Pitch Explorer markings and areas, with FIH rule references
- `src/content/glossary.ts`: the glossary (AU/NZ term first, aliases, links to plays/positions/pitch)
- `src/content/quiz.ts`: the "Where should I be?" situations and the rules true/false questions
- `src/features/`: the pages (home, positions, plays, formations, pitch explorer, glossary, quiz, tactics board)
- `src/features/board/model.ts`: the tactics board's data, edits, templates and export/import format (no React, fully tested)
- `src/lib/progress.ts`, `src/lib/boardStore.ts`: quiz progress and board plays, saved in the browser on this device only

### Adding a play

Copy a file in `src/content/plays/`, then:
- Change the keyframes. Positions are in metres: x runs 0→91.4 in our attacking direction, and y runs 0 (our left) → 55 (our right).
- Write the step captions.
- Register the play in `src/content/plays/index.ts`.

`npm test` checks that every play is complete, stays on the pitch, and cites a source,
and that every glossary, pitch and formation link points at something that exists.

### Adding a "Where should I be?" situation

Add an entry to `WHERE_QUESTIONS` in `src/content/quiz.ts`: everyone's position (yours is
where your token starts), the ball, the best area (`zone`) and the best spot (`ideal`), and
the explanation. `npm test` checks that the best spot is inside the area, that you don't
start within "close" range of it, and that nobody overlaps.

On a phone, plays and situations zoom in on the part of the pitch they use, so leave out
players who play no part (e.g. our goalkeeper during a full press at their end).

Keep players at least ~4 m apart when they aren't tackling or receiving: the tokens
are drawn 3.6 m wide so they stay readable on a phone.

## Tactics board

`#/board` lets you draw your own plays. A board play is a list of frames: frame 0 is
where everyone starts, and each later frame is where everyone is at the end of a step.
For playback it's turned into an ordinary play (`toPlay` in `src/features/board/model.ts`),
so the same viewer, controls and "follow" work. Arrows (run, dribble, pass) and step times
are worked out from how far people and the ball move, unless you set a time.

Moving someone in an earlier step also moves them in later steps where they hadn't moved
yet, so editing the start doesn't make anyone jump back later.

Plays are saved in the browser (`localStorage`) on that device only. **Export** saves a
`.json` file (`{"kind": "hockey-iq-tactics-board", "version": 1, "plays": [...]}`) and
**Import** reads one back. Importing never overwrites: a play that's already there
unchanged is skipped, and a changed one is added alongside. Anything odd in a file
(missing positions, unknown players, long text) is repaired or dropped when it's read.
