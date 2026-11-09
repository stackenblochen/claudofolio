/**
 * Hover on dashboard charts (DashSpark): the nearest point gets a cursor line and dot (bars: the bar lights up) and a tooltip with its label and value.
 * Loaded by the case-study layout (not inside the component, because protected case studies insert their content after decryption and inserted scripts do not run).
 */
document.addEventListener('pointermove', (e) => {
  const svg = (e.target as Element | null)?.closest?.('.dspark') as SVGSVGElement | null;
  document.querySelectorAll('.dspark.is-hot').forEach((o) => { if (o !== svg) leave(o as SVGSVGElement); });
  if (!svg) return;
  const pts = JSON.parse(svg.dataset.pts || '[]') as [number, number, string, number][];
  if (!pts.length) return;
  const W = +svg.dataset.w!, H = +svg.dataset.h!, r = svg.getBoundingClientRect();
  const k = Math.min(r.width / W, r.height / H), ox = (r.width - W * k) / 2, oy = (r.height - H * k) / 2;
  const vx = (e.clientX - r.left - ox) / k;
  let best = 0;
  pts.forEach((p, i) => { if (Math.abs(p[0] - vx) < Math.abs(pts[best][0] - vx)) best = i; });
  const [px, py, label, val] = pts[best];
  svg.classList.add('is-hot');
  svg.querySelectorAll('.dspark__bar').forEach((b, i) => b.classList.toggle('is-hot', i === best));
  const cur = svg.querySelector('.dspark__cursor'), dot = svg.querySelector('.dspark__hover');
  cur?.setAttribute('x1', String(px)); cur?.setAttribute('x2', String(px));
  dot?.setAttribute('cx', String(px)); dot?.setAttribute('cy', String(py));
  const tip = svg.parentElement!.querySelector('.dtip') as HTMLElement;
  tip.innerHTML = `<span>${label}</span> <b>${val}${svg.dataset.vl ? ' ' + svg.dataset.vl : ''}</b>`;
  tip.hidden = false;
  const pr = svg.parentElement!.getBoundingClientRect();
  const sc = pr.width / (svg.parentElement!.offsetWidth || pr.width); // the app may be scaled down (transform): tooltip coordinates are local
  const tx = (r.left - pr.left + ox + px * k) / sc, ty = (r.top - pr.top + oy + py * k) / sc;
  tip.style.left = `${Math.min(Math.max(tx, tip.offsetWidth / 2), pr.width / sc - tip.offsetWidth / 2)}px`;
  tip.style.top = `${ty - 10}px`;
});
function leave(svg: SVGSVGElement) {
  svg.classList.remove('is-hot');
  svg.querySelectorAll('.dspark__bar.is-hot').forEach((b) => b.classList.remove('is-hot'));
  const tip = svg.parentElement?.querySelector('.dtip') as HTMLElement | null;
  if (tip) tip.hidden = true;
}
document.addEventListener('pointerleave', () => document.querySelectorAll('.dspark.is-hot').forEach((o) => leave(o as SVGSVGElement)), true);

// DashApp is laid out at 1440 px and scaled to the width of its frame (up as well as down: the gallery shows a diagram at 1600 px). Frames can arrive after load
// (protected case studies insert their content after decryption; the gallery clones a live drawing, and a clone keeps the attributes of its original, so frames are tracked here, not marked in the DOM).
const APP_WIDTH = 1440;
const fitted = new WeakSet<Element>();
function fit(frame: HTMLElement) {
  const app = frame.querySelector<HTMLElement>('.dapp');
  if (!app) return;
  const s = frame.clientWidth / APP_WIDTH;
  app.style.setProperty('--dz', String(s));
  frame.style.height = `${app.offsetHeight * s}px`;
}
function register() {
  document.querySelectorAll<HTMLElement>('.dapp-frame').forEach((frame) => {
    if (fitted.has(frame)) return;
    fitted.add(frame);
    const ro = new ResizeObserver(() => fit(frame));
    ro.observe(frame);
    const app = frame.querySelector('.dapp');
    if (app) ro.observe(app);
    fit(frame);
  });
}
// the gallery clones a live drawing at a fixed width and measures it right away: it asks for a synchronous fit first (a clone keeps the inline height of its original)
document.addEventListener('dash:fit', () => { register(); document.querySelectorAll<HTMLElement>('.dapp-frame').forEach(fit); });
register();
new MutationObserver(register).observe(document.documentElement, { childList: true, subtree: true });
