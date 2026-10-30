// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { registry } from '../src/index.js';

describe('BtnCraft Animation Collection', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('registers at least 20 genuinely different animations in registry', () => {
    const names = BtnCraft.getAnimations();
    expect(names.length).toBeGreaterThanOrEqual(20);

    const required = [
      'gradient-shift',
      'neon-glow',
      'border-runner',
      'liquid-fill',
      'magnetic-hover',
      '3d-press',
      'ripple-click',
      'shimmer',
      'spotlight',
      'pulse-glow',
      'sliding-bg',
      'glitch',
      'rainbow-border',
      'expand-hover',
      'rotating-icon',
      'gradient-border',
      'bounce',
      'loading-state',
      'shineSweep', // or shine-sweep
      'floating-effect'
    ];

    for (const req of required) {
      expect(BtnCraft.hasAnimation(req)).toBe(true);
    }
  });

  it('resolves animation aliases correctly', () => {
    const aliasesToTest = [
      ['glow', 'neon-glow'],
      ['gradient', 'gradient-shift'],
      ['border', 'border-runner'],
      ['liquid', 'liquid-fill'],
      ['magnetic', 'magnetic-hover'],
      ['3d', '3d-press'],
      ['ripple', 'ripple-click'],
      ['pulse', 'pulse-glow'],
      ['slide', 'sliding-bg'],
      ['float', 'floating-effect']
    ];

    for (const [alias, canonical] of aliasesToTest) {
      const def = registry.get(alias);
      expect(def).not.toBeNull();
      expect(def.name).toBe(canonical);
    }
  });

  it('sets up 1. Gradient Shift correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'gradient-shift', color: '#ff0055' });
    expect(btn.classList.contains('bc-anim-gradient-shift')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-gradient-bg')).toContain('#ff0055');
    inst.destroy();
  });

  it('sets up 2. Neon Glow correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'neon-glow', color: '#00ffcc', glowIntensity: 1.5 });
    expect(btn.classList.contains('bc-anim-neon-glow')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-neon-color')).toBe('#00ffcc');
    expect(btn.style.getPropertyValue('--bc-glow-intensity')).toBe('1.5');
    inst.destroy();
  });

  it('sets up 3. Border Runner correctly (injects beam)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'border-runner' });
    expect(btn.classList.contains('bc-anim-border-runner')).toBe(true);
    const beam = btn.querySelector('.bc-runner-beam');
    expect(beam).not.toBeNull();
    expect(beam.getAttribute('aria-hidden')).toBe('true');

    inst.destroy();
    expect(btn.querySelector('.bc-runner-beam')).toBeNull();
  });

  it('sets up 4. Liquid Fill correctly (injects liquid wave)', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Submit';
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'liquid-fill', liquidColor: '#3b82f6' });
    expect(btn.classList.contains('bc-anim-liquid-fill')).toBe(true);
    const wave = btn.querySelector('.bc-liquid-wave');
    expect(wave).not.toBeNull();
    expect(btn.style.getPropertyValue('--bc-liquid-color')).toBe('#3b82f6');

    inst.destroy();
    expect(btn.querySelector('.bc-liquid-wave')).toBeNull();
  });

  it('sets up 5. Magnetic Hover correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'magnetic-hover', strength: 0.3 });
    expect(btn.classList.contains('bc-anim-magnetic-hover')).toBe(true);

    // Simulate mouse move
    btn.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    expect(btn.style.transform).toBeDefined();

    // Mouse leave resets
    btn.dispatchEvent(new MouseEvent('mouseleave'));
    expect(btn.style.transform).toBe('translate3d(0, 0, 0)');

    inst.destroy();
    expect(btn.style.transform).toBe('');
  });

  it('sets up 6. 3D Press correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: '3d-press', depthColor: '#1e293b' });
    expect(btn.classList.contains('bc-anim-3d-press')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-3d-depth')).toBe('#1e293b');
    inst.destroy();
  });

  it('sets up 7. Ripple Click correctly (spawns ripple wave on pointerdown)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'ripple-click' });
    expect(btn.classList.contains('bc-anim-ripple-click')).toBe(true);

    btn.dispatchEvent(new MouseEvent('pointerdown', { clientX: 20, clientY: 20 }));
    const ripple = btn.querySelector('.bc-ripple-wave');
    expect(ripple).not.toBeNull();

    inst.destroy();
  });

  it('sets up 8. Shimmer correctly (injects sweep overlay)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'shimmer' });
    expect(btn.classList.contains('bc-anim-shimmer')).toBe(true);
    const sweep = btn.querySelector('.bc-shimmer-sweep');
    expect(sweep).not.toBeNull();

    inst.destroy();
    expect(btn.querySelector('.bc-shimmer-sweep')).toBeNull();
  });

  it('sets up 9. Spotlight correctly (tracks coordinates)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'spotlight' });
    expect(btn.classList.contains('bc-anim-spotlight')).toBe(true);

    btn.dispatchEvent(new MouseEvent('mousemove', { clientX: 45, clientY: 30 }));
    expect(btn.style.getPropertyValue('--bc-spot-opacity')).toBe('1');

    btn.dispatchEvent(new MouseEvent('mouseleave'));
    expect(btn.style.getPropertyValue('--bc-spot-opacity')).toBe('0');

    inst.destroy();
  });

  it('sets up 10. Pulse Glow correctly (injects halo)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'pulse-glow', pulseColor: '#ec4899' });
    expect(btn.classList.contains('bc-anim-pulse-glow')).toBe(true);
    const halo = btn.querySelector('.bc-pulse-halo');
    expect(halo).not.toBeNull();
    expect(btn.style.getPropertyValue('--bc-pulse-color')).toBe('#ec4899');

    inst.destroy();
    expect(btn.querySelector('.bc-pulse-halo')).toBeNull();
  });

  it('sets up 11. Sliding Background correctly (injects slide sheet)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'sliding-bg', slideColor: '#10b981', slideDirection: 'top' });
    expect(btn.classList.contains('bc-anim-sliding-bg')).toBe(true);
    expect(btn.getAttribute('data-slide-dir')).toBe('top');
    const sheet = btn.querySelector('.bc-slide-sheet');
    expect(sheet).not.toBeNull();
    expect(btn.style.getPropertyValue('--bc-slide-color')).toBe('#10b981');

    inst.destroy();
    expect(btn.querySelector('.bc-slide-sheet')).toBeNull();
    expect(btn.hasAttribute('data-slide-dir')).toBe(false);
  });

  it('sets up 12. Glitch correctly (sets data-text)', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Cyberpunk';
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'glitch' });
    expect(btn.classList.contains('bc-anim-glitch')).toBe(true);
    expect(btn.getAttribute('data-text')).toBe('Cyberpunk');

    inst.destroy();
    expect(btn.hasAttribute('data-text')).toBe(false);
  });

  it('sets up 13. Rainbow Border correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'rainbow-border', borderWidth: '3px' });
    expect(btn.classList.contains('bc-anim-rainbow-border')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-rainbow-width')).toBe('3px');
    inst.destroy();
  });

  it('sets up 14. Expand Hover correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'expand-hover', expandScale: '1.08' });
    expect(btn.classList.contains('bc-anim-expand-hover')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-expand-scale')).toBe('1.08');
    inst.destroy();
  });

  it('sets up 15. Rotating Icon correctly (detects or injects icon)', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Next';
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'rotating-icon', rotateDeg: '180deg' });
    expect(btn.classList.contains('bc-anim-rotating-icon')).toBe(true);
    const icon = btn.querySelector('.bc-icon');
    expect(icon).not.toBeNull();
    expect(btn.style.getPropertyValue('--bc-rotate-deg')).toBe('180deg');

    inst.destroy();
    expect(btn.querySelector('.bc-icon')).toBeNull();
  });

  it('sets up 16. Gradient Border correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'gradient-border', borderWidth: '3px' });
    expect(btn.classList.contains('bc-anim-gradient-border')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-gradient-border-w')).toBe('3px');
    inst.destroy();
  });

  it('sets up 17. Bounce correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'bounce', bounceScale: '1.2' });
    expect(btn.classList.contains('bc-anim-bounce')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-bounce-scale')).toBe('1.2');
    inst.destroy();
  });

  it('sets up 18. Loading State correctly (with loading: true)', () => {
    const btn = document.createElement('button');
    btn.textContent = 'Pay Now';
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'loading-state', loading: true, loadingText: 'Processing' });
    expect(btn.classList.contains('bc-anim-loading-state')).toBe(true);
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBe('Processing');
    expect(btn.querySelector('.bc-spinner')).not.toBeNull();

    inst.destroy();
    expect(btn.disabled).toBe(false);
    expect(btn.querySelector('.bc-spinner')).toBeNull();
  });

  it('sets up 19. Shine Sweep correctly (injects shine beam)', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'shine-sweep' });
    expect(btn.classList.contains('bc-anim-shine-sweep')).toBe(true);
    const shine = btn.querySelector('.bc-shine-beam');
    expect(shine).not.toBeNull();

    inst.destroy();
    expect(btn.querySelector('.bc-shine-beam')).toBeNull();
  });

  it('sets up 20. Floating Effect correctly', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'floating-effect', floatDistance: '-10px' });
    expect(btn.classList.contains('bc-anim-floating-effect')).toBe(true);
    expect(btn.style.getPropertyValue('--bc-float-dist')).toBe('-10px');
    inst.destroy();
  });

  it('handles invalid animation names without crashing and warns', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'non-existent-effect' });
    expect(inst).toBeDefined();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown animation: "non-existent-effect"'));

    inst.destroy();
    warnSpy.mockRestore();
  });

  it('allows registering custom animations via BtnCraft.register()', () => {
    const setupSpy = vi.fn((el, opts, cleanup) => {
      el.classList.add('custom-applied');
      return () => el.classList.remove('custom-applied');
    });

    BtnCraft.register('my-custom-anim', {
      setup: setupSpy
    }, ['customAnim']);

    expect(BtnCraft.hasAnimation('my-custom-anim')).toBe(true);
    expect(BtnCraft.hasAnimation('customAnim')).toBe(true);

    const btn = document.createElement('button');
    document.body.appendChild(btn);

    const inst = BtnCraft.create(btn, { animation: 'customAnim' });
    expect(setupSpy).toHaveBeenCalled();
    expect(btn.classList.contains('custom-applied')).toBe(true);

    inst.destroy();
    expect(btn.classList.contains('custom-applied')).toBe(false);
  });
});
