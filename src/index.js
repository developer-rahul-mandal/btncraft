/**
 * BtnCraft — Animated JavaScript Button Library
 * A lightweight, production-ready, open-source animated button library for vanilla JS & modern web.
 */

// Import styles for bundlers supporting CSS side-effects
import './styles/base.css';
import './styles/animations.css';

import { create, BtnCraftInstance, BtnCraftCollection } from './core/create.js';
import { init, initBtnCraft, setLoading } from './core/init.js';
import { destroy, getInstance, activeInstances } from './core/destroy.js';
import { registry } from './core/registry.js';
import { allAnimations } from './animations/index.js';

/**
 * Public BtnCraft namespace object
 */
export const BtnCraft = {
  version: '1.0.0',
  create,
  init,
  destroy,
  get: getInstance,
  getInstance,
  activeInstances,
  getActiveCount: () => activeInstances.size,
  register: (name, definition, aliases) => registry.register(name, definition, aliases),
  getAnimations: () => registry.getNames(),
  hasAnimation: (name) => registry.has(name),
  setLoading,
  registry
};

// Default export
export default BtnCraft;

// Named exports
export {
  create,
  init,
  destroy,
  getInstance,
  activeInstances,
  registry,
  initBtnCraft,
  setLoading,
  BtnCraftInstance,
  BtnCraftCollection,
  allAnimations
};
