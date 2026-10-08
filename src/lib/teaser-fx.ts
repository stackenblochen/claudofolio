/**
 * SWITCHED OFF (kept for later). Nothing imports this module any more. To bring the ripple back: add `<canvas class="fx" data-teaser-fx aria-hidden="true">`
 * to ProjectCard.astro with its `.fx` styles (absolute, inset 0, z-index 2, opacity 0, `.is-on` = 1, shown only from 992 px with a fine pointer), and import
 * this file in a <script> in ProjectCard.astro and in CaseStudy.astro. It adds `.is-active` to the teaser on pointer enter, so CSS can key off that instead of :hover.
 *
 * Hover effect of the project teasers: a one-off colour-split ripple that runs across the whole card (text and cover) from the
 * point where the pointer entered, then stops and leaves the content untouched. See ProjectCard.astro for the markup and styles.
 * Lives in its own module so a page can import it directly: teasers inside a password gate are rendered to a string and
 * encrypted, which hides them from Astro's script collection, so CaseStudy.astro imports this file as well.
 */
  import { paintImage, paintText, setupPrism, type Prism } from './prism';

  let stops: (() => void)[] = [];

  function init() {
    stops.forEach((fn) => fn());
    stops = [];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!matchMedia('(min-width: 992px)').matches) return; // no hover effect on tablet and mobile

    document.querySelectorAll<HTMLElement>('[data-teaser]').forEach((teaser) => {
      const canvas = teaser.querySelector<HTMLCanvasElement>('[data-teaser-fx]');
      const copy = teaser.querySelector<HTMLElement>('[data-teaser-copy]');
      if (!canvas || !copy) return;

      // Text and cover both go into the effect texture, so the ripple runs over the whole card.
      const prism: Prism | null = setupPrism({
        stage: teaser,
        canvas,
        bg: teaser,
        mode: 'ripple',
        rippleMs: 1100,
        paint: (ctx, rect) => {
          // the card grows on hover, so DOM positions are a little larger than the canvas's layout pixels: k converts them back
          const k = teaser.offsetWidth / rect.width;
          paintText(ctx, rect, copy, k);
          teaser.querySelectorAll<HTMLImageElement>('[data-teaser-thumb] img').forEach((img) => paintImage(ctx, rect, img, k));
        },
        radius: (w) => Math.min(Math.max(w * 0.3, 200), 320), // the wave front is half of this wide
      });
      if (!prism) return;

      const onEnter = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        teaser.classList.add('is-active');
        const r = teaser.getBoundingClientRect();
        const k = teaser.offsetWidth / r.width; // the card may be mid-zoom
        prism.ripple((e.clientX - r.left) * k, (e.clientY - r.top) * k); // plays once, from where the pointer touched the card
      };
      const onLeave = () => teaser.classList.remove('is-active');

      teaser.addEventListener('pointerenter', onEnter);
      teaser.addEventListener('pointerleave', onLeave);
      // The list item scales and slides in (.reveal). If the texture was painted mid-reveal, text and canvas size are off by that
      // scale and the ResizeObserver does not notice (transforms change no layout), so rebuild once the reveal has finished.
      const item = teaser.closest<HTMLElement>('.reveal');
      const onRevealed = (e: TransitionEvent) => { if (e.target === item && e.propertyName === 'transform') init(); };
      item?.addEventListener('transitionend', onRevealed);

      stops.push(() => {
        item?.removeEventListener('transitionend', onRevealed);
        teaser.removeEventListener('pointerenter', onEnter);
        teaser.removeEventListener('pointerleave', onLeave);
        teaser.classList.remove('is-active');
        prism.dispose();
      });
    });
  }

  matchMedia('(min-width: 992px)').addEventListener('change', () => init()); // switch the effect on/off when the window crosses 992 px
  document.addEventListener('astro:page-load', init);
  document.addEventListener('content-unlocked', init); // teasers inside a password gate only exist after decryption
  document.addEventListener('astro:before-swap', () => { stops.forEach((fn) => fn()); stops = []; });
