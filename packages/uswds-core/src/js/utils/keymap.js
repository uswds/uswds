/**
 * Callback to be called when key is pressed.
 *
 * @typedef {(event: KeyboardEvent) => any} KeyboardEventHandler
 */

/**
 * Object with keyboard key combination as object key, and corresponding callback handler as value.
 *
 * @typedef {Record<string, KeyboardEventHandler>} KeymapConfig
 */

/**
 * Initialize keyboard events with an object of keyboard key combinations and corresponding event
 * handlers.
 *
 * @param {KeymapConfig} map
 * @return {KeyboardEventHandler}
 */
// Maps the authoring-facing modifier name used in combo strings to the name recognized by
// `KeyboardEvent.getModifierState()`. Every name matches except "Ctrl", whose DOM name is
// "Control".
const MODIFIER_STATE_NAMES = {
  Shift: "Shift",
  Alt: "Alt",
  Ctrl: "Control",
  Meta: "Meta",
};

module.exports = (map) => (event) => {
  // Bail out if this is not a KeyboardEvent (e.g. InputEvent from datalist
  // selection). Only KeyboardEvents have `key` and `getModifierState`.
  if (
    !(event instanceof KeyboardEvent) ||
    typeof event.key === "undefined" ||
    typeof event.getModifierState !== "function"
  ) {
    return;
  }

  Object.keys(map).forEach((combo) => {
    // Each key combination can have one or more modifier, where each modifier is prefixed with the
    // modifier name and "+".
    const parts = combo.split("+");

    // The keyboard key name should come as the last part of a "+" delimited key. Popping the item
    // will result in `parts` only containing the modifiers to be checked.
    const key = parts.pop();

    // Verify that the modifiers on the event are exactly equal to the modifiers specified in the
    // key combination. `getModifierState` only recognizes the spec modifier name "Control", not
    // "Ctrl", so map the authoring-facing name to the DOM name here.
    const isModifierMatch = Object.keys(MODIFIER_STATE_NAMES)
      // For any modifier active in the event (or vice-versa, expected in the key combination)...
      .filter(
        (mod) =>
          event.getModifierState(MODIFIER_STATE_NAMES[mod]) ||
          parts.includes(mod),
      )
      // Ensure that it is expected in the key combination (or vice-versa, active in the event).
      .every(
        (mod) =>
          event.getModifierState(MODIFIER_STATE_NAMES[mod]) &&
          parts.includes(mod),
      );

    if (key === event.key && isModifierMatch) {
      map[combo](event);
    }
  });
};
