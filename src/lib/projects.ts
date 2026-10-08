import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { url } from './site';

export type ProjectEntry = CollectionEntry<'projects'>;

/** Plain shape used by ProjectCard / ProjectGrid, so the styleguide can feed them without the collection. */
export interface CardData {
  title: string;
  labels: string[];
  summary?: string;
  href: string;
  cover: ImageMetadata;
  coverAlt: string;
  thumb?: ProjectEntry['data']['thumb'];
}

/** All published projects by `order`, optionally without the current one. */
export async function getProjects(opts: { exclude?: string; limit?: number } = {}): Promise<ProjectEntry[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all
    .filter((p) => p.id !== opts.exclude)
    .sort((a, b) => a.data.order - b.data.order)
    .slice(0, opts.limit);
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
