import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Bell,
  Shield,
  Download,
  Trash2,
  LogOut,
  Key,
  Mail,
  Phone,
  Building,
  Save,
  Eye,
  EyeOff,
  CreditCard
} from 'lucide-react';
import BackArrow from '../components/BackArrow';
import PageTitle from '@/components/PageTitle';
import BillingContent from '@/features/billing/BillingContent';
import { useAuth } from '../contexts/AuthContext';
import supabaseAuth from '../lib/auth/supabaseAuth';

const SECTION_CONFIG = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'sessions', label: 'Active Sessions', icon: Shield },
  { id: 'data', label: 'Data & Privacy', icon: Download },
];

export default function SettingsEnhanced() {
  const { user, profile, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('billing');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await authLogout();
      navigate('/login');
    }
  };

  const sections = {
    profile: <ProfileSection user={user} profile={profile} />,
    security: <SecuritySection user={user} />,
    billing: <BillingSection />,
    notifications: <NotificationsSection user={user} />,
    sessions: <SessionsSection user={user} />,
    data: <DataPrivacySection user={user} />,
  };

  return (
    <div className="settings-page min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackArrow />
        
        {/* Header */}
        <div className="mb-8">
          <PageTitle className="mb-2 uppercase tracking-tight">SETTINGS</PageTitle>
          <p style={{ color: 'var(--muted)' }}>Manage your account, billing, and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="settings-panel rounded-lg shadow p-4">
              <div className="text-sm font-medium mb-4 pb-4 border-b" style={{ color: 'var(--muted)', borderColor: 'var(--card-border, var(--border))' }}>
                Account Settings
              </div>
              <nav className="space-y-1">
                {SECTION_CONFIG.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left"
                    style={activeSection === id ? { background: 'var(--accent-muted, rgba(229,170,93,0.12))', color: 'var(--text)' } : { color: 'var(--text)' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left mt-4 pt-4 border-t"
                  style={{ borderColor: 'var(--card-border, var(--border))', color: '#ff6b6b' }}
                >
                  <LogOut className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                  <span className="text-sm font-medium">Log out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-3">
            {sections[activeSection]}
          </section>
        </div>
      </div>
    </div>
  );
}

// Billing Section – link into the dedicated billing page for full management
function BillingSection() {
  return (
    <div className="settings-panel rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Billing</h2>
        <p className="mt-2" style={{ color: 'var(--muted)' }}>
          Manage your subscription, payment methods, invoices, and purchase additional Points.
        </p>
      </div>
      <BillingContent embedded />
    </div>
  );
}

// Profile Section
function ProfileSection({ user, profile }) {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    company: profile?.company || '',
    avatarUrl: profile?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const result = await supabaseAuth.updateUserProfile({
        full_name: formData.fullName,
        phone: formData.phone,
        company: formData.company,
        avatar_url: formData.avatarUrl,
      });

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Profile Information</h2>

      {message && (
        <div className="mb-4 p-4 rounded-lg" style={{
          background: message.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(220,38,38,0.12)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(220,38,38,0.35)'}`,
          color: message.type === 'success' ? '#22c55e' : '#ff6b6b'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full pl-10 pr-4 py-2 border rounded-lg cursor-not-allowed"
              style={{ background: 'var(--card-bg)', color: 'var(--muted)', borderColor: 'var(--card-border)', opacity: 0.7 }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            Company
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
              placeholder="Acme Inc."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
            Avatar URL
          </label>
          <input
            type="url"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg btn-system disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-5 w-5" style={{ color: 'var(--muted)' }} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

// Security Section
function SecuritySection({ user }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      setSaving(false);
      return;
    }

    try {
      const result = await supabaseAuth.updatePassword(formData.newPassword);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="settings-panel rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Change Password</h2>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.new ? (
                  <EyeOff className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                ) : (
                  <Eye className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ background: 'var(--card-bg)', color: 'var(--text)', borderColor: 'var(--card-border)' }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                ) : (
                  <Eye className="h-5 w-5" style={{ color: 'var(--muted)' }} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg btn-system disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" style={{ color: 'var(--muted)' }} />
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="settings-panel rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Two-Factor Authentication</h2>
        <p className="mb-4" style={{ color: 'var(--muted)' }}>
          Add an extra layer of security to your account
        </p>
        <button className="px-4 py-2 rounded-lg" style={{ background: 'var(--accent-muted, rgba(229,170,93,0.12))', color: 'var(--text)' }}>
          Enable 2FA (Coming Soon)
        </button>
      </div>
    </div>
  );
}

// Notifications Section
function NotificationsSection({ user }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    ptAlerts: true,
    billingReminders: true,
    productUpdates: false,
    marketingEmails: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Save notification preferences to backend
      const response = await fetch('/api/user/notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Preferences saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save preferences' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-panel rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Notification Preferences</h2>

      {message && (
        <div className="mb-4 p-4 rounded-lg" style={{
          background: message.type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(220,38,38,0.12)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.35)' : 'rgba(220,38,38,0.35)'}`,
          color: message.type === 'success' ? '#22c55e' : '#ff6b6b'
        }}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {Object.entries({
          emailNotifications: 'Email Notifications',
          ptAlerts: 'Point Usage Alerts',
          billingReminders: 'Billing Reminders',
          productUpdates: 'Product Updates',
          marketingEmails: 'Marketing Emails',
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
            <div>
              <p className="font-medium text-gray-900">{label}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                {key === 'emailNotifications' && 'Receive email notifications for important events'}
                {key === 'ptAlerts' && 'Get notified when you\'re running low on Points'}
                {key === 'billingReminders' && 'Reminders about upcoming billing dates'}
                {key === 'productUpdates' && 'News about new features and improvements'}
                {key === 'marketingEmails' && 'Promotional offers and tips'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={() => handleToggle(key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg btn-system disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="h-5 w-5" style={{ color: 'var(--muted)' }} />
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );
}

// Sessions Section
function SessionsSection({ user }) {
  const [sessions, setSessions] = useState([
    {
      id: '1',
      device: 'Chrome on MacOS',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: '2',
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      current: false,
    },
  ]);

  const handleRevoke = (sessionId) => {
    if (window.confirm('Are you sure you want to revoke this session?')) {
      setSessions(sessions.filter(s => s.id !== sessionId));
    }
  };

  return (
    <div className="settings-panel rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text)' }}>Active Sessions</h2>
      <p className="mb-6" style={{ color: 'var(--muted)' }}>
        Manage your active sessions across different devices
      </p>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--card-border, var(--border))' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {session.device}
                  {session.current && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {session.location} • {session.lastActive}
                </p>
              </div>
            </div>
            {!session.current && (
                <button
                  onClick={() => handleRevoke(session.id)}
                  className="px-3 py-1 text-sm rounded-lg transition-colors"
                  style={{ color: '#ff6b6b', background: 'transparent' }}
                >
                Revoke
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Data & Privacy Section
function DataPrivacySection({ user }) {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/user/export-data', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-data.json';
        a.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all your data. Type DELETE to confirm.')) {
        setDeleting(true);
        try {
          // Call delete account API
          await fetch('/api/user/delete-account', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${user.access_token}`,
            },
          });
          // Redirect to homepage
          window.location.href = '/';
        } catch (error) {
          console.error('Delete failed:', error);
        } finally {
          setDeleting(false);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Data */}
      <div className="settings-panel rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Export Your Data</h2>
        <p className="text-gray-600 mb-4">
          Download a copy of all your data including conversations, settings, and usage history
        </p>
        <button
          onClick={handleExportData}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg btn-system disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" style={{ color: 'var(--muted)' }} />
          {exporting ? 'Exporting...' : 'Export Data'}
        </button>
      </div>

      {/* Delete Account */}
      <div className="settings-panel rounded-lg shadow p-6 border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-5 w-5" style={{ color: 'var(--muted)' }} />
          {deleting ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}

