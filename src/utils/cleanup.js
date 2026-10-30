/**
 * Lifecycle and cleanup manager for BtnCraft instances
 */

export class CleanupManager {
  constructor(element) {
    this.element = element;
    this.disposers = [];
    this.originalStyles = new Map();
    this.originalClasses = new Set(element?.classList ? Array.from(element.classList) : []);
    this.injectedElements = new Set();
  }

  /**
   * Adds an event listener and registers its removal
   * @param {EventTarget} target
   * @param {string} type
   * @param {EventListenerOrEventListenerObject} listener
   * @param {boolean|AddEventListenerOptions} [options]
   */
  addEventListener(target, type, listener, options) {
    if (!target?.addEventListener) return;
    target.addEventListener(type, listener, options);
    this.disposers.push(() => {
      try {
        target.removeEventListener(type, listener, options);
      } catch {
        // Safe ignore
      }
    });
  }

  /**
   * Registers a DOM element to be removed on cleanup
   * @param {Element} el
   */
  trackElement(el) {
    if (el) {
      this.injectedElements.add(el);
      this.disposers.push(() => {
        try {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        } catch {
          // Safe ignore
        }
      });
    }
  }

  /**
   * Saves original property value before modifying it
   * @param {string} prop
   */
  saveStyle(prop) {
    if (!this.originalStyles.has(prop) && this.element?.style) {
      this.originalStyles.set(prop, this.element.style.getPropertyValue(prop));
    }
  }

  /**
   * Registers an arbitrary cleanup callback
   * @param {() => void} fn
   */
  add(fn) {
    if (typeof fn === 'function') {
      this.disposers.push(fn);
    }
  }

  /**
   * Runs all registered cleanups and restores original element state
   */
  run() {
    // Run disposers in reverse order
    while (this.disposers.length > 0) {
      const dispose = this.disposers.pop();
      try {
        dispose();
      } catch (err) {
        // Safe fallback
      }
    }

    // Restore tracked styles
    if (this.element?.style) {
      for (const [prop, val] of this.originalStyles.entries()) {
        if (val) {
          this.element.style.setProperty(prop, val);
        } else {
          this.element.style.removeProperty(prop);
        }
      }
      this.originalStyles.clear();
    }

    // Remove any remaining injected elements
    for (const el of this.injectedElements) {
      try {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      } catch {
        // Safe ignore
      }
    }
    this.injectedElements.clear();
  }
}
