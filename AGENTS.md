## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Design system

Dark editorial portfolio. The rules live in `docs/foundations/` (read `04-page-rules.md` before building pages,
`03-modules.md` for the module inventory, `02-styleguide.md` for the as-is analysis). The live reference is the
`/styleguide` page (`src/pages/styleguide.astro`).

- **Tokens:** `src/styles/tokens.css` (colour, type, spacing, radius, motion). Never hard-code values in pages or components.
- **Themes:** light, dark and auto (system). Semantic colour tokens in `tokens.css` use `light-dark(light, dark)`; the nav
  switch sets `data-theme` on `<html>` (stored in localStorage, absent = auto). Components use only semantic tokens
  (`--bg-page`, `--text-default`, `--text-strong`, `--accent-*` …), never raw palette colours or hex values. White-only SVG
  logos get `filter: var(--filter-logo)`. Light values are contrast-checked (see the comment in `tokens.css`).
- **Base:** `src/styles/base.css` has the six type roles (`.t-display`, `.t-title`, `.t-heading`, `.t-subheading`, `.t-body`, `.t-label`;
  modifiers `.t-upper`, `.t-serif`), layout (`.container`, `.measure-text`, `.measure-media`, `.grid-12` + `.span-*`),
  `.prose`, `.section`, media helpers and the `.reveal` scroll effect.
- **Components:** `src/components/`, one per module ID in `03-modules.md` (Chapter, Lead, ProjectMeta, Figure, ScreenStack,
  Comparison, Embed, Outcome, ProjectGrid …). Content goes in via props and slots, never style overrides.
- **Layouts:** `Base.astro` (head, fonts, header, footer) for every page. `CaseStudy.astro` renders hero, lead, meta, outcome
  and other projects from frontmatter; the MDX body holds chapters only.
- **Case studies:** copy `src/content/projects/_template.mdx` to `<slug>.mdx`. The schema is in `src/content.config.ts`.
  Chapter, Figure & co. are available in MDX without imports (see `src/pages/projects/[id].astro`).
- **Grid:** fixed 12 columns (grid 1170 / 896 / 656 px with 30 px outer padding; xl ≥ 1230 has 70 px columns and 30 px gutters; full width below 768 with 20 px padding). Text 8/9/9/12/12 columns, media 10/10/10/12/12
  (xl/lg/md/sm/xs), always inside the grid padding. Live demo: `/styleguide#grid-demo`.
- **Heading levels vs looks:** one `h1` per page, `h2` chapters, `h3` sub-chapters; the look comes from the `.t-*` class.
- **Links:** wrap internal paths with `url()` from `src/lib/site.ts` (the site is served under `/claudofolio`).
- **Images:** local files in `src/assets/`, via `Figure`/`Img` (AVIF/WebP + srcset). Always write alt text; `alt=""` for decoration.
- **Mobile parity:** all text visible at every breakpoint; only media may be swapped (`Embed` poster).
- Open TODOs: `SITE.email` in `src/lib/site.ts`, Editorial New woff2 (`public/fonts/README.md`), real Stamp/Arrow SVGs,
  portrait images for `HomeHero`, `/about/` and `/imprint/` pages.
