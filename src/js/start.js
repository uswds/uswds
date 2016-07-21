'use strict';

var $ = window.jQuery = require('jquery');
var Accordion = require('./components/accordion');
var validator = require('./components/validator');
var toggleFormInput = require('./components/toggle-form-input');

require('./initializers/politespace');

$(function () {

  $('.usa-accordion,.usa-accordion-bordered').each(function () {
    new Accordion($(this));
  });

  var footerAccordion = function () {
    if (window.innerWidth < 600) {

      $('.usa-footer-big nav ul').addClass('hidden');

      $('.usa-footer-big nav .usa-footer-primary-link').unbind('click');

      $('.usa-footer-big nav .usa-footer-primary-link').bind('click', function () {
        $(this).parent().removeClass('hidden')
        .siblings().addClass('hidden');
      });
    } else {

      $('.usa-footer-big nav ul').removeClass('hidden');

      $('.usa-footer-big nav .usa-footer-primary-link').unbind('click');
    }
  };

  footerAccordion();

  $(window).resize(footerAccordion);

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
