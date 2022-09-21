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

  // create element to hold aria-label content for input element
  let inputLabel = "";
  Object.entries(el.dataset).forEach(([key, value]) => {
    if (key.startsWith("validate")) {
      const validatorName = key.substr("validate".length).toLowerCase();
      const validatorPattern = new RegExp(value);
      const validatorSelector = `[data-validator="${validatorName}"]`;
      const validatorCheckbox = checkList.querySelector(validatorSelector);
      const hiddenCheckboxSpan = validatorCheckbox.querySelector(
        `[data-checklist-label]`
      );

      if (!validatorCheckbox) {
        throw new Error(`No validator checkbox found for: "${validatorName}"`);
      }

      const checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);

      hiddenCheckboxSpan.textContent = validatorCheckbox.classList.contains(
        CHECKED_CLASS
      )
        ? " status complete. "
        : " status incomplete. ";

      // gather text content from checklist items into one element for aria-label
      inputLabel += `${validatorCheckbox.innerText} `;
      // apply new aria-label content to input element
      el.setAttribute("aria-label", inputLabel);
    }
  });
};
