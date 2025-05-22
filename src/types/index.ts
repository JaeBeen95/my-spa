export type VNode = VElement | string | number | boolean | null | undefined;

export type ComponentType = (props?: { [key: string]: any }) => VNode;

export interface RootContext {
  component: ComponentType;
  props: Record<string, any>;
  container: HTMLElement;
}

export interface VElement {
  tag: string | ComponentType;
  props?: { [key: string]: any };
  children?: VNode[];
}

export interface HookContext {
  states: any[];
  queues: any[][];
  hookIndex: number;
}

export interface RootRenderContext {
  component: ComponentType;
  props?: Record<string, any>;
  container: HTMLElement;
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
