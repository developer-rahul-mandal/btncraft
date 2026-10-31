/**
 * Animation: Magnetic Snap
 * Snappy physical spring pull with crisp snap-back on cursor approach
 */

import { prefersReducedMotion } from '../utils/dom.js';
import { PointerTracker } from '../core/interaction.js';

export const magneticSnap = {
  name: 'magnetic-snap',
  aliases: ['snap', 'magneticSnap'],
  className: 'bc-anim-magnetic-snap',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    const tracker = new PointerTracker(element, cleanup);
    cleanup.saveStyle('transform');
    cleanup.saveStyle('transition');

    const snapStrength = options.snapStrength !== undefined ? options.snapStrength : 0.42;

    tracker.onMove(({ centerX, centerY }) => {
      element.style.transition = 'transform 60ms cubic-bezier(0.2, 0.9, 0.3, 1)';
      element.style.transform = `translate3d(${(centerX * snapStrength).toFixed(1)}px, ${(centerY * snapStrength).toFixed(1)}px, 0)`;
    });

    tracker.onLeave(() => {
      element.style.transition = 'transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      element.style.transform = 'translate3d(0, 0, 0)';
    });

    cleanup.add(() => {
      element.style.transform = '';
      element.style.transition = '';
    });
  }
};
