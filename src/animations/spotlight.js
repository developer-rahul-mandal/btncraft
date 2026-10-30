/**
 * Animation: Spotlight
 * Interactive radial spotlight that tracks the mouse pointer within the button bounds
 */

import { prefersReducedMotion } from '../utils/dom.js';

export const spotlight = {
  name: 'spotlight',
  aliases: ['flashlight', 'spotlightHover'],
  className: 'bc-anim-spotlight',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    cleanup.saveStyle('--bc-spot-x');
    cleanup.saveStyle('--bc-spot-y');
    cleanup.saveStyle('--bc-spot-opacity');

    const onMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      element.style.setProperty('--bc-spot-x', `${x}px`);
      element.style.setProperty('--bc-spot-y', `${y}px`);
      element.style.setProperty('--bc-spot-opacity', '1');
    };

    const onMouseLeave = () => {
      element.style.setProperty('--bc-spot-opacity', '0');
    };

    cleanup.addEventListener(element, 'mousemove', onMouseMove);
    cleanup.addEventListener(element, 'mouseleave', onMouseLeave);

    cleanup.add(() => {
      element.style.removeProperty('--bc-spot-x');
      element.style.removeProperty('--bc-spot-y');
      element.style.removeProperty('--bc-spot-opacity');
    });
  }
};
