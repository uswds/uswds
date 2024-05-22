const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK = `${PREFIX}-input-mask`;
const MASK_CONTENT = `${MASK}--content`;
const PLACEHOLDER = "placeholder";

// User defined Values
const maskedNumber = "_#dDmMyY9";
const maskedLetter = "A";

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
  const placeholderVal = `${el.dataset.placeholder.substr(value.length)}`;

  const theIEl = document.createElement("i");
  theIEl.textContent = value;
  return [theIEl, placeholderVal];
};

const strippedValue = (isCharsetPresent, value) =>
  isCharsetPresent ? value.replace(/\W/g, "") : value.replace(/\D/g, "");

const isInteger = (value) => !Number.isNaN(parseInt(value, 10));

const isLetter = (value) => (value ? value.match(/[A-Z]/i) : false);

const handleCurrentValue = (el) => {
  const isCharsetPresent = el.dataset.charset;
  const placeholder = isCharsetPresent || el.dataset.placeholder;
  const { value } = el;
  const len = placeholder.length;
  let newValue = "";
  let i;
  let charIndex;

  const strippedVal = strippedValue(isCharsetPresent, value);

  for (i = 0, charIndex = 0; i < len; i += 1) {
    const isInt = isInteger(strippedVal[charIndex]);
    const isLet = isLetter(strippedVal[charIndex]);
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;

    if (
      (matchesNumber && isInt) ||
      (isCharsetPresent && matchesLetter && isLet)
    ) {
      newValue += strippedVal[charIndex];
      charIndex += 1;
    } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLet) || (matchesNumber && !isInt)))
    ) {
      return newValue;
    } else {
      newValue += placeholder[i];
    }
    // break if no characters left and the pattern is non-special character
    if (strippedVal[charIndex] === undefined) {
      break;
    }
  }

  return newValue;
};

const handleValueChange = (el) => {
  const inputEl = el;
  const id = inputEl.getAttribute("id");
  inputEl.value = handleCurrentValue(inputEl);

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);
};

const inputMaskEvents = {
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
