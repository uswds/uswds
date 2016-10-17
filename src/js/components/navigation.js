var select = require('../utils/select');
var dispatch = require('../utils/dispatch');

var clickEvent = ('ontouchstart' in document.documentElement ? 'touchstart' : 'click');
var dispatchers = [];

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

function navInit () {
  var navElements = select('.usa-menu-btn, .usa-overlay, .usa-nav-close');

  dispatchers = navElements.map(function (element) {
    return dispatch(element, clickEvent, handleNavElements);
  });
}

function navOff () {
  while (dispatchers.length) {
    dispatchers.pop().off();
  }
}

module.exports = navInit;
module.exports.off = navOff;
