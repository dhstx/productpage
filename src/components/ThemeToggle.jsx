import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const THEME_KEY = 'dhstx-theme';
const WIPE_DURATION_MS = 2000;
const WIPE_HALF_MS = 1000;

function setThemeDom(nextTheme) {
  document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
}

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
      localStorage.setItem(THEME_KEY, initialTheme);
    }

    setTheme(initialTheme);
    // Set both class and data attribute for theming systems
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = (event) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      // Instant switch, no animations
      setTheme(nextTheme);
      setThemeDom(nextTheme);
      return;
    }

    // Create wipe overlay and animate in appropriate direction
    try {
      const overlay = document.createElement('div');
      overlay.className = 'theme-wipe';
      const direction = nextTheme === 'light' ? 'wipe-left-right' : 'wipe-right-left';
      overlay.style.animation = `${direction} var(--theme-wipe-duration) forwards`;
      document.body.appendChild(overlay);

      // Flip theme at midpoint to complete the illusion
      window.setTimeout(() => {
        setTheme(nextTheme);
        setThemeDom(nextTheme);

        // Preserve existing behavior: ripple + toast when entering light mode
        if (nextTheme === 'light') {
          try {
            const x = (event && event.clientX) || window.innerWidth - 24;
            const y = (event && event.clientY) || window.innerHeight - 24;
            const ripple = document.createElement('div');
            ripple.className = 'theme-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            document.body.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
          } catch (_) {
            // ignore errors creating ripple
          }
          try {
            const toast = document.createElement('div');
            toast.className = 'theme-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.textContent = 'Entering Strategic Clarity Mode';
            document.body.appendChild(toast);
            window.setTimeout(() => toast.remove(), 1700);
          } catch (_) {
            // ignore
          }
        }
      }, WIPE_HALF_MS);

      // Remove overlay after full duration
      window.setTimeout(() => {
        try { overlay.remove(); } catch (_) { /* ignore */ }
      }, WIPE_DURATION_MS);
    } catch (_) {
      // Fallback: if overlay creation fails, perform instant switch
      setTheme(nextTheme);
      setThemeDom(nextTheme);
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
