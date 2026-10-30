// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { activeInstances } from '../src/index.js';

describe('BtnCraft.destroy and lifecycle cleanup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    BtnCraft.destroy(); // clean any residual
  });

  it('destroys single instance by instance.destroy()', () => {
    document.body.innerHTML = `<button id="btn">Hello</button>`;
    const btn = document.getElementById('btn');

    const inst = BtnCraft.create('#btn', {
      variant: 'danger',
      animation: 'pulse-glow',
      color: '#ff0000'
    });

    expect(btn.classList.contains('bc-btn')).toBe(true);
    expect(btn.querySelector('.bc-pulse-halo')).not.toBeNull();

    inst.destroy();
    expect(btn.classList.contains('bc-btn')).toBe(false);
    expect(btn.classList.contains('bc-anim-pulse-glow')).toBe(false);
    expect(btn.querySelector('.bc-pulse-halo')).toBeNull();
    expect(inst.isDestroyed).toBe(true);
  });

  it('destroys instance by selector string BtnCraft.destroy("#btn")', () => {
    document.body.innerHTML = `<button id="btn">Click</button>`;
    const btn = document.getElementById('btn');

    BtnCraft.create('#btn', { animation: 'glow' });
    expect(btn.classList.contains('bc-btn')).toBe(true);

    BtnCraft.destroy('#btn');
    expect(btn.classList.contains('bc-btn')).toBe(false);
  });

  it('destroys instance by element reference BtnCraft.destroy(element)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    BtnCraft.create(btn, { animation: 'ripple' });
    expect(btn.classList.contains('bc-btn')).toBe(true);

    BtnCraft.destroy(btn);
    expect(btn.classList.contains('bc-btn')).toBe(false);
  });

  it('destroys collection via collection.destroy() and BtnCraft.destroy(collection)', () => {
    document.body.innerHTML = `
      <button class="target">1</button>
      <button class="target">2</button>
    `;

    const collection = BtnCraft.create('.target', { animation: 'bounce' });
    expect(collection.length).toBe(2);

    collection.destroy();
    const btns = document.querySelectorAll('.target');
    expect(btns[0].classList.contains('bc-btn')).toBe(false);
    expect(btns[1].classList.contains('bc-btn')).toBe(false);
  });

  it('destroys all active instances when BtnCraft.destroy() is called with no arguments', () => {
    document.body.innerHTML = `
      <button id="b1">1</button>
      <button id="b2">2</button>
      <button id="b3">3</button>
    `;

    BtnCraft.create('#b1', { animation: 'glow' });
    BtnCraft.create('#b2', { animation: 'shimmer' });
    BtnCraft.create('#b3', { animation: 'bounce' });

    expect(activeInstances.size).toBe(3);

    BtnCraft.destroy();

    expect(activeInstances.size).toBe(0);
    expect(document.getElementById('b1').classList.contains('bc-btn')).toBe(false);
    expect(document.getElementById('b2').classList.contains('bc-btn')).toBe(false);
    expect(document.getElementById('b3').classList.contains('bc-btn')).toBe(false);
  });

  it('cleans up event listeners so subsequent events trigger no actions', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'magnetic-hover' });

    btn.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(btn.style.transform).not.toBe('');

    inst.destroy();
    expect(btn.style.transform).toBe('');

    // Dispatched events after destroy should have no effect
    btn.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200 }));
    expect(btn.style.transform).toBe('');
  });

  it('restores original styles and attributes upon destruction', () => {
    const btn = document.createElement('button');
    btn.style.setProperty('--bc-bg', '#000000');
    btn.setAttribute('data-variant', 'outline');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, {
      variant: 'gradient',
      color: '#123456'
    });

    expect(btn.getAttribute('data-variant')).toBe('gradient');
    expect(btn.style.getPropertyValue('--bc-bg')).toBe('#123456');

    inst.destroy();

    expect(btn.getAttribute('data-variant')).toBe('outline');
    expect(btn.style.getPropertyValue('--bc-bg')).toBe('#000000');
  });

  it('is safe to call destroy repeatedly (idempotent)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'shimmer' });
    expect(() => {
      inst.destroy();
      inst.destroy();
      inst.destroy();
    }).not.toThrow();
  });
});
