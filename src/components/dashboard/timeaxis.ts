/**
 * Time axes for DashSpark, built from real dates so the x labels, the hover tooltips and the "today" marker always agree.
 *
 *   const a = axis({ from: '2019-03-01', until: '2019-08-23', points: 26 });
 *   <DashSpark values={…} labels={a.labels} ticks={a.ticks} tickAt={a.tickAt} />
 *
 * `from`..`until`: the dates of the real data points (evenly spaced, `points` of them). `to` (default `until`): where the axis ends, for
 * charts that run on into the future (targets); `span` is the share of the axis the real data fills. `tickEvery`: a tick on the first of
 * every n-th month; `tickDays`: a tick every n days after `from` (instead of months); `tickFormat`: "month" ("Mar") or "day" ("01 Mar"); `includeEnd` adds a tick for `to`.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = 86400000;
const utc = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const fmtDay = (t: number) => { const d = new Date(t); return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]}`; };
const fmtMonth = (t: number) => MONTHS[new Date(t).getUTCMonth()];

interface Opts { from: string; until: string; to?: string; points: number; tickEvery?: number; tickDays?: number; tickFormat?: 'month' | 'day'; includeEnd?: boolean; pointExtent?: number }
export function axis({ from, until, to, points, tickEvery = 1, tickDays, tickFormat = 'month', includeEnd = false, pointExtent = 0 }: Opts) {
  const t0 = utc(from), t1 = utc(until), tEnd = (to ? utc(to) : t1) + pointExtent * DAY;
  const range = tEnd - t0 || 1;
  const labels = Array.from({ length: points }, (_, i) => fmtDay(t0 + ((t1 - t0) * i) / Math.max(1, points - 1)));
  const fmt = tickFormat === 'day' ? fmtDay : fmtMonth;
  const ticks: string[] = [], tickAt: number[] = [];
  if (tickDays) { for (let t = t0 + tickDays * DAY; t <= tEnd; t += tickDays * DAY) { ticks.push(fmt(t)); tickAt.push(+((t - t0) / range).toFixed(4)); } return { labels, ticks, tickAt, span: +(((t1 - t0) / range)).toFixed(4) }; }
  const first = new Date(t0);
  let y = first.getUTCFullYear(), m = first.getUTCMonth() + (first.getUTCDate() === 1 ? 0 : 1);
  let k = 0;
  for (;; k++, m += tickEvery) {
    const t = Date.UTC(y, m, 1);
    if (t > tEnd) break;
    ticks.push(fmt(t)); tickAt.push(+((t - t0) / range).toFixed(4));
  }
  if (includeEnd) { ticks.push(fmt(tEnd - pointExtent * DAY)); tickAt.push(1); }
  return { labels, ticks, tickAt, span: +(((t1 - t0) / range)).toFixed(4) };
}
