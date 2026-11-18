import { BoardFileError, readBoardFile, sameContent, slug, type BoardPlay } from './model';

/**
 * Team plays: tactics board exports kept in the repo's `team-plays/` folder.
 * They're read when the app is built, so they're part of the app on every
 * device (and work offline). Tests check every file, so a broken one stops
 * the deploy instead of reaching the live site.
 */

export const REPO_URL = 'https://github.com/peternova/hockey_viz';
export const TEAM_FOLDER = 'team-plays';
/** GitHub's "upload files" page, opened straight into the team-plays folder. */
export const UPLOAD_URL = `${REPO_URL}/upload/master/${TEAM_FOLDER}`;
export const FOLDER_URL = `${REPO_URL}/tree/master/${TEAM_FOLDER}`;

export type TeamPlay = {
  /** Used in the address: #/plays/team/<slug>. Made from the title. */
  slug: string;
  /** The file it came from, e.g. "hockey-iq-left-side-press.json". */
  file: string;
  play: BoardPlay;
};

export type TeamProblem = { file: string; message: string };

/** Read every team-plays file. `files` maps a path to the file's text. */
export function readTeamFiles(files: Record<string, string>): { plays: TeamPlay[]; problems: TeamProblem[] } {
  const found: { file: string; play: BoardPlay }[] = [];
  const problems: TeamProblem[] = [];

  for (const [path, text] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
    const file = path.split('/').pop() ?? path;
    try {
      const { plays, skipped } = readBoardFile(text);
      if (skipped) {
        problems.push({ file, message: `${skipped} of the plays in it couldn’t be read.` });
      }
      for (const play of plays) {
        // The same play exported twice (on its own and in an "all my plays" file) is shown once.
        if (found.some((f) => f.play.id === play.id && sameContent(f.play, play))) continue;
        found.push({ file, play });
      }
    } catch (e) {
      problems.push({ file, message: e instanceof BoardFileError ? e.message : String(e) });
    }
  }

  found.sort((a, b) => a.play.title.localeCompare(b.play.title) || a.file.localeCompare(b.file));
  const used = new Set<string>();
  const plays = found.map(({ file, play }) => {
    const base = slug(play.title) || 'play';
    let s = base;
    for (let n = 2; used.has(s); n++) s = `${base}-${n}`;
    used.add(s);
    return { slug: s, file, play };
  });
  return { plays, problems };
}

const FILES = import.meta.glob('../../../team-plays/*.json', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const TEAM = readTeamFiles(FILES);

export const TEAM_PLAYS: TeamPlay[] = TEAM.plays;
/** Files that couldn't be read. The tests fail if there are any. */
export const TEAM_PROBLEMS: TeamProblem[] = TEAM.problems;

export function teamPlayBySlug(s: string): TeamPlay | undefined {
  return TEAM_PLAYS.find((t) => t.slug === s);
}

/** `from` value for a board play copied from a team play. */
export const teamFrom = (t: TeamPlay) => `team:${t.slug}`;

export function teamPlayFrom(from: string | undefined): TeamPlay | undefined {
  return from?.startsWith('team:') ? teamPlayBySlug(from.slice(5)) : undefined;
}
