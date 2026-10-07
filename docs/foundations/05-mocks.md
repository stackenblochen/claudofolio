# 05 — Mocks (device frames for screenshots)

One system for showing websites, apps and UI elements in a device frame. Module ID **I9**, component `Mock`.

| File | What it is |
|---|---|
| `src/components/Mock.astro` | The component. Available in every case-study MDX without import |
| `src/components/mock-chrome.mjs` | Drawn window chrome (desktop bar, Chrome, Safari) as SVG |
| `src/styles/mock.css` | All templates |
| `src/styles/frames/` | The two phone frames (iOS, iOS without island, Android) |
| `/styleguide#mocks` | Live reference |

```astro
<Mock size="full" stage="dusk" devices={[{ device: 'desktop', src: shot, alt: 'Meetings list' }]} />
<div class="grid-12">
  <Mock size="half" align="cut-right" stage="calm-blue" devices={[{ device: 'desktop', fill: 'transparent', src: shot, alt: '…' }]} />
  <Mock size="half" align="cut-bottom" stage="calm-blue" devices={[{ device: 'ios', src: phone, alt: '…' }]} />
</div>
```

`stage` takes a gradient name from `src/lib/gradients.ts` (`dusk`, `calm-blue`, `active-salmon` …) and then follows the theme, or any CSS background. Without `stage` the mock is transparent. `full`, `cover` and `media` stand on their own; `half` and `third` go inside a `.grid-12` row. Everything inside scales with the stage width.

## Frames

All frames come from the template set `wl devices templates` (2400 px wide windows, two phones).

| Frame | How it is built | Variants |
|---|---|---|
| Desktop bar | Redrawn as SVG. 64 px of 2400 (2.67% of the window width), three 24 px controls, no title | `fill` solid · transparent, `controls` color · mono, theme light · dark = 8 |
| Chrome | Redrawn as SVG. 158 px of 2400 (6.58%): tab strip with one tab, toolbar with back, forward, reload, address pill with lock, menu | theme light · dark |
| Safari | Redrawn as SVG. 104 px of 2400 (4.33%): controls, centred address field with lock and host, reload | theme light · dark |
| iOS | Template image, screen cut out. Dynamic island, screen 9:19.5 | `cutout="none"` = frame without the island |
| Android | Template image (Pixel 3 XL), screen cut out. Notch and chin, screen 9:18.5 | — |

Window chrome is redrawn so the address and tab title stay live text, the bar is sharp at every size and the transparent bar can take the page's background. Colours and geometry are measured from the templates and kept as `--mock-d-*` (desktop), `--mock-b-*` (Chrome), `--mock-s-*` (Safari) and `--mock-wc-*` (controls) on `.mock`. Text in the chrome uses `--font-sans`.

Measured values:

| Part | Light | Dark |
|---|---|---|
| Desktop bar, solid | `#fafafa`, 2 px divider `#dce0e3` | `#17181a`, no divider |
| Desktop bar, transparent | the page's own background (top edge of the screenshot, stretched up behind the bar) with black at 4% on top, so it reads as part of the page | same, with `#353f53` at 30% on top |
| Controls, colour | `#ed6a5e` `#f5bf4f` `#62c554`, each with a 1 px darker ring | same |
| Controls, mono | solid bar: white with a 3 px `#dce0e3` ring · transparent bar: filled `#c8cbd0` | `#344054` |
| Chrome | strip `#dfe1e5`, tab and toolbar `#ffffff`, pill `#f1f3f4`, icons `#606367` | strip and pill `#202124`, tab and toolbar `#35363a`, icons `#f1f3f4` |
| Safari | bar and field `#ffffff`, field border `#bfbfbf` | bar `#191c1f`, field `#303335` |

## Options

