// TODO: remove this file in 2.0
const resolveIdRefs = require('resolve-id-refs');
const toggleFormInput = require('../utils/toggle-form-input');

module.exports = (control, showText, hideText) => {
  control.addEventListener('click', (e) => {
    toggleFormInput(control);
  });
};
