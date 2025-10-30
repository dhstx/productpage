import { useState, useEffect } from 'react';
import BackArrow from '../components/BackArrow';
import PageHeading from '../components/PageHeading';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../lib/auth';
import { 
  getIntegrationIconUrl,
  getInitials,
  buildInitialsSvgDataUrl,
  computeIconColor,
} from '../lib/integrationIcons';
import { 
  Check, X, Settings, ExternalLink, Zap, Database, 
  Mail, MessageSquare, Calendar, DollarSign, Users,
  FileText, BarChart, Cloud, Lock, Webhook
} from 'lucide-react';

export default function IntegrationsManagement() {
  const [filter, setFilter] = useState('all');
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  const integrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Calendar and scheduling integration',
      category: 'productivity',
      icon: Calendar,
      color: '#4285F4',
      connected: false,
      status: 'available',
      features: ['Event scheduling', 'Meeting reminders', 'Calendar sync']
    },
    {
      id: 'google-oauth',
      name: 'Google OAuth',
      description: 'Single sign-on with Google accounts',
      category: 'auth',
      icon: Lock,
      color: '#4285F4',
      connected: false,
      status: 'available',
      features: ['SSO authentication', 'User management', 'Secure login']
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Marketing and CRM platform',
      category: 'crm',
      icon: BarChart,
      color: '#FF7A59',
      connected: false,
      status: 'available',
      features: ['Marketing automation', 'Contact management', 'Analytics']
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      description: 'Advanced workflow automation',
      category: 'automation',
      icon: Webhook,
      color: '#6D3BFF',
      connected: false,
      status: 'available',
      features: ['Visual workflow builder', 'Complex scenarios', 'API connections']
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Enterprise communication platform',
      category: 'communication',
      icon: Users,
      color: '#505AC9',
      connected: false,
      status: 'available',
      features: ['Team channels', 'Meeting integration', 'File sharing']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Workspace and documentation',
      category: 'productivity',
      icon: FileText,
      color: '#000000',
      connected: false,
      status: 'available',
      features: ['Documentation sync', 'Database integration', 'Team wiki']
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM and sales management',
      category: 'crm',
      icon: Cloud,
      color: '#00A1E0',
      connected: false,
      status: 'available',
      features: ['Contact management', 'Lead tracking', 'Sales pipeline']
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email delivery and marketing',
      category: 'communication',
      icon: Mail,
      color: '#1A82E2',
      connected: false,
      status: 'available',
      features: ['Transactional emails', 'Email templates', 'Analytics']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Team communication and notifications',
      category: 'communication',
      icon: MessageSquare,
      color: '#4A154B',
      connected: false,
      status: 'available',
      features: ['Real-time notifications', 'Channel integration', 'Bot commands']
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      category: 'payments',
      icon: DollarSign,
      color: '#635BFF',
      connected: true,
      status: 'active',
      features: ['Subscription billing', 'Payment processing', 'Invoice generation']
    },
    {
      id: 'supabase',
      name: 'Supabase',
      description: 'Backend database and authentication',
      category: 'database',
      icon: Database,
      color: '#3ECF8E',
      connected: true,
      status: 'active',
      features: ['PostgreSQL database', 'Real-time subscriptions', 'Row-level security']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Workflow automation platform',
      category: 'automation',
      icon: Zap,
      color: '#FF4A00',
      connected: false,
      status: 'available',
      features: ['5000+ app integrations', 'Automated workflows', 'Trigger actions']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Integrations' },
    { id: 'payments', name: 'Payments' },
    { id: 'database', name: 'Database' },
    { id: 'auth', name: 'Authentication' },
    { id: 'communication', name: 'Communication' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'crm', name: 'CRM' },
    { id: 'automation', name: 'Automation' }
  ];

  const filteredIntegrations = filter === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === filter);

  const connectedCount = integrations.filter(i => i.connected).length;

  return (
    <div className="space-y-8">
      <BackArrow />
      <div>
        <PageHeading className="mb-2 uppercase tracking-tight">INTEGRATIONS</PageHeading>
        <p className="text-[#B3B3B3]">
          Connect your favorite tools and automate your workflow
        </p>
      </div>

      {/* Stats - 3-wide on mobile, icons removed */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <p className="text-[10px] md:text-[11px] uppercase tracking-wider text-[color:var(--muted)]">Connected</p>
          <p className="text-base md:text-lg font-semibold text-[color:var(--text)]">{connectedCount} / 20</p>
        </div>
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <p className="text-[10px] md:text-[11px] uppercase tracking-wider text-[color:var(--muted)]">Available</p>
          <p className="text-base md:text-lg font-semibold text-[color:var(--text)]">{integrations.length - connectedCount}</p>
        </div>
        <div className="rounded-xl border bg-[color:var(--panel)] p-3 text-center">
          <p className="text-[10px] md:text-[11px] uppercase tracking-wider text-[color:var(--muted)]">Total</p>
          <p className="text-base md:text-lg font-semibold text-[color:var(--text)]">{integrations.length}</p>
        </div>
      </div>

      {/* User Limits Notice - Only show for non-admin users */}
      {!isAdmin && (
        <div className="panel-system p-4 border border-[#FFC96C]/30 bg-[#FFC96C]/5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-[#FFC96C] flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-[#F2F2F2] font-bold text-sm mb-1">User Plan Limits</h3>
                <p className="text-[#B3B3B3] text-sm">
                  Your current plan allows: <span className="text-[#FFC96C] font-semibold">1 Agent</span>, <span className="text-[#FFC96C] font-semibold">10 Workflows</span>, <span className="text-[#FFC96C] font-semibold">1 Team License</span>, and <span className="text-[#FFC96C] font-semibold">20 Connections</span>.
                </p>
              </div>
            </div>
            <Link 
              to="/settings"
              className="btn-system text-sm"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-[2px] text-sm font-medium transition-colors ${
              filter === cat.id
                ? 'bg-[#FFC96C] text-[#0C0C0C]'
                : 'bg-[#161616] text-[#B3B3B3] border border-[#202020] hover:bg-[#1A1A1A] hover:text-[#F2F2F2]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Integrations Grid - Custom Integration First */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Custom Integration Card - Always First */}
        <div className="panel-system p-6 border-2 border-dashed border-[#FFC96C]/30 hover:border-[#FFC96C] transition-colors">
          <div className="flex flex-col items-center justify-center text-center h-full min-h-[200px]">
            <Webhook className="w-12 h-12 text-[#FFC96C] mb-4" />
            <h3 className="text-[#F2F2F2] font-bold uppercase tracking-tight mb-2">
              CUSTOM INTEGRATION
            </h3>
            <p className="text-[#B3B3B3] text-sm mb-4">
              Need a specific integration? We can build custom connectors for your workflow.
            </p>
            <button className="btn-system text-sm">
              Request Integration
            </button>
          </div>
        </div>

        {/* Regular Integrations - Alphabetically Sorted */}
        {filteredIntegrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}

function IntegrationCard({ integration }) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  const variant = (isHovered || integration.connected) ? 'brand' : 'mono';

  useEffect(() => {
    const url = getIntegrationIconUrl(integration.id || integration.name, variant, integration.color);
    setImgSrc(url);
  }, [integration.id, integration.name, integration.color, variant]);

  const handleConnect = () => {
    alert(`Connecting to ${integration.name}...`);
  };

  const handleDisconnect = () => {
    if (confirm(`Disconnect from ${integration.name}?`)) {
      alert(`Disconnected from ${integration.name}`);
    }
  };

  const handleConfigure = () => {
    setIsConfiguring(!isConfiguring);
  };

  return (
    <div 
      className="panel-system p-6 hover:border-[#FFC96C] transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-[4px] flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: `${integration.color}20` }}
          >
            <img 
              src={imgSrc}
              alt={`${integration.name} logo`}
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              onError={() => {
                const initials = getInitials(integration.name);
                const color = computeIconColor(integration.color, variant);
                setImgSrc(buildInitialsSvgDataUrl(initials, 40, color));
              }}
            />
          </div>
          <div>
            <h3 className="text-[#F2F2F2] font-bold uppercase tracking-tight">
              {integration.name}
            </h3>
            {integration.connected && (
              <span className="inline-flex items-center gap-1 text-xs text-[#10B981]">
                <Check className="w-3 h-3" />
                Connected
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-[#B3B3B3] text-sm mb-4">
        {integration.description}
      </p>

      <div className="space-y-2 mb-4">
        {integration.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-[#808080]">
            <Check className="w-3 h-3 text-[#FFC96C]" />
            {feature}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {integration.connected ? (
          <>
            {(integration.id === 'stripe' || integration.id === 'supabase') ? (
              <Link
                to={integration.id === 'stripe' ? '/billing' : '/platforms'}
                className="flex-1 px-3 py-2 bg-[#202020] rounded-[2px] text-[#F2F2F2] text-sm font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Manage
              </Link>
            ) : (
              <button
                onClick={handleConfigure}
                className="flex-1 px-3 py-2 bg-[#202020] rounded-[2px] text-[#F2F2F2] text-sm font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configure
              </button>
            )}
            <button
              onClick={handleDisconnect}
              className="px-3 py-2 bg-red-900/20 border border-red-900 rounded-[2px] text-red-400 text-sm font-medium hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={handleConnect}
            className="flex-1 btn-system text-sm"
          >
            Connect
          </button>
        )}
        <a
          href={`https://${integration.id}.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 bg-[#202020] rounded-[2px] text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#2A2A2A] transition-colors flex items-center justify-center"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {isConfiguring && (
        <div className="mt-4 pt-4 border-t border-[#202020]">
          <p className="text-[#B3B3B3] text-xs mb-2 uppercase tracking-tight">
            Configuration
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="API Key"
              className="w-full px-3 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] text-sm focus:outline-none focus:border-[#FFC96C] transition-colors"
            />
            <button className="w-full btn-system text-sm">
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

