// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Two targets from one codebase:
//  - default: GitHub Pages preview (every push to main)
//  - SITE_TARGET=production: hallo-wl.de/portfolio/ (manual release, see .github/workflows/release.yml);
//    the build goes to release/portfolio, release/index.html forwards the domain root to it
const production = process.env.SITE_TARGET === 'production';

// https://astro.build/config
export default defineConfig({
    site: production ? 'https://hallo-wl.de' : 'https://stackenblochen.github.io',
    base: production ? '/portfolio' : '/claudofolio',
    outDir: production ? './release/portfolio' : './dist',
    integrations: [mdx()],
});
