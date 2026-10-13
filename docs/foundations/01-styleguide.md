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
- Components use only semantic tokens (`--bg-primary`, `--text-default`, `--text-strong`, `--accent-*` …), never palette steps (`--gray-*`) or hex.
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
| `gray-300` | `#c6c7d2` | Spare |
| `gray-200` | `#e0e1e8` | Light surface, card, borders |
| `gray-100` | `#eeeef3` | Light mobile menu |
| `gray-75` | `#f5f5f7` | Light page; light card on a white base |
| `gray-50` | `#fafafc` | Strong text in dark mode |

White and black appear only as the base of the standard context (the teaser sections) and as the light card colour of the grouped context. Signal colours: salmon `#fa8072` (`#d03a24` in light mode), green `#00ff32` (`#007a1d` in light mode). Selection is salmon with black text in both themes.

### 4.2 Semantic roles

**Backgrounds follow iOS.** Two contexts, each with primary, secondary and tertiary variants that convey a hierarchy: the base, a card on it, and something inside that card. The grouped context is the default for pages (a gray base with white cards). The standard context (`.section--pure`, the sections that hold the teasers) is a white / black base with gray cards. Components only use the three level tokens (`--bg-primary` …); the context decides the colour, so the same component looks right in both.

| Role | Grouped (default) | Standard (`.section--pure`) | Use |
|---|---|---|---|
| `--bg-primary` light / dark | gray-75 / gray-950 | white / black | The base: page or section background |
| `--bg-secondary` light / dark | white / gray-900 | gray-75 / gray-900 | A card on the base: teaser cards, raised sections, stages, charts |
| `--bg-tertiary` light / dark | gray-75 / gray-800 | white / gray-800 | Inside a card: schema groups and pills |

Other roles (the same in every context):

| Role | Light | Dark | Use |
|---|---|---|---|
| `--fill` | gray-200 | gray-700 | Small controls: hover pills, labels, theme switch, comparison cards |
| `--text-default` | gray-500 | gray-400 | Body, nav, captions, meta labels |
| `--text-strong` | gray-950 | gray-50 | Headings, leads, emphasis, links |
| `--border` | gray-200 | gray-700 | Every border and line, always 1 px: screenshots, media, cards, chart and schema lines |
| `--border-dark-mode` / `--border-light-mode` | transparent / gray-200 | gray-700 / transparent | A border in one mode only. Media either has a border (`.media-border`), has none, or has one only in the mode where it would otherwise bleed into the page (`.media-border--dark-mode` for a dark image, `--light-mode` for a light one) |
| `--accent-primary` | salmon-600 | salmon | Brand accent: link underlines, focus ring, nav underline, timeline dot, arrows, errors, negative marks, highlighted words |
| `--accent-positive` | green-700 | green | Positive marks (the "Solution" bullet) |
| `--accent-link` | = `--accent-primary` | | |
| `--bg-glass` | white 82 % | black 78 % | Mostly opaque fill for the nav pills, with a blur behind, so the text stays readable over light or dark screenshots |
| `--overlay-menu` | gray-100 | gray-900 | Mobile menu background (solid, not transparent) |
| `--overlay-thumb` | black 35 % | black 50 % | Reserved for thumbnail overlays |

**Contrast.** Default text (400) on dark is 7.0:1 on primary, 6.4:1 on secondary, 5.4:1 on tertiary and 4.4:1 on fill. Default text (500) on light is 4.8:1 on the page (primary), about 5.3:1 on a white card and 4.0:1 on fill. So: do not set default text on `--fill` below 18 px, and keep strong text for anything on a fill. Light-mode salmon (`#d03a24`) is 4.5:1 on the light page and light-mode green (`#007a1d`) is 5.1:1, so both pass for small text.

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

Eight roles, applied with a class. The semantic level (`h1`, `h2` …) and the look are decoupled: one `h1` per page, `h2` for sections, `h3` for sub-headings, and the look comes from the class.

| Class | Size (mobile → desktop) | Line height | Weight (dark / light) | Letter spacing (dark / light) | Role |
|---|---|---|---|---|---|
| `.t-display` | 50 → 120 px | 56 → 108 px | 600 / 700 | 0 / −0.011em | Reserved display style |
| `.t-title` | 36 → 80 px | 46 → 100 px | 700 / 800 | −0.0025em / −0.0135em | H1: page titles, case titles, the home stage headline |
| `.t-quote` | 30 → 56 px | 38 → 68 px | 700 / 800 | −0.0025em / −0.0135em | The design vision statement (`Quote`); highlights in Editorial New |
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
| `--shadow-screenshot` | 0 0 40 px, black 14 % light / 50 % dark | Screenshots and mocks (`.media-shadow`) |
| `--shadow-elevated` | 0 24 px 48 px −12 px, black 22 % light / 70 % dark | A card lifted on hover (project teaser) |
| `--filter-appshot` | One soft drop shadow (the 1 px outline is baked into the image) | Cutout covers and transparent PNG app shots (`.app-shot`) |

Doodles in the home stack use their own light drop shadow (`--doodle-shadow` in `DoodleStack`). Do not add other radii.

## 8. Links and interaction

| Element | Default | Hover / active |
|---|---|---|
| Body and prose link | `--text-strong`, 2 px salmon underline, offset 4 px | |
| Nav item (desktop) | Pill with a blurred translucent background (`--bg-glass`, `backdrop-filter: blur(16px)`), `--text-strong` | `--fill`; the current page looks the same |
| Footer link | `--text-default`, no underline | `--text-strong` with a 2 px salmon underline |
| Project teaser | the whole panel is the link | grows 5 %, border and a lifted shadow (`--shadow-elevated`) (pointer devices from 992 px, not with reduced motion) |
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
| Home doodle stack | Pictures pop up on their own every 2.5–4.5 s (max 3 visible, never over the headline); spawning pauses while the pointer is over them |
| Teaser hover | See 8 (the former colour-split ripple is switched off, code kept in `src/lib/teaser-fx.ts`) |
| Page and loading | Fade, loading bar |

Everything respects `prefers-reduced-motion`: no reveal, no teaser hover zoom, a static doodle arrangement; `--duration-reveal` becomes 0.

## 11. Graphic devices

- **Section number "— 01":** on its own line above every section heading (and the Outcome heading, "— 06"), Geist (`.t-number`: the body weight, 300 in dark and 400 in light mode; 24 px, 32 px from 992 px) in the accent colour, rendered by the component from the `number` prop (never typed into content). Other headings (Home, About) keep a plain em-dash marker.
- **Confidential stamp** (`Stamp`): always as delivered (white disc, black artwork), light and dark. Overlaps the hero image's bottom-right corner; decorative parts get `aria-hidden`, the stamp itself an accessible name.
- **Hand-drawn arrow** (`Arrow`): salmon, connects before/after or points to an embed. Decorative.
- **Challenge / Solution marks:** ● in `--accent-primary`, ► in `--accent-positive`, label in strong text.
- **Numbered outcome list:** `decimal-leading-zero`.
- **Doodles:** the pictures in `src/assets/doodles/` (WebP, max 640 px). Black ones follow the theme to white in dark mode, white ones to black in light mode; add new single-colour pictures to the `BLACK` or `WHITE` set in `DoodleStack.astro`. The flat salmon marks are in the `ACCENT` set and are drawn in `--accent-primary`, so they follow the styleguide salmon.
