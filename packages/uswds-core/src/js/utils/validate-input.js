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

  const span_selector = ".usa-hidden-span";
  const hidden_span = document.querySelectorAll(span_selector);

  function createSpan() {
    if (document.querySelector(".usa-sr-only")) {
      console.log("if worked");
    } else {
      console.log("else worked");
      const checklistItems = [
        ...document.querySelectorAll(".usa-checklist__item"),
      ];
      const newSpan = document.createElement("SPAN");
      newSpan.className = "usa-sr-only";
      newSpan.textContent = "";
      for (const item of checklistItems) {
        console.log(item);
      }
    }
  }

  createSpan();

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
      validatorCheckbox.setAttribute(CHECKED, checked);
    }
  });
};
