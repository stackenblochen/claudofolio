# 03 — Rules for building pages

These rules turn the styleguide (`01-styleguide.md`) and the module inventory (`02-modules.md`) into a repeatable system. They're written so you, or Claude, can produce a new case study or page from a short brief without redesigning anything.

Target stack: **Astro (static output)**, content in **Markdown/MDX content collections**, deployed to **GitHub Pages** or your own webspace via FTP/rsync. No CMS is needed.

---

## 1. Principles

1. **One look, many stories.** Every page uses only the tokens in `src/styles/tokens.css` and the modules in `02-modules.md`. A new visual need means a new module in the inventory, not one-off styling inside a page.
2. **Dark editorial.** Dark is the default theme, with a light theme behind the nav switch. Strong text (`--text-strong`) is reserved for headings, leads and emphasis; body copy uses `--text-default`. Colour comes from the work (screenshots), the salmon accent and the green positive mark only. Components use semantic tokens, never hex values.
3. **Story before chrome.** Every case study answers *context → problem → my role → process/insight → solution → outcome → learning*, in that order.
4. **Mobile parity.** Every text block appears on every breakpoint. Only *media* may be swapped for a lighter fallback.
5. **Scannable for recruiters, deep for designers.** The first screen and the meta row give the 10-second summary. The numbered sections give the depth.

---

## 2. Project structure (Astro)

```
src/
  content.config.ts      # collection schema (see 2.1)
  content/projects/      # one .mdx per case study (copy _template.mdx; files starting with _ are ignored)
  components/            # one file per module ID in 02-modules.md; schema/ holds the Schema parts
  layouts/
    Base.astro           # <html>, fonts, tokens, header, footer, page transition
    CaseStudy.astro      # hero + overview + numbered story sections (slot) + outcome + other projects
  pages/                 # index, about, styleguide, projects/[id]
  lib/                   # site.ts (SITE, url(), highlight()), projects.ts, gradients.ts, prism.ts, lock.ts …
  styles/                # tokens.css, base.css, mock.css, frames/
  assets/                # images processed by astro:assets (AVIF/WebP, srcset); projects/<slug>/, doodles/
public/
  fonts/                 # Geist variable + Editorial New woff2 (see fonts/README.md)
  demos/<slug>/          # self-contained interactive HTML demos (iframes)
  cv/, videos/, favicons
```

### 2.1 Content schema: `projects`

The schema is `src/content.config.ts` (Zod); it is the single source of truth for frontmatter, so it is not repeated here. The fields in short:

- **Titles and teaser:** `title` (H1, sentence case, ≤ 70 chars, `*word*` marks an Editorial highlight), `shortTitle` (card and `<title>`), `summary` (≤ 160, but aim for about 90 characters: the wide card shows three lines), `labels` (1–3 expertise pills, see L3 in `02-modules.md`), `tags`, `cover` + `coverAlt`, optional `thumb` (teaser as a `Mock`).
- **Hero:** `heroVariant` (`mockup` | `backdrop`), `heroBackground`, `confidential` (stamp), `protected` (password gate).
- **Meta:** `company`, `role`, `team`, `timeline`, `year`, `platforms`. The meta row shows only with at least three of role, team, timeline, platforms.
- **Story:** `lead` (1–3 sentences), `outcome` (exactly 3 points).
- **Housekeeping:** `order` (grid position), `draft`.

The layout renders hero, overview, outcome and other projects from the frontmatter; the MDX body holds the numbered StorySections only.

### 2.2 Global rules for components
- Components take **content as props or slots**, never style overrides. No `style=` attributes in MDX.
- Spacing between modules comes from the parent layout (a `flow` / stack utility with `--chapter-gap`), not from margins on each module.
- Grid spans follow `02-modules.md` → *Responsive behaviour summary*. Use two layout wrappers: `.measure-text` (8 / 9 / 12 cols) and `.measure-media` (10 / 12 cols).
- Headings are semantic (`h1` once per page, then `h2` for sections, `h3` for sub-headings). The visual size comes from the type role class (`.t-heading` etc.), so the level and the look are decoupled.

---

## 3. Page templates

### 3.1 Case study (standard)

Required (★) and optional (○) blocks, in this order:

