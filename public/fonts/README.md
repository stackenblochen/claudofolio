# Fonts

- **Geist** is bundled through `@fontsource-variable/geist` (OFL), nothing to do here.
- **Editorial New Ultrabold** is licensed (Pangram Pangram). Check that your licence covers web use, convert the
  font to woff2 and save it as `public/fonts/EditorialNew-Ultrabold.woff2`. `Base.astro` declares the
  `@font-face` automatically once the file exists; until then titles fall back to a system serif.
