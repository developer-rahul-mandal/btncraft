/**
 * Animation: Shimmer
 * Pearlescent light band sweeping smoothly across the button surface
 */

import { createElement } from '../utils/dom.js';

export const shimmer = {
  name: 'shimmer',
  aliases: ['shimmerEffect'],
  className: 'bc-anim-shimmer',
  setup(element, options, cleanup) {
    const sweep = createElement('span', 'bc-shimmer-sweep', { 'aria-hidden': 'true' });
    element.appendChild(sweep);
    cleanup.trackElement(sweep);

    if (options.shimmerColor) {
      cleanup.saveStyle('--bc-shimmer-color');
      element.style.setProperty('--bc-shimmer-color', options.shimmerColor);
    }
  }
};
