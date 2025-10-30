import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Menu, Users, ChevronDown, Bot, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import "../styles/dashboard-theme.css";
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
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Agents', href: '/agents', icon: Bot },
    { name: 'Integrations', href: '/integrations-management', icon: Zap },
    { name: 'Platforms', href: '/platforms', icon: Package },
    { name: 'Team', href: '/team', icon: Users },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR guard

    const selectors = [
      '.site-banner',
      '.dhstx-banner',
      '.banner',
      '.page-banner',
      '.founding-banner',
      '[data-banner]',
      '[role="banner"]'
    ];

    const collectNodes = () => {
      const out = [];
      selectors.forEach(s => {
        try { document.querySelectorAll(s).forEach(n => out.push(n)); } catch (_) {}
      });
      return Array.from(new Set(out));
    };

    function makeCloneFrom(node) {
      const clone = node.cloneNode(true);
      clone.removeAttribute('id');
      // Clear inline positioning to avoid fixed artifacts
      clone.style.position = '';
      clone.style.top = '';
      clone.style.left = '';
      clone.style.right = '';
      clone.style.zIndex = '';
      clone.classList.add('site-banner');
      clone.id = 'site-banner-clone';
      return clone;
    }

    function canonicalize() {
      try {
        const nodes = collectNodes();
        if (!nodes.length) return;

        const preferred = nodes.find(n => n.classList && n.classList.contains('site-banner'));
        const source = preferred || nodes[0];
        if (!source) return;

        // create or update clone
        let clone = document.getElementById('site-banner-clone');
        if (!clone) {
          clone = makeCloneFrom(source);
          const header = document.querySelector('header') || document.querySelector('.site-header');
          if (header && header.parentNode) {
            header.parentNode.insertBefore(clone, header.nextSibling);
          } else {
            document.body.insertBefore(clone, document.body.firstChild);
          }
        } else {
          clone.innerHTML = source.innerHTML;
          clone.classList.add('site-banner');
        }

        // enforce sticky inline for reliability
        clone.style.position = 'sticky';
        clone.style.top = 'calc(var(--site-header-height, 64px))';
        clone.style.left = '0';
        clone.style.right = '0';
        clone.style.zIndex = '110';

        // compute height and set CSS var
        const rect = clone.getBoundingClientRect();
        const h = Math.max(Math.round(rect.height), 44);
        document.documentElement.style.setProperty('--site-banner-height', `${h}px`);

        // hide all original nodes (including source)
        nodes.forEach(n => {
          try {
            if (n !== clone) {
              n.style.display = 'none';
              n.style.visibility = 'hidden';
              n.style.height = '0';
              n.style.margin = '0';
              n.style.padding = '0';
            } else {
              n.style.display = 'none';
              n.style.visibility = 'hidden';
              n.style.height = '0';
              n.style.margin = '0';
              n.style.padding = '0';
            }
          } catch (_) {}
        });

        // also hide explicit fixed banners that match selectors
        document.querySelectorAll('[style*="position:fixed"], [style*="position: fixed"]').forEach(n => {
          try {
            if (n !== clone && selectors.some(s => n.matches && n.matches(s))) {
              n.style.display = 'none';
            }
          } catch (_) {}
        });
      } catch (err) {
        // non-fatal
        // console.warn('banner canonicalize error', err);
      }
    }

    const runNow = () => { canonicalize(); setTimeout(canonicalize, 750); };
    if (document.readyState === 'interactive' || document.readyState === 'complete') runNow();
    else document.addEventListener('DOMContentLoaded', runNow);

    const mo = new MutationObserver(() => canonicalize());
    mo.observe(document.body, { childList: true, subtree: true });

    const updateHeight = () => {
      const clone = document.getElementById('site-banner-clone');
      if (clone) {
        const rect = clone.getBoundingClientRect();
        const h = Math.max(Math.round(rect.height), 44);
        document.documentElement.style.setProperty('--site-banner-height', `${h}px`);
      }
    };
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    return () => {
      mo.disconnect();
      document.removeEventListener('DOMContentLoaded', runNow);
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return (
    <div className="min-h-screen dashboard-surface">
      {/* Header */}
      <header className="md:sticky top-0 z-50 border-b" style={{ background: 'var(--bg)', borderColor: 'var(--card-border)' }}>
        <div className="mx-auto max-w-screen-xl px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-[2px] transition-colors`}
                      style={
                        item.highlight
                          ? { background: 'var(--accent-muted)', color: 'var(--accent-gold)', border: '1px solid var(--card-border)' }
                          : isActive
                          ? { background: 'var(--card-bg)', color: 'var(--accent-gold)' }
                          : { color: 'var(--muted)' }
                      }
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
              {/* Profile Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] transition-colors hover:brightness-110"
                  style={{ background: 'transparent', color: 'var(--text)' }}
                >
                  <div className="w-7 h-7 rounded-[4px] flex items-center justify-center" style={{ background: 'var(--card-bg)' }}>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent-gold)' }}>
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm" style={{ color: 'var(--text)' }}>{user?.username || 'admin'}</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>{user?.role === 'admin' ? 'Admin' : 'User'}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                </button>

                {/* Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-[4px] shadow-lg z-50" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:brightness-110"
                      style={{ color: 'var(--muted)' }}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-3 px-4 py-3 transition-colors w-full text-left disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                      style={{ color: 'var(--muted)' }}
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
                <Link to="/settings" aria-label="Open settings" className="p-2" style={{ color: 'var(--text)' }}>
                  <Settings className="w-6 h-6" />
                </Link>
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="p-2" aria-label="Open navigation" style={{ color: 'var(--text)' }}>
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
                              className="flex items-center gap-3 px-4 py-3 rounded-[2px] transition-colors"
                              style={isActive ? { background: 'var(--card-bg)', color: 'var(--accent-gold)' } : { color: 'var(--muted)' }}
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
                          className="flex items-center gap-3 px-4 py-3 rounded-[2px] transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                          style={{ color: 'var(--muted)' }}
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
