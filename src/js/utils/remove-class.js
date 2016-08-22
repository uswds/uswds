/**
 * Removes a class from a given HTML elementement.
 * @param {HTMLElement} element - The element from which the class will be removed
 * @param {String} className - The name of the class to remove
 */

module.exports = function removeClass (element, className) {
  var classList = element.classList;

  if (classList !== undefined) {
    classList.remove(className);
  }
  else
  {
    classList = element.className.split(/\s+/);
    var newClassList = [];
    classList.forEach(function (c) {
      if (c !== className) {
        newClassList.push(c);
      }
    });
    element.className = newClassList.join(' ');
  }
};
