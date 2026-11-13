/**
 * The 3D software map: files are buildings, folders are districts. Layout: nested squarified treemap (treemap.ts). Footprint = code size,
 * height and colour = complexity (white < 300 < yellow < 600 < orange < 900 < red), small files take the colour of their change status
 * against the reference build (purple = deterioration, green = improvement, white = unmodified). Colours measured from the 2017 maps.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { parse, type Font } from 'opentype.js';
import fontUrl from '../../../../node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff?url';
import { generate, type MapNode } from './data';
import { layout, type Placed } from './treemap';

export const COLORS = {
  page: '#fafafa', slab: ['#dfe1e6', '#e8eaee', '#eef0f3', '#f3f4f7', '#f6f7f9'], label: '#666768',
  white: '#ffffff', yellow: '#fed500', orange: '#fe8500', red: '#e62325', purple: '#71237c', green: '#00aa5e',
};

export interface MapOptions {
  seed?: number;
  width?: number; height?: number;                 // canvas size in CSS px
  camera?: { pos: [number, number, number]; target: [number, number, number]; fov?: number };
  controls?: boolean;                              // orbit / zoom / pan with the mouse
  highlight?: string;                              // file name to show in the selection blue; '@auto' picks a tall building in the lower left
  callouts?: string[];                             // file names that get a small floating label (default: none; `calloutCount` labels the n tallest)
  calloutCount?: number;
  viewOffsetY?: number;                            // the same, vertically (positive = down), e.g. to keep the map clear of a floating toolbar
  viewOffsetX?: number;                            // shifts the whole picture sideways by this many px (e.g. to centre the map in the space beside a panel)
  selectAt?: [number, number];                     // with '@auto': where in the view (0-1, 0-1) the selected building should be
}

const W = 168, D = 146; // map size in world units

function kpiColor(c: number, status: MapNode['status']): string {
  if (c >= 900) return COLORS.red;
  if (c >= 600) return COLORS.orange;
  if (c >= 300) return COLORS.yellow;
  return status === 'deterioration' ? COLORS.purple : status === 'improvement' ? COLORS.green : COLORS.white;
}
function heightOf(n: MapNode): number {
  const c = n.complexity ?? 0;
  if (c > 3000) return 40; // the single outlier
  return 0.3 + Math.pow(c / 1200, 0.95) * 14;
}

/** District names are lettering painted onto the plate: the glyph outlines of Roboto Regular (upright) as flat geometry in the scene, so they get perspective and are hidden by buildings in front, but have no height. */
let fontPromise: Promise<Font> | undefined;
const loadFont = () => (fontPromise ??= fetch(fontUrl).then((r) => r.arrayBuffer()).then((b) => parse(b)));
function textGeometry(font: Font, text: string, size: number) {
  // glyph by glyph (no OpenType substitution lookups: the layout needs only advance widths and kerning)
  const scale = size / font.unitsPerEm, sp = new THREE.ShapePath();
  let x = 0, prev: any;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    if (prev) x += font.getKerningValue(prev, g) * scale;
    for (const c of g.getPath(x, 0, size).commands as any[]) {
      if (c.type === 'M') sp.moveTo(c.x, -c.y);
      else if (c.type === 'L') sp.lineTo(c.x, -c.y);
      else if (c.type === 'Q') sp.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
      else if (c.type === 'C') sp.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
    }
    x += (g.advanceWidth ?? 0) * scale; prev = g;
  }
  const geo = new THREE.ShapeGeometry(sp.toShapes(false), 4); // flat: the letters are painted on the surface, not raised
  const width = x;
  geo.rotateX(-Math.PI / 2);                       // lies flat on the plate, reading left to right from the front
  geo.translate(-width / 2, 0, size * 0.36);       // centred on the label position
  return { geo, width };
}

function labelTexture(text: string, px: number, color: string, italic: boolean) {
  const c = document.createElement('canvas'); const ctx = c.getContext('2d')!;
  const font = `${italic ? 'italic ' : ''}400 ${px}px Roboto, system-ui, sans-serif`;
  ctx.font = font; const w = Math.ceil(ctx.measureText(text).width) + 8;
  c.width = w; c.height = Math.ceil(px * 1.4);
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, 4, c.height / 2);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return { t, ar: c.width / c.height };
}

