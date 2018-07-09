
const behavior = require('../utils/behavior');
const toggleFormInput = require('../utils/toggle-form-input');

const { CLICK } = require('../events');
const { PREFIX } = require('../config');

const LINK = `.${PREFIX}-show_password, .${PREFIX}-show_multipassword`;

const toggle = (event) => {
  event.preventDefault();
  toggleFormInput(this);
};

module.exports = behavior({
  [ CLICK ]: {
    [ LINK ]: toggle,
  },
});
