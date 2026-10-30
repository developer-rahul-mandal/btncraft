# BtnCraft

> Production-ready, lightweight, vanilla JavaScript animated button library with 20+ customizable effects.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg)]()
[![Bundle Size](https://img.shields.io/badge/gzipped-<6kB-brightgreen.svg)]()
[![TypeScript Supported](https://img.shields.io/badge/TypeScript-Ready-blue.svg)]()

BtnCraft makes it effortless to add responsive, animated buttons to any HTML website or web application with minimal setup and zero framework lock-in.

---

## Features

- **Framework-Agnostic**: Works with Vanilla JS, HTML, or inside React, Vue, Svelte, Astro, Angular, and Next.js.
- **20 Distinct Animations**: From subtle shimmers and 3D presses to magnetic hover physics and cyberpunk glitches.
- **Interactive Physics**: Mouse-tracking spotlight illumination, cursor-attraction magnetic pull, and click-coordinate ripples.
- **Accessible & Motion-Sensitive**: Strictly respects `prefers-reduced-motion`, includes accessible keyboard `:focus-visible` outlines and ARIA state handling.
- **Zero Runtime Dependencies**: Ultra-lightweight (~5.8 kB gzip).
- **Flexible Customization**: Configure via JavaScript options, HTML5 data attributes, or standard CSS custom properties.
- **Robust Lifecycle Management**: Comprehensive cleanup removing all injected elements, inline styles, and event listeners on `.destroy()`.
- **TypeScript Support**: Full `.d.ts` declaration files included out of the box.

---

## Installation

### 1. NPM Package Manager

```bash
npm install btncraft
```

### 2. CDN (Zero Install, Direct in HTML)

BtnCraft is hosted automatically on global CDNs (**jsDelivr**, **unpkg**, and **esm.sh**):

#### Via jsDelivr (Recommended for production):
```html
<!-- Stylesheet -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/btncraft@1.0.0/dist/btncraft.css">

<!-- UMD Script (defines window.BtnCraft) -->
<script src="https://cdn.jsdelivr.net/npm/btncraft@1.0.0/dist/btncraft.umd.js"></script>

<!-- Or ES Module: -->
<script type="module">
  import BtnCraft from 'https://cdn.jsdelivr.net/npm/btncraft@1.0.0/dist/btncraft.es.js';
  BtnCraft.init();
</script>
```

#### Via unpkg:
```html
<link rel="stylesheet" href="https://unpkg.com/btncraft@1.0.0/dist/btncraft.css">
<script src="https://unpkg.com/btncraft@1.0.0/dist/btncraft.umd.js"></script>
```

#### Via esm.sh:
```html
<link rel="stylesheet" href="https://esm.sh/btncraft@1.0.0/dist/btncraft.css">
<script type="module">
  import BtnCraft from 'https://esm.sh/btncraft@1.0.0';
  BtnCraft.init();
</script>
```

---

## Quick Start

### 1. JavaScript API

Import `BtnCraft` and its stylesheet:

```javascript
import BtnCraft from 'btncraft';
import 'btncraft/style.css';

// Enhance a single button
const button = BtnCraft.create('#myButton', {
  animation: 'neon-glow',
  variant: 'gradient',
  color: '#8b5cf6',
  radius: 12,
  duration: 300
});
```

### 2. Declarative HTML API

Add `data-btncraft` and data attributes directly to your HTML buttons:

```html
<button
  data-btncraft="glow"
  data-color="#8b5cf6"
  data-radius="pill"
  data-variant="primary">
  Click Me
</button>
```

Initialize all marked buttons with one call:

```javascript
import BtnCraft from 'btncraft';
import 'btncraft/style.css';

BtnCraft.init();
```

### 3. Multiple Buttons

Select multiple buttons using CSS selectors, `NodeList`, or arrays:

```javascript
const buttons = BtnCraft.create('.my-buttons', {
  animation: 'ripple'
});

// Clean up all buttons in the collection
buttons.destroy();
```

### 4. Cleanup & Lifecycle

```javascript
// Clean up a specific button by selector or element
BtnCraft.destroy('#myButton');

// Or destroy all active buttons globally
BtnCraft.destroy();
```

---

## Animation Collection

BtnCraft includes 20 genuinely different animations:

| # | Animation | Identifier / Aliases | Description |
|---|-----------|----------------------|-------------|
| 1 | **Gradient Shift** | `'gradient-shift'`, `'gradient'` | Smoothly shifting multi-stop animated gradient background |
| 2 | **Neon Glow** | `'neon-glow'`, `'glow'` | Layered radiant cyber neon glow with hover & focus bloom |
| 3 | **Border Runner** | `'border-runner'`, `'border'` | Perimeter light beam continuously orbiting the button border |
| 4 | **Liquid Fill** | `'liquid-fill'`, `'liquid'` | Sinusoidal organic liquid wave rising from bottom on hover |
| 5 | **Magnetic Hover** | `'magnetic-hover'`, `'magnetic'` | Physics-based attraction pulling the button toward the cursor |
| 6 | **3D Press** | `'3d-press'`, `'3d'` | Mechanical bevel depth shadow that realistically depresses on active |
| 7 | **Ripple Click** | `'ripple-click'`, `'ripple'` | Expanding circular wave originating at exact click coordinate |
| 8 | **Shimmer** | `'shimmer'` | High-gloss pearlescent sheen sweeping diagonally across surface |
| 9 | **Spotlight** | `'spotlight'` | Radial flashlight illumination tracking mouse within button bounds |
| 10 | **Pulse Glow** | `'pulse-glow'`, `'pulse'` | Rhythmic breathing radiant halo ring expanding outwards |
| 11 | **Sliding Background** | `'sliding-bg'`, `'slide'` | Smooth background sheet sliding in from left/top/right/bottom on hover |
| 12 | **Glitch** | `'glitch'` | Cyberpunk RGB chromatic aberration split with subtle jitter |
| 13 | **Rainbow Border** | `'rainbow-border'`, `'rainbow'` | Rotating 360-degree rainbow spectrum border |
| 14 | **Expand Hover** | `'expand-hover'`, `'expand'` | Elastic scale expansion, elevated depth, and widened letter-spacing |
| 15 | **Rotating Icon** | `'rotating-icon'`, `'rotate-icon'` | Smooth rotational transform on hover for embedded or auto-generated icons |
| 16 | **Gradient Border** | `'gradient-border'` | Dual-layer button with shifting perimeter gradient and solid core |
| 17 | **Bounce** | `'bounce'` | Elastic jelly squash-and-stretch bounce on hover and click |
| 18 | **Loading State** | `'loading-state'`, `'loading'` | Accessible loading spinner with `aria-busy` and disabled states |
| 19 | **Shine Sweep** | `'shine-sweep'`, `'shine'` | Sharp 45-degree specular highlight beam flashing across on hover |
| 20 | **Floating Effect** | `'floating-effect'`, `'float'` | Continuous gentle levitation with oscillating soft drop shadow |

---

## Customization Options

Pass options to `BtnCraft.create(target, options)`:

```javascript
BtnCraft.create('#action-btn', {
  animation: 'shimmer',
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

### HTML5 Data Attributes

All options can be declared in HTML:

```html
<button
  data-btncraft="shimmer"
  data-variant="gradient"
  data-color="#3b82f6"
  data-text-color="#ffffff"
  data-border-color="#60a5fa"
  data-radius="12"
  data-size="lg"
  data-duration="350"
  data-intensity="1.2">
  Action
</button>
```

### CSS Custom Properties

BtnCraft buttons use CSS custom properties internally. Override them globally or per-element:

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

## Instance Methods

When calling `BtnCraft.create()`, an instance (or collection) is returned:

```javascript
const btn = BtnCraft.create('#save-btn', { animation: 'glow' });

// Dynamically update options and animations
btn.update({
  color: '#10b981',
  radius: 'pill'
});

// Remove all injected DOM elements, listeners, and restore original styles
btn.destroy();
```

---

## Loading State & Accessibility

Manage accessible loading states effortlessly:

```javascript
import { BtnCraft, setLoading } from 'btncraft';

const button = document.querySelector('#submit-button');

// Activate loading mode (disables button, sets aria-busy, injects spinner)
BtnCraft.setLoading(button, true, 'Submitting payment...');

try {
  await submitPayment();
} finally {
  // Restores original attributes, enabled state, and removes spinner
  BtnCraft.setLoading(button, false);
}
```

---

## Custom Animation Registration

Create and register your own custom button animation effects:

```javascript
import BtnCraft from 'btncraft';

BtnCraft.register('heartbeat', {
  setup(element, options, cleanup) {
    element.classList.add('my-heartbeat-class');

    // Return a cleanup callback or use cleanup.add()
    return () => {
      element.classList.remove('my-heartbeat-class');
    };
  }
}, ['beat', 'pulse-heart']);

// Use your custom animation
BtnCraft.create('#donate-btn', { animation: 'heartbeat' });
```

---

## Development & Testing Demo

A development sandbox testing all 20 animations with live property controls is included in `demo/`:

```bash
# Start Vite development server
npm run dev
```

Run automated tests:

```bash
# Run unit & DOM integration tests
npm test
```

Build production distribution files:

```bash
npm run build
```

---

## Browser Support

BtnCraft supports all modern browsers (Chrome, Edge, Firefox, Safari, iOS Safari, Android Chrome). It requires standard ES6+ and CSS custom properties.

---

## License

[MIT](LICENSE) © BtnCraft Authors
