## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Publishing (staging and hallo-wl.de)

Two targets, one codebase (`astro.config.mjs` switches on `SITE_TARGET`):

- **Staging = GitHub Pages**, `https://stackenblochen.github.io/claudofolio/`. Every push to `main` deploys it (`.github/workflows/deploy.yml`). Base `/claudofolio`, `noindex, nofollow, noai` on every page. "Commit and push" means this.
- **Live = hallo-wl.de**, served from `/portfolio/` (a forwarding `index.html` in the web root sends `hallo-wl.de` there). Built into the git-ignored folder `release/`; the user uploads it by hand (FTP/SFTP). You cannot upload.

**"Release it" / "rebuild the release" = rebuild `release/`** from the current working tree:

```
cd /Users/wolfganglattermann/Documents/Astro/Claudofolio
set -a; . ./.env; set +a          # CASE_STUDY_PASSWORD; without it the protected case studies are locked for everyone
rm -rf release && npm run build:release
find release public -name .DS_Store -delete
```

Then check the output (7+ pages, no errors; `release/portfolio/projects/` lists the case studies that should be live), restart the dev server (`astro dev stop; astro dev --background`, a build disturbs its cache), and tell the user the upload steps. Mention uncommitted changes and ask whether to commit and push; do not push unasked.

What the release contains and leaves out:
- `release/index.html` (from `tools/release-index.html`) forwards to `/portfolio/`; the site is in `release/portfolio/` (base `/portfolio`, canonical `https://hallo-wl.de`).
- Left out: case studies with `draft: true` (everywhere) or `stagingOnly: true` (release only), and `/styleguide/` (deleted by the `build:release` script). No `noindex` tags (the live site is indexable).
- `public/.htaccess` (`Options -Indexes`, `ErrorDocument 404 /portfolio/404.html`) plus `public/demos/.htaccess` and `public/videos/.htaccess` (`X-Robots-Tag: noindex`) end up in `release/portfolio/`; dotfiles must be uploaded.
- Protected case studies are encrypted in the page (AES-GCM, key from `CASE_STUDY_PASSWORD` at build time); no server setup, needs HTTPS. Their images and demo files stay reachable by direct URL.

Upload steps for the user: on the server rename the old top-level `index.html` (for example to `index-old.html`, once), upload the contents of `release/` into the web root without deleting anything else, include the `.htaccess` files, then open hallo-wl.de, a protected case study and a nonexistent address under `/portfolio/` (custom 404). Alternative: the manual GitHub Action "Release build for hallo-wl.de" (`.github/workflows/release.yml`) builds the same folder as a downloadable artifact, using the repository secret `CASE_STUDY_PASSWORD`.

