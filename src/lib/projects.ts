import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { url } from './site';
import wireLogo from '../assets/wire-logo-white.svg';
import starthubLogo from '../assets/starthub-logo-white.svg';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Plain shape used by ProjectCard / ProjectGrid, so the styleguide can feed them without the collection. */
/** White company logos for the teaser cards, by the `company` of a case study, with the height (px) that makes each look equally big. A company without an entry shows no logo. */
const COMPANY_LOGOS: Record<string, { src: ImageMetadata; height: number }> = {
  Wire: { src: wireLogo, height: 20 },
  'EDEKA StartHub': { src: starthubLogo, height: 14 },
};

export interface CardData {
  title: string;
  labels: string[];
  summary?: string;
  href: string;
  cover: ImageMetadata;
  coverAlt: string;
  /** Full-bleed cover (fills the image area) instead of a cut-out with transparent parts. */
  coverFill?: boolean;
  /** Which mode shows the thumb's thin outline (the mode where the cover would bleed into the card). Default 'dark'. */
  coverOutline?: 'dark' | 'light' | 'none';
  thumb?: ProjectEntry['data']['thumb'];
  /** The company's logo, small and quiet in the card (from `COMPANY_LOGOS`). */
  logo?: { src: ImageMetadata; height: number };
}

/** `hidden` projects are never built; `local` ones only exist in the dev server; `staging` ones are left out of the production release (SITE_TARGET=production). */
const inRelease = (p: ProjectEntry) =>
  p.data.status === 'live' ||
  (p.data.status === 'local' && import.meta.env.DEV) ||
  (p.data.status === 'staging' && process.env.SITE_TARGET !== 'production');

/** All projects of this build by `order`, optionally without the current one. */
export async function getProjects(opts: { exclude?: string; limit?: number } = {}): Promise<ProjectEntry[]> {
  const all = await getCollection('projects', inRelease);
  return all
    .filter((p) => p.id !== opts.exclude)
    .sort((a, b) => a.data.order - b.data.order)
    .slice(0, opts.limit);
}

/** Teasers for Home: all published, listed projects by `order`. */
export async function getTeasers(): Promise<CardData[]> {
  return (await getProjects()).map(toCard);
}

export function toCard(p: ProjectEntry): CardData {
  return {
    title: p.data.shortTitle,
    labels: p.data.labels,
    summary: p.data.summary,
    href: url(`/projects/${p.id}/`),
    cover: p.data.teaserImage ?? p.data.cover,
    coverAlt: p.data.teaserAlt ?? p.data.coverAlt,
    coverFill: p.data.teaserImage ? p.data.teaserFill : p.data.coverFill,
    coverOutline: p.data.coverOutline,
    thumb: p.data.thumb,
    logo: COMPANY_LOGOS[p.data.company],
  };
}
