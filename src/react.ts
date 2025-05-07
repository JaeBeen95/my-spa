import { ComponentFunction, VNode } from './types';

type RenderContext = {
  component: ComponentFunction;
  props: { [key: string]: any } | null;
  container: HTMLElement;
};

const states: unknown[] = [];
const renderContext: RenderContext = {
  component: () => ({ tag: 'div', props: {}, children: [] }),
  props: {},
  container: document.createElement('div'),
};
let hookIndex = 0;

export function useState<T>(initialState: T): [T, (newState: T) => void] {
  const stateIndex = hookIndex;
  hookIndex = hookIndex + 1;

  if (states[stateIndex] === undefined) {
    states[stateIndex] = initialState;
  }

  const setState = (newState: T) => {
    states[stateIndex] = newState;
    const newVNode = renderContext.component(renderContext.props || {});
    render(newVNode, renderContext.container);
  };

  return [states[stateIndex] as T, setState];
}

export function createDOM(vNode: VNode): Node {
  if (vNode == null || typeof vNode === 'boolean') {
    return document.createTextNode('');
  }

  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(String(vNode));
  }

  const element = document.createElement(vNode.tag as string);

  Object.entries(vNode.props || {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  for (const child of vNode.children || []) {
    element.appendChild(createDOM(child));
  }

  return element;
}

export function createElement(
  tag: string | ComponentFunction,
  props: { [key: string]: any } | null,
  ...children: VNode[]
): VNode {
  props = props || {};

  const filteredChildren = children
    .flat()
    .filter(
      (child) => child !== undefined && child !== null && child !== false,
    );

  if (typeof tag === 'function') {
    if (!renderContext.component) {
      renderContext.component = tag;
      renderContext.props = props;
    }

    const result =
      filteredChildren.length > 0
        ? tag({
            ...props,
            children:
              filteredChildren.length === 1
                ? filteredChildren[0]
                : filteredChildren,
          })
        : tag(props);

    return result;
  }

  return {
    tag,
    props,
    children: filteredChildren,
  };
}

export function render(vNode: VNode, container: HTMLElement): void {
  hookIndex = 0;

  container.innerHTML = '';
  container.appendChild(createDOM(vNode));

  renderContext.container = container;
}
