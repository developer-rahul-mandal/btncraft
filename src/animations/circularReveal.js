/**
 * Animation: Circular Reveal
 * Injects a radial clip-path layer that expands smoothly outward from pointer entry coordinate
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';
import { PointerTracker } from '../core/interaction.js';

export const circularReveal = {
  name: 'circular-reveal',
  aliases: ['circleReveal', 'circularReveal'],
  className: 'bc-anim-circular-reveal',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    const curtain = createElement('span', 'bc-reveal-curtain', { 'aria-hidden': 'true' });
    if (options.revealColor) {
      curtain.style.backgroundColor = options.revealColor;
    }
    element.appendChild(curtain);
    cleanup.trackElement(curtain);

    const tracker = new PointerTracker(element, cleanup);

    tracker.onEnter((e, rect) => {
      if (rect) {
        const x = (e.clientX !== undefined) ? e.clientX - rect.left : rect.width / 2;
        const y = (e.clientY !== undefined) ? e.clientY - rect.top : rect.height / 2;
        curtain.style.setProperty('--bc-reveal-x', `${x.toFixed(1)}px`);
        curtain.style.setProperty('--bc-reveal-y', `${y.toFixed(1)}px`);
      }
    });
  }
};
