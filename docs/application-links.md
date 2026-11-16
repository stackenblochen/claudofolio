# Application links (tracking who looked at the portfolio)

Every application gets its own short link, so Umami can show which company visited, when, which pages they opened and for how long.
Read this before you write a CV, a cover letter or an application for a specific company.

## The links

| Where the link goes | Link to use | What Umami records |
|---|---|---|
| Everything for company X: application form, cover letter, the CV PDF, email, LinkedIn message | `hallo-wl.de/<slug>` | `utm_source=<slug>`, `utm_medium=link`, Distinct ID `<slug>` |
| The public CV (`public/cv/wolfgang-lattermann-cv.pdf`, downloadable on the site) | `hallo-wl.de/public` | `utm_source=public`, `utm_campaign=public-cv`, no Distinct ID |

Never put the bare `hallo-wl.de` or `hallo-wl.de/portfolio` into an application or a CV: those visits cannot be matched to a company.
Write the link without `https://` in the visible text if space is tight; the PDF link target should be the full `https://hallo-wl.de/<slug>`.
There is no `/<slug>/cv` path any more. The build no longer writes a `cv` folder. Folders already on the server (older applications) stay there, because the upload never deletes.

## Choosing the slug

- The company name, lower case, words joined with `-`: `acme`, `big-bank`. 2–41 characters, `a–z`, `0–9`, `-`.
- Second application to the same company: add the role or year, `acme-staff`, `acme-2027`.
- Reserved (the script refuses them): `portfolio`, `public`, `cv`, `index`, `wordpress`, `wordpress5`, `wp-*`, `cgi-bin`, `assets`, `admin`, `test`.
- Optional: a short suffix (`acme-k7`) makes it harder for someone at one company to guess the links of others (a working `/othercompany` reveals that Wolfgang applied there).

## Who does what

Two places work on applications, each with its own part:

- **CV project** (a separate claude.ai Project that writes and updates the CVs and cover letters; it has no access to this repository). It picks the slug, puts the links into the CV and the letter, and gives Wolfgang a ready-made JSON entry. Its brief is `docs/cv-project-brief.md`; when the rules here change, update that brief and tell Wolfgang to replace it in the CV project.
- **Claude Code in this repository** (has the local and the live site). It registers the slug, builds the redirect pages and tells Wolfgang what to upload.

## Adding an application (Claude Code, steps)

Wolfgang brings the JSON entry from the CV project ("register this application link" or similar).

1. Add the entry to `tools/application-links.json` (git-ignored, so the company list never reaches GitHub; if the file does not exist, copy `tools/application-links.example.json` and replace the example entry):
   ```json
   { "slug": "acme", "company": "Acme GmbH", "role": "Staff Product Designer", "applied": "2026-11-16", "channel": "Application form", "notes": "" }
   ```
   Check the slug against the rules above. If it is taken or reserved, suggest a new one and tell Wolfgang that the CV and letter must use the new one.
2. Run `npm run links`. It writes `release/acme/index.html` and prints the URL. (A full `npm run build:release` runs it too.)
3. Tell Wolfgang to upload the folder `release/acme/` into the web root of hallo-wl.de, next to `portfolio/`. Nothing else needs to be uploaded. You cannot upload.
4. After the upload, ask him to open `hallo-wl.de/acme` once in a private window to check that it lands on the portfolio, then close that window (the visit counts as Acme otherwise; a throwaway slug is the cleaner test).

No commit is needed for a new application: the registry is git-ignored and the redirect pages live only in `release/`.

## How it works

- `tools/build-links.mjs` writes tiny redirect pages into the web root of the release. They forward to `/portfolio/?utm_source=<slug>&utm_medium=link&utm_campaign=application`.
- `src/layouts/Base.astro` (live build only, next to the Umami script) reads `utm_campaign=application` and calls `umami.identify(<slug>, { via })` for that visit. Nothing is stored in the browser (no cookie, no localStorage), so no consent banner is needed. Later visits of the same person without the link are not matched to the company.
- Click events: `CV download`, `Email click`, `LinkedIn click` (property `where`: `footer` or `contact`), and `Case study unlocked` (property `page`) when someone enters the case study password.

## Reading it in Umami

- **Sessions** → search for the slug: every visit, with pages, events, times and duration. Opening one session shows the combined timeline of all sessions with that Distinct ID (visits that came through the link).
- **Filters** → `UTM source = acme`; `UTM campaign = public-cv` for the public CV.
- **Events** → who downloaded the CV or unlocked a case study.

## Limits

- One slug = one company, not one person: the recruiter and the hiring manager look alike, and forwarded links count for the same company.
- Opening the PDF is not tracked, only clicking a link in it.
- Link previews and ATS checkers create visits seconds after applying (one page, a few seconds, often no JavaScript). Ignore those.
- Visitors with ad blockers or "Do Not Track" are not counted.
- Privacy: tying visits to a company can make them personal data under the GDPR. The notice is at `/privacy/` (`src/pages/privacy.astro`); update it when tracking changes (a stored identifier would need consent).
