import { useState } from 'react';
import { PLAYS } from '../../content/plays';
import { href } from '../../lib/router';
import { importBoards, putBoard, useBoardList } from '../../lib/boardStore';
import { downloadText } from '../../lib/download';
import {
  BoardFileError,
  MAX_FILE_BYTES,
  TEMPLATES,
  boardFile,
  fileNameFor,
  fromLibraryPlay,
  fromTemplate,
  readBoardFile,
  type BoardPlay,
} from './model';

type Message = { tone: 'ok' | 'bad'; text: string } | null;

const SAVE_FAILED =
  'This browser wouldn’t save the play (storage may be full, blocked or in a private window).';

/** Save a new play and open it in the editor. */
export function openNewBoard(play: BoardPlay): boolean {
  if (!putBoard(play)) return false;
  window.location.hash = href('board', play.id);
  return true;
}

function changed(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) {
    return `today ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function BoardHome() {
  const { plays, refresh } = useBoardList();
  const [libId, setLibId] = useState(PLAYS[0]?.id ?? '');
  const [msg, setMsg] = useState<Message>(null);

  const create = (p: BoardPlay) => {
    if (!openNewBoard(p)) setMsg({ tone: 'bad', text: SAVE_FAILED });
  };

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // so the same file can be picked again
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setMsg({ tone: 'bad', text: 'That file is too big to be a tactics board export.' });
      return;
    }
    try {
      const { plays: incoming, skipped } = readBoardFile(await file.text());
      const r = importBoards(incoming);
      refresh();
      if (!r.ok) {
        setMsg({ tone: 'bad', text: SAVE_FAILED });
        return;
      }
      const parts = [
        r.added ? `Added ${r.added} play${r.added === 1 ? '' : 's'}.` : '',
        r.same ? `${r.same} ${r.same === 1 ? 'was' : 'were'} already here.` : '',
        skipped ? `${skipped} couldn’t be read.` : '',
      ];
      setMsg({ tone: 'ok', text: parts.filter(Boolean).join(' ') });
    } catch (err) {
      setMsg({ tone: 'bad', text: err instanceof BoardFileError ? err.message : 'That file couldn’t be read.' });
    }
  };

  return (
    <article className="page">
      <header className="page__header">
        <h1>Tactics board</h1>
        <p className="lede">
          Draw your own plays step by step, then watch them move like the plays in the library. Everything is saved on
          this device.
        </p>
      </header>

      <h2>My plays</h2>
      {plays.length ? (
        <ul className="card-grid">
          {plays.map((p) => (
            <li key={p.id}>
              <a className="card" href={href('board', p.id)}>
                <span className="card__title">{p.title}</span>
                <span className="card__text">
                  {p.frames.length - 1} step{p.frames.length === 2 ? '' : 's'} · {p.players.length} players · changed{' '}
                  {changed(p.updated)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No plays yet. Start one below.</p>
      )}

      <h2>Start a new play</h2>
      <ul className="card-grid">
        {TEMPLATES.map((t) => (
          <li key={t.id}>
            <button type="button" className="card card--button" onClick={() => create(fromTemplate(t.id))}>
              <span className="card__title">{t.name}</span>
              <span className="card__text">{t.text}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="board__copy">
        <label className="field">
          <span>Or start from a play in the library and change it to suit your team</span>
          <select value={libId} onChange={(e) => setLibId(e.target.value)}>
            {PLAYS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const p = PLAYS.find((x) => x.id === libId);
            if (p) create(fromLibraryPlay(p));
          }}
        >
          Copy this play
        </button>
      </div>

      <h2>Move plays to another device</h2>
      <p className="board__help">
        Plays are kept in this browser only. To get them onto your phone, or to share one with your team, export a file,
        send it to yourself (by email, say), then import it on the other device.
      </p>
      <div className="board__row">
        <button
          type="button"
          className="btn"
          disabled={!plays.length}
          onClick={() => downloadText(fileNameFor(plays), boardFile(plays))}
        >
          Export all my plays
        </button>
        <label className="btn btn--file">
          Import a file
          <input type="file" accept=".json,application/json" className="visually-hidden" onChange={onImport} />
        </label>
      </div>
      {msg ? (
        <p className={`board__msg board__msg--${msg.tone}`} role={msg.tone === 'bad' ? 'alert' : 'status'}>
          {msg.text}
        </p>
      ) : null}
    </article>
  );
}
