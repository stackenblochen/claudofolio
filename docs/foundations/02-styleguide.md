# 02 — Styleguide (as-is, with flagged issues)

This documents the styles of the current site exactly as they are. Semplice uses **1 rem = 18 px**, so every value below is given in **px**. That keeps the numbers unambiguous for the new Astro build, which should use the browser default of 16 px root and px or rem@16 tokens.

Machine-readable versions: `tokens/tokens.css` (CSS custom properties) and `tokens/tokens.json` (W3C design-token format).

Legend: ⚠ = inconsistency or issue to resolve in the new site, → = suggested consolidation.

---

## 1. Breakpoints

| Token | Range | Semplice name | Notes |
|---|---|---|---|
| `xs` | 0 – 543 px | Mobile | Columns stack |
| `sm` | 544 – 767 px | Tablet portrait | Columns stack |
| `md` | 768 – 991 px | Tablet wide | Columns side by side |
| `lg` | 992 – 1169 px | Desktop | |
| `xl` | ≥ 1170 px | Desktop wide | Reference design |

→ For Astro, keep the same 5 steps but write CSS **mobile-first** (`min-width: 544 / 768 / 992 / 1170`).

## 2. Layout grid

| Property | Value |
|---|---|
| Container max-width | **1230 px** (content width 1200 px) |
| Columns | 12 |
| Gutter | **30 px** (15 px each side) at ≥ 1170; **16 px** (8 px each side) below 1170 |
| Side margin (mobile) | 15–16 px (comes from the gutter) |
| Column mode sm/xs | single (all columns stack at 100 %) |

Common column spans (xl → lg/md):

| Usage | xl | lg | md | sm/xs |
|---|---|---|---|---|
| Reading column (text) | 8 | 9 | 9 | 12 |
| Media / wide image | 10 | 10 | 12 | 12 |
| Full bleed in container (grid, embed) | 12 | 12 | 12 | 12 |
| Hero title | 10–12 | 9–11 | 9–12 | 12 |
| Hero image | 9 | 10 | 11 | 12 |
| Image pair | 5 + 5 | 5 + 5 | 5 + 5 | 12 / 12 |
| Insight row | 4 img + 4 text | 4 + 5 | 4 + 5 | 12 / 12 |
| Meta row | 3 + 3 + 2 | 3 + 3 + 3 | 3 + 3 + 3 | 12 each |
| Stamp / annotation | 1–3 | 3 | 3–4 | 12 (shrunk with padding) |

All rows are **centred** (`justify: center`). Only the footer is left-aligned.

## 3. Colour

### 3.1 Palette (raw values found)

| Token (proposed) | Hex | Used for |
|---|---|---|
| `color.black` | `#000000` | Page bg (case studies, about), grid section, outcome, footer |
| `color.grey-950` | `#191919` | Home page bg, home cover, case A hero bg |
| `color.grey-800` | `#34373d` | Card surface, image border, outline drop-shadow, back-to-top |
| `color.grey-500` | `#8e8e8e` | Muted text: captions, footer, thumb category, `.challenges` border |
| `color.grey-blue-400` | `#9a9aab` | **Default body text**, nav links, hamburger |
| `color.white` | `#ffffff` | Headings & emphasis (via inline spans), links, logo |
| `color.red` | `#ff4b53` | Page-load progress bar, "● Challenges" bullet |
| `color.green` | `#00ff32` | "► Solution" bullet |
| `color.salmon` | `#fa8072` | `.link` underline colour |
| `color.yellow` | `#ffff00` | Text selection background (black text) |
| one-offs ⚠ | `#6b6b7b`, `#999999`, `#aaaaaa`, `#bbbbbb`, `#dddddd` | Single captions, Semplice defaults |
| overlay | `rgba(52,55,61,.97)` | Mobile overlay menu |
| overlay | `rgba(0,0,0,.5)` | Thumbnail hover, screenshot shadow |

### 3.2 Semantic roles (derived)

| Role | Value |
|---|---|
| `bg.page` | #000000 (⚠ home uses #191919 → pick one; recommendation: #000 page, #191919 as "raised" sections) |
| `bg.raised` | #191919 |
| `bg.card` | #34373d |
| `text.default` | #9a9aab |
| `text.strong` | #ffffff (headings, lead, labels) |
| `text.muted` | #8e8e8e (captions, meta, footer) |
| `border.subtle` | #34373d |
| `accent.negative` | #ff4b53 |
| `accent.positive` | #00ff32 |
| `accent.link` | #fa8072 (underline) |
| `selection` | #ffff00 bg / #000 text |

Contrast: `text.default` on black is 7.6:1 and `text.muted` is 6.4:1, which is fine. ⚠ Avoid muted and caption text on `bg.card` (3.6:1), and drop #6b6b7b (4.0:1 on black).

## 4. Typography

### 4.1 Font families

