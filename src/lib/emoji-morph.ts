/**
 * Emoji cycling with a transform transition: `next()` swaps the emoji for the next one in the list, with the same kind of
 * distortion as the headline's prism effect, only much stronger: the glyph swells, shears sideways in noisy slices and splits into
 * red / green / blue fringes, and each colour channel crosses over to the new emoji at a slightly different moment.
 *
 * The DOM glyph is always the source of truth (accessibility, no-JS). During the transition it is hidden and a transparent WebGL
 * canvas on top draws both emojis (rendered into 2D canvases) through the shader; when it is done the DOM glyph is swapped and shown.
 * Without WebGL or with reduced motion the swap is instant.
 *
 * Every new emoji also gets a slightly different tilt (leaning left or right at random) and a slightly different size (random values, set as
 * `--tilt` / `--size` on the button and animated with CSS transitions), and the button hops up and down once (`.is-hopping`, a CSS
 * keyframe animation), so each appearance adds a little change.
 *
 * Between changes the glyph drifts very slowly (a tiny extra rotation and growth, `.is-drifting` on the glyph, a CSS animation that
 * lasts `--dwell` on the button); the drift restarts from zero with every new emoji. The outgoing emoji keeps its drift into the
 * transition texture so nothing snaps at the start.
 */

const BASE_TILT = 14;   // degrees, the resting tilt of the first emoji (matches the CSS fallback)
const TILT_MIN = 4, TILT_MAX = 24; // every new emoji leans left or right (random side) by a random amount in this range
const MIN_TILT_STEP = 4; // and always at least this far from the previous one
const SIZE_MIN = 0.92, SIZE_MAX = 1.09; // new size factor, very subtle
const MIN_SIZE_STEP = 0.04;

const VERT = `
  attribute vec2 a_pos; varying vec2 v_uv;
  void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

const FRAG = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_a, u_b;     // outgoing and incoming emoji, premultiplied
  uniform vec2 u_res;
  uniform float u_p, u_time, u_dpr;
  float hash(float n){ return fract(sin(n * 127.1) * 43758.5453); }
  float vnoise(float x){ float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), f); }
  vec4 A(vec2 p){ return texture2D(u_a, p / u_res); }
  vec4 B(vec2 p){ return texture2D(u_b, p / u_res); }
  void main(){
    vec2 px = vec2(v_uv.x, 1.0 - v_uv.y) * u_res;
    vec2 c = u_res * 0.5;
    float f = sin(3.14159265 * u_p);                // 0 -> 1 -> 0 over the transition
    float s = 1.0 + 0.22 * f;                       // swell at the peak
    vec2 q = (px - c) / s + c;
    float y = px.y / u_dpr;
    float n  = vnoise(y / 9.0 + u_time * 4.0) - 0.5;
    float n2 = vnoise(y / 3.5 - u_time * 7.0) - 0.5;
    vec2 o = vec2((n * 34.0 + n2 * 10.0) * f * u_dpr, 0.0);                       // shear in noisy slices
    float amp = (20.0 + 12.0 * vnoise(y / 22.0 + u_time * 3.0)) * f * u_dpr;      // colour split
    vec2 oR = o + vec2( 1.00, -0.40) * amp;
    vec2 oG = o + vec2(-0.30,  0.90) * amp * 0.8;
    vec2 oB = o + vec2(-1.00, -0.20) * amp;
    // every channel crosses over to the new emoji at a slightly different moment
    float mR = smoothstep(0.34, 0.58, u_p + 0.05);
    float mG = smoothstep(0.34, 0.58, u_p);
    float mB = smoothstep(0.34, 0.58, u_p - 0.05);
    vec4 r = mix(A(q + oR), B(q + oR), mR);
    vec4 g = mix(A(q + oG), B(q + oG), mG);
    vec4 b = mix(A(q + oB), B(q + oB), mB);
    float alpha = max(r.a, max(g.a, b.a));
    gl_FragColor = vec4(r.r, g.g, b.b, alpha);      // premultiplied: each channel is at most its own alpha
  }`;

export interface EmojiMorph {
  next: () => void;
  dispose: () => void;
}

export interface EmojiMorphOptions {
  /** Element that contains the DOM glyph and the canvas (sets the font size). */
  button: HTMLElement;
  /** Element holding the DOM glyph text. */
  glyph: HTMLElement;
  /** Transparent canvas, absolutely positioned over (and larger than) the button; `.is-morphing` on the button shows it. */
  canvas: HTMLCanvasElement;
  emojis: string[];
  /** Transition length in ms (default 340). */
  duration?: number;
  /** Swap without animation. */
  instant?: boolean;
}

