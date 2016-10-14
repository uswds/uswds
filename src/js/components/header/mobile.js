var select = require('../../utils/select');
var dispatch = require('../../utils/dispatch');

var clickEvent = ('ontouchstart' in document.documentElement ? 'touchstart' : 'click');

function handleNavElements (e) {

  var toggleElements = select('.usa-overlay, .usa-nav');
  var navCloseElement = select('.usa-nav-close')[ 0 ];

  toggleElements.forEach(function (element) {
    element.classList.toggle('is-visible');
  });

  document.body.classList.toggle('usa-mobile_nav-active');
  navCloseElement.focus();

  return false;
}

function mobileInit () {
  var navElements = select('.usa-menu-btn, .usa-overlay, .usa-nav-close');

  navElements.forEach(function (element) {
    dispatch(element, clickEvent, handleNavElements);
  });
}

module.exports = mobileInit;
