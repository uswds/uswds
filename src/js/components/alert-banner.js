const behavior = require("../utils/behavior");
const { CLICK } = require("../events");

const { prefix: PREFIX } = require("../config");

const ALERT_BANNER_CLASS = `${PREFIX}-alert-banner`;

const ALERT_BANNER = `.${ALERT_BANNER_CLASS}`;
const CLOSE_BUTTON = `.${ALERT_BANNER_CLASS}__close-btn`;

const closeBanner = function toggleEl(event) {
    event.preventDefault();
    this.closest(ALERT_BANNER).hidden = true;
};

module.exports = behavior({
    [CLICK]: {
        [CLOSE_BUTTON]: closeBanner,
    },
});
