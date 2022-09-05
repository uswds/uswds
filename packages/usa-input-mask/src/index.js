const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");
const { CLICK } = require("../../uswds-core/src/js/events");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK = `${PREFIX}-input-mask`;
const MASK_CONTENT = `${MASK}--content`;
const PLACEHOLDER = "placeholder";

// User defined Values
const maskedNumber = "_dDmMyY9";
const maskedLetter = "_";

// replaces each masked input with a shell containing the input and it's mask.
const createMaskedInputShell = (input) => {
  const placeholder = input.getAttribute(`${PLACEHOLDER}`);
  if (placeholder) {
    input.setAttribute("maxlength", placeholder.length);
    input.setAttribute("data-placeholder", placeholder);
    input.removeAttribute(`${PLACEHOLDER}`);
  } else {
    return;
  }

  const shell = document.createElement("span");
  shell.classList.add(MASK);
  shell.setAttribute("data-mask", placeholder);
  console.log("shell ", shell); // eslint-disable-line no-console

  const content = document.createElement("span");
  content.classList.add(MASK_CONTENT);
  content.setAttribute("aria-hidden", "true");
  content.id = `${input.id}Mask`;
  content.textContent = placeholder;

  shell.appendChild(content);
  input.parentNode.insertBefore(shell, input);
  shell.appendChild(input);
};

const setValueOfMask = (el) => {
  const { value } = el;
  const placeholder = el.getAttribute("data-placeholder");
  const placeholderVal = `${placeholder.substr(value.length)}`;

  const theIEl = document.createElement("i");
  theIEl.textContent = value;
  return [theIEl, placeholderVal];
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
    isInt = !Number.isNaN(parseInt(strippedValue[j], 10));
    isLetter = strippedValue[j] ? strippedValue[j].match(/[A-Z]/i) : false;
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;

    if (
      (matchesNumber && isInt) ||
      (isCharsetPresent && matchesLetter && isLetter)
    ) {
      newValue += strippedValue[j];
      j += 1;
    } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))
    ) {
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
  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.innerHTML = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);
};

const inputMaskEvents = {
  [CLICK]: {},

  keyup: {
    [MASKED]() {
      handleValueChange(this);
    },
  },
};

const inputMask = behavior(inputMaskEvents, {
  init(root) {
    selectOrMatches(MASKED, root).forEach((maskedInput) => {
      createMaskedInputShell(maskedInput);
    });
  },
});

module.exports = inputMask;
