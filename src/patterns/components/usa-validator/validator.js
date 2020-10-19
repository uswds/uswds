'use strict';

const { behavior, validate } = require('../../../utils');

function change() {
  validate(this);
}

const validator = behavior({
  'keyup change': {
    'input[data-validation-element]': change
  }
});

module.exports = validator;
