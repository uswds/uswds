/**
 * @typedef {(target?: HTMLElement) => any} BehaviorLifecycle
 */

/**
 * @typedef {Record<string, any> & { init: BehaviorLifecycle, teardown: BehaviorLifecycle }} BehaviorProps
 */

/**
 * @typedef {BehaviorProps & {
 *   on: BehaviorLifecycle,
 *   off: BehaviorLifecycle,
 *   add: BehaviorLifecycle,
 *   remove: BehaviorLifecycle,
 * }} Behavior
 */

/**
 * @typedef {(
 *   this: HTMLElement,
 *   event: K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : Event
 * ) => any} EventHandler
 * @template K
 */

/**
 * @typedef {EventHandler<K> | Record<string, EventHandler<K>>} EventHandlerOrSelectorMap
 * @template K
 */

/**
 * @typedef {Record<K, EventHandlerOrSelectorMap<K>>} Events
 * @template K
 */

/**
 * @param {Events<K>} events
 * @param {Partial<BehaviorProps>} props
 * @template K
 *
 * @return {Behavior}
 */
module.exports = (events, props) => {
  const listeners = Object.entries(events).flatMap(([eventTypes, handlers]) =>
    eventTypes.split(" ").map((eventType) => [
      eventType,
      typeof handlers === "function"
        ? handlers
        : (event) =>
            Object.entries(handlers).some(([selector, handler]) => {
              const target = event.target && event.target.closest(selector);
              return target && handler.call(target, event) === false;
            }),
    ])
  );

  const on = (target = document.body) => {
    if (props && props.init) {
      props.init(target);
    }

    listeners.forEach((args) => target.addEventListener(...args));
  };

  const off = (target = document.body) => {
    if (props && props.teardown) {
      props.teardown(target);
    }

    listeners.forEach((args) => target.removeEventListener(...args));
  };

  return { on, add: on, off, remove: off, ...props };
};
