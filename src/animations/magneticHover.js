/**
 * Animation: Magnetic Hover
 * Smooth cursor-attraction physics that pulls the button towards the pointer
 */

import { prefersReducedMotion } from '../utils/dom.js';

export const magneticHover = {
  name: 'magnetic-hover',
  aliases: ['magnetic', 'magneticHover', 'magnetichover'],
  className: 'bc-anim-magnetic-hover',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) {
      return;
    }

    const strength = typeof options.strength === 'number' ? options.strength : 0.28;
    cleanup.saveStyle('transform');
    cleanup.saveStyle('transition');

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      element.style.transition = 'transform 120ms ease-out';
      element.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
    };

    const onMouseLeave = () => {
      element.style.transition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.transform = 'translate3d(0, 0, 0)';
    };

    cleanup.addEventListener(element, 'mousemove', onMouseMove);
    cleanup.addEventListener(element, 'mouseleave', onMouseLeave);

    cleanup.add(() => {
      element.style.transform = '';
      element.style.transition = '';
    });
  }
};
