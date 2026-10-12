# 05 — Diagrams, schemas and charts

Module ID **I10**, component `Diagram`. Every schema, chart or map that is neither a screenshot nor a mock sits in one frame: a stage on `--bg-secondary` with an optional headline and intro above, a caption and longer text below. What is drawn inside is a separate component:

| Content | Component | For |
|---|---|---|
| Live SVG | `Schema` + the parts in `src/components/schema/` | structures, processes, hierarchies, flows |
| Quadrant chart | `PositioningMap` (`src/components/charts/`) | where products sit on two axes, with an optional move arrow |
| Scales | `SpectrumStrips` (`src/components/charts/`) | one track per attribute, every product as a marker |

```astro
<Diagram title="Competitor analysis" caption="…" size="media" outline>
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
| `outline` | a 1 px outline in light mode (`--border-secondary`), none in dark mode |

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
| `SchemaPill` | Pill with a mono label. `variant="outline"` (line, sits in a group) or `"filled"` |
| `SchemaArrow` | Line through `points` with rounded corners (`r` = 24) and an open arrowhead at the last point. Two points = straight, 3–4 = elbow |
| `SchemaList` | Mono title plus `→` items (Geist) |

Coordinates come straight from the Figma frame (top-left of each box). To draw a new kind of schema (process, hierarchy, flow), compose the same parts; add a new part in `src/components/schema/` when a shape is missing.

## Colours (all from the theme tokens)

| Use | Token |
|---|---|
| Stage | `--bg-secondary` (the `Diagram` stage), optional 1 px `--border-secondary` outline in light mode |
| Group and filled pill | `--schema-surface` = `--bg-tertiary` (`--gray-800` / `--gray-75`) |
| Outline | `--border-strong` (`--gray-700` / `--gray-300`) |
| Text | `--text-strong`; list items `--text-default` |
| Arrows | `--accent-primary` |

Fonts: labels `--font-mono` (SF Mono where available, 500), lists `--font-sans`.

## Limits
- Text does not wrap: one `<text>` per line.
- The drawing scales like an image, so on phones the text gets small. Keep diagrams simple or use a taller size (`half`, `third`) when they have to be readable on mobile.
