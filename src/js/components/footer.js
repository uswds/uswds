
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
const COLLAPSIBLE = `.${PREFIX}-footer-collapsible`;

const HIDE_MAX_WIDTH = 600;
const DEBOUNCE_RATE = 180;

function showPanel() {
  if (window.innerWidth < HIDE_MAX_WIDTH) {
    const collapseEl = this.closest(COLLAPSIBLE);
    collapseEl.classList.toggle(HIDDEN);

    // NB: this *should* always succeed because the button
    // selector is scoped to ".{prefix}-footer-big nav"
    const collapsibleEls = collapseEl.closest(NAV)
      .querySelectorAll(COLLAPSIBLE);

    forEach(collapsibleEls, (el) => {
      if (el !== collapseEl) {
        el.classList.add(HIDDEN);
      }
    });
  }
}

const resize = debounce(() => {
  const hidden = window.innerWidth < HIDE_MAX_WIDTH;
  forEach(select(COLLAPSIBLE), list => list.classList.toggle(HIDDEN, hidden));
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
