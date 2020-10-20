const behavior = require("../utils/behavior");
const { CLICK } = require("../events");

const { prefix: PREFIX } = require("../config");

const SITE_ALERT_CLASS = `${PREFIX}-site-alert`;

const SITE_ALERT = `.${SITE_ALERT_CLASS}`;
const CLOSE_BUTTON = `.${SITE_ALERT_CLASS}__close-btn`;

const closeBanner = function toggleEl(event) {
    event.preventDefault();
    this.closest(SITE_ALERT).hidden = true;
};

module.exports = behavior({
    [CLICK]: {
        [CLOSE_BUTTON]: closeBanner,
    },
});
