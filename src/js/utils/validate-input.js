'use strict';

const PREFIX = require('../config').prefix;
const CHECKED = 'aria-checked';
const CHECKED_CLASS = `${PREFIX}-checklist-checked`;
const dataset = require('../polyfills/dataset');

module.exports = function validate(el) {
  const data = el.dataset || dataset(el);
  const id = data.validationElement;
  const checkList = document.getElementById(id);
  if (!checkList) {
    throw new Error(
      `No validation element found with id: "${id}"`
    );
  }

  for (let key in data) {
    if (key.startsWith('validate')) {
      const validatorName = key.substr('validate'.length).toLowerCase();
      const validatorPattern = new RegExp(data[ key ]);
      const validatorSelector = `[data-validator="${validatorName}"]`;
      const validatorCheckbox = checkList.querySelector(validatorSelector);
      if (!validatorCheckbox) {
        throw new Error(
          `No validator checkbox found for: "${validatorName}"`
        );
      }

      const checked = validatorPattern.test(el.value);
      validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
      validatorCheckbox.setAttribute(CHECKED, checked);
    }
  }
};
