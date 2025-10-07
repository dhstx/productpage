import { User, Mail, Lock, Bell } from 'lucide-react';
import { getCurrentUser } from '../lib/auth';

export default function Settings() {
  const user = getCurrentUser();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F2F2F2] mb-2 uppercase tracking-tight">
          ACCOUNT SETTINGS
        </h1>
        <p className="text-[#B3B3B3]">
          Manage your account preferences and security settings.
        </p>
      </div>

      {/* Profile Information */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight flex items-center gap-2">
          <User className="w-5 h-5 text-[#FFC96C]" />
          PROFILE INFORMATION
        </h2>
        <div className="panel-system p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.name || 'Digital Asset Administrator'}
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || 'admin@yourorganization.com'}
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Role
              </label>
              <input
                type="text"
                defaultValue={user?.role || 'Administrator'}
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
                disabled
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="btn-system">
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#FFC96C]" />
          SECURITY
        </h2>
        <div className="panel-system p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#F2F2F2] text-sm font-medium mb-2 uppercase tracking-tight">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-[#0C0C0C] border border-[#202020] rounded-[2px] text-[#F2F2F2] focus:outline-none focus:border-[#FFC96C] transition-colors"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="btn-system">
              Update Password
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-xl font-bold text-[#F2F2F2] mb-4 uppercase tracking-tight flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#FFC96C]" />
          NOTIFICATIONS
        </h2>
        <div className="panel-system p-6">
          <div className="space-y-4">
            <NotificationToggle
              label="Email Notifications"
              description="Receive email updates about your account and platforms"
              defaultChecked={true}
            />
            <NotificationToggle
              label="Platform Updates"
              description="Get notified about new features and platform updates"
              defaultChecked={true}
            />
            <NotificationToggle
              label="Billing Alerts"
              description="Receive notifications about billing and payment issues"
              defaultChecked={true}
            />
            <NotificationToggle
              label="Security Alerts"
              description="Get notified about security events and login attempts"
              defaultChecked={true}
            />
          </div>
          <div className="mt-6">
            <button className="btn-system">
              Save Preferences
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotificationToggle({ label, description, defaultChecked }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-[#202020] last:border-b-0">
      <div>
        <p className="text-[#F2F2F2] font-medium mb-1">{label}</p>
        <p className="text-[#B3B3B3] text-sm">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-[#202020] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FFC96C] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFC96C]"></div>
      </label>
    </div>
  );
}
