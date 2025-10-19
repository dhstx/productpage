(function initHeroOrchestrator(){
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

    const chatEls = Array.from(hero.querySelectorAll('.cb-reveal')) as HTMLElement[];
    const titleEl = document.querySelector('.syntek-title') as HTMLElement | null;

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

      // Opt-in to animation just-in-time
      chatEls.forEach((el) => {
        if (!el.classList.contains('will-animate')) el.classList.add('will-animate');
      });
      // Force reflow so transition starts when adding 'show'
      void document.body.offsetHeight;
      chatEls.forEach((el) => el.classList.add('show'));

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
    if (!titleEl.classList.contains('will-animate')) titleEl.classList.add('will-animate');
    // Next frame, trigger final state
    requestAnimationFrame(() => titleEl.classList.add('is-live'));
  }

    waitForTypewriter()
      .then(revealChatEls)
      .then(showTitle)
      .catch(() => {
        // Any failure → force visible
        chatEls.forEach((el) => el.classList.add('show'));
        if (titleEl) titleEl.classList.add('is-live');
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
