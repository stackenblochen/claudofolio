# Design system foundations

The rules for building this portfolio. Values live in code (`src/styles/tokens.css`, `src/styles/base.css`); these files say how to use them.

| File | What it is |
|---|---|
| `01-styleguide.md` | Themes, breakpoints, grid, colour, gradients, type roles (incl. highlighted title words), spacing, shape and elevation, links and interaction, chrome, motion, graphic devices |
| `02-modules.md` | Inventory of the content modules with anatomy, grid spans, responsive behaviour and the Astro component for each (including the home stage and doodle stack) |
| `03-page-rules.md` | Rules for new pages: project structure, content schema, templates (case study, design vision, home, about), writing, asset, layout, responsive and a11y rules, a definition of done, and a briefing template |
| `04-mocks.md` | Device frames for screenshots (`Mock`): options, frames, outline and shadow rules |
| `05-schemas.md` | Diagrams as live SVG (`Schema`): parts, colours, limits |

The live reference is the `/styleguide` page (`src/pages/styleguide.astro`).
