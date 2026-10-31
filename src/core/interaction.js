/**
 * BtnCraft V2 — Interaction Engine
 * High-performance pointer tracking, touch normalization, and rAF scheduling.
 * Eliminates layout thrashing, avoids redundant listeners, and supports mobile touch devices.
 */

import { prefersReducedMotion, createElement } from '../utils/dom.js';

/**
 * Throttle a function execution to requestAnimationFrame
 * @param {(...args: any[]) => void} callback
 * @returns {((...args: any[]) => void) & { cancel: () => void }}
 */
export function rAFThrottle(callback) {
  let rAFId = null;
  let latestArgs = null;

  const throttled = (...args) => {
    latestArgs = args;
    if (rAFId === null) {
      rAFId = requestAnimationFrame(() => {
        rAFId = null;
        if (latestArgs) {
          callback(...latestArgs);
        }
      });
    }
  };

  throttled.cancel = () => {
    if (rAFId !== null) {
      cancelAnimationFrame(rAFId);
      rAFId = null;
    }
    latestArgs = null;
  };

  return throttled;
}

/**
 * High-performance Pointer Tracker
 * Caches bounding client rect on entry/resize to avoid layout thrashing during moves.
 */
export class PointerTracker {
  constructor(element, cleanupManager) {
    this.element = element;
    this.cleanup = cleanupManager;
    this.rect = null;
    this.isInside = false;
    this.moveListeners = new Set();
    this.leaveListeners = new Set();
    this.enterListeners = new Set();

    this.onPointerMoveThrottled = rAFThrottle((e) => {
      if (!this.isInside || !this.rect) return;
      const x = e.clientX - this.rect.left;
      const y = e.clientY - this.rect.top;
      const normalized = {
        clientX: e.clientX,
        clientY: e.clientY,
        elementX: x,
        elementY: y,
        centerX: x - this.rect.width / 2,
        centerY: y - this.rect.height / 2,
        percentX: this.rect.width > 0 ? (x / this.rect.width) * 100 : 50,
        percentY: this.rect.height > 0 ? (y / this.rect.height) * 100 : 50,
        originalEvent: e
      };

      for (const fn of this.moveListeners) {
        try { fn(normalized); } catch (err) { console.error(err); }
      }
    });

    this.setup();
  }

  updateRect() {
    if (this.element && this.element.getBoundingClientRect) {
      this.rect = this.element.getBoundingClientRect();
    }
  }

  setup() {
    const onEnter = (e) => {
      this.isInside = true;
      this.updateRect();
      for (const fn of this.enterListeners) {
        try { fn(e, this.rect); } catch (err) { console.error(err); }
      }
    };

    const onLeave = (e) => {
      this.isInside = false;
      this.onPointerMoveThrottled.cancel();
      for (const fn of this.leaveListeners) {
        try { fn(e); } catch (err) { console.error(err); }
      }
    };

    const onMove = (e) => {
      if (!this.isInside) {
        this.isInside = true;
        this.updateRect();
      }
      this.onPointerMoveThrottled(e);
    };

    // Support both mouse and touch via pointer events
    if (this.cleanup) {
      this.cleanup.addEventListener(this.element, 'pointerenter', onEnter);
      this.cleanup.addEventListener(this.element, 'pointerleave', onLeave);
      this.cleanup.addEventListener(this.element, 'pointermove', onMove);
      this.cleanup.addEventListener(this.element, 'pointercancel', onLeave);
      this.cleanup.add(() => this.destroy());
    } else {
      this.element.addEventListener('pointerenter', onEnter);
      this.element.addEventListener('pointerleave', onLeave);
      this.element.addEventListener('pointermove', onMove);
      this.element.addEventListener('pointercancel', onLeave);
    }
  }

  onMove(fn) {
    this.moveListeners.add(fn);
    return () => this.moveListeners.delete(fn);
  }

  onEnter(fn) {
    this.enterListeners.add(fn);
    return () => this.enterListeners.delete(fn);
  }

  onLeave(fn) {
    this.leaveListeners.add(fn);
    return () => this.leaveListeners.delete(fn);
  }

  destroy() {
    this.onPointerMoveThrottled.cancel();
    this.moveListeners.clear();
    this.enterListeners.clear();
    this.leaveListeners.clear();
    this.rect = null;
    this.isInside = false;
  }
}

/**
 * High-performance Magnetic Movement helper using PointerTracker
 */
export function applyMagneticMovement(element, options = {}, cleanup) {
  if (prefersReducedMotion()) return;

  const strength = typeof options.strength === 'number' ? options.strength : 0.28;
  const tracker = new PointerTracker(element, cleanup);

  cleanup.saveStyle('transform');
  cleanup.saveStyle('transition');

  tracker.onMove(({ centerX, centerY }) => {
    const deltaX = centerX * strength;
    const deltaY = centerY * strength;
    element.style.transition = 'transform 100ms ease-out';
    element.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
  });

  tracker.onLeave(() => {
    element.style.transition = 'transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)';
    element.style.transform = 'translate3d(0, 0, 0)';
  });

  cleanup.add(() => {
    element.style.transform = '';
    element.style.transition = '';
  });
}

/**
 * High-performance Spotlight illumination helper using PointerTracker
 */
export function applySpotlight(element, options = {}, cleanup) {
  if (prefersReducedMotion()) return;

  const tracker = new PointerTracker(element, cleanup);

  cleanup.saveStyle('--bc-spot-x');
  cleanup.saveStyle('--bc-spot-y');
  cleanup.saveStyle('--bc-spot-opacity');

  tracker.onMove(({ elementX, elementY }) => {
    element.style.setProperty('--bc-spot-x', `${elementX.toFixed(1)}px`);
    element.style.setProperty('--bc-spot-y', `${elementY.toFixed(1)}px`);
    element.style.setProperty('--bc-spot-opacity', '1');
  });

  tracker.onLeave(() => {
    element.style.setProperty('--bc-spot-opacity', '0');
  });

  cleanup.add(() => {
    element.style.removeProperty('--bc-spot-x');
    element.style.removeProperty('--bc-spot-y');
    element.style.removeProperty('--bc-spot-opacity');
  });
}
