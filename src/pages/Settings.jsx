import { useState } from 'react';
import { 
  User, Users, CreditCard, Key, UserPlus, FileText, 
  Palette, LogOut, Save, Mail, Building, Phone, Download 
} from 'lucide-react';
import { logout, getCurrentUser } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { downloadInvoicePDF } from '../lib/stripe';

export default function Settings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('contact');
  const [theme, setTheme] = useState('dark');

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const sections = [
    { id: 'contact', name: 'Contact', icon: User },
    { id: 'team', name: 'Add Team', icon: Users },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'api', name: 'API Tokens', icon: Key },
    { id: 'invite', name: 'Invite a Friend', icon: UserPlus },
    { id: 'policy', name: 'Policy', icon: FileText },
    { id: 'theme', name: 'Theme', icon: Palette },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          SETTINGS
        </h1>
        <p className="text-[#B3B3B3]">
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="panel-system p-4">
            <div className="mb-4 pb-4 border-b border-[#202020]">
              <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-2">
                Personal Account
              </p>
            </div>
            
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-[2px] transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-[#1A1A1A] text-[#FFC96C]'
                        : 'text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{section.name}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-[2px] text-red-400 hover:bg-red-900/20 transition-colors text-left mt-4 pt-4 border-t border-[#202020]"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Log out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeSection === 'contact' && <ContactSection user={user} />}
          {activeSection === 'team' && <TeamSection />}
          {activeSection === 'billing' && <BillingSection />}
          {activeSection === 'api' && <APITokensSection />}
          {activeSection === 'invite' && <InviteSection />}
          {activeSection === 'policy' && <PolicySection />}
          {activeSection === 'theme' && <ThemeSection theme={theme} setTheme={setTheme} />}
        </div>
      </div>
    </div>
  );
}

function ContactSection({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: 'DHStx Organization',
    phone: '+1 (555) 123-4567'
  });

  const handleSave = () => {
    alert('Contact information updated successfully!');
  };

  return (
    <div className="panel-system p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">
          CONTACT INFORMATION
        </h2>
        <button onClick={handleSave} className="btn-system flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
            Organization
          </label>
          <input
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
            className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="panel-system p-6">
      <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
        TEAM MANAGEMENT
      </h2>
      <p className="text-[#B3B3B3] mb-6">
        Invite team members and manage access to your organization.
      </p>
      <button className="btn-system">
        Invite Team Member
      </button>
    </div>
  );
}

