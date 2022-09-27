const behavior = require("../../uswds-core/src/js/utils/behavior");
const validate = require("../../uswds-core/src/js/utils/validate-input");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");

const VALIDATE_INPUT = "input[data-validation-element]";
const CHECKLIST_ITEM = `.${PREFIX}-checklist__item`;

function change() {
  validate(this);
}

const enhanceValidation = (target) => {
  selectOrMatches(VALIDATE_INPUT, target).forEach((input) => {
    const validationParent = input.parentNode;
    const checklistItems =
      validationParent.querySelectorAll(CHECKLIST_ITEM);

    // Set up input attributes
    input.setAttribute("aria-controls", "validate-code");

    // Create container to hold aria readout
    const statusSummaryContainer = document.createElement("span");
    statusSummaryContainer.setAttribute("data-validation-status", "");
    statusSummaryContainer.classList.add("usa-sr-only");
    statusSummaryContainer.setAttribute("aria-live", "polite");
    statusSummaryContainer.setAttribute("aria-atomic", true);
    validationParent.append(statusSummaryContainer);

    // Set up initial aria-label on checklist items
    checklistItems.forEach((listItem) => {
      let currentStatus = "status incomplete";
      if (input.hasAttribute("data-validation-incomplete")) {
        currentStatus = input.getAttribute("data-validation-incomplete");
      }
      const itemStatus = `${listItem.textContent} ${currentStatus} `;
      listItem.setAttribute("tabindex", "0");
      listItem.setAttribute("aria-label", itemStatus);
    });
  });
}

const validator = behavior(
  {
    "input change": {
      [VALIDATE_INPUT]: change,
    },
  },
  {
    init(root) {
      enhanceValidation(root);
    },
    enhance: enhanceValidation,
  }
);

module.exports = validator;
