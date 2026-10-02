# Homepage raw extraction (desktop pane 581px wide, rem = 18px)

## Fonts (self-hosted)
EditorialNew Regular / Ultrabold / Ultralight (.otf, 2020) ; Geist Light / Regular / Bold (.ttf, 2026)
Google Fonts also loaded: Inter 200/400/600/800, IBM Plex Mono 300/400/500 (unused? check)
Font presets (Semplice classes):
- font_0ga3db0j9 = EditorialNewRegular
- font_2subfs3en = EditorialNewUltraBold (default h1)
- font_buxzwot1y = GeistLight (default p, li)
- font_twrgr03zo = GeistRegular (default h6)
- font_ac5vupz0n = GeistBold (default h2–h5)
- Orphan classes used in markup but not defined: font_l2h5kmdk0, font_lgs5maaao, font_b139skdw8

## Global type scale (rem, 1rem=18px) – xl(>=1170) / lg(992–1169) / md(768–991) / sm(544–767) / xs(<544)
h1: 4.444/5.556 ls -0.011 | 3.56/4.11 | 3.11/3.78 | 2.56/3.11 | 2/2.56 ls0
h2: 2.222/3 | 2.33/2.67 | 2.11/2.44 | 1.89/2.33 | 1.44/1.78
h3: 1.889/2.667 | 2.11/2.44 | 1.89/2.11 | 1.67/2 | 1.22/1.78
h4: 1.667/2.556 | 2/2.33 | 1.67/2 | 1.44/1.89 | 1.11/1.56
h5: 1.333/1.778 ls .011 | 1.33 | 1.33 | 1.22 | 1/1.44
h6: 1/1.444 ls .022 | – | – | .89 | .83/1.33
p/li: 1.056/1.5 | 1/1.556 | 1/1.556 | .89/1.556 | .89/1.556 ; p margin-bottom 1.5em
custom_spherse1q (caption/meta): GeistLight 1.111/1.778 color #8e8e8e ; lg-sm 1/1.556 ; xs .889/1.333
custom_lnsf8y3bz (inline span): GeistLight 1.111 #fff ; others 1
Hero H1 inline overrides: xl 6.667, lg 5.556/5.0, md 5/5, sm 4.111/4.333, xs 2.778/3.111

## Grid
container max-width 1230px; 12 cols; below 1170: gutter 8px per side (row -8px); Semplice default above (15px?)
Breakpoints: xl ≥1170, lg 992–1169.98, md 768–991.98, sm 544–767.98, xs ≤543.98
column-mode-sm/xs = single (stack)
helper classes: hide-for-desktop-wide / desktop / tablet-wide / tablet-portrait / mobile

## Colors
#191919 (cover bg, section bg, transition-wrap), #000000 (sections, project panel), #ffffff (headings, links),
#9a9aab (body .is-content text, nav links, hamburger), #8e8e8e (captions, meta, challenges border),
#bbbbbb (filter nav), #999999 (thumb category), #aaaaaa (next-prev label above), #34373d (app-shot border, back-to-top, overlay menu rgba(52,55,61,.97)),
#ff4b53 (progress bar), salmon (.link underline), yellow selection bg w/ black text, thumb hover rgba(0,0,0,.5)

## Custom CSS utilities
.transparent-border/.app-shot: drop-shadow 1px #34373d outline ; .transparent-shadow/.app-shot: 2× drop-shadow 0 4px 40px #0003
.link a: underline offset 4px salmon ; .challenges: border-left 1px #8e8e8e ; ul list-style decimal-leading-zero ; li margin 8px 0

## Nav
header sticky, transparent over cover, height 3.556rem (64px) xl–md, 3.111 sm, 3 xs; logo svg 7.778rem wide (5.556 sm/xs) white;
menu uppercase .833rem #9a9aab, hover/active #fff with 2px underline; mobile hamburger 24×14 #9a9aab; overlay menu rgba(52,55,61,.97) centered

## Project panel / next-prev
project-panel bg #000 pad 2.5rem 0; label 2.667rem #fff; pp-title 1.111rem #fff; meta .722rem uppercase #8e8e8e
next-prev bg #fff height 10rem; label 1.556rem #000; above .778rem uppercase #aaa ls1px (white block — inconsistent w/ dark theme)

## Homepage structure
1. Cover (fullscreen, #191919, 3D portrait image + mouse-tilt + spotlight mask revealing colored version, r 350px) – col 10/12: H1 mixed fonts "Hi, I'm Wolfgang, a Product Designer based in Berlin." white
2. Intro text section bg #191919 pad 40/120px – col 8: two H3 GeistRegular white
3. Selected Work bg #000 pad 80/80 – H2 "Selected Work" (col 8); portfolio grid masonry (col 12), gutter 60px, 60px bottom; thumbs 2 projects; title 1.111rem #fff, category 14px #8e8e8e
4. Footer section bg #000 – H6 "© 2026 Wolfgang Lattermann. All rights reserved. Imprint" pad 24/24, margin-top 64
