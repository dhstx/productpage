import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ inline = false, className = '' }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Migrate old key if present
    const legacy = localStorage.getItem('theme');
    const stored = localStorage.getItem('dhstx-theme');

    let initialTheme = stored || legacy;
    if (!initialTheme) {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      initialTheme = prefersDark ? 'dark' : 'light';
      // Persist first-visit preference
      localStorage.setItem('dhstx-theme', initialTheme);
    }

    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = (event) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('dhstx-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.setAttribute('data-theme', newTheme);

    // Trigger Strategic Clarity ripple + toast only when entering light mode
    if (newTheme === 'light') {
      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduceMotion) {
        try {
          const x = (event && event.clientX) || window.innerWidth - 24; // default near toggle area
          const y = (event && event.clientY) || window.innerHeight - 24;

          const ripple = document.createElement('div');
          ripple.className = 'theme-ripple';
          ripple.style.left = `${x}px`;
          ripple.style.top = `${y}px`;
          document.body.appendChild(ripple);
          ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        } catch (_) {
          // no-op if DOM not available
        }
      }
      // Toast message
      try {
        const toast = document.createElement('div');
        toast.className = 'theme-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = 'Entering Strategic Clarity Mode.';
        document.body.appendChild(toast);
        window.setTimeout(() => toast.remove(), 1700);
      } catch (_) {
        // ignore
      }
    }
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
    >
      {theme === 'dark' ? (
        <Sun className={inline ? 'w-4 h-4 text-[#FFC96C]' : 'w-5 h-5 text-[#FFC96C]'} />
      ) : (
        <Moon className={inline ? 'w-4 h-4 text-[#FFC96C]' : 'w-5 h-5 text-[#FFC96C]'} />
      )}
    </button>
  );
}
