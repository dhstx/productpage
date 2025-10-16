import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Menu, Users, ChevronDown, Bot, Zap } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from './ui/sheet';
import ThemeToggle from './ThemeToggle';
import { logout, getCurrentUser, canUpgrade } from '../lib/auth';

export default function AdminLayout({ children }) {
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
    { name: 'Team', href: '/team', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0C0C0C]">
      {/* Header */}
      <header className="border-b border-[#202020] bg-[#0C0C0C] md:sticky top-0 z-50">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-4">
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
              <ThemeToggle inline />
              {/* Settings icon shortcut */}
              <Link
                to="/settings"
                className="hidden md:inline-flex p-2 rounded-[2px] text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A] transition-colors"
                aria-label="Open settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
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

              {/* Mobile Sheet Navigation */}
              <div className="md:hidden flex items-center gap-1">
                {/* Mobile settings icon next to hamburger */}
                <Link to="/settings" aria-label="Open settings" className="text-[#F2F2F2] p-2">
                  <Settings className="w-6 h-6" />
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="text-[#F2F2F2] p-2" aria-label="Open navigation">
                      <Menu className="w-6 h-6" />
                    </button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full max-w-[28rem] mx-0 px-0">
                    <SheetHeader className="sr-only">
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <nav className="px-4 py-4 space-y-2">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                          <SheetClose asChild key={item.name}>
                            <Link
                              to={item.href}
                              className={`flex items-center gap-3 px-4 py-3 rounded-[2px] transition-colors ${
                                isActive
                                  ? 'bg-[#1A1A1A] text-[#FFC96C]'
                                  : 'text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="uppercase tracking-tight">{item.name}</span>
                            </Link>
                          </SheetClose>
                        );
                      })}
                      <SheetClose asChild>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex items-center gap-3 px-4 py-3 text-[#B3B3B3] hover:text-[#F2F2F2] hover:bg-[#1A1A1A] rounded-[2px] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className="w-5 h-5" />
                          <span className="uppercase tracking-tight">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                        </button>
                      </SheetClose>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
          {/* Mobile Menu removed in favor of Sheet */}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-screen-xl px-4 md:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#202020] mt-24">
        <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-8">
          {/* Intentionally left blank: removed System Management text per spec */}
        </div>
      </footer>
    </div>
  );
}
