import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Menu, X, Users, ChevronDown, Bot, Zap } from 'lucide-react';
import { useState } from 'react';
import { logout, getCurrentUser, canUpgrade } from '../lib/auth';

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setProfileMenuOpen(false);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const shouldUpgrade = canUpgrade();
  
  const navigation = [
    { name: 'Agents', href: '/agents', icon: Bot },
    { name: 'Integrations', href: '/integrations-management', icon: Zap },
    { name: 'Platforms', href: '/platforms', icon: Package },
    { name: 'Tools', href: '/team', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-[#F2F2F2] text-xl font-bold tracking-tight">
                DHStx
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
                        item.highlight
                          ? 'bg-[#FFC96C]/10 text-[#FFC96C] border border-[#FFC96C] hover:bg-[#FFC96C]/20'
                          : isActive
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
              {/* Profile Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className="w-7 h-7 rounded-[4px] bg-[#202020] flex items-center justify-center">
                    <span className="text-[#FFC96C] text-sm font-bold">
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[#F2F2F2] text-sm">{user?.username || 'admin'}</span>
                    <span className="text-[#B3B3B3] text-xs">{user?.role === 'admin' ? 'Admin' : 'User'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#B3B3B3]" />
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] border border-[#202020] rounded-[4px] shadow-lg z-50">
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#202020] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 px-4 py-3 text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#202020] transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                  </div>
                )}
              </div>

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
