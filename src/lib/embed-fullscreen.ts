/**
 * Fullscreen button of the interactive embed (`Embed.astro`). Loaded by the case-study layout, not by Embed itself: a component that is only
 * rendered inside a protected case study (`Protected` renders its slot to a string) cannot hoist its own script onto the page.
 */
const w = window as unknown as { __embedFs?: boolean };
if (!w.__embedFs) {
  w.__embedFs = true;
  const live = (b: Element) => b.closest<HTMLElement>('[data-embed-live]');
  document.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('[data-embed-fs]');
    const box = b && live(b);
    if (!box) return;
    if (document.fullscreenElement === box) document.exitFullscreen();
    else box.requestFullscreen?.()?.catch(() => {}); // refused (permissions, iframe policy): stay as is
  });
  document.addEventListener('fullscreenchange', () => {
    document.querySelectorAll('[data-embed-fs]').forEach((b) => {
      const on = document.fullscreenElement === live(b);
      b.toggleAttribute('data-on', on);
      b.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Enter fullscreen');
      b.querySelector('span')!.textContent = on ? 'Exit fullscreen' : 'Fullscreen';
    });
  });
  // the buttons are hidden until we know the browser can do fullscreen (also after each ClientRouter navigation, and after a protected case study is unlocked)
  const show = () => { if (document.fullscreenEnabled) document.querySelectorAll<HTMLElement>('[data-embed-fs][hidden]').forEach((b) => (b.hidden = false)); };
  document.addEventListener('astro:page-load', show);
  new MutationObserver(show).observe(document.body, { childList: true, subtree: true });
  show();
}

export {};
