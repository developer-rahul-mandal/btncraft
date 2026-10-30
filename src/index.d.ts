/**
 * TypeScript definitions for BtnCraft
 */

export interface BtnCraftOptions {
  /** Animation effect name (e.g. 'neon-glow', 'ripple', 'gradient-shift') */
  animation?: string;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger' | 'dark' | 'light' | string;
  /** Background color or gradient */
  color?: string;
  bg?: string;
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  colorText?: string;
  /** Border color */
  borderColor?: string;
  /** Border radius ('pill', 'square', number in px, or CSS length) */
  radius?: number | string;
  borderRadius?: number | string;
  /** Animation transition duration (e.g. 300 or '300ms') */
  duration?: number | string;
  speed?: number | string;
  /** Button sizing preset */
  size?: 'sm' | 'md' | 'lg' | string;
  /** Glow intensity factor (number or string) */
  glowIntensity?: number | string;
  intensity?: number | string;
  /** Box shadow string */
  shadow?: string;
  boxShadow?: string;
  /** Custom padding string or dimensions */
  padding?: string;
  paddingX?: number | string;
  paddingY?: number | string;
  /** Font size in px or CSS length */
  fontSize?: number | string;
  /** Whether loading spinner is active */
  loading?: boolean;
  isLoading?: boolean;
  /** Accessible text for loading state */
  loadingText?: string;
  text?: string;
  [key: string]: any;
}

export declare class BtnCraftInstance {
  element: HTMLElement;
  options: BtnCraftOptions;
  isBtnCraftInstance: boolean;
  isDestroyed: boolean;
  update(newOptions?: Partial<BtnCraftOptions>): void;
  destroy(): void;
}

export declare class BtnCraftCollection extends Array<BtnCraftInstance> {
  readonly element: HTMLElement | null;
  update(newOptions?: Partial<BtnCraftOptions>): void;
  destroy(): void;
}

export interface AnimationDefinition {
  name: string;
  displayName?: string;
  className?: string;
  setup: (
    element: HTMLElement,
    options: BtnCraftOptions,
    cleanup: any
  ) => void | (() => void);
}

export interface InitController {
  instances: BtnCraftCollection;
  destroy(): void;
}

export declare function create(
  target: string | Element | NodeList | Element[] | null | undefined,
  options?: BtnCraftOptions
): BtnCraftInstance | BtnCraftCollection | null;

export declare function init(
  root?: Element | Document,
  defaultOptions?: BtnCraftOptions
): InitController;

export declare function destroy(
  target?: string | Element | NodeList | Element[] | BtnCraftInstance | BtnCraftCollection | null
): void;

export declare function getInstance(
  target: string | Element
): BtnCraftInstance | null;

export declare function initBtnCraft(
  root?: Element | Document
): { destroy(): void };

export declare function setLoading(
  button: Element,
  isLoading: boolean,
  text?: string
): void;

export declare const activeInstances: Set<BtnCraftInstance>;

export declare const registry: {
  register(name: string, definition: AnimationDefinition, aliases?: string[]): any;
  alias(canonicalName: string, aliasName: string): void;
  get(name: string): any;
  has(name: string): boolean;
  getNames(): string[];
  clear(): void;
};

export interface BtnCraftNamespace {
  version: string;
  create: typeof create;
  init: typeof init;
  destroy: typeof destroy;
  get: typeof getInstance;
  getInstance: typeof getInstance;
  activeInstances: Set<BtnCraftInstance>;
  getActiveCount(): number;
  register(name: string, definition: AnimationDefinition, aliases?: string[]): any;
  getAnimations(): string[];
  hasAnimation(name: string): boolean;
  setLoading: typeof setLoading;
  registry: typeof registry;
}

export declare const BtnCraft: BtnCraftNamespace;
export default BtnCraft;
