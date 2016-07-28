
var $ = require('jquery');

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {jQuery} el A jQuery html element to turn into an accordion.
 */
function Accordion ($el) {
  var self = this; // Node
  this.$root = $el; // jQuery powered element

  // delegate click events on each <button>
  //         v------- utils/dispatch
  this.$root.on('click', 'button', function (ev) {
    var $button = $(this);
    //                     v--- utils/mod-attr
    var expanded = $button.attr('aria-expanded') === 'true';
    ev.preventDefault();
    //   v---- utils/mod-attr
    self.hideAll();
    if (!expanded) {
      self.show($button);
    }
  });

  // find the first expanded button
  //                   v------ utils/select
  var $expanded = this.$('button[aria-expanded=true]');
  //   v---- utils/mod-attr
  this.hideAll();
  if ($expanded.length) {
    //   v---- utils/mod-attr
    this.show($expanded);
  }
}

/**
 * @param {String} selector
 * @return {jQuery}
 */
Accordion.prototype.$ = function (selector) {
  //   v---- utils/select
  return this.$root.find(selector);
};

/**
 * @param {jQuery} button
 * @return {Accordion}
 */
Accordion.prototype.hide = function ($button) {
  //   v---- utils/mod-attr
  var selector = $button.attr('aria-controls'),
    //   v---- utils/select
    $content = this.$('#' + selector);

  //      v---- utils/mod-attr
  $button.attr('aria-expanded', false);
  //      v---- utils/mod-attr
  $content.attr('aria-hidden', true);
  return this;
};

/**
 * @param {jQuery} button
 * @return {Accordion}
 */
Accordion.prototype.show = function ($button) {
  //                     v---- utils/mod-attr
  var selector = $button.attr('aria-controls'),
    //              v---- utils/select
    $content = this.$('#' + selector);

  //      v---- utils/mod-attr
  $button.attr('aria-expanded', true);
  //       v---- utils/mod-attr
  $content.attr('aria-hidden', false);
  return this;
};

/**
 * @return {Accordion}
 */
Accordion.prototype.hideAll = function () {
  var self = this;
  this.$('button').each(function () {
    self.hide($(this));
  });
  return this;
};

module.exports = Accordion;
