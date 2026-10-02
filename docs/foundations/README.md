# Portfolio rebuild: foundations

Extracted from hallo-wl.de/wordpress5 (WordPress + Semplice) on 1 Oct 2026, as preparation for an Astro rebuild.

| File | What it is |
|---|---|
| `01-analysis.md` | Page-by-page analysis of Home, both case studies and About, with strengths, gaps, inconsistencies, typos and accessibility notes |
| `02-styleguide.md` | All existing styles (breakpoints, grid, colour, type, spacing, radius, shadows, motion, graphic devices), as-is with ⚠ flags and → proposals |
| `tokens/tokens.css` | CSS custom properties, ready to drop into `src/styles/` |
| `tokens/tokens.json` | The same tokens in W3C design-token format, plus the as-is type scale |
| `03-modules.md` | Inventory of 26 content modules with anatomy, grid spans and per-breakpoint behaviour, mapped to Astro component names |
| `04-page-rules.md` | Rules for new pages: Astro structure, content schema, templates (case study, design-vision case, home, about), writing, asset, layout, responsive and a11y rules, a definition of done, and a briefing template |
| `raw/` | Raw extraction notes per page (values straight from the generated CSS) |
