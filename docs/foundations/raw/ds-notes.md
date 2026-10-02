# Case study 1: Managing a (Legacy) Multiplatform Design System (post 276)
Title tag: "Managing a Multiplatform Design System"; H1: "Managing a Legacy Multiplatform Design System" (mismatch)

## Section sequence (xl widths; pads xl)
1. HERO 99150a087: bg #191919 + bg image design-system-cover-50alpha (cover), valign bottom, pad 140/0 xl (7.78rem/0; md/sm 100/60; xs 80/40)
   - row: col 10 (lg/md 9): H1 white
   - row: col 3 valign bottom: image "confidential" stamp svg, overlapping (margin-left 15.56rem, margin-bottom -2.22rem, z 250; per-breakpoint offsets)
2. INTRO aeb3a8501: transparent, pad 0/80 (md/sm 60, xs 40); col 8 (md/lg 9) padding-top 80 (60 md/xs)
   - H6 eyebrow "Background" ; H2 white x3 paragraphs (lead statement)
3. CHAPTER "Then and Now" 9fd29uxq2: pad 80/20 (lg 40, md 60, sm 40, xs 0)
   - col 8 (md 9): text: H3 "—" + H3 title (white) ; text: P body (padding-right 40)
4. IMAGE COMPARISON 5zsa0j2bx (column-mode multi on sm/xs): pad 20/20
   - col 10: card column (bg #34373d, border 1px #34373d, radius 16px) with image wire-then (padding 40/20/20/30 inside)
   - row: spacer col 6 + col 2 red arrow svg (negative margins -100px overlap, z 250)
   - col 10: card column bg = unsplash photo (cover) radius 16 with image wire-now inside
5. CHAPTER "Shared effort" 1edd1d2fc: H3 dash+title, P
6. INTERACTIVE DEMO gc3mjzuef (visible xl only): red arrow svg overlapping (col 1, negative margins); col 12 code module iframe token-demo/ui-accent-demo.html?theme=light&accent=blue height 556px, radius 16
7. DEMO FALLBACK tuuv4jb77 (hidden xl, visible below): col 11 static image ui-blue-dark-placeholder.png
8. CHAPTER "Multiplatform" wts7brrbx: H3 dash+title, 2 P ; col 10 diagram image ds-structure-with-text (radius 16) ; 2-up images 5+5 square (main-nav-ios / main-nav-android, radius 16) ; col 8 text 2 P (padding-top 40)
9. CHAPTER "Accessibility" vq036jtpy: H3, 2 P ; 2-up square images 5+5 (color-contrast, a11y-dark)
10. CHAPTER "AI-ready" 5xpp82dr3: H3, 2 P ; col 10 video (connect-2-desktop-1080.mov 1920x1236, radius 16, border #34373d)
11. OUTCOME 87858a6d7: bg #000 pad 40/40 (lg 60, xs 20): H3 dash + "Outcome" ; col 8 UL (decimal-leading-zero numbering, white list items) 3 items
12. OTHER PROJECTS ac9482da5: bg #000 pad 40/80: H3 dash + "Other projects" ; portfolio grid col 12 (gutter 30px, bottom 30, title 1.222rem #fff, cat 1rem #8e8e8e) — lists current project too
13. FOOTER: H6 #8e8e8e

## Computed at pane width 581 (sm bp): H1 46px/56 EditorialNew UltraBold; H6 16/26 ls .4 GeistRegular; H2 34/42 GeistBold mb 30; H3 30/36; p 16/25 GeistLight; li 19/28.5 (no li responsive override!) ; all text color #9a9aab unless inline white
- .thumb .post-title computed font = "Open Sans", Arial (Semplice default fallback leaking!)
- transition-wrap #000 here vs #191919 on home
- Orphan font classes font_b139skdw8, font_3i3swtorz — no CSS rule defines them
- Image radius 16px (0.889rem) consistently; card col radius 16

## Content (full text)
Background: Wire launched 2016 on strong foundation by former Skype designers. Years w/o design support + pivots → fragmented across iOS, Android, Web. I led modernization: shared token layer on native systems, WCAG 2.1 AA, documentation for people and AI.
Then and Now: 2020 nice on screenshots, not built for enterprise; pivot to enterprise collaboration from 2024.
Shared effort: DS as shared infrastructure; drove token rollout both sides, one naming structure Figma+code, semantic tokens.
Multiplatform: SwiftUI / Material 2/3 / React UI kit; custom tokens+components add brand. Native patterns (Liquid Glass, FAB). Shared iconography/colors.
Accessibility: audit with adesso; fix at system level; palette reworked AA light+dark; states; annotation spec for screen reader labels & keyboard order.
AI-ready: DESIGN.md (typo "fundametals"); Claude design system for PMs/designers to prototype.
Outcome (3): WCAG/BITV → public-sector & enterprise tenders; shared tokens cut back-and-forth; consistent look → enterprise brand.
Missing: role/team/timeline meta, metrics, process artefacts, captions.
