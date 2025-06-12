export type Props = Record<string, any>;
export type Primitive = string | number | boolean | null | undefined;
export type VNode = VElement | Primitive;

export interface RootContext {
  component: ComponentType;
  props: Record<string, any>;
  container: HTMLElement;
}

export interface VElement {
  tag: string | ComponentType;
  props: Props;
  children: VNode[];
}

export type ComponentType = (props?: Props) => VNode;

export interface StateHook<T = any> {
  value: T;
  queue: (T | ((prev: T) => T))[];
}

export interface EffectHook {
  deps?: any[];
  cleanup?: () => void;
  effect: () => void | (() => void);
}

export interface PendingEffect {
  idx: number;
}

export interface HookContext {
  hookIndex: number;
  stateHooks: StateHook[];
  effectHooks: EffectHook[];
  pendingEffects: PendingEffect[];
}

export interface Category {
  id: string;
  label: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  time: string;
  imgSrc: string;
  imgDescription: string;
  category: string;
}

export interface ArticleDetail extends Article {
  content: string;
}