| # | Block | Module | Rules |
|---|---|---|---|
| ★1 | Hero | `CaseHero` | H1 ≤ 8 words, sentence case. Mockup or backdrop. Stamp if `confidential` |
| ★2 | Overview | `Overview` (from `lead` + role/team/timeline) | 1–3 sentences: situation → why it mattered → what you did. Role, team and timeline as the row under it |
| ★3 | Story sections | 4–8× numbered `StorySection` (MDX) | Each: title ≤ 4 words, then The problem / The decision / The outcome (one or two sentences each) and the media that shows it. A section that does not fit the three beats uses plain paragraphs |
| ○4 | Insights | `StorySection` + 3× `ImageText` in its media | Source of the insights in one sentence, then 3 insights (title ≤ 4 words + 1–2 sentences) |
| ○5 | Interactive demo | `Embed` in a section's media | Always with a `poster` placeholder and a `note` for tablet and mobile (< 992 px); an optional `caption` for desktop and laptop |
| ○6 | Screen gallery | `ScreenGallery` (MDX, after the sections) | More screens as cards, each with title and category |
| ★7 | Outcome | `Outcome` (from `outcome`, `outcomeNumber`) | Exactly 3 points, each starting with the result. ≥ 1 number or concrete artefact |
| ★8 | Other projects | `ProjectGrid exclude=current` | Up to 2 cards |

The media is different for every case study: pick the module that fits what each section shows (mock, figure, schema, embed, video, before/after).

Length guide: **900–1,500 words**, **6–12 visuals**, readable in 5–7 minutes.

Section title vocabulary (keep it short and concrete): *Then and now · Shared effort · Multiplatform · Accessibility · AI-ready · Key user insights · From X to Y · Design solution · Outcome · Learnings*.

### 3.2 Case study, variant: Design vision (next planned)
Same frame, with these sections suggested: **Where we were** (Comparison: today) → **Principles** (3 × ImageText or a numbered list) → **The vision** (Figure wide + ScreenStack of key screens) → **How it travels** (how it was shared: workshops, prototype, embed) → **What it changed** → Learnings (the Outcome follows the sections). Mark speculative screens clearly as "Vision, not shipped" in captions.

### 3.3 Home

| # | Block | Module | Rules |
|---|---|---|---|
| ★1 | Stage | `HomeHero` (+ `DoodleStack`) | Title-style headline ≤ 12 words: who + what + where, name highlighted. One subline. Doodle stack (pops up on its own, max 3 at a time) |
| ★3 | Selected work | `SectionTitle` + `ProjectGrid` | All non-draft projects by `order`. Card: cover, shortTitle, labels, summary |
| ○4 | Demos / experiments | `ProjectGrid` (variant `compact`) | Links to standalone interactive demos |
| ○5 | Contact CTA | `ContactBlock` | Email, LinkedIn, CV (PDF) |
| ★6 | Footer | `SiteFooter` | |

### 3.4 About

| # | Block | Module |
|---|---|---|
| ★1 | Page header | `PageHeader`: eyebrow "About me", positioning H1 (Editorial), 2 intro paragraphs |
| ○2 | Portrait | `Figure` (4–5 cols next to the intro on md+) |
| ○3 | What I do | 3× `ImageText` without images, or a short list: end-to-end, systems, vision |
| ★4 | Career | `SectionTitle` + `CareerEntry` per role (newest first) |
| ○5 | Education | `CareerEntry` |
| ★6 | Contact | email, LinkedIn, CV download |

### 3.5 Other page types (when needed)
- **Imprint / Privacy:** `PageHeader` (no intro) + prose at `.measure-text`, Body style.
- **Standalone demo page:** `PageHeader` + `Embed` (full 12 cols) + 1 `StorySection` explaining the system thinking behind it.

---

## 4. Writing rules

- **Voice:** first person singular for your own actions ("I led…"); use "we" only for genuine team decisions. Present tense for the product, past tense for the project.
- **Sentence case** everywhere (titles, headings, buttons). No Title Case.
- **Overview sentences:** each ≤ 25 words, one idea per sentence, no jargon in the first one.
- **Paragraphs:** ≤ 4 sentences. One message per paragraph.
- **Outcome items:** start with the effect, then the cause ("Qualifies Wire for public-sector tenders by meeting WCAG and BITV").
- **Numbers:** use real numbers wherever possible (team size, timeline, tokens, components, contrast fixes, adoption, launch date).
- **Confidential work:** describe it at the level of patterns and decisions, blur or mark sensitive data, and keep the stamp.
- **Spelling:** run a spell-check before publishing.
- **Labels:** eyebrows are one word ("Background"). Meta labels are "Role", "Team", "Timeline", "Platforms".
- **Section number:** "— 01" appears above every section heading (rendered by the component from the `number` prop).

---

## 5. Visual & asset rules

