# 04 — Rules for building pages

These rules turn the analysis, styleguide and module inventory into a repeatable system for the new site. They're written so you, or Claude, can produce a new case study or page from a short brief without redesigning anything.

Target stack: **Astro (static output)**, content in **Markdown/MDX content collections**, deployed to **GitHub Pages** or your own webspace via FTP/rsync. No CMS is needed.

---

## 1. Principles

1. **One look, many stories.** Every page uses only the tokens in `tokens/` and the modules in `03-modules.md`. A new visual need means a new module in the inventory, not one-off styling inside a page.
2. **Dark editorial.** The page background is black. White is reserved for headings, leads, labels and emphasis; body copy uses `text-default`. Colour comes from the work (screenshots) and from the two signal accents only.
3. **Story before chrome.** Every case study answers *context → problem → my role → process/insight → solution → outcome → learning*, in that order.
4. **Mobile parity.** Every text block appears on every breakpoint. Only *media* may be swapped for a lighter fallback.
5. **Scannable for recruiters, deep for designers.** The first screen and the meta row give the 10-second summary. Chapters give the depth.

---

## 2. Proposed project structure (Astro)

```
src/
  content/
    config.ts            # collection schemas (below)
    projects/            # one .mdx per case study
      wire-design-system.mdx
      wire-meetings.mdx
    pages/
      about.mdx
  components/            # one file per module ID in 03-modules.md
    SiteHeader.astro  SiteFooter.astro
    HomeHero.astro  CaseHero.astro  PageHeader.astro
    Statement.astro  Lead.astro  SectionTitle.astro
    Chapter.astro  SubChapter.astro  ChallengeSolution.astro  Outcome.astro
    ProjectMeta.astro  CareerEntry.astro
    Figure.astro  FigurePair.astro  ScreenStack.astro  Comparison.astro
    InsightRow.astro  Video.astro  Embed.astro  Stamp.astro  Arrow.astro
    ProjectGrid.astro  ProjectCard.astro
  layouts/
    Base.astro           # <html>, fonts, tokens.css, header, footer
    CaseStudy.astro      # hero + meta + slot + outcome + other projects
  styles/
    tokens.css           # from tokens/tokens.css
    base.css             # reset, typography roles, grid, utilities
  assets/projects/<slug>/ # images (processed by astro:assets → AVIF/WebP, srcset)
public/
  fonts/                 # Geist variable woff2, EditorialNew-Ultrabold woff2
  demos/<slug>/          # self-contained interactive HTML demos (iframes)
```

