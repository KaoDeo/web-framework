/**
 * 
 * Here are the four main characteristics of the component system :
    - The view of a component depends on its props and state. Every time one of
    these changes, the view needs to be patched.
    - Components can have other components as children as part of their view’s
    virtual DOM.
    - A component can pass data to its children, and the child components receive
    this data as props.
    - A component can communicate with its parent component by emitting events
    to which the parent component can listen.
 */

import { destroyDOM } from './destroy-dom.js';
import { mountDOM } from './mount-dom.js';
import { patchDOM } from './patch-dom.js';
import { DOM_TYPES, extractChildren } from './h.js';
import { hasOwnProperty } from './utils/objects.js';
import { Dispatcher } from './dispatcher.js';
import { fillSlots } from './slots.js';

export function defineComponent({
  render,
  state,
  onMounted = () => {},
  onUnmounted = () => {},
  ...methods
}) {
  class Component {
    #isMounted = false;
    #vdom = null;
    #hostEl = null;
    #eventHandlers = null;
    #parentComponent = null;
    #dispatcher = new Dispatcher();
    #subscriptions = [];
    #children = [];
    #appContext = null;

    constructor(props = {}, eventHandlers = {}, parentComponent = null) {
      this.props = props;
      this.state = state ? state(props) : {};
      this.#eventHandlers = eventHandlers;
      this.#parentComponent = parentComponent;
    }

    setExternalContent(children) {
      this.#children = children;
    }

    get elements() {
      if (this.#vdom == null) {
        return [];
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).flatMap((child) => {
          if (child.type === DOM_TYPES.COMPONENT) {
            return child.component.elements;
          }

          return [child.el];
        });
      }

      return [this.#vdom.el];
    }

    get firstElement() {
      return this.elements[0];
    }

    get offset() {
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return Array.from(this.#hostEl.children).indexOf(this.firstElement);
      }

      return 0;
    }

    setAppContext(appContext) {
      this.#appContext = appContext;
    }

    get appContext() {
      return this.#appContext;
    }

    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map(
        ([eventName, handler]) => this.#wireEventHandler(eventName, handler)
      );
    }

    #wireEventHandler(eventName, handler) {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload);
        } else {
          handler(payload);
        }
      });
    }

    updateProps(props) {
      this.props = { ...this.props, ...props };
      this.#patch();
    }

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    // Renders the component’s vdom based on the current props and state
    render() {
      const vdom = render.call(this);
      fillSlots(vdom, this.#children);

      return vdom;
    }

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted');
      }

      this.#vdom = this.render();
      mountDOM(this.#vdom, hostEl, index, this);
      this.#wireEventHandlers();

      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      destroyDOM(this.#vdom);

      this.#subscriptions.forEach((unsubscribe) => unsubscribe());
      this.#vdom = null;
      this.#hostEl = null;
      this.#isMounted = false;
      this.#subscriptions = [];
    }

    onMounted() {
      return Promise.resolve(onMounted.call(this));
    }

    onUnmounted() {
      return Promise.resolve(onUnmounted.call(this));
    }

    emit(eventName, payload) {
      this.#dispatcher.dispatch(eventName, payload);
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      const vdom = this.render();
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
    }
  }

  for (const methodName in methods) {
    if (hasOwnProperty(Component, methodName)) {
      new Error(`Method "${methodName}()" already exists in the component.`);
    }

    Component.prototype[methodName] = methods[methodName];
  }

  return Component;
}
