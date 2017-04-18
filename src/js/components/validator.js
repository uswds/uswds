'use strict';
const behavior = require('../utils/behavior');
const debounce = require('lodash.debounce');
const validate = require('../utils/validate-input');

const change = function (event) {
  return validate(this);
};

module.exports = behavior({
  'keyup change': {
    'input[data-validation-element]': change,
  },
});
