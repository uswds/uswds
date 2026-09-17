(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.accordion = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const select = require("../../uswds-core/src/js/utils/select");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const toggle = require("../../uswds-core/src/js/utils/toggle");
const isElementInViewport = require("../../uswds-core/src/js/utils/is-in-viewport");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const ACCORDION = `.${PREFIX}-accordion, .${PREFIX}-accordion--bordered`;
const BANNER_BUTTON = `.${PREFIX}-banner__button`;
const BUTTON = `.${PREFIX}-accordion__button[aria-controls]:not(${BANNER_BUTTON})`;
const EXPANDED = "aria-expanded";
const MULTISELECTABLE = "data-allow-multiple";

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
const getAccordionButtons = (accordion) => {
  const buttons = select(BUTTON, accordion);

  return buttons.filter((button) => button.closest(ACCORDION) === accordion);
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
const toggleButton = (button, expanded) => {
  const accordion = button.closest(ACCORDION);

  if (!accordion) {
    throw new Error(`${BUTTON} is missing outer ${ACCORDION}`);
  }

  const safeExpanded = toggle(button, expanded);

  // XXX multiselectable is opt-in, to preserve legacy behavior
  const multiselectable = accordion.hasAttribute(MULTISELECTABLE);

  if (safeExpanded && !multiselectable) {
    getAccordionButtons(accordion).forEach((other) => {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
const showButton = (button) => toggleButton(button, true);

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
const hideButton = (button) => toggleButton(button, false);

const accordion = behavior(
  {
    [CLICK]: {
      [BUTTON]() {
        toggleButton(this);

        if (this.getAttribute(EXPANDED) === "true") {
          // We were just expanded, but if another accordion was also just
          // collapsed, we may no longer be in the viewport. This ensures
          // that we are still visible, so the user isn't confused.
          if (!isElementInViewport(this)) this.scrollIntoView();
        }
      },
    },
  },
  {
    init(root) {
      select(BUTTON, root).forEach((button) => {
        const expanded = button.getAttribute(EXPANDED) === "true";
        toggleButton(button, expanded);
      });
    },
    ACCORDION,
    BUTTON,
    show: showButton,
    hide: hideButton,
    toggle: toggleButton,
    getButtons: getAccordionButtons,
  },
);

module.exports = accordion;

},{"../../uswds-core/src/js/config":2,"../../uswds-core/src/js/events":3,"../../uswds-core/src/js/utils/behavior":4,"../../uswds-core/src/js/utils/is-in-viewport":5,"../../uswds-core/src/js/utils/select":6,"../../uswds-core/src/js/utils/toggle":7}],2:[function(require,module,exports){
module.exports = {
  prefix: "usa",
};

},{}],3:[function(require,module,exports){
module.exports = {
  // This used to be conditionally dependent on whether the
  // browser supported touch events; if it did, `CLICK` was set to
  // `touchstart`.  However, this had downsides:
  //
  // * It pre-emptied mobile browsers' default behavior of detecting
  //   whether a touch turned into a scroll, thereby preventing
  //   users from using some of our components as scroll surfaces.
  //
  // * Some devices, such as the Microsoft Surface Pro, support *both*
  //   touch and clicks. This meant the conditional effectively dropped
  //   support for the user's mouse, frustrating users who preferred
  //   it on those systems.
  CLICK: "click",
};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
// https://stackoverflow.com/a/7557433
function isElementInViewport(
  el,
  win = window,
  docEl = document.documentElement,
) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (win.innerHeight || docEl.clientHeight) &&
    rect.right <= (win.innerWidth || docEl.clientWidth)
  );
}

module.exports = isElementInViewport;

},{}],6:[function(require,module,exports){
/**
 * @name isElement
 * @desc returns whether or not the given argument is a DOM element.
 * @param {any} value
 * @return {boolean}
 */
const isElement = (value) =>
  value && typeof value === "object" && value.nodeType === 1;

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|HTMLElement?} context - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = (selector, context) => {
  if (typeof selector !== "string") {
    return [];
  }

  if (!context || !isElement(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  const selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};

},{}],7:[function(require,module,exports){
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";

module.exports = (button, expanded) => {
  let safeExpanded = expanded;

  if (typeof safeExpanded !== "boolean") {
    safeExpanded = button.getAttribute(EXPANDED) === "false";
  }

  button.setAttribute(EXPANDED, safeExpanded);

  const id = button.getAttribute(CONTROLS);
  const root =
    typeof button.getRootNode === "function" ? button.getRootNode() : document;
  const controls =
    typeof root.getElementById === "function"
      ? root.getElementById(id)
      : document.getElementById(id);
  if (!controls) {
    throw new Error(`No toggle target found with id: "${id}"`);
  }

  if (safeExpanded) {
    controls.removeAttribute(HIDDEN);
  } else {
    controls.setAttribute(HIDDEN, "");
  }

  return safeExpanded;
};

},{}]},{},[1])(1)
});
