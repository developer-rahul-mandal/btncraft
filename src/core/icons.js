/**
 * BtnCraft V2 — Icon & Content Animation System
 * Reusable icon and text interaction utilities:
 * - Icon rotations, slides, arrow reveal, replacement, and icon-to-spinner morphs
 * - Text fade, slide-up, slide-down transitions
 * - Hardware-accelerated SVG checkmark, error, and spinner glyphs
 * Zero external icon dependencies; accepts standard SVGs or DOM elements.
 */

import { createElement, prefersReducedMotion } from '../utils/dom.js';

export const ICONS = {
  arrowRight: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bc-icon bc-icon-arrow" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bc-icon bc-icon-arrow" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  check: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bc-icon bc-draw-check" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="bc-icon bc-draw-error" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  spinner: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="bc-spinner" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`
};

export class IconSystem {
  /**
   * Generates an animated SVG checkmark
   * @param {{ size?: number, color?: string }} [options={}]
   * @returns {HTMLElement}
   */
  createCheckmark(options = {}) {
    const span = createElement('span', 'bc-state-icon bc-icon-check', { 'aria-hidden': 'true' });
    span.innerHTML = ICONS.check;
    if (options.size) {
      const svg = span.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', String(options.size));
        svg.setAttribute('height', String(options.size));
      }
    }
    if (options.color) {
      span.style.color = options.color;
    }
    return span;
  }

  /**
   * Generates an animated SVG error cross
   * @param {{ size?: number, color?: string }} [options={}]
   * @returns {HTMLElement}
   */
  createErrorCross(options = {}) {
    const span = createElement('span', 'bc-state-icon bc-icon-error', { 'aria-hidden': 'true' });
    span.innerHTML = ICONS.error;
    if (options.size) {
      const svg = span.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', String(options.size));
        svg.setAttribute('height', String(options.size));
      }
    }
    if (options.color) {
      span.style.color = options.color;
    }
    return span;
  }

  /**
   * Generates an accessible SVG spinner
   * @param {{ size?: number, color?: string }} [options={}]
   * @returns {HTMLElement}
   */
  createSpinner(options = {}) {
    const span = createElement('span', 'bc-state-icon bc-icon-spin', { 'aria-hidden': 'true' });
    span.innerHTML = ICONS.spinner;
    if (options.size) {
      const svg = span.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', String(options.size));
        svg.setAttribute('height', String(options.size));
      }
    }
    if (options.color) {
      span.style.color = options.color;
    }
    return span;
  }

  /**
   * Rotates an embedded icon on hover
   * @param {HTMLElement} element
   * @param {{ deg?: number, duration?: number }} [options={}]
   * @returns {() => void} cleanup
   */
  rotateIcon(element, options = {}) {
    if (!element) return () => {};
    let icon = element.querySelector('.bc-icon, svg, i');
    let injected = false;

    if (!icon) {
      const span = createElement('span', 'bc-icon', { 'aria-hidden': 'true' });
      span.innerHTML = ICONS.arrowRight;
      element.appendChild(span);
      icon = span;
      injected = true;
    }

    const deg = options.deg !== undefined ? options.deg : 90;
    const dur = options.duration !== undefined ? options.duration : 250;

    icon.style.transition = `transform ${dur}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

    const onEnter = () => {
      if (!prefersReducedMotion()) {
        icon.style.transform = `rotate(${deg}deg)`;
      }
    };

    const onLeave = () => {
      icon.style.transform = 'rotate(0deg)';
    };

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
      if (injected && icon.parentNode) {
        icon.parentNode.removeChild(icon);
      } else {
        icon.style.transform = '';
        icon.style.transition = '';
      }
    };
  }

  /**
   * Slides an embedded icon horizontally or vertically on hover
   * @param {HTMLElement} element
   * @param {{ direction?: 'left'|'right'|'up'|'down', distance?: number, duration?: number }} [options={}]
   * @returns {() => void} cleanup
   */
  slideIcon(element, options = {}) {
    if (!element) return () => {};
    const icon = element.querySelector('.bc-icon, svg, i');
    if (!icon) return () => {};

    const dir = options.direction || 'right';
    const dist = options.distance !== undefined ? options.distance : 4;
    const dur = options.duration !== undefined ? options.duration : 200;

    icon.style.transition = `transform ${dur}ms ease`;

    const getTransform = () => {
      if (dir === 'left') return `translateX(-${dist}px)`;
      if (dir === 'up') return `translateY(-${dist}px)`;
      if (dir === 'down') return `translateY(${dist}px)`;
      return `translateX(${dist}px)`;
    };

    const onEnter = () => {
      if (!prefersReducedMotion()) {
        icon.style.transform = getTransform();
      }
    };

    const onLeave = () => {
      icon.style.transform = 'translate3d(0, 0, 0)';
    };

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
      icon.style.transform = '';
      icon.style.transition = '';
    };
  }

  /**
   * Reveals a hidden arrow that slides smoothly into view on hover
   * @param {HTMLElement} element
   * @param {{ direction?: 'right'|'left', duration?: number }} [options={}]
   * @returns {() => void} cleanup
   */
  revealArrow(element, options = {}) {
    if (!element) return () => {};
    const dir = options.direction || 'right';
    const dur = options.duration !== undefined ? options.duration : 220;

    const span = createElement('span', 'bc-arrow-reveal', { 'aria-hidden': 'true' });
    span.innerHTML = dir === 'left' ? ICONS.arrowLeft : ICONS.arrowRight;
    span.style.display = 'inline-flex';
    span.style.opacity = '0';
    span.style.transform = dir === 'left' ? 'translateX(6px)' : 'translateX(-6px)';
    span.style.transition = `opacity ${dur}ms ease, transform ${dur}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

    if (dir === 'left') {
      element.prepend(span);
    } else {
      element.appendChild(span);
    }

    const onEnter = () => {
      span.style.opacity = '1';
      span.style.transform = 'translateX(0)';
    };

    const onLeave = () => {
      span.style.opacity = '0';
      span.style.transform = dir === 'left' ? 'translateX(6px)' : 'translateX(-6px)';
    };

    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);

    return () => {
      element.removeEventListener('mouseenter', onEnter);
      element.removeEventListener('mouseleave', onLeave);
      if (span.parentNode) {
        span.parentNode.removeChild(span);
      }
    };
  }

  /**
   * Replaces an existing icon with a new icon element using a scale/fade transition
   * @param {HTMLElement} element
   * @param {Element|string} newIcon
   * @param {{ duration?: number }} [options={}]
   */
  replaceIcon(element, newIcon, options = {}) {
    if (!element) return;
    const dur = options.duration !== undefined ? options.duration : 200;
    const current = element.querySelector('.bc-icon, svg, .bc-state-icon');

    const incoming = createElement('span', 'bc-icon', { 'aria-hidden': 'true' });
    if (newIcon instanceof Element) {
      incoming.appendChild(newIcon.cloneNode(true));
    } else if (typeof newIcon === 'string') {
      incoming.innerHTML = newIcon;
    }

    if (!current) {
      element.appendChild(incoming);
      return;
    }

    if (prefersReducedMotion()) {
      current.replaceWith(incoming);
      return;
    }

    current.style.transition = `transform ${dur / 2}ms ease-in, opacity ${dur / 2}ms ease-in`;
    current.style.transform = 'scale(0.4)';
    current.style.opacity = '0';

    setTimeout(() => {
      incoming.style.opacity = '0';
      incoming.style.transform = 'scale(0.4)';
      incoming.style.transition = `transform ${dur / 2}ms ease-out, opacity ${dur / 2}ms ease-out`;

      current.replaceWith(incoming);

      requestAnimationFrame(() => {
        incoming.style.opacity = '1';
        incoming.style.transform = 'scale(1)';
      });
    }, dur / 2);
  }

  /**
   * Smooth text transition: 'fade', 'slide-up', or 'slide-down'
   * @param {HTMLElement} element
   * @param {string} newText
   * @param {{ transition?: 'fade'|'slide-up'|'slide-down'|'none', duration?: number }} [options={}]
   */
  setText(element, newText, options = {}) {
    if (!element) return;
    const type = options.transition || 'fade';
    const dur = options.duration !== undefined ? options.duration : 200;

    if (type === 'none' || prefersReducedMotion()) {
      element.textContent = newText;
      return;
    }

    let wrapper = element.querySelector('.bc-text-wrapper');
    if (!wrapper) {
      wrapper = createElement('span', 'bc-text-wrapper');
      wrapper.textContent = element.textContent;
      element.innerHTML = '';
      element.appendChild(wrapper);
    }

    wrapper.style.display = 'inline-block';
    wrapper.style.transition = `opacity ${dur / 2}ms ease, transform ${dur / 2}ms ease`;

    if (type === 'fade') {
      wrapper.style.opacity = '0';
      setTimeout(() => {
        wrapper.textContent = newText;
        wrapper.style.opacity = '1';
      }, dur / 2);
      return;
    }

    const outTransform = type === 'slide-up' ? 'translateY(-10px)' : 'translateY(10px)';
    const inTransform = type === 'slide-up' ? 'translateY(10px)' : 'translateY(-10px)';

    wrapper.style.opacity = '0';
    wrapper.style.transform = outTransform;

    setTimeout(() => {
      wrapper.textContent = newText;
      wrapper.style.transform = inTransform;

      requestAnimationFrame(() => {
        wrapper.style.opacity = '1';
        wrapper.style.transform = 'translateY(0)';
      });
    }, dur / 2);
  }

  /**
   * Morphs an embedded icon into an accessible spinner
   * @param {HTMLElement} element
   * @param {boolean} [showSpinner=true]
   * @returns {() => void} restore callback
   */
  iconToSpinner(element, showSpinner = true) {
    if (!element) return () => {};
    const icon = element.querySelector('.bc-icon, svg:not(.bc-spinner)');

    if (showSpinner) {
      if (icon) icon.style.display = 'none';
      let spinner = element.querySelector('.bc-spinner');
      if (!spinner) {
        spinner = createElement('span', 'bc-spinner', { 'aria-hidden': 'true' });
        element.prepend(spinner);
      }
      return () => {
        spinner?.remove();
        if (icon) icon.style.display = '';
      };
    } else {
      element.querySelector('.bc-spinner')?.remove();
      if (icon) icon.style.display = '';
      return () => {};
    }
  }
}

export const icons = new IconSystem();
