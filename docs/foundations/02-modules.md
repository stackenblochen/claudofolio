# 02 — Modules

Every content module has a stable ID and one Astro component in `src/components/`. Content goes in through props and slots, never through style overrides. Case-study components (Chapter, Figure & co.) are available in MDX without imports (see `src/pages/projects/[id].astro`).

Breakpoints: **xs** < 544 · **sm** 544–767 · **md** 768–991 · **lg** 992–1229 · **xl** ≥ 1230. Spans are out of 12 columns; "stack" means 100 % width, one item under another. Type, colour and spacing names refer to `01-styleguide.md`.

## Overview

| ID | Module | Component | Used on |
|---|---|---|---|
| **G — Global** | | | |
| G1 | Site header and overlay menu | `SiteHeader` (+ `ThemeSwitch`) | all |
| G3 | Footer | `SiteFooter` | all |
| G4 | Back to top, loading bar | `BackToTop`, `LoadingBar` | all |
| **H — Heroes** | | | |
| H1 | Home stage (headline, subline, doodle stack) | `HomeHero`, `DoodleStack` | Home |
| H2 | Case hero, backdrop | `CaseHero variant="backdrop"` | Case studies |
| H3 | Case hero, mockup | `CaseHero variant="mockup"` | Case studies |
| H4 | Page header (eyebrow, title, intro) | `PageHeader` | About, Styleguide |
| **T — Text** | | | |
| T1 | Intro statement | `Statement` | Home (when used) |
| T2 | Lead block | `Lead` | Case studies |
| T3 | Section title | `SectionTitle` | Home, About |
| T4 | Chapter | `Chapter` | Case studies |
| T5 | Sub-chapter | `SubChapter` | Case studies |
| T6 | Challenge / Solution | `ChallengeSolution` | Case studies |
| T7 | Outcome | `Outcome` | Case studies |
| T8 | Career entry | `CareerEntry` inside `Timeline` | About |
| **M — Meta** | | | |
| M1 | Project meta row | `ProjectMeta` | Case studies |
| **I — Media** | | | |
| I1 | Wide figure | `Figure` | Case studies |
| I2 | Figure pair | `FigurePair` | Case studies |
| I3 | Screen stack | `ScreenStack` | Case studies |
| I4 | Before → after | `Comparison` | Case studies |
| I5 | Image + text row | `ImageText` | Case studies |
| I6 | Video | `Video` | Case studies |
| I7 | Interactive embed | `Embed` | Case studies |
| I8 | Annotations | `Stamp`, `Arrow` | Case studies |
| I9 | Device mock | `Mock` | see `04-mocks.md` |
| I10 | Schema (live SVG diagram) | `Schema` + parts | see `05-schemas.md` |
| **L — Collections** | | | |
| L1 | Project teasers | `ProjectGrid`, `ProjectCard` | Home |
| L2 | Other projects | `ProjectGrid` with `exclude` | Case studies |
| L3 | Expertise label | `Label` | Teasers |
| **O — Other** | | | |
| O1 | Contact block | `ContactBlock` | About, Home |
| O2 | Portrait | `Portrait` | About |
| O3 | Password gate | `Protected` | Case studies |

Images always go through `Img` (local files in `src/assets/` → AVIF/WebP with srcset; plain URLs render a lazy `<img>`). Always write `alt`; use `alt=""` for decoration.

---

## G — Global

### G1 Site header
Wordmark logo (left), text menu (right): "About me", "Contact", then the theme switch. Menu items are `.t-body` in `--text-default`; hover and current page show `--text-strong` with a 2 px salmon underline. Sticky and transparent over the hero; height 54 (xs) / 56 (sm) / 64 px (md and up). Below 768 px the menu opens as a full-screen overlay (`--overlay-menu`) with centred items, opened by a hamburger.

### G3 Footer
One line at the text measure (8 / 9 cols, full width on phones): "© year Wolfgang Lattermann. All rights reserved. Imprint" left, the contact links (email, LinkedIn, CV) right, wrapping on mobile. Links look like the main navigation. Values come from `SITE` in `src/lib/site.ts`; empty values hide their link.

### G4 Back to top and loading bar
`BackToTop` appears after one viewport of scrolling. `LoadingBar` is a salmon bar at the top of the viewport during navigation.

---

## H — Heroes

### H1 Home stage
A section on the page background, as wide as the media measure (10 cols; stack below 768 px).

