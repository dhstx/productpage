import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

// Theme persistence key must remain unchanged
const THEME_KEY = 'dhstx-theme';
const DURATION = 2000;
const HALF = 1000;

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

function runThemeWipe(nextTheme) {
  // Respect reduced motion: instant swap, no notifications
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setThemeDom(nextTheme);
    return;
  }

  // Create overlay; color must match the TARGET theme base so the sweep is visible.
  const overlay = document.createElement('div');
  overlay.className = 'theme-wipe ' + (nextTheme === 'light' ? 'lr' : 'rl');

  // Pick a visible base color for the target theme (use existing tokens if available)
  const styles = getComputedStyle(document.documentElement);
  const lightBase = (styles.getPropertyValue('--bg') || '#F7F7F8').trim() || '#F7F7F8';
  const darkBase = (styles.getPropertyValue('--bg-dark') || styles.getPropertyValue('--dhstx-black') || '#0B0B0B').trim() || '#0B0B0B';
  overlay.style.backgroundColor = nextTheme === 'light' ? lightBase : darkBase;

  // Animate width growth for 2s
  overlay.style.animation = `wipe-grow ${DURATION}ms cubic-bezier(.22,.61,.36,1) forwards`;

  document.body.appendChild(overlay);

  // Flip theme at midpoint so underlying UI is new theme when the wipe passes center
  const mid = window.setTimeout(() => { setThemeDom(nextTheme); }, HALF);

  // Cleanup at end
  const end = window.setTimeout(() => {
    try { overlay.remove(); } catch {}
    window.clearTimeout(mid);
    window.clearTimeout(end);
  }, DURATION);
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
      try { localStorage.setItem(THEME_KEY, initialTheme); } catch {}
    }

    setTheme(initialTheme);
    // Set both class and data attribute for theming systems
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = (event) => {
    const current = getThemeDom();
    const nextTheme = current === 'dark' ? 'light' : 'dark';

    // Run the wipe; it handles reduced motion and timing
    runThemeWipe(nextTheme);

    // Update local component state immediately for icon/label correctness
    setTheme(nextTheme);

    // Preserve existing ripple when entering light mode (no toasts)
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
      } catch {}
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
