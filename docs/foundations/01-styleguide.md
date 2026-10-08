# 01 — Styleguide

The rules for colour, type, layout, spacing, shape and motion. The values live in code and are never repeated in pages or components:

| What | Where |
|---|---|
| Tokens (colour, type, spacing, grid, radius, shadow, motion) | `src/styles/tokens.css` |
| Type roles, layout classes, sections, media helpers, reveal | `src/styles/base.css` |
| Gradients | `src/lib/gradients.ts` (CSS injected by `Base.astro`) |
| Mocks | `src/styles/mock.css` (see `04-mocks.md`) |
| Live reference | `/styleguide` (`src/pages/styleguide.astro`) |

**Rule zero:** pages and components use only semantic tokens and the classes from `base.css`. No hex values, no raw palette steps, no one-off sizes. A new visual need means a new token or module, not an override.

Root font size is 16 px; all tokens are `rem` or `px` at that base.

---

## 1. Themes

Dark is the default. The nav switch (`ThemeSwitch`) is an icon button in the desktop nav and, in the mobile menu, a label "Theme" above a segmented Dark | Light control (like shadcn Tabs; toggle buttons with `aria-pressed` in a labelled group); both set `data-theme="light"` on `<html>`; only `light` is stored in `localStorage`, and there is no system/auto mode.

- Semantic colour tokens use `light-dark(light, dark)`; `color-scheme` follows the theme.
- Components use only semantic tokens (`--bg-page`, `--text-default`, `--text-strong`, `--accent-*` …), never palette steps (`--gray-*`) or hex.
- White-only SVG logos get `filter: var(--filter-logo)` (inverted in light mode). The confidential stamp is never filtered.
- Single-colour pictures that must follow the theme (black or white doodles) are inverted in the matching theme; see `DoodleStack`.
- Weights and letter spacing differ by theme (see 4.2): light mode needs more weight on a light page, and Geist gets wider as it gets bolder, so light mode is tightened by the same step.

## 2. Breakpoints

Write CSS **mobile-first** with `min-width`.

| Token | Range | Layout |
|---|---|---|
| `xs` | < 544 px | Everything stacks, full width, 20 px outer padding |
| `sm` | 544–767 px | Same as `xs` (header grows from 54 to 56 px) |
| `md` | 768–991 px | Fixed 656 px grid, text 9 cols, media 10 cols, header 64 px |
| `lg` | 992–1229 px | Fixed 896 px grid, text 9, media 10 |
| `xl` | ≥ 1230 px | Fixed 1170 px grid, text 8, media 10, gutter 30 px |

## 3. Layout grid

Fixed 12 columns. The grid (content area) has a fixed width per breakpoint; the outer padding sits around it. Below 768 px the grid is full width.

| Breakpoint | Grid | Columns × gutter | Outer (grid + padding) | Padding |
|---|---|---|---|---|
| xl ≥ 1230 | 1170 px | 12 × 70 + 11 × 30 | 1230 px | 30 px |
| lg ≥ 992 | 896 px | 12 × 60 + 11 × 16 | 956 px | 30 px |
| md ≥ 768 | 656 px | 12 × 40 + 11 × 16 | 716 px | 30 px |
| < 768 | 100 % | single column | 100 % | 20 px |

Layout classes (in `base.css`):

| Class | Use |
|---|---|
| `.container` | Outer width and side padding. Every section content sits in one |
| `.measure-text` | Reading width: **8 cols (xl) → 9 (lg, md) → 12 (below 768)** |
| `.measure-media` | Media width: **10 cols (md and up) → 12 (below 768)** |
| `.measure-wide` | Full grid width (12 cols). Embeds and some heroes |
| `.grid-12` + `.span-2 … .span-8` | Rows with several items from 768 px; stacks below |

Both measures resolve to whole-column widths and sit inside the container padding. Never set body copy wider than the text measure. All rows are centred; only the footer text is left-aligned.

| Usage | Columns |
|---|---|
| Reading column (text, story sections, overview) | text measure |
| Wide image, diagram, screenshot stack, mock | media measure (10) |
| Embed, full-bleed mock | 12 |
| Image pair | 5 + 5 |
| Image + text row | 3 + rest of the text measure |
| Project teaser | media measure up to 1229 px, 9 cols from 1230 px |

## 4. Colour

