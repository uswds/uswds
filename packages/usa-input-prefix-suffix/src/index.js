const behavior = require("../../uswds-core/src/js/utils/behavior");
const select = require("../../uswds-core/src/js/utils/select");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { CLICK } = require("../../uswds-core/src/js/events");

const CONTAINER = `.${PREFIX}-input-group`;
const INPUT = `${CONTAINER} .${PREFIX}-input`;
const DECORATION = `${CONTAINER} .${PREFIX}-input-prefix, ${CONTAINER} .${PREFIX}-input-suffix`;
const FOCUS_CLASS = "is-focused";

function setFocus(el) {
  el.closest(CONTAINER).querySelector(`.${PREFIX}-input`).focus();
}

function handleFocus() {
  this.closest(CONTAINER).classList.add(FOCUS_CLASS);
}

function handleBlur() {
  this.closest(CONTAINER).classList.remove(FOCUS_CLASS);
}

const inputPrefixSuffix = behavior(
  {
    [CLICK]: {
      [DECORATION]() {
        setFocus(this);
      },
    },
  },
  {
    init(root) {
      select(INPUT, root).forEach((inputEl) => {
        inputEl.addEventListener("focus", handleFocus, false);
        inputEl.addEventListener("blur", handleBlur, false);
      });
    },
  }
);

module.exports = inputPrefixSuffix;
