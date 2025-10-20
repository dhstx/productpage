(function initReveal() {
  // SSR/Non-browser guard: do nothing at import in Node/SSR
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const run = () => {
    // Shared reveal classes across the site (desktop + mobile)
    const scopes = [
      document,
      document.querySelector('.hero') || undefined,
    ].filter(Boolean) as Array<Document | Element>;

    scopes.forEach((scope) => {
      const nodes = scope.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
      if (!nodes.length) return;

      const reveal = (n: Element) => n.classList.add('reveal-show');

      if (!('IntersectionObserver' in window)) {
        nodes.forEach((n) => reveal(n));
        return;
      }

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.18 });

      nodes.forEach((n) => io.observe(n));
    });

    // Syntek SVG (run once per session; adds .is-visible)
    const svg = document.getElementById('syntek-svg') as HTMLElement | null;
    if (svg) {
      const key = 'syntekFadeV1';
      const seen = sessionStorage.getItem(key) === '1';
      const show = () => {
        svg.classList.add('is-visible');
        if (!seen) sessionStorage.setItem(key, '1');
      };
      if (seen) { show(); }
      else if (!('IntersectionObserver' in window)) { show(); }
      else {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { show(); obs.unobserve(e.target); }
          });
        }, { threshold: 0.2 });
        io.observe(svg);
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
