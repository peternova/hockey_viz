import { useMemo } from 'react';
import { PlayViewer } from '../../engine/PlayViewer';
import { href } from '../../lib/router';
import { openNewBoard } from '../board/BoardHome';
import { fileNameFor, newId, toPlay } from '../board/model';
import { FOLDER_URL, TEAM_FOLDER, TEAM_PLAYS, teamFrom, type TeamPlay } from '../board/teamPlays';

export function TeamPlayPage({ team }: { team: TeamPlay }) {
  const play = useMemo(() => toPlay(team.play), [team]);
  const intro = team.play.frames[0].caption.trim();
  const steps = team.play.frames.length - 1;
  const exportName = fileNameFor([team.play]);
  const sharing = TEAM_PLAYS.filter((t) => t.file === team.file).length - 1;

  const copy = () => {
    const now = Date.now();
    // Same title, so exporting the copy gives the same file name as the original.
    const ok = openNewBoard({ ...team.play, id: newId(), from: teamFrom(team), created: now, updated: now });
    if (!ok) window.alert('This browser wouldn’t save the copy.');
  };

  return (
    <article className="page">
      <a className="back-link" href={href('plays')}>
        ← All plays
      </a>
      <header className="page__header">
        <div className="eyebrow">Team play</div>
        <h1>{play.title}</h1>
        {intro ? <p className="lede">{intro}</p> : null}
      </header>

      {steps === 0 ? (
        <p className="note">This play has no steps yet, so it just shows the starting positions.</p>
      ) : null}
      <PlayViewer play={play} firstIsStart />

      <p className="board__from-play">
        <button type="button" className="btn btn--small" onClick={copy}>
          Copy to my tactics board
        </button>{' '}
        <span className="muted small">to change it, or to use it as a starting point.</span>
      </p>

      <details className="note note--details">
        <summary>Changing this play for the whole team</summary>
        <ol>
          <li>
            Press <strong>Copy to my tactics board</strong> and make your changes. Keep the title the same.
          </li>
          <li>
            Press <strong>Export as a file</strong> at the bottom of the board. The file is called{' '}
            <code>{exportName}</code>.
          </li>
          <li>
            Open the{' '}
            <a href={FOLDER_URL} target="_blank" rel="noreferrer">
              {TEAM_FOLDER} folder on GitHub
            </a>
            , choose <strong>Add file → Upload files</strong>, add the file and press <strong>Commit changes</strong>.
            {exportName === team.file
              ? ' It replaces the old version, which has the same name.'
              : null}
          </li>
          {exportName !== team.file ? (
            <li>
              This play is in a file with a different name, <code>{team.file}</code>, so delete that one on GitHub
              (open it, then <strong>•••</strong> → <strong>Delete file</strong>) or the play will show twice.
              {sharing > 0
                ? ' That file holds other team plays as well, which would go too, so first copy each of them to your board, export it and upload it on its own.'
                : null}
            </li>
          ) : null}
        </ol>
        <p className="muted small">
          The live app updates about two minutes later. Phones get it the next time they have signal, with a “new
          version” bar.
        </p>
      </details>
    </article>
  );
}
