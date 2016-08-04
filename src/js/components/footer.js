var select = require('../utils/select');
var _ = require('lodash');
var dispatch = require('../utils/dispatch');

function removeClass (el, className) {
  var classList = el.className.split(/\s+/);
  el.className = _.reject(classList, function (c) {
    return c === className;
  }).join(' ');
  return el;
}

function addClass (el, className) {
  if (el.className.length) el.className += ' ';
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

var showPanelListener = function () {
  var panelToShow = this.parentNode;
  var otherPanels = getSiblings(panelToShow);
  removeClass(panelToShow, 'hidden');
  _.each(otherPanels, function (el) {
    addClass(el, 'hidden');
  });
};

var events= [];

module.exports = function footerAccordion () {

  var navList = select('.usa-footer-big nav ul');
  var primaryLink = select('.usa-footer-big nav .usa-footer-primary-link');

  if (events.length) {
    _.each(events, function (e) {
      e.off();
    });
    events = [];
  }

  if (window.innerWidth < 600) {

    _.each(navList, function (el) {
      addClass(el, 'hidden');
    });

    _.each(primaryLink, function (el) {
      events.push(
        dispatch(el, 'click', showPanelListener)
      );
    });

  } else {
    _.each(navList, function (el) {
      removeClass(el, 'hidden');
    });
  }
};
