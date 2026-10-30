/**
 * Animation: Shine Sweep
 * Razor-sharp specular highlight flash sweeping horizontally across on hover
 */

import { createElement } from '../utils/dom.js';

export const shineSweep = {
  name: 'shine-sweep',
  aliases: ['shine', 'shineSweep', 'shinesweep'],
  className: 'bc-anim-shine-sweep',
  setup(element, options, cleanup) {
    const shine = createElement('span', 'bc-shine-beam', { 'aria-hidden': 'true' });
    element.appendChild(shine);
    cleanup.trackElement(shine);
  }
};
