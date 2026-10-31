// @vitest-environment jsdom

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import BtnCraft from '../src/index.js';
import { PointerTracker, rAFThrottle } from '../src/core/interaction.js';

describe('BtnCraft V2 — New Animations & Interaction Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('rAFThrottle coalesces multiple rapid calls into one frame', () => {
    const callback = vi.fn();
    let frameId = 1;
    vi.stubGlobal('requestAnimationFrame', (fn) => {
      setTimeout(fn, 16);
      return frameId++;
    });
    vi.stubGlobal('cancelAnimationFrame', (id) => clearTimeout(id));

    const throttled = rAFThrottle(callback);

    throttled(1);
    throttled(2);
    throttled(3);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(20);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(3);
  });

  it('registers all 30 built-in animations in the registry', () => {
    const names = BtnCraft.getAnimations();
    expect(names.length).toBeGreaterThanOrEqual(30);

    const v2New = [
      'particle-burst',
      'circular-reveal',
      'text-scramble',
      'click-shockwave',
      'neon-border-pulse',
      'elastic-stretch',
      'magnetic-snap',
      'flip-button',
      'liquid-morph',
      'elastic-border'
    ];

    for (const name of v2New) {
      expect(BtnCraft.hasAnimation(name)).toBe(true);
    }
  });

  it('sets up Particle Burst and emits particles on pointerdown', () => {
    document.body.innerHTML = `<button id="btn">Burst Me</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'particle-burst', particleCount: 8 });
    const el = document.getElementById('btn');

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, clientY: 50 }));

    const particles = el.querySelectorAll('.bc-burst-particle');
    expect(particles.length).toBe(8);

    btn.destroy();
  });

  it('sets up Circular Reveal and positions curtain', () => {
    document.body.innerHTML = `<button id="btn">Reveal</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'circular-reveal' });
    const el = document.getElementById('btn');

    const curtain = el.querySelector('.bc-reveal-curtain');
    expect(curtain).not.toBeNull();

    el.dispatchEvent(new PointerEvent('pointerenter', { clientX: 50, clientY: 20 }));

    btn.destroy();
    expect(el.querySelector('.bc-reveal-curtain')).toBeNull();
  });

  it('sets up Text Scramble on hover', () => {
    document.body.innerHTML = `<button id="btn">Matrix</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'text-scramble' });
    const el = document.getElementById('btn');

    el.dispatchEvent(new MouseEvent('mouseenter'));

    btn.destroy();
    expect(el.textContent).toBe('Matrix');
  });

  it('sets up Click Shockwave and injects shockwave ring on pointerdown', () => {
    document.body.innerHTML = `<button id="btn">Shockwave</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'click-shockwave' });
    const el = document.getElementById('btn');

    el.dispatchEvent(new PointerEvent('pointerdown', { clientX: 60, clientY: 25 }));
    expect(el.querySelector('.bc-shockwave-ring')).not.toBeNull();

    btn.destroy();
  });

  it('sets up Neon Border Pulse with concentric rings', () => {
    document.body.innerHTML = `<button id="btn">Neon Pulse</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'neon-border-pulse', pulseColor: '#00ffcc' });
    const el = document.getElementById('btn');

    const rings = el.querySelectorAll('.bc-neon-ring');
    expect(rings.length).toBe(2);
    expect(rings[0].style.borderColor).toBe('rgb(0, 255, 204)');

    btn.destroy();
    expect(el.querySelectorAll('.bc-neon-ring').length).toBe(0);
  });

  it('sets up Elastic Stretch and transforms on down/up', () => {
    document.body.innerHTML = `<button id="btn">Stretch</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'elastic-stretch' });
    const el = document.getElementById('btn');

    el.dispatchEvent(new PointerEvent('pointerdown'));
    expect(el.style.transform).toContain('scale3d');

    el.dispatchEvent(new PointerEvent('pointerup'));
    expect(el.style.transform).toBe('scale3d(1, 1, 1)');

    btn.destroy();
  });

  it('sets up Magnetic Snap on pointer tracking', () => {
    document.body.innerHTML = `<button id="btn">Snap</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'magnetic-snap' });
    const el = document.getElementById('btn');

    expect(el.classList.contains('bc-anim-magnetic-snap')).toBe(true);
    btn.destroy();
  });

  it('sets up Flip Button with 3D front and back faces', () => {
    document.body.innerHTML = `<button id="btn">Front Action</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'flip-button', backText: 'Are you sure?' });
    const el = document.getElementById('btn');

    expect(el.querySelector('.bc-flip-front')).not.toBeNull();
    const back = el.querySelector('.bc-flip-back');
    expect(back).not.toBeNull();
    expect(back.textContent).toBe('Are you sure?');

    btn.destroy();
    expect(el.textContent).toBe('Front Action');
  });

  it('sets up Liquid Morph with injected morphing blob', () => {
    document.body.innerHTML = `<button id="btn">Liquid Morph</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'liquid-morph' });
    const el = document.getElementById('btn');

    expect(el.querySelector('.bc-liquid-blob')).not.toBeNull();

    btn.destroy();
    expect(el.querySelector('.bc-liquid-blob')).toBeNull();
  });

  it('sets up Elastic Border and updates border-radius on hover', () => {
    document.body.innerHTML = `<button id="btn">Jelly</button>`;
    const btn = BtnCraft.create('#btn', { animation: 'elastic-border', borderRadius: '24px 6px' });
    const el = document.getElementById('btn');

    el.dispatchEvent(new MouseEvent('mouseenter'));
    expect(el.style.borderRadius).toBe('24px 6px');

    el.dispatchEvent(new MouseEvent('mouseleave'));
    expect(el.style.borderRadius).toBe('');

    btn.destroy();
  });
});
