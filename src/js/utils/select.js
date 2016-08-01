var _ = require('lodash');

/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {HTMLElement} context - The context to traverse the DOM in.
 * @return {Array.HTMLElement} - An array of DOM nodes or an empty array.
 */
module.exports = function select (selector, context) {

  if (!_.isString(selector)) {
    return [];
  }

  if (_.isUndefined(context) || !_.isElement(context)) {
    context = window.document;
  }

  var selection = context.querySelectorAll(selector);

  return Array.prototype.slice.call(selection);

};
