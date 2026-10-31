/**
 * Animation: Elastic Stretch
 * Tactile elastic squash-and-stretch displacement on pointer press with spring release
 */

import { prefersReducedMotion } from '../utils/dom.js';

export const elasticStretch = {
  name: 'elastic-stretch',
  aliases: ['stretch', 'elasticStretch'],
  className: 'bc-anim-elastic-stretch',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    cleanup.saveStyle('transform');
    cleanup.saveStyle('transition');

    const onDown = () => {
      element.style.transition = 'transform 80ms ease-out';
      element.style.transform = 'scale3d(1.08, 0.92, 1)';
    };

    const onUp = () => {
      element.style.transition = 'transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1)';
      element.style.transform = 'scale3d(1, 1, 1)';
    };

    cleanup.addEventListener(element, 'pointerdown', onDown);
    cleanup.addEventListener(element, 'pointerup', onUp);
    cleanup.addEventListener(element, 'pointerleave', onUp);

    cleanup.add(() => {
      element.style.transform = '';
      element.style.transition = '';
    });
  }
};
