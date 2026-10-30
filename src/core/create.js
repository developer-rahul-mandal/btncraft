/**
 * Core element instantiation and instance lifecycle for BtnCraft
 */

import { normalizeElements } from '../utils/dom.js';
import { resolveOptions, getCssVariables } from '../utils/options.js';
import { CleanupManager } from '../utils/cleanup.js';
import { registry } from './registry.js';
import {
  registerInstance,
  unregisterInstance,
  instanceMap,
  destroy
} from './destroy.js';

export class BtnCraftCollection extends Array {
  destroy() {
    for (const inst of this) {
      if (inst && typeof inst.destroy === 'function') {
        inst.destroy();
      }
    }
  }

  update(newOptions) {
    for (const inst of this) {
      if (inst && typeof inst.update === 'function') {
        inst.update(newOptions);
      }
    }
  }

  get element() {
    return this[0]?.element || null;
  }
}

export class BtnCraftInstance {
  constructor(element, userOptions = {}) {
    if (!(element instanceof Element)) {
      throw new TypeError('[BtnCraft] Expected an HTML element');
    }

    // If already initialized on this element, destroy previous instance first
    const existing = instanceMap.get(element);
    if (existing) {
      existing.destroy();
    }

    this.element = element;
    this.isBtnCraftInstance = true;
    this.isDestroyed = false;
    this.cleanup = new CleanupManager(element);

    // Track original state
    this.hadBaseClass = element.classList.contains('bc-btn');
    this.originalVariant = element.getAttribute('data-variant');
    this.originalSize = element.getAttribute('data-size');
    this.originalRadiusAttr = element.getAttribute('data-radius');

    registerInstance(element, this);

    this.init(userOptions);
  }

  init(userOptions = {}) {
    this.options = resolveOptions(this.element, userOptions);

    // Ensure base class is present
    if (!this.hadBaseClass) {
      this.element.classList.add('bc-btn');
    }

    // Apply CSS variables
    const cssVars = getCssVariables(this.options);
    for (const [key, val] of Object.entries(cssVars)) {
      this.cleanup.saveStyle(key);
      this.element.style.setProperty(key, val);
    }

    // Apply variant and size attributes if specified
    if (this.options.variant) {
      this.element.setAttribute('data-variant', this.options.variant);
      this.cleanup.add(() => {
        if (this.originalVariant === null) {
          this.element.removeAttribute('data-variant');
        } else {
          this.element.setAttribute('data-variant', this.originalVariant);
        }
      });
    }

    if (this.options.size) {
      this.element.setAttribute('data-size', this.options.size);
      this.cleanup.add(() => {
        if (this.originalSize === null) {
          this.element.removeAttribute('data-size');
        } else {
          this.element.setAttribute('data-size', this.originalSize);
        }
      });
    }

    if (this.options.radius === 'pill' || this.options.radius === 'square') {
      this.element.setAttribute('data-radius', this.options.radius);
      this.cleanup.add(() => {
        if (this.originalRadiusAttr === null) {
          this.element.removeAttribute('data-radius');
        } else {
          this.element.setAttribute('data-radius', this.originalRadiusAttr);
        }
      });
    }

    // Setup animation
    const animName = this.options.animation;
    if (animName && animName !== 'none') {
      const animDef = registry.get(animName);
      if (animDef) {
        this.element.classList.add(animDef.className);
        this.cleanup.add(() => {
          this.element.classList.remove(animDef.className);
        });

        try {
          const disposer = animDef.setup(this.element, this.options, this.cleanup);
          if (typeof disposer === 'function') {
            this.cleanup.add(disposer);
          }
        } catch (err) {
          console.error(`[BtnCraft] Error setting up animation "${animName}":`, err);
        }
      } else {
        console.warn(`[BtnCraft] Unknown animation: "${animName}". Available: ${registry.getNames().join(', ')}`);
      }
    }
  }

  update(newOptions = {}) {
    if (this.isDestroyed) return;

    // Run cleanup of current styling & animation effects
    this.cleanup.run();
    this.cleanup = new CleanupManager(this.element);

    // Merge options and re-initialize
    const merged = {
      ...this.options,
      ...newOptions
    };
    this.init(merged);
  }

  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;

    this.cleanup.run();

    if (!this.hadBaseClass) {
      this.element.classList.remove('bc-btn');
    }

    unregisterInstance(this.element, this);
  }
}

/**
 * Creates BtnCraft instance(s) on target element(s)
 * @param {string|Element|Array|NodeList} target
 * @param {Record<string, any>} [options={}]
 * @returns {BtnCraftInstance|BtnCraftCollection|null}
 */
export function create(target, options = {}) {
  const elements = normalizeElements(target);

  if (elements.length === 0) {
    return null;
  }

  // Single element target directly or single ID selector
  const isExplicitSingle =
    target instanceof Element ||
    (typeof target === 'string' && target.startsWith('#') && !target.includes(' ') && !target.includes(','));

  if (isExplicitSingle && elements.length === 1) {
    return new BtnCraftInstance(elements[0], options);
  }

  const collection = new BtnCraftCollection();
  for (const el of elements) {
    collection.push(new BtnCraftInstance(el, options));
  }

  return collection;
}
