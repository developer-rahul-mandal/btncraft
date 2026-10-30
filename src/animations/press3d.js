/**
 * Animation: 3D Press
 * Mechanical tactile isometric depth that depresses realistically on click
 */

export const press3d = {
  name: '3d-press',
  aliases: ['3d', 'press-3d', 'press3d', '3dPress'],
  className: 'bc-anim-3d-press',
  setup(element, options, cleanup) {
    if (options.depthColor) {
      cleanup.saveStyle('--bc-3d-depth');
      element.style.setProperty('--bc-3d-depth', options.depthColor);
    }
  }
};
