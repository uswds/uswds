const behavior = require("../../uswds-core/src/js/utils/behavior");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const accordion = require("../../usa-accordion/src/index");

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;

/**
 * Toggle expanded banner class.
 *
 * @param {*} event - The clicked banner button.
 */
const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  event.target.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

const banner = behavior(
  {
    [CLICK]: {
      [`${HEADER} [aria-controls]`]: toggleBanner,
    },
  },
  {
    init(root) {
      // Initialize accordion if it hasn't already.
      // Required for modular import of Banner.
      if (!accordion.hasInit) {
        accordion.on(root);
        accordion.hasInit = true;
      }
    },
    teardown(root) {
      if (accordion.hasInit) {
        accordion.off(root);
        accordion.hasInit = false;
      }
    },
  }
);

module.exports = banner;
