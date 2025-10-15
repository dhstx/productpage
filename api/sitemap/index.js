const PUBLIC_ROUTES = [
  '/',
  '/product',
  '/integrations',
  '/security',
  '/status',
  '/changelog',
  '/pricing',
  '/contact',
  '/features/strategic-planning',
  '/features/member-engagement',
  '/features/event-management',
  '/features/ai-powered-insights',
  '/policies/terms',
  '/policies/privacy',
  '/policies/cookies',
  '/use-cases/healthcare',
  '/use-cases/education',
  '/use-cases/nonprofit',
];

export function generateSitemapXml({ baseUrl }) {
  const now = new Date().toISOString();
  const urls = PUBLIC_ROUTES.map((path) => {
    return `    <url>\n      <loc>${baseUrl}${path}</loc>\n      <lastmod>${now}</lastmod>\n      <changefreq>weekly</changefreq>\n      <priority>${path === '/' ? '1.0' : '0.7'}</priority>\n    </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
