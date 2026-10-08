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

Dark editorial portfolio. The rules live in `docs/foundations/` (read `03-page-rules.md` before building pages,
`02-modules.md` for the module inventory, `01-styleguide.md` for tokens, type, grid and motion). The live reference is the
`/styleguide` page (`src/pages/styleguide.astro`).

- **Tokens:** `src/styles/tokens.css` (colour, type, spacing, radius, motion). Never hard-code values in pages or components.
- **Themes:** dark (default) and light. Semantic colour tokens in `tokens.css` use `light-dark(light, dark)`; the nav
  switch (an icon button in the desktop nav, a labelled "Theme" tabs control with Dark | Light options in the mobile menu) toggles `data-theme="light"` on `<html>` (stored in localStorage, absent = dark; no
  system/auto mode). Components use only semantic tokens
  (`--bg-page`, `--text-default`, `--text-strong`, `--accent-*` …), never raw palette colours or hex values. White-only SVG
  logos get `filter: var(--filter-logo)`; the confidential stamp is never filtered. There is no pure black or white, except `--bg-pure` (`.section--pure`) for the sections that hold the case study teasers: page and strong text use the tinted ends of the gray ramp (`--gray-950` #0d0d12, `--gray-50` #fafafc). The ramp `--gray-50 … --gray-950` is one cool gray scale for both themes (backgrounds, surfaces, borders, default text); its steps and contrast are listed in `tokens.css`. Light values are contrast-checked (see the comment in `tokens.css`).
- **Base:** `src/styles/base.css` has the seven type roles (`.t-display`, `.t-title`, `.t-heading`, `.t-subheading`, `.t-body`, `.t-label`, `.t-caption`;
  modifiers `.t-upper`, `.t-serif`; heading and subheading are bold (700) with no letter spacing, heading 34px at the top and subheading 24px; display, title and body weights depend on the theme (dark 600 / 700 / 300, light 700 / 800 / 400; letter spacing is tightened in light mode by the same step); label is always 300; bold inside text uses `--weight-emphasis`; main nav uses `.t-body`), layout (`.container`, `.measure-text`, `.measure-media`, `.grid-12` + `.span-*`),
  `.prose`, `.section`, media helpers and the `.reveal` scroll effect.
- **Components:** `src/components/`, one per module ID in `02-modules.md` (StorySection, Overview, Figure, ScreenStack,
  Comparison, Embed, Outcome, ProjectGrid …). Content goes in via props and slots, never style overrides.
- **Schemas:** diagrams (structures, processes, hierarchies, flows) are live SVG via `Schema` (I10) and the parts in `src/components/schema/`, in the same frame as mocks and theme aware. Rules and parts: `docs/foundations/05-schemas.md`.
- **Layouts:** `Base.astro` (head, fonts, header, footer) for every page. `CaseStudy.astro` renders hero (title + labels), overview, outcome
  and other projects from frontmatter; the MDX body holds numbered `StorySection`s only (the one case-study layout).
- **Case studies:** copy `src/content/projects/_template.mdx` to `<slug>.mdx`. The schema is in `src/content.config.ts`.
  StorySection, Figure & co. are available in MDX without imports (see `src/pages/projects/[id].astro`).
- **Gradients:** named `<intensity>-<tonality>`: intensity `soft` | `calm` | `active`, tonality `yellow` | `salmon` | `violet` | `blue` | `green`
  (15 gradients), plus moods `morning` (soft-yellow), `day` (soft-blue), `meadow` (calm-green), `dusk` (calm-violet), `sundown` (active-salmon),
  `night` (active-blue). "Add an active gradient with blue tonality" = `class="gradient gradient--active-blue"`; tokens are
  `--gradient-active-blue-top` / `-bottom`. All are theme aware; text on top uses `--text-strong`. Source of truth and recipes:
  `src/lib/gradients.ts` (CSS is injected by `Base.astro`); live reference: `/styleguide#gradients`. The home stage keeps its own
  `--gradient-hero-*` tokens; `src/lib/pen.ts` holds the random hue pool of the home effect.
- **Mocks:** screenshots in a device frame go through `Mock` (I9): desktop bar (solid or transparent, colour or mono controls), Chrome, Safari,
  iOS and Android, optionally on a gradient stage (`stage="dusk"`). Options and rules: `docs/foundations/04-mocks.md`; live reference: `/styleguide#mocks`.
  The class names `.mock` and `.mock__*` belong to `src/styles/mock.css` (global); do not reuse them in other components.
- **Grid:** fixed 12 columns (grid 1170 / 896 / 656 px with 30 px outer padding; xl ≥ 1230 has 70 px columns and 30 px gutters; full width below 768 with 20 px padding). Text 8/9/9/12/12 columns, media 10/10/10/12/12
  (xl/lg/md/sm/xs), always inside the grid padding. Live demo: `/styleguide#grid-demo`.
- **H1 titles:** `.t-title` is Geist Bold; `*word*` in a title (`PageHeader`, `CaseHero`, frontmatter `title`) becomes an Editorial New Ultrabold Italic highlight via `highlight()` in `src/lib/site.ts` (`plain()` strips it). One or two words at most.
- **Home stage:** `HomeHero` (headline in `.t-title`, name highlighted in `--accent-primary`, subline in `.t-heading`) plus `DoodleStack`: pictures from `src/assets/doodles/` pop up on their own (max 3 visible, beside the text, never over it; no new ones while the pointer is over them). Black or white single-colour pictures follow the theme (`BLACK` / `WHITE` sets in `DoodleStack.astro`); the flat salmon ones (`ACCENT`) use `--accent-primary`.
- **Heading levels vs looks:** one `h1` per page, `h2` sections, `h3` sub-headings; the look comes from the `.t-*` class.
- **Links:** wrap internal paths with `url()` from `src/lib/site.ts` (the site is served under `/claudofolio`).
- **Images:** local files in `src/assets/`, via `Figure`/`Img` (AVIF/WebP + srcset). Always write alt text; `alt=""` for decoration.
- **Mobile parity:** all text visible at every breakpoint; only media may be swapped (`Embed` poster). One exception: the teaser summary is hidden below 992 px to keep the teasers compact.
- Open TODOs: `SITE.email` in `src/lib/site.ts`, Editorial New woff2 (`public/fonts/README.md`), real Stamp/Arrow SVGs,
  `/about/` and `/imprint/` pages.
