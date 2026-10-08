/** Site-wide constants. Edit here, not in components. */
export const SITE = {
  name: 'Wolfgang Lattermann',
  shortName: 'wolfgang',
  /** TODO: placeholders, replace with the real values before publishing. Empty values hide the link. */
  email: 'wl@hallo-wl.de',
  linkedin: 'https://www.linkedin.com/in/wolfgang-lattermann-68439b80/',
  /** Path under /public (e.g. public/cv/wolfgang-lattermann-cv.pdf). */
  cvUrl: '/cv/wolfgang-lattermann-cv.pdf',
  description: 'Wolfgang Lattermann is a product designer based in Berlin.',
};

export const NAV = [
  { label: 'About me', href: '/about/' },
];

/** Prefix an internal path with the configured base (e.g. /claudofolio). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Headline markup: `*word*` becomes an Editorial New highlight (<em>) inside a Geist title. Input is escaped first. */
export function highlight(text: string): string {
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
/** The same headline without the markup (for <title>, aria labels, props that expect plain text). */
export const plain = (text: string) => text.replace(/\*/g, '');
