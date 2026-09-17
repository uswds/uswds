/**
 * @name isQueryContext
 * @desc returns whether the argument is a queryable DOM parent node.
 * @param {any} value
 * @return {boolean}
 */
const isQueryContext = (value) =>
  value &&
  typeof value === "object" &&
  (value.nodeType === 1 || value.nodeType === 9 || value.nodeType === 11) &&
  typeof value.querySelectorAll === "function";

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {Document|Element|DocumentFragment|null} [context] - The context to traverse the DOM
 *   in. If not provided, it defaults to the document.
 * @return {HTMLElement[]} - An array of DOM nodes or an empty array.
 */
module.exports = (selector, context) => {
  if (typeof selector !== "string") {
    return [];
  }

  if (!context || !isQueryContext(context)) {
    context = window.document; // eslint-disable-line no-param-reassign
  }

  const selection = context.querySelectorAll(selector);
  return Array.prototype.slice.call(selection);
};
