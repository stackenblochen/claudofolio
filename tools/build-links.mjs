// Tracking short links for applications: hallo-wl.de/<slug> (one link per company, used everywhere), plus hallo-wl.de/public for the public CV.
// Usage: npm run links (also runs at the end of npm run build:release). Docs: docs/application-links.md
//
// Reads tools/application-links.json (git-ignored: the list of companies stays off GitHub; template: tools/application-links.example.json)
// and writes small redirect pages into the web root of the release:
//   release/<slug>/index.html     -> /portfolio/?utm_source=<slug>&utm_medium=link&utm_campaign=application
//   release/public/index.html     -> /portfolio/?utm_source=public&utm_medium=cv&utm_campaign=public-cv
// The site (Base.astro) turns utm_campaign=application into an Umami Distinct ID (<slug>), so all visits from that link show up as one profile.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'release');
const registry = join(root, 'tools', 'application-links.json');
const SITE = 'https://hallo-wl.de';
// Names that already exist (or may exist) in the web root, or that we use ourselves.
const RESERVED = new Set(['portfolio', 'public', 'cv', 'index', 'wordpress', 'wordpress5', 'wp-admin', 'wp-content', 'wp-includes', 'cgi-bin', 'assets', 'admin', 'test']);

const page = (target) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Wolfgang Lattermann</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta http-equiv="refresh" content="0; url=${target}">
  <script>location.replace(${JSON.stringify(target)} + location.hash);</script>
</head>
<body><p><a href="${target}">Continue to the portfolio</a></p></body>
</html>
`;
const target = (source, medium, campaign) =>
  `/portfolio/?utm_source=${encodeURIComponent(source)}&utm_medium=${medium}&utm_campaign=${campaign}`;
const write = (dir, html) => { mkdirSync(join(out, dir), { recursive: true }); writeFileSync(join(out, dir, 'index.html'), html); };

if (!existsSync(join(out, 'portfolio', 'index.html'))) {
  console.warn('Note: release/portfolio is missing; writing the link pages anyway. Run npm run build:release for a full release.');
}

write('public', page(target('public', 'cv', 'public-cv')));
console.log(`${SITE}/public  ->  public CV`);

let apps = [];
if (existsSync(registry)) {
  try { apps = JSON.parse(readFileSync(registry, 'utf8')).applications ?? []; }
  catch (e) { console.error(`tools/application-links.json is not valid JSON: ${e.message}`); process.exit(1); }
} else {
  console.log('No tools/application-links.json yet (copy tools/application-links.example.json). Only /public was written.');
}

const seen = new Set();
let bad = 0;
for (const a of apps) {
  const slug = String(a.slug ?? '').trim();
  const why = !/^[a-z0-9][a-z0-9-]{1,40}$/.test(slug) ? 'use 2–41 characters: a–z, 0–9 and -'
    : RESERVED.has(slug) ? 'reserved name' : seen.has(slug) ? 'used twice' : '';
  if (why) { console.error(`Skipped "${slug}": ${why}.`); bad++; continue; }
  seen.add(slug);
  write(slug, page(target(slug, 'link', 'application')));
  console.log(`${SITE}/${slug}  ->  ${a.company ?? slug}${a.role ? `, ${a.role}` : ''}`);
}
console.log(`\nUpload the folders listed above from release/ into the web root (next to portfolio/).`);
if (bad) process.exit(1);
