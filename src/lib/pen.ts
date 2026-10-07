/**
 * Shared bits of the "pen" effect (home stage and project teasers):
 *  - randomGradient(): a muted two-colour gradient from a small set of hues, contrast-checked against white text
 *  - setupReveal(): a 2D canvas that paints a gradient only where the pointer has been (accumulated soft mask),
 *    fading out when the pointer leaves. The mask canvas is exposed so a WebGL layer can paint through it too.
 */

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const HUES = [8, 340, 322, 270, 244, 222, 200, 176]; // salmon, rose, mauve, violet, indigo, blue, steel, teal
const hueGap = (a: number, b: number) => { const d = Math.abs(a - b) % 360; return Math.min(d, 360 - d); };
const hslToRgb = (h: number, sat: number, l: number) => {
  const s = sat / 100, lt = l / 100, k = (n: number) => (n + h / 30) % 12, a = s * Math.min(lt, 1 - lt);
  return [0, 8, 4].map((n) => 255 * (lt - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
};
const luminance = (rgb: number[]) => { const [r, g, b] = rgb.map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const hsl = (h: number, sat: number, l: number) => `hsl(${((Math.round(h) % 360) + 360) % 360} ${Math.round(sat)}% ${Math.round(l)}%)`;

/** The hue pool the random gradients draw from (name, hue in degrees). */
export const GRADIENT_HUES = [
  ['Salmon', 8], ['Rose', 340], ['Mauve', 322], ['Violet', 270], ['Indigo', 244], ['Blue', 222], ['Steel', 200], ['Teal', 176],
] as const;

/**
 * A fixed gradient for a hue pair, using the middle of the ranges randomGradient() draws from (same muted look, no randomness).
 * For reference swatches, e.g. in the styleguide. Dark: saturation 32 %, lightness 45 % to 56 %; light: pastel, 82 % to 89 %.
 */
export function gradientFromHues(topHue: number, bottomHue: number, light: boolean): [string, string] {
  return light
    ? [hsl(topHue, 55, 82), hsl(bottomHue, 75, 89)]
    : [hsl(topHue, 32, 45), hsl(bottomHue, 37, 56)];
}

/** Two clearly different hues, muted. Dark: readable under a white headline; light: pastel. */
export function randomGradient(light: boolean): [string, string] {
  let top = '', bottom = '';
  for (let attempt = 0; attempt < 12; attempt++) {
    const ht = HUES[Math.floor(Math.random() * HUES.length)];
    const pool = HUES.filter((h) => hueGap(h, ht) >= 55);
    const hb = pool[Math.floor(Math.random() * pool.length)];
    const t = [ht + rand(-8, 8), light ? rand(45, 65) : rand(24, 40), light ? rand(78, 86) : rand(34, 56)];
    const b = [hb + rand(-8, 8), light ? rand(45, 65) : rand(24, 40), light ? rand(84, 92) : rand(48, 64)];
    top = hsl(t[0], t[1], t[2]);
    bottom = hsl(b[0], b[1], b[2]);
    if (light) break;
    // white text: top, middle and bottom must stay readable, and the two stops must differ in lightness too
    const ct = hslToRgb(t[0], t[1], t[2]), cb = hslToRgb(b[0], b[1], b[2]);
    const mid = ct.map((v, i) => (v + cb[i]) / 2);
    const worst = Math.min(...[ct, mid, cb].map((c) => 1.05 / (luminance(c) + 0.05)));
    if (worst >= 2.9 && Math.abs(t[2] - b[2]) >= 6) break;
  }
  return [top, bottom];
}

export type Reveal = {
  mask: HTMLCanvasElement;
  enter: (x: number, y: number) => void;
  move: (x: number, y: number) => void;
  /** Opens a circle from (x, y) that keeps growing until the whole stage is revealed (used to finish an automatic sweep). */
  bloom: (x: number, y: number) => void;
  leave: () => void;
  resize: () => void;
  dispose: () => void;
};

export interface RevealOptions {
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  /** Gradient colours (CSS colour strings), read on every enter. */
  getColors: () => [string, string];
  /** Corner radius of the revealed shape in css px. */
  getCorner: () => number;
  /** Resting radius of the circle in css px for the current stage size. */
  getRadius: (width: number, height: number) => number;
}

// Gradient stage revealed at the pointer (the tip of the emoji "pen"): a soft circle stays uncovered along its path (a low-res
// alpha mask that accumulates), the gradient is painted through it on a 2D canvas. On leave the whole area fades out.
// The mask canvas is shared with the WebGL effect so the distorted headline is only painted inside the revealed area.
export function setupReveal({ stage, canvas, getColors, getCorner, getRadius }: RevealOptions): Reveal | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  // Safety net: whatever the stylesheet says, the canvas must never take part in layout (its size follows the stage, not the other way round)
  Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' });
  const mask = document.createElement('canvas');
  const mctx = mask.getContext('2d')!;
  const MS = 0.5;                 // mask resolution relative to css pixels
  const FADE_OUT = 2.2;           // per second: the revealed area is gone after ~0.45 s
  const SPEED_FULL = 1500;        // px per second at which the circle has reached its largest size
  const SPEED_GROWTH = 1;         // largest size = (1 + SPEED_GROWTH) x the resting radius
  let W = 0, H = 0, dpr = 1, radius = 120, corner = 24;
  let vel = 0, lastMoveT = 0;     // smoothed pointer speed, px per second
  let top = '', bottom = '';
  let inside = false, px = 0, py = 0, lx = 0, ly = 0, growth = 1, fade = 0;
  let bloom: { x: number; y: number; r: number; max: number } | null = null;
  let raf = 0, running = false, prev = 0;

  const resize = () => {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    // keep what is already revealed when the stage changes size (e.g. images loading while the pointer is inside)
    const mw = Math.round(W * MS), mh = Math.round(H * MS);
    if ((mask.width !== mw || mask.height !== mh) && mask.width > 0 && mask.height > 0) {
      const old = document.createElement('canvas');
      old.width = mask.width; old.height = mask.height;
      old.getContext('2d')!.drawImage(mask, 0, 0);
      mask.width = mw; mask.height = mh;
      mctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, mw, mh);
    } else if (mask.width !== mw || mask.height !== mh) {
      mask.width = mw; mask.height = mh;
    }
    radius = getRadius(W, H); // resting size; faster movement opens it up (see tick)
    corner = getCorner();
  };

  const readColors = () => { [top, bottom] = getColors(); };

  const stamp = (x: number, y: number, r: number) => {
    const cx = x * MS, cy = y * MS, cr = r * MS;
    const g = mctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.55, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    mctx.fillStyle = g;
    mctx.beginPath();
    mctx.arc(cx, cy, cr, 0, Math.PI * 2);
    mctx.fill();
  };
  const stampTo = (x: number, y: number, r: number) => {
    const d = Math.hypot(x - lx, y - ly);
    const n = Math.max(1, Math.ceil(d / (r * 0.22)));
    for (let i = 1; i <= n; i++) stamp(lx + ((x - lx) * i) / n, ly + ((y - ly) * i) / n, r);
    lx = x; ly = y;
  };

  const roundedRect = (w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r); ctx.arcTo(w, h, 0, h, r); ctx.arcTo(0, h, 0, 0, r); ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
  };

  const compose = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    roundedRect(W, H, corner);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.restore();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.globalAlpha = fade;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  };

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - (prev || now - 16)) / 1000);
    prev = now;
    if (inside) {
      growth += (1 - growth) * (1 - Math.exp(-dt * 6)); // the first circle opens up instead of popping in
      vel *= Math.exp(-dt * 5);                         // speed fades when the pointer rests, so the circle shrinks back
      fade = 1;
      stampTo(px, py, radius * growth * (1 + SPEED_GROWTH * Math.min(1, vel / SPEED_FULL)));
      if (bloom) {
        // exponential approach plus a constant push, so the last stretch does not crawl
        bloom.r += (bloom.max - bloom.r) * (1 - Math.exp(-dt * 8)) + dt * 700;
        stamp(bloom.x, bloom.y, bloom.r);
        if (bloom.r >= bloom.max - 2) bloom = null;
      }
    } else {
      fade -= dt * FADE_OUT;
      if (fade <= 0) {
        fade = 0;
        mctx.clearRect(0, 0, mask.width, mask.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        running = false; prev = 0;
        return;
      }
    }
    compose();
    raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };

  resize();
  return {
    mask,
    resize,
    enter(x, y) {
      readColors();
      mctx.clearRect(0, 0, mask.width, mask.height);
      inside = true; growth = 0.2; fade = 1; vel = 0; lastMoveT = 0; bloom = null;
      px = lx = x; py = ly = y;
      kick();
    },
    move(x, y) {
      const now = performance.now();
      if (lastMoveT) vel += (Math.hypot(x - px, y - py) / (Math.max(1, now - lastMoveT) / 1000) - vel) * 0.35;
      lastMoveT = now;
      px = x; py = y;
      if (inside) kick();
    },
    bloom(x, y) {
      // the soft circle is solid up to 55% of its radius, so it has to reach 1/0.55 of the farthest corner distance
      const far = Math.max(Math.hypot(x, y), Math.hypot(W - x, y), Math.hypot(x, H - y), Math.hypot(W - x, H - y));
      bloom = { x, y, r: radius * 0.6, max: far * 1.9 };
      if (inside) kick();
    },
    leave() { inside = false; bloom = null; kick(); },
    dispose() { cancelAnimationFrame(raf); running = false; inside = false; mctx.clearRect(0, 0, mask.width, mask.height); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); },
  };
}
