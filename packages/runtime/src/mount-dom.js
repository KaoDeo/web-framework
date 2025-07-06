import { DOM_TYPES } from './h.js';
import { addEventListeners } from './events.js';
import { setAttributes } from './attributes.js';
import { extractPropsAndEvents } from './utils/props.js';
import { enqueueJob } from './scheduler.js';

export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index);
      break;
    }

    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent);
      break;
    }

    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index, hostComponent);
      break;
    }

    case DOM_TYPES.COMPONENT: {
      createComponentNode(vdom, parentEl, index, hostComponent);
      //“Wait until all mounting is done, then run this.”
      enqueueJob(() => vdom.component.onMounted());
      break;
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`);
    }
  }
}

function createComponentNode(vdom, parentEl, index, hostComponent) {
  const { props, events } = extractPropsAndEvents(vdom);
  const { tag: Component, children } = vdom;

  const component = new Component(props, events, hostComponent);
  component.setExternalContent(children);

  component.mount(parentEl, index);
  vdom.component = component;
  vdom.el = component.firstElement;
}

function createTextNode(vdom, parentEl, index) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  vdom.el = textNode;
  insert(textNode, parentEl, index);
}

function createElementNode(vdom, parentEl, index, hostComponent) {
  const { tag, props, children } = vdom;
  const element = document.createElement(tag);
  addProps(element, props, vdom, hostComponent);
  vdom.el = element;
  children.forEach((child) => mountDOM(child, element, hostComponent));
  insert(element, parentEl, index);
}

function addProps(el, props, vdom, hostComponent) {
  const { on: events, ...attrs } = props;
  vdom.listeners = addEventListeners(events, el, hostComponent);
  setAttributes(el, attrs);
}

function createFragmentNodes(vdom, parentEl, index, hostComponent) {
  const { children } = vdom;
  vdom.el = parentEl;
  children.forEach((child, i) =>
    mountDOM(child, parentEl, index ? index + i : null, hostComponent)
  );
}

function insert(el, parentEl, index) {
  // If index is null or undefined, simply append.
  // Note the usage of == instead of ===.

  if (index == null) {
    parentEl.append(el);
    return;
  }

  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`);
  }

  const children = parentEl.childNodes;

  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}
