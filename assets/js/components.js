'use strict';

/* globals $: false */



/*! politespace - v0.1.5 - 2015-07-09
Politely add spaces to input values to increase readability (credit card numbers, phone numbers, etc).
 * https://github.com/filamentgroup/politespace
 * Copyright (c) 2015 Filament Group (@filamentgroup)
 * MIT License */
// TODO when moving to import system, install this with npm install politespace
(function( w ){
	"use strict";

	var Politespace = function( element ) {
		if( !element ) {
			throw new Error( "Politespace requires an element argument." );
		}

		if( !element.getAttribute ) {
			// Cut the mustard
			return;
		}

		this.element = element;
		this.type = this.element.getAttribute( "type" );
		this.delimiter = this.element.getAttribute( "data-delimiter" ) || " ";
		// https://en.wikipedia.org/wiki/Decimal_mark
		this.decimalMark = this.element.getAttribute( "data-decimal-mark" ) || "";
		this.reverse = this.element.getAttribute( "data-reverse" ) !== null;
		this.groupLength = this.element.getAttribute( "data-grouplength" ) || 3;
	};

	Politespace.prototype._divideIntoArray = function( value ) {
		var split = ( '' + this.groupLength ).split( ',' ),
			isUniformSplit = split.length === 1,
			dividedValue = [],
			loopIndex = 0,
			groupLength,
			substrStart,
			useCharCount;

		while( split.length && loopIndex < value.length ) {
			if( isUniformSplit ) {
				groupLength = split[ 0 ];
			} else {
				// use the next split or the rest of the string if open ended, ala "3,3,"
				groupLength = split.shift() || value.length - loopIndex;
			}

			// Use min if we’re at the end of a reversed string
			// (substrStart below grows larger than the string length)
			useCharCount = Math.min( parseInt( groupLength, 10 ), value.length - loopIndex );

			if( this.reverse ) {
				substrStart = -1 * (useCharCount + loopIndex);
			} else {
				substrStart = loopIndex;
			}
			dividedValue.push( value.substr( substrStart, useCharCount ) );
			loopIndex += useCharCount;
		}

		if( this.reverse ) {
			dividedValue.reverse();
		}

		return dividedValue;
	};

	Politespace.prototype.format = function( value ) {
		var split;
		var val = this.unformat( value );
		var suffix = '';

		if( this.decimalMark ) {
			split = val.split( this.decimalMark );
			suffix = split.length > 1 ? this.decimalMark + split[ 1 ] : '';
			val = split[ 0 ];
		}

		return this._divideIntoArray( val ).join( this.delimiter ) + suffix;
	};

	Politespace.prototype.trimMaxlength = function( value ) {
		var maxlength = this.element.getAttribute( "maxlength" );
		// Note input type="number" maxlength does nothing
		if( maxlength ) {
			value = value.substr( 0, maxlength );
		}
		return value;
	};

	Politespace.prototype.getValue = function() {
		return this.trimMaxlength( this.element.value );
	};

	Politespace.prototype.update = function() {
		this.element.value = this.useProxy() ? this.getValue() : this.format( this.getValue() );
	};

	Politespace.prototype.unformat = function( value ) {
		return value.replace( new RegExp(  this.delimiter, 'g' ), '' );
	};

	Politespace.prototype.reset = function() {
		this.element.value = this.unformat( this.element.value );
	};

	Politespace.prototype.useProxy = function() {
		return this.type === "number";
	};

	Politespace.prototype.updateProxy = function() {
		var proxy;
		if( this.useProxy() ) {
			proxy = this.element.parentNode.firstChild;
			proxy.innerHTML = this.format( this.getValue() );
			proxy.style.width = this.element.offsetWidth + "px";
		}
	};

	Politespace.prototype.createProxy = function() {
		if( !this.useProxy() ) {
			return;
		}

		function getStyle( el, prop ) {
			return window.getComputedStyle( el, null ).getPropertyValue( prop );
		}
		function sumStyles( el, props ) {
			var total = 0;
			for( var j=0, k=props.length; j<k; j++ ) {
				total += parseFloat( getStyle( el, props[ j ] ) );
			}
			return total;
		}

		var parent = this.element.parentNode;
		var el = document.createElement( "div" );
		var proxy = document.createElement( "div" );
		proxy.style.font = getStyle( this.element, "font" );
		proxy.style.paddingLeft = sumStyles( this.element, [ "padding-left", "border-left-width" ] ) + "px";
		proxy.style.paddingRight = sumStyles( this.element, [ "padding-right", "border-right-width" ] ) + "px";
		proxy.style.top = sumStyles( this.element, [ "padding-top", "border-top-width", "margin-top" ] ) + "px";

		el.appendChild( proxy );
		el.className = "politespace-proxy active";
		var formEl = parent.replaceChild( el, this.element );
		el.appendChild( formEl );

		this.updateProxy();
	};

	w.Politespace = Politespace;

}( this ));

