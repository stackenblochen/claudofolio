// Drawn window chrome for the mock system, shared by render.mjs, Mock.astro and the review page.
//   desktopBar({ controls })          app window bar: three controls, no title
//   browserChrome({ browser, url, tab })   'chrome' (tab strip + toolbar) or 'safari' (single bar)
// Each is one inline SVG redrawn from the frame templates, which are 2400 px wide: desktop bar 64,
// Safari 104 and Chrome 158 px tall. Colours come from CSS variables (see mock.css), so the same
// markup serves light, dark, solid and transparent.
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// window controls: 24 px circles, 40 px apart. Colour = fill with a 1 px darker ring, mono = 3 px ring.
const controls = (cx, cy, mono) => ['r', 'y', 'g'].map((k, i) => mono
  ? `<circle class="wc-mono" cx="${cx + i * 40}" cy="${cy}" r="10.5"/>`
  : `<circle class="wc-${k}" cx="${cx + i * 40}" cy="${cy}" r="11.5"/>`).join('');
const bar = (kind, h, body, extra = '') =>
  `<div class="mock__bar mock__bar--${kind}" aria-hidden="true"><svg class="mock__chrome" viewBox="0 0 2400 ${h}" focusable="false">${body}</svg>${extra}</div>`;
const split = url => { const m = /^([a-z][a-z0-9+.-]*:\/\/)(.*)$/i.exec(url || ''); return m ? [m[1], m[2]] : ['', url || '']; };
const hostOf = url => split(url)[1].split(/[/?#]/)[0];

export const desktopBar = ({ controls: c = 'color' } = {}) => bar('desktop', 64,
  `<rect class="dc-bar" width="2400" height="64"/><rect class="dc-line" y="62" width="2400" height="2"/>${controls(44, 32, c === 'mono')}`);

function chrome({ url = '', tab = '' }) {
  const [proto, rest] = split(url);
  return bar('chrome', 158, `
<rect class="bc-strip" width="2400" height="84"/><rect class="bc-bar" y="84" width="2400" height="73"/><rect class="bc-line" y="157" width="2400" height="1"/>
<path class="bc-bar" d="M144 84a12 12 0 0 0 12-12V32a16 16 0 0 1 16-16h448a16 16 0 0 1 16 16v40a12 12 0 0 0 12 12z"/>
${controls(38, 44, false)}
<circle class="bc-icon" cx="196" cy="50" r="16"/><circle class="bc-bar" cx="196" cy="50" r="6"/>
<svg x="228" y="20" width="352" height="60" overflow="hidden"><text class="bc-title" y="38" font-size="24">${esc(tab || hostOf(url))}</text></svg>
<path class="bc-stroke" d="M597 43l14 14m0-14l-14 14M669 50h22m-11-11v22"/>
<path class="bc-stroke" d="M56 119H33m10-11L32 119l11 11"/><path class="bc-stroke bc-dim" d="M96 119h23m-10-11l11 11-11 11"/>
<path class="bc-stroke" d="M181.5 124.5A11 11 0 1 1 179.3 112.2"/><path class="bc-icon" d="M186 107v11h-11z"/>
<rect class="bc-pill" x="216" y="92" width="2096" height="56" rx="28"/>
<rect class="bc-lock" x="244" y="118" width="16" height="13" rx="2"/><path class="bc-lock-arc" d="M247.5 119v-4a4.5 4.5 0 0 1 9 0v4"/>
<svg x="284" y="92" width="1992" height="56" overflow="hidden"><text y="38" font-size="27"><tspan class="bc-proto">${esc(proto)}</tspan><tspan class="bc-url">${esc(rest)}</tspan></text></svg>
<circle class="bc-icon" cx="2355.5" cy="110" r="3.2"/><circle class="bc-icon" cx="2355.5" cy="120" r="3.2"/><circle class="bc-icon" cx="2355.5" cy="130" r="3.2"/>`);
}

function safari({ url = '' }) {
  // lock and host are centred in the field left of the reload button, so they are HTML on top of the SVG
  return bar('safari', 104, `
<rect class="sf-bar" width="2400" height="104"/>
${controls(52, 52, false)}
<rect class="sf-field" x="685" y="25" width="1030" height="54" rx="9"/>
<path class="sf-stroke" d="M1698 54a10.3 10.3 0 1 1-10.3-10.3h5.6m-5.6-5.4l6.2 5.4-6.2 5.4"/>`,
  `<span class="sf-url"><svg class="sf-lock" viewBox="0 0 16 23"><rect y="10" width="16" height="13" rx="2.5"/><path d="M3.5 11V7a4.5 4.5 0 0 1 9 0v4" fill="none" stroke-width="2.4"/></svg><span>${esc(hostOf(url))}</span></span>`);
}

export const browserChrome = ({ browser = 'chrome', url = '', tab = '' } = {}) =>
  browser === 'safari' ? safari({ url }) : chrome({ url, tab });
