/**
 * BtnCraft Animation Collection Index
 * Exports and registers all 20 built-in button animation effects
 */

import { registry } from '../core/registry.js';

import { gradientShift } from './gradientShift.js';
import { neonGlow } from './neonGlow.js';
import { borderRunner } from './borderRunner.js';
import { liquidFill } from './liquidFill.js';
import { magneticHover } from './magneticHover.js';
import { press3d } from './press3d.js';
import { rippleClick } from './rippleClick.js';
import { shimmer } from './shimmer.js';
import { spotlight } from './spotlight.js';
import { pulseGlow } from './pulseGlow.js';
import { slidingBg } from './slidingBg.js';
import { glitch } from './glitch.js';
import { rainbowBorder } from './rainbowBorder.js';
import { expandHover } from './expandHover.js';
import { rotatingIcon } from './rotatingIcon.js';
import { gradientBorder } from './gradientBorder.js';
import { bounce } from './bounce.js';
import { loadingState } from './loadingState.js';
import { shineSweep } from './shineSweep.js';
import { floatingEffect } from './floatingEffect.js';

// V2 New Animations
import { particleBurst } from './particleBurst.js';
import { circularReveal } from './circularReveal.js';
import { textScramble } from './textScramble.js';
import { clickShockwave } from './clickShockwave.js';
import { neonBorderPulse } from './neonBorderPulse.js';
import { elasticStretch } from './elasticStretch.js';
import { magneticSnap } from './magneticSnap.js';
import { flipButton } from './flipButton.js';
import { liquidMorph } from './liquidMorph.js';
import { elasticBorder } from './elasticBorder.js';

export const allAnimations = [
  gradientShift,
  neonGlow,
  borderRunner,
  liquidFill,
  magneticHover,
  press3d,
  rippleClick,
  shimmer,
  spotlight,
  pulseGlow,
  slidingBg,
  glitch,
  rainbowBorder,
  expandHover,
  rotatingIcon,
  gradientBorder,
  bounce,
  loadingState,
  shineSweep,
  floatingEffect,
  // V2
  particleBurst,
  circularReveal,
  textScramble,
  clickShockwave,
  neonBorderPulse,
  elasticStretch,
  magneticSnap,
  flipButton,
  liquidMorph,
  elasticBorder
];

/**
 * Registers all built-in animations into the provided or global registry
 * @param {typeof registry} [reg=registry]
 */
export function registerAllAnimations(reg = registry) {
  for (const anim of allAnimations) {
    reg.register(anim.name, anim, anim.aliases || []);
  }
}

// Auto-register built-ins
registerAllAnimations(registry);

export {
  gradientShift,
  neonGlow,
  borderRunner,
  liquidFill,
  magneticHover,
  press3d,
  rippleClick,
  shimmer,
  spotlight,
  pulseGlow,
  slidingBg,
  glitch,
  rainbowBorder,
  expandHover,
  rotatingIcon,
  gradientBorder,
  bounce,
  loadingState,
  shineSweep,
  floatingEffect,
  // V2
  particleBurst,
  circularReveal,
  textScramble,
  clickShockwave,
  neonBorderPulse,
  elasticStretch,
  magneticSnap,
  flipButton,
  liquidMorph,
  elasticBorder
};
