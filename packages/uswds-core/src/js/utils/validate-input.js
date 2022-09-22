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

      if (!validatorCheckbox) {
        throw new Error(`No validator checkbox found for: "${validatorName}"`);
      }

      const checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);

      let validatorStatus = `${validatorCheckbox.textContent} status `;
      if(validatorCheckbox.classList.contains(CHECKED_CLASS)){
        validatorStatus += "complete";
      } else{
        validatorStatus += "incomplete";
      };

      validatorCheckbox.setAttribute("aria-label", validatorStatus);
      inputLabel += `${validatorStatus}. `;
      el.setAttribute("aria-label", inputLabel);
    }
  });
};
