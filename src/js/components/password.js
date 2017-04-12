'use strict';
const behavior = require('../utils/behavior');
const validate = require('../utils/validate-input');
const toggleFormInput = require('../utils/toggle-form-input');

const PREFIX = require('../config').prefix;
const LINK = `${PREFIX}-show_password, ${PREFIX}-show_multipassword`;

const toggle = function (event) {
  event.preventDefault();
  toggleFormInput(this);
};

module.exports = behavior({
  'click': {
    [ LINK ]: toggle,
  },
  'keyup': {
    '.js-validate_password': validate,
  },
}, {
  init: target => {
    // ???
  },
});
