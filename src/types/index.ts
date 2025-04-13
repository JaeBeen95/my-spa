declare global {
  namespace JSX {
    type Element = VNode;

    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  interface Window {
    navigate: (path: string, updateView?: boolean) => void;
  }
}

export type VNode = string | number | VElement | null | undefined | boolean;

export type ComponentFunction = (props?: {
  [key: string]: any;
}) => VNode | VElement;

export interface VElement {
  tag: string | ComponentFunction;
  props?: { [key: string]: any };
  children?: VNode[];
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

export interface ArticleDetail {
  id: number;
  title: string;
  description: string;
  time: string;
  imgSrc: string;
  imgDescription: string;
  content: string;
  category: string;
}
