// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import BtnCraft from '../src/index.js';

describe('BtnCraft.init declarative markup', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('scans and initializes buttons with data-btncraft attribute', () => {
    document.body.innerHTML = `
      <button data-btncraft="glow" data-color="#8b5cf6">Button 1</button>
      <button data-btncraft="ripple" data-radius="pill">Button 2</button>
      <button id="plain">Plain Button</button>
    `;

    const controller = BtnCraft.init();

    expect(controller.instances.length).toBe(2);

    const b1 = document.querySelector('[data-btncraft="glow"]');
    const b2 = document.querySelector('[data-btncraft="ripple"]');
    const plain = document.getElementById('plain');

    expect(b1.classList.contains('bc-btn')).toBe(true);
    expect(b1.classList.contains('bc-anim-neon-glow')).toBe(true);
    expect(b1.style.getPropertyValue('--bc-bg')).toBe('#8b5cf6');

    expect(b2.classList.contains('bc-btn')).toBe(true);
    expect(b2.classList.contains('bc-anim-ripple-click')).toBe(true);
    expect(b2.getAttribute('data-radius')).toBe('pill');

    expect(plain.classList.contains('bc-btn')).toBe(false);

    controller.destroy();

    expect(b1.classList.contains('bc-btn')).toBe(false);
    expect(b1.classList.contains('bc-anim-neon-glow')).toBe(false);
    expect(b2.classList.contains('bc-btn')).toBe(false);
    expect(b2.classList.contains('bc-anim-ripple-click')).toBe(false);
  });

  it('supports passing a specific container root element', () => {
    document.body.innerHTML = `
      <div id="container-a">
        <button data-btncraft="bounce">In A</button>
      </div>
      <div id="container-b">
        <button data-btncraft="shimmer">In B</button>
      </div>
    `;

    const containerA = document.getElementById('container-a');
    const controller = BtnCraft.init(containerA);

    expect(controller.instances.length).toBe(1);

    const inA = containerA.querySelector('button');
    const inB = document.getElementById('container-b').querySelector('button');

    expect(inA.classList.contains('bc-btn')).toBe(true);
    expect(inB.classList.contains('bc-btn')).toBe(false);

    controller.destroy();
    expect(inA.classList.contains('bc-btn')).toBe(false);
  });
});
