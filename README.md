# BtnCraft V2

> Production-ready, lightweight, zero-dependency vanilla JavaScript animated button and interaction library with 30 micro-interactions, advanced state engine, icon transitions, and accessible button groups.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)]()
[![Bundle Size](https://img.shields.io/badge/gzipped-<12kB-brightgreen.svg)]()
[![TypeScript Supported](https://img.shields.io/badge/TypeScript-Ready-blue.svg)]()
[![Test Suite](https://img.shields.io/badge/tests-102%20passing-brightgreen.svg)]()

BtnCraft makes it effortless to create delightful micro-interactions, responsive physics effects, async state feedback, and accessible toggle controls on any website or web application with zero framework lock-in.

---

## What's New in V2.0.0

- **Advanced Button State Engine**: Seamlessly transition buttons through `default`, `loading`, `success`, `error`, `disabled`, and `focus` states with automatic timers and duplicate submission guards.
- **Async Execution Runner**: `button.execute(async () => ...)` coordinates loading spinners, success checkmarks, error shakes, and automatic state restoration in one line of code.
- **Icon & Content Animation System**: Reusable micro-utilities for icon rotation, directional icon sliding, arrow reveal on hover, animated text swapping (`fade`, `slide-up`, `slide-down`), and icon-to-spinner morphing with zero external icon dependencies.
- **10 New Genuine Animations (30 Total)**: Particle Burst, Circular Reveal, Text Scramble, Click Shockwave, Neon Border Pulse, Elastic Stretch, Magnetic Snap, Flip Button, Liquid Morph, and Elastic Border.
- **Button Groups & Segmented Controls**: First-class `BtnCraft.group()` utility supporting accessible single-selection (`role="radiogroup"`), multi-selection toggles (`role="group"`), segmented pill controls, roving tabindex, and full keyboard arrow navigation (ArrowLeft, ArrowRight, Home, End).
- **High-Performance Interaction Engine**: `requestAnimationFrame` scheduled pointer tracking with cached bounding client rectangles to eliminate layout thrashing during mouse and touch gestures.
- **Extensible Plugin Registry**: `BtnCraft.register()` and `BtnCraft.unregister()` with duplicate detection, plugin lifecycle hooks (`beforeSetup`, `afterTeardown`), and alias management.
- **Full CommonJS & ESM & UMD Distribution**: Complete dual export support for Node.js (`require('btncraft')`), ES Modules (`import BtnCraft from 'btncraft'`), and script tag CDNs (`dist/btncraft.umd.js`).
- **100% Backwards Compatible**: Existing V1 APIs (`create`, `init`, `destroy`, `setLoading`, `initBtnCraft`) continue to work without changes.

---

## Installation

### 1. NPM Package Manager

```bash
npm install btncraft
```

### 2. CDN (Zero Install, Direct in HTML)

BtnCraft is available on global CDNs (**jsDelivr**, **unpkg**, and **esm.sh**):

#### Via jsDelivr:
```html
<!-- Stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/btncraft@2.0.0/dist/btncraft.css">

<!-- UMD Script (defines window.BtnCraft) -->
<script src="https://cdn.jsdelivr.net/npm/btncraft@2.0.0/dist/btncraft.umd.js"></script>

<!-- Or ES Module: -->
<script type="module">
  import BtnCraft from 'https://cdn.jsdelivr.net/npm/btncraft@2.0.0/dist/btncraft.es.js';
  BtnCraft.init();
</script>
```

#### Via unpkg:
```html
<link rel="stylesheet" href="https://unpkg.com/btncraft@2.0.0/dist/btncraft.css">
<script src="https://unpkg.com/btncraft@2.0.0/dist/btncraft.umd.js"></script>
```

---

## Quick Start

### 1. JavaScript API

Import `BtnCraft` and its stylesheet:

```javascript
import BtnCraft from 'btncraft';
import 'btncraft/style.css';

// Enhance a single button
const button = BtnCraft.create('#submit-btn', {
  animation: 'particle-burst',
  variant: 'gradient',
  color: '#8b5cf6',
  radius: 12,
  duration: 300
});
```

### 2. Declarative HTML API

Add `data-btncraft` and data attributes directly to your HTML:

```html
<button
  data-btncraft="neon-glow"
  data-color="#8b5cf6"
  data-radius="pill"
  data-variant="primary">
  Explore
</button>
```

Initialize all marked buttons with one call:

```javascript
import BtnCraft from 'btncraft';
import 'btncraft/style.css';

BtnCraft.init();
```

---

## Advanced Button State Engine

BtnCraft V2 introduces a state-management engine for async actions and feedback:

```javascript
const button = BtnCraft.create('#save-btn');

// Manual state transitions
button.loading(true);               // Shows spinner, disables button, prevents clicks
button.success({ text: 'Saved!' }); // Injects checkmark, applies success green, auto-resets after 2s
button.error({ text: 'Failed!' });  // Shakes button, shows error cross, auto-resets after 2.5s
button.reset();                     // Instantly restores original text, state, and attributes
```

### Automatic Async Execution Runner

Coordinate entire async operations in a single call:

```javascript
await button.execute(async () => {
  const response = await fetch('/api/checkout', { method: 'POST' });
  if (!response.ok) throw new Error('Payment declined');
  return response.json();
}, {
  loadingText: 'Processing order...',
  successText: 'Order Confirmed!',
  errorText: 'Payment Failed',
  timeout: 2500
});
```

### State Event Listeners

```javascript
button.on('statechange', ({ state, prevState }) => {
  console.log(`Button state changed from ${prevState} to ${state}`);
});

button.on('success', () => {
  analytics.track('form_saved');
});
```

---

## Icon & Content Animation System

Add micro-interactions to icons and text without relying on an icon library:

```javascript
const btn = BtnCraft.create('#action-btn');

// Rotate icon on hover (embedded SVG or font icon)
btn.rotateIcon({ angle: 90, duration: 250 });

// Directional slide
btn.slideIcon({ direction: 'right', distance: 6 });

// Reveal trailing arrow on hover
btn.revealArrow();

// Morph icon into spinner
btn.iconToSpinner(true);

// Animated text transition (fade, slide-up, slide-down)
btn.setText('Copied to Clipboard!', { transition: 'slide-up', duration: 200 });
```

---

## Button Groups & Segmented Controls

BtnCraft V2 includes accessible group utilities with full keyboard navigation and ARIA semantics:

### Segmented Control
```html
<div id="view-mode">
  <button data-value="grid">Grid</button>
  <button data-value="list">List</button>
  <button data-value="calendar">Calendar</button>
</div>
```

```javascript
import { group } from 'btncraft';

const control = group('#view-mode', {
  type: 'segmented',
  defaultValue: 'grid',
  onChange: (value, button) => {
    console.log('Active view:', value);
  }
});

// Arrow navigation: ArrowLeft / ArrowRight / ArrowUp / ArrowDown / Home / End
// Programmatic selection:
control.setValue('calendar');
console.log(control.getValue()); // 'calendar'

// Cleanup
control.destroy();
```

### Multi-Selection Toggle Group
```javascript
const formatGroup = group('#text-formatting', {
  type: 'multiple',
  defaultValue: ['bold'],
  onChange: (values) => {
    console.log('Selected styles:', credentials); // ['bold', 'italic']
  }
});
```

---

## Complete 30 Animation Catalog

BtnCraft includes 30 micro-interaction effects:

| # | Animation | Identifier / Aliases | Description |
|---|-----------|----------------------|-------------|
| 1 | **Gradient Shift** | `'gradient-shift'`, `'gradient'` | Smoothly shifting multi-stop animated gradient background |
| 2 | **Neon Glow** | `'neon-glow'`, `'glow'` | Layered radiant cyber neon glow with hover & focus bloom |
| 3 | **Border Runner** | `'border-runner'`, `'border'` | Perimeter light beam continuously orbiting the button border |
| 4 | **Liquid Fill** | `'liquid-fill'`, `'liquid'` | Sinusoidal organic liquid wave rising from bottom on hover |
| 5 | **Magnetic Hover** | `'magnetic-hover'`, `'magnetic'` | Physics-based cursor attraction pulling the button toward pointer |
| 6 | **3D Press** | `'3d-press'`, `'3d'` | Mechanical bevel depth shadow that realistically depresses |
| 7 | **Ripple Click** | `'ripple-click'`, `'ripple'` | Expanding circular wave originating at exact click coordinates |
| 8 | **Shimmer** | `'shimmer'` | High-gloss pearlescent sheen sweeping diagonally across surface |
| 9 | **Spotlight** | `'spotlight'`, `'flashlight'` | Radial flashlight illumination tracking mouse within button bounds |
| 10 | **Pulse Glow** | `'pulse-glow'`, `'pulse'` | Rhythmic breathing radiant halo ring expanding outwards |
| 11 | **Sliding Background** | `'sliding-bg'`, `'slide'` | Smooth background sheet sliding in from specified direction |
| 12 | **Glitch** | `'glitch'` | Cyberpunk RGB chromatic aberration split with subtle jitter |
| 13 | **Rainbow Border** | `'rainbow-border'`, `'rainbow'` | Rotating 360-degree rainbow spectrum border |
| 14 | **Expand Hover** | `'expand-hover'`, `'expand'` | Elastic scale expansion, elevated depth, and widened letter-spacing |
| 15 | **Rotating Icon** | `'rotating-icon'`, `'rotate-icon'` | Smooth rotational transform on hover for embedded or injected icons |
| 16 | **Gradient Border** | `'gradient-border'` | Dual-layer button with shifting perimeter gradient and solid core |
| 17 | **Bounce** | `'bounce'` | Elastic jelly squash-and-stretch bounce on hover and click |
| 18 | **Loading State** | `'loading-state'`, `'loading'` | Accessible loading spinner with `aria-busy` and disabled states |
| 19 | **Shine Sweep** | `'shine-sweep'`, `'shine'` | Sharp 45-degree specular highlight beam flashing across on hover |
| 20 | **Floating Effect** | `'floating-effect'`, `'float'` | Continuous gentle levitation with oscillating soft drop shadow |
| 21 | **Particle Burst** | `'particle-burst'`, `'particles'` | Radial shower of animated sparks/confetti bursting on click |
| 22 | **Circular Reveal** | `'circular-reveal'`, `'circle-reveal'` | Expanding radial color flood originating from cursor entry point |
| 23 | **Text Scramble** | `'text-scramble'`, `'scramble'` | Matrix-style character scrambling resolving into button label |
| 24 | **Click Shockwave** | `'click-shockwave'`, `'shockwave'` | Expanding high-velocity sonic shockwave ring emanating on click |
| 25 | **Neon Border Pulse** | `'neon-border-pulse'`, `'border-pulse'`| Rhythmic perimeter neon stroke flash and dissipation |
| 26 | **Elastic Stretch** | `'elastic-stretch'`, `'stretch'` | Directional squash-and-stretch physics tracking cursor momentum |
| 27 | **Magnetic Snap** | `'magnetic-snap'`, `'snap'` | Spring-loaded attraction snapping into position with elastic bounce |
| 28 | **Flip Button** | `'flip-button'`, `'flip'` | 3D card flip transition revealing an alternate rear face |
| 29 | **Liquid Morph** | `'liquid-morph'`, `'blob'` | Organic oscillating fluid border-radius deformation |
| 30 | **Elastic Border** | `'elastic-border'` | Morphing SVG perimeter stroke responding dynamically to hover |

---

## Plugin Architecture

Register custom animations with lifecycle hooks and clean teardown:

```javascript
import BtnCraft from 'btncraft';

// Register custom effect
BtnCraft.register('matrix-rain', {
  beforeSetup(element, options) {
    // Optional pre-initialization hook
  },
  setup(element, options, cleanup) {
    element.classList.add('my-matrix-style');

    // Return teardown callback
    return () => {
      element.classList.remove('my-matrix-style');
    };
  },
  afterTeardown(element, options) {
    // Optional post-cleanup hook
  }
}, ['matrix', 'rain']);

// Use the custom effect
const btn = BtnCraft.create('#matrix-btn', { animation: 'matrix' });

// Unregister when no longer needed
BtnCraft.unregister('matrix-rain');
```

---

## Customization Options

```javascript
BtnCraft.create('#action-btn', {
  animation: 'particle-burst',
  variant: 'gradient',
  color: '#3b82f6',
  textColor: '#ffffff',
  borderColor: '#60a5fa',
  radius: 12,              // 'pill', 'square', or number in px
  size: 'lg',              // 'sm', 'md', 'lg'
  duration: 350,           // Number (ms) or string ('0.35s')
  glowIntensity: 1.2,
  shadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
  paddingX: 24,
  paddingY: 12,
  fontSize: 16
});
```

### CSS Custom Properties

```css
.my-custom-button {
  --bc-bg: #8b5cf6;
  --bc-color: #ffffff;
  --bc-border: #a78bfa;
  --bc-radius: 12px;
  --bc-padding-x: 20px;
  --bc-padding-y: 10px;
  --bc-font-size: 15px;
  --bc-duration: 250ms;
  --bc-focus: #c4b5fd;
  --bc-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
}
```

---

## TypeScript Support

Full TypeScript typings are included out of the box:

```typescript
import { BtnCraft, BtnCraftInstance, BtnCraftGroup, BuiltinAnimation } from 'btncraft';

const anim: BuiltinAnimation = 'particle-burst';
const btn: BtnCraftInstance = BtnCraft.create('#btn', { animation: anim })!;

await btn.execute(async () => {
  return 'ok';
});
```

---

## Migration Guide: V1 to V2

BtnCraft V2 is designed to be **100% backwards-compatible** with V1 code:

1. **CommonJS**: You can now `const { BtnCraft } = require('btncraft');` in Node.js environments without module resolution errors.
2. **State Management**: While `BtnCraft.setLoading(btn, true)` remains fully supported, consider upgrading to the new state methods:
   - *V1*: `BtnCraft.setLoading(btn, true)` / `BtnCraft.setLoading(btn, false)`
   - *V2*: `button.loading(true)` / `button.success({ text: 'Saved!' })` / `button.execute(async () => ...)`
3. **Animations**: All 20 original animation names and aliases continue to function identically. 10 new animation names (`'particle-burst'`, `'circular-reveal'`, etc.) are now available.
4. **Button Groups**: Instead of implementing custom radio buttons, use `BtnCraft.group(container, { type: 'segmented' })`.

---

## Browser Support

BtnCraft supports all modern evergreen browsers (Chrome, Edge, Firefox, Safari, iOS Safari, Android Chrome). It strictly adheres to W3C standards and respects `prefers-reduced-motion` settings.

---

## License

[MIT](LICENSE) © BtnCraft Authors
