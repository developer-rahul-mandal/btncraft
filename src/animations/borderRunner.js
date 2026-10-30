/**
 * Animation: Border Runner
 * An energetic light beam running continuously along the button perimeter
 */

import { createElement } from '../utils/dom.js';

export const borderRunner = {
  name: 'border-runner',
  aliases: ['border', 'borderRunner', 'borderrunner'],
  className: 'bc-anim-border-runner',
  setup(element, options, cleanup) {
    const beam = createElement('span', 'bc-runner-beam', { 'aria-hidden': 'true' });
    element.appendChild(beam);
    cleanup.trackElement(beam);

    if (options.color) {
      cleanup.saveStyle('--bc-runner-color');
      element.style.setProperty('--bc-runner-color', options.color);
    }
  }
};
