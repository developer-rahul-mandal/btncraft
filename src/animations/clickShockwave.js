/**
 * Animation: Click Shockwave
 * High-velocity expanding shockwave distortion ring emitting from click point
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const clickShockwave = {
  name: 'click-shockwave',
  aliases: ['shockwave', 'clickShockwave'],
  className: 'bc-anim-click-shockwave',
  setup(element, options, cleanup) {
    const shockColor = options.shockwaveColor || options.color || 'var(--bc-bg, #6366f1)';

    const onPointerDown = (e) => {
      if (prefersReducedMotion()) return;

      const rect = element.getBoundingClientRect();
      const originX = (e.clientX !== undefined) ? e.clientX - rect.left : rect.width / 2;
      const originY = (e.clientY !== undefined) ? e.clientY - rect.top : rect.height / 2;

      const ring = createElement('span', 'bc-shockwave-ring', { 'aria-hidden': 'true' });
      ring.style.left = `${originX}px`;
      ring.style.top = `${originY}px`;
      ring.style.borderColor = shockColor;

      element.appendChild(ring);

      setTimeout(() => {
        if (ring.parentNode === element) {
          element.removeChild(ring);
        }
      }, 700);
    };

    cleanup.addEventListener(element, 'pointerdown', onPointerDown);
  }
};
