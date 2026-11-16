import { playById } from './content/plays';
import { Home } from './features/home/Home';
import { PlayPage } from './features/plays/PlayPage';
import { PlaysList } from './features/plays/PlaysList';
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
  if (section === 'plays' && !id) return <PlaysList />;
  if (section === 'plays' && id) {
    const play = playById(id);
    return play ? <PlayPage key={play.id} play={play} /> : <NotFound />;
  }
  return <NotFound />;
}

export function App() {
  const parts = useHashPath();
  const section = parts[0] ?? '';
  return (
    <>
      <header className="topbar">
        <a className="brand" href={href()}>
          <span className="brand__mark" aria-hidden="true">
            ●
          </span>{' '}
          Hockey IQ
        </a>
        <nav className="nav">
          <a href={href()} aria-current={section === '' ? 'page' : undefined}>
            Home
          </a>
          <a href={href('plays')} aria-current={section === 'plays' ? 'page' : undefined}>
            Plays
          </a>
        </nav>
      </header>
      <main>
        <Route parts={parts} />
      </main>
    </>
  );
}
