import { VNode } from '../types';

export function isEventProp(name: string): boolean {
  return name.startsWith('on') && name.length > 2;
}

export function getEventType(propName: string): string {
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

  (vNode.children || []).forEach((child) => {
    element.appendChild(createDOM(child));
  });

  return element;
}
