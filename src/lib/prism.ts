/**
 * Prism effect: while the pointer moves over a stage, its content (text and images) shears sideways and splits into
 * red / green / blue fringes around the cursor, then settles when the pointer rests.
 *
 * The real DOM content always stays in place (accessibility, selection). A transparent WebGL canvas on top redraws the content
 * (you provide a `paint` callback that draws it into a 2D canvas) with the distortion, but only paints where there is distortion,
 * so the DOM shows everywhere else. The distortion is mixed against the flat background colour of `bg` (theme aware).
 * Without WebGL the effect is simply skipped.
 */

const VERT = `
  attribute vec2 a_pos; varying vec2 v_uv;
  void main(){ v_uv = a_pos * 0.5 + 0.5; gl_Position = vec4(a_pos, 0.0, 1.0); }`;

// Prism distortion around the pointer: sheared slices, a gentle push away from the cursor, and per-channel offsets
// (chromatic split). Each colour channel is read from its own offset position of the content texture and mixed against the
// background; output is premultiplied and transparent wherever the distortion is zero or the texture has no content.
const FRAG = `
  precision highp float;
  varying vec2 v_uv;
  uniform sampler2D u_tex;
  uniform vec2 u_res; uniform vec2 u_mouse;
  uniform float u_radius, u_strength, u_time, u_dpr;
  uniform float u_rmode, u_rp, u_rmax; // ripple mode: 1.0, progress 0..1 of the wave front, distance the front travels (device px)
  uniform vec3 u_bg;
  float hash(float n){ return fract(sin(n * 127.1) * 43758.5453); }
  float vnoise(float x){ float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(hash(i), hash(i + 1.0), f); }
  vec4 at(vec2 p){ return texture2D(u_tex, p / u_res); }
  void main(){
    vec2 px = vec2(v_uv.x, 1.0 - v_uv.y) * u_res;
    vec2 toM = px - u_mouse;
    float d = length(toM);
    float f = pow(smoothstep(u_radius, 0.0, d), 1.3) * u_strength;
    if (u_rmode > 0.5) {
      // one-off ripple: a wave front travels from the touch point across the whole stage. Ahead of the front the distortion
      // rises steeply, behind it a longer wake fades out; the whole effect dies down towards the end.
      float x = (d - u_rp * u_rmax) / (u_radius * 0.5);
      float ring = x > 0.0 ? exp(-x * x * 2.0) : exp(-x * x * 0.16);
      f = ring * (1.0 - smoothstep(0.7, 1.0, u_rp)) * u_strength;
    }

    // smooth, flowing shear (continuous noise over y and time), not stepped blocks
    float y = px.y / u_dpr;
    float n  = vnoise(y / 22.0 + u_time * 1.3) - 0.5;
    float n2 = vnoise(y / 8.0 - u_time * 2.0) - 0.5;
    float dx = (n * 11.0 + n2 * 4.0) * f * u_dpr;
    float dy = sin(px.x / u_dpr * 0.035 + u_time * 2.2) * 1.5 * f * u_dpr;
    vec2 push = (toM / max(d, 1.0)) * f * 2.0 * u_dpr;
    vec2 o = vec2(dx, dy) + push;
    // colour split: each channel is pushed in its own direction by more than the stroke width, so letters and edges break into
    // red / green / blue patches (cyan, magenta, yellow where two overlap), white where all three meet
    float A = (7.0 + 6.0 * vnoise(y / 40.0 + u_time * 0.8)) * f * u_dpr;
    vec2 oR = o + vec2( 1.00, -0.45) * A;
    vec2 oG = o + vec2(-0.35,  0.95) * A * 0.8;
    vec2 oB = o + vec2(-1.00, -0.25) * A;

    vec4 sr = at(px + oR), sg = at(px + oG), sb = at(px + oB);
    vec3 col = vec3(mix(u_bg.r, sr.r, sr.a), mix(u_bg.g, sg.g, sg.a), mix(u_bg.b, sb.b, sb.a));
    // Only paint where there is content: at the undistorted position (to cover the real DOM text) or at any of the shifted
    // positions (where it ends up). Everywhere else the canvas stays transparent, so anything the texture does not contain
    // (e.g. an image next to the text) keeps showing through untouched.
    float content = max(max(sr.a, sg.a), max(sb.a, at(px).a));
    float alpha = smoothstep(0.0, 0.03, f) * min(1.0, content * 4.0);
    gl_FragColor = vec4(col * alpha, alpha);
  }`;

