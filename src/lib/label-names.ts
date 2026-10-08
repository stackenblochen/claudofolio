/** Expertise labels a case study can carry (frontmatter `labels`). To add one: add the name here and its Tabler icon in labels.ts. */
export const LABEL_NAMES = ['Product Design', 'Design Systems', 'Design Vision', 'Research', 'Prototyping'] as const;
export type LabelName = (typeof LABEL_NAMES)[number];
