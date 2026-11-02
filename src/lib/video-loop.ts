/**
 * Loop videos (`Video.astro` with `loop`): they play while in view, and the Pause/Play button below stops them for good until pressed again.
 * Loaded by the case-study layout, not by Video itself: a component that is only rendered inside a protected case study (`Protected` renders
 * its slot to a string) cannot hoist its own script onto the page.
 */
const w = window as unknown as { __videoLoop?: boolean };
if (!w.__videoLoop) {
  w.__videoLoop = true;
  const init = () => {
    document.querySelectorAll<HTMLElement>('.video').forEach((fig) => {
      const v = fig.querySelector<HTMLVideoElement>('video[data-video-loop]');
      const b = fig.querySelector<HTMLButtonElement>('[data-video-pp]');
      if (!v || !b || b.dataset.ready) return;
      b.dataset.ready = '1';
      let off = false; // the user stopped it: stays stopped until played again
      let visible = false;
      // the button always shows the real state of the video (also when it is paused because it scrolled out of view)
      const sync = () => {
        b.toggleAttribute('data-on', v.paused);
        b.setAttribute('aria-label', v.paused ? 'Play video' : 'Pause video');
      };
      const update = () => {
        if (visible && !off) v.play().catch(() => {});
        else v.pause();
      };
      b.hidden = false;
      v.addEventListener('play', sync);
      v.addEventListener('pause', sync);
      sync();
      b.addEventListener('click', () => {
        off = !v.paused; // playing -> the user stops it; paused -> the user starts it
        if (off) v.pause();
        else v.play().catch(() => {});
      });
      new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        update();
      }, { threshold: 0.25 }).observe(v);
    });
  };
  document.addEventListener('astro:page-load', init);
  new MutationObserver(init).observe(document.body, { childList: true, subtree: true }); // protected case studies insert their content after unlocking
  init();
}

export {};
