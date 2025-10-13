import { useState } from 'react';
import BackArrow from '../components/BackArrow';
import { 
  User, Users, CreditCard, Key, UserPlus, FileText, 
  Palette, LogOut, Save, Mail, Building, Phone, Download, X, Check
} from 'lucide-react';
import { logout, getCurrentUser } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { downloadInvoicePDF } from '../lib/stripe';

export default function Settings() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('billing');
  const [theme, setTheme] = useState('dark');

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  const sections = [
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'invite', name: 'Invite a Friend', icon: UserPlus },
    { id: 'team', name: 'Add Team', icon: Users },
    { id: 'policy', name: 'Policy', icon: FileText },
    { id: 'contact', name: 'Contact', icon: User },
  ];

  return (
    <div className="space-y-8">
      <BackArrow />
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
      <BackArrow />
          {activeSection === 'billing' && <BillingSection />}
          {activeSection === 'invite' && <InviteSection />}
          {activeSection === 'team' && <TeamSection />}
          {activeSection === 'policy' && <PolicySection />}
          {activeSection === 'contact' && <ContactSection user={user} />}
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
      <BackArrow />
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
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamMembers] = useState([
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

  const handleInvite = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const role = formData.get('role');
    
    // In production, this would call an API endpoint to send the team invitation
    // For now, we'll simulate the process
    const inviteLink = `${window.location.origin}/join-team?token=${btoa(email + Date.now())}`;
    
    setTimeout(() => {
      alert(`✅ Team invitation sent to ${email}!\n\nRole: ${role}\nInvite link: ${inviteLink}\n\nThey will receive an email with instructions to join your team.`);
      setShowInviteModal(false);
    }, 500);
  };

  const handleRemove = (member) => {
    if (confirm(`Remove ${member.name} from the team?`)) {
      alert(`${member.name} has been removed from the team.`);
    }
  };

  const handleChangeRole = (member) => {
    alert(`Change role for ${member.name}\n\nAvailable roles:\n• Owner - Full access\n• Admin - Manage team and settings\n• Member - View and edit content\n• Viewer - Read-only access`);
  };

  return (
    <div className="space-y-6">
      <div className="panel-system p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
              TEAM MANAGEMENT
            </h2>
            <p className="text-[#B3B3B3]">
              Invite team members and manage access to your organization.
            </p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="btn-system flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0C0C0C] p-4 rounded-[2px] border border-[#202020]">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#FFC96C]" />
              <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Total Members</span>
            </div>
            <div className="text-2xl font-bold text-[#F2F2F2]">4</div>
          </div>
          <div className="bg-[#0C0C0C] p-4 rounded-[2px] border border-[#202020]">
            <div className="flex items-center gap-3 mb-2">
              <Key className="w-5 h-5 text-[#FFC96C]" />
              <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Admins</span>
            </div>
            <div className="text-2xl font-bold text-[#F2F2F2]">2</div>
          </div>
          <div className="bg-[#0C0C0C] p-4 rounded-[2px] border border-[#202020]">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-[#FFC96C]" />
              <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Pending Invites</span>
            </div>
            <div className="text-2xl font-bold text-[#F2F2F2]">1</div>
          </div>
          <div className="bg-[#0C0C0C] p-4 rounded-[2px] border border-[#202020]">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-[#FFC96C]" />
              <span className="text-[#B3B3B3] text-sm uppercase tracking-tight">Available Seats</span>
            </div>
            <div className="text-2xl font-bold text-[#F2F2F2]">46</div>
          </div>
        </div>

        {/* Team Members List */}
        <div>
          <h3 className="text-lg font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
            TEAM MEMBERS
          </h3>
          <div className="bg-[#0C0C0C] rounded-[2px] border border-[#202020] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#161616]">
                <tr className="border-b border-[#202020]">
                  <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Member</th>
                  <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Role</th>
                  <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Status</th>
                  <th className="text-left p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Joined</th>
                  <th className="text-right p-4 text-[#B3B3B3] text-sm uppercase tracking-tight font-bold">Actions</th>
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
                          <div className="text-[#B3B3B3] text-sm">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-[4px] bg-[#202020] text-[#FFC96C] text-sm font-medium">
                        {member.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-[#B3B3B3] text-sm">{member.status}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#B3B3B3] text-sm">{member.joinedDate}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {member.role !== 'Owner' && (
                          <>
                            <button
                              onClick={() => handleChangeRole(member)}
                              className="px-3 py-1 rounded-[4px] bg-[#202020] text-[#F2F2F2] text-sm hover:bg-[#FFC96C] hover:text-[#0C0C0C] transition-colors"
                            >
                              Change Role
                            </button>
                            <button
                              onClick={() => handleRemove(member)}
                              className="p-2 rounded-[4px] bg-[#202020] text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="panel-system p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
              INVITE TEAM MEMBER
            </h3>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]"
                />
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Role
                </label>
                <select className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C]">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <label className="block text-[#B3B3B3] text-sm mb-2 uppercase tracking-tight">
                  Personal Message (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Welcome to the team!"
                  className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[4px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] resize-none"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-system flex-1">
                  Send Invitation
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] border border-[#202020] rounded-[4px] p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#F2F2F2] uppercase tracking-tight">
                UPGRADE YOUR PLAN
              </h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-[#B3B3B3] hover:text-[#F2F2F2] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-[2px] font-medium uppercase tracking-tight transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#FFC96C] text-[#0C0C0C]'
                    : 'bg-[#202020] text-[#B3B3B3] hover:text-[#F2F2F2]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-[2px] font-medium uppercase tracking-tight transition-colors ${
                  billingPeriod === 'annual'
                    ? 'bg-[#FFC96C] text-[#0C0C0C]'
                    : 'bg-[#202020] text-[#B3B3B3] hover:text-[#F2F2F2]'
                }`}
              >
                Annual
                <span className="ml-2 text-xs">(Save 2 months)</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`panel-system p-6 ${
                    tier.highlighted ? 'border-2 border-[#FFC96C] bg-[#FFC96C]/5' : ''
                  }`}
                >
                  {tier.highlighted && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-[#FFC96C] text-[#0C0C0C] text-xs font-bold uppercase rounded-[2px]">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                    {tier.name}
                  </h3>
                  <div className="mb-6">
                    {billingPeriod === 'monthly' ? (
                      <>
                        <span className="text-4xl font-bold text-[#F2F2F2]">${tier.monthlyPrice}</span>
                        <span className="text-[#B3B3B3]">/month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-[#F2F2F2]">${tier.annualPrice}</span>
                        <span className="text-[#B3B3B3]">/year</span>
                        <div className="text-[#FFC96C] text-sm mt-1">
                          ${Math.round(tier.annualPrice / 12)}/month
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FFC96C] flex-shrink-0 mt-0.5" />
                        <span className="text-[#B3B3B3] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const currentPlanValue = user?.subscription === 'enterprise' ? 3 : user?.subscription === 'professional' ? 2 : user?.subscription === 'starter' ? 1 : 0;
                    const tierValue = tier.id === 'enterprise' ? 3 : tier.id === 'professional' ? 2 : tier.id === 'starter' ? 1 : 0;
                    const isCurrentPlan = user?.subscription === tier.id;
                    const isUpgrade = tierValue > currentPlanValue;
                    const isDowngrade = tierValue < currentPlanValue;

                    if (isCurrentPlan) {
                      return (
                        <button
                          disabled
                          className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#808080] cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      );
                    } else if (isUpgrade) {
                      return (
                        <button
                          onClick={() => handleUpgrade(tier.name, tier.id)}
                          className={`w-full py-3 rounded-[2px] font-bold uppercase tracking-tight transition-colors ${
                            tier.highlighted
                              ? 'bg-[#FFC96C] text-[#0C0C0C] hover:bg-[#FFD700]'
                              : 'bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A]'
                          }`}
                        >
                          Upgrade
                        </button>
                      );
                    } else if (isDowngrade) {
                      return (
                        <button
                          onClick={() => handleDowngrade(tier.name, tier.id)}
                          className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A] border border-[#FFC96C]/30 transition-colors"
                        >
                          Downgrade
                        </button>
                      );
                    }
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // 'monthly' or 'annual'
  const canUserUpgrade = !user || user.subscription === 'free' || user.subscription === 'starter';

  const pricingTiers = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 19,
      annualPrice: 190, // ~17/month, 2 months free
      features: ['3 AI Agents', '50 workflows/month', '100 connections', 'Email support', 'Basic analytics']
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 49,
      annualPrice: 490, // ~41/month, 2 months free
      highlighted: true,
      features: ['12 AI Agents', 'Unlimited workflows', 'Unlimited connections', 'Priority support', 'Advanced analytics', 'Custom integrations']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 199,
      annualPrice: 1990, // ~166/month, 2 months free
      features: ['Unlimited AI Agents', 'Unlimited workflows', 'Unlimited connections', 'Dedicated support', 'Custom deployment', 'SLA guarantee']
    }
  ];

  const handleUpgrade = (tierName, tierId) => {
    if (tierName === 'Enterprise') {
      alert('Please contact our sales team at sales@dhstx.com to discuss Enterprise pricing and features.');
    } else {
      // Trigger Stripe checkout - in production this would redirect to actual Stripe checkout
      window.location.href = `/api/create-checkout-session?plan=${tierId}&billing=${billingPeriod}`;
    }
  };

  const handleDowngrade = (tierName, tierId) => {
    const confirmMessage = `Are you sure you want to downgrade to ${tierName}?\n\nYour current plan benefits will remain active until the end of your billing period.\n\nAfter that, you'll be switched to ${tierName} with reduced features.`;
    
    if (confirm(confirmMessage)) {
      // In production, this would call an API endpoint to schedule the downgrade
      setTimeout(() => {
        alert(`✅ Downgrade to ${tierName} scheduled!\n\nYour plan will change at the end of your current billing period.\n\nYou will receive a confirmation email with details.`);
      }, 500);
    }
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?\n\nYour access will continue until the end of the current billing period.')) {
      alert('Subscription cancellation scheduled.\n\nYou will receive a confirmation email shortly.');
    }
  };

  return (
    <div className="space-y-6">
      <BackArrow />
      {/* Current Plan Status - Reduced height */}
      <div className="panel-system p-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-[#F2F2F2] uppercase tracking-tight">
            CURRENT PLAN: {currentTier.name}
          </h2>
          {currentTier.highlighted && (
            <span className="px-2 py-1 bg-[#FFC96C]/10 border border-[#FFC96C] rounded-[2px] text-[#FFC96C] text-xs font-bold uppercase">
              MOST POPULAR
            </span>
          )}
          <div className="flex items-baseline gap-2 ml-auto">
            <span className="text-2xl font-bold text-[#F2F2F2]">
              ${currentTier.price}
            </span>
            <span className="text-[#B3B3B3] text-sm">/{currentTier.billingPeriod}</span>
          </div>
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161616] border border-[#202020] rounded-[4px] p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#F2F2F2] uppercase tracking-tight">
                UPGRADE YOUR PLAN
              </h2>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-[#B3B3B3] hover:text-[#F2F2F2] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Billing Period Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-[2px] font-medium uppercase tracking-tight transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-[#FFC96C] text-[#0C0C0C]'
                    : 'bg-[#202020] text-[#B3B3B3] hover:text-[#F2F2F2]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-[2px] font-medium uppercase tracking-tight transition-colors ${
                  billingPeriod === 'annual'
                    ? 'bg-[#FFC96C] text-[#0C0C0C]'
                    : 'bg-[#202020] text-[#B3B3B3] hover:text-[#F2F2F2]'
                }`}
              >
                Annual
                <span className="ml-2 text-xs">(Save 2 months)</span>
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`panel-system p-6 ${
                    tier.highlighted ? 'border-2 border-[#FFC96C] bg-[#FFC96C]/5' : ''
                  }`}
                >
                  {tier.highlighted && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-[#FFC96C] text-[#0C0C0C] text-xs font-bold uppercase rounded-[2px]">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
                    {tier.name}
                  </h3>
                  <div className="mb-6">
                    {billingPeriod === 'monthly' ? (
                      <>
                        <span className="text-4xl font-bold text-[#F2F2F2]">${tier.monthlyPrice}</span>
                        <span className="text-[#B3B3B3]">/month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-[#F2F2F2]">${tier.annualPrice}</span>
                        <span className="text-[#B3B3B3]">/year</span>
                        <div className="text-[#FFC96C] text-sm mt-1">
                          ${Math.round(tier.annualPrice / 12)}/month
                        </div>
                      </>
                    )}
                  </div>
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#FFC96C] flex-shrink-0 mt-0.5" />
                        <span className="text-[#B3B3B3] text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {(() => {
                    const currentPlanValue = user?.subscription === 'enterprise' ? 3 : user?.subscription === 'professional' ? 2 : user?.subscription === 'starter' ? 1 : 0;
                    const tierValue = tier.id === 'enterprise' ? 3 : tier.id === 'professional' ? 2 : tier.id === 'starter' ? 1 : 0;
                    const isCurrentPlan = user?.subscription === tier.id;
                    const isUpgrade = tierValue > currentPlanValue;
                    const isDowngrade = tierValue < currentPlanValue;

                    if (isCurrentPlan) {
                      return (
                        <button
                          disabled
                          className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#808080] cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      );
                    } else if (isUpgrade) {
                      return (
                        <button
                          onClick={() => handleUpgrade(tier.name, tier.id)}
                          className={`w-full py-3 rounded-[2px] font-bold uppercase tracking-tight transition-colors ${
                            tier.highlighted
                              ? 'bg-[#FFC96C] text-[#0C0C0C] hover:bg-[#FFD700]'
                              : 'bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A]'
                          }`}
                        >
                          Upgrade
                        </button>
                      );
                    } else if (isDowngrade) {
                      return (
                        <button
                          onClick={() => handleDowngrade(tier.name, tier.id)}
                          className="w-full py-3 rounded-[2px] font-bold uppercase tracking-tight bg-[#202020] text-[#F2F2F2] hover:bg-[#2A2A2A] border border-[#FFC96C]/30 transition-colors"
                        >
                          Downgrade
                        </button>
                      );
                    }
                  })()}
                </div>
              ))}
            </div>
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
      <BackArrow />
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
      // In production, this would call an API endpoint to send the invitation
      // For now, we'll simulate the process
      const inviteLink = `${window.location.origin}/signup?ref=${btoa(email)}`;
      
      // Simulate API call
      setTimeout(() => {
        alert(`✅ Invitation sent to ${email}!\n\nInvite link: ${inviteLink}\n\nThey will receive an email with instructions to join.`);
        setEmail('');
      }, 500);
    }
  };

  return (
    <div className="panel-system p-6">
      <BackArrow />
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
      <BackArrow />
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
      <BackArrow />
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
