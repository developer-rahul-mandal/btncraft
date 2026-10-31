// @vitest-environment jsdom

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { ButtonStateEngine } from '../src/index.js';

describe('BtnCraft V2 — Button State Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('manages loading state and prepends spinner without destroying DOM', () => {
    document.body.innerHTML = `<button id="submit">Save Changes</button>`;
    const btn = BtnCraft.create('#submit');

    expect(btn.state).toBe('default');
    expect(btn.isLoading).toBe(false);

    btn.loading(true, { text: 'Saving...' });

    expect(btn.state).toBe('loading');
    expect(btn.isLoading).toBe(true);

    const el = document.getElementById('submit');
    expect(el.classList.contains('bc-state-loading')).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('aria-busy')).toBe('true');
    expect(el.querySelector('.bc-spinner')).not.toBeNull();
    expect(el.textContent).toContain('Saving...');

    // Duplicate submission guard
    btn.loading(true, { text: 'Duplicate Click' });
    expect(el.querySelectorAll('.bc-spinner').length).toBe(1);

    btn.loading(false);
    expect(btn.state).toBe('default');
    expect(btn.isLoading).toBe(false);
    expect(el.classList.contains('bc-state-loading')).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.querySelector('.bc-spinner')).toBeNull();
    expect(el.textContent).toBe('Save Changes');

    btn.destroy();
  });

  it('transitions to success state with checkmark and auto-resets', () => {
    document.body.innerHTML = `<button id="btn">Submit Form</button>`;
    const btn = BtnCraft.create('#btn');
    const onReset = vi.fn();

    btn.success({
      text: 'Saved!',
      duration: 1500,
      onReset
    });

    const el = document.getElementById('btn');
    expect(btn.state).toBe('success');
    expect(btn.isSuccess).toBe(true);
    expect(el.classList.contains('bc-state-success')).toBe(true);
    expect(el.textContent).toContain('Saved!');
    expect(el.querySelector('.bc-state-check')).not.toBeNull();

    // Fast-forward timer
    vi.advanceTimersByTime(1500);

    expect(btn.state).toBe('default');
    expect(el.classList.contains('bc-state-success')).toBe(false);
    expect(el.textContent).toBe('Submit Form');
    expect(onReset).toHaveBeenCalledTimes(1);

    btn.destroy();
  });

  it('transitions to error state with shake and auto-resets', () => {
    document.body.innerHTML = `<button id="btn">Pay Now</button>`;
    const btn = BtnCraft.create('#btn');

    btn.error({
      text: 'Card Declined',
      duration: 2000,
      shake: true
    });

    const el = document.getElementById('btn');
    expect(btn.state).toBe('error');
    expect(btn.isError).toBe(true);
    expect(el.classList.contains('bc-state-error')).toBe(true);
    expect(el.classList.contains('bc-shake')).toBe(true);
    expect(el.textContent).toContain('Card Declined');
    expect(el.querySelector('.bc-state-err')).not.toBeNull();

    vi.advanceTimersByTime(2000);

    expect(btn.state).toBe('default');
    expect(el.classList.contains('bc-state-error')).toBe(false);
    expect(el.classList.contains('bc-shake')).toBe(false);
    expect(el.textContent).toBe('Pay Now');

    btn.destroy();
  });

  it('preserves and restores original accessibility attributes on reset', () => {
    document.body.innerHTML = `
      <button id="btn" aria-label="Original Label" aria-busy="false" disabled>
        Original Content
      </button>
    `;

    const btn = BtnCraft.create('#btn');
    expect(btn.isDisabled).toBe(true);

    btn.loading(true, { text: 'Loading...', ariaLabel: 'New Loading Label' });
    const el = document.getElementById('btn');
    expect(el.getAttribute('aria-label')).toBe('New Loading Label');
    expect(el.getAttribute('aria-busy')).toBe('true');

    btn.reset();

    expect(el.getAttribute('aria-label')).toBe('Original Label');
    expect(el.getAttribute('aria-busy')).toBe('false');
    expect(el.disabled).toBe(true);
    expect(el.innerHTML.trim()).toBe('Original Content');

    btn.destroy();
  });

  it('handles programmatic hover, active, focus and disabled states', () => {
    document.body.innerHTML = `<button id="btn">Action</button>`;
    const btn = BtnCraft.create('#btn');
    const el = document.getElementById('btn');

    btn.hover(true);
    expect(el.classList.contains('bc-state-hover')).toBe(true);
    btn.hover(false);
    expect(el.classList.contains('bc-state-hover')).toBe(false);

    btn.active(true);
    expect(el.classList.contains('bc-state-active')).toBe(true);
    btn.active(false);
    expect(el.classList.contains('bc-state-active')).toBe(false);

    btn.focus(true);
    expect(el.classList.contains('bc-state-focus')).toBe(true);
    btn.focus(false);
    expect(el.classList.contains('bc-state-focus')).toBe(false);

    btn.disabled(true);
    expect(btn.isDisabled).toBe(true);
    expect(el.disabled).toBe(true);
    expect(el.getAttribute('aria-disabled')).toBe('true');

    btn.disabled(false);
    expect(btn.isDisabled).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.getAttribute('aria-disabled')).toBeNull();

    btn.destroy();
  });

  it('wraps asynchronous operations with execute() handling success', async () => {
    document.body.innerHTML = `<button id="btn">Async Action</button>`;
    const btn = BtnCraft.create('#btn');

    const promise = btn.execute(async () => {
      return 'DATA_LOADED';
    }, {
      loadingText: 'Fetching...',
      successText: 'Done!',
      duration: 1000
    });

    const el = document.getElementById('btn');
    expect(btn.state).toBe('loading');

    const result = await promise;
    expect(result).toBe('DATA_LOADED');
    expect(btn.state).toBe('success');
    expect(el.textContent).toContain('Done!');

    vi.advanceTimersByTime(1000);
    expect(btn.state).toBe('default');
    expect(el.textContent).toBe('Async Action');

    btn.destroy();
  });

  it('wraps asynchronous operations with execute() handling failure', async () => {
    document.body.innerHTML = `<button id="btn">Async Error</button>`;
    const btn = BtnCraft.create('#btn');

    await expect(
      btn.execute(async () => {
        throw new Error('Server Unavailable');
      }, {
        loadingText: 'Connecting...',
        duration: 1000
      })
    ).rejects.toThrow('Server Unavailable');

    expect(btn.state).toBe('error');
    const el = document.getElementById('btn');
    expect(el.textContent).toContain('Server Unavailable');

    vi.advanceTimersByTime(1000);
    expect(btn.state).toBe('default');

    btn.destroy();
  });

  it('supports state change event emission via .on()', () => {
    document.body.innerHTML = `<button id="btn">Event Test</button>`;
    const btn = BtnCraft.create('#btn');
    const listener = vi.fn();

    btn.on('change', listener);

    btn.loading(true);
    expect(listener).toHaveBeenCalledWith('loading', expect.anything());

    btn.reset();
    expect(listener).toHaveBeenCalledWith('default', undefined);

    btn.destroy();
  });

  it('supports batch state calls on BtnCraftCollection', () => {
    document.body.innerHTML = `
      <button class="multi">A</button>
      <button class="multi">B</button>
    `;
    const col = BtnCraft.create('.multi');
    const buttons = document.querySelectorAll('.multi');

    col.loading(true, { text: 'Bulk Loading' });
    for (const b of buttons) {
      expect(b.classList.contains('bc-state-loading')).toBe(true);
      expect(b.disabled).toBe(true);
      expect(b.textContent).toContain('Bulk Loading');
    }

    col.reset();
    for (const b of buttons) {
      expect(b.classList.contains('bc-state-loading')).toBe(false);
      expect(b.disabled).toBe(false);
    }

    col.destroy();
  });
});
