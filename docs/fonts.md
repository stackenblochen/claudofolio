# Fonts

- **Geist** is bundled through `@fontsource-variable/geist` (OFL), nothing to do here.
- **Clash Display** (Fontshare, free licence): `ClashDisplay-Semibold.woff2` (600, dark mode) and `ClashDisplay-Bold.woff2` (700, light mode) for the headlines; Regular (400) and Medium (500) stay declared for a quick switch. Weights are in `tokens.css`.
- **Telma** (Fontshare, free licence, upright): `Telma-Bold.woff2` (700) for the highlighted words in titles (`--font-highlight`), `Telma-Black.woff2` (900) for the W logo; Medium (500) and Light (300) stay declared. Enlarged by 10 % in `Base.astro` (`size-adjust`) to match Clash Display.
