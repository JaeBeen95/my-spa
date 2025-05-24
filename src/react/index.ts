import { ComponentType, VNode, HookContext, EffectHook, Props } from '../types';
import { createDOM } from './createDom';

const contexts = new Map<ComponentType, HookContext>();
let currentContext: HookContext | null = null;
let rootComponent: ComponentType;
let rootContainer: HTMLElement;
let isRenderScheduled = false;

export function useState<T>(
  initialState: T,
): [T, (update: T | ((prev: T) => T)) => void] {
  const context = currentContext!;
  const hookIndex = context.hookIndex++;

  if (!context.stateHooks[hookIndex]) {
    context.stateHooks[hookIndex] = { value: initialState, queue: [] };
  }

  const stateHook = context.stateHooks[hookIndex];
  processStateQueue(stateHook);

  const setState = (update: T | ((prev: T) => T)) => {
    stateHook.queue.push(update);
    scheduleUpdate();
  };

  return [stateHook.value, setState];
}

function processStateQueue<T>(hook: {
  value: T;
  queue: (T | ((prev: T) => T))[];
}) {
  while (hook.queue.length > 0) {
    const update = hook.queue.shift()!;
    hook.value =
      typeof update === 'function'
        ? (update as (prev: T) => T)(hook.value)
        : update;
  }
}

export function useEffect(effect: EffectHook['effect'], deps?: any[]): void {
  const context = currentContext!;
  const index = context.hookIndex++;

  if (!context.effectHooks[index]) {
    context.effectHooks[index] = {
      deps: undefined,
      cleanup: undefined,
      effect,
    };
  }

  const effectHook = context.effectHooks[index];
  effectHook.effect = effect;

  if (shouldRunEffect(effectHook.deps, deps)) {
    context.pendingEffects.push({ idx: index });
    effectHook.deps = deps ? [...deps] : deps;
  }
}

function shouldRunEffect(
  prevDeps: any[] | undefined,
  nextDeps: any[] | undefined,
): boolean {
  if (!nextDeps || !prevDeps || nextDeps.length !== prevDeps.length) {
    return true;
  }
  return nextDeps.some((dep, i) => !Object.is(dep, prevDeps[i]));
}

export function createElement(
  tag: string | ComponentType,
  props: Props = {},
  ...children: VNode[]
): VNode {
  const filteredChildren = children
    .flat()
    .filter((c) => c != null && c !== false) as VNode[];

  if (typeof tag === 'function') {
    const context = getContext(tag);
    const prevContext = currentContext;
    currentContext = context;
    context.hookIndex = 0;

    const vNode = tag({ ...props, children: filteredChildren });
    currentContext = prevContext;
    return vNode;
  }

  return { tag, props, children: filteredChildren };
}

function getContext(component: ComponentType): HookContext {
  let context = contexts.get(component);
  if (!context) {
    context = {
      hookIndex: 0,
      stateHooks: [],
      effectHooks: [],
      pendingEffects: [],
    };
    contexts.set(component, context);
  }
  return context;
}

function renderRoot(): void {
  const domTree = createDOM(rootComponent());
  rootContainer.innerHTML = '';
  rootContainer.appendChild(domTree);
}

function flushEffects(): void {
  contexts.forEach((context) => {
    for (const effect of context.pendingEffects) {
      const hook = context.effectHooks[effect.idx];
      hook.cleanup?.();
      const cleanup = hook.effect();
      hook.cleanup = typeof cleanup === 'function' ? cleanup : undefined;
    }
    context.pendingEffects = [];
  });
}

export function scheduleUpdate(): void {
  if (isRenderScheduled) return;
  isRenderScheduled = true;
  queueMicrotask(() => {
    isRenderScheduled = false;
    renderRoot();
    flushEffects();
  });
}

export function render(component: ComponentType, container: HTMLElement): void {
  rootComponent = component;
  rootContainer = container;
  scheduleUpdate();
}
