/**
 * Animation: Expand Hover
 * Elastic scale expansion, widened letter-spacing, and elevated depth on hover
 */

export const expandHover = {
  name: 'expand-hover',
  aliases: ['expand', 'expandHover', 'expandhover'],
  className: 'bc-anim-expand-hover',
  setup(element, options, cleanup) {
    if (options.expandScale) {
      cleanup.saveStyle('--bc-expand-scale');
      element.style.setProperty('--bc-expand-scale', String(options.expandScale));
    }
  }
};
