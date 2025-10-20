(function initHeroOrchestrator(){
  // SSR/Non-browser guard: do nothing at import in Node/SSR
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  // Ensure no-flash guard is lifted once JS executes
  try {
    if (document && document.body && document.body.getAttribute('data-js-ready') !== '1') {
      document.body.setAttribute('data-js-ready', '1');
    }
  } catch {}

  function run() {
    const hero = document.querySelector('.hero') as HTMLElement | null;
    if (!hero || hero.getAttribute('data-orchestrated') === '1') return;
    hero.setAttribute('data-orchestrated', '1');

    // Reveal the chatbox extras after the typewriter completes
    // Updated selector per UI refactor: .chatbox-extras.fade-once is now the wrapper
    const chatEls = Array.from(hero.querySelectorAll('.chatbox-extras')) as HTMLElement[];
    const titleEl = document.getElementById('syntek-heading') as HTMLElement | null;

  function waitForTypewriter() {
    return new Promise<void>((resolve) => {
      const typedEl = document.querySelector('#hero-typed') as HTMLElement | null;
      // If no typed target exists, do not delay visibility
      if (!typedEl) return resolve();

      const done = () => { typedEl.removeEventListener('typed:complete', done as any); resolve(); };

      if (typedEl.getAttribute('data-typed-complete') === '1') return resolve();

      typedEl.addEventListener('typed:complete', done as any);
      // Never block forever
      setTimeout(resolve, 3000);
    });
  }

  function revealChatEls() {
    return new Promise<void>((resolve) => {
      if (!chatEls.length) return resolve();

      // Use site-wide up-fade utility: .fade-once + .is-visible
      // Ensure class present before toggling visibility
      chatEls.forEach((el) => el.classList.add('fade-once'));
      // Force reflow then reveal
      void document.body.offsetHeight;
      chatEls.forEach((el) => el.classList.add('is-visible'));

      let pending = chatEls.length;
      const done = () => { if (--pending === 0) resolve(); };
      chatEls.forEach((el) => {
        const onEnd = (e: Event) => {
          if (e.target === el) { el.removeEventListener('transitionend', onEnd as any); done(); }
        };
        el.addEventListener('transitionend', onEnd as any);
      });
      setTimeout(resolve, 1200); // safety
    });
  }

  function showTitle() {
    if (!titleEl) return;
    if (!titleEl.classList.contains('reveal')) titleEl.classList.add('reveal');
    requestAnimationFrame(() => titleEl.classList.add('show'));
  }

    // Wait for typewriter to finish, then reveal chatbox, then show title
    waitForTypewriter()
      .then(revealChatEls)
      .then(showTitle)
      .catch(() => {
        // Any failure → force visible
        chatEls.forEach((el) => el.classList.add('is-visible'));
        if (titleEl) {
          if (!titleEl.classList.contains('reveal')) titleEl.classList.add('reveal');
          titleEl.classList.add('show');
        }
      });
  }

  const tryRun = () => {
    if (document.querySelector('.hero')) run();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryRun, { once: true });
  } else {
    tryRun();
  }

  if (!document.querySelector('.hero')) {
    const mo = new MutationObserver(() => {
      if (document.querySelector('.hero')) {
        run();
        mo.disconnect();
      }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }
})();
