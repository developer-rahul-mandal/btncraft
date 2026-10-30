/**
 * Animation: Glitch
 * Cyberpunk chromatic aberration with RGB splitting and jitter on hover
 */

export const glitch = {
  name: 'glitch',
  aliases: ['cyberGlitch', 'glitchEffect'],
  className: 'bc-anim-glitch',
  setup(element, options, cleanup) {
    const originalDataText = element.getAttribute('data-text');
    if (!originalDataText) {
      const text = element.textContent?.trim() || '';
      element.setAttribute('data-text', text);
      cleanup.add(() => {
        if (originalDataText === null) {
          element.removeAttribute('data-text');
        } else {
          element.setAttribute('data-text', originalDataText);
        }
      });
    }
  }
};
