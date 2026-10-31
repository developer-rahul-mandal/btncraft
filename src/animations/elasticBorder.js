/**
 * Animation: Elastic Border
 * Fluid jelly border-radius oscillation that responds organically on hover
 */

import { prefersReducedMotion } from '../utils/dom.js';

export const elasticBorder = {
  name: 'elastic-border',
  aliases: ['elasticBorder'],
  className: 'bc-anim-elastic-border',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    cleanup.saveStyle('borderRadius');
    cleanup.saveStyle('transition');

    const onEnter = () => {
      element.style.transition = 'border-radius 450ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.borderRadius = options.borderRadius || '20px 4px 20px 4px';
    };

    const onLeave = () => {
      element.style.transition = 'border-radius 350ms ease';
      element.style.borderRadius = '';
    };

    cleanup.addEventListener(element, 'mouseenter', onEnter);
    cleanup.addEventListener(element, 'mouseleave', onLeave);

    cleanup.add(() => {
      element.style.borderRadius = '';
      element.style.transition = '';
    });
  }
};
