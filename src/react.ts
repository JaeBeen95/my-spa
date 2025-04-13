import { ComponentFunction, VElement, VNode } from './types';

export function createDOM(node: VNode): Node {
  if (node == null || typeof node === 'boolean') {
    return document.createTextNode('');
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  const element = document.createElement(node.tag as string);

  Object.entries(node.props || {}).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });

  for (const child of node.children || []) {
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

export function render(vDom: VNode, container: HTMLElement): void {
  container.appendChild(createDOM(vDom));
}
