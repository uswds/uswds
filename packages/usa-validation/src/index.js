const behavior = require("../../uswds-core/src/js/utils/behavior");
const validate = require("../../uswds-core/src/js/utils/validate-input");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");

const VALIDATE_INPUT = "input[data-validation-element]";
const CHECKLIST = `.${PREFIX}-checklist`;
const CHECKLIST_ITEM = `.${PREFIX}-checklist__item`;

function change() {
  validate(this);
}

function createHiddenLabel() {
  const hiddenLabel = document.createElement("span");

  hiddenLabel.classList.add("usa-sr-only");
  hiddenLabel.textContent = "Incomplete";
  hiddenLabel.setAttribute("data-checklist-label", "");

  return hiddenLabel;
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
        const checklist = validationParent.querySelectorAll(CHECKLIST);
        const checklistItems =
          validationParent.querySelectorAll(CHECKLIST_ITEM);

        item.setAttribute("aria-controls", "validate-code");

        checklist.forEach((list) => {
          list.setAttribute("aria-live", "polite");
          list.setAttribute("aria-atomic", true);
        });

        checklistItems.forEach((listItem) => {
          const newSpan = createHiddenLabel();
          listItem.appendChild(newSpan);
        });
      });
    },
  }
);

module.exports = validator;