function BillingSection() {
  const user = getCurrentUser();
  const currentTier = { 
    id: user?.subscription || 'free',
    name: user?.subscription === 'professional' ? 'Professional' : user?.subscription === 'starter' ? 'Starter' : user?.subscription === 'enterprise' ? 'Enterprise' : 'Free',
    description: 'Current subscription plan',
    price: user?.subscription === 'professional' ? 49 : user?.subscription === 'starter' ? 19 : user?.subscription === 'enterprise' ? 199 : 0,
    billingPeriod: 'month',
    highlighted: user?.subscription === 'professional',
    featureList: user?.subscription === 'professional' ? [
      '12 AI Agents',
      'Unlimited workflows',
      'Unlimited connections',
      'Priority support',
      'Advanced analytics',
      'Custom integrations'
    ] : user?.subscription === 'starter' ? [
      '3 AI Agents',
      '50 workflows/month',
      '100 connections',
      'Email support',
      'Basic analytics'
    ] : user?.subscription === 'enterprise' ? [
      'Unlimited AI Agents',
      'Unlimited workflows',
      'Unlimited connections',
      'Dedicated support',
      'Custom deployment',
      'SLA guarantee'
    ] : [
      '1 AI Agent',
      '10 workflows/month',
      '25 connections',
      'Community support'
    ],
    features: {
      agents: user?.subscription === 'professional' ? '12' : user?.subscription === 'starter' ? '3' : user?.subscription === 'enterprise' ? 'unlimited' : '1',
      workflows: user?.subscription === 'professional' ? 'unlimited' : user?.subscription === 'starter' ? '50' : user?.subscription === 'enterprise' ? 'unlimited' : '10',
      connections: user?.subscription === 'professional' ? 'unlimited' : user?.subscription === 'starter' ? '100' : user?.subscription === 'enterprise' ? 'unlimited' : '25',
      teamLicenses: user?.subscription === 'professional' ? '10' : user?.subscription === 'starter' ? '5' : user?.subscription === 'enterprise' ? 'unlimited' : '1'
    }
  };
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const canUserUpgrade = !user || user.subscription === 'free' || user.subscription === 'starter';

  const handleUpgrade = (tierName) => {
    if (tierName === 'Enterprise') {
      alert('Please contact our sales team at sales@dhstx.com to discuss Enterprise pricing and features.');
    } else {
      // Trigger Stripe checkout
      alert(`Upgrading to ${tierName} plan...\n\nThis would redirect to Stripe checkout.`);
    }
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?\n\nYour access will continue until the end of the current billing period.')) {
      alert('Subscription cancellation scheduled.\n\nYou will receive a confirmation email shortly.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <div className="panel-system p-6">
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
          {canUserUpgrade && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="btn-system flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
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
                <span className="text-[#FFC96C] text-sm">✓</span>
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
            <div>
              <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-1">AI Agents</p>
              <p className="text-2xl font-bold text-[#F2F2F2]">
                {currentTier.features.agents === 'unlimited' ? '∞' : '3'} / {currentTier.features.agents === 'unlimited' ? '∞' : currentTier.features.agents}
              </p>
            </div>
            <div>
              <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-1">Workflows</p>
              <p className="text-2xl font-bold text-[#F2F2F2]">
                {currentTier.features.workflows === 'unlimited' ? '∞' : '12'} / {currentTier.features.workflows === 'unlimited' ? '∞' : currentTier.features.workflows}
              </p>
            </div>
            <div>
              <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-1">Connections</p>
              <p className="text-2xl font-bold text-[#F2F2F2]">
                {currentTier.features.connections === 'unlimited' ? '∞' : '47'} / {currentTier.features.connections === 'unlimited' ? '∞' : currentTier.features.connections}
              </p>
            </div>
            <div>
              <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-1">Team Licenses</p>
              <p className="text-2xl font-bold text-[#F2F2F2]">
                {currentTier.features.teamLicenses === 'unlimited' ? '∞' : '8'} / {currentTier.features.teamLicenses === 'unlimited' ? '∞' : currentTier.features.teamLicenses}
              </p>
            </div>
          </div>
        </div>

        {user && user.subscription !== 'free' && (
          <div className="mt-6 pt-6 border-t border-[#202020] flex gap-4">
            <button
              onClick={handleCancelSubscription}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Payment Method (for paid plans) */}
      {user && user.subscription !== 'free' && (
        <div className="panel-system p-6">
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
        </div>
      )}

      {/* Billing History (for paid plans) */}
      {user && user.subscription !== 'free' && (
        <div className="panel-system p-6">
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
                  <button 
                    onClick={() => downloadInvoicePDF(invoice.id || `inv_${invoice.date.replace(/\s/g, '_')}`)}
                    className="text-[#FFC96C] hover:text-[#FFD700] text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function APITokensSection() {
  const [tokens, setTokens] = useState([
    { id: 1, name: 'Production API', key: 'sk_prod_...abc123', created: '2025-10-01', lastUsed: '2 hours ago' },
    { id: 2, name: 'Development API', key: 'sk_dev_...xyz789', created: '2025-09-15', lastUsed: '1 day ago' }
  ]);

  const handleCreateToken = () => {
    const name = prompt('Enter token name:');
    if (name) {
      const newToken = {
        id: tokens.length + 1,
        name,
        key: `sk_${Date.now()}_...${Math.random().toString(36).substr(2, 6)}`,
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never'
      };
      setTokens([...tokens, newToken]);
    }
  };

  const handleRevokeToken = (id) => {
    if (confirm('Are you sure you want to revoke this token? This action cannot be undone.')) {
      setTokens(tokens.filter(t => t.id !== id));
    }
  };

  return (
    <div className="panel-system p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight mb-2">
            API TOKENS
          </h2>
          <p className="text-[#B3B3B3] text-sm">
            Manage API tokens for programmatic access to your account
          </p>
        </div>
        <button onClick={handleCreateToken} className="btn-system">
          Create New Token
        </button>
      </div>

      <div className="space-y-4">
        {tokens.map((token) => (
          <div key={token.id} className="p-4 bg-[#161616] border border-[#202020] rounded-[2px]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-[#F2F2F2] font-medium mb-1">{token.name}</h3>
                <code className="text-[#B3B3B3] text-sm font-mono">{token.key}</code>
              </div>
              <button
                onClick={() => handleRevokeToken(token.id)}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Revoke
              </button>
            </div>
            <div className="flex gap-6 text-xs text-[#808080]">
              <span>Created: {token.created}</span>
              <span>Last used: {token.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InviteSection() {
  const [email, setEmail] = useState('');

  const handleInvite = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Invitation sent to ${email}!`);
      setEmail('');
    }
  };

  return (
    <div className="panel-system p-6">
      <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
        INVITE A FRIEND
      </h2>
      <p className="text-[#B3B3B3] mb-6">
        Share DHStx with colleagues and get rewards when they sign up.
      </p>
      <form onSubmit={handleInvite} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@example.com"
          className="flex-grow px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
          required
        />
        <button type="submit" className="btn-system">
          Send Invite
        </button>
      </form>
    </div>
  );
}

function PolicySection() {
  return (
    <div className="panel-system p-6">
      <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
        POLICIES & LEGAL
      </h2>
      <div className="space-y-4">
        <a href="#" className="block p-4 bg-[#161616] border border-[#202020] rounded-[2px] hover:bg-[#1A1A1A] transition-colors">
          <h3 className="text-[#F2F2F2] font-medium mb-1">Terms of Service</h3>
          <p className="text-[#B3B3B3] text-sm">Last updated: October 1, 2025</p>
        </a>
        <a href="#" className="block p-4 bg-[#161616] border border-[#202020] rounded-[2px] hover:bg-[#1A1A1A] transition-colors">
          <h3 className="text-[#F2F2F2] font-medium mb-1">Privacy Policy</h3>
          <p className="text-[#B3B3B3] text-sm">Last updated: October 1, 2025</p>
        </a>
        <a href="#" className="block p-4 bg-[#161616] border border-[#202020] rounded-[2px] hover:bg-[#1A1A1A] transition-colors">
          <h3 className="text-[#F2F2F2] font-medium mb-1">Cookie Policy</h3>
          <p className="text-[#B3B3B3] text-sm">Last updated: October 1, 2025</p>
        </a>
      </div>
    </div>
  );
}

function ThemeSection({ theme, setTheme }) {
  return (
    <div className="panel-system p-6">
      <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
        APPEARANCE
      </h2>
      <p className="text-[#B3B3B3] mb-6">
        Customize the look and feel of your interface.
      </p>
      <div className="space-y-4">
        <button
          onClick={() => setTheme('dark')}
          className={`w-full p-4 border rounded-[2px] transition-colors text-left ${
            theme === 'dark'
              ? 'bg-[#1A1A1A] border-[#FFC96C] text-[#F2F2F2]'
              : 'bg-[#161616] border-[#202020] text-[#B3B3B3] hover:bg-[#1A1A1A]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">Dark Mode</h3>
              <p className="text-sm text-[#808080]">System default dark theme</p>
            </div>
            {theme === 'dark' && (
              <div className="w-2 h-2 rounded-full bg-[#FFC96C]"></div>
            )}
          </div>
        </button>
        <button
          onClick={() => alert('Light mode coming soon')}
          className="w-full p-4 bg-[#161616] border border-[#202020] rounded-[2px] text-[#B3B3B3] hover:bg-[#1A1A1A] transition-colors text-left opacity-50 cursor-not-allowed"
        >
          <div>
            <h3 className="font-medium mb-1">Light Mode</h3>
            <p className="text-sm text-[#808080]">Coming soon</p>
          </div>
        </button>
      </div>
    </div>
  );
}
