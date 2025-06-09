/**
 * <button (click)="increment()">Click me</button> ------> increment is a command
 * dispatch('increment', { amount: 1 }); ------>
 */

export class Dispatcher {
  // Command handler registry
  #subs = new Map();
  #afterHandlers = [];

  subscribe(commandName, handler) {
    if (!this.#subs.has(commandName)) {
      // Creates the array of subscriptions if it doesn’t exist for a given command name
      this.#subs.set(commandName, []);
    }

    const handlers = this.#subs.get(commandName);
    if (handlers.includes(handler)) {
      // Checks whether the handler is registered
      return () => {};
    }

    handlers.push(handler); // Registers the handler

    return () => {
      // Returns a function to unregister the handler
      const idx = handlers.indexOf(handler);
      handlers.splice(idx, 1);
    };
  }

  dispatch(commandName, payload) {
    if (this.#subs.has(commandName)) {
      // Checks whether handlers are registered and calls them
      this.#subs.get(commandName).forEach((handler) => handler(payload));
    } else {
      console.warn(`No handlers for command: ${commandName}`);
    }

    // Runs the after-command handlers
    this.#afterHandlers.forEach((handler) => handler());
  }

  // The after-command handlers run after all consumers (command handlers) of the command run.
  // place to notify the renderer
  afterEveryCommand(handler) {
    this.#afterHandlers.push(handler);
    return () => {
      const idx = this.#afterHandlers.indexOf(handler);
      this.#afterHandlers.splice(idx, 1);
    };
  }
}
