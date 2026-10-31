/**
 * Animation: Spotlight
 * Interactive radial spotlight that tracks the mouse pointer within the button bounds.
 * Supports desktop mouse and mobile pointer events with cached rect optimization.
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

    let cachedRect = null;
    const updateRect = () => {
      cachedRect = element.getBoundingClientRect();
    };

    const onMove = (e) => {
      const rect = cachedRect || element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      element.style.setProperty('--bc-spot-x', `${x}px`);
      element.style.setProperty('--bc-spot-y', `${y}px`);
      element.style.setProperty('--bc-spot-opacity', '1');
    };

    const onLeave = () => {
      cachedRect = null;
      element.style.setProperty('--bc-spot-opacity', '0');
    };

    cleanup.addEventListener(element, 'mouseenter', updateRect);
    cleanup.addEventListener(element, 'mousemove', onMove);
    cleanup.addEventListener(element, 'mouseleave', onLeave);
    cleanup.addEventListener(element, 'pointerenter', updateRect);
    cleanup.addEventListener(element, 'pointermove', onMove);
    cleanup.addEventListener(element, 'pointerleave', onLeave);

    cleanup.add(() => {
      element.style.removeProperty('--bc-spot-x');
      element.style.removeProperty('--bc-spot-y');
      element.style.removeProperty('--bc-spot-opacity');
    });
  }
};
