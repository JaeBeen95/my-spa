import type { VElement } from './types';

declare global {
  namespace JSX {
    type Element = VElement;
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
