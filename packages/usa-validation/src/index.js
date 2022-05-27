const select = require("../../uswds-core/src/js/utils/select");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const validate = require("../../uswds-core/src/js/utils/validate-input");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const ITEM = `.${PREFIX}-checklist__item`;

function change() {
  validate(this);
}

const validator = behavior(
  {
    "keyup change": {
      "input[data-validation-element]": change,
    },
  },
  {
    init(root) {
      select(ITEM, root).forEach((item) => {
        const newSpan = document.createElement("SPAN");
        newSpan.classList.add("usa-sr-only");
        newSpan.textContent = "Incomplete";
        newSpan.setAttribute("data-checklist-label", "hidden");
        item.append(newSpan);
      });
    },
  }
);

module.exports = validator;
