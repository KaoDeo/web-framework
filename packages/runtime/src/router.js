import { makeRouteMatcher } from './route-matchers.js';

// get routes[], listen to URL changes, match curr route with routes[], update view
export class HashRouter {
  #matchers = [];
  #isInitialized = false;
  #onPopState = () => this.#matchCurrentRoute();
  #matchedRoute = null;
  #params = {};
  #query = {};

  get #currentRouteHash() {
    const hash = document.location.hash;

    if (hash === '') {
      return '/';
    }

    return hash.slice(1);
  }

  get matchedRoute() {
    return this.#matchedRoute;
  }

  get params() {
    return this.#params;
  }

  get query() {
    return this.#query;
  }

  constructor(routes = []) {
    this.#matchers = routes.map(makeRouteMatcher);
  }

  async init() {
    if (this.#isInitialized) {
      return;
    }

    if (document.location.hash === '') {
      window.history.replaceState({}, '', '#/');
    }

    window.addEventListener('popstate', this.#onPopState);
    await this.#matchCurrentRoute();

    this.#isInitialized = true;
  }

  destroy() {
    if (!this.#isInitialized) {
      return;
    }

    window.removeEventListener('popstate', this.#onPopState);

    this.#isInitialized = false;
  }

  navigateTo(path) {
    const matcher = this.#matchers.find((matcher) => matcher.checkMatch(path));

    if (matcher == null) {
      console.warn(`[Router] No route matches path "${path}"`);
      this.#matchedRoute = null;
      this.#params = {};
      this.#query = {};

      return;
    }

    this.#matchedRoute = matcher.route;
    this.#params = matcher.extractParams(path);
    this.#query = matcher.extractQuery(path);
    this.#pushState(path);
  }

  back() {
    // TODO: Implement the back logic
  }

  forward() {
    // TODO: Implement the forward logic
  }

  #matchCurrentRoute() {
    return this.navigateTo(this.#currentRouteHash);
  }

  #pushState(path) {
    window.history.pushState({}, '', `#${path}`);
  }
}
