/**
 * TypeScript definitions for BtnCraft V2.0.0
 */

export type BuiltinAnimation =
  | 'gradient-shift'
  | 'neon-glow'
  | 'border-runner'
  | 'liquid-fill'
  | 'magnetic-hover'
  | '3d-press'
  | 'ripple-click'
  | 'shimmer'
  | 'spotlight'
  | 'pulse-glow'
  | 'sliding-bg'
  | 'glitch'
  | 'rainbow-border'
  | 'expand-hover'
  | 'rotating-icon'
  | 'gradient-border'
  | 'bounce'
  | 'loading-state'
  | 'shine-sweep'
  | 'floating-effect'
  | 'particle-burst'
  | 'circular-reveal'
  | 'text-scramble'
  | 'click-shockwave'
  | 'neon-border-pulse'
  | 'elastic-stretch'
  | 'magnetic-snap'
  | 'flip-button'
  | 'liquid-morph'
  | 'elastic-border';

export type AnimationName = BuiltinAnimation | (string & {});

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'gradient'
  | 'danger'
  | 'dark'
  | 'light'
  | (string & {});

export type ButtonState =
  | 'default'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled'
  | 'hover'
  | 'active'
  | 'focus';

export type StateEvent = 'statechange' | 'loading' | 'success' | 'error' | 'reset';

export interface StateOptions {
  text?: string;
  icon?: string | HTMLElement;
  preserveOriginal?: boolean;
  timeout?: number;
  preventDuplicate?: boolean;
  [key: string]: any;
}

export interface BtnCraftOptions {
  /** Animation effect name (e.g. 'neon-glow', 'particle-burst', 'gradient-shift') */
  animation?: AnimationName;
  /** Button style variant */
  variant?: ButtonVariant;
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
  size?: 'sm' | 'md' | 'lg' | (string & {});
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

export declare class ButtonStateEngine {
  element: HTMLElement;
  state: ButtonState;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isDisabled: boolean;

  loading(isLoading?: boolean, options?: StateOptions): this;
  success(options?: StateOptions): this;
  error(options?: StateOptions): this;
  reset(): this;
  execute<T>(asyncFn: () => Promise<T>, options?: StateOptions): Promise<T>;
  on(event: StateEvent, callback: (payload: any) => void): () => void;
  destroy(): void;
}

export declare class BtnCraftInstance {
  element: HTMLElement;
  options: BtnCraftOptions;
  isBtnCraftInstance: boolean;
  isDestroyed: boolean;
  stateEngine: ButtonStateEngine;

  get state(): ButtonState;
  get isLoading(): boolean;
  get isSuccess(): boolean;
  get isError(): boolean;
  get isDisabled(): boolean;

  loading(isLoading?: boolean, options?: StateOptions): this;
  success(options?: StateOptions): this;
  error(options?: StateOptions): this;
  reset(): this;
  execute<T>(asyncFn: () => Promise<T>, options?: StateOptions): Promise<T>;
  on(event: StateEvent, callback: (payload: any) => void): () => void;

  rotateIcon(options?: Record<string, any>): this;
  slideIcon(options?: Record<string, any>): this;
  revealArrow(options?: Record<string, any>): this;
  replaceIcon(newIcon: string | HTMLElement, options?: Record<string, any>): this;
  setText(newText: string, options?: { transition?: 'fade' | 'slide-up' | 'slide-down'; duration?: number }): this;
  iconToSpinner(showSpinner?: boolean): this;

  update(newOptions?: Partial<BtnCraftOptions>): void;
  destroy(): void;
}

export declare class BtnCraftCollection extends Array<BtnCraftInstance> {
  readonly element: HTMLElement | null;
  loading(isLoading?: boolean, options?: StateOptions): this;
  success(options?: StateOptions): this;
  error(options?: StateOptions): this;
  reset(): this;
  update(newOptions?: Partial<BtnCraftOptions>): void;
  destroy(): void;
}

export type GroupType = 'single' | 'multiple' | 'segmented';

export interface BtnCraftGroupOptions {
  type?: GroupType;
  defaultValue?: string | string[];
  value?: string | string[];
  itemAnimation?: AnimationName;
  onChange?: (value: any, button: HTMLElement, group: BtnCraftGroup) => void;
}

export declare class BtnCraftGroup {
  container: HTMLElement | null;
  buttons: HTMLElement[];
  type: GroupType;
  options: BtnCraftGroupOptions;

  getValue(): string | string[] | null;
  setValue(targetValue: string | string[]): void;
  on(event: string, callback: (value: any, button: HTMLElement) => void): () => void;
  destroy(): void;
}

export declare class IconSystem {
  rotateIcon(button: HTMLElement, options?: Record<string, any>): () => void;
  slideIcon(button: HTMLElement, options?: Record<string, any>): () => void;
  revealArrow(button: HTMLElement, options?: Record<string, any>): () => void;
  replaceIcon(button: HTMLElement, newIcon: string | HTMLElement, options?: Record<string, any>): HTMLElement | null;
  setText(button: HTMLElement, newText: string, options?: { transition?: 'fade' | 'slide-up' | 'slide-down'; duration?: number }): void;
  iconToSpinner(button: HTMLElement, showSpinner?: boolean): () => void;
  createSpinner(): HTMLElement;
  createCheckmark(): HTMLElement;
  createErrorCross(): HTMLElement;
}

export declare const icons: IconSystem;
export declare const ICONS: Record<string, string>;

export interface AnimationDefinition {
  name?: string;
  displayName?: string;
  className?: string;
  beforeSetup?: (element: HTMLElement, options: BtnCraftOptions) => void;
  setup: (
    element: HTMLElement,
    options: BtnCraftOptions,
    cleanup: any
  ) => void | (() => void);
  afterTeardown?: (element: HTMLElement, options: BtnCraftOptions) => void;
}

export interface RegisterOptions {
  override?: boolean;
  aliases?: string[];
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

export declare function group(
  target: string | Element | NodeList | Element[],
  options?: BtnCraftGroupOptions
): BtnCraftGroup;

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

export declare function setSuccess(
  target: any,
  options?: StateOptions
): BtnCraftInstance | null;

export declare function setError(
  target: any,
  options?: StateOptions
): BtnCraftInstance | null;

export declare function resetState(
  target: any
): BtnCraftInstance | null;

export declare function unregister(name: string): boolean;

export declare const activeInstances: Set<BtnCraftInstance>;

export declare const registry: {
  register(
    name: string,
    definition: AnimationDefinition,
    aliasesOrOptions?: string[] | RegisterOptions,
    options?: RegisterOptions
  ): any;
  unregister(name: string): boolean;
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
  group: typeof group;
  get: typeof getInstance;
  getInstance: typeof getInstance;
  activeInstances: Set<BtnCraftInstance>;
  getActiveCount(): number;
  register(
    name: string,
    definition: AnimationDefinition,
    aliasesOrOptions?: string[] | RegisterOptions,
    options?: RegisterOptions
  ): any;
  unregister: typeof unregister;
  getAnimations(): string[];
  hasAnimation(name: string): boolean;
  setLoading: typeof setLoading;
  setSuccess: typeof setSuccess;
  setError: typeof setError;
  resetState: typeof resetState;
  icons: IconSystem;
  registry: typeof registry;
}

export declare const BtnCraft: BtnCraftNamespace;
export default BtnCraft;
