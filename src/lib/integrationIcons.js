// Utilities for resolving integration icon URLs and fallbacks

// Known slugs for SimpleIcons CDN
const INTEGRATION_SLUG_MAP = {
  // IDs
  'google-calendar': 'googlecalendar',
  'google-oauth': 'google', // fallback to Google brand
  make: 'make', // Make (formerly Integromat)
  'make-integromat': 'make',
  integromat: 'make',
  'microsoft-teams': 'microsoftteams',
  notion: 'notion',
  salesforce: 'salesforce',
  sendgrid: 'sendgrid',
  slack: 'slack',
  stripe: 'stripe',
  supabase: 'supabase',
  zapier: 'zapier',
  hubspot: 'hubspot',

  // Names (lowercased)
  'google calendar': 'googlecalendar',
  'google oauth': 'google',
  'make (integromat)': 'make',
  'microsoft teams': 'microsoftteams',
};

function normalize(text) {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getIntegrationSlug(idOrName, altName) {
  const idKey = normalize(idOrName).replace(/-/g, '');
  const nameKey = normalize(altName || idOrName);

  // Try exact map matches first (by id and by name)
  if (INTEGRATION_SLUG_MAP[idOrName]) return INTEGRATION_SLUG_MAP[idOrName];
  if (INTEGRATION_SLUG_MAP[altName]) return INTEGRATION_SLUG_MAP[altName];
  if (INTEGRATION_SLUG_MAP[nameKey]) return INTEGRATION_SLUG_MAP[nameKey];

  // Common transformations for SimpleIcons slugs (remove hyphens for some brands like microsoftteams)
  const simpleIconsGuess = normalize(altName || idOrName).replace(/-/g, '');

  // Prefer guessing based on name when available
  const guess = (altName ? simpleIconsGuess : idKey) || simpleIconsGuess;
  return guess || null;
}

// Prefer cdn.simpleicons.org which supports color parameter and returns SVG
export function getIntegrationIconUrl(slug, variant = 'brand') {
  if (!slug) return null;
  // brand: default brand color from CDN; mono: force white
  const isMono = variant === 'mono';
  const color = isMono ? '/ffffff' : '';
  return `https://cdn.simpleicons.org/${slug}${color}`;
}

export function getInitialsFromName(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] || '';
  const second = parts.length > 1 ? parts[1]?.[0] || '' : (parts[0]?.[1] || '');
  return (first + second).toUpperCase();
}
