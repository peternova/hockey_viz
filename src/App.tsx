import { playById } from './content/plays';
import { guideById } from './content/positions';
import { BoardEditorPage } from './features/board/BoardEditor';
import { BoardHome } from './features/board/BoardHome';
import { FormationsPage } from './features/formations/FormationsPage';
import { GlossaryPage } from './features/glossary/GlossaryPage';
import { Home } from './features/home/Home';
import { InstallPage } from './features/install/InstallPage';
import { PwaStatus } from './features/install/PwaStatus';
import { PitchExplorer } from './features/pitch/PitchExplorer';
import { PlayPage } from './features/plays/PlayPage';
import { PlaysList } from './features/plays/PlaysList';
import { PositionPage } from './features/positions/PositionPage';
import { PositionsIndex } from './features/positions/PositionsIndex';
import { ChoiceRound } from './features/quiz/ChoiceRound';
import { QuizHome } from './features/quiz/QuizHome';
import { WhereQuiz } from './features/quiz/WhereQuiz';
import { rulesRound, termsRound } from './features/quiz/questions';
import { href, useHashPath } from './lib/router';

function NotFound() {
  return (
    <section className="page">
      <h1>Not found</h1>
      <p>
        <a href={href()}>Back to the start</a>
      </p>
    </section>
  );
}

function Route({ parts }: { parts: string[] }) {
  const [section, id] = parts;
  if (!section) return <Home />;
  if (section === 'positions' && !id) return <PositionsIndex />;
  if (section === 'positions' && id) {
    const guide = guideById(id);
    return guide ? <PositionPage key={guide.id} guide={guide} /> : <NotFound />;
  }
  if (section === 'plays' && !id) return <PlaysList />;
  if (section === 'plays' && id) {
    const play = playById(id);
    return play ? <PlayPage key={play.id} play={play} /> : <NotFound />;
  }
  if (section === 'formations') return <FormationsPage />;
  if (section === 'pitch') return <PitchExplorer key={id ?? ''} initial={id} />;
  if (section === 'glossary') return <GlossaryPage focus={id} />;
  if (section === 'quiz') {
    if (!id) return <QuizHome />;
    if (id === 'where') return <WhereQuiz id={parts[2]} />;
    if (id === 'terms')
      return (
        <ChoiceRound
          key="terms"
          title="Name it"
          lede="Pick the right name for each pitch marking or hockey word."
          makeRound={(p) => termsRound(p)}
        />
      );
    if (id === 'rules')
      return (
        <ChoiceRound
          key="rules"
          title="Rules: true or false?"
          lede="Statements about the FIH Rules of Hockey 2027. True or false?"
          makeRound={(p) => rulesRound(p)}
        />
      );
  }
  if (section === 'board') return id ? <BoardEditorPage key={id} id={id} /> : <BoardHome />;
  if (section === 'install') return <InstallPage />;
  return <NotFound />;
}

const NAV = [
  { section: '', label: 'Home' },
  { section: 'positions', label: 'Positions' },
  { section: 'plays', label: 'Plays' },
  { section: 'formations', label: 'Formations' },
  { section: 'pitch', label: 'Pitch' },
  { section: 'glossary', label: 'Glossary' },
  { section: 'quiz', label: 'Quiz' },
  { section: 'board', label: 'Board' },
];

export function App() {
  const parts = useHashPath();
  const current = parts[0] ?? '';
  return (
    <>
      <header className="topbar">
        <a className="brand" href={href()}>
          <span className="brand__mark" aria-hidden="true">
            ●
          </span>{' '}
          Hockey IQ
        </a>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <a
              key={n.section}
              className={n.section === '' ? 'nav__home' : undefined}
              href={n.section ? href(n.section) : href()}
              aria-current={current === n.section ? 'page' : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
      </header>
      <main>
        <PwaStatus />
        <Route parts={parts} />
      </main>
    </>
  );
}
