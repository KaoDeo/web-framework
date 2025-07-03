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

export function defineComponent({ render, state }) {
  class Component {
    #isMounted = false;
    #vdom = null;
    #hostEl = null;

    constructor(props = {}) {
      this.props = props;
      this.state = state ? state(props) : {};
    }

    get elements() {
      if (this.#vdom == null) {
        return [];
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).map((child) => child.el);
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

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    // Renders the component’s vdom based on the current props and state
    render() {
      return render.call(this);
    }

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted');
      }

      this.#vdom = this.render();
      mountDOM(this.#vdom, hostEl, index);

      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      destroyDOM(this.#vdom);
      this.#vdom = null;
      this.#hostEl = null;
      this.#isMounted = false;
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }

      const vdom = this.render();
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
    }

    // Updates the state and triggers a render cycle
  }

  return Component;
}