### 2.1 Content schema: `projects`

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().max(70),                 // H1, sentence case
    shortTitle: z.string().max(40),            // card + <title>
    summary: z.string().max(160),              // card text + meta description
    category: z.enum(['Product Design', 'Design Systems', 'Design Vision', 'Research', 'Prototyping']),
    tags: z.array(z.string()).max(4).default([]),
    cover: image(),                            // 16:10 card + hero mockup
    heroVariant: z.enum(['mockup', 'backdrop']).default('mockup'),
    heroBackground: image().optional(),        // for 'backdrop'
    confidential: z.boolean().default(false),  // shows the stamp
    company: z.string(),
    role: z.string(),
    team: z.string(),
    timeline: z.string(),
    year: z.number(),
    platforms: z.array(z.string()).optional(), // e.g. ['iOS','Android','Web']
    order: z.number(),                         // grid position
    draft: z.boolean().default(false),
  }),
});
export const collections = { projects };
```

### 2.2 Global rules for components
- Components take **content as props or slots**, never style overrides. No `style=` attributes in MDX.
- Spacing between modules comes from the parent layout (a `flow` / stack utility with `--chapter-gap`), not from margins on each module.
- Grid spans follow `03-modules.md` → *Responsive behaviour summary*. Use two layout wrappers: `.measure-text` (8 / 9 / 12 cols) and `.measure-media` (10 / 12 cols).
- Headings are semantic (`h1` once per page, then `h2` for chapters, `h3` for sub-chapters). The visual size comes from the type role class (`.t-heading-l` etc.), so the level and the look are decoupled.

---

## 3. Page templates

### 3.1 Case study (standard)

Required (★) and optional (○) blocks, in this order:

| # | Block | Module | Rules |
|---|---|---|---|
| ★1 | Hero | `CaseHero` | H1 ≤ 8 words, sentence case. Mockup or backdrop. Stamp if `confidential` |
| ★2 | Lead | `Lead` | Eyebrow "Background". 2–3 sentences: situation → why it mattered → what you did |
| ★3 | Meta | `ProjectMeta` | Role · Team · Timeline (+ Platforms/Company optional) |
| ○4 | Insights | `Chapter` + 3× `InsightRow` | Source of insights in one sentence, then 3 insights (title ≤ 4 words + 1–2 sentences) |
| ○5 | Framing | `Chapter` + `Figure wide` | The reframe / key decision that unlocked the solution |
| ★6 | Solution chapters | 2–5× `Chapter` (or `SubChapter`s) | Each: heading ≤ 4 words, 1–3 paragraphs, ≥ 1 visual |
| ○7 | Constraints | `ChallengeSolution` inside chapters | Max 1 per chapter. Be honest about trade-offs |
| ○8 | Interactive demo | `Embed` | Always with a poster fallback + caption on < 992 px |
| ★9 | Outcome | `Outcome` | Exactly 3 points, each starting with the result. ≥ 1 number or concrete artefact |
| ○10 | Learnings | `Chapter` (short) | 2–3 sentences: what you'd do differently / what's next |
| ★11 | Other projects | `ProjectGrid exclude=current` | Up to 2 cards |

Length guide: **900–1,500 words**, **6–12 visuals**, readable in 5–7 minutes.

Chapter heading vocabulary (keep it short and concrete): *Then and now · Shared effort · Multiplatform · Accessibility · AI-ready · Key user insights · From X to Y · Design solution · Outcome · Learnings*.

### 3.2 Case study, variant: Design vision (next planned)
Same frame, with these chapters suggested: **Where we were** (Comparison: today) → **Principles** (3 × InsightRow or a numbered list) → **The vision** (Figure wide + ScreenStack of key screens) → **How it travels** (how it was shared: workshops, prototype, embed) → **What it changed** (Outcome) → Learnings. Mark speculative screens clearly as "Vision, not shipped" in captions.

### 3.3 Home

| # | Block | Module | Rules |
|---|---|---|---|
| ★1 | Cover | `HomeHero` | Display headline ≤ 12 words: who + what + where. Portrait with spotlight (pointer only) |
| ★2 | Statement | `Statement` | 1–2 sentences on how you work **and** what roles/problems you're looking for |
| ★3 | Selected work | `SectionTitle` + `ProjectGrid` | All non-draft projects by `order`. Card: cover, shortTitle, category, summary |
| ○4 | Demos / experiments | `ProjectGrid` (variant `compact`) | Links to standalone interactive demos |
| ○5 | Contact CTA | `Statement` + links | Email, LinkedIn, CV (PDF) |
| ★6 | Footer | `SiteFooter` | |

### 3.4 About

| # | Block | Module |
|---|---|---|
| ★1 | Page header | `PageHeader`: eyebrow "About me", positioning H1 (Editorial), 2 intro paragraphs |
| ○2 | Portrait | `Figure` (4–5 cols next to the intro on md+) |
| ○3 | What I do | 3× `InsightRow` without images, or a short list: end-to-end, systems, vision |
| ★4 | Career | `SectionTitle` + `CareerEntry` per role (newest first) |
| ○5 | Education | `CareerEntry` |
| ★6 | Contact | email, LinkedIn, CV download |

### 3.5 Other page types (when needed)
- **Imprint / Privacy:** `PageHeader` (no intro) + prose at `.measure-text`, Body style.
- **Standalone demo page:** `PageHeader` + `Embed` (full 12 cols) + 1 `Chapter` explaining the system thinking behind it.

---

## 4. Writing rules

- **Voice:** first person singular for your own actions ("I led…"); use "we" only for genuine team decisions. Present tense for the product, past tense for the project.
- **Sentence case** everywhere (titles, headings, buttons). No Title Case.
- **Lead sentences:** each ≤ 25 words, one idea per sentence, no jargon in the first one.
- **Paragraphs:** ≤ 4 sentences. One message per paragraph.
- **Outcome items:** start with the effect, then the cause ("Qualifies Wire for public-sector tenders by meeting WCAG and BITV").
- **Numbers:** use real numbers wherever possible (team size, timeline, tokens, components, contrast fixes, adoption, launch date).
- **Confidential work:** describe it at the level of patterns and decisions, blur or mark sensitive data, and keep the stamp.
- **Spelling:** run a spell-check before publishing. Several typos are on the current site (see analysis).
- **Labels:** eyebrows are one word ("Background"). Meta labels are "Role", "Team", "Timeline", "Platforms".
- **Em-dash marker:** appears above every chapter heading (rendered by the component, not typed into the content).

---

## 5. Visual & asset rules

| Asset | Format | Size | Ratio | Style |
|---|---|---|---|---|
| Project cover (card + hero) | PNG/JPG source → AVIF/WebP | 2560 × 1600 | 16:10 | Device mockups on transparent or dark bg |
| Hero backdrop | JPG | 2560 wide | free | Dimmed 50 %, no text |
| Wide diagram | PNG/SVG | 2560 wide | ~16:9 to 5:2 | Dark bg #191919/#34373d, Geist labels |
| UI screenshot | PNG | 2880 × 1920 | 3:2 | radius 12, hairline, shadow |
| Square pair | PNG | 1800 × 1800 | 1:1 | radius 16 |
| Insight illustration | PNG/SVG | 948 × 678 | ~7:5 | |
| Video | MP4 (H.264) + poster | 1920 wide | as captured | muted, playsinline, ≤ 30 s, ≤ 8 MB |
| Interactive demo | self-contained HTML in `public/demos/` | | responsive | must work at 375 px or provide a poster |
| Decorative SVG | SVG | | | `alt=""`, `aria-hidden="true"` |

- Every content image has meaningful `alt` text (what it shows and why it matters), and decorative images have empty `alt`.
- Captions are optional, but when used they're the `Caption` style in `text-default`, placed under the image, ≤ 8 words.
- Never place text in white on `bg-card` below 18 px. Never use `text-default` on `bg-card` below 18 px (4.3:1).

---

## 6. Layout & spacing rules

- **Grid:** fixed 12 columns. The grid width is fixed per breakpoint: xl 1170 (col 70, gutter 30), lg 896 (col 60, gutter 16), md 656 (col 40, gutter 16), full width below 768. Outer padding around the grid: 30 px (≥ 768) / 20 px (< 768). No floating widths inside a breakpoint.
- **Text measure:** 8 cols (xl) → 9 (lg, md) → 12 (sm, xs). Never set body copy wider than 8 cols on desktop. Hero has its own rules.
- **Media measure:** 10 cols (xl, lg, md) → 12 (sm, xs). Embeds and grids use 12. All measures sit inside the grid padding.
- **Vertical rhythm:** `--chapter-gap` (40 → 80 px fluid) between chapters; `--space-4` (20 px) between modules inside a chapter; `--space-3` (12 px) between a heading and its body.
- **Hero:** `--hero-top` (60 → 160 px) above the H1.
- **Section backgrounds:** `bg-page` by default. `bg-raised` only for the home cover and statement. Black "full-bleed" sections only for Outcome + Other projects (apply consistently on all case studies).
- **Overlaps** (stamp, arrow) use CSS `translate`/negative margins inside the component only, and are reduced by 50 % below 768 px.

---

## 7. Responsive rules (checklist per module)

| Breakpoint | Rule |
|---|---|
| ≥ 1230 (xl) | Reference layout. Interactive demos live |
| 992–1229 (lg) | Text 9 cols. Type steps down (never up) |
| 768–991 (md) | Grid 720 fixed. Text 9, media 10 cols. Pairs stay side by side |
| 544–767 (sm) | All rows stack. Image inner padding 0. Radius 12 |
| < 544 (xs) | Same as sm. Hero type at minimum. Embeds → poster + caption if not usable at 375 px |
| touch devices | No hover-only information. No spotlight dependency |
| reduced motion | No reveal, tilt or spotlight animation |

---

## 8. Accessibility & quality rules

- Contrast: body ≥ 4.5:1 and large text ≥ 3:1 (the palette passes on black; avoid default text on cards).
- One `h1` per page, no skipped heading levels, landmarks (`header`, `main`, `footer`, `nav`).
- Visible `:focus-visible` outline on links, cards and the menu button.
- `iframe` has a `title`; `video` has controls or is a decorative loop with `aria-hidden`.
- Every page has a unique `<title>` ("{shortTitle} — Wolfgang Lattermann"), a meta description (`summary`) and an Open Graph image (`cover`).
- Performance budget: LCP < 2.5 s on 4G; hero image ≤ 300 KB AVIF; fonts woff2 + `font-display: swap`; demos lazy-loaded.

---

## 9. Definition of done: new case study

- [ ] Frontmatter complete (schema validates), `draft: false`
- [ ] Hero, Lead, Meta, ≥ 2 chapters, Outcome, Other projects present
- [ ] Outcome has 3 points, ≥ 1 concrete number or artefact
- [ ] All text visible at 375 px; demo has a fallback
- [ ] All images have alt text and the correct ratio/size; covers 16:10
- [ ] Sentence case; spell-checked; heading levels correct
- [ ] Card appears on Home and in "Other projects" on the other cases (not on itself)
- [ ] Lighthouse: Accessibility ≥ 95, Performance ≥ 90

---

## 10. Briefing template (to create a new case study with Claude)

```md
Project: <name>            Company: <company>     Year: <yyyy>
Role: <your role>          Team: <who>            Timeline: <duration>
Platforms: <iOS / Android / Web / …>              Confidential: yes/no
Category: <Product Design | Design Systems | Design Vision | …>

One-line summary (≤160 chars):
Context — what was the situation and why did it matter?
Problem — what wasn't working, for whom?
My contribution — what did *I* do / decide / drive?
Insights (optional) — 3 findings + source
Key reframe / decision (optional)
Solution chapters — 2–5 headings, each with 2–4 bullet facts + the visuals I have
Constraints & trade-offs (optional) — challenge → how I handled it
Outcome — 3 results (numbers if any)
Learning — what I'd do differently / what's next
Assets — list of files with a 1-line description each
```

With this brief, the tokens, the module inventory and these rules, a new case study MDX file can be produced in one pass.
