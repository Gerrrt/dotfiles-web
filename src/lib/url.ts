// Join the configured GitHub Pages base path with an internal path so links and
// assets resolve correctly under /dotfiles-web/ (and still work if base changes).
export function withBase(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  // anchors / external / mailto pass through untouched
  if (path.startsWith('#') || /^(https?:|mailto:|tel:)/.test(path)) return path;
  return `${base}${clean}` || '/';
}
