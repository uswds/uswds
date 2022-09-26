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
      selectOrMatches(VALIDATE_INPUT, root).forEach((input) => {
        const validationParent = input.parentNode;
        const checklistItems =
          validationParent.querySelectorAll(CHECKLIST_ITEM);
        const statusSummaryContainer = document.createElement("span");

        input.setAttribute("aria-controls", "validate-code");
        statusSummaryContainer.classList.add("usa-sr-only");
        statusSummaryContainer.setAttribute("aria-live", "polite");
        statusSummaryContainer.setAttribute("aria-atomic", true);
        statusSummaryContainer.setAttribute("data-checklist-label", "");
        validationParent.append(statusSummaryContainer);

        checklistItems.forEach((listItem) => {
          let statusIncomplete  = "status incomplete";
          if (input.hasAttribute("data-validation-incomplete")) {
            statusIncomplete  = input.getAttribute("data-validation-incomplete");
          }
          listItem.setAttribute("tabindex", "0");
          listItem.setAttribute("aria-label", statusIncomplete );
        });
      });
    },
  }
);

module.exports = validator;
