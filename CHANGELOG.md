# Changelog

All notable changes to the `btncraft` library are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-11-04

### Added
- **Dedicated Button State Engine (`src/core/state.js`)**:
  - Full state-machine managing `default`, `loading`, `success`, `error`, `disabled`, `hover`, `active`, and `focus`.
  - Inline SVG checkmark, error cross, and accessible CSS spinner (no external icon dependencies).
  - Built-in duplicate submission guards during active async operations.
  - Automatic restore timers for transient feedback states.
  - High-level `.execute(async () => ...)` promise runner.
  - Event subscription via `.on('statechange' | 'loading' | 'success' | 'error' | 'reset', fn)`.
- **Icon & Content Animation System (`src/core/icons.js`)**:
  - Micro-interactions for existing or custom icons: `rotateIcon()`, `slideIcon()`, `revealArrow()`, `replaceIcon()`, and `iconToSpinner()`.
  - Animated text transition engine: `setText()` supporting `fade`, `slide-up`, and `slide-down` transitions.
- **10 New Animation Micro-Interactions (30 Total)**:
  - `particle-burst`: Multi-colored radial confetti sparks emanating on click coordinates.
  - `circular-reveal`: Expanding radial color flood from pointer entry position.
  - `text-scramble`: Matrix-style character scrambling resolving into the button label.
  - `click-shockwave`: High-velocity expanding acoustic pressure shockwave on click.
  - `neon-border-pulse`: Rhythmic perimeter stroke flash and dissipation.
  - `elastic-stretch`: Directional squash-and-stretch physics tracking cursor momentum.
  - `magnetic-snap`: Spring-loaded magnetic snap attraction.
  - `flip-button`: 3D card flip transition revealing an alternate rear face.
  - `liquid-morph`: Organic fluid border-radius deformation.
  - `elastic-border`: Dynamic morphing SVG stroke contour deformation.
- **Button Groups & Segmented Controls (`src/core/group.js`)**:
  - Single-selection radio groups (`role="radiogroup"` / `role="radio"`).
  - Multi-selection toggle groups (`role="group"` / `aria-pressed`).
  - Segmented controls with pill backgrounds (`.bc-group-segmented`).
  - Full WCAG keyboard navigation with roving tabindex (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`).
- **High-Performance Interaction Engine (`src/core/interaction.js`)**:
  - `PointerTracker` with cached bounding client rectangles to eliminate layout thrashing.
  - `rAFThrottle` for 60/120 FPS scheduling across desktop mouse and mobile touch events.
- **Plugin Registry Improvements (`src/core/registry.js`)**:
  - `BtnCraft.unregister(name)` cleanly removes animations and associated aliases.
  - Definition validation, duplicate name detection, and override safety flags.
  - Support for `beforeSetup` and `afterTeardown` plugin lifecycle callbacks.
- **Dual CommonJS, ESM, and UMD Distribution**:
  - Native `.cjs` artifact resolving CommonJS `require('btncraft')` cleanly in Node.js.
  - Comprehensive TypeScript `.d.ts` declaration file covering all 30 animations, state methods, and group types.
- **Test Suite Expansion**:
  - 102 comprehensive Vitest tests across 12 test suites (100% passing).

### Changed
- Preserved 100% backwards compatibility with all V1.0.0 public APIs (`create`, `init`, `destroy`, `setLoading`, `initBtnCraft`, `registry.register`).
- Improved performance and motion safety across all interactive effects.

---

## [1.0.0] - 2026-10-31

### Added
- Initial release of BtnCraft animated button library.
- 20 built-in CSS and JavaScript micro-interactions.
- Declarative HTML5 data-attribute configuration (`data-btncraft`).
- Dynamic instance lifecycle management and cleanup.
- Pure Vanilla JavaScript, zero runtime dependencies.
