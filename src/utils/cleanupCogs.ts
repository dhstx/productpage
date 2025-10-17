// Finds likely-old cog DOM and removes it. Returns {removed, remaining}.
// Finds legacy cog nodes and removes them. Logs counts for verification.
export function cleanupCogs() {
  const selectors = [
    '.cog', '.cog__svg', '.cog__img', '.cog--sm', '.cog--md', '.cog--lg',
    '.product-cogs', '[data-cogs="legacy"]', '[class*="cog-"]', '.gear', '.gear-row'
  ];
  const q = selectors.join(',');
  const nodes = document.querySelectorAll(q);
  let removed = 0;
  nodes.forEach(n => { n.parentElement?.removeChild(n); removed++; });
  const remaining = document.querySelectorAll(q).length;
  // eslint-disable-next-line no-console
  console.info(`[cogs:cleanup] removed=${removed}, remaining=${remaining}`);
  return { removed, remaining };
}