### 4.1 Palette

One cool (blue-violet) gray ramp, used by both themes, plus three signal colours. Palette steps are for `tokens.css` only; components use the semantic roles in 4.2.

| Step | Hex | Role |
|---|---|---|
| `gray-950` | `#0d0d12` | Dark page, strong text in light mode |
| `gray-900` | `#18181e` | Dark raised |
| `gray-800` | `#26272c` | Dark surface (a panel on a raised stage) |
| `gray-700` | `#34373d` | Dark card, dark borders |
| `gray-600` | `#4d505a` | |
| `gray-500` | `#6a6b7c` | Light-mode default text |
| `gray-400` | `#9a9aab` | Dark-mode default text |
| `gray-300` | `#c6c7d2` | Light lines on a surface |
| `gray-200` | `#e0e1e8` | Light surface, card, borders |
| `gray-100` | `#eeeef3` | Light raised |
| `gray-50` | `#fafafc` | Light page, strong text in dark mode |

There is no pure black or white, except `--bg-pure` (`.section--pure`), used only for the sections that hold the case study teasers. Signal colours: salmon `#fa8072` (`#e8553d` in light mode), green `#00ff32` (`#008a21` in light mode). Selection is salmon with black text in both themes.

### 4.2 Semantic roles

| Role | Light | Dark | Use |
|---|---|---|---|
| `--bg-page` | gray-50 | gray-950 | Default page background |
| `--bg-pure` | white | black | Teaser sections only |
| `--bg-raised` | gray-100 | gray-900 | Raised sections, mock and schema stages |
| `--bg-surface` | gray-200 | gray-800 | A panel on a raised stage |
| `--bg-card` | gray-200 | gray-700 | Cards |
| `--text-default` | gray-500 | gray-400 | Body, nav, captions, meta labels |
| `--text-strong` | gray-950 | gray-50 | Headings, leads, emphasis, links |
| `--border-subtle` | gray-200 | gray-700 | Hairlines around screenshots and cards |
| `--border-strong` | gray-300 | gray-700 | Lines on a surface (schema pills) |
| `--accent-primary` | salmon-600 | salmon | Brand accent: link underlines, focus ring, nav underline, timeline dot, arrows, errors, negative marks, highlighted words |
| `--accent-positive` | green-700 | green | Positive marks (the "Solution" bullet) |
| `--accent-link` | = `--accent-primary` | | |
| `--bg-glass` | white 82 % | black 78 % | Mostly opaque fill for the nav pills, with a blur behind, so the text stays readable over light or dark screenshots |
| `--overlay-menu` | gray-100 | gray-900 | Mobile menu background (solid, not transparent) |
| `--overlay-thumb` | black 35 % | black 50 % | Reserved for thumbnail overlays |

**Contrast.** Default text (400) on dark is 7.0:1 on the page, 6.4:1 on raised, 5.4:1 on surface and 4.4:1 on card. Default text (500) on light is 5.0:1 on the page, 4.5:1 on raised and 4.0:1 on surface. So: do not set default text on `--bg-card` below 18 px, and keep strong text for anything on a card. Salmon on the light page is 3.5:1 (graphic or large text only); light-mode green is 4.5:1.

### 4.3 Gradients

Named `<intensity>-<tonality>`: intensity `soft` | `calm` | `active`, tonality `yellow` | `salmon` | `violet` | `blue` | `green` (15 gradients), plus moods `morning` (soft-yellow), `day` (soft-blue), `meadow` (calm-green), `dusk` (calm-violet), `sundown` (active-salmon), `night` (active-blue). Use `class="gradient gradient--active-blue"`; tokens are `--gradient-active-blue-top` / `-bottom`. All are theme aware; text on top uses `--text-strong`. Source and recipes: `src/lib/gradients.ts`. The home stage keeps its own `--gradient-hero-*` tokens; `src/lib/pen.ts` holds the random hue pool of the home effect.

## 5. Typography

### 5.1 Families

| Role | Family | Notes |
|---|---|---|
| Everything | **Geist** (variable woff2, weights 300–800) | `--font-sans` |
| Highlighted words in titles | **Editorial New Ultrabold** and **Ultrabold Italic** (woff2, weight 800) | `--font-serif`. Licensed font: declared in `Base.astro` only when the file exists in `public/fonts/` |
| Mono labels (schemas) | system mono stack | `--font-mono` |

