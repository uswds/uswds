'use strict';

var $ = window.jQuery = require('jquery');
var validator = require('./components/validator');
var toggleFormInput = require('./components/toggle-form-input');

require('./initializers/politespace');
require('./initializers/accordions');
require('./initializers/footer');

$(function () {

  // Fixing skip nav focus behavior in chrome
  $('.skipnav').click(function (){
    $('#main-content').attr('tabindex', '0');
  });

  $('#main-content').blur(function (){
    $(this).attr('tabindex', '-1');
  });

  var $showPassword = $('.usa-show_password');
  var $formInput = $('.usa-show_multipassword');
  var $validator = $('.js-validate_password');

  $showPassword.length && toggleFormInput($showPassword, 'Show Password', 'Hide Password');
  $formInput.length && toggleFormInput($formInput, 'Show my typing', 'Hide my typing');
  $validator.length && validator($validator);
});