(function( $ ) {
	"use strict";

	// jQuery Plugin

	var componentName = "politespace",
		enhancedAttr = "data-enhanced",
		initSelector = "[data-" + componentName + "]:not([" + enhancedAttr + "])";

	$.fn[ componentName ] = function(){
		return this.each( function(){
			var polite = new Politespace( this );
			if( polite.type === "number" ) {
				polite.createProxy();
			}

			$( this )
				.bind( "input keydown", function() {
					polite.updateProxy();
				})
				.bind( "blur", function() {
					$( this ).closest( ".politespace-proxy" ).addClass( "active" );
					polite.update();
					polite.updateProxy();
				})
				.bind( "focus", function() {
					$( this ).closest( ".politespace-proxy" ).removeClass( "active" );
					polite.reset();
				})
				.data( componentName, polite );

			polite.update();
		});
	};

	// auto-init on enhance (which is called on domready)
  $(document).ready(function() {
    $('[data-' + componentName + ']').politespace();
  });

}( jQuery ));

/**
 * Accordion
 *
 * An accordion component.
 *
 * @param {jQuery} $el A jQuery html element to turn into an accordion.
 */
function Accordion($el) {
  var self = this;
  this.$root = $el;
  this.$root.on('click', 'button', function(ev) {
    var expanded = JSON.parse($(this).attr('aria-expanded'));
    ev.preventDefault();
    self.hideAll();
    if (!expanded) {
      self.show($(this));
    }
  });
}

Accordion.prototype.$ = function(selector) {
  return this.$root.find(selector);
}

Accordion.prototype.hide = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', false);
  $content.attr('aria-hidden', true);
};

Accordion.prototype.show = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', true);
  $content.attr('aria-hidden', false);
};

Accordion.prototype.hideAll = function() {
  var self = this;
  this.$('button').each(function() {
    self.hide($(this));
  });
};

/**
 * accordion
 *
 * Initialize a new Accordion component.
 *
 * @param {jQuery} $el A jQuery html element to turn into an accordion.
 */
function accordion($el) {
  return new Accordion($el);
}

function togglePassword($el) {
  var fieldSelector =  '#' + $el.attr('aria-controls'),
      $field = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($field, showing);
    $el.text(showing ? 'Show password' : 'Hide password');
    showing = !showing;
  });
}

function toggleSSN($el) {
  var fieldSelector =  '#' + $el.attr('aria-controls'),
      $field = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($field, showing);
    $el.text(showing ? 'Show SSN' : 'Hide SSN');
    showing = !showing;
  });
}

function toggleMultiPassword($el) {
  var fieldSelector = '#password, #confirmPassword',
      $fields = $el.parents('form').find(fieldSelector),
      showing = false;

  $el.on('click', function(ev) {
    ev.preventDefault();
    toggleFieldMask($fields, showing);
    $el.text(showing ? 'Show my typing' : 'Hide my typing');
    showing = !showing;
  });
}

function toggleFieldMask($field, showing) {
  $field.attr('autocapitalize', 'off');
  $field.attr('autocorrect', 'off');
  $field.attr('type', showing ? 'password' : 'text');
}

function validator($el) {
  var data = $('#password[data-validation-element]').data(),
      key,
      validatorName,
      validatorPattern,
      $validatorCheckbox,
      $checkList = $($el.data('validationElement'));

  function validate() {
    for (key in data) {
      if (key.startsWith('validate')) {
        validatorName = key.split('validate')[1];
        validatorPattern = new RegExp(data[key]);
        $validatorCheckbox = $checkList.find('[data-validator=' +
            validatorName.toLowerCase() + ']');

        if (!validatorPattern.test($el.val())) {
          $validatorCheckbox.toggleClass('usa-checklist-checked', false);
        }
        else {
          $validatorCheckbox.toggleClass('usa-checklist-checked', true);
        }
      }
    }
  }

  $el.on('keyup', validate);
}

$(function() {
  $('[class^=usa-accordion]').each(function() {
    accordion($(this));
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
