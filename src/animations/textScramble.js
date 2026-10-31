/**
 * Animation: Text Scramble
 * Cyberpunk alphanumeric decoding effect that animates text into place on hover
 */

import { prefersReducedMotion } from '../utils/dom.js';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________ABCDEF0123456789';

export const textScramble = {
  name: 'text-scramble',
  aliases: ['scramble', 'textScramble'],
  className: 'bc-anim-text-scramble',
  setup(element, options, cleanup) {
    if (prefersReducedMotion()) return;

    const originalText = element.textContent.trim();
    let frame = 0;
    let queue = [];
    let rafId = null;

    const update = () => {
      let output = '';
      let complete = 0;

      for (let i = 0, n = queue.length; i < n; i++) {
        let { from, to, start, end, char } = queue[i];
        if (frame >= end) {
          complete++;
          output += to;
        } else if (frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            queue[i].char = char;
          }
          output += `<span class="bc-scramble-dud">${char}</span>`;
        } else {
          output += from;
        }
      }

      element.innerHTML = output;

      if (complete < queue.length) {
        frame++;
        rafId = requestAnimationFrame(update);
      }
    };

    const trigger = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      queue = [];
      const len = originalText.length;
      for (let i = 0; i < len; i++) {
        const from = originalText[i] || '';
        const to = originalText[i] || '';
        const start = Math.floor(Math.random() * 12);
        const end = start + Math.floor(Math.random() * 12);
        queue.push({ from, to, start, end, char: '' });
      }
      frame = 0;
      update();
    };

    cleanup.addEventListener(element, 'mouseenter', trigger);
    cleanup.add(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      element.textContent = originalText;
    });
  }
};
