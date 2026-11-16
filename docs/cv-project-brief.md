# Brief for the CV project: tracking links in every application

Add this file to the knowledge of the CV project. It applies whenever you write or update a CV, a cover letter or an application text for a specific company.

## Why

Wolfgang's portfolio (hallo-wl.de) uses Umami analytics. Each application gets its own short link, so he can see which company opened the portfolio, when, which case studies they read and for how long. That only works if every link in the application documents is the company's own link.

## The rule

For an application to company X with the slug `<slug>`:

| Where | Link |
|---|---|
| CV PDF made for company X: every link to the portfolio (header, contact line, footer) | `hallo-wl.de/<slug>/cv` (link target `https://hallo-wl.de/<slug>/cv`) |
| Cover letter, application form, email, LinkedIn message | `hallo-wl.de/<slug>` (link target `https://hallo-wl.de/<slug>`) |
| The general public CV (not made for one company) | `hallo-wl.de/public` |

- Never use the bare `hallo-wl.de` or `hallo-wl.de/portfolio` in a company-specific CV or letter.
- When you update an existing CV for a new company, replace every portfolio link; an old slug left in the PDF sends the visits to the wrong company.
- Links to LinkedIn or email stay as they are; only portfolio links change.

## Choosing the slug

- Company name, lower case, words joined with `-`: `acme`, `big-bank`. 2 to 41 characters: `a–z`, `0–9`, `-`.
- Second application to the same company: add the role or year: `acme-staff`, `acme-2027`.
- Not allowed (reserved): `portfolio`, `public`, `cv`, `index`, `wordpress`, `wordpress5`, names starting with `wp-`, `cgi-bin`, `assets`, `admin`, `test`.
- Optional: Wolfgang may want a short suffix (`acme-k7`) so people at one company cannot guess the links of others. Ask once per application if he has not said.

## What to hand back with every company-specific CV

At the end, give Wolfgang this block, filled in, so he can pass it to Claude Code in the portfolio repository, which registers the link and builds it:

```
Register this application link (docs/application-links.md):
{ "slug": "acme", "company": "Acme GmbH", "role": "Staff Product Designer", "applied": "2026-11-16", "channel": "Application form", "notes": "" }
```

`applied` is the date of the application (ask if unknown, otherwise today), `channel` is where the application goes (form, email, referral, recruiter …).

Remind him that the link only works after Claude Code has built it and he has uploaded the folder `release/<slug>/` to hallo-wl.de. He should send the application after that, or at least the same day.

## What you do not need to do

You do not build or upload anything and you have no access to the portfolio code. If the slug turns out to be taken, Claude Code suggests another one, and the CV and letter must then be updated to match.
