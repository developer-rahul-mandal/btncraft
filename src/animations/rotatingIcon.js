/**
 * Animation: Rotating Icon
 * Smooth rotational transformation for embedded or generated icons on hover
 */

import { createElement } from '../utils/dom.js';

export const rotatingIcon = {
  name: 'rotating-icon',
  aliases: ['rotate-icon', 'rotatingIcon', 'rotateIcon'],
  className: 'bc-anim-rotating-icon',
  setup(element, options, cleanup) {
    let icon = element.querySelector('.bc-icon, svg, i');
    let injected = false;

    if (!icon) {
      icon = createElement('span', 'bc-icon', { 'aria-hidden': 'true' });
      icon.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;
      element.appendChild(icon);
      cleanup.trackElement(icon);
      injected = true;
    } else if (!icon.classList.contains('bc-icon')) {
      icon.classList.add('bc-icon');
      cleanup.add(() => icon.classList.remove('bc-icon'));
    }

    if (options.rotateDeg) {
      cleanup.saveStyle('--bc-rotate-deg');
      element.style.setProperty('--bc-rotate-deg', String(options.rotateDeg));
    }
  }
};
