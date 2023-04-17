const behavior = require("../../uswds-core/src/js/utils/behavior");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const accordion = require("../../usa-accordion/src/index");

const HEADER = `.${PREFIX}-banner__header`;
const EXPANDED_CLASS = `${PREFIX}-banner__header--expanded`;
const BUTTON = `.${PREFIX}-banner__button[aria-controls]`;

/**
 * Toggle expanded banner class.
 *
 * @param {*} event - The clicked banner button.
 */
const toggleBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(HEADER).classList.toggle(EXPANDED_CLASS);
};

const banner = behavior(
  {
    [CLICK]: {
      [`${HEADER} [aria-controls]`]: toggleBanner,
    },
  },
  {
    init(root) {
      const bannerButtons = root.querySelectorAll(BUTTON);

      bannerButtons.forEach((button) => {
        const parentBanner = button.closest(accordion.ACCORDION);

        accordion.on(parentBanner);
      });
    },
  }
);

module.exports = banner;
