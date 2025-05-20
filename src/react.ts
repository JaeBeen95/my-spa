import { ComponentType, VNode, RootRenderContext, HookContext } from './types';

const hookContextMap = new WeakMap<ComponentType, HookContext>();
let currentHookContext: HookContext | null = null;

const rootRenderContext: RootRenderContext = {
  component: () => ({ tag: 'div', props: {}, children: [] }),
  container: document.createElement('div'),
};

let isRenderScheduled = false;
function enqueueRender() {
  if (isRenderScheduled) return;
  isRenderScheduled = true;
  Promise.resolve().then(() => {
    isRenderScheduled = false;
    const newVNode = rootRenderContext.component(rootRenderContext.props);
    render(newVNode, rootRenderContext.container);
  });
}

export function useState<T>(
  initialState: T,
): [T, (update: T | ((prev: T) => T)) => void] {
  const hookContext = currentHookContext!;
  const hookIndex = hookContext.hookIndex++;

  if (hookContext.states[hookIndex] === undefined) {
    hookContext.states[hookIndex] = initialState;
    hookContext.queues[hookIndex] = [];
  }

  let state = hookContext.states[hookIndex];
  const queue = hookContext.queues[hookIndex];

  while (queue.length) {
    const update = queue.shift()!;
    state = typeof update === 'function' ? update(state) : update;
  }

  hookContext.states[hookIndex] = state;

  const setState = (update: T | ((prev: T) => T)) => {
    hookContext.queues[hookIndex].push(update);
    enqueueRender();
  };

  return [state, setState];
}

export function createElement(
  tag: string | ComponentType,
  props?: Record<string, any>,
  ...children: VNode[]
): VNode {
  props = props || {};
  const filteredChildren = children
    .flat()
    .filter((child) => child != null && child !== false);

  if (typeof tag === 'function') {
    const hookContext = hookContextMap.get(tag) ?? {
      states: [],
      queues: [],
      hookIndex: 0,
    };
    hookContextMap.set(tag, hookContext);

    const prevContext = currentHookContext;
    currentHookContext = hookContext;
    hookContext.hookIndex = 0;

    const rendered = tag({ ...props, children: filteredChildren });

    currentHookContext = prevContext;
    return rendered;
  }

  return { tag, props, children: filteredChildren };
}

function isEventProp(name: string): boolean {
  return name.startsWith('on') && name.length > 2;
}

function getEventType(propName: string): string {
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

  Object.entries(vNode.props || {}).forEach(([name, value]) => {
    if (isEventProp(name) && typeof value === 'function') {
      element.addEventListener(getEventType(name), value);
    } else if (value != null && value !== false) {
      element.setAttribute(name, value === true ? '' : String(value));
    }
  });

  vNode.children?.forEach((child) => {
    element.appendChild(createDOM(child));
  });

  return element;
}

export function render(vNode: VNode, container: HTMLElement): void {
  container.innerHTML = '';
  container.appendChild(createDOM(vNode));
}

export function createRoot(container: HTMLElement) {
  rootRenderContext.container = container;

  return {
    render(component: ComponentType, props: Record<string, any> = {}) {
      rootRenderContext.component = component;
      rootRenderContext.props = props;
      enqueueRender();
    },
  };
}
