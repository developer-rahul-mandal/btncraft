// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import BtnCraft from '../src/index.js';
import { formatUnit, parseDataAttributes, resolveOptions, getCssVariables } from '../src/utils/options.js';

describe('BtnCraft options and customization', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('formatUnit correctly adds units to numbers or strings', () => {
    expect(formatUnit(12, 'px')).toBe('12px');
    expect(formatUnit('12', 'px')).toBe('12px');
    expect(formatUnit('12px', 'px')).toBe('12px');
    expect(formatUnit(350, 'ms')).toBe('350ms');
    expect(formatUnit('0.5s', 'ms')).toBe('0.5s');
    expect(formatUnit(undefined, 'px')).toBeUndefined();
    expect(formatUnit(null, 'px')).toBeUndefined();
    expect(formatUnit('', 'px')).toBeUndefined();
  });

  it('parses data attributes correctly from button element', () => {
    document.body.innerHTML = `
      <button
        id="btn"
        data-btncraft="glow"
        data-color="#8b5cf6"
        data-text-color="#ffffff"
        data-border-color="#a78bfa"
        data-radius="14"
        data-duration="400"
        data-size="lg"
        data-variant="gradient"
        data-intensity="1.2"
        data-padding-x="24"
        data-padding-y="12"
        data-font-size="16">
        Click
      </button>
    `;

    const button = document.getElementById('btn');
    const parsed = parseDataAttributes(button);

    expect(parsed.animation).toBe('glow');
    expect(parsed.color).toBe('#8b5cf6');
    expect(parsed.textColor).toBe('#ffffff');
    expect(parsed.borderColor).toBe('#a78bfa');
    expect(parsed.radius).toBe('14');
    expect(parsed.duration).toBe('400');
    expect(parsed.size).toBe('lg');
    expect(parsed.variant).toBe('gradient');
    expect(parsed.glowIntensity).toBe('1.2');
    expect(parsed.paddingX).toBe('24');
    expect(parsed.paddingY).toBe('12');
    expect(parsed.fontSize).toBe('16');
  });

  it('merges JS options with data attributes giving precedence to JS options', () => {
    document.body.innerHTML = `
      <button id="btn" data-btncraft="glow" data-color="#8b5cf6" data-radius="8">Click</button>
    `;

    const button = document.getElementById('btn');
    const resolved = resolveOptions(button, {
      color: '#ef4444', // overrides data-color
      duration: 250
    });

    expect(resolved.animation).toBe('glow');
    expect(resolved.color).toBe('#ef4444');
    expect(resolved.radius).toBe('8');
    expect(resolved.duration).toBe(250);
  });

  it('maps options to CSS custom properties correctly', () => {
    const cssVars = getCssVariables({
      color: '#3b82f6',
      textColor: '#ffffff',
      borderColor: '#60a5fa',
      radius: 12,
      duration: 350,
      glowIntensity: 0.8,
      shadow: '0 4px 6px rgba(0,0,0,0.1)',
      paddingX: 20,
      paddingY: 10,
      fontSize: 15
    });

    expect(cssVars['--bc-bg']).toBe('#3b82f6');
    expect(cssVars['--bc-color']).toBe('#ffffff');
    expect(cssVars['--bc-border']).toBe('#60a5fa');
    expect(cssVars['--bc-radius']).toBe('12px');
    expect(cssVars['--bc-duration']).toBe('350ms');
    expect(cssVars['--bc-glow-intensity']).toBe('0.8');
    expect(cssVars['--bc-shadow']).toBe('0 4px 6px rgba(0,0,0,0.1)');
    expect(cssVars['--bc-padding-x']).toBe('20px');
    expect(cssVars['--bc-padding-y']).toBe('10px');
    expect(cssVars['--bc-font-size']).toBe('15px');
  });

  it('handles pill and square radius shapes', () => {
    const pillVars = getCssVariables({ radius: 'pill' });
    expect(pillVars['--bc-radius']).toBe('9999px');

    const squareVars = getCssVariables({ radius: 'square' });
    expect(squareVars['--bc-radius']).toBe('0px');
  });

  it('respects prefers-reduced-motion in interactive animations', () => {
    // Mock matchMedia for reduced motion
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    const btn = document.createElement('button');
    document.body.appendChild(btn);

    // Magnetic hover should not apply transform when reduced motion is preferred
    const inst = BtnCraft.create(btn, { animation: 'magnetic-hover' });
    btn.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
    expect(btn.style.transform).toBe('');

    inst.destroy();
    window.matchMedia = originalMatchMedia;
  });
});
