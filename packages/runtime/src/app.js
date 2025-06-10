import { destroyDOM } from './destroy-dom';
import { Dispatcher } from './dispatcher';
import { mountDOM } from './mount-dom';
import { patchDOM } from './patch-dom';

// creates application instance
export function createApp({ state, view, reducers = {} }) {
  let parentEl = null;
  let vdom = null;

  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  for (const actionName in reducers) {
    const reducer = reducers[actionName];

    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  function emit(eventName, payload) {
    dispatcher.dispatch(eventName, payload);
  }

  function renderApp() {
    const newVdom = view(state, emit);

    vdom = patchDOM(vdom, newVdom, parentEl);
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl;
      vdom = view(state, emit);
      mountDOM(vdom, parentEl);
    },
    unmount() {
      destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
    },
  };
}
