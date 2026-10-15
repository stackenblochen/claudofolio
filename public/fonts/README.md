# Fonts

- **Geist** is bundled through `@fontsource-variable/geist` (OFL), nothing to do here.
- **Editorial New Ultrabold** is licensed (Pangram Pangram). Check that your licence covers web use, convert the
  font to woff2 and save it as `public/fonts/EditorialNew-Ultrabold.woff2`. `Base.astro` declares the
  `@font-face` automatically once the file exists; until then titles fall back to a system serif.
- **Clash Display** (Fontshare, free licence): `ClashDisplay-Semibold.woff2` (600) for the headlines; the Regular (400), Medium (500) and Bold (700) files stay declared for a quick switch.
- **Editorial New Ultralight Italic** (200, `EditorialNew-UltralightItalic.woff2`) is the face of the highlighted words in titles now; **Italic** (400, `EditorialNew-Italic.woff2`) and **Ultrabold Italic** (800) stay for a quick switch. Both new files were converted from your `.otf` files.
- **Telma** (Fontshare, free licence, upright): `Telma-Bold.woff2` (700) is the current trial for the highlighted words; `Telma-Medium.woff2` (500) and `Telma-Light.woff2` (300) stay declared; Editorial New (Ultralight Italic 200, Italic 400, Ultrabold Italic 800) is the fallback and the earlier face.
- **Telma Black** (`Telma-Black.woff2`, 900) draws the W logo in the navigation (a trial; `logoStyle` in SiteHeader.astro).
