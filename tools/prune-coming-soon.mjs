// After the release build: remove the images of "coming soon" case studies (frontmatter `comingSoon: true`) from the build.
// Their pages are only a placeholder in the release, but Astro still copies every image the MDX files import into _astro/.
// An image stays when a page of the build links to it (the teaser and cover images) or when a case study that is built in full imports it too.
// Usage: node tools/prune-coming-soon.mjs release/portfolio
import { readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join, basename, extname } from 'node:path';

const out = process.argv[2] ?? 'release/portfolio';
const projects = 'src/content/projects';

const stems = (mdx) => [...mdx.matchAll(/from\s+['"][^'"]*assets\/([^'"]+)['"]/g)].map((m) => basename(m[1], extname(m[1])));
const soon = new Set();
const full = new Set();
for (const f of readdirSync(projects).filter((f) => /\.mdx?$/.test(f) && !f.startsWith('_'))) {
  const text = readFileSync(join(projects, f), 'utf8');
  const frontmatter = text.split('\n---')[0];
  const isSoon = /^comingSoon:\s*true/m.test(frontmatter);
  const hidden = /^status:\s*(hidden|local|staging)/m.test(frontmatter); // not part of the release anyway
  for (const s of stems(text)) (isSoon ? soon : hidden ? new Set() : full).add(s);
}
const candidates = [...soon].filter((s) => !full.has(s));

const html = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) html.push(readFileSync(p, 'utf8'));
  }
};
walk(out);
const pages = html.join('\n');

const assets = join(out, '_astro');
let removed = 0;
for (const name of readdirSync(assets)) {
  if (!candidates.some((s) => name.startsWith(`${s}.`))) continue;
  if (pages.includes(name)) continue; // linked from a page (teaser, cover)
  rmSync(join(assets, name));
  removed++;
}
console.log(`prune-coming-soon: removed ${removed} files of ${soon.size} coming-soon assets from ${assets}`);
