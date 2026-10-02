import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * One MDX file per case study in src/content/projects/.
 * Files starting with "_" are ignored (see _template.mdx).
 * The CaseStudy layout renders hero, lead, meta, outcome and other projects
 * from this frontmatter; the MDX body holds only the chapters.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(70), // H1, sentence case
      shortTitle: z.string().max(40), // card + <title>
      summary: z.string().max(160), // card text + meta description
      category: z.enum(['Product Design', 'Design Systems', 'Design Vision', 'Research', 'Prototyping']),
      tags: z.array(z.string()).max(4).default([]),
      cover: image(), // 16:10 card + hero mockup
      coverAlt: z.string(),
      heroVariant: z.enum(['mockup', 'backdrop']).default('mockup'),
      heroBackground: image().optional(), // for 'backdrop'
      confidential: z.boolean().default(false), // shows the stamp
      company: z.string(),
      role: z.string(),
      team: z.string(),
      timeline: z.string(),
      year: z.number(),
      platforms: z.array(z.string()).optional(), // e.g. ['iOS', 'Android', 'Web']
      lead: z.array(z.string()).min(1).max(3), // 2–3 sentences, rendered in the Lead block
      outcome: z.array(z.string()).length(3), // exactly 3 points
      order: z.number(), // grid position
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
