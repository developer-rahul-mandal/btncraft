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
   * @param {{ setup: (element: HTMLElement, options: Record<string, any>, cleanup: any) => void|(() => void), className?: string }} definition
   * @param {string[]} [aliases=[]]
   */
  register(name, definition, aliases = []) {
    if (!name || typeof name !== 'string') {
      throw new Error('[BtnCraft] Animation name must be a non-empty string');
    }
    if (!definition || typeof definition.setup !== 'function') {
      throw new Error(`[BtnCraft] Animation "${name}" must provide a setup function`);
    }

    const canonical = this.normalizeName(name);
    const animRecord = {
      name: canonical,
      displayName: name,
      className: definition.className || `bc-anim-${canonical}`,
      setup: definition.setup
    };

    this.animations.set(canonical, animRecord);

    for (const a of aliases) {
      this.alias(canonical, a);
    }

    return animRecord;
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
