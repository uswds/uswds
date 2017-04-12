'use strict';
const behavior = require('../utils/behavior');
const debounce = require('lodash.debounce');
const validate = require('../utils/validate-input');

const change = function (event) {
  return validate(this);
};

module.exports = behavior({
  'change keyup': {
    'input[data-validation-element]': change,
  },
});