| Asset | Format | Size | Ratio | Style |
|---|---|---|---|---|
| Project cover (card + hero) | PNG/JPG source → AVIF/WebP | 2560 × 1600 | 16:10 | Device mockups on transparent or dark bg |
| Hero backdrop | JPG | 2560 wide | free | Dimmed 50 %, no text |
| Wide diagram | live SVG (`Schema`) or PNG | 2560 wide | ~16:9 to 5:2 | Theme-aware; a PNG needs its own surface |
| UI screenshot | PNG | 2880 × 1920 | 3:2 | radius 12, hairline, shadow |
| Square pair | PNG | 1800 × 1800 | 1:1 | radius 16 |
| Insight illustration | PNG/SVG | 948 × 678 | ~7:5 | |
| Video | MP4 (H.264) + poster | 1920 wide | as captured | muted, playsinline, ≤ 30 s, ≤ 8 MB |
| Interactive demo | self-contained HTML in `public/demos/` | | responsive | shown on desktop and laptop only; tablet and mobile get the poster placeholder |
| Decorative SVG | SVG | | | `alt=""`, `aria-hidden="true"` |

- Every content image has meaningful `alt` text (what it shows and why it matters), and decorative images have empty `alt`.
- Captions are optional, but when used they're the `Caption` style in `text-default`, placed under the image, ≤ 8 words.
- Never set default text on `--bg-card` below 18 px (4.4:1 in dark, below 4.0:1 in light); use strong text on cards.

---

## 6. Layout & spacing rules

- **Grid:** fixed 12 columns. The grid width is fixed per breakpoint: xl 1170 (col 70, gutter 30), lg 896 (col 60, gutter 16), md 656 (col 40, gutter 16), full width below 768. Outer padding around the grid: 30 px (≥ 768) / 20 px (< 768). No floating widths inside a breakpoint.
- **Text measure:** 8 cols (xl) → 9 (lg, md) → 12 (sm, xs). Never set body copy wider than 8 cols on desktop. Hero has its own rules.
- **Media measure:** 10 cols (xl, lg, md) → 12 (sm, xs). Embeds and grids use 12. All measures sit inside the grid padding.
- **Vertical rhythm:** `--chapter-gap` (80 → 160 px fluid) between sections; `--space-4` (20 px) between modules inside a section; `--space-3` (12 px) between a heading and its body.
- **Hero:** `--hero-top` (60 → 160 px) above the H1.
- **Section backgrounds:** `--bg-page` by default. `--bg-raised` for raised sections, mock and schema stages. `--bg-pure` (pure white or black) only for the sections that hold the teasers (Outcome and Other projects, Home grid), applied consistently on all pages.
- **Overlaps** (stamp, arrow) use CSS `translate`/negative margins inside the component only, and are reduced by 50 % below 768 px.

---

## 7. Responsive rules (checklist per module)

| Breakpoint | Rule |
|---|---|
| ≥ 1230 (xl) | Reference layout. Interactive demos live |
| 992–1229 (lg) | Text 9 cols. Type steps down (never up) |
| 768–991 (md) | Grid 720 fixed. Text 9, media 10 cols. Pairs stay side by side |
| 544–767 (sm) | All rows stack. Image inner padding 0. Radius 12 |
| < 544 (xs) | Same as sm. Hero type at minimum. Embeds → poster placeholder + note (all embeds, below 992 px) |
| touch devices | No hover-only information. The home stage works without a pointer (scroll or timer) |
| reduced motion | No reveal, prism, teaser hover zoom or doodle animation (static arrangement) |

---

## 8. Accessibility & quality rules

- Contrast: body ≥ 4.5:1 and large text ≥ 3:1 (both themes pass on the page background; avoid default text on cards, see the styleguide).
- One `h1` per page, no skipped heading levels, landmarks (`header`, `main`, `footer`, `nav`).
- Visible `:focus-visible` outline on links, cards and the menu button.
- `iframe` has a `title`; `video` has controls or is a decorative loop with `aria-hidden`.
- Every page has a unique `<title>` ("{shortTitle} — Wolfgang Lattermann"), a meta description (`summary`) and an Open Graph image (`cover`).
- Performance budget: LCP < 2.5 s on 4G; hero image ≤ 300 KB AVIF; fonts woff2 + `font-display: swap`; demos lazy-loaded.

---

## 9. Definition of done: new case study

- [ ] Frontmatter complete (schema validates), `draft: false`
- [ ] Hero, Overview, ≥ 2 numbered sections, Outcome (with `outcomeNumber`), Other projects present
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
Labels: <1–3 of Product Design | Design Systems | Design Vision | Research | Prototyping>

One-line summary (≤160 chars):
Context — what was the situation and why did it matter?
Problem — what wasn't working, for whom?
My contribution — what did *I* do / decide / drive?
Insights (optional) — 3 findings + source
Key reframe / decision (optional)
Sections — 4–8 titles, each with the problem, the decision, the outcome + the visuals I have
Constraints & trade-offs (optional) — challenge → how I handled it
Outcome — 3 results (numbers if any)
Learning — what I'd do differently / what's next
Assets — list of files with a 1-line description each
```

With this brief, the tokens, the module inventory and these rules, a new case study MDX file can be produced in one pass.
