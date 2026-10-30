/**
 * Animation: Gradient Border
 * Animated dual-layer border where only the perimeter shifts colors while inner body remains solid
 */

export const gradientBorder = {
  name: 'gradient-border',
  aliases: ['gradientBorder', 'gradientborder'],
  className: 'bc-anim-gradient-border',
  setup(element, options, cleanup) {
    if (options.borderGradient) {
      cleanup.saveStyle('--bc-border-gradient');
      element.style.setProperty('--bc-border-gradient', options.borderGradient);
    }
    if (options.borderWidth) {
      cleanup.saveStyle('--bc-gradient-border-w');
      element.style.setProperty('--bc-gradient-border-w', String(options.borderWidth));
    }
  }
};
