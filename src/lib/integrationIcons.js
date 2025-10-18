// Utilities for resolving integration icon slugs and URLs, with sensible fallbacks

// Known slug overrides where SimpleIcons uses a different slug than our id/name
export const ICON_SLUG_OVERRIDES = {
  'google-oauth': 'google',
  'google-calendar': 'googlecalendar',
  'microsoft-teams': 'microsoftteams',
  // Add any additional mappings if ids diverge from SimpleIcons slugs
};

export function normalizeToSlug(idOrName) {
  if (!idOrName) return '';
  // Prefer explicit overrides first
  const lowered = String(idOrName).toLowerCase();
  if (ICON_SLUG_OVERRIDES[lowered]) return ICON_SLUG_OVERRIDES[lowered];
  // Simple heuristics: remove spaces and hyphens
  return lowered.replace(/\s+/g, '').replace(/-/g, '');
}

export function getSimpleIconUrl(slug) {
  if (!slug) return '';
  return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
}

export function getInitials(name) {
  if (!name) return '';
  // Take first and last alphanumeric sequences' initials
  const words = String(name)
    .replace(/[^A-Za-z0-9\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) {
    const w = words[0];
    const letters = w.match(/[A-Za-z]/g) || [w[0]];
    const first = letters[0] || '';
    const last = letters.find((c, idx) => idx > 0) || '';
    return (first + last).slice(0, 2).toUpperCase();
  }
  const first = words[0][0] || '';
  const last = words[words.length - 1][0] || '';
  return (first + last).toUpperCase();
}

// Create a data URL SVG placeholder with initials in currentColor
export function buildInitialsSvgDataUrl(initials, size = 40, fillColor = '#FFFFFF') {
  const safeText = (initials || '').slice(0, 3);
  const fontSize = Math.round(size * 0.5);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<rect width="${size}" height="${size}" fill="none"/>` +
    `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fillColor}" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="700">${safeText}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// Compute color to use for a given variant
export function computeIconColor(brandHex, variant) {
  if (variant === 'brand' && brandHex) return brandHex;
  return '#FFFFFF';
}

// Build a URL for simpleicons dynamic CDN with desired color
// Uses cdn.simpleicons.org which supports /slug/color format
export function getIntegrationIconUrl(nameOrId, variant = 'mono', brandHex) {
  const slug = normalizeToSlug(nameOrId);
  if (slug === 'microsoftteams') {
    return variant === 'brand'
      ? '/assets/integrations/microsoft-teams-brand.svg'
      : '/assets/integrations/microsoft-teams-mono.svg';
  }
  const colorHex = computeIconColor(brandHex, variant).replace('#', '');
  return `https://cdn.simpleicons.org/${slug}/${colorHex}`;
}
