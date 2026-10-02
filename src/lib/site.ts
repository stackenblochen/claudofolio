/** Site-wide constants. Edit here, not in components. */
export const SITE = {
  name: 'Wolfgang Lattermann',
  shortName: 'wolfgang',
  /** TODO: set the real contact address before publishing. Empty hides the Contact link. */
  email: '',
  linkedin: '',
  cvUrl: '',
  description: 'Wolfgang Lattermann is a product designer based in Berlin.',
};

export const NAV = [
  { label: 'Work', href: '/#work' },
  { label: 'About me', href: '/about/' },
];

/** Prefix an internal path with the configured base (e.g. /claudofolio). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|#)/.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
