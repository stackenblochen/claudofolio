/**
 * Background gradient vocabulary. One definition drives the CSS tokens/classes (injected by Base.astro via
 * gradientCss()) and the styleguide, so the two cannot drift apart.
 *
 * A gradient is named  <intensity>-<tonality>,  e.g. "soft-yellow" or "active-blue":
 *   intensity: soft (quiet, almost neutral) · calm (muted, the original look) · active (saturated, fresh)
 *   tonality:  the dominant hue family: yellow · salmon · violet · blue · green · gray (cool, barely tinted)
 * Moods are short names for a few curated picks (morning, day, sundown, dusk, night, meadow, fog, slate, graphite, haze).
 * Shapes: the default is linear (top to bottom). Radial shapes (orb, bloom, horizon, halo) use the same two colours as
 * off-centre circles and ovals: the lighter colour (the bottom stop of the linear gradient) glows in the centre, the top stop is the far edge.
 *
 * Use in markup:   class="gradient gradient--active-blue"   or   class="gradient gradient--sundown"
 *                  class="gradient gradient--active-blue gradient--orb"   (a shape on top)
 * Use in CSS:      background: linear-gradient(180deg, var(--gradient-active-blue-top), var(--gradient-active-blue-bottom))
 * Every gradient has a dark and a light value (light-dark()). Text on top uses --text-strong.
 * Contrast: dark values keep white text at >= 3.2:1 over the whole gradient, light values keep black text well above 4.5:1.
 */

export const INTENSITIES = ['soft', 'calm', 'active'] as const;
export type Intensity = (typeof INTENSITIES)[number];

export const INTENSITY_NOTES: Record<Intensity, string> = {
  soft: 'Quiet and airy. Dark: deep, barely tinted. Light: a whisper of colour, just off the light page background. For large calm surfaces.',
  calm: 'Muted, the original look of the home stage. Balanced in both themes.',
  active: 'Saturated and fresh. Dark: strong but still readable under white text. Light: clear, bright pastels. For hero moments, use sparingly.',
};

/** Dominant hue family with its partner hue for the bottom of the gradient (degrees on the HSL wheel). `sat` scales the saturation (gray is nearly neutral), `darkL` lowers the dark lightness (calm and active only). */
export const TONALITIES: Record<string, { label: string; top: number; bottom: number; sat?: number; darkL?: number }> = {
  yellow: { label: 'Yellow', top: 46, bottom: 12 }, // yellow into salmon
  salmon: { label: 'Salmon', top: 8, bottom: 322 }, // salmon into mauve
  violet: { label: 'Violet', top: 264, bottom: 338 }, // violet into rose
  blue: { label: 'Blue', top: 214, bottom: 258 }, // sky blue into periwinkle
  green: { label: 'Green', top: 168, bottom: 118 }, // teal into fresh green
  gray: { label: 'Gray', top: 240, bottom: 232, sat: 0.14, darkL: 18 }, // cool gray, barely tinted; a little darker than the colours in dark mode
};
export type Tonality = string;
export const TONALITY_IDS: Tonality[] = Object.keys(TONALITIES);

/** Curated, named picks. Say "add the sundown gradient" or "a soft gradient with a yellowish tonality". */
export const MOODS: { name: string; id: string; note: string }[] = [
  { name: 'morning', id: 'soft-yellow', note: 'Cream into blush. Light, friendly openings.' },
  { name: 'day', id: 'soft-blue', note: 'Open sky. Calm backdrop for reading.' },
  { name: 'meadow', id: 'calm-green', note: 'Teal into green. Fresh but quiet.' },
  { name: 'dusk', id: 'calm-violet', note: 'Violet into rose. Soft evening.' },
  { name: 'sundown', id: 'active-salmon', note: 'Salmon into mauve. The warm, loud one.' },
  { name: 'night', id: 'active-blue', note: 'Deep blue into periwinkle. Strong and cool.' },
  { name: 'fog', id: 'soft-gray', note: 'Pale cool gray. A neutral, quiet backdrop.' },
  { name: 'slate', id: 'calm-gray', note: 'Mid cool gray. Neutral, with some weight.' },
  { name: 'graphite', id: 'active-gray', note: 'The strongest gray. Dark and dense.' },
  { name: 'haze', id: 'faint-gray', note: 'Dark: just above the card colour, light enough for dark mocks. Light: the same pale gray as fog.' },
];

/**
 * Shapes beyond the linear default: off-centre circles and ovals (CSS radial gradients) over the same two colours.
 * The lighter colour (the bottom stop of the linear gradient) sits in the centre of the shape, the top stop at the far edge.
 */
export const SHAPES: Record<string, { label: string; note: string; css: (top: string, bottom: string) => string }> = {
  orb: { label: 'Orb', note: 'A circle, light source at the upper left.', css: (t, b) => `radial-gradient(circle at 22% 26%, ${b}, ${t})` },
  bloom: { label: 'Bloom', note: 'A wide oval, light source at the upper right.', css: (t, b) => `radial-gradient(ellipse at 80% 18%, ${b}, ${t})` },
  horizon: { label: 'Horizon', note: 'A flat oval rising from the lower left.', css: (t, b) => `radial-gradient(ellipse 130% 85% at 30% 108%, ${b}, ${t})` },
  halo: { label: 'Halo', note: 'A tall oval, light source at the right.', css: (t, b) => `radial-gradient(ellipse 80% 120% at 88% 70%, ${b}, ${t})` },
};
export const SHAPE_IDS = Object.keys(SHAPES);

