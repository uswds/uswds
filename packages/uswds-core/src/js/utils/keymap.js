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
module.exports = (map) => (event) =>
  Object.keys(map).forEach((combo) => {
    // Each key combination can have one or more modifier, where each modifier is prefixed with the
    // modifier name and "+".
    const parts = combo.split("+");

    // The keyboard key name should come as the last part of a "+" delimited key. Popping the item
    // will result in `parts` only containing the modifiers to be checked.
    const key = parts.pop();

    const isModifierMatch = ["Shift", "Alt", "Ctrl", "Meta"]
      .filter((mod) => event.getModifierState(mod) || parts.includes(mod))
      .every((mod) => event.getModifierState(mod) && parts.includes(mod));

    if (key === event.key && isModifierMatch) {
      map[combo](event);
    }
  });
