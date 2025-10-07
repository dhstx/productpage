use client;

import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, CreditCard, Settings, LogOut, Users } from "lucide-react";
import { logout, getCurrentUser } from "../lib/auth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const nav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/members", icon: Users },
    { name: "My Platforms", href: "/platforms", icon: Package },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings }
  ];

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-panel bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold tracking-tight text-text-primary">
              ADMIN PORTAL
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map(item => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-sm px-4 py-2 text-sm uppercase tracking-tight transition-colors ${
                      active
                        ? "bg-panel text-accent"
                        : "text-text-secondary hover:bg-panel hover:text-text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-panel">
                <span className="text-sm font-bold text-accent">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{user?.name || "Administrator"}</p>
                <p className="text-xs text-text-secondary">{user?.role || "Admin"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="hidden items-center gap-2 text-sm text-accent hover:opacity-80 md:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden text-text-secondary hover:text-text-primary"
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden border-t border-panel bg-bg px-4 py-2">
            <div className="flex flex-col">
              {nav.map(item => {
                const Icon = item.icon;
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 rounded px-3 py-2 text-sm ${
                      active
                        ? "bg-panel text-accent"
                        : "text-text-secondary hover:bg-panel hover:text-text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="mt-2 flex items-center gap-2 rounded px-3 py-2 text-left text-sm text-accent hover:bg-panel"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
