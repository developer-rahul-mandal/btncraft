// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { group, BtnCraftGroup } from '../src/index.js';

describe('BtnCraft V2 — Button Groups and Toggle System', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes a single-selection button group with proper ARIA attributes', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button data-value="left">Left</button>
      <button data-value="center">Center</button>
      <button data-value="right">Right</button>
    `;
    document.body.appendChild(container);

    const grp = group(container, { type: 'single', defaultValue: 'center' });

    expect(container.getAttribute('role')).toBe('radiogroup');
    expect(container.classList.contains('bc-btn-group')).toBe(true);

    const buttons = container.querySelectorAll('button');
    expect(buttons[0].getAttribute('role')).toBe('radio');
    expect(buttons[0].getAttribute('aria-checked')).toBe('false');
    expect(buttons[0].getAttribute('tabindex')).toBe('-1');

    expect(buttons[1].getAttribute('role')).toBe('radio');
    expect(buttons[1].getAttribute('aria-checked')).toBe('true');
    expect(buttons[1].getAttribute('tabindex')).toBe('0');
    expect(buttons[1].classList.contains('bc-selected')).toBe(true);

    expect(grp.getValue()).toBe('center');

    grp.destroy();
  });

  it('updates selection on click and emits onChange in single mode', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button data-value="opt1">Option 1</button>
      <button data-value="opt2">Option 2</button>
    `;
    document.body.appendChild(container);

    const changeSpy = vi.fn();
    const grp = group(container, { type: 'single', onChange: changeSpy });

    const buttons = container.querySelectorAll('button');
    buttons[1].click();

    expect(grp.getValue()).toBe('opt2');
    expect(buttons[1].classList.contains('bc-selected')).toBe(true);
    expect(buttons[1].getAttribute('aria-checked')).toBe('true');
    expect(buttons[0].classList.contains('bc-selected')).toBe(false);
    expect(buttons[0].getAttribute('aria-checked')).toBe('false');
    expect(changeSpy).toHaveBeenCalledWith('opt2', buttons[1], grp);

    grp.destroy();
  });

  it('supports multi-selection toggle group with aria-pressed', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button data-value="bold">Bold</button>
      <button data-value="italic">Italic</button>
      <button data-value="underline">Underline</button>
    `;
    document.body.appendChild(container);

    const grp = group(container, { type: 'multiple', defaultValue: ['bold'] });

    expect(container.getAttribute('role')).toBe('group');
    const buttons = container.querySelectorAll('button');

    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].classList.contains('bc-selected')).toBe(true);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');

    expect(grp.getValue()).toEqual(['bold']);

    // Toggle italic
    buttons[1].click();
    expect(grp.getValue()).toEqual(['bold', 'italic']);
    expect(buttons[1].classList.contains('bc-selected')).toBe(true);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');

    // Untoggle bold
    buttons[0].click();
    expect(grp.getValue()).toEqual(['italic']);
    expect(buttons[0].classList.contains('bc-selected')).toBe(false);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');

    grp.destroy();
  });

  it('supports programmatic setValue() for single and multiple groups', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button data-value="apple">Apple</button>
      <button data-value="banana">Banana</button>
    `;
    document.body.appendChild(container);

    const grp = group(container, { type: 'single' });
    grp.setValue('banana');
    expect(grp.getValue()).toBe('banana');

    const multContainer = document.createElement('div');
    multContainer.innerHTML = `
      <button data-value="red">Red</button>
      <button data-value="blue">Blue</button>
    `;
    document.body.appendChild(multContainer);

    const multGrp = group(multContainer, { type: 'multiple' });
    multGrp.setValue(['red', 'blue']);
    expect(multGrp.getValue()).toEqual(['red', 'blue']);

    grp.destroy();
    multGrp.destroy();
  });

  it('supports segmented controls and keyboard arrow navigation', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button data-value="day">Day</button>
      <button data-value="week">Week</button>
      <button data-value="month">Month</button>
    `;
    document.body.appendChild(container);

    const grp = group(container, { type: 'segmented' });
    expect(container.classList.contains('bc-group-segmented')).toBe(true);
    expect(grp.getValue()).toBe('day'); // default first

    const buttons = container.querySelectorAll('button');

    // Navigate right
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(grp.getValue()).toBe('week');
    expect(buttons[1].getAttribute('aria-checked')).toBe('true');

    // Navigate right again
    buttons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(grp.getValue()).toBe('month');

    // Wraparound to first
    buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(grp.getValue()).toBe('day');

    // Navigate left wraps to last
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(grp.getValue()).toBe('month');

    // Home key jumps to first
    buttons[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(grp.getValue()).toBe('day');

    // End key jumps to last
    buttons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(grp.getValue()).toBe('month');

    grp.destroy();
  });

  it('cleans up completely on destroy()', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button data-value="1">1</button>
      <button data-value="2">2</button>
    `;
    document.body.appendChild(container);

    const grp = group(container, { type: 'single', defaultValue: '1' });
    const buttons = container.querySelectorAll('button');

    grp.destroy();

    expect(container.classList.contains('bc-btn-group')).toBe(false);
    expect(container.hasAttribute('role')).toBe(false);
    expect(buttons[0].classList.contains('bc-group-item')).toBe(false);
    expect(buttons[0].classList.contains('bc-selected')).toBe(false);
    expect(buttons[0].hasAttribute('role')).toBe(false);
    expect(buttons[0].hasAttribute('aria-checked')).toBe(false);
    expect(buttons[0].hasAttribute('tabindex')).toBe(false);

    // Clicking after destroy has no effect
    buttons[1].click();
    expect(buttons[1].classList.contains('bc-selected')).toBe(false);
  });
});