const rgb = (s: string) => {
  const m = s.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/);
  return m ? [+m[1] / 255, +m[2] / 255, +m[3] / 255] : null;
};

export interface Prism {
  /** Ripple mode only: plays the one-off ripple from this point (css px in the stage). Ignored while one is running. */
  ripple: (x: number, y: number) => void;
  pointer: (clientX: number, clientY: number, x: number, y: number) => void;
  leave: () => void;
  dispose: () => void;
}

export interface PrismOptions {
  /** Element the pointer moves over; the canvas covers it. */
  stage: HTMLElement;
  /** Transparent canvas positioned over the stage; `.is-on` marks it visible (give it an opacity transition). */
  canvas: HTMLCanvasElement;
  /** Element whose resolved background colour is the colour behind the content. */
  bg: HTMLElement;
  /** Draws the content into a 2D context whose origin is the stage's top-left corner, in css px. */
  paint: (ctx: CanvasRenderingContext2D, stage: DOMRect) => void;
  /** Radius of the distortion around the pointer in css px. */
  radius?: (width: number, height: number) => number;
  /**
   * Repaint the content on every frame while the effect is visible (for content that moves, e.g. CSS transitions). Pass a function to
   * repaint only while it returns true.
   */
  repaintEachFrame?: boolean | (() => boolean);
  /** With a function for `repaintEachFrame`: while it returns false, still repaint this often (ms), for slow drifts. 0 = never. */
  idleRepaintMs?: number;
  /**
   * Strength the effect keeps while the pointer is over the stage, even when it rests (0 = it settles completely, like a ripple).
   * Moving the pointer pushes it up to the maximum (0.6) and it eases back down to this level. Default 0.22.
   */
  hoverStrength?: number;
  /** 'pointer' (default): distortion follows the pointer. 'ripple': no pointer tracking, `ripple(x, y)` plays one wave across the whole stage and the content is left untouched afterwards. */
  mode?: 'pointer' | 'ripple';
  /** Ripple mode: how long the wave takes to cross the stage, in ms. */
  rippleMs?: number;
}

/** Paints the words of an element at their DOM positions, in their own colour and font. */
export function paintText(ctx: CanvasRenderingContext2D, stage: DOMRect, el: HTMLElement, k = 1) {
  // k converts on-screen px to the stage's layout px (stage.offsetWidth / stage.width) when the stage itself is scaled by a transform; fonts stay at their layout size
  ctx.textBaseline = 'alphabetic';
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const cs = getComputedStyle(node.parentElement!);
    ctx.fillStyle = cs.color;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ascent = ctx.measureText('Hg').fontBoundingBoxAscent;
    // text cut off by a clipping ancestor (line clamp, overflow hidden) still has rects: leave those words out, like the page does
    let clip: DOMRect | null = null;
    for (let p: HTMLElement | null = node.parentElement; p && p !== el.parentElement; p = p.parentElement) {
      if (getComputedStyle(p).overflowY !== 'visible') { clip = p.getBoundingClientRect(); break; }
    }
    const range = document.createRange();
    const re = /\S+/g;
    for (let m = re.exec(node.data); m; m = re.exec(node.data)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const r = range.getClientRects()[0];
      if (r && clip && (r.bottom > clip.bottom + 1 || r.top < clip.top - 1 || r.right > clip.right + 1)) continue;
      if (r) ctx.fillText(m[0], (r.left - stage.left) * k, (r.top - stage.top) * k + ascent);
    }
  }
}

/**
 * Paints an emoji glyph where it currently is on screen, following its CSS transform (rotation), its `scale` and any translation
 * (hop). `el` is the transformed box, `glyph` the element holding the text. Skipped while `el` has `.is-morphing`, because the
 * transition canvas shows the emoji then.
 */
