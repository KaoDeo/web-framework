import { destroyDOM } from './destroy-dom.js';
import { Dispatcher } from './dispatcher.js';
import { mountDOM } from './mount-dom.js';
import { patchDOM } from './patch-dom.js';
import { NoopRouter } from './router.js';

// creates application instance
export function createApp(RootComponent, props = {}, options = {}) {
  let parentEl = null;
  let isMounted = false;
  let vdom = null;

  // The application context is injected into every component mounted in the app.
  // This gives components access to objects that are global to the application.
  const context = {
    router: options.router || new NoopRouter(),
  };

  function reset() {
    parentEl = null;
    isMounted = false;
    vdom = null;
  }

  return {
    mount(_parentEl) {
      if (isMounted) {
        throw new Error('The application is already mounted');
      }

      parentEl = _parentEl;
      vdom = h(RootComponent, props);
      mountDOM(vdom, parentEl, null, { appContext: context });

      context.router.init();

      isMounted = true;
    },

    unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted');
      }

      destroyDOM(vdom);
      context.router.destroy();
      reset();
    },
  };
}
