/**
 * Adds a class to a given HTML element.
 * @param {HTMLElement} element - The element to which the class will be added
 * @param {String} className - The name of the class to add
 */

module.exports = function addClass (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }
};