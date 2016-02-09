'use strict';

var $ = require('jquery');
var Accordion = require('./components/accordion');
var toggleFieldMask = require('./components/toggle-field-mask');
var togglePassword = require('./components/toggle-password');
var toggleMultiPassword = require('./components/toggle-multi-password');
var toggleSSN = require('./components/toggle-ssn');
var validator = require('./components/validator');

// README: This is necessary because politespace doesn't properly export anything
// in its package.json. TODO: Let's open a PR related to this so we can fix it in Politespace.js
//
var Politespace = require('../../node_modules/politespace/src/politespace').Politespace;

$(function() {

	// jQuery Plugin

	var componentName = "politespace",
		enhancedAttr = "data-enhanced",
		initSelector = "[data-" + componentName + "]:not([" + enhancedAttr + "])";

	$.fn[ componentName ] = function(){
		return this.each(function(){
			var polite = new Politespace(this);
			if(polite.type === "number") {
				polite.createProxy();
			}

			$(this)
				.bind("input keydown", function() {
					polite.updateProxy();
				})
				.bind("blur", function() {
					$(this).closest(".politespace-proxy").addClass("active");
					polite.update();
					polite.updateProxy();
				})
				.bind("focus", function() {
					$(this).closest(".politespace-proxy").removeClass("active");
					polite.reset();
				})
				.data(componentName, polite);

			polite.update();
		});
	};

	// auto-init on enhance (which is called on domready)
  $(document).ready(function() {
    $('[data-' + componentName + ']').politespace();
  });

  $('[class^=usa-accordion]').each(function() {
    new Accordion($(this));
  });

  var footerAccordion = function() {
    if (window.innerWidth < 600) {

      $('.usa-footer-big nav ul').addClass('hidden');

      $('.usa-footer-big nav .usa-footer-primary-link').unbind('click');

      $('.usa-footer-big nav .usa-footer-primary-link').bind('click', function() {
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
  $('.skipnav').click(function(){
    $('#main-content').attr('tabindex','0');
  });

  $('#main-content').blur(function(){
    $(this).attr('tabindex','-1');
  });

  togglePassword($('.usa-show_password'));
  toggleMultiPassword($('.usa-show_multipassword'));
  toggleSSN($('.usa-show_ssn'));
  validator($('.js-validate_password'));

});

