const behavior = require("../utils/behavior");
const { CLICK } = require("../events");
const select = require("../utils/select");

const { prefix: PREFIX } = require("../config");

const SITE_ALERT_CLASS = `${PREFIX}-site-alert`;
const SITE_ALERT_CLOSE_BUTTON_ACTIVE_CLASS = `${SITE_ALERT_CLASS}--close-btn-active`;

const SITE_ALERT = `.${SITE_ALERT_CLASS}`;
const CLOSE_BUTTON = `.${SITE_ALERT_CLASS}__close-btn`;

/**
 * The elements within the site alert.
 * @typedef {Object} SiteAlertContext
 * @property {HTMLElement} siteAlertEl
 * @property {HTMLButtonElement} closeButtonEl
 */

/**
 * Get an object of elements belonging directly to the given
 * site alert component.
 *
 * @param {HTMLElement} el the element within the site alert
 * @returns {SiteAlertContext} elements
 */
const getSiteAlertContext = (el) => {
  const siteAlertEl = el.closest(SITE_ALERT);

  if (!siteAlertEl) {
    throw new Error(`Element is missing outer ${SITE_ALERT}`);
  }

  const closeButtonEl = siteAlertEl.querySelector(CLOSE_BUTTON);

  return {
    siteAlertEl,
    closeButtonEl,
  };
};

/**
 * Enhance a select element into a combo box component.
 *
 * @param {HTMLElement} _siteAlertEl The initial element of the combo box component
 */
const enhanceSiteAlert = (_siteAlertEl) => {
  const { siteAlertEl, closeButtonEl } = getSiteAlertContext(_siteAlertEl);
  if (closeButtonEl) {
    siteAlertEl.classList.add(SITE_ALERT_CLOSE_BUTTON_ACTIVE_CLASS);
  }
};

const closeBanner = function toggleEl(event) {
  event.preventDefault();
  this.closest(SITE_ALERT).hidden = true;
};

module.exports = behavior(
  {
    [CLICK]: {
      [CLOSE_BUTTON]: closeBanner,
    },
  },
  {
    init(root) {
      select(SITE_ALERT, root).forEach((siteAlertEl) => {
        enhanceSiteAlert(siteAlertEl);
      });
    },
  }
);
