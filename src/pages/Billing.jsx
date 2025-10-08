import { CreditCard, Check, Zap, AlertCircle } from 'lucide-react';
import { getCurrentUser, canUpgrade } from '../lib/auth';
import { getAllPricingTiers, getPricingTier } from '../lib/pricing';
import { useState } from 'react';

export default function Billing() {
  const user = getCurrentUser();
  const currentTier = getPricingTier(user?.subscription || 'free');
  const pricingTiers = getAllPricingTiers();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgrade = (tier) => {
    if (tier.id === 'enterprise') {
      alert('Please contact our sales team at sales@dhstx.com to discuss Enterprise pricing and features.');
    } else {
      alert(`Upgrading to ${tier.name} plan...\n\nThis would redirect to Stripe checkout.`);
    }
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?\n\nYour access will continue until the end of the current billing period.')) {
      alert('Subscription cancellation scheduled.\n\nYou will receive a confirmation email shortly.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          {canUpgrade() ? 'UPGRADE YOUR PLAN' : 'BILLING & SUBSCRIPTION'}
        </h1>
        <p className="text-[#B3B3B3]">
          {canUpgrade() 
            ? 'Choose the perfect plan for your organization\'s needs'
            : 'Manage your subscription, payment methods, and billing history'}
        </p>
      </div>

      {/* Current Plan Status */}
      {user && (
        <section className="panel-system p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
                  CURRENT PLAN: {currentTier.name}
                </h2>
                {currentTier.highlighted && (
                  <span className="px-2 py-1 bg-[#FFC96C]/10 border border-[#FFC96C] rounded-[2px] text-[#FFC96C] text-xs font-bold uppercase">
                    MOST POPULAR
                  </span>
                )}
              </div>
              <p className="text-[#B3B3B3] mb-4">{currentTier.description}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-[#F2F2F2]">
                  ${currentTier.price}
                </span>
                <span className="text-[#B3B3B3]">/{currentTier.billingPeriod}</span>
              </div>
            </div>
            {canUpgrade() && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="btn-system flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Upgrade Plan
              </button>
            )}
          </div>

          {/* Current Plan Features */}
          <div className="mt-6 pt-6 border-t border-[#202020]">
            <h3 className="text-sm font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
              YOUR CURRENT FEATURES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentTier.featureList.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#FFC96C] mt-0.5 flex-shrink-0" />
                  <span className="text-[#B3B3B3] text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mt-6 pt-6 border-t border-[#202020]">
            <h3 className="text-sm font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">
              CURRENT USAGE
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <UsageStat 
                label="AI Agents" 
                current={currentTier.features.agents === 'unlimited' ? '∞' : '3'}
                limit={currentTier.features.agents}
              />
              <UsageStat 
                label="Workflows" 
                current={currentTier.features.workflows === 'unlimited' ? '∞' : '12'}
                limit={currentTier.features.workflows}
              />
              <UsageStat 
                label="Connections" 
                current={currentTier.features.connections === 'unlimited' ? '∞' : '47'}
                limit={currentTier.features.connections}
              />
              <UsageStat 
                label="Team Licenses" 
                current={currentTier.features.teamLicenses === 'unlimited' ? '∞' : '8'}
                limit={currentTier.features.teamLicenses}
              />
            </div>
          </div>

          {user.subscription !== 'free' && (
            <div className="mt-6 pt-6 border-t border-[#202020] flex gap-4">
              <button
                onClick={handleCancelSubscription}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </section>
      )}

      {/* Pricing Tiers */}
      <section>
        <h2 className="text-2xl font-bold text-[#F2F2F2] mb-6 uppercase tracking-tight text-center">
          {canUpgrade() ? 'CHOOSE YOUR PLAN' : 'ALL AVAILABLE PLANS'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              currentTier={currentTier.id}
              onUpgrade={handleUpgrade}
            />
          ))}
        </div>
      </section>

      {/* Payment Method (for paid plans) */}
      {user && user.subscription !== 'free' && (
        <section className="panel-system p-6">
          <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            PAYMENT METHOD
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[4px] bg-[#202020] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#FFC96C]" />
              </div>
              <div>
                <p className="text-[#F2F2F2] font-medium">•••• •••• •••• 4242</p>
                <p className="text-[#B3B3B3] text-sm">Expires 12/2025</p>
              </div>
            </div>
            <button className="btn-system">
              Update Payment
            </button>
          </div>
        </section>
      )}

      {/* Billing History (for paid plans) */}
      {user && user.subscription !== 'free' && (
        <section className="panel-system p-6">
          <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            BILLING HISTORY
          </h2>
          <div className="space-y-3">
            {[
              { date: 'Oct 1, 2025', amount: currentTier.price, status: 'Paid' },
              { date: 'Sep 1, 2025', amount: currentTier.price, status: 'Paid' },
              { date: 'Aug 1, 2025', amount: currentTier.price, status: 'Paid' }
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-[#202020] last:border-0">
                <div>
                  <p className="text-[#F2F2F2] font-medium">{invoice.date}</p>
                  <p className="text-[#B3B3B3] text-sm">Monthly subscription</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#F2F2F2] font-bold">${invoice.amount}</span>
                  <span className="px-2 py-1 bg-green-900/20 border border-green-900 rounded-[2px] text-green-400 text-xs font-bold">
                    {invoice.status}
                  </span>
                  <button className="text-[#FFC96C] hover:text-[#FFD700] text-sm font-medium transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PricingCard({ tier, currentTier, onUpgrade }) {
  const isCurrent = tier.id === currentTier;
  const isDowngrade = ['free', 'starter', 'professional', 'enterprise'].indexOf(tier.id) < 
                      ['free', 'starter', 'professional', 'enterprise'].indexOf(currentTier);

  return (
    <div className={`panel-system p-6 flex flex-col ${tier.highlighted ? 'border-2 border-[#FFC96C]' : ''}`}>
      {tier.highlighted && (
        <div className="mb-4 -mt-2 -mx-2">
          <span className="inline-block px-3 py-1 bg-[#FFC96C] text-[#0C0C0C] text-xs font-bold uppercase rounded-[2px]">
            MOST POPULAR
          </span>
        </div>
      )}
      
      <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
        {tier.name}
      </h3>
      <p className="text-[#B3B3B3] text-sm mb-4">{tier.description}</p>
      
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-[#F2F2F2]">${tier.price}</span>
          <span className="text-[#B3B3B3]">/{tier.billingPeriod}</span>
        </div>
      </div>

      <ul className="space-y-2 mb-6 flex-grow">
        {tier.featureList.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-[#FFC96C] mt-0.5 flex-shrink-0" />
            <span className="text-[#B3B3B3] text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <button disabled className="btn-system w-full opacity-50 cursor-not-allowed">
          Current Plan
        </button>
      ) : isDowngrade ? (
        <button disabled className="btn-system w-full opacity-50 cursor-not-allowed">
          Downgrade
        </button>
      ) : (
        <button
          onClick={() => onUpgrade(tier)}
          className="btn-system w-full"
        >
          {tier.cta}
        </button>
      )}
    </div>
  );
}

function UsageStat({ label, current, limit }) {
  const percentage = limit === 'unlimited' ? 0 : (parseInt(current) / parseInt(limit)) * 100;
  const isNearLimit = percentage > 80;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[#B3B3B3] text-xs uppercase tracking-tight">{label}</span>
        {isNearLimit && limit !== 'unlimited' && (
          <AlertCircle className="w-3 h-3 text-yellow-500" />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-[#F2F2F2]">{current}</span>
        <span className="text-[#B3B3B3] text-sm">
          / {limit === 'unlimited' ? '∞' : limit}
        </span>
      </div>
      {limit !== 'unlimited' && (
        <div className="mt-2 h-1 bg-[#202020] rounded-full overflow-hidden">
          <div 
            className={`h-full ${isNearLimit ? 'bg-yellow-500' : 'bg-[#FFC96C]'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
