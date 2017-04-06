'use strict';
var select = require('../utils/select');

var SELECTOR_BUTTON = 'button.usa-accordion-button';
var SELECTOR_BUTTON_EXPANDED = SELECTOR_BUTTON + '[aria-expanded=true]';

/**
 * @name showPanelListener
 * @desc The event handler for clicking on a button in an accordion.
 * @param {HTMLElement} el - An HTML element most likely a <button>.
 * @param {Object} ev - A DOM event object.
 */
function showPanelListener (el, ev) {
  var expanded = el.getAttribute('aria-expanded') === 'true';
  this.hideAll();
  if (!expanded) {
    this.show(el);
  }
  return false;
}

/**
 * @name getTargetOf
 * @desc Get the target of an element, according to the id listed in its
 * `aria-controls` attribute.
 * @param {HTMLElement} source the source element
 * @return {Element} the target element
 * @throws {Error} an error is thrown if no such target exists
 */
function getTargetOf (source) {
  var id = source.getAttribute('aria-controls');
  var target = document.getElementById(id);
  if (target) {
    return target;
  } else {
    throw new Error('No accordion target with id "' + id + '" exists');
  }
}

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {HTMLElement} el An HTMLElement to turn into an accordion.
 */
function Accordion (el) {
  var self = this;
  this.root = el;

  // delegate click events on each <button>
  this.$(SELECTOR_BUTTON).forEach(function (button) {
    if (button.attachEvent) {
      button.attachEvent('onclick', showPanelListener.bind(self, button));
    } else {
      button.addEventListener('click', showPanelListener.bind(self, button));
    }
  });

  // find the first expanded button
  var expanded = this.select(SELECTOR_BUTTON_EXPANDED);
  this.hideAll();
  if (expanded !== undefined) {
    this.show(expanded);
  }
}

/**
 * @param {String} selector
 * @return {Element}
 */
Accordion.prototype.select = function (selector) {
  return this.$(selector)[ 0 ];
};

/**
 * @param {String} selector
 * @return {Array.HTMLElement}
 */
Accordion.prototype.$ = function (selector) {
  return select(selector, this.root);
};

/**
 * @param {HTMLElement} button
 * @param {Boolean} expanded
 */
Accordion.prototype.toggle = function (button, expanded) {
  var target = getTargetOf(button);
  button.setAttribute('aria-expanded', expanded);
  target.setAttribute('aria-hidden', !expanded);
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
  var self = this;
  this.$(SELECTOR_BUTTON).forEach(function (button) {
    self.hide(button);
  });
  return this;
};

module.exports = Accordion;
