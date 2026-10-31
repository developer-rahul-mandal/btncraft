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
import { ButtonStateEngine } from './core/state.js';
import { icons, IconSystem, ICONS } from './core/icons.js';
import { group, BtnCraftGroup } from './core/group.js';

/**
 * Top-level state helpers
 */
function setSuccess(target, options) {
  const inst = getInstance(target) || create(target);
  return inst?.success(options);
}

function setError(target, options) {
  const inst = getInstance(target) || create(target);
  return inst?.error(options);
}

function resetState(target) {
  const inst = getInstance(target);
  return inst?.reset();
}

function unregister(name) {
  return registry.unregister(name);
}

/**
 * Public BtnCraft namespace object
 */
export const BtnCraft = {
  version: '2.0.0',
  create,
  init,
  destroy,
  group,
  get: getInstance,
  getInstance,
  activeInstances,
  getActiveCount: () => activeInstances.size,
  register: (name, definition, aliases, options) => registry.register(name, definition, aliases, options),
  unregister,
  getAnimations: () => registry.getNames(),
  hasAnimation: (name) => registry.has(name),
  setLoading,
  setSuccess,
  setError,
  resetState,
  icons,
  registry
};

// Default export
export default BtnCraft;

// Named exports
export {
  create,
  init,
  destroy,
  group,
  getInstance,
  activeInstances,
  registry,
  initBtnCraft,
  setLoading,
  setSuccess,
  setError,
  resetState,
  icons,
  IconSystem,
  ICONS,
  ButtonStateEngine,
  BtnCraftInstance,
  BtnCraftCollection,
  BtnCraftGroup,
  unregister,
  allAnimations
};
