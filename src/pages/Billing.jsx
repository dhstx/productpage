import { useState, useEffect } from 'react';
import { CreditCard, Check, Zap, AlertCircle, Download, Plus, TrendingUp } from 'lucide-react';
import BackArrow from '../components/BackArrow';
import { useAuth } from '../contexts/AuthContext';
import PTHealthBar from '../components/PTHealthBar';
import { 
  createSubscriptionCheckout, 
  createTopUpCheckout, 
  getTopUpPackages,
  cancelSubscription,
  updateSubscription,
  getCustomerPortalUrl 
} from '../lib/stripe/checkout';
import "../styles/dashboard-theme.css";

export default function Billing() {
  const { user, profile } = useAuth();
  const [ptData, setPtData] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedTopUp, setSelectedTopUp] = useState(null);

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user]);

  async function fetchBillingData() {
    try {
      // Fetch PT usage
      const ptResponse = await fetch('/api/pt/usage', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (ptResponse.ok) {
        const ptDataResult = await ptResponse.json();
        setPtData(ptDataResult);
      }

      // Fetch subscription
      const subResponse = await fetch('/api/subscription/current', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData);
      }

      // Fetch billing history
      const historyResponse = await fetch('/api/billing/history', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setBillingHistory(historyData.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(tier) {
    setActionLoading(`upgrade-${tier}`);
    try {
      if (subscription?.stripe_subscription_id) {
        // Update existing subscription
        await updateSubscription(subscription.stripe_subscription_id, tier, user.id);
        alert('Subscription updated successfully!');
        fetchBillingData();
      } else {
        // Create new subscription
        await createSubscriptionCheckout(tier, 'monthly', user.id);
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert(`Failed to upgrade: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleTopUpConfirm() {
    if (!selectedTopUp) return;
    const { ptAmount, price } = selectedTopUp;
    setActionLoading(`topup-${ptAmount}`);
    try {
      await createTopUpCheckout(price, ptAmount, user.id);
      // Redirect happens inside helper
    } catch (error) {
      console.error('Top-up error:', error);
      alert(`Failed to purchase Points: ${error.message}`);
    } finally {
      setActionLoading(null);
      setShowTopUpModal(false);
      setSelectedTopUp(null);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription?\n\nYour access will continue until the end of the current billing period.')) {
      return;
    }

    setActionLoading('cancel');
    try {
      await cancelSubscription(subscription.stripe_subscription_id, user.id);
      alert('Subscription cancelled successfully. You will receive a confirmation email.');
      fetchBillingData();
    } catch (error) {
      console.error('Cancel error:', error);
      alert(`Failed to cancel subscription: ${error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleManagePayment() {
    setActionLoading('portal');
    try {
      const url = await getCustomerPortalUrl(subscription.stripe_customer_id);
      window.location.href = url;
    } catch (error) {
      console.error('Portal error:', error);
      alert(`Failed to open billing portal: ${error.message}`);
      setActionLoading(null);
    }
  }

  const tiers = [
    {
      id: 'entry',
      name: 'Entry',
      price: 19,
      corePT: 300,
      advancedPT: 'Add-on only',
      features: ['300 Core Points/month', '5 AI agents', 'Core models', 'Email support (48h)'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 49,
      corePT: 1000,
      advancedPT: '50 Points metered',
      features: ['1,000 Core Points/month', '50 Advanced Points', '25 AI agents', 'All models', 'API access', 'Email support (24h)'],
      popular: true,
    },
    {
      id: 'proplus',
      name: 'Pro Plus',
      price: 79,
      corePT: 1600,
      advancedPT: '100 Points metered',
      features: ['1,600 Core Points/month', '100 Advanced Points', '50 AI agents', 'Priority access', 'Team workspaces (3)', 'Email + chat support (12h)'],
    },
    {
      id: 'business',
      name: 'Business',
      price: 159,
      corePT: 3500,
      advancedPT: '200 Points pools',
      features: ['3,500 Core Points/month', '200 Advanced Points', '100 AI agents', 'Dedicated capacity', 'Unlimited workspaces', 'Priority support (4h SLA)'],
    },
  ];

  const topUpPackages = getTopUpPackages();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p style={{ color: 'var(--muted)' }}>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-surface">
      <BackArrow />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="h2 text-[color:var(--text)] mb-2 uppercase tracking-tight">BILLING</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Manage your subscription, Points usage, and payment methods
          </p>
        </div>

        {/* Points Health Bar */}
        {ptData && (
          <div className="mb-8">
            <PTHealthBar
              corePT={{
                used: ptData.core.used,
                total: ptData.core.total,
                percentage: ptData.core.percentage,
              }}
              advancedPT={{
                used: ptData.advanced.used,
                total: ptData.advanced.total,
                percentage: ptData.advanced.percentage,
              }}
              tier={ptData.tier}
            />
          </div>
        )}

        {/* Current Plan */}
        {subscription && (
          <div className="dashboard-card mb-8 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Current Plan: {subscription.tier_name}
                </h2>
                <p style={{ color: 'var(--muted)' }}>{subscription.description}</p>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold" style={{ color: 'var(--text)' }}>
                    ${subscription.price}
                  </span>
                  <span style={{ color: 'var(--muted)' }}>/month</span>
                </div>
                {subscription.next_billing_date && (
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Next billing date: {new Date(subscription.next_billing_date).toLocaleDateString()}
                  </p>
                )}
              </div>
              {subscription.tier !== 'freemium' && (
                <button
                  onClick={handleManagePayment}
                  disabled={actionLoading === 'portal'}
                  className="btn-system"
                >
                  {actionLoading === 'portal' ? 'Loading...' : 'Manage Billing'}
                </button>
              )}
            </div>

            {/* Points Usage Stats */}
            {ptData && (
              <div className="border-t pt-6" style={{ borderColor: 'var(--card-border)' }}>
                <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--text)' }}>Points Usage This Month</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                        <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: 'var(--green-500)' }} aria-hidden="true" />
                        Core Points
                      </span>
                      <TrendingUp className="h-4 w-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                      {ptData.core.used.toLocaleString()} / {ptData.core.total.toLocaleString()}
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                      {ptData.core.percentage.toFixed(1)}% used
                    </div>
                  </div>

                  <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>Advanced Points</span>
                      <Zap className="h-4 w-4" style={{ color: '#9333ea' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                      {ptData.advanced.used.toLocaleString()} / {ptData.advanced.total.toLocaleString()}
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                      {ptData.advanced.percentage.toFixed(1)}% used
                    </div>
                  </div>

                  <div className="dashboard-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>Resets In</span>
                      <AlertCircle className="h-4 w-4" style={{ color: '#ea580c' }} />
                    </div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                      {ptData.days_until_reset || 0} days
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                      {ptData.reset_date ? new Date(ptData.reset_date).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel Subscription */}
            {subscription.tier !== 'freemium' && (
              <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--card-border)' }}>
                <button
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  className="text-sm font-medium"
                  style={{ color: '#ff6b6b' }}
                >
                  {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Points Top-Up Packages */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Buy Additional Points</h2>
          <p className="mb-4" style={{ color: 'var(--muted)' }}>Need more Points this month? Purchase a one-time top-up with volume discounts.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {topUpPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`dashboard-card p-6 ${pkg.popular ? 'ring-2 ring-purple-500/30' : ''}`}
              >
                {pkg.popular && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded mb-3" style={{ background: 'var(--accent-muted)', color: 'var(--accent-gold)' }}>
                    Best Value
                  </span>
                )}
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text)' }}>
                  {pkg.ptAmount} Points
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>
                  ${pkg.price}
                </div>
                <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
                  ${pkg.pricePerPT.toFixed(3)} per Point
                  {pkg.discount > 0 && (
                    <span className="ml-1" style={{ color: '#22c55e' }}>({pkg.discount}% off)</span>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedTopUp(pkg); setShowTopUpModal(true); }}
                  disabled={actionLoading === `topup-${pkg.ptAmount}`}
                  className="w-full btn-system"
                >
                  {actionLoading === `topup-${pkg.ptAmount}` ? 'Loading...' : 'Buy Now'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top-Up Confirmation Modal */}
        {showTopUpModal && selectedTopUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl dashboard-card">
              <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Confirm Purchase</h3>
                <button
                  className="opacity-80 hover:opacity-100"
                  onClick={() => { setShowTopUpModal(false); setSelectedTopUp(null); }}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="text-sm" style={{ color: 'var(--muted)' }}>You're about to purchase:</div>
                <div className="flex items-center justify-between">
                  <div className="font-medium" style={{ color: 'var(--text)' }}>{selectedTopUp.ptAmount} Points</div>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>${selectedTopUp.price}</div>
                </div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Rate: ${selectedTopUp.pricePerPT.toFixed(3)} per Point {selectedTopUp.discount > 0 ? `( ${selectedTopUp.discount}% off )` : ''}</div>
                <div className="mt-3 rounded p-3 text-xs" style={{ background: 'var(--accent-muted)', color: 'var(--accent-gold)', border: '1px solid var(--card-border)' }}>
                  After you confirm, you'll be redirected to Stripe Checkout to complete your secure payment.
                </div>
              </div>
              <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor: 'var(--card-border)' }}>
                <button
                  className="px-4 py-2 rounded-lg"
                  style={{ background: 'var(--panel-bg)', color: 'var(--text)' }}
                  onClick={() => { setShowTopUpModal(false); setSelectedTopUp(null); }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUpConfirm}
                  disabled={actionLoading === `topup-${selectedTopUp.ptAmount}`}
                  className="px-4 py-2 rounded-lg btn-gold disabled:opacity-50"
                >
                  {actionLoading === `topup-${selectedTopUp.ptAmount}` ? 'Processing…' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Options */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>Upgrade Your Plan</h2>
          <p className="mb-4" style={{ color: 'var(--muted)' }}>Get more Points, agents, and features with a higher tier.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const isCurrent = subscription?.tier === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`dashboard-card p-6 ${tier.popular ? 'ring-2 ring-purple-500/30' : ''}`}
                >
                  {tier.popular && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded mb-3" style={{ background: 'var(--accent-muted)', color: 'var(--accent-gold)' }}>
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{tier.name}</h3>
                  <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>${tier.price}</div>
                  <div className="text-sm mb-4" style={{ color: 'var(--muted)' }}>/month</div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                      {tier.corePT} Core Points
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>
                      {tier.advancedPT.replace('PT', 'Points')}
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {tier.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm" style={{ color: 'var(--muted)' }}>
                        <Check className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-gold)' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={isCurrent || actionLoading === `upgrade-${tier.id}`}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isCurrent ? 'opacity-50 cursor-not-allowed card-surface' : 'btn-system'}`}
                  >
                    {isCurrent ? 'Current Plan' : actionLoading === `upgrade-${tier.id}` ? 'Loading...' : 'Upgrade'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing History */}
        {billingHistory.length > 0 && (
          <div className="dashboard-card p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Billing History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text)' }}>
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--muted)' }}>
                        {invoice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--text)' }}>
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full`} style={{
                          background: 'var(--accent-muted)',
                          color: 'var(--accent-gold)'
                        }}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {invoice.invoice_url && (
                          <a
                            href={invoice.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                            style={{ color: 'var(--accent-gold)' }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