| Role | Family | File | Status |
|---|---|---|---|
| Display / H1 | **Editorial New Ultrabold** (Pangram Pangram) | `EditorialNew-Ultrabold.otf` | used |
| Display alt | Editorial New Regular / Ultralight | .otf | loaded, ⚠ unused |
| Headings H2–H5, labels | **Geist Bold** | `Geist-Bold.ttf` | used |
| H6 / eyebrow / nav | **Geist Regular** | `Geist-Regular.ttf` | used |
| Body, lists, captions | **Geist Light** | `Geist-Light.ttf` | used |
| — | Inter 200–800, IBM Plex Mono 300–500 (Google) | | ⚠ loaded, unused |

→ In the new site, use **Geist as a variable font** (woff2, weights 300/400/700; Geist is OFL-licensed) and a woff2 subset of Editorial New Ultrabold. Check your Editorial New licence covers web use.

All weights are separate *families* with `font-weight: normal` (a Semplice quirk). → Use one family with real weights.

### 4.2 Type scale (px, font-size / line-height, letter-spacing)

| Style | Font | xl ≥1170 | lg 992–1169 | md 768–991 | sm 544–767 | xs < 544 |
|---|---|---|---|---|---|---|
| **Display** (home hero) | Geist Bold + Editorial for the name | 120 / ~108* | 100 / 90 | 90 / 90 | 74 / 78 | 50 / 56 |
| **H1** page title | Editorial New UB, ls −0.2 | 80 / 100 | 64 / 74 | 56 / 68 | 46 / 56 | 36 / 46, ls 0 |
| **H2** lead / section title | Geist Bold | 40 / 54 | 42 / 48 ⚠ | 38 / 44 | 34 / 42 | 26 / 32 |
| **H3** chapter title | Geist Bold | 34 / 48 | 38 / 44 ⚠ | 34 / 38 | 30 / 36 | 22 / 32 |
| **H4** chapter (case B), about intro | Geist Bold | 30 / 46 | 36 / 42 ⚠ | 30 / 36 | 26 / 34 | 20 / 28 |
| **H5** sub-chapter | Geist Bold, ls 0.2 | 24 / 32 | 24 / 32 | 24 / 32 | 22 / 32 | 18 / 26 |
| **H6** eyebrow / label / date | Geist Regular, ls 0.4 | 18 / 26 | 18 / 26 | 18 / 26 | 16 / 26 | 15 / 24 |
| **Body** p | Geist Light | 19 / 28.5 | 18 / 28 | 18 / 28 | 16 / 28 | 16 / 28 |
| **List** li | Geist Light | 19 / 28.5 | 19 ⚠ | 19 ⚠ | 19 ⚠ | 19 ⚠ |
| **Caption** | Geist Light, #8e8e8e | 20 / 32 | 18 / 28 | 18 / 28 | 18 / 28 | 16 / 24 |
| **Meta value** | Geist Light, #fff | 20 | 18 | 18 | 18 | 18 |
| **Nav item** | Geist Regular, UPPERCASE | 15 | 15 | 15 | 15 | 15 |
| **Card title** | ⚠ renders Open Sans | 20 (home) / 22 (cases) | | | | |
| **Card category** | #8e8e8e | 14 (home) / 18 (cases) ⚠ | | | | |
| Footer | H6 #8e8e8e | 18 | | | 16 | 15 |

\* xl line-height isn't set explicitly and inherits from the inline value. Use about 0.9 × size.

Paragraph spacing: `margin-bottom: 1.5em` on `p` inside text blocks. Headings H2/H3 carry `margin-bottom: 30px`. List items have `margin: 8px 0`.

⚠ Issues
- H2–H4 are **bigger on lg than on xl**. → Make every step monotonic (it should shrink as the viewport narrows).
- `li` doesn't scale. → Tie it to Body.
- Card title and category sizes differ between home and case pages, and the font falls back to Open Sans.
- Nine undefined `font_*` classes are in use (see analysis 3.1).
- H4 is used as a chapter heading in case B and as an intro paragraph on About. → Separate semantic level from visual style.

→ **Proposed consolidated scale** (fluid with `clamp()`, mobile → desktop):

| Token | Mobile | Desktop | Role |
|---|---|---|---|
| `display` | 50/56 | 120/108 | Home hero only |
| `title` | 36/46 | 80/100 | H1 page titles (Editorial) |
| `heading-xl` | 26/32 | 40/54 | Lead statement, section titles |
| `heading-l` | 22/32 | 34/48 | Chapter titles |
| `heading-m` | 18/26 | 24/32 | Sub-chapters, card titles |
| `label` | 15/24 | 18/26 | Eyebrows, meta labels, dates |
| `body-l` | 18/28 | 20/32 | Meta values, intro paragraphs, captions? (decide) |
| `body` | 16/28 | 19/28.5 | Paragraphs, lists |
| `small` | 14/20 | 15/22 | Nav, footer, card meta |

