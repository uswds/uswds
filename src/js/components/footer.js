
const debounce = require('lodash.debounce');
const forEach = require('array-foreach');
const behavior = require('../utils/behavior');
const select = require('../utils/select');

const { CLICK } = require('../events');
const { prefix: PREFIX } = require('../config');

const HIDDEN = 'hidden';
const SCOPE = `.${PREFIX}-footer-big`;
const NAV = `${SCOPE} nav`;
const BUTTON = `${NAV} .${PREFIX}-footer-primary-link`;
const LIST = `${NAV} ul`;

const HIDE_MAX_WIDTH = 600;
const DEBOUNCE_RATE = 180;

function showPanel() {
  if (window.innerWidth < HIDE_MAX_WIDTH) {
    const list = this.closest(LIST);
    list.classList.toggle(HIDDEN);

    // NB: this *should* always succeed because the button
    // selector is scoped to ".{prefix}-footer-big nav"
    const lists = list.closest(NAV)
      .querySelectorAll('ul');

    forEach(lists, (el) => {
      if (el !== list) {
        el.classList.add(HIDDEN);
      }
    });
  }
}

const resize = debounce(() => {
  const hidden = window.innerWidth < HIDE_MAX_WIDTH;
  forEach(select(LIST), (list) => {
    list.classList.toggle(HIDDEN, hidden);
  });
}, DEBOUNCE_RATE);

module.exports = behavior({
  [CLICK]: {
    [BUTTON]: showPanel,
  },
}, {
  // export for use elsewhere
  HIDE_MAX_WIDTH,
  DEBOUNCE_RATE,

  init() {
    resize();
    window.addEventListener('resize', resize);
  },

  teardown() {
    window.removeEventListener('resize', resize);
  },
});
