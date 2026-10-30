/**
 * Destruction and unregistration logic for BtnCraft
 */

import { normalizeElements } from '../utils/dom.js';

// Global registry of active instances
export const instanceMap = new WeakMap();
export const activeInstances = new Set();

/**
 * Register an active instance
 * @param {HTMLElement} element
 * @param {any} instance
 */
export function registerInstance(element, instance) {
  instanceMap.set(element, instance);
  activeInstances.add(instance);
}

/**
 * Unregister an active instance
 * @param {HTMLElement} element
 * @param {any} instance
 */
export function unregisterInstance(element, instance) {
  if (element) {
    instanceMap.delete(element);
  }
  if (instance) {
    activeInstances.delete(instance);
  }
}

/**
 * Get instance associated with an element
 * @param {HTMLElement|string} target
 * @returns {any|null}
 */
export function getInstance(target) {
  if (!target) return null;
  if (typeof target === 'string') {
    const el = document.querySelector(target);
    return el ? instanceMap.get(el) || null : null;
  }
  if (target instanceof Element) {
    return instanceMap.get(target) || null;
  }
  if (target && target.isBtnCraftInstance) {
    return target;
  }
  return null;
}

/**
 * Destroys one or more BtnCraft instances
 * @param {string|Element|Array|NodeList|any} [target]
 */
export function destroy(target) {
  // If no target provided, destroy all active instances
  if (target === undefined || target === null) {
    const all = Array.from(activeInstances);
    for (const inst of all) {
      try {
        inst.destroy();
      } catch {
        // Safe ignore
      }
    }
    return;
  }

  // If instance itself
  if (target && typeof target.destroy === 'function' && target.isBtnCraftInstance) {
    target.destroy();
    return;
  }

  // If collection
  if (Array.isArray(target) || (typeof NodeList !== 'undefined' && target instanceof NodeList)) {
    for (const item of Array.from(target)) {
      destroy(item);
    }
    return;
  }

  // If element or selector
  const elements = normalizeElements(target);
  for (const el of elements) {
    const inst = instanceMap.get(el);
    if (inst) {
      inst.destroy();
    }
  }
}
