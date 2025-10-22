import React, { useState } from 'react';
import { Check, Zap, Users, Building2, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PricingPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly or annual

  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      tokens: 100,
      description: 'Perfect for trying out our AI agents',
      icon: Sparkles,
      color: 'gray',
      features: [
        '100 tokens per month',
        '3 specialized agents',
        'Conversation history',
        'Basic integrations',
        'Community support'
      ],
      limitations: [
        'Limited to Commander, Connector, Conductor',
        'No priority queue',
        'No analytics'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 15,
      tokens: 500,
      description: 'For individuals and freelancers',
      icon: Zap,
      color: 'indigo',
      features: [
        '500 tokens per month (~167 conversations)',
        'All 13 specialized agents',
        'Full integration access',
        'Conversation history',
        'Priority support',
        'Export conversations',
        'Advanced analytics'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 39,
      tokens: 1500,
      description: 'For power users and small teams',
      icon: Users,
      color: 'purple',
      features: [
        '1,500 tokens per month (~500 conversations)',
        'All 13 specialized agents',
        'Priority processing queue',
        'Advanced analytics dashboard',
        'API access (beta)',
        'Export & backup',
        'Priority support',
        'Custom agent configurations'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      id: 'business',
      name: 'Business',
      price: 99,
      tokens: 5000,
      description: 'For growing businesses',
      icon: Building2,
      color: 'blue',
      features: [
        '5,000 tokens per month (~1,667 conversations)',
        'All 13 specialized agents',
        'Team collaboration (up to 5 users)',
        'Custom agent configurations',
        'Dedicated support',
        'SLA guarantees',
        'Advanced API access',
        'White-label options (coming soon)',
        'Priority processing'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      tokens: 10000,
      description: 'For large organizations',
      icon: Crown,
      color: 'amber',
      features: [
        '10,000+ tokens per month (custom)',
        'All 13 specialized agents',
        'Unlimited team members',
        'Custom agent development',
        'White-label solutions',
        'Dedicated infrastructure',
        '24/7 premium support',
        'Custom SLAs',
        'On-premise deployment options'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handleSelectPlan = (tierId) => {
    if (tierId === 'free') {
      navigate('/signup');
    } else if (tierId === 'enterprise') {
      window.location.href = 'mailto:sales@dhstx.co?subject=Enterprise Inquiry';
    } else {
      navigate(`/signup?plan=${tierId}`);
    }
  };

  const getColorClasses = (color, variant = 'bg') => {
    const colors = {
      gray: {
        bg: 'bg-gray-600',
        border: 'border-gray-600',
        text: 'text-gray-600',
        bgLight: 'bg-gray-50'
      },
      indigo: {
        bg: 'bg-indigo-600',
        border: 'border-indigo-600',
        text: 'text-indigo-600',
        bgLight: 'bg-indigo-50'
      },
      purple: {
        bg: 'bg-purple-600',
        border: 'border-purple-600',
        text: 'text-purple-600',
        bgLight: 'bg-purple-50'
      },
      blue: {
        bg: 'bg-blue-600',
        border: 'border-blue-600',
        text: 'text-blue-600',
        bgLight: 'bg-blue-50'
      },
      amber: {
        bg: 'bg-amber-600',
        border: 'border-amber-600',
        text: 'text-amber-600',
        bgLight: 'bg-amber-50'
      }
    };
    return colors[color]?.[variant] || colors.gray[variant];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that's right for you. All plans include access to our powerful AI agents.
          </p>

          {/* Billing Toggle (for future annual billing) */}
          {/* <div className="inline-flex items-center gap-3 bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full transition-all ${
                billingCycle === 'annual'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual <span className="text-xs">(Save 20%)</span>
            </button>
          </div> */}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  tier.popular ? 'ring-2 ring-indigo-600 scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}

                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses(tier.color, 'bgLight')} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${getColorClasses(tier.color, 'text')}`} />
                  </div>

                  {/* Name & Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {tier.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        ${tier.price}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {tier.tokens.toLocaleString()} tokens/month
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(tier.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      tier.popular
                        ? `${getColorClasses(tier.color, 'bg')} text-white hover:opacity-90`
                        : `border-2 ${getColorClasses(tier.color, 'border')} ${getColorClasses(tier.color, 'text')} hover:${getColorClasses(tier.color, 'bg')} hover:text-white`
                    }`}
                  >
                    {tier.cta}
                  </button>

                  {/* Features */}
                  <div className="mt-6 space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className={`w-5 h-5 ${getColorClasses(tier.color, 'text')} flex-shrink-0 mt-0.5`} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What are tokens?
              </h3>
              <p className="text-gray-600">
                Tokens are units of usage that power your conversations with our AI agents. 
                1 token equals approximately 1,000 AI tokens. An average conversation uses about 3-10 tokens 
                depending on complexity.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if I run out of tokens?
              </h3>
              <p className="text-gray-600">
                You can upgrade to a higher tier at any time, or purchase additional tokens as needed. 
                Your tokens reset monthly on your billing cycle date.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate your billing accordingly.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do unused tokens roll over?
              </h3>
              <p className="text-gray-600">
                Currently, unused tokens expire at the end of each billing cycle. We're considering 
                rollover options for future updates based on user feedback.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) through our 
                secure payment processor, Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals using our AI agents to work smarter.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

