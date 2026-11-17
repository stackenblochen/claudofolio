# Handoff: application links, open setup steps (2026-11-16)

Set up in a Claude chat session; the code is in place but was not built or committed there (the sandbox cannot run the macOS node_modules). Do these once, then delete this file and its mention in AGENTS.md.

## What changed (uncommitted)

- `tools/build-links.mjs` (new): writes the redirect pages `release/<slug>/` (plus the legacy `release/<slug>/cv/`, forwarding like `/<slug>`) and `release/public/`. Tested on its own.
- `tools/application-links.example.json` (new), `tools/application-links.json` added to `.gitignore`.
- `package.json`: `npm run links`; `build:release` runs it at the end.
- `src/layouts/Base.astro`: inline script before the Umami tag (live build only) that turns `utm_campaign=application` into `umami.identify(<slug>, { via })` and sends it for that visit only (nothing stored in the browser). Tested on its own in Node.
- `SiteFooter.astro`, `ContactBlock.astro`: `data-umami-event` (`CV download`, `Email click`, `LinkedIn click`) with `data-umami-event-where`.
- `Protected.astro`: `umami.track('Case study unlocked', { page })` after a successful password entry.
- Docs: `docs/application-links.md`, pointers in `AGENTS.md` and `docs/README.md`.

## Open steps

1. Run the dev server and the release build (see AGENTS.md, "Release it"); check that it builds without errors and that `release/public/index.html` exists.
2. Check in `release/portfolio/index.html` that the identify script sits before the Umami script tag (needs `UMAMI_WEBSITE_ID` in `.env`).
3. Ask Wolfgang whether to commit and push (do not push unasked).
4. Tell him to upload the release including the new `release/public/` folder.
5. After upload: he opens `hallo-wl.de/public` once to check the redirect. For the identify part, a throwaway slug (`npm run links` with a test entry, upload, open in a private window, then check Umami Sessions for the slug; remove the test entry afterwards).
6. Remind him: the public CV PDF (`public/cv/wolfgang-lattermann-cv.pdf`) still links to `https://hallo-wl.de/`; its source must be changed to `https://hallo-wl.de/public` and exported again, then the PDF replaced in `public/cv/`.
7. The privacy page exists at `/privacy/` (German, linked in the footer). Wolfgang must check the placeholders marked in `src/pages/privacy.astro` (hosting provider, Umami data location) before going live.
