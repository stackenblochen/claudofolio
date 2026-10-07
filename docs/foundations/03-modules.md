# 03 — Content module inventory

Every module that appears on the four pages, with its anatomy, grid spans and behaviour per breakpoint. Each module gets a stable ID and a proposed **Astro component name**, so the inventory can turn directly into a component library.

Breakpoints: **xs** < 544 · **sm** 544–767 · **md** 768–991 · **lg** 992–1169 · **xl** ≥ 1170. Spans are out of 12 columns. "Stack" means 100 % width, one item under another. Type and colour names refer to `02-styleguide.md`.

## Overview

| ID | Module | Astro component | Used on |
|---|---|---|---|
| **G — Global** | | | |
| G1 | Site header / nav | `SiteHeader` | all |
| G2 | Mobile overlay menu | (part of `SiteHeader`) | all |
| G3 | Footer | `SiteFooter` | all |
| G4 | Back-to-top + progress bar | `BackToTop` | all |
| **H — Heroes** | | | |
| H1 | Home cover (portrait + display headline) | `HomeHero` | Home |
| H2 | Case hero, background image | `CaseHero variant="backdrop"` | Case A |
| H3 | Case hero, cover mockup | `CaseHero variant="mockup"` | Case B |
| H4 | Page header (eyebrow + title + intro) | `PageHeader` | About |
| **T — Text** | | | |
| T1 | Intro statement | `Statement` | Home |
| T2 | Lead block (eyebrow + lead sentences) | `Lead` | Case A, B |
| T3 | Section title | `SectionTitle` | Home, About |
| T4 | Chapter (dash + heading + body) | `Chapter` | Case A, B |
| T5 | Sub-chapter (dash + numbered H5 + body) | `SubChapter` | Case B |
| T6 | Challenge / Solution | `ChallengeSolution` | Case B |
| T7 | Numbered outcome list | `Outcome` | Case A, B |
| T8 | Career entry | `CareerEntry` | About |
| **M — Meta** | | | |
| M1 | Project meta row (Role / Team / Timeline) | `ProjectMeta` | Case B |
| **I — Media** | | | |
| I1 | Wide image / diagram | `Figure size="wide"` | Case A, B |
| I2 | Image pair | `FigurePair` | Case A |
| I3 | Screenshot stack + caption | `ScreenStack` | Case B |
| I4 | Before → after comparison with arrow | `Comparison` | Case A |
| I5 | Insight row (illustration + text) | `InsightRow` | Case B |
| I6 | Video | `Video` | Case A |
| I7 | Interactive embed + fallback | `Embed` | Case A, B |
| I8 | Annotation overlays (stamp, arrow) | `Stamp`, `Arrow` | Case A, B |
| I9 | Device mock (desktop, browser, phone on a stage) | `Mock` | see `05-mocks.md` |
| **L — Lists / collections** | | | |
| L1 | Project grid | `ProjectGrid` | Home |
| L2 | Other projects | `ProjectGrid exclude={current}` | Case A, B |
| **U — Utility** | | | |
| U1 | Spacer | (use spacing tokens instead) | Case A |

---

## G — Global

### G1 Site header
- **Anatomy:** white wordmark logo (left), text menu (right): "About me", "Contact" (mailto). Uppercase, 15 px, `text-default`. Hover/active: white with a 2 px underline.
- **Behaviour:** sticky, transparent over the hero, height 64 px.

| xs | sm | md | lg | xl |
|---|---|---|---|---|
| H 54, logo 100 w, hamburger | H 56, logo 100 w, hamburger | H 64, logo 140, menu | same | same |

- **Issues:** no "Work" link, and no CV/LinkedIn link.

### G2 Overlay menu (mobile)
Full-screen `rgba(52,55,61,.97)`, centred white items, opened by the hamburger (24 × 14, 2 px bars).

### G3 Footer
- One line of H6 in `text-default`: "© {year} Wolfgang Lattermann. All rights reserved. Imprint". 8 cols, left-aligned, on black, 24 px vertical padding, 64 px margin above.
- Stacks to 12 cols on sm/xs.
- → Add contact links (email, LinkedIn, CV) here.

### G4 Back-to-top / progress
Semplice defaults: a red #ff4b53 load bar and an arrow button. Optional in the new site.

---

## H — Heroes

### H1 Home cover
- **Anatomy:** full-viewport section (`bg-raised`), with a large 3D portrait image (contain, centred) as background. A **spotlight mask** follows the cursor (r 350 px) and reveals a coloured copy of the portrait, with a slight **mouse-tilt**. The headline is the *Display* style in white, left-aligned, 10 cols, vertically centred. It mixes Geist Bold with Editorial New for the name, and a chevron "scroll down" sits at the bottom.

| xs | sm | md | lg | xl |
|---|---|---|---|---|
| 12 cols, 50/56 | 12 cols, 74/78 | 10 cols, 90/90 | 10 cols, 100/90 | 10 cols, 120/~108 |

- **Responsive notes:** the spotlight only makes sense with a pointer. On touch devices, show the coloured version statically or animate it once.
- **Issues:** "Hi,I'm" is missing a space.

