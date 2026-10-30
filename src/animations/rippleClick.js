/**
 * Animation: Ripple Click
 * Expanding circular ripple wave originating at the exact click coordinate
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const rippleClick = {
  name: 'ripple-click',
  aliases: ['ripple', 'rippleClick', 'rippleclick'],
  className: 'bc-anim-ripple-click',
  setup(element, options, cleanup) {
    const onPointerDown = (e) => {
      if (prefersReducedMotion()) return;

      const rect = element.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 2;
      const radius = diameter / 2;

      const clientX = e.clientX ?? (rect.left + rect.width / 2);
      const clientY = e.clientY ?? (rect.top + rect.height / 2);

      const ripple = createElement('span', 'bc-ripple-wave', { 'aria-hidden': 'true' });
      ripple.style.width = `${diameter}px`;
      ripple.style.height = `${diameter}px`;
      ripple.style.left = `${clientX - rect.left - radius}px`;
      ripple.style.top = `${clientY - rect.top - radius}px`;

      if (options.rippleColor) {
        ripple.style.backgroundColor = options.rippleColor;
      }

      element.appendChild(ripple);

      const removeRipple = () => {
        try {
          if (ripple.parentNode === element) {
            element.removeChild(ripple);
          }
        } catch {
          // Safe ignore
        }
      };

      ripple.addEventListener('animationend', removeRipple, { once: true });
      setTimeout(removeRipple, 700);
    };

    cleanup.addEventListener(element, 'pointerdown', onPointerDown);
  }
};
