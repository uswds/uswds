'use strict';
const accordion = require('./accordion');
const behavior = require('../utils/behavior');
const debounce = require('lodash.debounce');
const select = require('../utils/select');

const PREFIX = require('../config').prefix;
const HIDDEN = 'hidden';
const SCOPE = `.${PREFIX}-footer-big`;
const LINK = `${SCOPE} nav .${PREFIX}-footer-primary-link`;
const LIST = `${SCOPE} nav ul`;

const HIDE_MAX_WIDTH = 600;
const DEBOUNCE_RATE = 180;

const showPanelListener = function () {
  var panelToShow = this.closest(accoridon.ACCORDION);
  panelToShow.classList.remove(HIDDEN);
  var otherPanels = accordion.getButtons(panelToShow);
  otherPanels.forEach(el => {
    if (el !== this) {
      el.classList.add(HIDDEN);
    }
  });
};

const resize = debounce(() => {
  const hidden = window.innerWidth < HIDE_MAX_WIDTH;
  select(LIST).forEach(el => {
    el.classList.toggle(HIDDEN, hidden);
  });
}, DEBOUNCE_RATE);

module.exports = behavior({
  'click': {
    [ LINK ]: showPanelListener,
  },
}, {
  init: target => {
    resize();
    window.addEventListener('resize', resize);
  },

  teardown: target => {
    window.removeEventListener('resize', resize);
  },
});
