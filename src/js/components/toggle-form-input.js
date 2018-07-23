const toggleFormInput = require('../utils/toggle-form-input');

module.exports = (control) => {
  control.addEventListener('click', () => {
    toggleFormInput(control);
  });
};
