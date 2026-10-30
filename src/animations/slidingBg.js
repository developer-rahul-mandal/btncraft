/**
 * Animation: Sliding Background
 * Colored or gradient sheet that smoothly slides into view across the button on hover
 */

import { createElement } from '../utils/dom.js';

export const slidingBg = {
  name: 'sliding-bg',
  aliases: ['slide', 'slidingBackground', 'slidingbg', 'slideBg'],
  className: 'bc-anim-sliding-bg',
  setup(element, options, cleanup) {
    const sheet = createElement('span', 'bc-slide-sheet', { 'aria-hidden': 'true' });
    element.appendChild(sheet);
    cleanup.trackElement(sheet);

    if (options.slideColor) {
      cleanup.saveStyle('--bc-slide-color');
      element.style.setProperty('--bc-slide-color', options.slideColor);
    }
    if (options.slideDirection) {
      element.setAttribute('data-slide-dir', options.slideDirection);
      cleanup.add(() => element.removeAttribute('data-slide-dir'));
    }
  }
};
