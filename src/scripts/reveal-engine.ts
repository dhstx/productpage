(function initReveal() {
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

    // Syntek SVG (once per reload; simple fade-in)
    const svg = document.getElementById('syntek-svg') as HTMLElement | null;
    if (svg) {
      const show = () => { svg.classList.add('visible'); };
      if (!('IntersectionObserver' in window)) { show(); }
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
