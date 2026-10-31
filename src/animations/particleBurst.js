/**
 * Animation: Particle Burst
 * Emits vibrant particles radiating from pointer coordinates on click
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const particleBurst = {
  name: 'particle-burst',
  aliases: ['particles', 'particleBurst'],
  className: 'bc-anim-particle-burst',
  setup(element, options, cleanup) {
    const count = typeof options.particleCount === 'number' ? options.particleCount : 10;
    const colors = options.particleColors || ['#6366f1', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'];

    const onPointerDown = (e) => {
      if (prefersReducedMotion()) return;

      const rect = element.getBoundingClientRect();
      const originX = (e.clientX !== undefined) ? e.clientX - rect.left : rect.width / 2;
      const originY = (e.clientY !== undefined) ? e.clientY - rect.top : rect.height / 2;

      for (let i = 0; i < count; i++) {
        const particle = createElement('span', 'bc-burst-particle', { 'aria-hidden': 'true' });
        const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
        const dist = 24 + Math.random() * 32;
        const destX = Math.cos(angle) * dist;
        const destY = Math.sin(angle) * dist;
        const color = colors[i % colors.length];
        const size = 4 + Math.random() * 4;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${originX}px`;
        particle.style.top = `${originY}px`;
        particle.style.backgroundColor = color;
        particle.style.setProperty('--bc-dest-x', `${destX.toFixed(1)}px`);
        particle.style.setProperty('--bc-dest-y', `${destY.toFixed(1)}px`);

        element.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode === element) {
            element.removeChild(particle);
          }
        }, 650);
      }
    };

    cleanup.addEventListener(element, 'pointerdown', onPointerDown);
  }
};