### 5.2 Roles

Seven roles, applied with a class. The semantic level (`h1`, `h2` …) and the look are decoupled: one `h1` per page, `h2` for sections, `h3` for sub-headings, and the look comes from the class.

| Class | Size (mobile → desktop) | Line height | Weight (dark / light) | Letter spacing (dark / light) | Role |
|---|---|---|---|---|---|
| `.t-display` | 50 → 120 px | 56 → 108 px | 600 / 700 | 0 / −0.011em | Reserved display style |
| `.t-title` | 36 → 80 px | 46 → 100 px | 700 / 800 | −0.0025em / −0.0135em | H1: page titles, case titles, the home stage headline |
| `.t-heading` | 26 → 34 px | 32 → 44 px | 700 | 0 | Section titles, the home subline, company names |
| `.t-subheading` | 18 → 24 px | 26 → 32 px | 700 | 0 | Sub-headings, card titles, roles, intro paragraphs (About, Overview) |
| `.t-body` | 16 → 19 px | 25.6 → 28.5 px | 300 / 400 | 0 / −0.007em | Paragraphs, lists, meta values, main navigation |
| `.t-label` | 15 → 18 px | 24 → 26 px | 300 | 0 | Eyebrows, meta labels, dates, footer |
| `.t-caption` | = label | = label | 300, italic | | Image captions, `--text-default` |

All sizes are fluid (`clamp()`), so every step shrinks monotonically as the viewport narrows. Modifiers: `.t-upper` (uppercase, +0.06em) and `.t-serif` (Editorial face inside a line). Text colour: headings and strong text use `--text-strong`; body, nav and captions use `--text-default`. Bold inside text uses `--weight-emphasis` (600 dark / 700 light) and `--text-strong`.

### 5.3 Title with highlighted words

H1 titles are Geist Bold; selected words switch to Editorial New Ultrabold Italic. In `PageHeader` and `CaseHero` the title text takes `*word*` markup (`highlight()` in `src/lib/site.ts`), which renders `<em>`; `.t-title em` sets the Editorial face and the salmon `--accent-primary`. Titles in frontmatter may contain the markup; `plain()` strips it for `<title>`, labels and props that expect plain text. On the home stage the name is a plain `<em>`, styled the same way.

- Highlight one word, two at most. Never a whole line.
- Editorial only ships weight 800, so highlights are always that weight.
- Dark and light weights/spacing of the surrounding Geist follow 5.2.

### 5.4 Running text

`.prose` sets paragraph rhythm for text inside modules: `1.5em` between blocks, lists indented `1.4em` with `--space-2` between items, `strong` in the strong colour, links with a 2 px salmon underline (`text-underline-offset: 4px`). Numbered lists use `decimal-leading-zero` (01, 02, 03).

## 6. Spacing

| Token | px | Typical use |
|---|---|---|
| `--space-1` | 4 | Icon gaps |
| `--space-2` | 8 | List-item gap, label → value |
| `--space-3` | 12 | Heading → body inside a module |
| `--space-4` | 20 | Between modules in a section, grid row gap |
| `--space-5` | 30 | Gutter-sized gaps |
| `--space-6` | 40 | Between headline and subline on the stage |
| `--space-7` | 60 | |
| `--space-8` | 80 | |
| `--space-9` | 120 | |
| `--space-10` | 160 | |

Fluid section tokens: `--section-y` (48 → 96 px), `--chapter-gap` (80 → 160 px, between sections and from the last section to the Outcome; its own value, not tied to `--section-y`), `--hero-top` (60 → 160 px above the H1). Sections use `.section` (vertical padding `--section-y`); chapters sit in `.chapter-flow`. Spacing between modules comes from the parent layout, not from margins on each module.

Section backgrounds: `.section--raised`, `.section--black` (page background), `.section--pure` (teaser sections).

## 7. Shape and elevation

