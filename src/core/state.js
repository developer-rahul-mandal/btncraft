/**
 * BtnCraft V2 — Advanced Button State Engine
 * Robust state management: default, hover, active, focus, disabled, loading, success, error.
 * Preserves original DOM nodes, handles async operations, and prevents duplicate submissions.
 */

import { createElement } from '../utils/dom.js';

// SVG Assets for State Transitions (Zero-dependency inline SVG)
export const STATE_SVGS = {
  spinner: `<svg viewBox="0 0 24 24" class="bc-state-spinner" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity="0.25" stroke="currentColor"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"/></svg>`,
  checkmark: `<svg viewBox="0 0 24 24" class="bc-state-glyph bc-glyph-check" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg viewBox="0 0 24 24" class="bc-state-glyph bc-glyph-error" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
};

export class ButtonStateEngine {
  constructor(element, cleanupManager) {
    if (!(element instanceof Element)) {
      throw new TypeError('[BtnCraft] Expected an HTMLElement for state management');
    }

    this.element = element;
    this.cleanup = cleanupManager;

    // Snapshot original element state
    this.originalState = {
      disabled: element.disabled ?? false,
      ariaBusy: element.getAttribute('aria-busy'),
      ariaLabel: element.getAttribute('aria-label'),
      ariaDisabled: element.getAttribute('aria-disabled'),
      innerHTML: element.innerHTML
    };

    this.currentState = element.disabled ? 'disabled' : 'default';
    this.activeTimer = null;
    this.injectedStateNodes = new Set();
    this.listeners = new Map(); // Event listeners for state changes

    if (this.cleanup) {
      this.cleanup.add(() => this.destroy());
    }
  }

  get state() {
    return this.currentState;
  }

  get isLoading() {
    return this.currentState === 'loading';
  }

  get isSuccess() {
    return this.currentState === 'success';
  }

  get isError() {
    return this.currentState === 'error';
  }

  get isDisabled() {
    return this.currentState === 'disabled' || this.element.disabled;
  }

  /**
   * Register a state change listener
   * @param {'change'|'loading'|'success'|'error'|'reset'} event
   * @param {(state: string, details?: any) => void} callback
   */
  on(event, callback) {
    if (typeof callback !== 'function') return () => {};
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  emit(event, details) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const fn of handlers) {
        try {
          fn(this.currentState, details);
        } catch (e) {
          console.error('[BtnCraft] State event handler error:', e);
        }
      }
    }
    if (event !== 'change') {
      const allHandlers = this.listeners.get('change');
      if (allHandlers) {
        for (const fn of allHandlers) {
          try {
            fn(this.currentState, details);
          } catch (e) {
            console.error('[BtnCraft] State change handler error:', e);
          }
        }
      }
    }
  }

  clearTimer() {
    if (this.activeTimer !== null) {
      clearTimeout(this.activeTimer);
      this.activeTimer = null;
    }
  }

  clearInjectedNodes() {
    for (const node of this.injectedStateNodes) {
      try {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      } catch {
        // Safe ignore
      }
    }
    this.injectedStateNodes.clear();
  }

  removeStateClasses() {
    this.element.classList.remove(
      'bc-state-loading',
      'bc-state-success',
      'bc-state-error',
      'bc-state-disabled',
      'bc-state-hover',
      'bc-state-active',
      'bc-state-focus',
      'bc-shake'
    );
  }

  /**
   * Sets loading state on button
   * @param {boolean} [isLoading=true]
   * @param {{ text?: string, ariaLabel?: string }} [options={}]
   * @returns {this}
   */
  loading(isLoading = true, options = {}) {
    if (typeof isLoading !== 'boolean') {
      options = isLoading || {};
      isLoading = true;
    }

    if (!isLoading) {
      if (this.currentState === 'loading') {
        this.reset();
      }
      return this;
    }

    // Duplicate submission guard
    if (this.currentState === 'loading') {
      return this;
    }

    this.clearTimer();
    this.removeStateClasses();
    this.clearInjectedNodes();

    this.currentState = 'loading';
    this.element.classList.add('bc-state-loading');
    this.element.disabled = true;
    this.element.setAttribute('aria-busy', 'true');

    const labelText = options.text || options.loadingText;
    if (labelText !== undefined) {
      this.element.textContent = labelText;
    }

    const ariaText = options.ariaLabel || labelText;
    if (ariaText !== undefined) {
      this.element.setAttribute('aria-label', ariaText);
    }

    // Prepend accessible spinner
    const spinner = createElement('span', 'bc-spinner', { 'aria-hidden': 'true' });
    this.element.prepend(spinner);
    this.injectedStateNodes.add(spinner);

    this.emit('loading', options);
    return this;
  }

  /**
   * Sets success state on button
   * @param {{ text?: string, icon?: string|Element, duration?: number, onReset?: () => void }} [options={}]
   * @returns {this}
   */
  success(options = {}) {
    if (typeof options === 'string') {
      options = { text: options };
    }

    this.clearTimer();
    this.removeStateClasses();
    this.clearInjectedNodes();

    this.currentState = 'success';
    this.element.classList.add('bc-state-success');
    this.element.removeAttribute('aria-busy');
    this.element.disabled = this.originalState.disabled;

    // Content container or text
    const text = options.text || options.message;
    if (text !== undefined) {
      this.element.textContent = text;
    }

    // Injected checkmark icon
    const iconContainer = createElement('span', 'bc-state-icon bc-state-check', { 'aria-hidden': 'true' });
    if (options.icon instanceof Element) {
      iconContainer.appendChild(options.icon.cloneNode(true));
    } else if (typeof options.icon === 'string') {
      iconContainer.innerHTML = options.icon;
    } else {
      iconContainer.innerHTML = STATE_SVGS.checkmark;
    }

    this.element.prepend(iconContainer);
    this.injectedStateNodes.add(iconContainer);

    this.emit('success', options);

    const duration = options.duration !== undefined ? options.duration : 2200;
    if (duration > 0) {
      this.activeTimer = setTimeout(() => {
        this.reset();
        if (typeof options.onReset === 'function') {
          options.onReset();
        }
      }, duration);
    }

    return this;
  }

  /**
   * Sets error state on button
   * @param {{ text?: string, icon?: string|Element, duration?: number, shake?: boolean, onReset?: () => void }} [options={}]
   * @returns {this}
   */
  error(options = {}) {
    if (typeof options === 'string') {
      options = { text: options };
    }

    this.clearTimer();
    this.removeStateClasses();
    this.clearInjectedNodes();

    this.currentState = 'error';
    this.element.classList.add('bc-state-error');
    this.element.removeAttribute('aria-busy');
    this.element.disabled = this.originalState.disabled;

    if (options.shake !== false) {
      this.element.classList.add('bc-shake');
    }

    const text = options.text || options.message;
    if (text !== undefined) {
      this.element.textContent = text;
    }

    const iconContainer = createElement('span', 'bc-state-icon bc-state-err', { 'aria-hidden': 'true' });
    if (options.icon instanceof Element) {
      iconContainer.appendChild(options.icon.cloneNode(true));
    } else if (typeof options.icon === 'string') {
      iconContainer.innerHTML = options.icon;
    } else {
      iconContainer.innerHTML = STATE_SVGS.error;
    }

    this.element.prepend(iconContainer);
    this.injectedStateNodes.add(iconContainer);

    this.emit('error', options);

    const duration = options.duration !== undefined ? options.duration : 2500;
    if (duration > 0) {
      this.activeTimer = setTimeout(() => {
        this.reset();
        if (typeof options.onReset === 'function') {
          options.onReset();
        }
      }, duration);
    }

    return this;
  }

  /**
   * Programmatic hover, focus, active, or disabled states
   */
  hover(isHovered = true) {
    if (isHovered) {
      this.element.classList.add('bc-state-hover');
    } else {
      this.element.classList.remove('bc-state-hover');
    }
    return this;
  }

  active(isActive = true) {
    if (isActive) {
      this.element.classList.add('bc-state-active');
    } else {
      this.element.classList.remove('bc-state-active');
    }
    return this;
  }

  focus(isFocused = true) {
    if (isFocused) {
      this.element.classList.add('bc-state-focus');
      try { this.element.focus(); } catch {}
    } else {
      this.element.classList.remove('bc-state-focus');
      try { this.element.blur(); } catch {}
    }
    return this;
  }

  disabled(isDisabled = true) {
    this.element.disabled = isDisabled;
    if (isDisabled) {
      this.currentState = 'disabled';
      this.element.classList.add('bc-state-disabled');
      this.element.setAttribute('aria-disabled', 'true');
    } else {
      if (this.currentState === 'disabled') {
        this.currentState = 'default';
      }
      this.element.classList.remove('bc-state-disabled');
      this.element.removeAttribute('aria-disabled');
    }
    return this;
  }

  /**
   * Resets button back to original pristine state
   * @returns {this}
   */
  reset() {
    this.clearTimer();
    this.removeStateClasses();
    this.clearInjectedNodes();

    // Restore original DOM content
    this.element.innerHTML = this.originalState.innerHTML;

    // Restore original attributes
    this.element.disabled = this.originalState.disabled;

    if (this.originalState.ariaBusy === null) {
      this.element.removeAttribute('aria-busy');
    } else {
      this.element.setAttribute('aria-busy', this.originalState.ariaBusy);
    }

    if (this.originalState.ariaLabel === null) {
      this.element.removeAttribute('aria-label');
    } else {
      this.element.setAttribute('aria-label', this.originalState.ariaLabel);
    }

    if (this.originalState.ariaDisabled === null) {
      this.element.removeAttribute('aria-disabled');
    } else {
      this.element.setAttribute('aria-disabled', this.originalState.ariaDisabled);
    }

    this.currentState = this.originalState.disabled ? 'disabled' : 'default';
    this.emit('reset');
    return this;
  }

  /**
   * Wraps an async operation with loading -> success/error lifecycle
   * @param {() => Promise<any>} asyncOperation
   * @param {{ loadingText?: string, successText?: string, errorText?: string, duration?: number }} [options={}]
   * @returns {Promise<any>}
   */
  async execute(asyncOperation, options = {}) {
    if (typeof asyncOperation !== 'function') {
      throw new TypeError('[BtnCraft] execute() requires an async function');
    }

    if (this.currentState === 'loading') {
      return; // Prevent duplicate execution while in-flight
    }

    this.loading(true, { text: options.loadingText });

    try {
      const result = await asyncOperation();
      this.success({
        text: options.successText,
        duration: options.duration !== undefined ? options.duration : 2000
      });
      return result;
    } catch (err) {
      this.error({
        text: options.errorText || (err && err.message ? err.message : 'Action failed'),
        duration: options.duration !== undefined ? options.duration : 2500
      });
      throw err;
    }
  }

  destroy() {
    this.clearTimer();
    this.listeners.clear();
    this.clearInjectedNodes();
  }
}