/** CSS background for a gradient id, optionally in a shape (default: linear top to bottom). Uses the theme-aware tokens. */
export const gradientBackground = (id: string, shape?: string) => {
  const t = `var(--gradient-${id}-top)`, b = `var(--gradient-${id}-bottom)`;
  return shape && SHAPES[shape] ? SHAPES[shape].css(t, b) : `linear-gradient(180deg, ${t}, ${b})`;
};

// [saturation %, lightness %] for the top and the bottom stop
type Stops = [[number, number], [number, number]];
const RECIPE: Record<'dark' | 'light', Record<Intensity, Stops>> = {
  dark: {
    soft: [[24, 26], [26, 36]],
    calm: [[32, 45], [37, 56]],
    active: [[62, 40], [56, 52]],
  },
  light: {
    soft: [[64, 91], [72, 94]], // a touch darker than white, so it reads on the grouped light page (#f5f5f7)
    calm: [[55, 82], [75, 89]],
    active: [[92, 68], [90, 78]],
  },
};

// ---- colour maths
type RGB = [number, number, number];
const hslToRgb = (h: number, s: number, l: number): RGB => {
  const sat = s / 100, lt = l / 100, k = (n: number) => (n + h / 30) % 12, a = sat * Math.min(lt, 1 - lt);
  return [0, 8, 4].map((n) => 255 * (lt - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1)))) as RGB;
};
const luminance = (rgb: RGB) => {
  const [r, g, b] = rgb.map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrastWithWhite = (rgb: RGB) => 1.05 / (luminance(rgb) + 0.05);
const toHex = (rgb: RGB) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Dark stops: lower the lightness a little at a time until white text stays readable over top, middle and bottom. */
function darkPair(intensity: Intensity, topHue: number, bottomHue: number, sat = 1, darkL = 0): [string, string] {
  const [[ts0, tl], [bs0, bl]] = RECIPE.dark[intensity];
  const ts = ts0 * sat, bs = bs0 * sat;
  let dl = intensity === 'soft' ? 0 : darkL;
  for (; dl < 24 + darkL; dl++) {
    const t = hslToRgb(topHue, ts, tl - dl), b = hslToRgb(bottomHue, bs, bl - dl);
    const mid = t.map((v, i) => (v + b[i]) / 2) as RGB;
    if (intensity === 'soft' || Math.min(contrastWithWhite(t), contrastWithWhite(mid), contrastWithWhite(b)) >= 3.2) break;
  }
  return [toHex(hslToRgb(topHue, ts, tl - dl)), toHex(hslToRgb(bottomHue, bs, bl - dl))];
}
const lightPair = (intensity: Intensity, topHue: number, bottomHue: number, sat = 1): [string, string] => {
  const [[ts0, tl], [bs0, bl]] = RECIPE.light[intensity];
  const ts = ts0 * sat, bs = bs0 * sat;
  return [toHex(hslToRgb(topHue, ts, tl)), toHex(hslToRgb(bottomHue, bs, bl))];
};

export interface GradientDef {
  id: string;
  intensity: Intensity;
  tonality: Tonality;
  dark: [string, string];
  light: [string, string];
}

/**
 * Gradients with fixed values, outside the intensity × tonality matrix. `faint-gray` (mood "haze"): in dark mode a gradient that starts just above
 * the card colour (--bg-secondary, gray-900) and rises to the dark border colour (gray-700), light enough for dark mocks to stand out; in light mode the same pale cool gray as `soft-gray` (fog).
 */
const FIXED: GradientDef[] = [];
export const GRADIENTS: GradientDef[] = INTENSITIES.flatMap((intensity) =>
  TONALITY_IDS.map((tonality) => {
    const { top, bottom, sat, darkL } = TONALITIES[tonality];
    return {
      id: `${intensity}-${tonality}`,
      intensity,
      tonality,
      dark: darkPair(intensity, top, bottom, sat, darkL),
      light: lightPair(intensity, top, bottom, sat),
    };
  }),
);

FIXED.push({
  id: 'faint-gray',
  intensity: 'soft',
  tonality: 'gray',
  dark: ['#222329', '#34373d'],
  light: GRADIENTS.find((g) => g.id === 'soft-gray')!.light,
});

/** Every gradient: the matrix plus the fixed ones. */
export const ALL_GRADIENTS: GradientDef[] = [...GRADIENTS, ...FIXED];
export const gradientById = (id: string) => ALL_GRADIENTS.find((g) => g.id === id)!;

/** CSS for all gradients: custom properties (theme aware) and the classes .gradient, .gradient--<id>, .gradient--<mood>. */
export function gradientCss(): string {
  const vars = ALL_GRADIENTS.map(
    (g) =>
      `--gradient-${g.id}-top:light-dark(${g.light[0]},${g.dark[0]});--gradient-${g.id}-bottom:light-dark(${g.light[1]},${g.dark[1]});`,
  ).join('');
  const classes = ALL_GRADIENTS.map(
    (g) => `.gradient--${g.id}{--g-top:var(--gradient-${g.id}-top);--g-bottom:var(--gradient-${g.id}-bottom)}`,
  ).join('');
  const moods = MOODS.map(
    (m) => `.gradient--${m.name}{--g-top:var(--gradient-${m.id}-top);--g-bottom:var(--gradient-${m.id}-bottom)}`,
  ).join('');
  const shapes = SHAPE_IDS.map((n) => `.gradient--${n}{background:${SHAPES[n].css('var(--g-top)', 'var(--g-bottom)')}}`).join('');
  return `:root{${vars}}.gradient{background:linear-gradient(var(--g-angle,180deg),var(--g-top),var(--g-bottom))}${classes}${moods}${shapes}`;
}
