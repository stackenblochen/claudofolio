/**
 * Background gradient vocabulary. One definition drives the CSS tokens/classes (injected by Base.astro via
 * gradientCss()) and the styleguide, so the two cannot drift apart.
 *
 * A gradient is named  <intensity>-<tonality>,  e.g. "soft-yellow" or "active-blue":
 *   intensity: soft (quiet, almost neutral) · calm (muted, the original look) · active (saturated, fresh)
 *   tonality:  the dominant hue family: yellow · salmon · violet · blue · green
 * Moods are short names for a few curated picks (morning, day, sundown, dusk, night, meadow).
 *
 * Use in markup:   class="gradient gradient--active-blue"   or   class="gradient gradient--sundown"
 * Use in CSS:      background: linear-gradient(180deg, var(--gradient-active-blue-top), var(--gradient-active-blue-bottom))
 * Every gradient has a dark and a light value (light-dark()). Text on top uses --text-strong.
 * Contrast: dark values keep white text at >= 3.2:1 over the whole gradient, light values keep black text well above 4.5:1.
 */

export const INTENSITIES = ['soft', 'calm', 'active'] as const;
export type Intensity = (typeof INTENSITIES)[number];

export const INTENSITY_NOTES: Record<Intensity, string> = {
  soft: 'Quiet and airy. Dark: deep, barely tinted. Light: a whisper of colour on white. For large calm surfaces.',
  calm: 'Muted, the original look of the home stage. Balanced in both themes.',
  active: 'Saturated and fresh. Dark: strong but still readable under white text. Light: clear, bright pastels. For hero moments, use sparingly.',
};

/** Dominant hue family with its partner hue for the bottom of the gradient (degrees on the HSL wheel). */
export const TONALITIES = {
  yellow: { label: 'Yellow', top: 46, bottom: 12 }, // yellow into salmon
  salmon: { label: 'Salmon', top: 8, bottom: 322 }, // salmon into mauve
  violet: { label: 'Violet', top: 264, bottom: 338 }, // violet into rose
  blue: { label: 'Blue', top: 214, bottom: 258 }, // sky blue into periwinkle
  green: { label: 'Green', top: 168, bottom: 118 }, // teal into fresh green
} as const;
export type Tonality = keyof typeof TONALITIES;
export const TONALITY_IDS = Object.keys(TONALITIES) as Tonality[];

/** Curated, named picks. Say "add the sundown gradient" or "a soft gradient with a yellowish tonality". */
export const MOODS: { name: string; id: string; note: string }[] = [
  { name: 'morning', id: 'soft-yellow', note: 'Cream into blush. Light, friendly openings.' },
  { name: 'day', id: 'soft-blue', note: 'Open sky. Calm backdrop for reading.' },
  { name: 'meadow', id: 'calm-green', note: 'Teal into green. Fresh but quiet.' },
  { name: 'dusk', id: 'calm-violet', note: 'Violet into rose. Soft evening.' },
  { name: 'sundown', id: 'active-salmon', note: 'Salmon into mauve. The warm, loud one.' },
  { name: 'night', id: 'active-blue', note: 'Deep blue into periwinkle. Strong and cool.' },
];

// [saturation %, lightness %] for the top and the bottom stop
type Stops = [[number, number], [number, number]];
const RECIPE: Record<'dark' | 'light', Record<Intensity, Stops>> = {
  dark: {
    soft: [[24, 26], [26, 36]],
    calm: [[32, 45], [37, 56]],
    active: [[62, 40], [56, 52]],
  },
  light: {
    soft: [[62, 94], [70, 97]],
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
function darkPair(intensity: Intensity, topHue: number, bottomHue: number): [string, string] {
  const [[ts, tl], [bs, bl]] = RECIPE.dark[intensity];
  let dl = 0;
  for (; dl < 24; dl++) {
    const t = hslToRgb(topHue, ts, tl - dl), b = hslToRgb(bottomHue, bs, bl - dl);
    const mid = t.map((v, i) => (v + b[i]) / 2) as RGB;
    if (intensity === 'soft' || Math.min(contrastWithWhite(t), contrastWithWhite(mid), contrastWithWhite(b)) >= 3.2) break;
  }
  return [toHex(hslToRgb(topHue, ts, tl - dl)), toHex(hslToRgb(bottomHue, bs, bl - dl))];
}
const lightPair = (intensity: Intensity, topHue: number, bottomHue: number): [string, string] => {
  const [[ts, tl], [bs, bl]] = RECIPE.light[intensity];
  return [toHex(hslToRgb(topHue, ts, tl)), toHex(hslToRgb(bottomHue, bs, bl))];
};

export interface GradientDef {
  id: string;
  intensity: Intensity;
  tonality: Tonality;
  dark: [string, string];
  light: [string, string];
}

export const GRADIENTS: GradientDef[] = INTENSITIES.flatMap((intensity) =>
  TONALITY_IDS.map((tonality) => {
    const { top, bottom } = TONALITIES[tonality];
    return {
      id: `${intensity}-${tonality}`,
      intensity,
      tonality,
      dark: darkPair(intensity, top, bottom),
      light: lightPair(intensity, top, bottom),
    };
  }),
);

export const gradientById = (id: string) => GRADIENTS.find((g) => g.id === id)!;

/** CSS for all gradients: custom properties (theme aware) and the classes .gradient, .gradient--<id>, .gradient--<mood>. */
export function gradientCss(): string {
  const vars = GRADIENTS.map(
    (g) =>
      `--gradient-${g.id}-top:light-dark(${g.light[0]},${g.dark[0]});--gradient-${g.id}-bottom:light-dark(${g.light[1]},${g.dark[1]});`,
  ).join('');
  const classes = GRADIENTS.map(
    (g) => `.gradient--${g.id}{--g-top:var(--gradient-${g.id}-top);--g-bottom:var(--gradient-${g.id}-bottom)}`,
  ).join('');
  const moods = MOODS.map(
    (m) => `.gradient--${m.name}{--g-top:var(--gradient-${m.id}-top);--g-bottom:var(--gradient-${m.id}-bottom)}`,
  ).join('');
  return `:root{${vars}}.gradient{background:linear-gradient(var(--g-angle,180deg),var(--g-top),var(--g-bottom))}${classes}${moods}`;
}
