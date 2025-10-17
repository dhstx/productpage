// Finds likely-old cog DOM and removes it. Returns {removed, remaining}.
export function cleanupCogs(): { removed: number; remaining: number } {
  const selectors = [
    '.cog', '.cog__svg', '.cog__img', '.cog--sm', '.cog--md', '.cog--lg',
    '.product-cogs', '[data-cogs="legacy"]', '[data-cog]', '[class*="cog-"]'
  ];
  const found = document.querySelectorAll<HTMLElement>(selectors.join(','));
  let removed = 0;
  found.forEach((n) => { n.parentElement?.removeChild(n); removed++; });
  // Verify nothing with those selectors remains
  const remaining = document.querySelectorAll(selectors.join(',')).length;
  // Force-hide anything stubborn (shadow roots, portals, etc.)
  if (remaining > 0) {
    document.querySelectorAll<HTMLElement>(selectors.join(',')).forEach((n) => {
      n.style.display = 'none';
      n.style.visibility = 'hidden';
      n.style.opacity = '0';
    });
  }
  // Log concise diagnostics
  // eslint-disable-next-line no-console
  console.info(`[cogs:cleanup] removed=${removed}, remaining=${remaining}`);
  return { removed, remaining };
}