### H2 Case hero, backdrop (Case A)
- **Anatomy:** section with `bg-raised` plus a full-cover background image (dimmed to 50 %), bottom-aligned content. Row 1: H1 title (10 cols; lg/md 9). Row 2: Confidential stamp (3 cols), overlapping into the next section.
- **Padding:** xl 140 / 0 · md, sm 100 / 60 · xs 80 / 40.

### H3 Case hero, mockup (Case B)
- **Anatomy:** transparent section with a soft shadow background graphic. Row 1: H1 (12 cols; lg 11), 60 px below. Row 2: cover mockup image (9 cols; lg 10, md 11), radius 12. Row 3: stamp (3 cols; md 4) with negative top margin, so it overlaps the mockup's bottom-right corner.
- **Padding:** xl 160 / 0 · lg 120 · md 60 / 60 · sm 80 / 60 · xs 60 / 40.

| | xs | sm | md | lg | xl |
|---|---|---|---|---|---|
| Mockup | 12 | 12 | 11 | 10 | 9 |
| Stamp | 12, padded to ~40 % width | 12, padded to ~40 % | 4 | 3 | 3 |

→ **Merge H2 and H3** into one `CaseHero` with props `title`, `image`, `variant: backdrop | mockup`, `confidential: boolean`.

### H4 Page header (About)
- **Anatomy:** eyebrow H6 ("About Me"), then H1 *Title* (Editorial, 8 cols), then 1–2 intro paragraphs in H4 style (white, 8 cols).
- **Padding:** 20 / 60; eyebrow 40 px top; H1 40 px top.
- Stacks to 12 cols on sm/xs.

---

## T — Text modules

### T1 Statement (Home)
- 8 cols centred, on `bg-raised`, 1–2 sentences in H3 style (Geist Regular, white).
- **Padding:** 40 / 120. Stacks to 12 on sm/xs.

### T2 Lead block
- **Anatomy:** eyebrow H6 "Background" (`text-default`), then 2–3 sentences in **H2 style, white**, each its own paragraph (30 px apart).
- **Grid:** 8 cols (lg/md 9), centred; 80 px column top padding (xl), 60 (md), 40 (xs).
- In Case B, the same section continues with **M1 Project meta**.

### T3 Section title
- H2 white, 8 cols, for example "Selected Work" or "Career". 80 px above.

### T4 Chapter
- **Anatomy:**
  1. em-dash "—" (own line, heading style, white)
  2. Chapter heading (H3 in case A, H4 in case B ⚠, white)
  3. 1–3 body paragraphs (`text-default`, Body), with 40 px right padding at xl
  4. optional media modules below (I1–I7)
- **Grid:** text 8 cols (md 9), media 10 cols (md 12).
- **Spacing:** section top 80 (xl) / 60 (md) / 40 (sm) / 0–40 (xs). Heading → body: 12–20 px.
- → Standardise on **one heading level** (H2 semantically, *heading* visually).

### T5 Sub-chapter
- Same as T4 but with a numbered **H5** title ("1. Instant meetings"), nested under a chapter ("Design solution").
- Followed by T6 and by I3.

