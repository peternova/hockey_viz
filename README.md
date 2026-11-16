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
- `src/features/`: the pages (home, positions, plays, formations, pitch explorer, glossary)

### Adding a play

Copy a file in `src/content/plays/`, then:
- Change the keyframes. Positions are in metres: x runs 0→91.4 in our attacking direction, and y runs 0 (our left) → 55 (our right).
- Write the step captions.
- Register the play in `src/content/plays/index.ts`.

`npm test` checks that every play is complete, stays on the pitch, and cites a source,
and that every glossary, pitch and formation link points at something that exists.

Keep players at least ~4 m apart when they aren't tackling or receiving: the tokens
are drawn 3.6 m wide so they stay readable on a phone.
