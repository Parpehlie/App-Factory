import type { MouseEvent } from 'react';

export function isVestigesSubdomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.startsWith('vestiges.');
}

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

export function navigateTo(href: string, event?: MouseEvent<HTMLAnchorElement>): void {
  if (
    event &&
    (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
  ) {
    return;
  }
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return;
  }
  event?.preventDefault();
  const [rawPath, hash] = href.split('#');
  const nextPath = rawPath || '/';
  const currentPath = normalizePath(window.location.pathname);

  if (normalizePath(nextPath) !== currentPath) {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  } else if (hash) {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    return;
  }

  if (hash) {
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