| Option | Values | Notes |
|---|---|---|
| `size` | `full` 12 col 3:2 · `media` 10 col 3:2 · `cover` 12 col 16:10 · `half` 6 col 1:1 · `third` 4 col 3:4 | All stack to 12 col below 768 px |
| `align` | `center` · `fit` · `cut-right` · `cut-left` · `cut-top` · `cut-bottom` | `fit` = a single phone as big as the stage allows (94% of its height), nothing cut. Cut = device is enlarged, anchored on the opposite side and runs off the stage |
| `device` | `desktop` · `browser` · `ios` · `android` · `element` · `none` | `element` = bare dialog/modal with shadow. `none` = screenshot fills the stage, no frame |
| `theme` | `light` · `dark` · `auto` | Colours the chrome. `auto` follows the site theme |
| `fill` | `solid` (default) · `transparent` | `desktop` only. Both sit above the screenshot. Transparent takes the page's own background behind the bar, as Safari does: a sidebar or coloured header continues into it, with the template's tint on top. Needs a screenshot whose top edge is plain background (no border, no content touching the edge) |
| `controls` | `color` (default) · `mono` | `desktop` only |
| `browser` | `chrome` (default) · `safari` | `browser` only |
| `bar` | text, or `false` on desktop | `browser`: the address (Chrome shows it in full with the protocol dimmed, Safari shows the host). `desktop`: `false` hides the bar when the screenshot still has its own |
| `tab` | text | Chrome only: tab title (default = host of the address) |
| `layout="set"` | + `phone="right"` (default) or `"left"` | Desktop/browser top-left (or top-right) with a phone in front at the bottom corner. The phone ends lower than the window, so no desktop UI shows beneath it. Use on `full`, `media`, `cover` |
| `layout="row"` | 2 or 3 phones in `devices` | Phones side by side, centred or `cut-bottom` / `cut-top`. Three need `full`, `media` or `cover`; two also fit `half` |
| `srcDark` | image | Second screenshot that swaps in on dark |
| `cutout="none"` | | iOS only: frame without the island, when the screenshot already contains it. The Android notch is part of the frame |
| `ratio`, `focus` | e.g. `16 / 10`, `top right` | Crop the screenshot to a ratio and choose which part stays visible |

Removed with the new frames: the desktop window title and the Chrome `profile` label.

Tuning variables on `.mock` (never override outline, shadow or radius per mock): `--mock-zoom` (1.7), `--mock-m` (edge distance), `--mock-desktop-w`, `--mock-phone-h`, `--mock-phone-cut-w`, `--mock-element-w`, `--mock-element-radius`, `--mock-gap` (row), `--mock-radius`.

## Outline, shadow, radius (same on every mock)

Taken from the case-study page of the live site (`.is-content`, `.transparent-border`, `.transparent-shadow`), so a mock looks like the screenshots already on the site:

| Part | Value | Token |
|---|---|---|
| Outline | 1px `#34373d`, only on a dark window that has no stage behind it, so it does not dissolve into a dark page. Light windows and every mock on a stage have none. The stage must be passed as `stage` (or `--mock-stage` in the export spec) for the mock to know it is there | `--mock-outline` |
| Shadow | `0 0 40px rgba(0,0,0,.5)` | `--mock-shadow` = `--shadow-screenshot` |
| Radius, mocks | 12px on desktop, browser, frameless and UI element, at every size and zoom | `--mock-radius` = `--radius-m` |
| Radius, stage | 16px, the image area the mock sits in, so the corners nest | `--mock-stage-radius` = `--radius-l` |

Windows keep the site's 12px radius instead of the template's corner, so they match the other screenshots on the page. Phones have no hairline outline, because the frame image has its own rim; their shadow is the same shadow as a drop shadow that follows the phone's outline (`--mock-shadow-phone`). A frameless mock lets its outline and shadow fall outside the stage; the PNG export adds 60px of transparent margin for it.

## Screenshot edges

The frame clips the screenshot, so the screenshot must not bring its own edge:

- **`prep-shot.mjs`** trims transparent margins and baked-in shadows, fills rounded corners that were exported as transparent with the nearest edge colour, and flattens to opaque. It lives with the PNG exporter in the Claude project (`mocks/prep-shot.mjs`); run it once on a file before adding it to `src/assets/projects/<slug>/`: `node prep-shot.mjs in.png out.png`.
- **Baked-in bezel or border** (a screenshot taken from a device mock-up): crop it away first, or use `--inset N`.
- **Phones:** the screenshot sits under the frame, a few px larger than the screen opening, so its corners never need rounding.
- The image also overscans the frame by 1px per side, and the seam colour behind it is the outline colour, so a partly transparent edge pixel never shows as a light line.

## Rules
- Screenshots are exported without device frame and without background, at 2× or more. iOS 9:19.5, Android 9:18.5; other ratios are cropped to fill.
- The chrome theme matches the screenshot (light UI → light chrome).
- Crop the screenshot's own title bar or browser chrome, so every window shares one bar.
- Use Android screenshots in the Android frame; an iOS status bar under the notch looks wrong.
- Outline and shadow come from the template. Never bake a shadow, border or rounded corners into the screenshot.
- PNG export (not in this repo; `mocks/render.mjs` in the Claude project): `node render.mjs spec.json out/`. Mocks render at their site width (full/cover 1230, media 1020, half 600, third 390) and are scaled 2× (half and third 3×), so radius and hairline match the site. Override with `scale`.
