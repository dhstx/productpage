import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

// TODO: Replace client-side search with backend-powered search endpoint
// (e.g., /api/search?q=...) and incremental static search index.

const PAGES = [
  { title: 'Home', path: '/' },
  { title: 'Product', path: '/product' },
  { title: 'Integrations', path: '/integrations' },
  { title: 'Security', path: '/security' },
  { title: 'Changelog', path: '/changelog' },
  { title: 'System Status', path: '/status' },
  { title: 'Pricing', path: '/pricing' },
  { title: 'Contact', path: '/contact' },
  // Feature detail pages
  { title: 'Feature: Strategic Planning', path: '/features/strategic-planning' },
  { title: 'Feature: Member Engagement', path: '/features/member-engagement' },
  { title: 'Feature: Event Management', path: '/features/event-management' },
  { title: 'Feature: AI-Powered Insights', path: '/features/ai-powered-insights' },
];

const AGENTS = [
  { title: 'Strategic Advisor', path: '/agents' },
  { title: 'Engagement Analyst', path: '/agents' },
  { title: 'Operations Assistant', path: '/agents' },
];

const INTEGRATIONS = [
  'Slack', 'Microsoft Teams', 'Google Workspace', 'Salesforce', 'HubSpot', 'Mailchimp',
  'Zapier', 'Stripe', 'QuickBooks', 'Zoom', 'DocuSign', 'Dropbox'
].map(name => ({ title: `${name} Integration`, path: '/integrations' }));

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const all = [
      ...PAGES.map(x => ({ ...x, type: 'Page' })),
      ...AGENTS.map(x => ({ ...x, type: 'Agent' })),
      ...INTEGRATIONS.map(x => ({ ...x, type: 'Integration' })),
    ];
    return all.filter(item => item.title.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(results[0].path);
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search" aria-label="Site search">
        <div className="flex items-center gap-2 rounded-[4px] border border-[#202020] bg-[#0C0C0C] px-3 py-2 text-[#e0e0e0] focus-within:border-[#FFC96C]">
          <Search className="h-4 w-4 text-[#B3B3B3]" aria-hidden="true" />
          <input
            aria-label="Search"
            placeholder="Search agents, integrations, pages..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="w-56 bg-transparent text-sm outline-none placeholder:text-[#8a8a8a] sm:w-72"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[4px] border border-[#202020] bg-[#0C0C0C] shadow-xl">
          <ul className="max-h-64 overflow-auto py-2">
            {results.map((item, idx) => (
              <li key={`${item.type}-${item.title}-${idx}`}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { navigate(item.path); setOpen(false); setQuery(''); }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#e0e0e0] hover:bg-[#1A1A1A]"
                >
                  <span className="truncate">{item.title}</span>
                  <span className="ml-3 shrink-0 text-xs uppercase tracking-wide text-[#B3B3B3]">{item.type}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