Dev notes: the dev password for protected pages is `dev`. After changing `src/content.config.ts` or case-study frontmatter that the dev server does not pick up, delete `.astro/data-store.json` and `node_modules/.astro` and restart it.

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
  (`--bg-primary`, `--text-default`, `--text-strong`, `--accent-*` …), never raw palette colours or hex values. White-only SVG
  logos get `filter: var(--filter-logo)`; the confidential stamp is never filtered. Backgrounds follow iOS: `--bg-primary`, `--bg-secondary` (a card on it), `--bg-tertiary` (inside a card), in two contexts, as in iOS: grouped (default for pages: gray base, white cards) and standard (`.section--pure` for the sections that hold the case study teasers: white / black base, gray cards); small controls use `--fill`. White and black appear only there. Page and strong text use the tinted ends of the gray ramp (`--gray-950` #0d0d12, `--gray-50` #fafafc). The ramp `--gray-50 … --gray-950` is one cool gray scale for both themes (backgrounds, surfaces, borders, default text); its steps and contrast are listed in `tokens.css`. Light values are contrast-checked (see the comment in `tokens.css`).
- **Page background:** pages are grouped by default; `<Base context="standard">` puts the whole page (header and footer included) on the standard context (white / black base, gray cards). The About page uses it.
- **Base:** `src/styles/base.css` has the eight type roles (`.t-display`, `.t-title`, `.t-quote`, `.t-heading`, `.t-subheading`, `.t-body`, `.t-label`, `.t-caption`;
  modifiers `.t-upper`, `.t-serif`; heading and subheading are bold (700) with no letter spacing, heading 34px at the top and subheading 24px; display, title and body weights depend on the theme (dark 600 / 700 / 300, light 700 / 800 / 400; letter spacing is tightened in light mode by the same step); label is always 300; bold inside text uses `--weight-emphasis`; main nav uses `.t-body`), layout (`.container`, `.measure-text`, `.measure-media`, `.grid-12` + `.span-*`),
  `.prose`, `.section`, media helpers and the `.reveal` scroll effect.
- **Components:** `src/components/`, one per module ID in `02-modules.md` (StorySection, Overview, Figure, MediaRow, MediaText, Diagram,
  Comparison, Embed, Outcome, ProjectGrid …). Content goes in via props and slots, never style overrides.
- **Schemas:** diagrams (structures, processes, hierarchies, flows) are live SVG via `Schema` (I10) and the parts in `src/components/schema/`, in the same frame as mocks and theme aware. Rules and parts: `docs/foundations/05-schemas.md`.
- **Layouts:** `Base.astro` (head, fonts, header, footer) for every page. `CaseStudy.astro` renders hero (title + labels), overview, outcome
  and other projects from frontmatter; the MDX body holds numbered `StorySection`s only (the one case-study layout).
- **Case studies:** copy `src/content/projects/_template.mdx` to `<slug>.mdx`. The schema is in `src/content.config.ts`.
  StorySection, Figure & co. are available in MDX without imports (see `src/pages/projects/[id].astro`).
- **Gradients:** named `<intensity>-<tonality>`: intensity `soft` | `calm` | `active`, tonality `yellow` | `salmon` | `violet` | `blue` | `green` | `gray`
  (18 gradients; `gray` is cool and barely tinted), plus moods `morning` (soft-yellow), `day` (soft-blue), `meadow` (calm-green), `dusk` (calm-violet), `sundown` (active-salmon),
  `night` (active-blue), `fog` (soft-gray), `slate` (calm-gray), `graphite` (active-gray). Shapes beyond linear (off-centre circles and ovals): add `gradient--orb`, `--bloom`, `--horizon` or `--halo` on top of a gradient class, or `stage="dusk:orb"` in a mock. "Add an active gradient with blue tonality" = `class="gradient gradient--active-blue"`; tokens are
  `--gradient-active-blue-top` / `-bottom`. All are theme aware; text on top uses `--text-strong`. Source of truth and recipes:
  `src/lib/gradients.ts` (CSS is injected by `Base.astro`); live reference: `/styleguide#gradients`. The home stage keeps its own
  `--gradient-hero-*` tokens; `src/lib/pen.ts` holds the random hue pool of the home effect.
- **Mocks:** screenshots in a device frame go through `Mock` (I9): desktop bar (solid or transparent, colour or mono controls), Chrome, Safari,
  iOS and Android, optionally on a gradient stage (`stage="dusk"`). Options and rules: `docs/foundations/04-mocks.md`; live reference: `/styleguide#mocks`.
  The class names `.mock` and `.mock__*` belong to `src/styles/mock.css` (global); do not reuse them in other components.
- **Grid:** fixed 12 columns (grid 1170 / 896 / 656 px with 30 px outer padding; xl ≥ 1230 has 70 px columns and 30 px gutters; full width below 768 with 20 px padding). Text 8/9/9/12/12 columns, media 10/10/10/12/12
  (xl/lg/md/sm/xs), always inside the grid padding. Live demo: `/styleguide#grid-demo`.
- **H1 titles:** `.t-title` is Geist Bold; `*word*` in a title (`PageHeader`, `CaseHero`, frontmatter `title`) becomes an Editorial New Ultrabold Italic highlight via `highlight()` in `src/lib/site.ts` (`plain()` strips it). One or two words at most.
- **Home stage:** `HomeHero` (headline in `.t-title`, name highlighted in `--accent-primary`, subline in `.t-heading`) plus `DoodleStack`: pictures from `src/assets/doodles/` pop up on their own (max 3 visible, beside the text, never over it). Black or white single-colour pictures follow the theme (`BLACK` / `WHITE` sets in `DoodleStack.astro`); the flat salmon ones (`ACCENT`) use `--accent-primary`.
- **Heading levels vs looks:** one `h1` per page, `h2` sections, `h3` sub-headings; the look comes from the `.t-*` class.
- **Links:** wrap internal paths with `url()` from `src/lib/site.ts` (the site is served under `/claudofolio`). Link styles live in `base.css`: text link (`.link`, and `<a>` inside `.prose`: strong text, 1 px same-colour underline; hover: 2 px salmon underline), quiet link (`.link--quiet`, footer), links that leave the page (`http…`, `mailto:`, `.pdf`) get an arrow automatically; see `01-styleguide.md` section 8.
- **Images:** local files in `src/assets/`, via `Figure`/`Img` (AVIF/WebP + srcset). Always write alt text; `alt=""` for decoration.
- **Mobile parity:** all text visible at every breakpoint; only media may be swapped (`Embed` poster). One exception: the teaser summary is hidden below 992 px to keep the teasers compact.
- Open TODOs: `SITE.email` in `src/lib/site.ts`, Editorial New woff2 (`public/fonts/README.md`), real Stamp/Arrow SVGs,
  `/about/` and `/imprint/` pages.