| Token | Value | Use |
|---|---|---|
| `--radius-m` | 12 px | UI screenshots, mock windows, hero mockup (`.media-m`) |
| `--radius-l` | 16 px | Diagrams, image pairs, video, cards, embeds, stages (`.media-l`; 12 px below 768 px) |
| `--radius-xl` | 24 px | Large panels |
| `--radius-pill` | 999 px | Labels (expertise pills) |
| `--border-hairline` | 1 px `--border-subtle` | Screenshots, cards, video (`.media-hairline`) |
| `--shadow-screenshot` | 0 0 40 px, black 14 % light / 50 % dark | Screenshots and mocks (`.media-shadow`) |
| `--shadow-elevated` | 0 24 px 48 px −12 px, black 22 % light / 70 % dark | A card lifted on hover (project teaser) |
| `--filter-appshot` | 1 px outline + 2 × soft drop shadow | Transparent PNG app shots (`.app-shot`) |

Doodles in the home stack use their own light drop shadow (`--doodle-shadow` in `DoodleStack`). Do not add other radii.

## 8. Links and interaction

| Element | Default | Hover / active |
|---|---|---|
| Body and prose link | `--text-strong`, 2 px salmon underline, offset 4 px | |
| Nav item (desktop) | Pill with a blurred translucent background (`--bg-glass`, `backdrop-filter: blur(16px)`), `--text-strong` | `--bg-card` fill; the current page looks the same |
| Footer link | `--text-default`, no underline | `--text-strong` with a 2 px salmon underline |
| Project teaser | the whole panel is the link | grows 5 %, hairline border and a lifted shadow (`--shadow-elevated`) (pointer devices from 992 px, not with reduced motion) |
| Focus | 2 px `--accent-primary` outline, 4 px offset (`:focus-visible`) on every interactive element | |
| Selection | salmon background, black text | |

No information is available on hover only.

## 9. Chrome

| Element | Spec |
|---|---|
| Header (`SiteHeader`) | Wordmark left, text menu right ("About me", "Contact"), main nav in `.t-body`. Height 54 / 56 / 64 px. Overlay menu below 768 px, with the `--overlay-menu` background |
| Theme switch | Icon button in the desktop nav; "Theme" label above Dark / Light tabs in the mobile menu; see 1 |
| Footer (`SiteFooter`) | One line at the text measure: copyright and imprint left, contact links (email, LinkedIn, CV) right; wraps on mobile |
| Loading bar | Salmon bar at the top of the viewport during navigation |
| Back to top | Appears after one viewport of scrolling |
| Page transition | Fade out, then fade in (`Base.astro`) |

## 10. Motion

| Effect | Spec |
|---|---|
| Section reveal | `.reveal`: scale 0.98 + 12 px rise + opacity, 700 ms `--ease-out`, on scroll-in (JS adds `.js` to `<html>`) |
| Home headline | Prism effect while the pointer is over the stage: sheared slices and red/green/blue fringes (`src/lib/prism.ts`). Pointer devices only |
| Home doodle stack | Pictures pop up on their own every 2.5–4.5 s (max 3 visible, never over the headline); spawning pauses while the pointer is over them |
| Teaser hover | See 8 (the former colour-split ripple is switched off, code kept in `src/lib/teaser-fx.ts`) |
| Page and loading | Fade, loading bar |

Everything respects `prefers-reduced-motion`: no reveal, no prism, no teaser hover zoom, a static doodle arrangement; `--duration-reveal` becomes 0.

## 11. Graphic devices

- **Section number "— 01":** on its own line above every section heading (and the Outcome heading, "— 06"), Geist (`.t-number`: the body weight, 300 in dark and 400 in light mode; 24 px, 32 px from 992 px) in the accent colour, rendered by the component from the `number` prop (never typed into content). Other headings (Home, About) keep a plain em-dash marker.
- **Confidential stamp** (`Stamp`): always as delivered (white disc, black artwork), light and dark. Overlaps the hero image's bottom-right corner; decorative parts get `aria-hidden`, the stamp itself an accessible name.
- **Hand-drawn arrow** (`Arrow`): salmon, connects before/after or points to an embed. Decorative.
- **Challenge / Solution marks:** ● in `--accent-primary`, ► in `--accent-positive`, label in strong text.
- **Numbered outcome list:** `decimal-leading-zero`.
- **Doodles:** the pictures in `src/assets/doodles/` (WebP, max 640 px). Black ones follow the theme to white in dark mode, white ones to black in light mode; add new single-colour pictures to the `BLACK` or `WHITE` set in `DoodleStack.astro`. The flat salmon marks are in the `ACCENT` set and are drawn in `--accent-primary`, so they follow the styleguide salmon.
