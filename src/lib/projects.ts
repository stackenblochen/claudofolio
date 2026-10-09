import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { url } from './site';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Plain shape used by ProjectCard / ProjectGrid, so the styleguide can feed them without the collection. */
export interface CardData {
  title: string;
  labels: string[];
  summary?: string;
  /** Missing for "coming soon" cards, which are not clickable. */
  href?: string;
  comingSoon?: boolean;
  cover: ImageMetadata;
  coverAlt: string;
  thumb?: ProjectEntry['data']['thumb'];
}

/** All published projects by `order`, optionally without the current one. Unlisted ones (iterations) only with `includeUnlisted` (page routes). */
export async function getProjects(opts: { exclude?: string; limit?: number; includeUnlisted?: boolean } = {}): Promise<ProjectEntry[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft && (opts.includeUnlisted || !data.unlisted));
  return all
    .filter((p) => p.id !== opts.exclude)
    .sort((a, b) => a.data.order - b.data.order)
    .slice(0, opts.limit);
}

/**
 * A draft is shown as "coming soon" (teaser with a tag, not clickable, no page) once it has a title, a description and a label
 * (the thumb mock or cover shows, the template placeholder if none is set). Any other draft stays hidden.
 */
export function isComingSoon(p: ProjectEntry): boolean {
  const d = p.data;
  return d.draft && !d.unlisted && !!d.shortTitle.trim() && !!d.summary.trim() && d.labels.length > 0;
}

/** Teasers for Home: published projects plus "coming soon" drafts, together by `order`. */
export async function getTeasers(): Promise<CardData[]> {
  const all = await getCollection('projects', (p) => isComingSoon(p) || (!p.data.draft && !p.data.unlisted));
  return all.sort((a, b) => a.data.order - b.data.order).map((p) => ({ ...toCard(p), ...(p.data.draft && { href: undefined, comingSoon: true }) }));
}

export function toCard(p: ProjectEntry): CardData {
  return {
    title: p.data.shortTitle,
    labels: p.data.labels,
    summary: p.data.summary,
    href: url(`/projects/${p.id}/`),
    cover: p.data.cover,
    coverAlt: p.data.coverAlt,
    thumb: p.data.thumb,
  };
}
