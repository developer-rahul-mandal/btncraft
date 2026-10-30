/**
 * DOM utility functions for BtnCraft
 */

/**
 * Safely query a single element
 * @param {string|Element} target
 * @param {Element|Document} [root=document]
 * @returns {Element|null}
 */
export function $(target, root = document) {
  if (!target) return null;
  if (target instanceof Element) return target;
  if (typeof target !== 'string') return null;
  try {
    return root.querySelector(target);
  } catch {
    return null;
  }
}

/**
 * Safely query multiple elements
 * @param {string|Element|NodeList|Array} target
 * @param {Element|Document} [root=document]
 * @returns {Element[]}
 */
export function $$(target, root = document) {
  if (!target) return [];
  if (target instanceof Element) return [target];
  if (Array.isArray(target)) {
    return target.filter((el) => el instanceof Element);
  }
  if (typeof NodeList !== 'undefined' && target instanceof NodeList) {
    return Array.from(target).filter((el) => el instanceof Element);
  }
  if (typeof HTMLCollection !== 'undefined' && target instanceof HTMLCollection) {
    return Array.from(target).filter((el) => el instanceof Element);
  }
  if (typeof target === 'string') {
    try {
      return Array.from(root.querySelectorAll(target));
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Normalizes input target into a flat array of valid Elements
 * @param {any} target
 * @param {Element|Document} [root=document]
 * @returns {Element[]}
 */
export function normalizeElements(target, root = document) {
  return $$(target, root);
}

/**
 * Helper to create an element with classes and attributes
 * @param {string} tag
 * @param {string} [className]
 * @param {Record<string, string>} [attributes]
 * @returns {HTMLElement}
 */
export function createElement(tag, className = '', attributes = {}) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  for (const [key, val] of Object.entries(attributes)) {
    if (val !== undefined && val !== null) {
      el.setAttribute(key, String(val));
    }
  }
  return el;
}

/**
 * Checks whether user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Sets CSS custom properties on an element
 * @param {HTMLElement} element
 * @param {Record<string, string|number>} props
 */
export function setCustomProperties(element, props) {
  if (!element || !element.style) return;
  for (const [name, value] of Object.entries(props)) {
    if (value !== undefined && value !== null && value !== '') {
      element.style.setProperty(name, String(value));
    }
  }
}

/**
 * Removes specified CSS custom properties from an element
 * @param {HTMLElement} element
 * @param {string[]} propNames
 */
export function removeCustomProperties(element, propNames) {
  if (!element || !element.style) return;
  for (const name of propNames) {
    element.style.removeProperty(name);
  }
}
