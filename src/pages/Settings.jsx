import { useState } from 'react';
import { 
  User, Users, CreditCard, Key, UserPlus, FileText, 
  Palette, LogOut, Save, Mail, Building, Phone 
} from 'lucide-react';
import { logout, getCurrentUser } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  return (
    <div className="panel-system p-6">
      <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight">
        BILLING & SUBSCRIPTION
      </h2>
      <p className="text-[#B3B3B3] mb-6">
        Manage your subscription plan and payment methods.
      </p>
      <button onClick={() => navigate('/billing')} className="btn-system">
        Go to Billing
      </button>
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