export function paintGlyph(ctx: CanvasRenderingContext2D, stage: DOMRect, el: HTMLElement, glyph: HTMLElement) {
  if (el.classList.contains('is-morphing')) return;
  const ch = glyph.textContent?.trim();
  if (!ch) return;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect(); // box of the rotated, scaled and moved element: its centre is the element's centre
  const m = cs.transform === 'none' ? new DOMMatrix() : new DOMMatrix(cs.transform);
  // the glyph itself may drift (rotation + growth about its centre, which is the box centre)
  const gt = getComputedStyle(glyph).transform;
  const gm = gt && gt !== 'none' ? new DOMMatrix(gt) : new DOMMatrix();
  const angle = Math.atan2(m.b, m.a) + Math.atan2(gm.b, gm.a);
  const scale = (parseFloat(cs.scale) || 1) * Math.hypot(gm.a, gm.b);
  const w = el.offsetWidth, h = el.offsetHeight;
  ctx.save();
  ctx.translate(r.left + r.width / 2 - stage.left, r.top + r.height / 2 - stage.top);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`;
  ctx.textBaseline = 'alphabetic';
  const mt = ctx.measureText(ch);
  // same placement as the DOM line box (line-height 1, glyph centred in the box)
  ctx.fillText(ch, -mt.width / 2, -h / 2 + (h - (mt.fontBoundingBoxAscent + mt.fontBoundingBoxDescent)) / 2 + mt.fontBoundingBoxAscent);
  ctx.restore();
  void w;
}

/** Paints a loaded image at its (possibly transformed) DOM position. */
export function paintImage(ctx: CanvasRenderingContext2D, stage: DOMRect, img: HTMLImageElement, k = 1) {
  if (!img.complete || !img.naturalWidth) return;
  const r = img.getBoundingClientRect();
  ctx.drawImage(img, (r.left - stage.left) * k, (r.top - stage.top) * k, r.width * k, r.height * k);
}

export function setupPrism({ stage, canvas, bg, paint, radius: radiusFn, repaintEachFrame = false, idleRepaintMs = 0, hoverStrength = 0.22, mode = 'pointer', rippleMs = 1100 }: PrismOptions): Prism | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;

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
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = { res: U('u_res'), mouse: U('u_mouse'), radius: U('u_radius'), strength: U('u_strength'), time: U('u_time'), dpr: U('u_dpr'), bg: U('u_bg'), rmode: U('u_rmode'), rp: U('u_rp'), rmax: U('u_rmax') };
  gl.uniform1f(u.rmode, mode === 'ripple' ? 1 : 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // ----- content → texture, laid out exactly like the DOM
  const textCanvas = document.createElement('canvas');
  const tctx = textCanvas.getContext('2d')!;
  let dpr = 1, W = 0, H = 0, stageRect = stage.getBoundingClientRect();

  const paintTexture = () => {
    stageRect = stage.getBoundingClientRect();
    tctx.setTransform(1, 0, 0, 1, 0, 0);
    tctx.clearRect(0, 0, W, H);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint(tctx, stageRect);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
  };

  let radiusCss = 0;
  const drawText = () => {
    // layout size, not the on-screen rect: the stage may be scaled by a transform (reveal, hover zoom) while the canvas inside it scales along
    const pr = { width: stage.offsetWidth, height: stage.offsetHeight };
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = Math.round(pr.width * dpr);
    H = Math.round(pr.height * dpr);
    canvas.width = textCanvas.width = W;
    canvas.height = textCanvas.height = H;
    gl.viewport(0, 0, W, H);
    paintTexture();

    // colours as the browser resolved them (theme aware)
    gl.uniform3fv(u.bg, rgb(getComputedStyle(bg).backgroundColor) ?? [0, 0, 0]);
    gl.uniform2f(u.res, W, H);
    gl.uniform1f(u.dpr, dpr);
    radiusCss = radiusFn ? radiusFn(pr.width, pr.height) : Math.min(pr.width * 0.3, 420);
    gl.uniform1f(u.radius, radiusCss * dpr);
  };

  // ----- pointer-driven state
  let mx = 0, my = 0;          // smoothed lens position (css px in the stage)
  let tx = 0, ty = 0;          // latest pointer position
  let lastX = 0, lastY = 0, hasLast = false;
  let speed = 0;               // smoothed pointer speed
  let strength = 0;
  let lastPaint = 0;
  let inside = false;          // pointer is over the stage: the effect never drops below `hoverStrength`
  let leaving = false;         // pointer left the stage: let the effect die out quickly
  let raf = 0, running = false, prev = 0;
  const t0 = performance.now();

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - (prev || now - 16)) / 1000);
    prev = now;
    speed *= Math.exp(-dt * 4.5); // decay between events
    const moving = Math.min(0.6, speed / 70);
    const target = inside ? Math.max(hoverStrength, moving) : moving;
    // ease in gently, ease out slowly (frame-rate independent)
    strength += (target - strength) * (1 - Math.exp(-dt * (target > strength ? 5 : leaving ? 7 : 2.2)));
    const follow = 1 - Math.exp(-dt * 12);
    mx += (tx - mx) * follow;
    my += (ty - my) * follow;

    if (strength < 0.004) { running = false; prev = 0; canvas.classList.remove('is-on'); return; }
    canvas.classList.add('is-on');
    const every = typeof repaintEachFrame === 'function' ? repaintEachFrame() : repaintEachFrame;
    if (every || (idleRepaintMs > 0 && now - lastPaint >= idleRepaintMs)) { paintTexture(); lastPaint = now; }
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.mouse, mx * dpr, my * dpr);
    gl.uniform1f(u.strength, strength);
    gl.uniform1f(u.time, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(draw);
  };
  // ----- one-off ripple (mode 'ripple')
  let rippling = false, rStart = 0, rx = 0, ry = 0, rRaf = 0;
  const rippleFrame = (now: number) => {
    const t = Math.min(1, (now - rStart) / rippleMs);
    const p = 1 - Math.pow(1 - t, 2); // the front starts fast and slows down
    paintTexture(); // the content moves while the card pops up
    const far = Math.max(Math.hypot(rx, ry), Math.hypot(W / dpr - rx, ry), Math.hypot(rx, H / dpr - ry), Math.hypot(W / dpr - rx, H / dpr - ry));
    canvas.classList.add('is-on');
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.mouse, rx * dpr, ry * dpr);
    gl.uniform1f(u.rp, p);
    gl.uniform1f(u.rmax, (far + radiusCss * 1.5) * dpr);
    gl.uniform1f(u.strength, 0.7);
    gl.uniform1f(u.time, (now - rStart) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (t < 1) rRaf = requestAnimationFrame(rippleFrame);
    else { rippling = false; canvas.classList.remove('is-on'); gl.clear(gl.COLOR_BUFFER_BIT); }
  };

  const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };

  const rebuild = () => { drawText(); if (running) gl.drawArrays(gl.TRIANGLES, 0, 3); };
  (document.fonts?.ready ?? Promise.resolve()).then(rebuild);
  drawText();
  const ro = new ResizeObserver(rebuild);
  ro.observe(stage);
  const mo = new MutationObserver(rebuild); // theme switch
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return {
    ripple(x, y) {
      if (mode !== 'ripple' || rippling) return;
      rippling = true; rx = x; ry = y; rStart = performance.now();
      cancelAnimationFrame(rRaf);
      rRaf = requestAnimationFrame(rippleFrame);
    },
    pointer(clientX, clientY, x, y) {
      if (mode === 'ripple') return;
      leaving = false;
      inside = true;
      tx = x; ty = y;
      if (!running) { mx = tx; my = ty; }
      if (hasLast) speed = Math.min(140, speed + Math.hypot(clientX - lastX, clientY - lastY) * 0.6);
      lastX = clientX; lastY = clientY; hasLast = true;
      kick();
    },
    leave() { if (mode === 'ripple') return; hasLast = false; inside = false; leaving = true; speed = 0; kick(); },
    dispose() {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rRaf);
      rippling = false;
      running = false;
      inside = false;
      ro.disconnect(); mo.disconnect();
      canvas.classList.remove('is-on');
    },
  };
}