## 5. Spacing

Values used across section, column and module paddings (px):

`0 · 6 · 8 · 10 · 12 · 20 · 24 · 30 · 40 · 60 · 80 · 100 · 120 · 140 · 160`

Base rhythm: **20 px** (Semplice's 1.111 rem). → Proposed scale:

| Token | px | Typical use |
|---|---|---|
| `space-1` | 4 | icon gaps |
| `space-2` | 8 | list-item gap, label → value |
| `space-3` | 12 | heading → body inside a module |
| `space-4` | 20 | between modules, image padding inside cards |
| `space-5` | 30 | grid gutter, H2/H3 margin-bottom |
| `space-6` | 40 | between chapters (mobile), card inner padding |
| `space-7` | 60 | chapter spacing (tablet) |
| `space-8` | 80 | chapter spacing (desktop), section padding |
| `space-9` | 120 | large section breaks |
| `space-10` | 160 | hero top padding (desktop) |

Observed section rhythm (xl → xs):

| Section type | Padding top / bottom |
|---|---|
| Hero (case) | 140–160 / 0 → xs 60 / 40 |
| Intro / background | 0–40 / 80 → xs 20 / 40 |
| Chapter | 80 / 20 → md 60 / 20 → sm 40 / 20 → xs 0–40 / 20–40 |
| Image section | 20–40 / 20–80 → xs 20 / 20 |
| Outcome / Other projects | 40 / 40–80 → xs 20 / 20 |
| Home intro | 40 / 120 |
| Home grid | 80 / 80 |
| Footer text | 24 / 24, margin-top 64 |

## 6. Shape, borders, elevation

| Token | Value | Use |
|---|---|---|
| `radius-m` | **12 px** (0.66 rem) | Screenshots, hero mockup |
| `radius-l` | **16 px** (0.89 rem) | Diagrams, image pairs, video, cards, embeds |
| one-offs ⚠ | 17 px, 24 px | Single columns → drop |
| `border-subtle` | 1 px solid #34373d | Screenshots, cards, video |
| `border-accent-left` | 1 px solid #8e8e8e | `.challenges` (defined, unused) |
| `shadow-screenshot` | `0 0 40px 0 rgba(0,0,0,.5)` | Screenshot stacks |
| `shadow-appshot` | `drop-shadow(0 4px 40px #0003)` ×2 | Transparent PNG app shots (`.app-shot`) |
| `outline-appshot` | `drop-shadow(±1px ±1px 0 #34373d)` | 1 px outline around transparent PNGs |

## 7. Links & interaction

| Element | Default | Hover / active |
|---|---|---|
| Body link | #fff | #fff (no visible change ⚠) |
| `.link` utility | underline, offset 4 px, salmon | — |
| Nav item | #9a9aab, uppercase 15 px, 2 px transparent underline | #fff + 2 px white underline |
| Card thumbnail | — | rgba(0,0,0,.5) overlay |
| Selection | yellow bg, black text | |

→ Add a visible hover state and a `:focus-visible` ring (for example 2 px white outline, 4 px offset).

## 8. Navigation & chrome

| Element | Spec |
|---|---|
| Header | Sticky, transparent over hero; height 64 (xl–md) / 56 (sm) / 54 (xs) |
| Logo | White SVG "wolfgang" wordmark, 140 px wide (100 px sm/xs) |
| Menu | Right-aligned: "About me", "Contact" (mailto). Hamburger on mobile (24 × 14, 2 px lines, #9a9aab) |
| Overlay menu | rgba(52,55,61,.97), centred white items |
| Progress bar | #ff4b53 |
| Back to top | arrow, fill #34373d |
| Footer | "© 2026 Wolfgang Lattermann. All rights reserved. Imprint", 8 cols, left |

## 9. Motion

| Effect | Spec |
|---|---|
| Section reveal | scale + opacity, 0.7 s ease-out on scroll-in |
| Home cover | mouse-tilt (perspective 2000 px, scale 1.1) + radial spotlight mask (r 350 px, 100 px soft edge) revealing a coloured portrait |
| Page transition | Semplice AJAX transition, bg #000/#191919 |

→ Respect `prefers-reduced-motion` (disable tilt, spotlight and reveal).

## 10. Graphic devices

- **Em-dash marker** "—": its own line above every chapter heading, same style and size as the heading, white.
- **Confidential stamp**: `confidential-black-outline.svg` (706 × 526), placed at the bottom-right of the hero image, overlapping it by about 40–100 px (z-index above), and smaller on mobile.
- **Red hand-drawn arrows**: `arrow-red-2.svg`, `arrow-red-right.svg` (153 × 267), connecting before/after or pointing to embeds.
- **Challenge / Solution bullets**: ● red #ff4b53, ► green #00ff32, label in white.
- **Numbered lists**: `list-style: decimal-leading-zero` (01, 02, 03).
