'use strict';
const { behavior, toggleFormInput } = require('../../../utils');
const { prefix: PREFIX } = require('../../../config');

const CLICK = 'click';

const LINK = `.${PREFIX}-show-password, .${PREFIX}-show-multipassword`;

function toggle(event) {
  event.preventDefault();
  toggleFormInput(this);
}

module.exports = behavior({
  [CLICK]: {
    [LINK]: toggle
  }
});
