var toggleFieldMask = require('./toggle-field-mask.js');

/**
 * Component that decorates an HTML element with the ability to toggle the
 * masked state of an input field (like a password) when clicked.
 * The ids of the fields to be masked will be pulled directly from the button's
 * `aria-controls` attribute.
 *
 * @param  {Array}  $el        jQuery wrapped DOM element
 * @param  {String} showText   Button text shown when field is being masked
 * @param  {String} hideText   Button text show when field is unmasked
 * @return {}
 */
var toggleFormInput = function ($el, showText, hideText) {
  var defaultSelectors = $el.attr('aria-controls');

  if (!defaultSelectors || defaultSelectors.trim().length === 0) {
    throw new Error('Did you forget to define selectors in the aria-controls attribute? Check element ' + $el.attr('class'));
  }

  var fieldSelector = getSelectors(defaultSelectors);
  var $fields = $el.parents('form').find(fieldSelector);
  var showing = false;

  $el.on('click', function (ev) {
    ev.preventDefault();
    toggleFieldMask($fields, showing);
    $el.text(showing ? showText : hideText);
    showing = !showing;
  });
};


/**
 * Helper function to turn a string of ids into valid selectors
 * @param  {String} selectors Space separated list of ids of fields to be masked
 * @return {String}           Comma separated list of selectors
 */
function getSelectors (selectors) {
  var selectorsList = selectors.split(' ');

  return selectorsList.map(function (selector) {
    return '#' + selector;
  }).join(', ');
}

module.exports = toggleFormInput;
