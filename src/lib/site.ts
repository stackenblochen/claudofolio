/** Site-wide constants. Edit here, not in components. */
export const SITE = {
  name: 'Wolfgang Lattermann',
  shortName: 'wolfgang',
  /** TODO: placeholders, replace with the real values before publishing. Empty values hide the link. */
  email: 'hello@example.com',
  linkedin: 'https://www.linkedin.com/in/your-name',
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