- **Headline** (`<h1 class="t-title">`, slot `intro`): Geist Bold with the name highlighted in Editorial New Ultrabold Italic and `--accent-primary`. Fixed sizes (2 / 2.5 / 3 / 3.5 rem from xs / 768 / 992 / 1230 px), set in lines with `<br class="br-md">` from 768 px.
- **Subline** (`<p class="t-heading">`, slot `subline`, weight 400): below the headline, 40 px gap, one forced break from 768 px.
- **Prism effect** on the headline while the pointer is over the stage (`src/lib/prism.ts`). The real text stays in the DOM; a transparent WebGL canvas on top paints only where there is distortion. Needs a fine hovering pointer and no reduced-motion preference.
- **Doodle stack** (`DoodleStack`, decorative, `aria-hidden`): from 768 px an absolutely positioned area on the right (46 % of the stage width), behind the text, which may overlap it. On phones it sits under the text (15 rem high).
  - A new picture lands on top at a random spot, tilt (2–14°) and size; older ones sink back (smaller and fainter, up to five levels); 3–5 are visible at once; the oldest fade out.
  - **Trigger:** pointer movement anywhere over the hero (every ~200 px, at most one per 160 ms); scroll on touch devices from 768 px (every ~120 px); a timer on phones (a new picture at a random 3–5 s). Reduced motion: a static arrangement of four.
  - **Idle:** after 2.6 s without movement the stack settles to two pictures and a new one still lands every 3–5 s, far less often than while moving.
  - Pictures come from `src/assets/doodles/` (WebP ≤ 640 px) via a shuffled bag; none repeats before all have been shown. Single-colour black or white pictures follow the theme.
  - A subtle endless float, a soft shadow, and spring-in. All tuning constants are at the top of the script.

### H2 Case hero, backdrop
Full-cover background image (dimmed), H1 bottom-aligned, stamp below. H1 on the media measure.

### H3 Case hero, mockup
H1 on the full grid width, then the cover image on the media measure (radius 12), with the stamp overlapping its bottom-right corner (stamp `confidential`). Same component as H2, selected with `variant`.

`CaseHero` props: `title` (sentence case, ≤ 8 words, `*word*` highlight markup), `variant: 'mockup' | 'backdrop'`, `image`, `imageAlt`, `background`, `confidential`. Padding above the H1 is `--hero-top`.

### H4 Page header
Eyebrow (`.t-label`), H1 (`.t-title`, text measure) and optional intro paragraphs in the default slot: `.t-subheading` at weight 400, strong colour, text-wrap `pretty`. Props: `eyebrow`, `title` (`*word*` highlight markup).

---

## T — Text modules

### T1 Statement
One or two sentences in `.t-heading` on the raised background, text measure. Props/slot: the sentence.

### T2 Lead
Eyebrow ("Background") plus 2–3 sentences in `.t-heading`, strong colour, each its own paragraph. Text measure. Prop: `sentences`.

### T3 Section title
`.t-heading` title with a dash marker ("Selected work", "Career"). Semantic level configurable.

### T4 Chapter
1. dash marker (rendered by the component), 2. heading (h2, look `.t-heading`), 3. body paragraphs (`--text-default`, `.t-body`), 4. optional media in the `media` slot (Figure, FigurePair, ScreenStack, Embed …). Text on the text measure, media on the media measure. Chapters sit in `.chapter-flow` (`--chapter-gap` between them). One heading level only.

### T5 Sub-chapter
Like T4 with a numbered `.t-subheading` title (h3), nested in a chapter ("1. Instant meetings"). Usually followed by T6 and I3.

### T6 Challenge / Solution
Two labelled blocks, each a label followed by body text: `● Challenges` (bullet in `--accent-primary`), `► Solution` (bullet in `--accent-positive`), labels in strong text. Takes the width of its parent (place it in a chapter body). Slots: `challenge`, `solution`. Maximum one per chapter; be honest about trade-offs.

### T7 Outcome
Dash, heading, numbered list (01, 02, 03) on a full-bleed `--bg-pure` section. Prop `items` (strings) or `<li>` children. Exactly three points; each starts with the result and at least one has a number or concrete artefact.

### T8 Career entry
A timeline item: bullet on a vertical line, optional logo (own height per logo, decorative), company and role (both `.t-subheading`, strong colour), dates (`.t-label`, default colour), body. Use inside `<Timeline>`, which provides the grid container.

---

## M — Meta

### M1 Project meta
Label over value, spread evenly across the text measure. Rendered only with at least three items (Role, Team, Timeline; optional Platforms, Company, Year). Stacks below 768 px. Required on every case study.

---

## I — Media

Shared rules: radius 16 (diagrams, squares, video, embeds; 12 below 768 px) or 12 (UI screenshots); hairline where the image edge would dissolve into the dark background; shadow on screenshots. All media sit inside the grid padding.

### I1 Wide figure
`Figure`: a single image with optional caption and natural height, for screenshots, diagrams and boards alike. Radius 12, hairline, shadow. `size`: `wide` = media measure (default), `text` = text measure, `full` = 12 cols. `kind="appshot"` is for transparent PNG app shots (outline instead of hairline and shadow).

### I2 Figure pair
Two square images, 5 + 5 columns from 768 px, stacked below. Radius 16.

### I3 Screen stack
One or two UI screenshots stacked, then one caption (`.t-caption`, ≤ 8 words). Radius 12, hairline, shadow.

