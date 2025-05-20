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
  const stateIndex = hookIndex++;
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

function isEventProp(name: string): boolean {
  return name.startsWith('on') && name.length > 2;
}

function getEventName(propName: string): string {
  return propName.slice(2).toLowerCase();
}

export function createDOM(vNode: VNode): Node {
  if (vNode == null || typeof vNode === 'boolean') {
    return document.createTextNode('');
  }
  if (typeof vNode === 'string' || typeof vNode === 'number') {
    return document.createTextNode(String(vNode));
  }

  const element = document.createElement(vNode.tag as string);
  vNode.element = element;

  Object.entries(vNode.props || {}).forEach(([name, value]) => {
    if (isEventProp(name) && typeof value === 'function') {
      const eventName = getEventName(name);
      element.addEventListener(eventName, value);
    } else if (value !== undefined && value !== null && value !== false) {
      if (value === true) {
        element.setAttribute(name, '');
      } else {
        element.setAttribute(name, String(value));
      }
    }
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
  const filteredChildren = children.flat().filter(
    (child) => child !== undefined && child !== null && child !== false,
  );
  if (typeof tag === 'function') {
    if (!renderContext.component) {
      renderContext.component = tag;
      renderContext.props = props;
    }
    const result = filteredChildren.length > 0
      ? tag({ ...props, children: filteredChildren.length === 1 ? filteredChildren[0] : filteredChildren })
      : tag(props);
    return result;
  }
  return { tag, props, children: filteredChildren };
}

export function render(vNode: VNode, container: HTMLElement): void {
  hookIndex = 0;
  renderContext.container = container;
  container.innerHTML = '';
  container.appendChild(createDOM(vNode));
}
