'use strict';
const behavior = require('../utils/behavior');
const validate = require('../utils/validate-input');
const debounce = require('lodash.debounce');

const change = function (event) {
  return validate(this);
};

const validator = behavior({
  'keyup change': {
    'input[data-validation-element]': change,
  },
});

/**
 * TODO for 2.0, remove this statement and export `navigation` directly:
 *
 * module.exports = behavior({...});
 */
const assign = require('object-assign');
module.exports = assign(
  el => validator.on(el),
  validator
);
