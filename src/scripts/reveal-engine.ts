(function initReveal() {
  const run = () => {
    // Chatbox + generic reveals
    const root = document.querySelector('.hero');
    if (root) {
      const nodes = root.querySelectorAll('.reveal-up');
      if (nodes.length) {
        if (!('IntersectionObserver' in window)) {
          nodes.forEach((n) => n.classList.add('reveal-show'));
        } else {
          const io = new IntersectionObserver((entries, obs) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                (e.target as Element).classList.add('reveal-show');
                obs.unobserve(e.target);
              }
            });
          }, { threshold: 0.18 });
          nodes.forEach((n) => io.observe(n));
        }
      }
    }

    // Syntek SVG (desktop too)
    const svg = document.querySelector('#syntek-automations-hero .fade-once') as HTMLElement | null;
    if (svg) {
      const key = svg.getAttribute('data-key') || 'syntekFadeV1';
      const seen = sessionStorage.getItem(key) === '1';
      const show = () => {
        svg.classList.add('is-visible');
        if (!seen) sessionStorage.setItem(key, '1');
      };

      if (seen) show();
      else if (!('IntersectionObserver' in window)) show();
      else {
        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { show(); obs.unobserve(e.target); }
          });
        }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
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
