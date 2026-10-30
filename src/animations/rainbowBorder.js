/**
 * Animation: Rainbow Border
 * Vibrant animated rainbow spectrum border rotating around the perimeter
 */

export const rainbowBorder = {
  name: 'rainbow-border',
  aliases: ['rainbow', 'rainbowBorder', 'rainbowborder'],
  className: 'bc-anim-rainbow-border',
  setup(element, options, cleanup) {
    if (options.borderWidth) {
      cleanup.saveStyle('--bc-rainbow-width');
      element.style.setProperty('--bc-rainbow-width', String(options.borderWidth));
    }
  }
};
