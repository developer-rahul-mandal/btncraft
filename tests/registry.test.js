// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { registry, unregister } from '../src/index.js';

describe('BtnCraft V2 — Plugin Architecture & Registry', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('validates plugin definition on registration', () => {
    expect(() => {
      BtnCraft.register('', {});
    }).toThrow(/Animation name must be a non-empty string/);

    expect(() => {
      BtnCraft.register('invalid-plugin', {});
    }).toThrow(/must provide a setup function/);
  });

  it('prevents accidental duplicate registration without override', () => {
    const testName = 'test-dup-anim';
    BtnCraft.register(testName, { setup: () => {} });

    expect(() => {
      BtnCraft.register(testName, { setup: () => {} });
    }).toThrow(/already registered/);

    // Overwriting with override: true works
    expect(() => {
      BtnCraft.register(testName, { setup: () => {} }, { override: true });
    }).not.toThrow();

    BtnCraft.unregister(testName);
  });

  it('unregisters an animation and its aliases cleanly', () => {
    const name = 'custom-plugin-effect';
    BtnCraft.register(name, {
      setup: (el) => {
        el.setAttribute('data-plugin-active', 'true');
      }
    }, ['customAlias', 'myEffect']);

    expect(BtnCraft.hasAnimation(name)).toBe(true);
    expect(BtnCraft.hasAnimation('customAlias')).toBe(true);
    expect(BtnCraft.hasAnimation('myEffect')).toBe(true);

    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'customAlias' });
    expect(btn.getAttribute('data-plugin-active')).toBe('true');
    inst.destroy();

    // Now unregister
    const removed = BtnCraft.unregister(name);
    expect(removed).toBe(true);
    expect(BtnCraft.hasAnimation(name)).toBe(false);
    expect(BtnCraft.hasAnimation('customAlias')).toBe(false);
    expect(BtnCraft.hasAnimation('myEffect')).toBe(false);

    // Unregistering non-existent returns false
    expect(BtnCraft.unregister('non-existent')).toBe(false);
  });

  it('executes plugin lifecycle callbacks beforeSetup and afterTeardown', () => {
    const beforeSpy = vi.fn();
    const afterSpy = vi.fn();
    const setupSpy = vi.fn((el, opts, cleanup) => {
      return () => {};
    });

    const pluginName = 'lifecycle-plugin';
    BtnCraft.register(pluginName, {
      setup: setupSpy,
      beforeSetup: beforeSpy,
      afterTeardown: afterSpy
    });

    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: pluginName });
    expect(beforeSpy).toHaveBeenCalledWith(btn, expect.any(Object));
    expect(setupSpy).toHaveBeenCalledWith(btn, expect.any(Object), expect.any(Object));

    inst.destroy();
    expect(afterSpy).toHaveBeenCalledWith(btn, expect.any(Object));

    BtnCraft.unregister(pluginName);
  });
});
