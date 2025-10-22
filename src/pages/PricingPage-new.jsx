/**
 * Pricing Page - Updated with PT-based tier structure
 * Shows Freemium, Entry, Pro, Pro Plus, and Business tiers
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Zap, Users, Shield, TrendingUp } from 'lucide-react';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'

  const tiers = [
    {
      name: 'Freemium',
      price: { monthly: 0, annual: 0 },
      description: 'Try our platform risk-free',
      corePT: 100,
      advancedPT: 0,
      features: [
        '100 Core PT/month',
        '1 AI agent',
        'Core models only',
        'Session memory only',
        'Community support',
        'Basic analytics',
      ],
      limitations: [
        'No Advanced models',
        'No team features',
        'No API access',
        'No workflow automation',
      ],
      cta: 'Get Started',
      ctaLink: '/register',
      popular: false,
      color: 'gray',
    },
    {
      name: 'Entry',
      price: { monthly: 19, annual: 192 }, // 2 months free
      description: 'Perfect for individuals getting started',
      corePT: 300,
      advancedPT: 'Add-on only',
      features: [
        '300 Core PT/month',
        '5 AI agents',
        'Core models included',
        'Advanced models (paid add-on)',
        '30-day project memory',
        'Basic workflows (3 max)',
        'CSV export',
        'Email support (48h)',
      ],
      limitations: [
        'No team features',
        'Limited API access',
      ],
      cta: 'Start Entry',
      ctaLink: '/register?tier=entry',
      popular: false,
      color: 'blue',
    },
    {
      name: 'Pro',
      price: { monthly: 49, annual: 490 },
      description: 'For professionals and freelancers',
      corePT: 1000,
      advancedPT: '50 PT metered',
      features: [
        '1,000 Core PT/month',
        '50 Advanced PT (metered)',
        '25 AI agents',
        'All models available',
        '90-day project memory',
        'Advanced workflows (10 max)',
        'Team workspace (1)',
        'Share agents',
        'API access (standard)',
        'Zapier + webhooks',
        'Email support (24h)',
      ],
      limitations: [],
      cta: 'Start Pro',
      ctaLink: '/register?tier=pro',
      popular: true,
      color: 'purple',
    },
    {
      name: 'Pro Plus',
      price: { monthly: 79, annual: 790 },
      description: 'For power users and small teams',
      corePT: 1600,
      advancedPT: '100 PT metered',
      features: [
        '1,600 Core PT/month',
        '100 Advanced PT (metered)',
        '50 AI agents',
        'All models + priority access',
        '180-day project memory',
        'Advanced workflows (25 max)',
        'Team workspaces (3)',
        'Real-time collaboration',
        'API access (2× quota)',
        'Full integrations',
        'Analytics dashboard',
        'Email + chat support (12h)',
      ],
      limitations: [],
      cta: 'Start Pro Plus',
      ctaLink: '/register?tier=proplus',
      popular: false,
      color: 'indigo',
    },
    {
      name: 'Business',
      price: { monthly: 159, annual: 1590 },
      description: 'For teams and growing businesses',
      corePT: 3500,
      advancedPT: '200 PT seat pools',
      features: [
        '3,500 Core PT/month',
        '200 Advanced PT (seat pools)',
        '100 AI agents',
        'All models + dedicated capacity',
        'Unlimited project memory',
        'Unlimited workflows',
        'Unlimited workspaces',
        'Team memory + version control',
        'Admin dashboard',
        'API access (enterprise)',
        'SSO/SAML (coming soon)',
        'Enterprise connectors',
        'Cohort analytics + audit logs',
        'Priority support (4h SLA)',
      ],
      limitations: [],
      cta: 'Start Business',
      ctaLink: '/register?tier=business',
      popular: false,
      color: 'green',
    },
  ];

  const savings = billingCycle === 'annual' ? '17% off' : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {savings && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {savings}
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                tier.popular ? 'border-purple-500' : 'border-gray-200'
              } p-6 flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    ${tier.price[billingCycle]}
                  </span>
                  {tier.price.monthly > 0 && (
                    <span className="ml-2 text-gray-600">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
                {billingCycle === 'annual' && tier.price.monthly > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    ${(tier.price.annual / 12).toFixed(2)}/mo billed annually
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">PT Allocation:</div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    <span>Core PT:</span>
                    <span className="font-medium">{tier.corePT.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Advanced PT:</span>
                    <span className="font-medium">{tier.advancedPT}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
                {tier.limitations.map((limitation, index) => (
                  <li key={`limit-${index}`} className="flex items-start">
                    <X className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={tier.ctaLink}
                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
                  tier.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
          <h2 className="text-3xl font-bold mb-4">Need more? Go Enterprise</h2>
          <p className="text-xl mb-6 opacity-90">
            Custom PT allocations, dedicated support, SLAs, white-label options, and more.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-600 py-3 px-8 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Contact Sales
          </Link>
        </div>

        {/* Feature Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Compare all features</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  {tiers.map((tier) => (
                    <th key={tier.name} className="text-center py-4 px-4 font-semibold text-gray-900">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Core PT/month</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="text-center py-4 px-4 text-gray-600">
                      {tier.corePT.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Advanced PT</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="text-center py-4 px-4 text-gray-600">
                      {tier.advancedPT}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">AI Agents</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="text-center py-4 px-4 text-gray-600">
                      {tier.name === 'Freemium' ? '1' : tier.name === 'Entry' ? '5' : tier.name === 'Pro' ? '25' : tier.name === 'Pro Plus' ? '50' : '100'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Team Workspaces</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="text-center py-4 px-4">
                      {tier.name === 'Pro' ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : 
                       tier.name === 'Pro Plus' || tier.name === 'Business' ? <Check className="h-5 w-5 text-green-500 mx-auto" /> :
                       <X className="h-5 w-5 text-gray-400 mx-auto" />}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">API Access</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="text-center py-4 px-4">
                      {tier.name === 'Freemium' ? <X className="h-5 w-5 text-gray-400 mx-auto" /> :
                       tier.name === 'Entry' ? <span className="text-xs text-gray-500">Limited</span> :
                       <Check className="h-5 w-5 text-green-500 mx-auto" />}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-4 text-gray-700">Support</td>
                  {tiers.map((tier) => (
                    <td key={tier.name} className="text-center py-4 px-4 text-xs text-gray-600">
                      {tier.name === 'Freemium' ? 'Community' :
                       tier.name === 'Entry' ? 'Email (48h)' :
                       tier.name === 'Pro' ? 'Email (24h)' :
                       tier.name === 'Pro Plus' ? 'Email + Chat (12h)' :
                       'Priority (4h)'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What are Platform Tokens (PT)?</h3>
              <p className="text-gray-600">
                PT are our usage currency. Core PT powers standard AI models, while Advanced PT unlocks premium models like GPT-4 and Claude Opus. Each response consumes PT based on length and model complexity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-gray-600">
                Yes! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What happens if I run out of PT?</h3>
              <p className="text-gray-600">
                You can purchase PT top-ups or upgrade to a higher tier. We'll notify you when you reach 80% of your allocation so you're never caught off guard.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do unused PT roll over?</h3>
              <p className="text-gray-600">
                No, PT reset at the start of each billing cycle. However, Pro Plus and Business tiers can purchase rollover credits as an add-on.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our Freemium tier gives you 100 Core PT/month forever, no credit card required. It's the perfect way to try our platform risk-free.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and ACH transfers (for annual plans). Enterprise customers can pay via invoice.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by thousands of users worldwide</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Zap className="h-5 w-5" />
              <span className="text-sm">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">10K+ Active Users</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Growing Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

