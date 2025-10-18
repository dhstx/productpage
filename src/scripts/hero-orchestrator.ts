(function initHeroOrchestrator(){
  const hero = document.querySelector('.hero');
  if (!hero) return;

  function waitForTypewriter() {
    return new Promise<void>((resolve) => {
      const el = document.querySelector('#hero-typed') as HTMLElement | null;
      if (!el) return resolve();

      const done = () => { el.removeEventListener('typed:complete', done as any); resolve(); };

      if (el.getAttribute('data-typed-complete') === '1') return resolve();

      el.addEventListener('typed:complete', done as any);

      // Safety fallback if we somehow miss events
      setTimeout(resolve, 2000);
    });
  }

  function revealChatboxEls() {
    const els = hero.querySelectorAll('.cb-reveal');
    els.forEach((el) => el.classList.add('show'));
    return new Promise<void>((resolve) => {
      if (!els.length) return resolve();
      let pending = els.length;
      const done = () => { if (--pending === 0) resolve(); };
      els.forEach((el) => {
        const onEnd = (e: Event) => {
          if (e.target === el) { (el as HTMLElement).removeEventListener('transitionend', onEnd as any); done(); }
        };
        (el as HTMLElement).addEventListener('transitionend', onEnd as any);
      });
      setTimeout(resolve, 1200); // safety
    });
  }

  function fireSyntekTitle() {
    const title = document.querySelector('.syntek-title');
    if (title) title.classList.add('is-live');
  }

  waitForTypewriter()
    .then(revealChatboxEls)
    .then(fireSyntekTitle);
})();
