import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

// Theme persistence key must remain unchanged
const THEME_KEY = 'dhstx-theme';

function setThemeDom(nextTheme) {
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  document.documentElement.setAttribute('data-theme', nextTheme);
  try { localStorage.setItem(THEME_KEY, nextTheme); } catch {}
}

function getThemeDom() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
  } catch {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// (Removed) Animated bleed transition; instant theme switching only

export default function ThemeToggle({ inline = false, className = '' }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Migrate old key if present
    const legacy = localStorage.getItem('theme');
    const stored = localStorage.getItem(THEME_KEY);

    let initialTheme = stored || legacy;
    if (!initialTheme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
      // Persist first-visit preference (no animation)
      try { localStorage.setItem(THEME_KEY, initialTheme); } catch {}
    }

    setTheme(initialTheme);
    // Set both class and data attribute for theming systems
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);

    // Cleanup any leftover transition overlays from hot-reload
    try {
      document.querySelectorAll('.theme-wipe, .theme-bleed').forEach(el => el.remove());
    } catch {}
  }, []);

  const toggleTheme = () => {
    const prev = getThemeDom();
    const nextTheme = prev === 'dark' ? 'light' : 'dark';
    setThemeDom(nextTheme);
    setTheme(nextTheme);
  };

  const baseClasses = inline
    ? 'z-40 w-9 h-9 rounded-full bg-[#1A1A1A] border border-[#202020] hover:bg-[#202020] transition-colors flex items-center justify-center shadow'
    : 'md:fixed md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#202020] hover:bg-[#202020] transition-colors flex items-center justify-center shadow-lg';

  return (
    <button
      onClick={toggleTheme}
      className={`${baseClasses} ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
      id="themeToggle"
    >
      {theme === 'dark' ? (
        <Sun className={inline ? 'w-4 h-4 text-[#FFC96C]' : 'w-5 h-5 text-[#FFC96C]'} />
      ) : (
        <Moon className={inline ? 'w-4 h-4 text-[#FFC96C]' : 'w-5 h-5 text-[#FFC96C]'} />
      )}
    </button>
  );
}
