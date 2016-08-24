var select = require('../../utils/select');
var addClass = require('../../utils/add-class');
var removeClass = require('../../utils/remove-class');
var dispatch = require('../../utils/dispatch');

var navElements = select('.usa-menu-btn, .usa-overlay, .usa-nav-close');
var toggleElements = select('.usa-overlay, .usa-nav');
var navCloseElement = select('.usa-nav-close')[ 0 ];

navElements.forEach(function (element) {
  dispatch(element, 'click touchstart', function (e) {
    toggleElements.forEach(function (element) {
      toggleClass(element, 'is-visible');
    });
    toggleClass(document.body, 'usa-mobile_nav-active');
    navCloseElement.focus();
    return false;
  });
});

function toggleClass (element, className) {
  if (element.classList) {
    element.classList.toggle(className);
  }
}
