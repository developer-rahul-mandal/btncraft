/**
 * Animation registry for BtnCraft
 */

class AnimationRegistry {
  constructor() {
    this.animations = new Map();
    this.aliases = new Map();
  }

  /**
   * Normalizes an animation name for lookup (kebab-case, lowercase)
   * @param {string} name
   * @returns {string}
   */
  normalizeName(name) {
    if (!name || typeof name !== 'string') return '';
    return name
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Registers an animation definition
   * @param {string} name
   * @param {{ setup: (element: HTMLElement, options: Record<string, any>, cleanup: any) => void|(() => void), className?: string, beforeSetup?: Function, afterTeardown?: Function }} definition
   * @param {string[]|Record<string, any>} [aliasesOrOptions=[]]
   * @param {Record<string, any>} [options={}]
   */
  register(name, definition, aliasesOrOptions = [], options = {}) {
    if (!name || typeof name !== 'string') {
      throw new Error('[BtnCraft] Animation name must be a non-empty string');
    }
    if (!definition || typeof definition.setup !== 'function') {
      throw new Error(`[BtnCraft] Animation "${name}" must provide a setup function`);
    }

    let aliases = [];
    let opts = options;

    if (Array.isArray(aliasesOrOptions)) {
      aliases = aliasesOrOptions;
    } else if (aliasesOrOptions && typeof aliasesOrOptions === 'object') {
      opts = aliasesOrOptions;
      aliases = Array.isArray(opts.aliases) ? opts.aliases : [];
    }

    const canonical = this.normalizeName(name);

    if (this.animations.has(canonical) && !opts.override) {
      throw new Error(`[BtnCraft] Animation "${name}" is already registered. Set override: true to replace.`);
    }

    const animRecord = {
      name: canonical,
      displayName: name,
      className: definition.className || `bc-anim-${canonical}`,
      setup: definition.setup,
      beforeSetup: typeof definition.beforeSetup === 'function' ? definition.beforeSetup : null,
      afterTeardown: typeof definition.afterTeardown === 'function' ? definition.afterTeardown : null
    };

    this.animations.set(canonical, animRecord);

    for (const a of aliases) {
      if (a) this.alias(canonical, a);
    }

    return animRecord;
  }

  /**
   * Unregisters an animation and its aliases
   * @param {string} name
   * @returns {boolean}
   */
  unregister(name) {
    if (!name || typeof name !== 'string') return false;
    const canonical = this.resolveName(name);
    const wasRegistered = this.animations.delete(canonical);

    // Clean up any aliases mapping to this canonical name
    for (const [alias, target] of this.aliases.entries()) {
      if (target === canonical || alias === canonical) {
        this.aliases.delete(alias);
      }
    }

    return wasRegistered;
  }

  /**
   * Adds an alias to an existing canonical animation
   * @param {string} canonicalName
   * @param {string} aliasName
   */
  alias(canonicalName, aliasName) {
    const canonical = this.normalizeName(canonicalName);
    const alias = this.normalizeName(aliasName);
    if (alias) {
      this.aliases.set(alias, canonical);
    }
  }

  /**
   * Resolves an animation name to its canonical name
   * @param {string} name
   * @returns {string}
   */
  resolveName(name) {
    const normalized = this.normalizeName(name);
    if (this.animations.has(normalized)) {
      return normalized;
    }
    if (this.aliases.has(normalized)) {
      return this.aliases.get(normalized);
    }
    return normalized;
  }

  /**
   * Retrieves an animation definition by name or alias
   * @param {string} name
   * @returns {any|null}
   */
  get(name) {
    const canonical = this.resolveName(name);
    return this.animations.get(canonical) || null;
  }

  /**
   * Checks if an animation is registered
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    const canonical = this.resolveName(name);
    return this.animations.has(canonical);
  }

  /**
   * Returns list of all registered canonical animation names
   * @returns {string[]}
   */
  getNames() {
    return Array.from(this.animations.keys());
  }

  /**
   * Clears all registered animations (primarily for testing)
   */
  clear() {
    this.animations.clear();
    this.aliases.clear();
  }
}

export const registry = new AnimationRegistry();
