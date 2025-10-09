import { useState } from 'react';
import { X, Check } from 'lucide-react';

const plans = {
  starter: {
    name: 'Starter',
    price: 999,
    features: [
      'Up to 50 members',
      '5 GB storage',
      'Basic analytics',
      'Email support',
      'Mobile app access',
      'Standard integrations'
    ]
  },
  pro: {
    name: 'Professional',
    price: 2499,
    features: [
      'Up to 200 members',
      '50 GB storage',
      'Advanced analytics',
      'Priority support (4hr response)',
      'Mobile app access',
      'Advanced integrations',
      'Custom branding',
      'API access'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 5999,
    features: [
      'Unlimited members',
      'Unlimited storage',
      'Enterprise analytics',
      '24/7 dedicated support',
      'Mobile app access',
      'All integrations',
      'Custom branding',
      'Full API access',
      'White-glove onboarding',
      'Dedicated account manager',
      'Custom SLA'
    ]
  }
};

export default function BillingModal({ isOpen, onClose, userPlan = 'free' }) {
  const [selectedPlan, setSelectedPlan] = useState('enterprise');
  
  if (!isOpen) return null;

  const isPaidUser = userPlan !== 'free';
  const modalTitle = isPaidUser ? 'Billing' : 'Upgrade to DHStx';

  const handleUpgrade = (plan) => {
    console.log('Upgrade to:', plan);
    // TODO: Implement actual upgrade logic
    alert(`Upgrading to ${plans[plan].name} plan`);
  };

  const handleChangePlan = (plan) => {
    console.log('Change plan to:', plan);
    // TODO: Implement actual plan change logic
    alert(`Changing to ${plans[plan].name} plan`);
  };

  const openBillingPortal = () => {
    console.log('Opening billing portal');
    // TODO: Implement actual billing portal redirect
    alert('Opening billing portal...');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      onKeyDown={handleEscape}
      tabIndex={-1}
    >
      <div className="bg-[#1A1A1A] border border-[#202020] rounded-[4px] shadow-2xl w-full max-w-5xl my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B3B3B3] hover:text-[#F2F2F2] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="border-b border-[#202020] p-6">
          <h2 className="text-2xl font-bold text-[#F2F2F2] uppercase tracking-tight">
            {modalTitle}
          </h2>
          {!isPaidUser && (
            <p className="text-[#B3B3B3] mt-2">
              Choose the plan that's right for your organization
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => {
              const isSelected = selectedPlan === key;
              const isEnterprise = key === 'enterprise';
              
              return (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`
                    relative cursor-pointer rounded-[4px] border-2 transition-all
                    ${isSelected 
                      ? 'border-[#FFC96C] bg-[#FFC96C]/5' 
                      : 'border-[#202020] bg-[#0C0C0C] hover:border-[#404040]'
                    }
                    ${isEnterprise ? 'md:scale-105' : ''}
                  `}
                >
                  {isEnterprise && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FFC96C] text-[#0C0C0C] px-3 py-1 rounded-[2px] text-xs font-bold uppercase tracking-tight">
                      Recommended
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-[#F2F2F2] font-bold text-lg uppercase tracking-tight mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-[#FFC96C]">
                        ${(plan.price / 100).toFixed(0)}
                      </span>
                      <span className="text-[#B3B3B3] text-sm ml-2">/month</span>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[#B3B3B3] text-sm">
                          <Check className="w-4 h-4 text-[#FFC96C] mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#202020] p-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-[#B3B3B3] text-sm">
            {isPaidUser ? (
              <span>Current plan: <span className="text-[#FFC96C] font-bold">{userPlan}</span></span>
            ) : (
              <span>All plans include a 14-day free trial</span>
            )}
          </div>
          
          <div className="flex gap-3">
            {isPaidUser ? (
              <>
                <button
                  onClick={openBillingPortal}
                  className="px-6 py-2 border border-[#404040] text-[#F2F2F2] hover:bg-[#202020] transition-colors rounded-[2px] text-sm uppercase tracking-tight"
                >
                  Manage Subscription
                </button>
                <button
                  onClick={() => handleChangePlan(selectedPlan)}
                  className="px-6 py-2 bg-[#FFC96C] text-[#0C0C0C] hover:bg-[#FFD68C] transition-colors rounded-[2px] text-sm font-bold uppercase tracking-tight"
                >
                  Change Plan
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-[#404040] text-[#F2F2F2] hover:bg-[#202020] transition-colors rounded-[2px] text-sm uppercase tracking-tight"
                >
                  Compare Plans
                </button>
                <button
                  onClick={() => handleUpgrade(selectedPlan)}
                  className="px-6 py-2 bg-[#FFC96C] text-[#0C0C0C] hover:bg-[#FFD68C] transition-colors rounded-[2px] text-sm font-bold uppercase tracking-tight"
                >
                  Upgrade to {plans[selectedPlan].name}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

