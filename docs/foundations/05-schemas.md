# 05 — Diagrams, schemas and charts

Module ID **I10**, component `Diagram`. Every schema, chart or map that is neither a screenshot nor a mock sits in one frame: a stage on `--bg-secondary` with an optional headline and intro above, a caption and longer text below. What is drawn inside is a separate component:

| Content | Component | For |
|---|---|---|
| Live SVG | `Schema` + the parts in `src/components/schema/` | structures, processes, hierarchies, flows |
| Quadrant chart | `PositioningMap` (`src/components/charts/`) | where products sit on two axes, with an optional move arrow |
| Scales | `SpectrumStrips` (`src/components/charts/`) | one track per attribute, every product as a marker |

```astro
<Diagram title="Competitor analysis" caption="…" size="media" border="light-mode">
  <p slot="intro">Text above the drawing.</p>
  <PositioningMap alt="…" … />
  <Fragment slot="text"><p>Longer text below the drawing.</p></Fragment>
</Diagram>
```

| `Diagram` prop / slot | |
|---|---|
| `size` | `full`, `media` (default), `cover`, `half`, `third`: same measures and grid placement as `Mock` |
| `title` | `h3` `.t-subheading` above the stage (text measure) |
| `intro` slot | text under the headline |
| `caption` | one line under the stage |
| `text` slot | longer text under the stage (text measure) |
| `fixed` | the stage takes the aspect ratio of its size (media 3:2, cover 16:10, half 1:1, third 3:4) and the drawing fills it; use for `Schema`. Without it the stage hugs the drawing with padding |
| `ratio` | with `fixed`: a CSS aspect ratio instead of the size's own, e.g. `"1 / 1"` for a square drawing at media width (give `Schema` the same proportions) |
| `border` | a 1 px edge on the stage: `true` = both themes, `"dark-mode"` / `"light-mode"` = only in that mode, none by default |

Diagrams stacked one after the other get extra space between them. Drawings scale with the stage width (container `diagram`, reference width 995 px).

## Schema (live SVG)

Use it for structures, processes, hierarchies and flows. Text, lines and shapes are real SVG, so they follow dark and light mode and stay sharp. Do not use a transparent PNG for these: baked-in text and line colours vanish on the wrong theme. (A transparent PNG is fine for content that brings its own surface, e.g. a UI screenshot.)

```astro
<Diagram size="media" fixed>
  <Schema width={1400} height={810} alt="Diagram: …">
    <SchemaGroup x={185} y={113} w={496} h={400} />
    <SchemaPill variant="outline" x={229} y={157} w={409} h={74} label="Code library" />
    <SchemaArrow points={[[433, 270], [433, 239]]} />
    <SchemaArrow points={[[239, 615], [239, 568], [408, 568], [408, 522]]} />
    <SchemaList x={813} y={152} title="Wire Design System" items={['Wire Colors', 'Wire Fonts']} />
  </Schema>
</Diagram>
```

| Part | What it draws |
|---|---|
| `Schema` | The SVG canvas inside a `fixed` `Diagram`. `width` × `height` = the Figma frame; the drawing is scaled to fit and centred. `alt` is required (the drawing is one image for screen readers) |
| `SchemaGroup` | Rounded container (`x y w h`, radius `r` = 44) |
| `SchemaPill` | Pill with a mono label. `variant="outline"` (line, sits in a group), `"filled"`, `"accent"` (salmon fill with dark text, for the few entries the story is about) or `"quiet"` (line with dimmed text, for the least important ones) |
| `SchemaArrow` | Line through `points` with rounded corners (`r` = 24) and an open arrowhead at the last point. Two points = straight, 3–4 = elbow. `dotted`: a dotted line (2.5 px dots) with a thinner solid head (1.5 px), for a secondary link such as a page that leads back into the navigation |
| `SchemaList` | Mono title plus `→` items (Geist) |

Coordinates come straight from the Figma frame (top-left of each box). To draw a new kind of schema (process, hierarchy, flow), compose the same parts; add a new part in `src/components/schema/` when a shape is missing.

## Colours (all from the theme tokens)

| Use | Token |
|---|---|
| Stage | `--bg-secondary` (the `Diagram` stage), optional 1 px `border` |
| Group and filled pill | `--schema-surface` = `--bg-tertiary` (`--gray-800` / `--gray-75`) |
| Outline | `--border` (`--gray-700` / `--gray-200`) |
| Text | `--text-strong`; list items `--text-default` |
| Arrows | `--accent-primary` |

Fonts: labels `--font-mono` (SF Mono where available, 500), lists `--font-sans`.

## Style rules for new diagrams

Fixed by the parts, so a new diagram looks like the existing ones. Draw at the same scale, never enlarge type or lines to fill space.

**Scale.** The parts are sized for a canvas 1400 px wide shown at media width (970 px), so type renders at about 18 px. A diagram that needs more room gets a bigger canvas and a wider stage, not bigger type: the stage wraps the drawing: size the `Schema` canvas as content plus the margin on every side and give `Diagram` the same proportions (`ratio="1467 / 1102"` for `Schema width={1467} height={1102}`), so there is no empty band above or below. Square only when the brief asks for it. Use `size="full"` with a larger canvas only for a drawing that needs more room. Type: pill labels mono 500 at 26.244 (default `size`, do not set it), list title mono 24, list items sans 23 with `→`.

**Lines.** Outline pill 3 px inside the box; arrows 2 px, corner radius 24, open arrowhead 12 px. An arrow runs at least 48 px between corners and at least 36 px after the last corner, so the head never sits on a curve (elbow arrows: 50 px or more per segment). Arrows leave and enter at pill edges, never inside a pill.

**Pills.** Height 74 (68 for small ones). Width follows the label: `chars × 15.75 + 72`, i.e. at least 36 px of space left and right of the text. Pills need not share one size: sub pages (second level and below, and the pills inside a group) are smaller than the main pages: label `size={22}`, height 64, width `chars × 13.2 + 48`. Fill: filled for the top levels, outline for pages and leaves and for everything inside a group.

**Space.** Keep about 9 % of the canvas free on all four sides (125 px at 1400, 160 px at 1800) and put the drawing in the centre, balanced left/right and top/bottom. Group radius 44, padding inside a group 30–40.

**Trees and sitemaps.** Flow top to bottom with the root centred at the top; the first level is a single row and mirrors the order of the main navigation. Elbow arrows (down, across, down) from the parent's bottom centre to each child's top centre; a single child sits straight below (vertical arrow). A parent with several children or with page sections uses a file-tree stack: a spine 20 px inside the parent's left edge, children indented 60 px, one elbow arrow per child. Other gaps between elements (between levels, between a column and its neighbour, between main pages) are 48 px; the arrow from the parent to a child row is 96 px (48 + 48) so its elbow and head have room. Stacked sub pages are 32 px apart (the gap between two pills); the gap to a pill that follows an arrow (e.g. the last step of a flow) is about 72 px. Page sections are a `SchemaList` without title under the pill (`y` = pill y + 39); next to a spine start the list 50 px in. Things that are not part of the tree (emails, entry points) are not connected to it: list them as text, or put them in their own `SchemaGroup`.

**Text.** Short English labels, one line, no wrapping. Name pages like the main navigation does (Shop, Voting, Regional, Orders, Profile).

## Limits
- Text does not wrap: one `<text>` per line.
- The drawing scales like an image, so on phones the text gets small. Keep diagrams simple or use a taller size (`half`, `third`) when they have to be readable on mobile.
