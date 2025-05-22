import { ComponentType, VNode, HookContext } from '../types';
import { createDOM } from './createDom';

const hookContextMap = new WeakMap<ComponentType, HookContext>();
let currentHookContext: HookContext | null = null;

let rootComponent: ComponentType;
let rootContainer: HTMLElement;

let isRenderScheduled = false;

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
  props = props ?? {};
  const filteredChildren = children
    .flat()
    .filter((child) => child != null && child !== false);

  if (typeof tag === 'function') {
    let hookContext = hookContextMap.get(tag);

    if (!hookContext) {
      hookContext = { states: [], queues: [], hookIndex: 0 };
      hookContextMap.set(tag, hookContext);
    }

    const prevContext = currentHookContext;
    currentHookContext = hookContext;
    hookContext.hookIndex = 0;

    const vNode = tag({ ...props, children: filteredChildren });

    currentHookContext = prevContext;
    return vNode;
  }

  return { tag, props, children: filteredChildren };
}

function updateRoot() {
  const vNode = rootComponent();
  rootContainer.innerHTML = '';
  rootContainer.appendChild(createDOM(vNode));
}

function enqueueRender() {
  if (isRenderScheduled) return;
  isRenderScheduled = true;

  queueMicrotask(() => {
    isRenderScheduled = false;
    updateRoot();
  });
}

export function render(component: ComponentType, container: HTMLElement) {
  rootComponent = component;
  rootContainer = container;
  updateRoot();
}
