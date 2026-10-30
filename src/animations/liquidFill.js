/**
 * Animation: Liquid Fill
 * Liquid wave that rises from the bottom of the button to fill it up on hover
 */

import { createElement } from '../utils/dom.js';

export const liquidFill = {
  name: 'liquid-fill',
  aliases: ['liquid', 'liquidFill', 'liquidfill'],
  className: 'bc-anim-liquid-fill',
  setup(element, options, cleanup) {
    const wave = createElement('div', 'bc-liquid-wave', { 'aria-hidden': 'true' });
    wave.innerHTML = `
      <svg viewBox="0 0 500 150" preserveAspectRatio="none" class="bc-liquid-svg">
        <path d="M0,50 C150,120 350,0 500,50 L500,150 L0,150 Z"></path>
      </svg>
    `;

    element.appendChild(wave);
    cleanup.trackElement(wave);

    if (options.liquidColor || options.color) {
      cleanup.saveStyle('--bc-liquid-color');
      element.style.setProperty('--bc-liquid-color', options.liquidColor || options.color);
    }
  }
};
