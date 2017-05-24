// TODO: remove this file in 2.0
const toggleFormInput = require('../utils/toggle-form-input');
const resolveIdRefs = require('resolve-id-refs');

module.exports = function (control, showText, hideText) {
  /*
  if (showText && hideText) {
    console.warn(
      'toggleFormInput() with 2 or more arguments will be deprecated in v2.0!',
      'Use the data-show-text and data-hide-text attributes instead.'
    );
  }
  */
  control.addEventListener('click', e => {
    toggleFormInput(control);
  });
};
