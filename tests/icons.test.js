// @vitest-environment jsdom

import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import BtnCraft, { icons, ICONS } from '../src/index.js';

describe('BtnCraft V2 — Icon & Content Animation System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('creates standalone animated glyphs (checkmark, error cross, spinner)', () => {
    const check = icons.createCheckmark({ size: 20, color: '#10b981' });
    expect(check.querySelector('svg')).not.toBeNull();
    expect(check.style.color).toBe('rgb(16, 185, 129)');
    expect(check.querySelector('svg').getAttribute('width')).toBe('20');

    const err = icons.createErrorCross({ size: 18, color: '#ef4444' });
    expect(err.querySelector('svg')).not.toBeNull();
    expect(err.style.color).toBe('rgb(239, 68, 68)');
    expect(err.querySelector('svg').getAttribute('width')).toBe('18');

    const spin = icons.createSpinner({ size: 14 });
    expect(spin.querySelector('svg')).not.toBeNull();
    expect(spin.querySelector('.bc-spinner')).not.toBeNull();
  });

  it('rotates icon on hover and restores on leave', () => {
    document.body.innerHTML = `<button id="btn"><span>Next</span><svg class="bc-icon" width="16" height="16"></svg></button>`;
    const btn = BtnCraft.create('#btn');
    btn.rotateIcon({ deg: 180 });

    const el = document.getElementById('btn');
    const icon = el.querySelector('.bc-icon');

    el.dispatchEvent(new MouseEvent('mouseenter'));
    expect(icon.style.transform).toBe('rotate(180deg)');

    el.dispatchEvent(new MouseEvent('mouseleave'));
    expect(icon.style.transform).toBe('rotate(0deg)');

    btn.destroy();
    expect(icon.style.transform).toBe('');
  });

  it('slides icon horizontally on hover', () => {
    document.body.innerHTML = `<button id="btn"><span>Explore</span><svg class="bc-icon"></svg></button>`;
    const btn = BtnCraft.create('#btn');
    btn.slideIcon({ direction: 'right', distance: 6 });

    const el = document.getElementById('btn');
    const icon = el.querySelector('.bc-icon');

    el.dispatchEvent(new MouseEvent('mouseenter'));
    expect(icon.style.transform).toBe('translateX(6px)');

    el.dispatchEvent(new MouseEvent('mouseleave'));
    expect(icon.style.transform).toBe('translate3d(0, 0, 0)');

    btn.destroy();
  });

  it('reveals arrow on hover', () => {
    document.body.innerHTML = `<button id="btn">Learn More</button>`;
    const btn = BtnCraft.create('#btn');
    btn.revealArrow({ direction: 'right' });

    const el = document.getElementById('btn');
    const arrow = el.querySelector('.bc-arrow-reveal');
    expect(arrow).not.toBeNull();
    expect(arrow.style.opacity).toBe('0');

    el.dispatchEvent(new MouseEvent('mouseenter'));
    expect(arrow.style.opacity).toBe('1');
    expect(arrow.style.transform).toBe('translateX(0)');

    el.dispatchEvent(new MouseEvent('mouseleave'));
    expect(arrow.style.opacity).toBe('0');

    btn.destroy();
    expect(el.querySelector('.bc-arrow-reveal')).toBeNull();
  });

  it('replaces icon with smooth scale/fade transition', () => {
    document.body.innerHTML = `<button id="btn"><span class="bc-icon">Old</span><span>Text</span></button>`;
    const el = document.getElementById('btn');

    icons.replaceIcon(el, '<svg class="new-svg"></svg>', { duration: 100 });

    vi.advanceTimersByTime(100);

    expect(el.querySelector('.new-svg')).not.toBeNull();
    expect(el.textContent).not.toContain('Old');
  });

  it('transitions text smoothly with fade', () => {
    document.body.innerHTML = `<button id="btn">Initial Text</button>`;
    const btn = BtnCraft.create('#btn');

    btn.setText('Updated Text', { transition: 'fade', duration: 100 });

    const el = document.getElementById('btn');
    const wrapper = el.querySelector('.bc-text-wrapper');
    expect(wrapper).not.toBeNull();
    expect(wrapper.style.opacity).toBe('0');

    vi.advanceTimersByTime(50);
    expect(wrapper.textContent).toBe('Updated Text');
    expect(wrapper.style.opacity).toBe('1');

    btn.destroy();
  });

  it('morphs icon to spinner and restores back to icon', () => {
    document.body.innerHTML = `<button id="btn"><svg class="bc-icon" width="16"></svg><span>Click</span></button>`;
    const btn = BtnCraft.create('#btn');
    const el = document.getElementById('btn');
    const icon = el.querySelector('.bc-icon');

    btn.iconToSpinner(true);
    expect(icon.style.display).toBe('none');
    expect(el.querySelector('.bc-spinner')).not.toBeNull();

    btn.iconToSpinner(false);
    expect(icon.style.display).toBe('');
    expect(el.querySelector('.bc-spinner')).toBeNull();

    btn.destroy();
  });
});
