'use strict';

var $ = window.jQuery = require('jquery');
var Accordion = require('./components/accordion');
var validator = require('./components/validator');
var toggleFormInput = require('./components/toggle-form-input');

// README: This is necessary because politespace doesn't properly export anything
// in its package.json. TODO: Let's open a PR related to this so we can fix it in Politespace.js
//
var Politespace = require('../../node_modules/politespace/src/politespace').Politespace;

$(function () {

	// jQuery Plugin

  var componentName = 'politespace',
    enhancedAttr = 'data-enhanced',
    initSelector = '[data-" + componentName + "]:not([" + enhancedAttr + "])';

  $.fn[ componentName ] = function (){
    return this.each(function (){
      var polite = new Politespace(this);
      if(polite.type === 'number') {
        polite.createProxy();
      }

      $(this)
        .bind('input keydown', function () {
          polite.updateProxy();
        })
        .bind('blur', function () {
          $(this).closest('.politespace-proxy').addClass('active');
          polite.update();
          polite.updateProxy();
        })
        .bind('focus', function () {
          $(this).closest('.politespace-proxy').removeClass('active');
          polite.reset();
        })
        .data(componentName, polite);

      polite.update();
    });
  };

	// auto-init on enhance (which is called on domready)
  $(document).ready(function () {
    $('[data-' + componentName + ']').politespace();
  });

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
