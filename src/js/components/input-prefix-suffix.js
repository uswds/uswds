const behavior = require("../utils/behavior");
const select = require("../utils/select");
const { prefix: PREFIX } = require("../config");

const CONTAINER = `.${PREFIX}-input-group`;
const INPUT = `${CONTAINER} .${PREFIX}-input`;
const FOCUS_CLASS = "is-focused";

function handleFocus() {
  this.closest(CONTAINER).classList.add(FOCUS_CLASS);                         
}

function handleBlur() {
  this.closest(CONTAINER).classList.remove(FOCUS_CLASS); 
}

const inputPrefixSuffix = behavior(
  {},
  {
    init(root) {
      select(INPUT, root).forEach((inputEl) => {
        inputEl.addEventListener("focus", handleFocus, false);
        inputEl.addEventListener("blur", handleBlur, false);
      });
    }
  }
);

module.exports = inputPrefixSuffix;