var select = require('../../utils/select');
var addClass = require('../../utils/add-class');
var removeClass = require('../../utils/remove-class');
var dispatch = require('../../utils/dispatch');

var clickHandler = ('ontouchstart' in document.documentElement ? 'touchstart' : 'click');

function toggleClass (element, className) {
  if (element.classList) {
    element.classList.toggle(className);
  }
}

function handleNavElements (e) {

  var toggleElements = select('.usa-overlay, .usa-nav');
  var navCloseElement = select('.usa-nav-close')[ 0 ];

  toggleElements.forEach(function (element) {
    toggleClass(element, 'is-visible');
  });
  toggleClass(document.body, 'usa-mobile_nav-active');
  navCloseElement.focus();
  shouldTrigger = false;
  return false;
}

function mobileInit () {
  var navElements = select('.usa-menu-btn, .usa-overlay, .usa-nav-close');

  navElements.forEach(function (element) {
    dispatch(element, clickHandler, handleNavElements);
  });
}

module.exports = mobileInit;