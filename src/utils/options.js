/**
 * Options normalization, data-attribute parsing, and CSS variable mapping
 */

/**
 * Format a dimension or duration value with appropriate unit if number
 * @param {string|number|undefined} val
 * @param {string} unit
 * @returns {string|undefined}
 */
export function formatUnit(val, unit = 'px') {
  if (val === undefined || val === null || val === '') return undefined;
  if (typeof val === 'number') {
    return `${val}${unit}`;
  }
  const str = String(val).trim();
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    return `${str}${unit}`;
  }
  return str;
}

/**
 * Parses options from HTML data attributes
 * @param {HTMLElement} element
 * @returns {Record<string, any>}
 */
export function parseDataAttributes(element) {
  if (!element || !element.getAttribute) return {};

  const options = {};
  const dataBtncraft = element.getAttribute('data-btncraft');

  if (dataBtncraft && dataBtncraft !== 'true' && dataBtncraft !== '') {
    options.animation = dataBtncraft;
  }

  const attrMap = {
    'data-animation': 'animation',
    'data-variant': 'variant',
    'data-color': 'color',
    'data-bg': 'bg',
    'data-background-color': 'backgroundColor',
    'data-text-color': 'textColor',
    'data-border-color': 'borderColor',
    'data-radius': 'radius',
    'data-border-radius': 'radius',
    'data-duration': 'duration',
    'data-speed': 'duration',
    'data-size': 'size',
    'data-glow-intensity': 'glowIntensity',
    'data-intensity': 'glowIntensity',
    'data-shadow': 'shadow',
    'data-padding': 'padding',
    'data-padding-x': 'paddingX',
    'data-padding-y': 'paddingY',
    'data-font-size': 'fontSize'
  };

  for (const [attr, prop] of Object.entries(attrMap)) {
    if (element.hasAttribute(attr)) {
      options[prop] = element.getAttribute(attr);
    }
  }

  return options;
}

/**
 * Normalize and merge user options with data attributes
 * @param {HTMLElement} element
 * @param {Record<string, any>} [userOptions={}]
 * @returns {Record<string, any>}
 */
export function resolveOptions(element, userOptions = {}) {
  const fromAttributes = parseDataAttributes(element);
  const merged = {
    ...fromAttributes,
    ...userOptions
  };

  // Harmonize aliases
  const animation = (merged.animation || merged.type || '').toString().trim();
  const bg = merged.color || merged.bg || merged.backgroundColor;
  const textColor = merged.textColor || merged.colorText;
  const radius = merged.radius || merged.borderRadius;
  const duration = merged.duration || merged.speed;
  const glowIntensity = merged.glowIntensity || merged.intensity;
  const shadow = merged.shadow || merged.boxShadow;

  return {
    ...merged,
    animation,
    color: bg,
    bg,
    textColor,
    radius,
    duration,
    glowIntensity,
    shadow
  };
}

/**
 * Returns CSS custom properties derived from options
 * @param {Record<string, any>} options
 * @returns {Record<string, string>}
 */
export function getCssVariables(options = {}) {
  const vars = {};

  if (options.color) {
    vars['--bc-bg'] = options.color;
  }
  if (options.textColor) {
    vars['--bc-color'] = options.textColor;
  }
  if (options.borderColor) {
    vars['--bc-border'] = options.borderColor;
  }
  if (options.radius !== undefined && options.radius !== null && options.radius !== '') {
    if (options.radius === 'pill') {
      vars['--bc-radius'] = '9999px';
    } else if (options.radius === 'square') {
      vars['--bc-radius'] = '0px';
    } else {
      vars['--bc-radius'] = formatUnit(options.radius, 'px');
    }
  }
  if (options.duration !== undefined && options.duration !== null && options.duration !== '') {
    vars['--bc-duration'] = formatUnit(options.duration, 'ms');
  }
  if (options.glowIntensity !== undefined && options.glowIntensity !== null && options.glowIntensity !== '') {
    vars['--bc-glow-intensity'] = String(options.glowIntensity);
  }
  if (options.shadow) {
    vars['--bc-shadow'] = options.shadow;
  }
  if (options.padding) {
    vars['--bc-padding'] = options.padding;
  }
  if (options.paddingX) {
    vars['--bc-padding-x'] = formatUnit(options.paddingX, 'px');
  }
  if (options.paddingY) {
    vars['--bc-padding-y'] = formatUnit(options.paddingY, 'px');
  }
  if (options.fontSize) {
    vars['--bc-font-size'] = formatUnit(options.fontSize, 'px');
  }

  return vars;
}
