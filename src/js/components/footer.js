var select = require('../utils/select');
var _ = require('lodash');

function removeClass (el, className) {
  var classList = el.className.split(/\s+/);
  el.className = _.reject(classList, function (c) {
    return c === className;
  }).join(' ');
  return el;
}

function addClass (el, className) {
  el.className += ' ' + className;
}

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

function attachPanelListener (el) {
  if (el.attachEvent) {
    el.attachEvent('onclick', showPanelListener); // support for IE8 is easy here
  } else {
    el.addEventListener('click', showPanelListener);
  }
}

function detachPanelListener (el) {
  if (el.detachEvent) {
    el.detachEvent('onclick', showPanelListener);
  } else {
    el.removeEventListener('click', showPanelListener);
  }
}

var showPanelListener = function () {
  var panelToShow = this.parentNode;
  var otherPanels = getSiblings(panelToShow);
  removeClass(panelToShow, 'hidden');
  _.each(otherPanels, function (el) {
    addClass(el, 'hidden');
  });
};

module.exports = function footerAccordion () {

  var navList = select('.usa-footer-big nav ul');
  var primaryLink = select('.usa-footer-big nav .usa-footer-primary-link');

  _.each(primaryLink, function (el) {
    detachPanelListener(el);
  });

  if (window.innerWidth < 600) {

    _.each(navList, function (el) {
      addClass(el, 'hidden');
    });

    _.each(primaryLink, function (el) {
      attachPanelListener(el);
    });

  } else {
    _.each(navList, function (el) {
      removeClass(el, 'hidden');
    });
  }
};
