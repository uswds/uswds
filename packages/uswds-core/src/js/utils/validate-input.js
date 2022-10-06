const debounce = require("./debounce");
const { prefix: PREFIX } = require("../config");

const CHECKED_CLASS = `${PREFIX}-checklist__item--checked`;

module.exports = function validate(el) {
  const id = el.dataset.validationElement;
  const checkList =
    id.charAt(0) === "#"
      ? document.querySelector(id)
      : document.getElementById(id);

  if (!checkList) {
    throw new Error(`No validation element found with id: "${id}"`);
  }

  let statusSummary = "";
  Object.entries(el.dataset).forEach(([key, value]) => {
    if (key.startsWith("validate")) {
      const validatorName = key.substr("validate".length).toLowerCase();
      const validatorPattern = new RegExp(value);
      const validatorSelector = `[data-validator="${validatorName}"]`;
      const validatorCheckbox = checkList.querySelector(validatorSelector);
      const validatorParent = el.parentNode;
      const statusSummaryContainer = validatorParent.querySelector(`[data-validation-status]`);

      const checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);

      if (!validatorCheckbox) {
        throw new Error(`No validator checkbox found for: "${validatorName}"`);
      }

      // Create status reports for checklist items
      let statusComplete = "status complete";
      let statusIncomplete = "status incomplete";
      let checkboxContent = `${validatorCheckbox.textContent} `;

      if (el.hasAttribute("data-validation-complete")) {
        statusComplete = el.getAttribute("data-validation-complete");
      }

      if (el.hasAttribute("data-validation-incomplete")) {
        statusIncomplete = el.getAttribute("data-validation-incomplete");
      }

      if(validatorCheckbox.classList.contains(CHECKED_CLASS)){
        checkboxContent += statusComplete;
      } else{
        checkboxContent += statusIncomplete;
      };

      // move status updates to aria-label on checklist item
      validatorCheckbox.setAttribute("aria-label", checkboxContent);

      // Create a summary of status for all checklist items
      statusSummary += `${checkboxContent}. `;

      // Add summary to screen reader summary container, after a delay
      ((debounce(() => {
        statusSummaryContainer.textContent = statusSummary;
      }, 1000)))();
    }
  });
};
