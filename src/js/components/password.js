'use strict';
const behavior = require('../utils/behavior');
const toggleFormInput = require('../utils/toggle-form-input');

const CLICK = require('../events').CLICK;
const PREFIX = require('../config').prefix;

const LINK = `.${PREFIX}-show_password, .${PREFIX}-show_multipassword`;

const toggle = function (event) {
  event.preventDefault();
  toggleFormInput(this);
};

module.exports = behavior({
  [ CLICK ]: {
    [ LINK ]: toggle,
  },
});
