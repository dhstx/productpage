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

    // Syntek SVG (robustly handle React mounting timing; add .is-visible once)
    const initSyntekSvg = () => {
      const svgEl = document.getElementById('syntek-svg') as HTMLElement | null;
      if (!svgEl) return false;
      if (svgEl.getAttribute('data-reveal-bound') === '1') return true;

      svgEl.setAttribute('data-reveal-bound', '1');
      const key = 'syntekFadeV1';
      const seen = sessionStorage.getItem(key) === '1';
      const show = () => {
        svgEl.classList.add('is-visible');
        if (!seen) sessionStorage.setItem(key, '1');
      };

      if (seen || !('IntersectionObserver' in window)) {
        show();
      } else {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { show(); obs.unobserve(e.target); }
          });
        }, { threshold: 0.2 });
        io.observe(svgEl);
      }
      return true;
    };

    // Try now; if not present yet, observe DOM until it appears
    if (!initSyntekSvg()) {
      const mo = new MutationObserver(() => {
        if (initSyntekSvg()) mo.disconnect();
      });
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
