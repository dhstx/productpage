/**
 * Multi-Agent System Configuration
 * Business categories, leads, agent capabilities, and integrations
 */

export const BUSINESS_CATEGORIES = [
  'Strategy & Leadership',
  'Operations & Project Management',
  'Research & Intelligence',
  'Technical Development',
  'Creative & Design',
  'Marketing & Communications',
  'Customer Relations',
  'Knowledge Management',
  'Financial Operations',
  'Legal & Compliance',
  'Security & Data Protection',
  'Performance & Analytics'
];

export const LEADS = {
  'Strategy & Leadership': 'Commander',
  'Operations & Project Management': 'Conductor',
  'Research & Intelligence': 'Scout',
  'Technical Development': 'Builder',
  'Creative & Design': 'Muse',
  'Marketing & Communications': 'Echo',
  'Customer Relations': 'Connector',
  'Knowledge Management': 'Archivist',
  'Financial Operations': 'Ledger',
  'Legal & Compliance': 'Counselor',
  'Security & Data Protection': 'Sentinel',
  'Performance & Analytics': 'Optimizer',
  'General/Multi-Category': 'Orchestrator'
};

export const AGENT_CAPABILITIES = {
  Orchestrator: {
    primary: ['routing', 'coordination', 'multi-agent-orchestration'],
    integrations: ['all'],
    can_delegate_to: ['Commander', 'Conductor', 'Scout', 'Builder', 'Muse', 'Echo', 'Connector', 'Archivist', 'Ledger', 'Counselor', 'Sentinel', 'Optimizer']
  },
  Commander: {
    primary: ['strategic-planning', 'decision-making', 'goal-setting'],
    integrations: ['notion', 'taskade', 'google-docs'],
    can_delegate_to: ['Conductor', 'Scout', 'Ledger', 'Optimizer']
  },
  Conductor: {
    primary: ['project-management', 'task-coordination', 'workflow-optimization'],
    integrations: ['taskade', 'notion', 'make', 'google-calendar'],
    can_delegate_to: ['Builder', 'Muse', 'Echo', 'Connector']
  },
  Scout: {
    primary: ['research', 'market-analysis', 'competitive-intelligence'],
    integrations: ['explorium', 'pophive', 'hugging-face'],
    can_delegate_to: ['Archivist', 'Optimizer']
  },
  Builder: {
    primary: ['coding', 'technical-architecture', 'development'],
    integrations: ['github', 'vercel', 'cloudflare', 'supabase'],
    can_delegate_to: ['Sentinel', 'Optimizer']
  },
  Muse: {
    primary: ['design', 'branding', 'creative-content'],
    integrations: ['invideo', 'image-generation'],
    can_delegate_to: ['Echo', 'Archivist']
  },
  Echo: {
    primary: ['marketing', 'communications', 'campaigns'],
    integrations: ['taskade', 'notion', 'invideo'],
    can_delegate_to: ['Muse', 'Connector', 'Optimizer']
  },
  Connector: {
    primary: ['customer-relations', 'support', 'engagement'],
    integrations: ['intercom', 'gmail', 'taskade'],
    can_delegate_to: ['Echo', 'Archivist']
  },
  Archivist: {
    primary: ['knowledge-management', 'documentation', 'organization'],
    integrations: ['notion', 'airtable', 'google-docs'],
    can_delegate_to: []
  },
  Ledger: {
    primary: ['financial-analysis', 'budgeting', 'forecasting'],
    integrations: ['stripe', 'airtable', 'supabase'],
    can_delegate_to: ['Optimizer', 'Archivist']
  },
  Counselor: {
    primary: ['legal', 'compliance', 'risk-management'],
    integrations: ['notion', 'airtable'],
    can_delegate_to: ['Archivist', 'Sentinel']
  },
  Sentinel: {
    primary: ['security', 'data-protection', 'threat-detection'],
    integrations: ['cloudflare', 'supabase', 'github'],
    can_delegate_to: []
  },
  Optimizer: {
    primary: ['analytics', 'performance-monitoring', 'efficiency'],
    integrations: ['supabase', 'airtable', 'vercel'],
    can_delegate_to: ['Archivist']
  }
};

export const INTEGRATIONS_LIST = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'infrastructure',
    capabilities: ['dns', 'workers', 'd1', 'r2', 'kv'],
    scopes: ['account:read', 'workers:write', 'dns:edit'],
    status: 'connected'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'payments',
    capabilities: ['payments', 'subscriptions', 'customers', 'invoices'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'taskade',
    name: 'Taskade',
    category: 'productivity',
    capabilities: ['tasks', 'projects', 'workflows', 'collaboration'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'explorium',
    name: 'Explorium',
    category: 'data',
    capabilities: ['business-intelligence', 'prospect-discovery', 'enrichment'],
    scopes: ['read'],
    status: 'connected'
  },
  {
    id: 'invideo',
    name: 'InVideo',
    category: 'media',
    capabilities: ['video-generation', 'templates', 'automation'],
    scopes: ['create'],
    status: 'connected'
  },
  {
    id: 'pophive',
    name: 'PopHIVE',
    category: 'data',
    capabilities: ['public-health-data', 'datasets'],
    scopes: ['read'],
    status: 'connected'
  },
  {
    id: 'intercom',
    name: 'Intercom',
    category: 'customer-support',
    capabilities: ['conversations', 'chats', 'support-automation'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'database',
    capabilities: ['database', 'auth', 'storage', 'realtime'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'productivity',
    capabilities: ['documents', 'databases', 'knowledge-management'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'infrastructure',
    capabilities: ['deployments', 'projects', 'domains', 'logs'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    category: 'ai',
    capabilities: ['models', 'datasets', 'research'],
    scopes: ['read'],
    status: 'connected'
  },
  {
    id: 'airtable',
    name: 'Airtable',
    category: 'database',
    capabilities: ['databases', 'automation', 'collaboration'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'make',
    name: 'Make',
    category: 'automation',
    capabilities: ['workflows', 'scenarios', 'integrations'],
    scopes: ['execute'],
    status: 'connected'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'development',
    capabilities: ['repositories', 'code', 'collaboration'],
    scopes: ['read_write'],
    status: 'connected'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'communication',
    capabilities: ['email', 'send', 'read'],
    scopes: ['read_write'],
    status: 'available'
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'productivity',
    capabilities: ['events', 'scheduling', 'reminders'],
    scopes: ['read_write'],
    status: 'available'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    category: 'productivity',
    capabilities: ['documents', 'collaboration', 'editing'],
    scopes: ['read_write'],
    status: 'available'
  },
  {
    id: 'image-generation',
    name: 'AI Image Generation',
    category: 'media',
    capabilities: ['image-creation', 'editing', 'generation'],
    scopes: ['create'],
    status: 'connected'
  }
];

