const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { CLICK } = require("../events");
const { prefix: PREFIX } = require("../config");

const HIDDEN = "hidden";
const SCOPE = `.${PREFIX}-footer--big`;
const NAV = `${SCOPE} nav`;
const BUTTON = `${NAV} .${PREFIX}-footer__primary-link`;
const COLLAPSIBLE = `.${PREFIX}-footer__primary-content--collapsible`;

// The minimum viewport width at which collapsable sections are
// always displayed. At exactly SHOW_MIN_WIDTH pixels, it will
// be expanded.
const SHOW_MIN_WIDTH = 480;

function showPanel() {
  if (window.innerWidth < SHOW_MIN_WIDTH) {
    const collapseEl = this.closest(COLLAPSIBLE);
    collapseEl.classList.toggle(HIDDEN);

    // NB: this *should* always succeed because the button
    // selector is scoped to ".{prefix}-footer-big nav"
    const collapsibleEls = select(COLLAPSIBLE, collapseEl.closest(NAV));

    collapsibleEls.forEach((el) => {
      if (el !== collapseEl) {
        el.classList.add(HIDDEN);
      }
    });
  }
}

const toggleHidden = (isHidden) =>
  select(COLLAPSIBLE).forEach((list) =>
    list.classList.toggle(HIDDEN, isHidden)
  );

const resize = (event) => toggleHidden(!event.matches);

module.exports = behavior(
  {
    [CLICK]: {
      [BUTTON]: showPanel,
    },
  },
  {
    // export for use elsewhere
    // Max width to hide at is 1 pixel underneath the
    // min width to show.
    HIDE_MAX_WIDTH: SHOW_MIN_WIDTH - 1,

    init() {
      toggleHidden(window.innerWidth < SHOW_MIN_WIDTH);
      this.mediaQueryList = window.matchMedia(
        `(min-width: ${SHOW_MIN_WIDTH}px)`
      );
      this.mediaQueryList.addListener(resize);
    },

    teardown() {
      this.mediaQueryList.removeListener(resize);
    },
  }
);