### I4 Then → now
Two cards (`bg-card`, radius 16) with the red hand-drawn arrow (`arrow-red-down.svg`) overlapping both. No text inside the cards; the sides only get accessible names. Each side is a slot (`before`, `after`), typically `<Mock size="cover" layout="set" shadow="soft">`, which fills the whole card; set the card background with the mock's `stage` (`var(--bg-card)` for then, a gradient for now). A plain image works too (`before`, `after` props).

### I5 Image + text row
Insights, principles, any short finding with an illustration. Lives in the text measure: illustration across 3 columns, title (strong colour, not bold) and text across the rest, top aligned. Stacks below 768 px (image about 60 % wide). Repeat for 3 items.

### I6 Video
`Video`: MP4 (H.264) plus optional WebM, with a poster. Muted, `playsinline`, no autoplay unless it is a short loop (≤ 30 s, ≤ 8 MB). Radius 16, hairline.

### I7 Interactive embed
`Embed`: an iframe to a self-contained demo in `public/demos/<slug>/`, 12 cols, fixed height, radius 16, lazy, with a `title`. **The text is always visible.** **Tablet and mobile (below 992 px) always show a placeholder instead of the iframe:** the `poster` image (required) with `note` as its caption (default "Interactive demo, best viewed on desktop."). **Desktop and laptop** show the live demo, with an optional `caption` below it; that caption is hidden on tablet and mobile, where the note replaces it.

### I8 Annotations
`Stamp` (confidential, see the styleguide) and `Arrow` (the salmon hand-drawn arrow, default `arrow-red-down.svg`, decorative). Both overlap neighbouring blocks with negative margins inside the component only, reduced by half below 768 px.

### I9 Mock and I10 Schema
Device frames and live SVG diagrams. Rules and options in `04-mocks.md` and `05-schemas.md`.

---

## L — Collections

### L1 Project teasers
`ProjectGrid` renders one `ProjectCard` per row: 12 cols on mobile, 10 up to 1229 px, 9 from 1230 px. Gap `wide` on Home (60 px from 992, 30 tablet, 20 mobile). Feed it from `getProjects()` → `toCard()`.

`ProjectCard`: a full media-width panel. From 1230 px two equal columns, 380 px high: text left (title, labels, summary), cover right. 992–1229 px: 5/7 columns, 340 px, summary cut to three lines. 768–991 px: no summary, height follows the cover. Below 768 px the title and labels sit on top of the cover, 20 px padding, no summary. Sections holding teasers use `.section--pure`.

From 992 px with a fine hovering pointer (and no reduced motion) the card grows by 5 % and gets a hairline border and a shadow while hovered; the border also shows on keyboard focus. The whole panel is the link. On touch, below 992 px and with reduced motion the teaser stays plain. The former colour-split ripple on hover is switched off; its code is kept in `src/lib/teaser-fx.ts` (see the note at its top to re-enable it).

### L3 Expertise label
`Label`: a small pill with a Tabler icon and an expertise name ("Product Design", "Design Systems", "Design Vision", "Research", "Prototyping"). A project carries one to three (frontmatter `labels`), shown under the title on its teaser. Text is a step below the body size (14 px, 15 px from 992), weight 400 in `--text-strong`, on `--bg-card`, radius `--radius-pill`; the icon is an outline Tabler icon (MIT) in `--accent-primary`. Names live in `src/lib/label-names.ts`, icons in `src/lib/labels.ts` (`@tabler/icons`, file names under `outline/`, browse https://tabler.io/icons). To add an expertise: add the name to the first file and its icon to the second; the content schema picks it up.

### L2 Other projects
The same grid with gap `tight` (30 px from 992, 20 tablet, 12 mobile) under a dash and heading "Other projects". Pass `{ exclude: current.id, limit: 2 }`; the current project never appears.

---

## O — Other

### O1 Contact block
Dash, heading, short invitation (slot), then email / LinkedIn / CV rows. Values come from `SITE`; empty values are hidden.

### O2 Portrait
Square photo at half the text measure (4 of 8 columns on wide desktops), radius 16.

### O3 Password gate
`Protected` wraps a case study. With `enabled`, the slot is rendered at build time and encrypted (AES-GCM, key from PBKDF2); the page ships only the ciphertext and a form, and the browser decrypts after the right password (remembered for the tab). The password comes from `CASE_STUDY_PASSWORD` at build time (`src/lib/lock.ts`). Image and demo files remain reachable by URL; only page content is encrypted.

---

## Responsive behaviour summary

| Rule | Behaviour |
|---|---|
| Column stacking | Every multi-column row stacks below 768 px |
| Reading width | 8 cols at xl, 9 at lg/md, 12 below |
| Media width | 10 cols from 768 px, 12 below |
| Wide-figure radius | 16 → 12 px below 768 px |
| Section padding | Fluid (`--section-y`, `--chapter-gap`, `--hero-top`) |
| Decorative overlaps | Kept, reduced by half below 768 px |
| Interactive embeds | Below 992 px replaced by poster + note; the text stays |
| Home stage | Doodle stack moves under the text below 768 px |
| Mobile parity | All text is visible at every breakpoint; only media may be swapped |
