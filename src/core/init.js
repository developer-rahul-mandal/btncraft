/**
 * Declarative initialization and backwards-compatible helpers
 */

import { BtnCraftInstance, BtnCraftCollection } from './create.js';
import { normalizeElements } from '../utils/dom.js';

const BUTTON_SELECTOR = '[data-btncraft]';
const loadingStates = new WeakMap();

/**
 * Initializes all elements with [data-btncraft] in root
 * @param {Element|Document} [root=document]
 * @param {Record<string, any>} [defaultOptions={}]
 * @returns {{ instances: BtnCraftCollection, destroy: () => void }}
 */
export function init(root = document, defaultOptions = {}) {
  const elements = [];

  if (root.matches?.(BUTTON_SELECTOR)) {
    elements.push(root);
  }

  if (root.querySelectorAll) {
    elements.push(...root.querySelectorAll(BUTTON_SELECTOR));
  }

  const instances = new BtnCraftCollection();

  for (const button of elements) {
    instances.push(new BtnCraftInstance(button, defaultOptions));
  }

  let isDestroyed = false;

  return {
    instances,
    destroy() {
      if (isDestroyed) return;
      isDestroyed = true;
      instances.destroy();
    }
  };
}

/**
 * Backwards-compatible initBtnCraft for legacy consumers and tests
 * @param {Element|Document} [root=document]
 * @returns {{ destroy: () => void }}
 */
export function initBtnCraft(root = document) {
  const elements = [];

  if (root.matches?.(BUTTON_SELECTOR)) {
    elements.push(root);
  }

  if (root.querySelectorAll) {
    elements.push(...root.querySelectorAll(BUTTON_SELECTOR));
  }

  const addedClasses = [];

  for (const button of elements) {
    if (!button.classList.contains('bc-btn')) {
      button.classList.add('bc-btn');
      addedClasses.push(button);
    }
  }

  let destroyed = false;

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;

      for (const button of addedClasses) {
        button.classList.remove('bc-btn');
      }
    }
  };
}

/**
 * Loading state manager for buttons (accessible spinner and state handling)
 * @param {Element} button
 * @param {boolean} isLoading
 * @param {string} [text]
 */
export function setLoading(button, isLoading, text) {
  if (!(button instanceof Element)) {
    throw new TypeError('Expected a DOM element');
  }

  if (!button.matches("button, input[type='button'], input[type='submit']")) {
    throw new TypeError('Expected a button element');
  }

  if (isLoading) {
    if (!loadingStates.has(button)) {
      loadingStates.set(button, {
        disabled: button.disabled,
        ariaBusy: button.getAttribute('aria-busy'),
        ariaLabel: button.getAttribute('aria-label'),
        spinner: null
      });
    }

    const state = loadingStates.get(button);

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');

    if (text !== undefined) {
      button.setAttribute('aria-label', text);
    }

    if (!state.spinner) {
      const spinner = document.createElement('span');
      spinner.className = 'bc-spinner';
      spinner.setAttribute('aria-hidden', 'true');

      button.prepend(spinner);
      state.spinner = spinner;
    }

    return;
  }

  const state = loadingStates.get(button);
  if (!state) return;

  state.spinner?.remove();
  button.disabled = state.disabled;

  restoreAttribute(button, 'aria-busy', state.ariaBusy);
  restoreAttribute(button, 'aria-label', state.ariaLabel);

  loadingStates.delete(button);
}

function restoreAttribute(element, name, value) {
  if (value === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}
