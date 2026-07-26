export function resolveHref(href: string): URL | null {
  try {
    return new URL(href, window.location.href);
  } catch (error) {
    console.error(`Unable to resolve href "${href}".`, error);
    return null;
  }
}
