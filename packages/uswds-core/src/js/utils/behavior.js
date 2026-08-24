/**
 * Callback handler for component setup and teardown events.
 *
 * @typedef {(target?: HTMLElement) => any} BehaviorLifecycle
 */

/**
 * Options object for initializing a component's behavior and including additional properties in
 * the public interface of each initialized component.
 *
 * @typedef {Record<string, any> & { init?: BehaviorLifecycle, teardown?: BehaviorLifecycle }} BehaviorProps
 */

/**
 * Component initializer.
 *
 * @typedef {BehaviorProps & {
 *   on: BehaviorLifecycle,
 *   off: BehaviorLifecycle,
 *   add: BehaviorLifecycle,
 *   remove: BehaviorLifecycle,
 * }} Behavior
 */

/**
 * Event callback handler.
 *
 * @typedef {(
 *   this: HTMLElement,
 *   event: K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : Event
 * ) => any} EventHandler
 * @template {string} K Event name(s)
 */

/**
 * Callback or object of selector-scoped callbacks.
 *
 * @typedef {EventHandler<K> | Record<string, EventHandler<K>>} EventHandlerOrSelectorMap
 * @template {string} K Event name(s)
 */

/**
 * Object of component event handlers, where each event handler may be a callback function or an
 * object of selector-scoped callbacks.
 *
 * @typedef {Record<K, EventHandlerOrSelectorMap<K>>} Events
 * @template {string} K Event name(s)
 */

/**
 * @param {Events<K>} events Object of component event handlers, where each event handler may be a
 * callback function or an object of selector-scoped callbacks.
 * @param {Partial<BehaviorProps>} props Additional properties to include in public interface of
 * each initialized component.
 * @template {string} K Event name(s)
 *
 * @return {Behavior} Component initializer.
 */

module.exports = (events, props) => {
  // Normalize event handlers to an array of arguments to be passed to either `addEventListener` or
  // `removeEventListener` during component initialization.
  const listeners = Object.entries(events).flatMap(([eventTypes, handlers]) =>
    // Each event handler can be defined for one or more space-separated event names.
    eventTypes.split(" ").map(
      (eventType) =>
        // Generate arguments of `[add/remove]EventListener` as [eventType, callback]
        /** @type {[keyof HTMLElementEventMap, EventHandler<any>]} */ ([
          eventType,
          // Event handlers can be defined as a callback or object of selector-scoped callbacks. To
          // normalize as a function, create a function from a given object to perform the scoping
          // logic.
          typeof handlers === "function"
            ? handlers
            : (event) =>
                // When a handler is defined as an object, event handling should terminate if any of
                // the scoped callbacks return `false`. This is accomplished by iterating over the
                // object's values as an array and using `Array#some` to abort at the first `false`
                // return value.
                Object.entries(handlers).some(([selector, handler]) => {
                  // Since this event is attached at an ancestor and is handled using event
                  // delegation, ensure that the actual event target is within the scoped selector.
                  const target = event.target && event.target.closest(selector);
                  return target && handler.call(target, event) === false;
                }),
        ]),
    ),
  );

  /**
   * Initialize components within the given target, defaulting to the document body.
   *
   * @param {Element} target Ancestor element in which to initialized components.
   */
  const on = (target = document.body) => {
    if (props && props.init) {
      props.init(target);
    }

    listeners.forEach((args) => target.addEventListener(...args));
  };

  /**
   * Remove component behaviors within the given target, defaulting to the document body.
   *
   * @param {Element} target Ancestor element in which to remove component behaviors.
   */
  const off = (target = document.body) => {
    if (props && props.teardown) {
      props.teardown(target);
    }

    listeners.forEach((args) => target.removeEventListener(...args));
  };

  return { on, add: on, off, remove: off, ...props };
};
