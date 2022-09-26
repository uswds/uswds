const behavior = require("../../uswds-core/src/js/utils/behavior");
const validate = require("../../uswds-core/src/js/utils/validate-input");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");

const VALIDATE_INPUT = "input[data-validation-element]";
const CHECKLIST_ITEM = `.${PREFIX}-checklist__item`;

function change() {
  validate(this);
}

const validator = behavior(
  {
    "input change": {
      [VALIDATE_INPUT]: change,
    },
  },
  {
    init(root) {
      selectOrMatches(VALIDATE_INPUT, root).forEach((item) => {
        const validationParent = item.parentNode;
        const checklistItems =
          validationParent.querySelectorAll(CHECKLIST_ITEM);
        const statusSummary = document.createElement("span");

        item.setAttribute("aria-controls", "validate-code");
        statusSummary.classList.add("usa-sr-only");
        statusSummary.setAttribute("aria-live", "polite");
        statusSummary.setAttribute("aria-atomic", true);
        statusSummary.setAttribute("data-checklist-label", "");
        validationParent.append(statusSummary);

        checklistItems.forEach((listItem) => {
          const itemStatus = `${listItem.textContent} status incomplete`;
          listItem.setAttribute("tabindex", "0");
          listItem.setAttribute("aria-label", itemStatus);
        });
      });
    },
  }
);

module.exports = validator;
