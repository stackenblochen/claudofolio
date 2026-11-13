/** Nested, squarified treemap layout (Bruls et al.). Folders get a rectangle with padding and a label strip at the front; files fill what is left. */
import type { MapNode } from './data';

export interface Rect { x: number; z: number; w: number; d: number }
export interface Placed { node: MapNode; depth: number; rect: Rect; strip: number; isFolder: boolean; path: string }

const PAD = [1.4, 0.9, 0.5, 0.3, 0.2];
const STRIP = [4.2, 2.4, 1.1, 0, 0];

const valueOf = (n: MapNode): number => (n.value ??= n.children ? n.children.reduce((s, c) => s + valueOf(c), 0) : n.size ?? 1);

function squarify(items: { node: MapNode; area: number }[], rect: Rect): { node: MapNode; rect: Rect }[] {
  const out: { node: MapNode; rect: Rect }[] = [];
  let { x, z, w, d } = rect;
  const queue = [...items].sort((a, b) => b.area - a.area);
  let row: typeof queue = [];
  const worst = (r: typeof queue, side: number) => {
    const s = r.reduce((t, i) => t + i.area, 0), max = Math.max(...r.map((i) => i.area)), min = Math.min(...r.map((i) => i.area));
    return Math.max((side * side * max) / (s * s), (s * s) / (side * side * min));
  };
  const flush = () => {
    if (!row.length) return;
    const s = row.reduce((t, i) => t + i.area, 0);
    if (w >= d) { // lay the row out as a column on the left
      const cw = s / d; let cz = z;
      for (const i of row) { const ch = i.area / cw; out.push({ node: i.node, rect: { x, z: cz, w: cw, d: ch } }); cz += ch; }
      x += cw; w -= cw;
    } else { // as a row at the top
      const rh = s / w; let cx = x;
      for (const i of row) { const cwid = i.area / rh; out.push({ node: i.node, rect: { x: cx, z, w: cwid, d: rh } }); cx += cwid; }
      z += rh; d -= rh;
    }
    row = [];
  };
  while (queue.length) {
    const side = Math.min(w, d), next = queue[0];
    if (!row.length || worst([...row, next], side) <= worst(row, side)) row.push(queue.shift()!);
    else flush();
  }
  flush();
  return out;
}

export function layout(root: MapNode, rect: Rect): Placed[] {
  const placed: Placed[] = [];
  const visit = (node: MapNode, r: Rect, depth: number, parent = '') => {
    const path = parent ? `${parent}/${node.name}` : node.name;
    const isFolder = !!node.children;
    const strip = isFolder ? STRIP[Math.min(depth, STRIP.length - 1)] : 0;
    placed.push({ node, depth, rect: r, strip, isFolder, path });
    if (!isFolder) return;
    const pad = PAD[Math.min(depth, PAD.length - 1)];
    const inner: Rect = { x: r.x + pad, z: r.z + pad, w: Math.max(0.1, r.w - 2 * pad), d: Math.max(0.1, r.d - 2 * pad - strip) };
    const total = valueOf(node);
    const items = node.children!.map((c) => ({ node: c, area: (valueOf(c) / total) * inner.w * inner.d }));
    for (const c of squarify(items, inner)) visit(c.node, c.rect, depth + 1, path);
  };
  visit(root, rect, 0);
  return placed;
}
