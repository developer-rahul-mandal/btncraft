/**
 * Animation: Bounce
 * Playful elastic squash-and-stretch bounce on hover and active click
 */

export const bounce = {
  name: 'bounce',
  aliases: ['bouncy', 'elasticBounce'],
  className: 'bc-anim-bounce',
  setup(element, options, cleanup) {
    if (options.bounceScale) {
      cleanup.saveStyle('--bc-bounce-scale');
      element.style.setProperty('--bc-bounce-scale', String(options.bounceScale));
    }
  }
};
