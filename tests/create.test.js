// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { BtnCraftInstance, BtnCraftCollection } from '../src/index.js';

describe('BtnCraft.create', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes a button by ID selector and returns a BtnCraftInstance', () => {
    document.body.innerHTML = `<button id="btn">Click me</button>`;

    const instance = BtnCraft.create('#btn', {
      variant: 'gradient',
      animation: 'neon-glow',
      color: '#8b5cf6',
      radius: 12,
      duration: 300
    });

    const button = document.getElementById('btn');
    expect(instance).toBeInstanceOf(BtnCraftInstance);
    expect(button.classList.contains('bc-btn')).toBe(true);
    expect(button.classList.contains('bc-anim-neon-glow')).toBe(true);
    expect(button.getAttribute('data-variant')).toBe('gradient');
    expect(button.style.getPropertyValue('--bc-radius')).toBe('12px');
    expect(button.style.getPropertyValue('--bc-duration')).toBe('300ms');

    instance.destroy();
    expect(button.classList.contains('bc-btn')).toBe(false);
  });

  it('initializes a button by HTMLElement directly', () => {
    const button = document.createElement('button');
    button.textContent = 'Save';
    document.body.appendChild(button);

    const instance = BtnCraft.create(button, { animation: 'shimmer' });
    expect(instance).toBeInstanceOf(BtnCraftInstance);
    expect(button.classList.contains('bc-btn')).toBe(true);
    expect(button.classList.contains('bc-anim-shimmer')).toBe(true);

    instance.destroy();
  });

  it('handles multiple buttons by class selector and returns a BtnCraftCollection', () => {
    document.body.innerHTML = `
      <button class="my-btn">One</button>
      <button class="my-btn">Two</button>
      <button class="my-btn">Three</button>
    `;

    const collection = BtnCraft.create('.my-btn', { animation: 'bounce' });
    expect(collection).toBeInstanceOf(BtnCraftCollection);
    expect(collection.length).toBe(3);

    const buttons = document.querySelectorAll('.my-btn');
    for (const btn of buttons) {
      expect(btn.classList.contains('bc-btn')).toBe(true);
      expect(btn.classList.contains('bc-anim-bounce')).toBe(true);
    }

    collection.destroy();
    for (const btn of buttons) {
      expect(btn.classList.contains('bc-btn')).toBe(false);
      expect(btn.classList.contains('bc-anim-bounce')).toBe(false);
    }
  });

  it('handles NodeList and Array targets', () => {
    document.body.innerHTML = `
      <button class="action">A</button>
      <button class="action">B</button>
    `;

    const nodeList = document.querySelectorAll('.action');
    const collection = BtnCraft.create(nodeList, { variant: 'danger' });

    expect(collection.length).toBe(2);
    expect(nodeList[0].getAttribute('data-variant')).toBe('danger');
    expect(nodeList[1].getAttribute('data-variant')).toBe('danger');

    collection.destroy();
  });

  it('returns null when selector matches no elements', () => {
    const result = BtnCraft.create('#non-existent-button');
    expect(result).toBeNull();
  });

  it('handles invalid or empty selectors safely without throwing', () => {
    expect(() => BtnCraft.create('')).not.toThrow();
    expect(BtnCraft.create('')).toBeNull();
    expect(() => BtnCraft.create(null)).not.toThrow();
    expect(BtnCraft.create(null)).toBeNull();
    expect(() => BtnCraft.create('###invalid-css-selector')).not.toThrow();
    expect(BtnCraft.create('###invalid-css-selector')).toBeNull();
  });

  it('retrieves an existing instance via BtnCraft.get()', () => {
    document.body.innerHTML = `<button id="target">Target</button>`;
    const btn = document.getElementById('target');

    const created = BtnCraft.create(btn, { animation: 'pulse' });
    const fetched = BtnCraft.get(btn);
    const fetchedBySelector = BtnCraft.get('#target');

    expect(fetched).toBe(created);
    expect(fetchedBySelector).toBe(created);

    created.destroy();
    expect(BtnCraft.get(btn)).toBeNull();
  });

  it('handles duplicate initialization idempotently by replacing previous instance', () => {
    document.body.innerHTML = `<button id="btn">Action</button>`;
    const button = document.getElementById('btn');

    const first = BtnCraft.create(button, { animation: 'glow', color: '#ff0000' });
    expect(button.classList.contains('bc-anim-neon-glow')).toBe(true);
    expect(first.isDestroyed).toBe(false);

    // Re-create with different animation
    const second = BtnCraft.create(button, { animation: 'bounce', color: '#00ff00' });
    expect(first.isDestroyed).toBe(true);
    expect(second.isDestroyed).toBe(false);
    expect(button.classList.contains('bc-anim-bounce')).toBe(true);
    expect(button.classList.contains('bc-anim-neon-glow')).toBe(false);
    expect(button.style.getPropertyValue('--bc-bg')).toBe('#00ff00');

    second.destroy();
    expect(button.classList.contains('bc-btn')).toBe(false);
  });

  it('dynamically updates an instance via instance.update()', () => {
    document.body.innerHTML = `<button id="btn">Test</button>`;
    const button = document.getElementById('btn');

    const instance = BtnCraft.create(button, {
      animation: 'glow',
      color: '#111111',
      radius: 8
    });

    expect(button.style.getPropertyValue('--bc-bg')).toBe('#111111');
    expect(button.style.getPropertyValue('--bc-radius')).toBe('8px');

    instance.update({
      color: '#222222',
      radius: 20
    });

    expect(button.style.getPropertyValue('--bc-bg')).toBe('#222222');
    expect(button.style.getPropertyValue('--bc-radius')).toBe('20px');

    instance.destroy();
  });
});
