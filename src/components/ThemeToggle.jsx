import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

// Theme persistence key must remain unchanged
const THEME_KEY = 'dhstx-theme';
const DURATION = 2000;

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

function bleedTransition(prevTheme, nextTheme) {
  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setThemeDom(nextTheme);
    return;
  }

  // Determine direction and overlay tint = PREVIOUS theme dominant color
  const directionClass = (prevTheme === 'dark' && nextTheme === 'light') ? 'ltr' : 'rtl';
  const styles = getComputedStyle(document.documentElement);
  const lightBase = (styles.getPropertyValue('--bg') || '#F7F7F8').trim() || '#F7F7F8';
  const darkBase  = '#0B0B0B'; // safe dark base even if no --bg-dark token

  const overlay = document.createElement('div');
  overlay.className = `theme-bleed ${directionClass}`;
  overlay.style.background = (prevTheme === 'dark') ? darkBase : lightBase;

  // Apply the NEW theme underneath immediately
  setThemeDom(nextTheme);

  // Start bleed animation
  document.body.appendChild(overlay);
  window.setTimeout(() => {
    try { overlay.remove(); } catch {}
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
    const prev = getThemeDom();
    const nextTheme = prev === 'dark' ? 'light' : 'dark';

    // Run the bleed overlay; it handles reduced motion and cleanup
    bleedTransition(prev, nextTheme);

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
