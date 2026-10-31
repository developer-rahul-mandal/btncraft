// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

describe('Package Architecture & Distribution', () => {
  it('exports valid ES Module with all expected exports', async () => {
    const esm = await import('../dist/btncraft.es.js');

    expect(esm.BtnCraft).toBeDefined();
    expect(esm.default).toBeDefined();
    expect(typeof esm.create).toBe('function');
    expect(typeof esm.init).toBe('function');
    expect(typeof esm.destroy).toBe('function');
    expect(typeof esm.getInstance).toBe('function');
    expect(typeof esm.setLoading).toBe('function');
    expect(esm.registry).toBeDefined();
    expect(Array.isArray(esm.allAnimations)).toBe(true);
  });

  it('exports valid CommonJS module with require() in Node.js', () => {
    const req = createRequire(import.meta.url);
    const cjs = req('../dist/btncraft.cjs');

    expect(cjs).toBeDefined();
    expect(typeof cjs.create).toBe('function');
    expect(typeof cjs.init).toBe('function');
    expect(typeof cjs.destroy).toBe('function');
    expect(cjs.BtnCraft).toBeDefined();
    expect(cjs.default).toBeDefined();
    expect(typeof cjs.BtnCraft.create).toBe('function');
  });

  it('builds valid UMD browser bundle that attaches to window in browser', () => {
    const umdPath = path.resolve(__dirname, '../dist/btncraft.umd.js');
    expect(fs.existsSync(umdPath)).toBe(true);

    const code = fs.readFileSync(umdPath, 'utf8');
    // Simulate browser script tag execution where exports/module are not present
    const runInBrowser = new Function('window', 'document', 'self', 'globalThis', code);
    const mockWindow = {};
    runInBrowser(mockWindow, document, mockWindow, mockWindow);

    expect(mockWindow.BtnCraft).toBeDefined();
    expect(typeof mockWindow.BtnCraft.create).toBe('function');
  });

  it('includes valid CSS stylesheet bundle', () => {
    const cssPath = path.resolve(__dirname, '../dist/btncraft.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const content = fs.readFileSync(cssPath, 'utf8');
    expect(content).toContain('.bc-btn');
    expect(content.length).toBeGreaterThan(1000);
  });

  it('includes valid TypeScript declaration file', () => {
    const dtsPath = path.resolve(__dirname, '../dist/index.d.ts');
    expect(fs.existsSync(dtsPath)).toBe(true);

    const content = fs.readFileSync(dtsPath, 'utf8');
    expect(content).toContain('export declare const BtnCraft');
    expect(content).toContain('BtnCraftOptions');
  });
});
