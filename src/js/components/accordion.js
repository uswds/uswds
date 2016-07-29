var _ = require('lodash');
var select = require('../utils/select');

function showPanelListener(ev) {
  var button = this;
  var expanded = button.getAttribute('aria-expanded') === 'true';
  ev.preventDefault();
  self.hideAll();
  if (!expanded) {
    self.show(button);
  }
}

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {DOMElement} el A DOMElement to turn into an accordion.
 */
function Accordion (el) {
  var self = this; // Node
  this.root = el; // underlying DOM Element

  // delegate click events on each <button>
  _.each(select(this.root,"button"), function (el) {
    if (el.attachEvent) {
      el.attachEvent('onclick', showPanelListener);
    } else {
      el.addEventListener('click', showPanelListener);
    }
  });

  // find the first expanded button
  var expanded = this.$('button[aria-expanded=true]')[0];
  this.hideAll();
  if (expanded !== undefined) {
    this.show(expanded);
  }
}

/**
 * @param {String} selector
 * @return {Array}
 */
Accordion.prototype.$ = function (selector) {
  //   v---- utils/select
  return select(selector, this.root);
};

/**
 * @param {DOMElement} button
 * @return {Accordion}
 */
Accordion.prototype.hide = function (button) {
  var selector = button.getAttribute('aria-controls'),
    content = this.$('#' + selector)[0];

  button.setAttribute('aria-expanded', false);
  content.setAttribute('aria-hidden', true);
  return this;
};

/**
 * @param {DOMElement} button
 * @return {Accordion}
 */
Accordion.prototype.show = function (button) {
  var selector = button.getAttribute('aria-controls'),
    content = this.$('#' + selector)[0];

  button.setAttribute('aria-expanded', true);
  content.setAttribute('aria-hidden', false);
  return this;
};

/**
 * @return {Accordion}
 */
Accordion.prototype.hideAll = function () {
  var self = this;
  _.each(this.$('button'), function (button) {
    self.hide(button);
  });
  return this;
};

module.exports = Accordion;
