import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Users,
  UserPlus,
  FileText,
  User,
  LogOut,
  Save,
  Mail,
  Building,
  Phone,
  Download,
  Check,
  Key
} from 'lucide-react';
import BackArrow from '../components/BackArrow';
import { getCurrentUser, logout, SUBSCRIPTION_TIERS } from '../lib/auth';
import { downloadInvoicePDF, initializeStripeCheckout } from '../lib/stripe';

const SECTION_CONFIG = [
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'invite', label: 'Invite a Friend', icon: UserPlus },
  { id: 'policy', label: 'Policies', icon: FileText },
  { id: 'contact', label: 'Contact', icon: User }
];

const SECTION_COMPONENTS = {
  billing: BillingSection,
  team: TeamSection,
  invite: InviteSection,
  policy: PolicySection,
  contact: ContactSection
};

export default function Settings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('billing');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const ActiveSection = SECTION_COMPONENTS[activeSection] ?? BillingSection;

  return (
    <div className="space-y-8">
      <BackArrow />
      <header>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          Settings
        </h1>
        <p className="text-[#B3B3B3]">Manage your account preferences and configuration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <div className="panel-system p-4">
            <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-4 pb-4 border-b border-[#202020]">
              Personal Account
            </p>
            <nav className="space-y-1">
              {SECTION_CONFIG.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[2px] transition-colors text-left ${
                    activeSection === id
                      ? 'bg-[#1A1A1A] text-[#FFC96C]'
                      : 'text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-[2px] text-red-400 hover:bg-red-900/20 transition-colors text-left mt-4 pt-4 border-t border-[#202020]"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Log out</span>
              </button>
            </nav>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          <ActiveSection user={user} />
        </section>
      </div>
    </div>
  );
}

const PLAN_LIBRARY = {
  [SUBSCRIPTION_TIERS.FREE]: {
    id: SUBSCRIPTION_TIERS.FREE,
    name: 'Free',
    description: 'For individuals exploring DHStx capabilities.',
    monthlyPrice: 0,
    billingPeriod: 'month',
    highlight: false,
    featureList: ['1 AI Agent', '10 workflows/month', '25 connections', 'Community support'],
    allowances: { agents: 1, workflows: 10, connections: 25, teamLicenses: 1 },
    usageExample: { agents: 1, workflows: 7, connections: 12, teamLicenses: 1 }
  },
  [SUBSCRIPTION_TIERS.STARTER]: {
    id: SUBSCRIPTION_TIERS.STARTER,
    name: 'Starter',
    description: 'For small teams launching their first AI agents.',
    monthlyPrice: 19,
    billingPeriod: 'month',
    highlight: false,
    featureList: ['3 AI Agents', '50 workflows/month', '100 connections', 'Email support', 'Basic analytics'],
    allowances: { agents: 3, workflows: 50, connections: 100, teamLicenses: 5 },
    usageExample: { agents: 2, workflows: 32, connections: 76, teamLicenses: 3 }
  },
  [SUBSCRIPTION_TIERS.PROFESSIONAL]: {
    id: SUBSCRIPTION_TIERS.PROFESSIONAL,
    name: 'Professional',
    description: 'For growing organizations that need advanced automation.',
    monthlyPrice: 49,
    billingPeriod: 'month',
    highlight: true,
    featureList: [
      '12 AI Agents',
      'Unlimited workflows',
      'Unlimited connections',
      'Priority support',
      'Advanced analytics',
      'Custom integrations'
    ],
    allowances: { agents: 12, workflows: 'unlimited', connections: 'unlimited', teamLicenses: 10 },
    usageExample: { agents: 9, workflows: 240, connections: 180, teamLicenses: 8 }
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    id: SUBSCRIPTION_TIERS.ENTERPRISE,
    name: 'Enterprise',
    description: 'For large organizations requiring bespoke deployments.',
    monthlyPrice: 199,
    billingPeriod: 'month',
    highlight: false,
    featureList: [
      'Unlimited AI Agents',
      'Unlimited workflows',
      'Unlimited connections',
      'Dedicated support',
      'Custom deployment',
      'SLA guarantee'
    ],
    allowances: { agents: 'unlimited', workflows: 'unlimited', connections: 'unlimited', teamLicenses: 'unlimited' },
    usageExample: { agents: 24, workflows: 860, connections: 540, teamLicenses: 26 }
  }
};

const PLAN_ORDER = {
  [SUBSCRIPTION_TIERS.FREE]: 0,
  [SUBSCRIPTION_TIERS.STARTER]: 1,
  [SUBSCRIPTION_TIERS.PROFESSIONAL]: 2,
  [SUBSCRIPTION_TIERS.ENTERPRISE]: 3
};

function BillingSection({ user }) {
  const subscriptionId = user?.subscription ?? SUBSCRIPTION_TIERS.FREE;
  const currentPlan = PLAN_LIBRARY[subscriptionId] ?? PLAN_LIBRARY[SUBSCRIPTION_TIERS.FREE];
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const pricingTiers = [
    {
      id: SUBSCRIPTION_TIERS.STARTER,
      name: 'Starter',
      monthlyPrice: 19,
      annualPrice: 190,
      features: PLAN_LIBRARY[SUBSCRIPTION_TIERS.STARTER].featureList
    },
    {
      id: SUBSCRIPTION_TIERS.PROFESSIONAL,
      name: 'Professional',
      monthlyPrice: 49,
      annualPrice: 490,
      features: PLAN_LIBRARY[SUBSCRIPTION_TIERS.PROFESSIONAL].featureList,
      highlighted: true
    },
    {
      id: SUBSCRIPTION_TIERS.ENTERPRISE,
      name: 'Enterprise',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: PLAN_LIBRARY[SUBSCRIPTION_TIERS.ENTERPRISE].featureList
    }
  ];

  const invoices = [
    { id: 'inv_2025-10', date: 'Oct 1, 2025', amount: currentPlan.monthlyPrice, status: 'Paid' },
    { id: 'inv_2025-09', date: 'Sep 1, 2025', amount: currentPlan.monthlyPrice, status: 'Paid' },
    { id: 'inv_2025-08', date: 'Aug 1, 2025', amount: currentPlan.monthlyPrice, status: 'Paid' }
  ];

  const handleUpgrade = async (tierId) => {
    if (tierId === SUBSCRIPTION_TIERS.ENTERPRISE) {
      window.alert('Please contact our sales team at sales@dhstx.com to discuss Enterprise pricing and features.');
      return;
    }

    try {
      await initializeStripeCheckout(tierId, { email: user?.email });
    } catch (error) {
      console.error('Upgrade error:', error);
      window.alert('Unable to start the upgrade process. Please try again or contact support.');
    }
  };

  const handleDowngrade = (tierId) => {
    const tierName = PLAN_LIBRARY[tierId]?.name ?? 'the selected plan';
    const confirmMessage = `Are you sure you want to downgrade to ${tierName}?\n\nYour current plan benefits will remain active until the end of your billing period.\n\nAfter that, you will move to ${tierName} with reduced features.`;

    if (window.confirm(confirmMessage)) {
      window.setTimeout(() => {
        window.alert(
          `✅ Downgrade to ${tierName} scheduled!\n\nYour plan will change at the end of your current billing period.\n\nYou will receive a confirmation email with details.`
        );
      }, 400);
    }
  };

  const handleCancelSubscription = () => {
    if (
      window.confirm(
        'Are you sure you want to cancel your subscription?\n\nYour access will continue until the end of the current billing period.'
      )
    ) {
      window.alert('Subscription cancellation scheduled.\n\nYou will receive a confirmation email shortly.');
    }
  };

  const isPaidPlan = subscriptionId !== SUBSCRIPTION_TIERS.FREE;
  const usageMetrics = [
    { label: 'AI Agents', key: 'agents' },
    { label: 'Workflows', key: 'workflows' },
    { label: 'Connections', key: 'connections' },
    { label: 'Team Licenses', key: 'teamLicenses' }
  ];

  const formatValue = (value) => (value === 'unlimited' ? '∞' : value);

  return (
    <div className="space-y-6">
      <div className="panel-system p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">
            Current Plan: {currentPlan.name}
          </h2>
          {currentPlan.highlight && (
            <span className="px-2 py-1 bg-[#FFC96C]/10 border border-[#FFC96C] rounded-[2px] text-[#FFC96C] text-xs font-bold uppercase">
              Most Popular
            </span>
          )}
          <div className="flex items-baseline gap-2 ml-auto text-right">
            <span className="text-2xl font-bold text-[#F2F2F2]">
              ${currentPlan.monthlyPrice}
            </span>
            <span className="text-[#B3B3B3] text-sm">/{currentPlan.billingPeriod}</span>
          </div>
        </div>

        <section>
          <h3 className="text-sm font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">Included features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPlan.featureList.map((feature) => (
              <div key={feature} className="flex items-start gap-2 text-sm text-[#B3B3B3]">
                <span className="text-[#FFC96C]">✓</span>
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[#202020] pt-6">
          <h3 className="text-sm font-bold text-[#F2F2F2] mb-3 uppercase tracking-tight">Current usage</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {usageMetrics.map(({ label, key }) => {
              const limit = currentPlan.allowances[key];
              const used = currentPlan.usageExample[key];
              const limitDisplay = formatValue(limit);

              return (
                <div key={key}>
                  <p className="text-[#B3B3B3] text-xs uppercase tracking-tight mb-1">{label}</p>
                  <p className="text-2xl font-bold text-[#F2F2F2]">
                    {used} / {limitDisplay}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {isPaidPlan && (
          <div className="border-t border-[#202020] pt-6">
            <button
              type="button"
              onClick={handleCancelSubscription}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Cancel subscription
            </button>
          </div>
        )}
      </div>

      {isPaidPlan && (
        <div className="panel-system p-6 space-y-6">
          <section className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[4px] bg-[#202020] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#FFC96C]" />
              </div>
              <div>
                <p className="text-[#F2F2F2] font-medium">•••• •••• •••• 4242</p>
                <p className="text-[#B3B3B3] text-sm">Expires 12/2025</p>
              </div>
            </div>
            <button type="button" className="btn-system">
              Update payment
            </button>
          </section>

          <section>
            <h3 className="text-sm font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">Billing history</h3>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#202020] last:border-0"
                >
                  <div>
                    <p className="text-[#F2F2F2] font-medium">{invoice.date}</p>
                    <p className="text-[#B3B3B3] text-sm">Monthly subscription</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#F2F2F2] font-bold">${invoice.amount}</span>
                    <span className="px-2 py-1 bg-green-900/20 border border-green-900 rounded-[2px] text-green-400 text-xs font-bold uppercase">
                      {invoice.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => downloadInvoicePDF(invoice.id)}
                      className="text-[#FFC96C] hover:text-[#FFD700] text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <div className="panel-system p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">Explore plans</h2>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-[2px] font-medium uppercase tracking-tight transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-[#FFC96C] text-[#0C0C0C]'
                  : 'bg-[#202020] text-[#B3B3B3] hover:text-[#F2F2F2]'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-[2px] font-medium uppercase tracking-tight transition-colors ${
                billingPeriod === 'annual'
                  ? 'bg-[#FFC96C] text-[#0C0C0C]'
                  : 'bg-[#202020] text-[#B3B3B3] hover:text-[#F2F2F2]'
              }`}
            >
              Annual
              <span className="ml-2 text-xs">(Save 2 months)</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => {
            const tierPlan = PLAN_LIBRARY[tier.id];
            const tierRank = PLAN_ORDER[tier.id];
            const currentRank = PLAN_ORDER[subscriptionId] ?? 0;
            const isCurrentPlan = subscriptionId === tier.id;
            const isUpgrade = tierRank > currentRank;
            const isDowngrade = tierRank < currentRank;

            return (
              <div
                key={tier.id}
                className={`panel-system p-6 flex flex-col gap-4 ${
                  tier.highlighted ? 'border-2 border-[#FFC96C] bg-[#FFC96C]/5' : ''
                }`}
              >
                {tier.highlighted && (
                  <span className="self-start px-3 py-1 bg-[#FFC96C] text-[#0C0C0C] text-xs font-bold uppercase rounded-[2px]">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">{tier.name}</h3>
                  <div className="mt-2 text-[#B3B3B3] text-sm">{tierPlan.description ?? ''}</div>
                </div>
                <div className="text-[#F2F2F2]">
                  {billingPeriod === 'monthly' ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">${tier.monthlyPrice}</span>
                      <span className="text-sm text-[#B3B3B3]">/month</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">${tier.annualPrice}</span>
                        <span className="text-sm text-[#B3B3B3]">/year</span>
                      </div>
                      <p className="text-sm text-[#FFC96C] mt-1">${Math.round(tier.annualPrice / 12)}/month effective</p>
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#B3B3B3]">
                      <Check className="w-4 h-4 text-[#FFC96C] flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  {isCurrentPlan && (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#808080] cursor-not-allowed"
                    >
                      Current plan
                    </button>
                  )}
                  {isUpgrade && (
                    <button
                      type="button"
                      onClick={() => handleUpgrade(tier.id)}
                      className={`w-full py-3 rounded-[2px] font-bold uppercase tracking-tight transition-colors ${
                        tier.highlighted
                          ? 'bg-[#FFC96C] text-[#0C0C0C] hover:bg-[#FFD700]'
                          : 'bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A]'
                      }`}
                    >
                      Upgrade
                    </button>
                  )}
                  {isDowngrade && (
                    <button
                      type="button"
                      onClick={() => handleDowngrade(tier.id)}
                      className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A] border border-[#FFC96C]/30 transition-colors"
                    >
                      Downgrade
                    </button>
                  )}
                  {!isCurrentPlan && !isUpgrade && !isDowngrade && (
                    <button
                      type="button"
                      onClick={() => handleUpgrade(tier.id)}
                      className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A]"
                    >
                      Choose plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@yourorganization.com',
      role: 'Owner',
      status: 'Active',
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@yourorganization.com',
      role: 'Admin',
      status: 'Active',
      joinedDate: '2024-03-20'
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike@yourorganization.com',
      role: 'Member',
      status: 'Active',
      joinedDate: '2024-06-10'
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily@yourorganization.com',
      role: 'Member',
      status: 'Pending',
      joinedDate: '2024-09-25'
    }
  ]);

  const handleInvite = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const role = formData.get('role');

    if (!email) {
      return;
    }

    const inviteLink = `${window.location.origin}/join-team?token=${window.btoa(`${email}${Date.now()}`)}`;

    window.setTimeout(() => {
      window.alert(
        `✅ Team invitation sent to ${email}!\n\nRole: ${role}\nInvite link: ${inviteLink}\n\nThey will receive an email with instructions to join your team.`
      );
      event.currentTarget.reset();
      setShowInviteModal(false);
    }, 400);
  };

  const handleRemove = (member) => {
    if (window.confirm(`Remove ${member.name} from the team?`)) {
      setTeamMembers((previous) => previous.filter((item) => item.id !== member.id));
      window.alert(`${member.name} has been removed from the team.`);
    }
  };

  const handleChangeRole = (member) => {
    window.alert(
      `Change role for ${member.name}\n\nAvailable roles:\n• Owner - Full access\n• Admin - Manage team and settings\n• Member - View and edit content\n• Viewer - Read-only access`
    );
  };

  return (
    <div className="space-y-6">
      <div className="panel-system p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">Team management</h2>
            <p className="text-[#B3B3B3]">Invite team members and manage access to your organization.</p>
          </div>
          <button type="button" onClick={() => setShowInviteModal(true)} className="btn-system flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Invite member
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Members" value={teamMembers.length} />
          <StatCard icon={Key} label="Admins" value={teamMembers.filter((member) => member.role === 'Admin').length} />
          <StatCard icon={Mail} label="Pending Invites" value={teamMembers.filter((member) => member.status === 'Pending').length} />
          <StatCard icon={Users} label="Available Seats" value={Math.max(0, 50 - teamMembers.length)} />
        </div>

        <div className="bg-[#0C0C0C] rounded-[2px] border border-[#202020] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#161616]">
              <tr className="border-b border-[#202020]">
                <th className="text-left p-4 text-[#B3B3B3] uppercase tracking-tight font-bold">Member</th>
                <th className="text-left p-4 text-[#B3B3B3] uppercase tracking-tight font-bold">Role</th>
                <th className="text-left p-4 text-[#B3B3B3] uppercase tracking-tight font-bold">Status</th>
                <th className="text-left p-4 text-[#B3B3B3] uppercase tracking-tight font-bold">Joined</th>
                <th className="text-right p-4 text-[#B3B3B3] uppercase tracking-tight font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b border-[#202020] hover:bg-[#1A1A1A]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[4px] bg-[#202020] flex items-center justify-center flex-shrink-0">
                        <span className="text-[#FFC96C] font-bold">{member.name[0]}</span>
                      </div>
                      <div>
                        <div className="text-[#F2F2F2] font-medium">{member.name}</div>
                        <div className="text-[#B3B3B3] text-xs">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-[4px] bg-[#202020] text-[#FFC96C] text-xs font-medium">{member.role}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}
                      />
                      <span className="text-[#B3B3B3] text-xs">{member.status}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#B3B3B3] text-xs">{member.joinedDate}</td>
                  <td className="p-4">
                    {member.role !== 'Owner' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleChangeRole(member)}
                          className="px-3 py-1 rounded-[4px] bg-[#202020] text-[#F2F2F2] text-xs hover:bg-[#FFC96C] hover:text-[#0C0C0C] transition-colors"
                          style={{
                            // Light-mode elevate system surfaces
                            backgroundColor: document?.documentElement?.getAttribute?.('data-theme') === 'light' ? 'var(--bg-elev)' : undefined,
                            color: document?.documentElement?.getAttribute?.('data-theme') === 'light' ? 'var(--text)' : undefined,
                            borderColor: document?.documentElement?.getAttribute?.('data-theme') === 'light' ? 'var(--border)' : undefined
                          }}
                        >
                          Change role
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemove(member)}
                          className="p-2 rounded-[4px] bg-[#202020] text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                          style={{
                            backgroundColor: document?.documentElement?.getAttribute?.('data-theme') === 'light' ? 'var(--bg-elev)' : undefined,
                            color: document?.documentElement?.getAttribute?.('data-theme') === 'light' ? 'var(--text)' : undefined,
                            borderColor: document?.documentElement?.getAttribute?.('data-theme') === 'light' ? 'var(--border)' : undefined
                          }}
                          aria-label={`Remove ${member.name}`}
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="panel-system p-6 max-w-md w-full space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">Invite team member</h3>
              <p className="text-[#B3B3B3] text-sm">Send an invitation email to add a new teammate.</p>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[#B3B3B3] text-xs mb-2 uppercase tracking-tight" htmlFor="invite-email">
                  Email address
                </label>
                <input
                  id="invite-email"
                  name="email"
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-xs mb-2 uppercase tracking-tight" htmlFor="invite-role">
                  Role
                </label>
                <select
                  id="invite-role"
                  name="role"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-xs mb-2 uppercase tracking-tight" htmlFor="invite-message">
                  Personal message (optional)
                </label>
                <textarea
                  id="invite-message"
                  name="message"
                  rows={3}
                  placeholder="Welcome to the team!"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-system flex-1">
                  Send invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-[4px] bg-[#202020] text-[#F2F2F2] hover:bg-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-[#0C0C0C] p-4 rounded-[2px] border border-[#202020]">
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 text-[#FFC96C]" />
        <span className="text-[#B3B3B3] text-xs uppercase tracking-tight">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[#F2F2F2]">{value}</div>
    </div>
  );
}

function InviteSection() {
  const [email, setEmail] = useState('');

  const handleInvite = (event) => {
    event.preventDefault();

    if (!email) {
      return;
    }

    const inviteLink = `${window.location.origin}/signup?ref=${window.btoa(email)}`;

    window.setTimeout(() => {
      window.alert(
        `✅ Invitation sent to ${email}!\n\nInvite link: ${inviteLink}\n\nThey will receive an email with instructions to join.`
      );
      setEmail('');
    }, 400);
  };

  return (
    <div className="panel-system p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">Invite a friend</h2>
      <p className="text-[#B3B3B3]">Share DHStx with colleagues and earn rewards when they sign up.</p>
      <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="friend@example.com"
          className="flex-grow px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
          required
        />
        <button type="submit" className="btn-system">
          Send invite
        </button>
      </form>
    </div>
  );
}

function PolicySection() {
  const policyLinks = [
    { href: '/policies/terms', title: 'Terms of Service', updated: 'October 1, 2025' },
    { href: '/policies/privacy', title: 'Privacy Policy', updated: 'October 1, 2025' },
    { href: '/policies/cookies', title: 'Cookie Policy', updated: 'October 1, 2025' }
  ];

  return (
    <div className="panel-system p-6 space-y-4">
      <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">Policies &amp; legal</h2>
      <div className="space-y-3">
        {policyLinks.map((policy) => (
          <a
            key={policy.href}
            href={policy.href}
            className="block p-4 bg-[#161616] border border-[#202020] rounded-[2px] hover:bg-[#1A1A1A] transition-colors"
          >
            <h3 className="text-[#F2F2F2] font-medium mb-1">{policy.title}</h3>
            <p className="text-[#B3B3B3] text-xs">Last updated: {policy.updated}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

function ContactSection({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    organization: 'DHStx Organization',
    phone: '+1 (555) 123-4567'
  });

  const updateField = (key, value) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = () => {
    window.alert('Contact information updated successfully!');
  };

  return (
    <div className="panel-system p-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[#F2F2F2] uppercase tracking-tight">Contact information</h2>
        <button type="button" onClick={handleSave} className="btn-system flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field
          label="Full name"
          icon={User}
          value={formData.name}
          onChange={(value) => updateField('name', value)}
          placeholder="Your name"
        />
        <Field
          label="Email address"
          icon={Mail}
          type="email"
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          placeholder="you@example.com"
        />
        <Field
          label="Organization"
          icon={Building}
          value={formData.organization}
          onChange={(value) => updateField('organization', value)}
          placeholder="Company name"
        />
        <Field
          label="Phone number"
          icon={Phone}
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="text-[#F2F2F2] font-medium uppercase tracking-tight">{label}</span>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-[#808080]">
          <Icon className="w-4 h-4" />
        </span>
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
        />
      </div>
    </label>
  );
}
