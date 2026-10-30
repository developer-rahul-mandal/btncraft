/**
 * Animation: Gradient Shift
 * Multi-stop gradient background animation that shifts smoothly on hover or continuously
 */

export const gradientShift = {
  name: 'gradient-shift',
  aliases: ['gradient', 'gradientShift', 'gradientshift'],
  className: 'bc-anim-gradient-shift',
  setup(element, options, cleanup) {
    // If custom colors provided, create a gradient
    if (options.gradient) {
      cleanup.saveStyle('--bc-gradient-bg');
      element.style.setProperty('--bc-gradient-bg', options.gradient);
    } else if (options.color) {
      // Create complementary gradient from base color
      cleanup.saveStyle('--bc-gradient-bg');
      element.style.setProperty(
        '--bc-gradient-bg',
        `linear-gradient(135deg, ${options.color}, #a855f7, #ec4899, ${options.color})`
      );
    }
  }
};
