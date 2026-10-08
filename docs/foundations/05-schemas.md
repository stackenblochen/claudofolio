# 05 — Schemas (diagrams as live SVG)

Module ID **I10**, component `Schema` plus the parts in `src/components/schema/`. Use it for structures, processes, hierarchies and flows. Text, lines and shapes are real SVG, so they follow dark and light mode and stay sharp. Do not use a transparent PNG for these: baked-in text and line colours vanish on the wrong theme. (A transparent PNG is fine for content that brings its own surface, e.g. a UI screenshot.)

```astro
<Schema size="media" width={1400} height={810} alt="Diagram: …">
  <SchemaGroup x={185} y={113} w={496} h={400} />
  <SchemaPill variant="outline" x={229} y={157} w={409} h={74} label="Code library" />
  <SchemaArrow points={[[433, 270], [433, 239]]} />
  <SchemaArrow points={[[239, 615], [239, 568], [408, 568], [408, 522]]} />
  <SchemaList x={813} y={152} title="Wire Design System" items={['Wire Colors', 'Wire Fonts']} />
</Schema>
```

| Part | What it draws |
|---|---|
| `Schema` | The frame. Same `size` options, 16 px stage radius, ratios and grid placement as `Mock` (full / media 3:2, cover 16:10, half 1:1, third 3:4). `width` × `height` = the Figma frame; the drawing is scaled to fit and centred. `alt` is required (the drawing is one image for screen readers) |
| `SchemaGroup` | Rounded container (`x y w h`, radius `r` = 44) |
| `SchemaPill` | Pill with a mono label. `variant="outline"` (line, sits in a group) or `"filled"` |
| `SchemaArrow` | Line through `points` with rounded corners (`r` = 24) and an open arrowhead at the last point. Two points = straight, 3–4 = elbow |
| `SchemaList` | Mono title plus `→` items (Geist) |

Coordinates come straight from the Figma frame (top-left of each box). To draw a new kind of schema (process, hierarchy, flow), compose the same parts; add a new part in `src/components/schema/` when a shape is missing.

## Colours (all from the theme tokens)

| Use | Token |
|---|---|
| Stage | `--bg-raised` |
| Group and filled pill | `--schema-surface` = `--bg-surface` (`--gray-800` / `--gray-200`) |
| Outline | `--border-strong` (`--gray-700` / `--gray-300`) |
| Text | `--text-strong`; list items `--text-default` |
| Arrows | `--accent-primary` |

Fonts: labels `--font-mono` (SF Mono where available, 500), lists `--font-sans`.

## Limits
- Text does not wrap: one `<text>` per line.
- The drawing scales like an image, so on phones the text gets small. Keep diagrams simple or use a taller size (`half`, `third`) when they have to be readable on mobile.
