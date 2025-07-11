import { withoutNulls } from './utils/arrays.js';

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment', //type of virtual node used to group multiple nodes that need to be attached to the DOM together but don’t have a parent node in the DOM.
  COMPONENT: 'component',
  SLOT: 'slot',
};

/**
 * @description h is short for hyperscript. Creates element virtual nodes
 * @returns hypertext element
 */
export function h(tag, props = {}, children = []) {
  const type =
    typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;

  return {
    tag,
    props,
    type,
    children: mapTextNodes(withoutNulls(children)),
  };
}

export function hSlot(children = []) {
  return { type: DOM_TYPES.SLOT, children };
}

function mapTextNodes(children) {
  return children.map((child) =>
    typeof child === 'string' ? hString(child) : child
  );
}

/**
 *
 * @param {*} str
 * @returns virtual node for text type
 */
export function hString(str) {
  return { type: DOM_TYPES.TEXT, value: str };
}

export function hFragment(vNodes) {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}

export function lipsum(n) {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
    enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
    ut aliquip ex ea commodo consequat.`;

  return hFragment(Array(n).fill(h('p', {}, [text])));
}

export function MessageComponent({ level, message }) {
  return h('div', { class: `message message--${level}` }, [
    h('p', {}, [message]),
  ]);
}

export function extractChildren(vdom) {
  if (vdom.children == null) {
    return [];
  }

  const children = [];

  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child, children));
    } else {
      children.push(child);
    }
  }

  return children;
}
