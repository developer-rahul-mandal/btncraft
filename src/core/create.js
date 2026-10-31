/**
 * Core element instantiation and instance lifecycle for BtnCraft
 */

import { normalizeElements } from '../utils/dom.js';
import { resolveOptions, getCssVariables } from '../utils/options.js';
import { CleanupManager } from '../utils/cleanup.js';
import { registry } from './registry.js';
import { ButtonStateEngine } from './state.js';
import { icons } from './icons.js';
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

  loading(isLoading, options) {
    for (const inst of this) {
      if (inst && typeof inst.loading === 'function') {
        inst.loading(isLoading, options);
      }
    }
    return this;
  }

  success(options) {
    for (const inst of this) {
      if (inst && typeof inst.success === 'function') {
        inst.success(options);
      }
    }
    return this;
  }

  error(options) {
    for (const inst of this) {
      if (inst && typeof inst.error === 'function') {
        inst.error(options);
      }
    }
    return this;
  }

  reset() {
    for (const inst of this) {
      if (inst && typeof inst.reset === 'function') {
        inst.reset();
      }
    }
    return this;
  }

  disabled(isDisabled) {
    for (const inst of this) {
      if (inst && typeof inst.disabled === 'function') {
        inst.disabled(isDisabled);
      }
    }
    return this;
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

    // Advanced State Engine
    this.stateEngine = new ButtonStateEngine(element, this.cleanup);

    registerInstance(element, this);

    this.init(userOptions);
  }

  get state() {
    return this.stateEngine.state;
  }

  get isLoading() {
    return this.stateEngine.isLoading;
  }

  get isSuccess() {
    return this.stateEngine.isSuccess;
  }

  get isError() {
    return this.stateEngine.isError;
  }

  get isDisabled() {
    return this.stateEngine.isDisabled;
  }

  loading(isLoading = true, options = {}) {
    this.stateEngine.loading(isLoading, options);
    return this;
  }

  success(options = {}) {
    this.stateEngine.success(options);
    return this;
  }

  error(options = {}) {
    this.stateEngine.error(options);
    return this;
  }

  reset() {
    this.stateEngine.reset();
    return this;
  }

  disabled(isDisabled = true) {
    this.stateEngine.disabled(isDisabled);
    return this;
  }

  hover(isHovered = true) {
    this.stateEngine.hover(isHovered);
    return this;
  }

  active(isActive = true) {
    this.stateEngine.active(isActive);
    return this;
  }

  focus(isFocused = true) {
    this.stateEngine.focus(isFocused);
    return this;
  }

  execute(asyncFn, options = {}) {
    return this.stateEngine.execute(asyncFn, options);
  }

  on(event, callback) {
    return this.stateEngine.on(event, callback);
  }

  rotateIcon(options = {}) {
    const disposer = icons.rotateIcon(this.element, options);
    this.cleanup.add(disposer);
    return this;
  }

  slideIcon(options = {}) {
    const disposer = icons.slideIcon(this.element, options);
    this.cleanup.add(disposer);
    return this;
  }

  revealArrow(options = {}) {
    const disposer = icons.revealArrow(this.element, options);
    this.cleanup.add(disposer);
    return this;
  }

  replaceIcon(newIcon, options = {}) {
    icons.replaceIcon(this.element, newIcon, options);
    return this;
  }

  setText(newText, options = {}) {
    icons.setText(this.element, newText, options);
    return this;
  }

  iconToSpinner(showSpinner = true) {
    const restore = icons.iconToSpinner(this.element, showSpinner);
    if (showSpinner) {
      this.cleanup.add(restore);
    }
    return this;
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
          if (typeof animDef.beforeSetup === 'function') {
            animDef.beforeSetup(this.element, this.options);
          }
          const disposer = animDef.setup(this.element, this.options, this.cleanup);
          if (typeof disposer === 'function') {
            this.cleanup.add(disposer);
          }
          if (typeof animDef.afterTeardown === 'function') {
            this.cleanup.add(() => {
              try { animDef.afterTeardown(this.element, this.options); } catch {}
            });
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
