
var $ = require('jquery');

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {jQuery} el A jQuery html element to turn into an accordion.
 */
function Accordion ($el) {
  var self = this;
  this.$root = $el;

  // delegate click events on each <button>
  this.$root.on('click', 'button', function (ev) {
    var $button = $(this);
    var expanded = $button.attr('aria-expanded') === 'true';
    ev.preventDefault();
    self.hideAll();
    if (!expanded) {
      self.show($button);
    }
  });

  // find the first expanded button
  var $expanded = this.$('button[aria-expanded=true]');
  this.hideAll();
  if ($expanded.length) {
    this.show($expanded);
  }
}

/**
 * @param {String} selector
 * @return {jQuery}
 */
Accordion.prototype.$ = function (selector) {
  return this.$root.find(selector);
};

/**
 * @param {jQuery} button
 * @return {Accordion}
 */
Accordion.prototype.hide = function ($button) {
  var selector = $button.attr('aria-controls'),
    $content = this.$('#' + selector);

  $button.attr('aria-expanded', false);
  $content.attr('aria-hidden', true);
  return this;
};

/**
 * @param {jQuery} button
 * @return {Accordion}
 */
Accordion.prototype.show = function ($button) {
  var selector = $button.attr('aria-controls'),
    $content = this.$('#' + selector);

  $button.attr('aria-expanded', true);
  $content.attr('aria-hidden', false);
  return this;
};

/**
 * @return {Accordion}
 */
Accordion.prototype.hideAll = function () {
  var self = this;
  this.$('ul > li > button, .usa-accordion-button').each(function () {
    self.hide($(this));
  });
  return this;
};

module.exports = Accordion;
