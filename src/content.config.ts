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
      // optional: show the teaser thumb as a Mock (device frames on a stage) instead of the plain cover, see components/Mock.astro
      thumb: z
        .object({
          stage: z.string(), // gradient name from src/lib/gradients.ts
          theme: z.enum(['light', 'dark']).default('light'), // chrome theme, matches the screenshots
          layout: z.enum(['set', 'row']).optional(),
          phone: z.enum(['left', 'right']).optional(),
          devices: z
            .array(
              z.object({
                device: z.enum(['desktop', 'browser', 'ios', 'android']),
                src: image(),
                alt: z.string(),
                bar: z.boolean().default(true), // false when the screenshot already has its own title bar
                cutout: z.enum(['none']).optional(), // ios: screenshot already contains the island
              }),
            )
            .min(1),
        })
        .optional(),
      heroVariant: z.enum(['mockup', 'backdrop']).default('mockup'),
      heroBackground: image().optional(), // for 'backdrop'
      confidential: z.boolean().default(false), // shows the stamp
      protected: z.boolean().default(false), // password gate, see components/Protected.astro
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