export function setupEmojiMorph({ button, glyph, canvas, emojis, duration = 340, instant = false }: EmojiMorphOptions): EmojiMorph {
  let index = Math.max(0, emojis.indexOf(glyph.textContent?.trim() ?? ''));
  let animating = false;
  let raf = 0;
  let tilt = BASE_TILT;
  let size = 1;

  const newTilt = () => {
    let t = tilt;
    for (let i = 0; i < 10 && Math.abs(t - tilt) < MIN_TILT_STEP; i++) t = (Math.random() < 0.5 ? -1 : 1) * (TILT_MIN + Math.random() * (TILT_MAX - TILT_MIN));
    tilt = t;
    button.style.setProperty('--tilt', `${t.toFixed(1)}deg`);
  };
  const newSize = () => {
    let z = size;
    for (let i = 0; i < 10 && Math.abs(z - size) < MIN_SIZE_STEP; i++) z = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
    size = z;
    button.style.setProperty('--size', z.toFixed(3));
  };
  const hop = () => {
    button.classList.remove('is-hopping');
    void button.offsetWidth; // restart the CSS animation
    button.classList.add('is-hopping');
  };
  button.addEventListener('animationend', () => button.classList.remove('is-hopping'));

  /** Restarts the slow drift with a fresh random direction and amount (very subtle: 2.5-5 degrees, 4-8 % growth). */
  const restartDrift = () => {
    if (instant) return;
    const rot = (Math.random() < 0.5 ? -1 : 1) * (2.5 + Math.random() * 2.5); // the drift also goes left or right at random
    button.style.setProperty('--drift-rot', `${rot.toFixed(1)}deg`);
    button.style.setProperty('--drift-scale', (1.04 + Math.random() * 0.04).toFixed(3));
    glyph.classList.remove('is-drifting');
    void glyph.offsetWidth; // restart the CSS animation
    glyph.classList.add('is-drifting');
  };
  restartDrift();

  const swapInstantly = () => {
    index = (index + 1) % emojis.length;
    glyph.textContent = emojis[index];
    newTilt();
    newSize();
  };

  const gl = instant ? null : canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return { next: swapInstantly, dispose() {} };

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return sh;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return { next: swapInstantly, dispose() {} };
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { a: U('u_a'), b: U('u_b'), res: U('u_res'), p: U('u_p'), time: U('u_time'), dpr: U('u_dpr') };
  const makeTexture = (unit: number) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };
  const texA = makeTexture(0);
  const texB = makeTexture(1);
  gl.uniform1i(u.a, 0);
  gl.uniform1i(u.b, 1);

  const stamp = document.createElement('canvas');
  const sctx = stamp.getContext('2d')!;
  let dpr = 1, W = 0, H = 0;

  /** Renders one emoji where the DOM glyph sits (centred on the button, same font, same line box). */
  const upload = (unit: number, tex: WebGLTexture | null, ch: string, withDrift = false) => {
    sctx.setTransform(1, 0, 0, 1, 0, 0);
    sctx.clearRect(0, 0, W, H);
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(button);
    const fs = parseFloat(cs.fontSize);
    sctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    sctx.textBaseline = 'alphabetic';
    const m = sctx.measureText(ch);
    const bw = button.offsetWidth, bh = button.offsetHeight;
    const padX = (canvas.clientWidth - bw) / 2, padY = (canvas.clientHeight - bh) / 2;
    const baseline = padY + (bh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent;
    if (withDrift) {
      // the glyph's current drift (rotation + growth about its centre), so the outgoing emoji does not snap back
      const gt = getComputedStyle(glyph).transform;
      if (gt && gt !== 'none') {
        const gm = new DOMMatrix(gt);
        sctx.translate(padX + bw / 2, padY + bh / 2);
        sctx.transform(gm.a, gm.b, gm.c, gm.d, 0, 0);
        sctx.translate(-(padX + bw / 2), -(padY + bh / 2));
      }
    }
    sctx.fillText(ch, padX + (bw - m.width) / 2, baseline);
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, stamp);
  };

  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const t0 = performance.now();

  const next = () => {
    if (animating) return;
    animating = true;
    const from = emojis[index];
    index = (index + 1) % emojis.length;
    const to = emojis[index];

    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.width = stamp.width = Math.round(canvas.clientWidth * dpr);
    H = canvas.height = stamp.height = Math.round(canvas.clientHeight * dpr);
    gl.viewport(0, 0, W, H);
    upload(0, texA, from, true);
    upload(1, texB, to);
    gl.uniform2f(u.res, W, H);
    gl.uniform1f(u.dpr, dpr);

    button.dataset.changedAt = String(performance.now()); // lets other effects know the emoji is animating
    newTilt(); // the button turns to the new angle and size (CSS transitions) and hops while the glyph transforms
    newSize();
    hop();
    button.classList.add('is-morphing');
    const start = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.p, ease(t));
      gl.uniform1f(u.time, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (t < 1) { raf = requestAnimationFrame(frame); return; }
      // done: hand over to the DOM glyph in the same frame
      glyph.textContent = to;
      restartDrift(); // the new emoji starts from its base size and angle again
      button.classList.remove('is-morphing');
      animating = false;
    };
    raf = requestAnimationFrame(frame);
  };

  return {
    next,
    dispose() { cancelAnimationFrame(raf); button.classList.remove('is-morphing'); animating = false; },
  };
}
