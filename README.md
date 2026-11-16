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
- `src/content/plays/`: one file per animated play (keyframes, step captions, sources)

### Adding a play

Copy a file in `src/content/plays/`, then:
- Change the keyframes. Positions are in metres: x runs 0→91.4 in our attacking direction, and y runs 0 (our left) → 55 (our right).
- Write the step captions.
- Register the play in `src/content/plays/index.ts`.

`npm test` checks that every play is complete, stays on the pitch, and cites a source.
