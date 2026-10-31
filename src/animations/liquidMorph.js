/**
 * Animation: Liquid Morph
 * Organic morphing fluid background with smoothly mutating border-radius curves
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const liquidMorph = {
  name: 'liquid-morph',
  aliases: ['morph', 'liquidMorph'],
  className: 'bc-anim-liquid-morph',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    const blob = createElement('span', 'bc-liquid-blob', { 'aria-hidden': 'true' });
    if (options.morphColor) {
      blob.style.backgroundColor = options.morphColor;
    }
    element.appendChild(blob);
    cleanup.trackElement(blob);
  }
};
