/**
 * Animation: Flip Button
 * 3D perspective card rotation on hover revealing alternative action
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const flipButton = {
  name: 'flip-button',
  aliases: ['flip', 'flipButton'],
  className: 'bc-anim-flip-button',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    const backText = options.backText || options.altText || 'Confirm?';
    const backFace = createElement('span', 'bc-flip-back', { 'aria-hidden': 'true' });
    backFace.textContent = backText;

    const frontFace = createElement('span', 'bc-flip-front');
    frontFace.innerHTML = element.innerHTML;

    element.innerHTML = '';
    element.appendChild(frontFace);
    element.appendChild(backFace);

    cleanup.add(() => {
      element.innerHTML = frontFace.innerHTML;
    });
  }
};
