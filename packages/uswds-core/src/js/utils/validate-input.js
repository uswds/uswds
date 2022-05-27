const validator = require("../../../../usa-validation/src");
const { prefix: PREFIX } = require("../config");

const CHECKED = "aria-checked";
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

  Object.entries(el.dataset).forEach(([key, value]) => {
    if (key.startsWith("validate")) {
      const validatorName = key.substr("validate".length).toLowerCase();
      const validatorPattern = new RegExp(value);
      const validatorSelector = `[data-validator="${validatorName}"]`;
      const validatorCheckbox = checkList.querySelector(validatorSelector);
      const hiddenCheckboxSpan = validatorCheckbox.querySelector(
        `[data-checklist-label="hidden"]`
      );

      if (!validatorCheckbox) {
        throw new Error(`No validator checkbox found for: "${validatorName}"`);
      }

      const checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
      validatorCheckbox.setAttribute(CHECKED, checked);

      if (hiddenCheckboxSpan) {
        hiddenCheckboxSpan.textContent = validatorCheckbox.classList.contains(
          CHECKED_CLASS
        )
        ? "Complete"
        : "Incomplete";
      }
    }
  });
};
