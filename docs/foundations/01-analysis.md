# 01 — Analysis of the current portfolio

Source: hallo-wl.de/wordpress5 (WordPress + Semplice 5.3.4), read on 1 Oct 2026 in a browser at 1440 px and 581 px widths. Style values come from the CSS Semplice generates for each page, so they hold for all five breakpoints.

Pages analysed:

| Page | URL slug | Purpose |
|---|---|---|
| Home | `/` | Introduction + project grid |
| Case study A | `/project/managing-a-multiplatform-design-system` | Wire design system (systems, a11y, tokens) |
| Case study B | `/project/new-meeting-experience-for-a-messenger-app` | Wire Meetings feature (product design, research → solution) |
| About | `/about-me` | Positioning + career timeline |

---

## 1. Overall impression

- **Visual identity.** A dark, editorial look. An ultrabold serif display face (Editorial New) is paired with a clean grotesk (Geist), on black and near-black (#000 / #191919) with grey-blue body copy (#9a9aab) and white for emphasis. It looks calm and premium and lets the product screenshots carry the colour.
- **Narrative voice.** First person, concise and honest about constraints ("I wasn't able to get buy-in…"). That works well for design directors, because it shows judgement as well as output.
- **Signature devices** that make the site recognisable and are worth keeping:
  - the long **em-dash "—" above every chapter heading**
  - the **"Confidential" stamp** overlapping the hero image
  - **red hand-drawn arrows** that annotate image sequences
  - **interactive embeds** (token demo, call grid) that show systems thinking in practice
  - the **spotlight/tilt 3D portrait** on the homepage
- **Structure.** Both case studies follow the same backbone: Hero → Background (lead statement) → Chapters (dash + heading + body + media) → Outcome (numbered list) → Other projects → Footer. This consistency makes a template easy to derive.

## 2. Page-by-page

### 2.1 Home

| # | Block | Content |
|---|---|---|
| 1 | Fullscreen cover (#191919) | 3D portrait (dark) with a cursor spotlight revealing a coloured version, mouse-tilt; display H1 "Hi, I'm **Wolfgang**, a Product Designer based in Berlin." mixing Geist Bold with Editorial New for the name |
| 2 | Intro statement (#191919, 8 cols) | Two H3 sentences: hands-on approach, "fuzzy idea → something real" |
| 3 | Selected Work (#000) | H2 + 2-column masonry grid (thumbnail, title, category "Product Design") |
| 4 | Footer | © line + Imprint |

Observations:
- Strong, personal first screen. Text in the H1 reads **"Hi,I'm"** (missing space).
- Only two projects are visible, and both carry the same category label ("Product Design"), so the label tells the visitor nothing. A short one-line summary or the skills shown (Systems, Research, Interaction…) would help recruiters scan.
- No direct CTA (contact / CV / LinkedIn) on the homepage. "Contact" is only a mailto in the nav.
- The intro statement says *how* you work, but not *what kind of roles / problems* you want (senior/staff, end-to-end, design vision).

### 2.2 Case study A: Managing a Legacy Multiplatform Design System

Sequence: Hero (bg image + H1 + stamp) → Background (eyebrow + 3 H2 lead sentences) → **Then and Now** (before/after cards with red arrow) → **Shared effort** → interactive **token demo** (desktop only; static image below 1170 px) → **Multiplatform** (structure diagram + iOS/Android pair) → **Accessibility** (image pair) → **AI-ready** (video) → **Outcome** (3 numbered points) → Other projects.

Strengths
- A clear thesis in the lead ("I led its modernization: shared token layer, WCAG 2.1 AA, documentation for people and AI").
- It moves from problem to system to people (shared infrastructure) to outcome. The interactive demo is a real differentiator.
- The outcomes are framed in business terms (tenders, speed, brand).

Gaps
- There is **no project meta row** (role, team, timeline, platforms), although case B has one. Recruiters look for this first.
- No quantified results (number of tokens or components, contrast fixes, adoption, time saved). Even rough numbers would help.
- The page title says "Managing a Multiplatform Design System" but the H1 says "Managing a *Legacy* …", so the two disagree.
- Typo: "fundametals".
- "Other projects" lists **the current project itself**.
- The interactive demo is hidden below 1170 px and replaced by a static image, which is acceptable, but the fallback has no caption explaining that the demo is interactive on desktop.

### 2.3 Case study B: A New Meeting Experience for a Secure Messenger

Sequence: Hero (H1 + cover mockup + stamp, soft shadow bg image) → Background (eyebrow + 2 H2) → **Meta row** (My Role / Team / Timeline) → **Key user insights** (3 × illustration + title + text) → **From Calls to Meetings** (framing + wide diagram) → **Design solution** with numbered sub-chapters 1–3, each with *● Challenges / ► Solution* and screenshot stacks with captions → **interactive call-grid prototype** → Outcome → Other projects.

Strengths
- It reads as a textbook senior case study: research → framing → solution → trade-offs → outcome.
- The Challenge/Solution pattern clearly shows how you handled constraints.
- The terminology work ("Meetings" rather than "Calls") shows product thinking.
- A vibe-coded prototype is very current and relevant.

Gaps
- **Sub-chapter "3. Calling experience" and the prototype are hidden on phones (< 768 px).** Mobile visitors miss the strongest part of the story. Recruiters often first open links on a phone.
- Heading levels differ from case A: chapters here use **H4**, case A uses **H3**. Sub-chapters use H5.
- The insight titles are inconsistent: the first is an H6, the other two are styled paragraphs.
- Captions are inconsistent: "Scheduling a meeting" is plain body text instead of the caption style, and "My Meetings" has a one-off colour (#6b6b7b).
- The outcome is soft: there is no metric, and the beta results aren't summarised. A short "What I learned" section is also missing.
- Typos: "acoount", "desig around", "cinsidered", "videostream", "mre than", "helped setting", "users actual goal", "as effortless as possible".
- The H1 is in Title Case ("A New Meeting Experience For A Secure Messenger"), while everything else on the site is in sentence case.

### 2.4 About me

Sequence: eyebrow "About Me" → H1 positioning line "Making complex things simple, with an eye on what they could become." → 2 H4 intro paragraphs → H2 "Career" → 4 entries (dash, company + role, dates, text): Wire, Fresh Energy, Seerene, Freelance → Footer.

Strengths
- It's a clear positioning statement, and the intro matches your project brief (end-to-end, hands-on UI, design vision).

Gaps
- Company and role are set in the same style (both H3 GeistBold), so there's **no hierarchy** between them, and the markup contains leftover nested colour spans (#191919 → #fff) from copy and paste.
- Wire dates read "Jan 2021 – **Nov 2026**", which is a future date as of today.
- There is no photo, contact block, CV download, LinkedIn link, skills or tools list, or education entry beyond the freelance paragraph.
- Typo: "helped establishing" should be "helped establish".
- Tone check: "outlasted five CEOs, until a new one decided AI could take care of design" is memorable, but some hiring managers may read it as bitter. Worth a deliberate decision.

## 3. Cross-cutting findings

### 3.1 Consistency issues (system level)
1. **Five font presets are defined, but at least nine different `font_*` classes are used in content.** Undefined classes (`font_b139skdw8`, `font_bsq2yhds5`, `font_sp4frnlyk`, `font_k82ltb0dg`, `font_h4xao00mn`, `font_8vpjhcnet`, `font_3i3swtorz`, `font_l2h5kmdk0`, `font_lgs5maaao`) silently fall back to the element default. They are leftovers from earlier theme versions.
2. **Portfolio grid titles render in "Open Sans"** (the Semplice default), not Geist, so the font is wrong on every project thumbnail.
3. **Heading sizes invert at the lg breakpoint.** H2–H4 are *larger* at 992–1169 px than at ≥ 1170 px (e.g. H4 30 px at xl but 36 px at lg).
4. **List items have no responsive size** (always 19 px), while paragraphs shrink to 16 px on mobile, so outcome lists look larger than body text on phones.
5. **Inline colours everywhere.** White emphasis is applied via inline `style="color:#fff"` spans rather than a style. In a new system, "strong / heading text = white" should be a token-driven rule.
6. **Section spacing is set per section by hand** (14 distinct padding values). Most of them map to a 20 px rhythm (20/40/60/80/120/160).
7. **Background inconsistency.** Home uses #191919 as the page background and transition colour; case studies use #000. The Outcome section is #000 in case A and transparent in case B.
8. The **next/previous project block** is styled white with black text (Semplice default), which clashes with the dark theme. It isn't currently used, but it's configured.
9. **Unused assets loaded:** Google Fonts Inter and IBM Plex Mono, plus three Editorial New cuts, of which only UltraBold is used. All are loaded as `.otf`/`.ttf` (no woff2).

### 3.2 Content model (what every case study has or should have)

| Field | Case A | Case B | Recommendation |
|---|---|---|---|
| Title (H1) | ✔ | ✔ | Sentence case, ≤ 8 words |
| Hero visual | bg image | mockup | Required: one hero image 16:10 |
| Confidential stamp | ✔ | ✔ | Optional flag |
| Background / lead (H2) | ✔ | ✔ | Required: 2–3 sentences |
| Meta: role, team, timeline | ✘ | ✔ | Required |
| Insights / research | – | ✔ | Optional chapter type |
| Chapters (dash + heading) | 5 | 3 + 3 sub | 3–6 |
| Challenge / Solution pairs | – | ✔ | Optional component |
| Interactive demo | ✔ desktop only | ✔ hidden on mobile | Include with a mobile fallback |
| Outcome list | ✔ 3 | ✔ 3 | Required: 3 items, ideally with numbers |
| Learnings / reflection | ✘ | ✘ | Recommended |
| Other projects | ✔ (incl. self) | ✔ (incl. self) | Exclude the current project |

### 3.3 Accessibility quick check (text on backgrounds)

| Text colour | on #000 | on #191919 | on #34373d (card) |
|---|---|---|---|
| #9a9aab body | 7.6 ✔ AAA | 6.4 ✔ AA | 4.3 ⚠ AA large only |
| #8e8e8e muted | 6.4 ✔ | 5.4 ✔ | 3.6 ✘ |
| #6b6b7b caption (one-off) | 4.0 ✘ for small text | 3.4 ✘ | 2.3 ✘ |
| #ff4b53 red | 6.4 ✔ | 5.3 ✔ | 3.6 ✘ |

Other a11y points:
- Headings are used for visual size, not for structure. For example, the H6 eyebrow comes before the H2 lead, H2 paragraphs are used as body copy, and chapter levels differ between pages.
- The iframes have no title in case B.
- Decorative SVGs (arrows, stamp) need `alt=""`.

## 4. What to carry into the new site
- Keep: the dark editorial palette, Editorial New + Geist, the em-dash chapter marker, the stamp and arrow annotations, the interactive embeds, the Challenge/Solution pattern, the meta row and the numbered outcome list.
- Fix: one heading hierarchy, one spacing scale, a meta row on every case, mobile parity for demos, captions as a component, sentence case, woff2 fonts, and the self-reference in "Other projects".
- Add: per-project summary + tags on cards, a contact CTA on Home and About, a learnings section, and real metrics where possible.
