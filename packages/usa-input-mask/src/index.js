const keymap = require("receptor/keymap");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { CLICK } = require("../../uswds-core/src/js/events");
// const Sanitizer = require("../../uswds-core/src/js/utils/sanitizer");

const INPUT_MASK_CLASS = `${PREFIX}-input-mask`;
const INPUT_MASK = `.${INPUT_MASK_CLASS}`;
const INPUT_SHELL = "shell";

// User defined Values
// const maskedInputs = document.getElementsByClassName(MASKED_CLASS);
const maskedNumber = "XdDmMyY9";
const maskedLetter = "_";

// replaces each masked input with a shall containing the input and it's mask.
const createShell = (input) => {
  const placeholder = input.getAttribute("placeholder");
  if (placeholder.length > 0 && placeholder !== " ") {
    input.setAttribute("maxlength", placeholder.length);
    input.setAttribute("data-placeholder", placeholder);
    input.removeAttribute("placeholder");
  }

  /* input.insertAdjacentHTML(
    "beforeend",
    Sanitizer.escapeHTML`
    <span class="shell"><span aria-hidden="true" id="${input.id}Mask"><i></i>${placeholder}</span>${input.outerHTML}</span>
    `
  ); */
  let text = "";
  text = `<span class="shell"><span aria-hidden="true" id="${input.id}Mask"><i></i>${placeholder}</span>${input.outerHTML}</span>`;

  // const text = document.createElement("span");
  // text.setAttribute("class", `${INPUT_SHELL}`);

  input.outerHTML = text; // eslint-disable-line no-param-reassign
};

const setUpMasks = (inputs) => {
  for (let i = 0; i < inputs.length; i += 1) {
    createShell(inputs[i]);
  }
};

const setValueOfMask = (el) => {
  const { value } = el;
  const placeholder = el.getAttribute("data-placeholder");

  return `<i>${value}</i>${placeholder.substr(value.length)}`;
};

const handleCurrentValue = (el) => {
  const isCharsetPresent = el.getAttribute("data-charset");
  const placeholder = isCharsetPresent || el.getAttribute("data-placeholder");
  const { value } = el;
  const l = placeholder.length;
  let newValue = "";
  let i;
  let j;
  let isInt;
  let isLetter;

  // strip special characters
  const strippedValue = isCharsetPresent
    ? value.replace(/\W/g, "")
    : value.replace(/\D/g, "");

  for (i = 0, j = 0; i < l; i += 1) {
    // eslint-disable-next-line no-multi-assign, no-restricted-globals
    const x = (isInt = !isNaN(parseInt(strippedValue[j], 10)));
    isLetter = strippedValue[j] ? strippedValue[j].match(/[A-Z]/i) : false;
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;

    if (
      (matchesNumber && isInt) ||
      (isCharsetPresent && matchesLetter && isLetter)
    ) {
      newValue += strippedValue[j++];
    } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))
    ) {
      // errorOnKeyEntry(); // write your own error handling function
      return newValue;
    } else {
      newValue += placeholder[i];
    }
    // break if no characters left and the pattern is non-special character
    if (strippedValue[j] === undefined) {
      break;
    }
  }
  if (el.getAttribute("data-valid-example")) {
    // return validateProgress(e, newValue);
  }
  return newValue;
};
const handleValueChange = (el) => {
  const id = el.getAttribute("id");

  document.getElementById(id).value = handleCurrentValue(el);
  // document.getElementById(`${id}Mask`).innerHTML = Sanitizer.escapeHTML`${setValueOfMask(e)}`;
  document.getElementById(`${id}Mask`).innerHTML = `${setValueOfMask(el)}`;

  /* const theVal = Sanitizer.escapeHTML`${setValueOfMask(e)}`; 

      document.getElementById(
        `${id}Mask`
      ).insertAdjacentElement("beforeend", theVal); */
};

const inputMaskEvents = {
  [CLICK]: {},

  keyup: {
    [INPUT_MASK]() {
      handleValueChange(this);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init() {
    const maskedInputs = document.querySelectorAll(INPUT_MASK);
    setUpMasks(maskedInputs);
  },
});

// #endregion Date Picker Event Delegation Registration / Component

module.exports = inputMask;
