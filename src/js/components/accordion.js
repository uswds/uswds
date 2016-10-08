var select = require('../utils/select');
var dispatch = require('../utils/dispatch');

var EXPANDED = 'aria-expanded';

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {HTMLElement} el An HTMLElement to turn into an accordion.
 */
function Accordion (el) {
  this.root = el;

  var buttons = select('button', this.root);
  var expanded;

  // delegate click events on each <button>
  buttons.forEach(function (button) {
    this.toggle(button, button.getAttribute(EXPANDED) === 'true');
    dispatch(button, 'click', this.toggle.bind(this, el));
  }, this);
}

/**
 * @param {String} selector
 * @return {Element}
 */
Accordion.prototype.select = function (selector) {
  return this.root.querySelector(selector);
};

/**
 * @param {String} selector
 * @return {Array}
 */
Accordion.prototype.selectAll = function (selector) {
  return select(selector, this.root);
};

/**
 * @param {HTMLElement} button
 * @param {Boolean?} expanded
 * @return {Accordion}
 */
Accordion.prototype.toggle = function (button, expanded) {
  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) !== 'true';
  }
  button.setAttribute(EXPANDED, expanded);
  var controls = button.getAttribute('aria-controls');
  var ids = controls ? controls.split(' ') : [];
  ids.forEach(function (id) {
    document.getElementById(id).hidden = !expanded;
  });
  return this;
};

/**
 * @param {HTMLElement} button
 * @return {Accordion}
 */
Accordion.prototype.hide = function (button) {
  return this.toggle(button, false);
};

/**
 * @param {HTMLElement} button
 * @return {Accordion}
 */
Accordion.prototype.show = function (button) {
  return this.toggle(button, true);
};

/**
 * @return {Accordion}
 */
Accordion.prototype.hideAll = function () {
  var buttons = this.selectAll('button[aria-controls]');
  buttons.forEach(this.hide, this);
  return this;
};

module.exports = Accordion;
