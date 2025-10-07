import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Menu, X, Users } from 'lucide-react';
import { useState } from 'react';
import { logout, getCurrentUser } from '../lib/auth';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Members', href: '/members', icon: Users },
    { name: 'My Platforms', href: '/platforms', icon: Package },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-[#F2F2F2] text-xl font-bold tracking-tight">
                ADMIN PORTAL
              </Link>
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-[2px] transition-colors ${
                        isActive
                          ? 'bg-[#1A1A1A] text-[#FFC96C]'
                          : 'text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm uppercase tracking-tight">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-4 py-2 panel-system">
                <div className="w-8 h-8 rounded-full bg-[#202020] flex items-center justify-center">
                  <span className="text-[#FFC96C] text-sm font-bold">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[#F2F2F2] text-sm font-medium">{user?.name || 'Administrator'}</p>
                  <p className="text-[#B3B3B3] text-xs">{user?.role || 'Admin'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex btn-system items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#F2F2F2] p-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#202020] pt-4">
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-[2px] transition-colors ${
                        isActive
                          ? 'bg-[#1A1A1A] text-[#FFC96C]'
                          : 'text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="uppercase tracking-tight">{item.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A] rounded-[2px] transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="uppercase tracking-tight">Logout</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#202020] mt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-[#B3B3B3] text-sm">
            <p className="uppercase tracking-tight">System Management</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
