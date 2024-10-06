/**
 * @typedef {(event: KeyboardEvent) => any} KeyboardEventHandler
 */

/**
 * @typedef {Record<string, KeyboardEventHandler>} KeymapConfig
 */

/**
 * @param {KeymapConfig} map
 * @return {KeyboardEventHandler}
 */
module.exports = (map) => (event) =>
  Object.keys(map).forEach((combo) => {
    const parts = combo.split("+");
    const key = parts.pop();
    const isModifierMatch = ["Shift", "Alt", "Ctrl", "Meta"]
      .filter((mod) => event.getModifierState(mod) || parts.includes(mod))
      .every((mod) => event.getModifierState(mod) && parts.includes(mod));

    if (key === event.key && isModifierMatch) {
      map[combo](event);
    }
  });
