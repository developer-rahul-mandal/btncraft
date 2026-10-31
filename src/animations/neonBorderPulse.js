/**
 * Animation: Neon Border Pulse
 * Multi-layered concentric cyber borders pulsating outwards in continuous rhythm
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const neonBorderPulse = {
  name: 'neon-border-pulse',
  aliases: ['borderPulse', 'neonBorderPulse'],
  className: 'bc-anim-neon-border-pulse',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    const ring1 = createElement('span', 'bc-neon-ring bc-neon-ring-1', { 'aria-hidden': 'true' });
    const ring2 = createElement('span', 'bc-neon-ring bc-neon-ring-2', { 'aria-hidden': 'true' });

    if (options.pulseColor) {
      ring1.style.borderColor = options.pulseColor;
      ring2.style.borderColor = options.pulseColor;
    }

    element.appendChild(ring1);
    element.appendChild(ring2);

    cleanup.trackElement(ring1);
    cleanup.trackElement(ring2);
  }
};