### T6 Challenge / Solution
- **Anatomy:** two labelled blocks, each a label paragraph followed by a body paragraph.
  - `● Challenges`: bullet in `accent-primary` (salmon), label in white.
  - `► Solution`: bullet in `accent-positive` (#00ff32), label in white.
- 8 cols (md 9); stacks on sm/xs. 20 px between label and body.
- An unused `.challenges` class (1 px left border #8e8e8e) exists in the CSS, a possible alternative visual.

### T7 Outcome
- **Anatomy:** dash + H3 "Outcome", then a numbered list (`decimal-leading-zero`: 01, 02, 03) of 3 items. List items are white in case A, partly white in case B.
- **Background:** black in case A, transparent in case B ⚠. Padding 40 / 40 (xl), 60 (lg), 20 (xs).
- ⚠ List items stay 19 px on mobile.

### T8 Career entry (About)
- **Anatomy:** dash, then Company (H3, white) and Role (H3, white, line break) ⚠ with no hierarchy, then dates (H6, white, 8 px below), then 1–2 body paragraphs (40 px below; 20 px on sm/xs).
- 8 cols; stacks on sm/xs. Section padding 20 / 60 (last entry 20 / 120).
- → Company *heading*, role *subheading* in `text-default`, dates *label* in `text-default`.

---

## M — Meta

### M1 Project meta row
- **Anatomy:** 3 cells, each an H6 label ("My Role", "Team", "Timeline") over a value (Body, white, 20 px).
- **Grid:** 3 + 3 + 2 (xl) / 3 + 3 + 3 (lg, md); 60 px above.

| xs | sm | md | lg | xl |
|---|---|---|---|---|
| stack, 40 / 20 px gaps | stack | 3 / 3 / 3 | 3 / 3 / 3 | 3 / 3 / 2 |

→ Make it **required** on every case study. Optional extra cells: Platforms, Company, Year.

---

## I — Media

Shared image rules: radius **16 px** (diagrams, squares, video, embeds) or **12 px** (UI screenshots); `border-hairline` (#34373d) where the image edge would disappear into the dark background.

### I1 Wide figure
- A single image, 10 cols (md 12), radius 16 (12 on sm/xs), optional 20 px side padding.
- Examples: structure diagram, framing overview (2650 × 1046), before/after.
- Source sizes: 2560 px wide, PNG.

### I2 Figure pair
- Two square images (1800 × 1800) side by side, **5 + 5 cols**, centred, radius 16.

| xs | sm | md | lg | xl |
|---|---|---|---|---|
| stack | stack | 5 + 5 | 5 + 5 | 5 + 5 |

### I3 Screen stack
- **Anatomy:** a 10-col column (md 12) with 1–2 UI screenshots stacked vertically (3:2, 2880 × 1920 or 2400 × 1600), then a **caption** (Caption style, `text-default`).
- **Image style:** radius 12, `border-hairline`, `shadow-screenshot`, 20 px inner padding (xl), 0 on sm/xs, 10 px gap.
- ⚠ Captions are inconsistent (one plain paragraph, one with a one-off colour).

### I4 Comparison (before → after)
- **Anatomy:** a "Then" card (10 cols, `bg-card`, radius 16, image inside with 40 / 20 / 20 / 30 padding), then a **red arrow** in a spacer row (positioned at col 7–8, with −100 px vertical margins so it overlaps both cards), then a "Now" card (10 cols, photographic background, image inside).
- **Column mode:** stays "multi" on sm/xs so the arrow keeps its position; arrow margins shrink to −40 / −28 (xs).
- → In Astro, build as one component with `before`, `after` and an optional `arrow`.

### I5 Insight row
- **Anatomy:** illustration (948 × 678, 4 cols), then a title (H6 style, white ⚠ inconsistent element) and a body paragraph (4 cols; lg/md 5). Repeated 3 times.

| xs | sm | md | lg | xl |
|---|---|---|---|---|
| stack; image padded right ~120 px (≈ 60 % width) | stack; image ~60 % | 4 + 5 | 4 + 5 | 4 + 4 |

### I6 Video
- `<video>` 10 cols, radius 16, `border-hairline`. Source: `.mov` 1920 × 1236 ⚠. Use MP4/H.264 (plus WebM), with a poster image, muted, playsinline, and no autoplay unless it's a short loop.

### I7 Interactive embed
- **Anatomy:** an `<iframe>` to a self-contained HTML demo, 12 cols, fixed height (556 px token demo; 800 px call grid), radius 16, `loading="lazy"`.
- **Responsive (as-is):**
  - Case A: section visible on **xl only**; a static image fallback section is shown on lg and below.
  - Case B: the whole sub-chapter, *including its text*, is **hidden on sm/xs** ⚠.
- → Rule for the new site: **the text is always visible**. The embed is responsive (aspect-ratio or `height` per breakpoint), or it is replaced by a poster image with a caption ("Interactive demo — open on desktop"). Give every iframe a `title`.

### I8 Annotation overlays
- **Stamp:** `confidential-black-outline.svg`, about 3 cols wide, overlapping the hero image's bottom-right (neg. margin −40 to −100 px, z-index 250). On sm/xs it's full-width but padded so it renders at about 40–60 % size.
- **Arrow:** salmon hand-drawn SVG (153 × 267), about 1–2 cols, overlapping neighbouring blocks via negative margins.
- Both are decorative and need `alt=""` and `aria-hidden`.

---

## L — Collections

### L1 Project grid
- **Anatomy:** a masonry grid of cards: thumbnail (16:10, 2560 × 1440 / 2100 × 1316), title (white, 20–22 px ⚠ renders Open Sans), category (`text-default`, 14–18 px ⚠). Hover darkens the thumbnail with `overlay-thumb`.
- **Home:** 2 columns at md+ with a 60 px gutter and 60 px row gap; 1 column on sm/xs. Section on black, 80 / 80 padding.

| xs | sm | md | lg | xl |
|---|---|---|---|---|
| 1 col | 1 col | 2 col | 2 col | 2 col |

### L2 Other projects
- The same grid with a 30 px gutter and 30 px row gap, under dash + H3 "Other projects". ⚠ It includes the current project.
- → Show all other projects, or the next 2, and exclude the current one.

---

## U1 Spacer
A Semplice spacer module (40 px) used only to position the arrow in I4. Not needed in Astro; use layout or spacing tokens.

---

## Responsive behaviour summary

| Rule | As-is |
|---|---|
| Column stacking | Every multi-column row stacks at < 768 px (except I4) |
| Reading width | 8 cols at xl, 9 at lg/md, 12 below |
| Media width | 10 cols at xl/lg, 12 at md and below |
| Image corner radius | 16 → 12 on sm/xs for wide figures |
| Image inner padding | 20 px → 0 on sm/xs |
| Section padding | Shrinks roughly 80 → 60 → 40 → 20 px |
| Decorative overlaps | Kept but shrunk via padding; negative margins reduced |
| Interactive embeds | Hidden or replaced below xl (A) or below md (B) |
| Hero stamp | Moves from overlapping the right edge to left-aligned under the image |
