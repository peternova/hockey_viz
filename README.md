# Hockey IQ

Learn 11-a-side field hockey visually: positions, tactics and terminology as
animations you can pause, slow down and step through. Labels use Australian/NZ
wording.

**Use it:** https://peternova.github.io/hockey_viz/ (open it on your phone and add it
to the home screen to use it at the pitch with no signal; the app's "Put it on your
phone" page has the steps).

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
npm run preview           # serve dist/ to try the offline app locally
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
- `team-plays/`: tactics board exports shared with everyone as **Team plays** (see below)
- `src/lib/pwa.ts`, `src/features/install/`: the offline app (install page, "new version" bar, offline notice)
- `public/`: the app icon (`favicon.svg`) and the PNG sizes made from it
- `.github/workflows/deploy.yml`: tests, builds and publishes to GitHub Pages on every push to `master`

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

### Team plays

Exported board files in `team-plays/` are built into the app (`src/features/board/teamPlays.ts`
reads them with `import.meta.glob`) and shown as **Team plays** on the Board, Plays and
home pages, at `#/plays/team/<title-slug>`. Add one by uploading an export to that
folder on GitHub; `team-plays/README.md` has the steps for non-developers.
`tests/teamPlays.test.ts` reads every file, so a broken upload fails the deploy with
the file's name instead of reaching the live site. The same play exported twice is
shown once.

## Offline app and publishing

The app is a PWA (`vite-plugin-pwa`, settings in `vite.config.ts`). On the first visit a
service worker saves every file the app needs (about 540 KB), so after that every page
works with no signal, and "Add to Home Screen" gives it an icon and a full screen.
Nothing is fetched at run time apart from links to the sources.

New versions don't take over by themselves: the service worker downloads them in the
background and the app shows a "new version is ready" bar, so nobody loses a half-drawn
play to a surprise reload. The app looks for updates every hour and whenever it comes
back to the front.

Every push to `master` runs `.github/workflows/deploy.yml`: `npm ci`, the tests, the
build, then GitHub Pages. The build uses relative paths (`base: './'`), so the same
`dist/` works at `/hockey_viz/`, under `npm run preview`, or from any folder. The
install page shows the build date and commit, to check which version a phone has.

Service workers need https (or `localhost`). Opening the dev server from a phone over
the local network works, but not offline.

To change the icon, edit `public/favicon.svg` and re-export `public/icons/icon-192.png`,
`icon-512.png` (full-bleed, artwork inside the middle 80% so it also works as a
maskable icon) and `apple-touch-icon.png` (180 px).

## License

MIT: see [LICENSE](LICENSE). That covers the code and the hockey content (positions,
plays, glossary, quiz). The rules summaries are written in our own words with links to
their sources; the FIH Rules of Hockey and the other sources in `docs/SOURCES.md` belong
to their owners.
