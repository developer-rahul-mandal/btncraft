/**
 * Animation: Floating Effect
 * Continuous smooth levitation and dynamic oscillating shadow
 */

export const floatingEffect = {
  name: 'floating-effect',
  aliases: ['float', 'floating', 'floatingEffect', 'floatingeffect'],
  className: 'bc-anim-floating-effect',
  setup(element, options, cleanup) {
    if (options.floatDistance) {
      cleanup.saveStyle('--bc-float-dist');
      element.style.setProperty('--bc-float-dist', String(options.floatDistance));
    }
  }
};
