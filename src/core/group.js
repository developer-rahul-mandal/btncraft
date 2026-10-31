/**
 * BtnCraft V2 — Button Groups & Toggle Controls
 * Accessible single-selection, multi-selection, and segmented button groups.
 * Full WCAG keyboard navigation (ArrowLeft, ArrowRight, Home, End) and roving tabindex.
 */

import { normalizeElements } from '../utils/dom.js';
import { create } from './create.js';

export class BtnCraftGroup {
  constructor(containerOrElements, options = {}) {
    this.options = options;
    this.type = options.type || 'single'; // 'single' | 'multiple' | 'segmented'
    this.onChange = options.onChange;
    this.buttons = [];
    this.disposers = [];
    this.listeners = new Map();

    this.init(containerOrElements);
  }

  init(containerOrElements) {
    let rawElements = [];
    let container = null;

    if (typeof containerOrElements === 'string') {
      const el = document.querySelector(containerOrElements);
      if (el) {
        if (el.matches('button, input[type="button"]')) {
          rawElements = [el];
        } else {
          container = el;
          rawElements = Array.from(el.querySelectorAll('button, [data-btncraft], .bc-btn'));
        }
      }
    } else if (containerOrElements instanceof Element) {
      if (containerOrElements.matches('button, input[type="button"]')) {
        rawElements = [containerOrElements];
      } else {
        container = containerOrElements;
        rawElements = Array.from(containerOrElements.querySelectorAll('button, [data-btncraft], .bc-btn'));
      }
    } else if (Array.isArray(containerOrElements) || (typeof NodeList !== 'undefined' && containerOrElements instanceof NodeList)) {
      rawElements = Array.from(containerOrElements).filter((el) => el instanceof Element);
    }

    this.container = container;
    this.buttons = rawElements;

    if (this.container) {
      this.container.classList.add('bc-btn-group');
      if (this.type === 'segmented') {
        this.container.classList.add('bc-group-segmented');
        this.container.setAttribute('role', 'radiogroup');
      } else if (this.type === 'single') {
        this.container.setAttribute('role', 'radiogroup');
      } else {
        this.container.setAttribute('role', 'group');
      }
    }

    // Setup initial values
    const defaultVal = this.options.defaultValue ?? this.options.value;
    const initialSelected = new Set(
      Array.isArray(defaultVal) ? defaultVal.map(String) : defaultVal !== undefined && defaultVal !== null ? [String(defaultVal)] : []
    );

    this.buttons.forEach((btn, index) => {
      // Enhanced instance
      if (this.options.itemAnimation) {
        create(btn, { animation: this.options.itemAnimation });
      }

      btn.classList.add('bc-group-item');

      const val = btn.getAttribute('data-value') || btn.getAttribute('value') || btn.textContent.trim();
      btn.dataset.bcGroupVal = val;

      const isSelected = initialSelected.has(val) || (initialSelected.size === 0 && index === 0 && this.type === 'segmented');

      if (this.type === 'single' || this.type === 'segmented') {
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        btn.setAttribute('tabindex', isSelected ? '0' : '-1');
        if (isSelected) btn.classList.add('bc-selected');
      } else {
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        btn.setAttribute('tabindex', '0');
        if (isSelected) btn.classList.add('bc-selected');
      }

      const onClick = () => this.handleItemClick(btn);
      const onKeyDown = (e) => this.handleKeyDown(e, index);

      btn.addEventListener('click', onClick);
      btn.addEventListener('keydown', onKeyDown);

      this.disposers.push(() => {
        btn.removeEventListener('click', onClick);
        btn.removeEventListener('keydown', onKeyDown);
        btn.classList.remove('bc-group-item', 'bc-selected');
        btn.removeAttribute('role');
        btn.removeAttribute('aria-checked');
        btn.removeAttribute('aria-pressed');
        btn.removeAttribute('tabindex');
        delete btn.dataset.bcGroupVal;
      });
    });
  }

  handleItemClick(targetBtn) {
    const val = targetBtn.dataset.bcGroupVal;

    if (this.type === 'single' || this.type === 'segmented') {
      this.buttons.forEach((btn) => {
        const isTarget = btn === targetBtn;
        btn.classList.toggle('bc-selected', isTarget);
        btn.setAttribute('aria-checked', isTarget ? 'true' : 'false');
        btn.setAttribute('tabindex', isTarget ? '0' : '-1');
      });
      this.emitChange(val, targetBtn);
    } else {
      // multiple toggle
      const nowSelected = !targetBtn.classList.contains('bc-selected');
      targetBtn.classList.toggle('bc-selected', nowSelected);
      targetBtn.setAttribute('aria-pressed', nowSelected ? 'true' : 'false');
      this.emitChange(this.getValue(), targetBtn);
    }
  }

  handleKeyDown(e, currentIndex) {
    if (this.type !== 'single' && this.type !== 'segmented') return;

    let targetIndex = null;
    const count = this.buttons.length;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % count;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentIndex - 1 + count) % count;
        break;
      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        targetIndex = count - 1;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        this.handleItemClick(this.buttons[currentIndex]);
        return;
    }

    if (targetIndex !== null) {
      const nextBtn = this.buttons[targetIndex];
      nextBtn.focus();
      this.handleItemClick(nextBtn);
    }
  }

  emitChange(value, buttonEl) {
    if (typeof this.onChange === 'function') {
      try {
        this.onChange(value, buttonEl, this);
      } catch (err) {
        console.error('[BtnCraft] Group onChange error:', err);
      }
    }

    const handlers = this.listeners.get('change');
    if (handlers) {
      for (const fn of handlers) {
        try { fn(value, buttonEl); } catch (e) { console.error(e); }
      }
    }
  }

  on(event, callback) {
    if (typeof callback !== 'function') return () => {};
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  getValue() {
    if (this.type === 'multiple') {
      return this.buttons
        .filter((b) => b.classList.contains('bc-selected'))
        .map((b) => b.dataset.bcGroupVal);
    }
    const selected = this.buttons.find((b) => b.classList.contains('bc-selected'));
    return selected ? selected.dataset.bcGroupVal : null;
  }

  setValue(targetValue) {
    if (this.type === 'multiple') {
      const values = Array.isArray(targetValue) ? targetValue.map(String) : [String(targetValue)];
      const valSet = new Set(values);
      this.buttons.forEach((btn) => {
        const isMatch = valSet.has(btn.dataset.bcGroupVal);
        btn.classList.toggle('bc-selected', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });
      this.emitChange(this.getValue(), null);
    } else {
      const strVal = String(targetValue);
      const match = this.buttons.find((b) => b.dataset.bcGroupVal === strVal);
      if (match) {
        this.handleItemClick(match);
      }
    }
  }

  destroy() {
    while (this.disposers.length > 0) {
      const fn = this.disposers.pop();
      try { fn(); } catch {}
    }
    if (this.container) {
      this.container.classList.remove('bc-btn-group', 'bc-group-segmented');
      this.container.removeAttribute('role');
    }
    this.listeners.clear();
    this.buttons = [];
  }
}

/**
 * Creates a button group or segmented control
 * @param {string|Element|Array|NodeList} target
 * @param {Record<string, any>} [options={}]
 * @returns {BtnCraftGroup}
 */
export function group(target, options = {}) {
  return new BtnCraftGroup(target, options);
}
