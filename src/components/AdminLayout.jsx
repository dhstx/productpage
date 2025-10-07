import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { logout, getCurrentUser } from '../lib/auth';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Platforms', href: '/platforms', icon: Package },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Link to="/dashboard" className="text-[#F2F2F2] text-xl font-bold tracking-tight" aria-label="Dashboard home">
                ASSET ADMIN
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-[#F2F2F2] p-2"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-admin-navigation"
              >
                <span className="sr-only">Toggle navigation</span>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <nav aria-label="Admin navigation" className="hidden md:flex items-center gap-1">
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
                disabled={isLoggingOut}
                className="hidden md:flex btn-system items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>

              {/* Mobile Menu Button */}
              <div className="md:hidden" aria-hidden="true"></div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-[#202020] pt-4" id="mobile-admin-navigation">
              <nav className="space-y-2" aria-label="Mobile admin navigation">
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
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-4 py-3 text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A] rounded-[2px] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="uppercase tracking-tight">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
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
