var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

function getSiblings (el) {
  var n = el.parentNode.firstChild;
  var matches = [];

  while (n) {
    if (n.nodeType == 1 && n != el) {
      matches.push(n);
    }
    n = n.nextSibling;
  }

  return matches;
}

var showPanelListener = function () {
  var panelToShow = this.parentNode;
  var otherPanels = getSiblings(panelToShow);
  removeClass(panelToShow, 'hidden');
  otherPanels.forEach(function (el) {
    addClass(el, 'hidden');
  });
};

var events= [];

module.exports = function footerAccordion () {

  var navList = select('.usa-footer-big nav ul');
  var primaryLink = select('.usa-footer-big nav .usa-footer-primary-link');

  if (events.length) {
    events.forEach(function (e) {
      e.off();
    });
    events = [];
  }

  if (window.innerWidth < 600) {

    navList.forEach(function (el) {
      addClass(el, 'hidden');
    });

    primaryLink.forEach(function (el) {
      events.push(
        dispatch(el, 'click', showPanelListener)
      );
    });

  } else {
    navList.forEach(function (el) {
      removeClass(el, 'hidden');
    });
  }
};
