/**
 * Animation: Pulse Glow
 * Rhythmic breathing radiant glow halo expanding around the button
 */

import { createElement } from '../utils/dom.js';

export const pulseGlow = {
  name: 'pulse-glow',
  aliases: ['pulse', 'pulseGlow', 'pulseglow'],
  className: 'bc-anim-pulse-glow',
  setup(element, options, cleanup) {
    const halo = createElement('span', 'bc-pulse-halo', { 'aria-hidden': 'true' });
    element.appendChild(halo);
    cleanup.trackElement(halo);

    const glowColor = options.pulseColor || options.color || '#3b82f6';
    cleanup.saveStyle('--bc-pulse-color');
    element.style.setProperty('--bc-pulse-color', glowColor);
  }
};
