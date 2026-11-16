/** Mirrors docs/SOURCES.md. Content items refer to these IDs. */
export interface Source {
  id: string;
  title: string;
  url?: string;
  tier: 'rules' | 'coaching' | 'footage' | 'masters' | 'consensus';
}

export const SOURCES: Source[] = [
  {
    id: 'fih-2027',
    title: 'FIH Rules of Hockey 2027 (international from 1 Nov 2026)',
    url: 'https://www.fih.hockey/static-assets/pdf/02_2026-11-10_fih_rules_of_hockey_2027_clean.pdf',
    tier: 'rules',
  },
  {
    id: 'fih-2026',
    title: 'FIH Rules of Hockey 2026',
    url: 'https://www.fih.hockey/static-assets/pdf/fih-Rules-of-hockey-2026-final.pdf',
    tier: 'rules',
  },
  {
    id: 'ha-coaching',
    title: 'Hockey Australia — Hockey Ed coaching',
    url: 'https://www.hockey.org.au/hockey-ed/coaching',
    tier: 'coaching',
  },
  {
    id: 'hnz-hub',
    title: 'Hockey NZ Coaching Resource Hub',
    url: 'https://hockeynz.co.nz/resources',
    tier: 'coaching',
  },
  { id: 'fih-academy', title: 'FIH Academy coaching courses', url: 'https://www.fih.hockey', tier: 'coaching' },
  {
    id: 'other-na',
    title: 'England Hockey / USA Field Hockey / KNHB coaching material',
    tier: 'coaching',
  },
  { id: 'footage', title: 'Elite match footage (Pro League, Olympics, Hockey One)', tier: 'footage' },
  {
    id: 'masters',
    title: 'Hockey Australia Masters / World Masters Hockey',
    url: 'https://hockey.org.au/news/hockey-australia-masters-announces-strategic-plan-2026-2028',
    tier: 'masters',
  },
  {
    id: 'coaching-consensus',
    title: 'Widely taught team-play principles (drafted by Claude — needs review)',
    tier: 'consensus',
  },
];

export const SOURCE_IDS = new Set(SOURCES.map((s) => s.id));

export function sourceById(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}
