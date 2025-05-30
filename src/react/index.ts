import { ComponentType, VNode, HookContext, EffectHook, Props } from '../types';
import { createDOM, getEventType, isEventProp } from './createDom';

const contexts = new Map<ComponentType, HookContext>();
let currentContext: HookContext | null = null;
let rootComponent: ComponentType;
let rootContainer: HTMLElement;
let isRenderScheduled = false;
let currentVNode: VNode | null = null;

export function useState<T>(
  initialState: T | (() => T),
): [T, (update: T | ((prev: T) => T)) => void] {
  // 컨텍스트 null 체크 추가 - 컴포넌트 외부에서 호출 방지
  if (!currentContext) {
    throw new Error('useState must be called within a component');
  }
  
  const context = currentContext;
  const hookIndex = context.hookIndex++;

  if (!context.stateHooks[hookIndex]) {
    // lazy initial state 지원 - 함수인 경우 호출해서 초기값 설정
    const resolvedInitialState = typeof initialState === 'function' 
      ? (initialState as () => T)() 
      : initialState;
    context.stateHooks[hookIndex] = { value: resolvedInitialState, queue: [] };
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
  // 컨텍스트 null 체크 추가
  if (!currentContext) {
    throw new Error('useEffect must be called within a component');
  }
  
  const context = currentContext;
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
    .filter((child) => child != null && child !== false) as VNode[];

  if (typeof tag === 'function') {
    const context = getContext(tag);
    const prevContext = currentContext;
    currentContext = context;
    context.hookIndex = 0;

    try {
      const vNode = tag({ ...props, children: filteredChildren });
      return vNode;
    } catch (error) {
      // 에러 핸들링 추가 - 컴포넌트 렌더링 실패 시 복구
	    // props나 children에 이상한 값이 들어올 수도 있고
	    // 컴포넌트 내부에서 의도치 않은 오류 (undefined is not a function, null.foo, 등)가 발생할 수 있음
      console.error(`Error rendering component ${tag.name || 'Anonymous'}:`, error);
      return { tag: 'div', props: { style: 'color: red;' }, children: ['Error rendering component'] };
    } finally {
      currentContext = prevContext;
    }
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

// 메모리 누수 방지를 위한 컨텍스트 정리 함수 추가
// 컨포넌트 언마운트 시 effect의 clean up 실행
export function cleanupContext(component: ComponentType): void {
  const context = contexts.get(component);
  if (context) {
    // 모든 effect cleanup 실행
    context.effectHooks.forEach(hook => {
      if (hook.cleanup) {
        try {
          hook.cleanup();
        } catch (error) {
          console.error('Error during effect cleanup:', error);
        }
      }
    });
    contexts.delete(component);
  }
}

// 간단한 diff 알고리즘 - 기존 DOM과 새 VNode 비교
function diffAndUpdate(oldNode: Node, newVNode: VNode, parent: Node, index: number = 0): Node {
  // newVNode가 null/undefined/false인 경우
  if (newVNode == null || typeof newVNode === 'boolean') {
    if (oldNode && oldNode.nodeType === Node.TEXT_NODE) {
      oldNode.textContent = '';
      return oldNode;
    }
    const textNode = document.createTextNode('');
    if (oldNode) {
      parent.replaceChild(textNode, oldNode);
    } else {
      parent.appendChild(textNode);
    }
    return textNode;
  }

  // newVNode가 텍스트/숫자인 경우
  if (typeof newVNode === 'string' || typeof newVNode === 'number') {
    const textContent = String(newVNode);
    if (oldNode && oldNode.nodeType === Node.TEXT_NODE) {
      if (oldNode.textContent !== textContent) {
        oldNode.textContent = textContent;
      }
      return oldNode;
    }
    const textNode = document.createTextNode(textContent);
    if (oldNode) {
      parent.replaceChild(textNode, oldNode);
    } else {
      parent.appendChild(textNode);
    }
    return textNode;
  }

  // 배열인 경우 (Fragment 같은 경우) - 첫 번째 요소만 처리
  if (Array.isArray(newVNode)) {
    return diffAndUpdate(oldNode, newVNode[0] || null, parent, index);
  }

  // VNode 객체가 아닌 경우 처리
  if (typeof newVNode !== 'object' || !newVNode.tag) {
    console.warn('Invalid VNode:', newVNode);
    const textNode = document.createTextNode(String(newVNode));
    if (oldNode) {
      parent.replaceChild(textNode, oldNode);
    } else {
      parent.appendChild(textNode);
    }
    return textNode;
  }

  // 기존 노드가 없거나 태그가 다른 경우 - 새로 생성
  if (!oldNode || 
      oldNode.nodeType !== Node.ELEMENT_NODE || 
      (oldNode as Element).tagName.toLowerCase() !== (newVNode.tag as string).toLowerCase()) {
    const newElement = createDOM(newVNode);
    if (oldNode) {
      parent.replaceChild(newElement, oldNode);
    } else {
      parent.appendChild(newElement);
    }
    return newElement;
  }

  const element = oldNode as Element;
  
  // props 업데이트
  updateProps(element, newVNode.props || {});
  
  // children 업데이트
  updateChildren(element, newVNode.children || []);
  
  return element;
}

// props 업데이트 - 기존 props 제거하고 새 props 적용
function updateProps(element: Element, newProps: Record<string, any>): void {
  const htmlElement = element as HTMLElement;
  
  // 기존 이벤트 리스너 제거 - 간단한 방법으로 클론해서 교체
  // 실제로는 이벤트 리스너 참조 저장해서 개별 제거해야 하지만 복잡함
  const existingAttrs = Array.from(element.attributes);
  const hasEvents = existingAttrs.some(attr => isEventProp(attr.name));
  
  if (hasEvents) {
    // 이벤트가 있던 경우만 클론해서 교체 (성능 고려)
    const newElement = element.cloneNode(false) as Element;
    element.parentNode?.replaceChild(newElement, element);
    // 참조 업데이트
    Object.setPrototypeOf(htmlElement, newElement);
    Object.assign(htmlElement, newElement);
  }

  // 기존 attributes 정리
  existingAttrs.forEach(attr => {
    if (!newProps.hasOwnProperty(attr.name) && !attr.name.startsWith('data-')) {
      htmlElement.removeAttribute(attr.name);
    }
  });

  // 새 props 적용
  Object.entries(newProps).forEach(([name, value]) => {
    if (name === 'style' && typeof value === 'object' && value !== null) {
      // style 객체 처리
      Object.assign(htmlElement.style, value);
    } else if (name === 'className') {
      // className 처리
      htmlElement.className = value || '';
    } else if (isEventProp(name) && typeof value === 'function') {
      const eventType = getEventType(name);
      htmlElement.addEventListener(eventType, value);
    } else if (value != null && value !== false) {
      const attrValue = value === true ? '' : String(value);
      if (htmlElement.getAttribute(name) !== attrValue) {
        htmlElement.setAttribute(name, attrValue);
      }
    } else if (value === false || value == null) {
      // false나 null인 경우 속성 제거
      htmlElement.removeAttribute(name);
    }
  });
}

// children 업데이트 - 인덱스 기반 간단 비교
function updateChildren(element: Element, newChildren: VNode[]): void {
  const childNodes = Array.from(element.childNodes);
  
  // newChildren을 평탄화하고 유효한 것들만 필터링
  const flatChildren = newChildren
    .flat(Infinity)
    .filter(child => child != null && child !== false) as VNode[];
  
  const maxLength = Math.max(childNodes.length, flatChildren.length);

  for (let i = 0; i < maxLength; i++) {
    const oldChild = childNodes[i];
    const newChild = flatChildren[i];

    if (newChild === undefined) {
      // 새 children이 더 적음 - 기존 노드 제거
      if (oldChild) {
        try {
          element.removeChild(oldChild);
        } catch (error) {
          console.warn('Failed to remove child node:', error);
        }
      }
    } else if (oldChild === undefined) {
      // 새 children이 더 많음 - 새 노드 추가
      try {
        element.appendChild(createDOM(newChild));
      } catch (error) {
        console.warn('Failed to append child node:', error);
      }
    } else {
      // 기존 노드와 새 노드 비교 업데이트
      try {
        diffAndUpdate(oldChild, newChild, element, i);
      } catch (error) {
        console.warn('Failed to diff update child node:', error);
        // 실패 시 fallback - 노드 교체
        try {
          const newNode = createDOM(newChild);
          element.replaceChild(newNode, oldChild);
        } catch (fallbackError) {
          console.error('Failed to fallback replace child node:', fallbackError);
        }
      }
    }
  }
}


function renderRoot(): void {
  try {
    const newVNode = rootComponent();
    
    if (!currentVNode) {
      // 첫 렌더링 - 기존 방식 사용
      const domTree = createDOM(newVNode);
      rootContainer.innerHTML = '';
      rootContainer.appendChild(domTree);
      currentVNode = newVNode;
    } else {
      // diff 알고리즘 사용
      const firstChild = rootContainer.firstChild;
      if (firstChild) {
        diffAndUpdate(firstChild, newVNode, rootContainer);
        currentVNode = newVNode;
      } else {
        // DOM이 비어있는 경우 새로 생성
        const domTree = createDOM(newVNode);
        rootContainer.appendChild(domTree);
        currentVNode = newVNode;
      }
    }
  } catch (error) {
    console.error('Error during root render:', error);
    // 에러 발생 시 에러 메시지 표시
    rootContainer.innerHTML = '<div style="color: red;">Render Error</div>';
    currentVNode = null; // 에러 시 상태 초기화
  }
}

// 이 친구는 위의 cleanupContext 와는 다르게 컴포넌트 랜더링 주기용 인 것 같음
function flushEffects(): void {
  contexts.forEach((context) => {
    for (const effect of context.pendingEffects) {
      const hook = context.effectHooks[effect.idx];
      try {
        // 기존 cleanup 실행
        hook.cleanup?.();
        const cleanup = hook.effect();
        hook.cleanup = typeof cleanup === 'function' ? cleanup : undefined;
      } catch (error) {
        // 예외 처리
        console.error(`Error in effect at index ${effect.idx}:`, error);
      }
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
  // 기존 컴포넌트가 있다면 정리
  if (rootComponent) {
    cleanupContext(rootComponent);
  }
  
  rootComponent = component;
  rootContainer = container;
  currentVNode = null; // 새 컴포넌트로 변경 시 VNode 상태 초기화
  scheduleUpdate();
}