export async function renderMap(canvas: HTMLCanvasElement, opts: MapOptions = {}) {
  const { seed = 7, width = canvas.clientWidth, height = canvas.clientHeight } = opts;
  try { await Promise.all(['400 40px Roboto'].map((f) => document.fonts.load(f))); } catch {}

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(width, height, false);
  renderer.setClearColor(COLORS.page);
  const scene = new THREE.Scene();

  const cam = opts.camera ?? { pos: [0, 237, 150], target: [0, 4, 4], fov: 29 };
  const camera = new THREE.PerspectiveCamera(cam.fov ?? 30, width / height, 1, 1000);
  camera.position.set(...cam.pos); camera.lookAt(...cam.target);
  if (opts.viewOffsetX || opts.viewOffsetY) camera.setViewOffset(width, height, -(opts.viewOffsetX ?? 0), -(opts.viewOffsetY ?? 0), width, height);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xc4c9d4, 2.0));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(-70, 130, 90); scene.add(sun);

  const root = generate(seed);
  const placed = layout(root, { x: -W / 2, z: -D / 2, w: W, d: D });
  const folders = placed.filter((p) => p.isFolder), files = placed.filter((p) => !p.isFolder);

  const box = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshLambertMaterial();
  const SLAB_H = 0.4;
  // districts: stacked slabs, so every level raises a little
  const slabs = new THREE.InstancedMesh(box, mat, folders.length);
  const m = new THREE.Matrix4(), col = new THREE.Color();
  folders.forEach((p, i) => {
    const { rect: r, depth } = p;
    const top = (depth + 1) * SLAB_H, base = depth === 0 ? -0.7 : depth * SLAB_H;
    m.compose(new THREE.Vector3(r.x + r.w / 2, (top + base) / 2, r.z + r.d / 2), new THREE.Quaternion(), new THREE.Vector3(r.w, top - base, r.d));
    slabs.setMatrixAt(i, m); slabs.setColorAt(i, col.set(COLORS.slab[Math.min(depth, COLORS.slab.length - 1)]));
  });
  scene.add(slabs);

  // selection: '@auto' = the hot spot (complexity 600-3000) whose top lies closest to the lower left of the view
  let picked = opts.highlight;
  let pickedP: Placed | undefined;
  let selection: { name: string; path: string; complexity: number; size: number; x: number; y: number } | undefined;
  const project = (x: number, y: number, z: number) => { const v = new THREE.Vector3(x, y, z).project(camera); return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height }; };
  camera.updateMatrixWorld();
  if (picked === '@auto') {
    let best = Infinity;
    for (const p of files) {
      const c = p.node.complexity ?? 0; if (c < 600 || c > 3000 || p.rect.w * p.rect.d < 4) continue; // a clearly visible, solid building
      const q = project(p.rect.x + p.rect.w / 2, p.depth * SLAB_H + heightOf(p.node), p.rect.z + p.rect.d / 2);
      const dist = Math.hypot(q.x - width * (opts.selectAt?.[0] ?? 0.34), q.y - height * (opts.selectAt?.[1] ?? 0.68));
      if (dist < best) { best = dist; picked = p.node.name; pickedP = p; selection = { name: p.node.name, path: p.path, complexity: c, size: p.node.size ?? 0, x: q.x, y: q.y }; }
    }
  } else if (picked) {
    const p = files.find((f) => f.node.name === picked);
    pickedP = p;
    if (p) { const q = project(p.rect.x + p.rect.w / 2, p.depth * SLAB_H + heightOf(p.node), p.rect.z + p.rect.d / 2); selection = { name: p.node.name, path: p.path, complexity: p.node.complexity ?? 0, size: p.node.size ?? 0, x: q.x, y: q.y }; }
  }
  // buildings
  const buildings = new THREE.InstancedMesh(box, mat, files.length);
  const tops = new Map<string, { x: number; y: number; z: number }>();
  files.forEach((p, i) => {
    const { rect: r, node: n, depth } = p;
    const gap = Math.min(0.14, 0.12 * Math.min(r.w, r.d));
    const w = Math.max(0.05, r.w - gap * 2), d = Math.max(0.05, r.d - gap * 2);
    const h = heightOf(n), base = depth * SLAB_H;
    m.compose(new THREE.Vector3(r.x + r.w / 2, base + h / 2, r.z + r.d / 2), new THREE.Quaternion(), new THREE.Vector3(w, h, d));
    buildings.setMatrixAt(i, m);
    buildings.setColorAt(i, col.set(kpiColor(n.complexity ?? 0, n.status)));
    tops.set(n.name, { x: r.x + r.w / 2, y: base + h, z: r.z + r.d / 2 });
  });
  const wanted = new Set(opts.callouts ?? files.map((p) => p.node).sort((a, b) => (b.complexity ?? 0) - (a.complexity ?? 0)).slice(0, opts.calloutCount ?? 0).map((n) => n.name));
  for (const k of [...tops.keys()]) if (!wanted.has(k)) tops.delete(k);
  scene.add(buildings);
  // the selected building: a light blue solid with an outline of even thickness (fat lines, 3 px, drawn on its edges)
  if (pickedP) {
    const { rect: r, node: n, depth } = pickedP;
    const gap = Math.min(0.14, 0.12 * Math.min(r.w, r.d)), h = heightOf(n), base = depth * SLAB_H;
    const g = new THREE.BoxGeometry(Math.max(0.05, r.w - gap * 2) * 1.04, h * 1.01, Math.max(0.05, r.d - gap * 2) * 1.04);
    const sel = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color: '#7fd0ff' }));
    sel.position.set(r.x + r.w / 2, base + (h * 1.01) / 2, r.z + r.d / 2);
    buildings.setMatrixAt(files.indexOf(pickedP), new THREE.Matrix4().makeScale(0, 0, 0)); // the original building is replaced by the selected one
    buildings.instanceMatrix.needsUpdate = true;
    const pr = renderer.getPixelRatio();
    const outline = new LineSegments2(new LineSegmentsGeometry().fromEdgesGeometry(new THREE.EdgesGeometry(g)), new LineMaterial({ color: 0x1593ea, linewidth: 3 * pr, resolution: new THREE.Vector2(width * pr, height * pr) }));
    outline.position.copy(sel.position);
    outline.scale.setScalar(1.012); // a hair outside the faces, so the lines do not flicker against them
    scene.add(sel, outline);
  }

  // district names: painted on the front edge of the plates (flat, no height)
  const font = await loadFont();
  const letters = new THREE.MeshBasicMaterial({ color: '#777a82', polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  for (const p of folders) {
    if (p.depth === 0 || p.strip === 0) continue;
    const { rect: r, depth } = p;
    const size = depth === 1 ? 3.2 : depth === 2 ? 2.0 : 0.9; // about 55-60% of the label strip, so the names have air above and below
    const { geo, width } = textGeometry(font, p.node.name, size);
    const mesh = new THREE.Mesh(geo, letters);
    const fit = Math.min(1, (r.w * 0.8) / width);
    mesh.scale.set(fit, 1, fit);
    mesh.position.set(r.x + r.w / 2, (depth + 1) * SLAB_H + 0.02, r.z + r.d - p.strip / 2 - 0.1);
    scene.add(mesh);
  }
  // file names above the tallest buildings
  for (const [name, pos] of tops) {
    const { t, ar } = labelTexture(name, 64, '#2b2b2b', false);
    const lh = 2.3, sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
    sprite.scale.set(lh * ar, lh, 1); sprite.position.set(pos.x + (lh * ar) / 2 - 0.5, pos.y + 2.4, pos.z); sprite.renderOrder = 10; scene.add(sprite);
  }

  const draw = () => renderer.render(scene, camera);
  if (opts.controls) {
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(...cam.target); controls.enableDamping = true; controls.maxPolarAngle = Math.PI / 2.05; controls.update();
    const loop = () => { controls.update(); draw(); requestAnimationFrame(loop); }; loop();
  } else draw();
  (canvas as any).__mapReady = true;
  return { scene, camera, renderer, count: { folders: folders.length, files: files.length, callouts: tops.size }, selection };
}
