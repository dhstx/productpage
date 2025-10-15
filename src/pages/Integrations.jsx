import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import { usePageMeta } from '../lib/seo';
import BackArrow from '../components/BackArrow';
import { Plug, Code, Webhook, Zap, ExternalLink, CheckCircle, ArrowRight } from 'lucide-react';

export default function Integrations() {
  usePageMeta(
    'Integrations – DHStx',
    'Connect DHStx with Slack, Salesforce, Google Workspace, Stripe, and more.'
  );
  const integrations = [
    {
      name: 'Slack',
      category: 'Communication',
      description: 'Real-time notifications and team collaboration',
      logo: '💬',
      popular: true,
      features: ['Instant notifications', 'Channel integration', 'Bot commands']
    },
    {
      name: 'Microsoft Teams',
      category: 'Communication',
      description: 'Enterprise communication and collaboration',
      logo: '👥',
      popular: true,
      features: ['Team channels', 'Meeting integration', 'File sharing']
    },
    {
      name: 'Google Workspace',
      category: 'Productivity',
      description: 'Gmail, Calendar, Drive, and Docs integration',
      logo: '📧',
      popular: true,
      features: ['Calendar sync', 'Drive storage', 'Email integration']
    },
    {
      name: 'Salesforce',
      category: 'CRM',
      description: 'Customer relationship management sync',
      logo: '☁️',
      popular: false,
      features: ['Contact sync', 'Deal tracking', 'Custom objects']
    },
    {
      name: 'HubSpot',
      category: 'CRM',
      description: 'Marketing and sales automation',
      logo: '🎯',
      popular: false,
      features: ['Lead tracking', 'Email campaigns', 'Analytics']
    },
    {
      name: 'Mailchimp',
      category: 'Email Marketing',
      description: 'Email campaign management',
      logo: '📮',
      popular: false,
      features: ['List management', 'Campaign automation', 'Analytics']
    },
    {
      name: 'Zapier',
      category: 'Automation',
      description: 'Connect to 5,000+ apps with no code',
      logo: '⚡',
      popular: true,
      features: ['No-code automation', '5,000+ apps', 'Custom workflows']
    },
    {
      name: 'Stripe',
      category: 'Payments',
      description: 'Payment processing and billing',
      logo: '💳',
      popular: true,
      features: ['Payment processing', 'Subscription billing', 'Invoicing']
    },
    {
      name: 'QuickBooks',
      category: 'Accounting',
      description: 'Financial management and reporting',
      logo: '💰',
      popular: false,
      features: ['Invoice sync', 'Expense tracking', 'Financial reports']
    },
    {
      name: 'Zoom',
      category: 'Video Conferencing',
      description: 'Virtual meetings and webinars',
      logo: '🎥',
      popular: false,
      features: ['Meeting scheduling', 'Recording integration', 'Webinar support']
    },
    {
      name: 'DocuSign',
      category: 'Documents',
      description: 'Electronic signature and document management',
      logo: '✍️',
      popular: false,
      features: ['E-signatures', 'Document tracking', 'Template library']
    },
    {
      name: 'Dropbox',
      category: 'Storage',
      description: 'Cloud file storage and sharing',
      logo: '📦',
      popular: false,
      features: ['File sync', 'Team folders', 'Version control']
    }
  ];

  const categories = ['All', 'Communication', 'Productivity', 'CRM', 'Automation', 'Payments', 'Accounting', 'Video Conferencing', 'Documents', 'Storage', 'Email Marketing'];

  return (
    <div className="min-h-screen w-full max-w-screen overflow-x-hidden min-w-0 bg-[#0C0C0C]">
      <BackArrow />
      {/* Page header removed; GlobalNav used */}

      {/* Hero */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] rounded-[4px] border border-[#202020] mb-6">
              <Plug className="w-4 h-4 text-[#FFC96C]" />
              <span className="text-[#FFC96C] text-sm uppercase tracking-tight font-bold">Integrations</span>
            </div>
            <h1 className="h1 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              CONNECT YOUR TOOLS
            </h1>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              Seamlessly integrate with the tools your team already uses. No disruption, just enhanced productivity.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/product" className="btn-primary">
                View All Features
              </Link>
              <a href="#api" className="btn-system flex items-center gap-2">
                <Code className="w-4 h-4" />
                API Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFC96C] mb-2">50+</div>
              <div className="text-[#B3B3B3]">Native Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFC96C] mb-2">5,000+</div>
              <div className="text-[#B3B3B3]">Via Zapier</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFC96C] mb-2">REST API</div>
              <div className="text-[#B3B3B3]">Full API Access</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFC96C] mb-2">Webhooks</div>
              <div className="text-[#B3B3B3]">Real-time Events</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Integrations */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="h2 font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight text-balance">
                POPULAR INTEGRATIONS
              </h2>
              <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
                Connect with the tools your team uses every day
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {integrations.filter(int => int.popular).map((integration, index) => (
                <div key={index} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{integration.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">{integration.name}</h3>
                        <span className="text-xs text-[#B3B3B3] uppercase">{integration.category}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-[#FFC96C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[#B3B3B3] mb-4">{integration.description}</p>
                  <ul className="space-y-2">
                    {integration.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-4 w-full btn-system text-sm">
                    Connect {integration.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Integrations */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="h2 font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight text-balance">
                ALL INTEGRATIONS
              </h2>
              <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
                Browse our complete integration library
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-[4px] border text-sm uppercase tracking-tight font-bold transition-colors ${
                    index === 0
                      ? 'bg-[#FFC96C] text-[#0C0C0C] border-[#FFC96C]'
                      : 'bg-[#1A1A1A] text-[#F2F2F2] border-[#202020] hover:border-[#FFC96C]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {integrations.map((integration, index) => (
                <div key={index} className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 hover:border-[#FFC96C] transition-colors text-center group cursor-pointer">
                  <div className="text-5xl mb-3">{integration.logo}</div>
                  <h3 className="text-lg font-bold text-[#F2F2F2] mb-1 uppercase tracking-tight">{integration.name}</h3>
                  <span className="text-xs text-[#B3B3B3] uppercase">{integration.category}</span>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[#FFC96C] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API & Webhooks */}
      <section id="api" className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="h2 font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight text-balance">
                API & WEBHOOKS
              </h2>
              <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] text-pretty">
                Build custom integrations with our powerful API
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* REST API */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      REST API
                    </h3>
                    <p className="text-[#B3B3B3] mb-4">
                      Complete programmatic access to all platform features. RESTful endpoints with JSON responses.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        RESTful architecture
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        OAuth 2.0 authentication
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Rate limiting: 10,000 req/hour
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Comprehensive documentation
                      </li>
                    </ul>
                    <a href="#" className="btn-primary inline-flex items-center gap-2">
                      <Code className="w-4 h-4" />
                      View API Docs
                    </a>
                  </div>
                </div>
              </div>

              {/* Webhooks */}
              <div className="bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] bg-[#FFC96C] flex items-center justify-center flex-shrink-0">
                    <Webhook className="w-6 h-6 text-[#0C0C0C]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
                      WEBHOOKS
                    </h3>
                    <p className="text-[#B3B3B3] mb-4">
                      Real-time event notifications sent to your endpoints. Build reactive integrations.
                    </p>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Real-time event delivery
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        HMAC signature verification
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Automatic retry logic
                      </li>
                      <li className="flex items-center gap-2 text-[#F2F2F2]">
                        <CheckCircle className="w-4 h-4 text-[#4CAF50]" />
                        Event filtering
                      </li>
                    </ul>
                    <a href="#" className="btn-primary inline-flex items-center gap-2">
                      <Webhook className="w-4 h-4" />
                      Setup Webhooks
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="mt-12 bg-[#1A1A1A] rounded-[4px] border border-[#202020] p-6 sm:p-8 overflow-x-auto">
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">Quick Start Example</h3>
              <div className="bg-[#0C0C0C] rounded-[4px] p-6 font-mono text-sm text-[#4CAF50] overflow-x-auto">
                <pre>{`curl -X GET https://api.dhstx.com/v1/platforms \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

{
  "platforms": [
    {
      "id": "plt_1234567890",
      "name": "Main Portal",
      "status": "active",
      "users": 50
    }
  ]
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zapier */}
      <section className="py-24 border-b border-[#202020]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">⚡</div>
            <h2 className="h2 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              CONNECT TO 5,000+ APPS WITH ZAPIER
            </h2>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              No coding required. Create powerful automations between DHStx and your favorite apps in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://zapier.com" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Explore Zapier Integration
              </a>
              <Link to="/product" className="btn-system">
                View Platform Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="h2 font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-balance">
              NEED A CUSTOM INTEGRATION?
            </h2>
            <p className="text-[clamp(1rem,3.5vw,1.25rem)] text-[#B3B3B3] mb-8 text-pretty">
              Our team can help you build custom integrations tailored to your organization's needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:integrations@dhstx.com" className="btn-primary">
                Contact Integration Team
              </a>
              <Link to="/security" className="btn-system">
                View Security Details
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#202020]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center text-[#B3B3B3] text-sm">
            <p>© 2025 DHStx. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/security" className="hover:text-[#FFC96C]">Security</Link>
              <Link to="/integrations" className="hover:text-[#FFC96C]">Integrations</Link>
              <a href="#" className="hover:text-[#FFC96C]">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
