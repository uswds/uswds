var whenDOMReady = require('../utils/when-dom-ready');
var select = require('../utils/select');
var validator = require('../components/validator');
var toggleFormInput = require('../components/toggle-form-input');

whenDOMReady(function () {
  var elShowPassword = select('.usa-show_password')[ 0 ];
  var elFormInput = select('.usa-show_multipassword')[ 0 ];
  var elValidator = select('.js-validate_password')[ 0 ];

  elShowPassword && toggleFormInput(elShowPassword, 'Show Password', 'Hide Password');
  elFormInput && toggleFormInput(elFormInput, 'Show my typing', 'Hide my typing');
  elValidator && validator(elValidator);
});

