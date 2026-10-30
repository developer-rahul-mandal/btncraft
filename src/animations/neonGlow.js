/**
 * Animation: Neon Glow
 * Vibrant neon illumination with layered glowing box-shadows and pulse on hover
 */

export const neonGlow = {
  name: 'neon-glow',
  aliases: ['glow', 'neonGlow', 'neonglow'],
  className: 'bc-anim-neon-glow',
  setup(element, options, cleanup) {
    const neonColor = options.color || '#8b5cf6';
    cleanup.saveStyle('--bc-neon-color');
    element.style.setProperty('--bc-neon-color', neonColor);

    if (options.glowIntensity) {
      cleanup.saveStyle('--bc-glow-intensity');
      element.style.setProperty('--bc-glow-intensity', String(options.glowIntensity));
    }
  }
};
