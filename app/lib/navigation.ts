export function resolveHref(href: string) {
  return new URL(href, window.location.href);
}

export function isSameOrigin(url: URL) {
  return url.origin === window.location.origin;
}

export function toRelativePath(url: URL | Location) {
  return `${url.pathname}${url.search}${url.hash}`;
}
