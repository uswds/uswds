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

const getMaskInputContext = (el) => {
  const inputEl = el;

  if (!inputEl) {
    throw new Error(`Element is missing outer ${inputEl}`);
  }

  const inputId = inputEl.id;
  const errorId = inputId + 'Error';
  // const errorMsgAlphabetical = inputEl.data-errorMsgAlpha;
  // const errorMsgNumerical = inputEl.data-errorMsgNum;
  // const errorMsgAlphanumeric = inputEl.data-errorMsgAlphaNum;
  const errorMsg = "Please enter a valid character";
  const errorMsgAlphabetical = "Please enter a letter here";
  const errorMsgNumerical = "Please enter a number here";
  const errorMsgAlphanumeric = "Please enter a number or letter here";

  return {
    inputEl,
    errorId,
    inputId,
    errorMsg,
    errorMsgAlphabetical,
    errorMsgNumerical,
    errorMsgAlphanumeric,
  };
};

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
  let matchType;

  const strippedVal = strippedValue(isCharsetPresent, value);

  for (i = 0, charIndex = 0; i < len; i += 1) {
    const isInt = isInteger(strippedVal[charIndex]);
    const isLet = isLetter(strippedVal[charIndex]);
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;
    
    if (matchesNumber) {
      matchType = 'number'
    } else if (matchesLetter) {
      matchType = 'letter'
    }

    if (
      matchesNumber && isInt
    ) {
      newValue += strippedVal[charIndex];
      charIndex += 1;
    } else if (
      isCharsetPresent && matchesLetter && isLet
    ) {
      newValue += strippedVal[charIndex];
      charIndex += 1;
    } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLet) || (matchesNumber && !isInt)))
    ) {
      return { newValue, matchType };
    } else {
      newValue += placeholder[i];
    }
    if (strippedVal[charIndex] === undefined) {
      break;
    }
  }
  return { newValue, matchType };
};

const handleValueChange = (el) => {
  const inputEl = el;
  const previousValue = inputEl.value;
  const matchType = handleCurrentValue(inputEl).matchType;
  const id = inputEl.getAttribute("id");
  const newValue = handleCurrentValue(inputEl).newValue;
  console.log('newValue: ', newValue)
  inputEl.value = newValue;

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);

  handleErrorState(previousValue, newValue, matchType, el);
};

const handleErrorState = (previousValue, newValue, matchType, el) => {
  const { errorId, errorMsgAlphabetical, errorMsgNumerical, errorMsg } = getMaskInputContext(el);

  if (previousValue.length <= newValue.length) {
    document.getElementById(errorId).className = "usa-error-message usa-hide-error";
  } else if (previousValue.length >= newValue.length) {
    document.getElementById(errorId).className = "usa-error-message";
  }

  switch(matchType) {
    case 'letter':
      document.getElementById(errorId).textContent = errorMsgAlphabetical;
      break;
    case 'number':
      document.getElementById(errorId).textContent = errorMsgNumerical;
    // case 'alphanumeric':
    //   document.getElementById(errorId).textContent = errorMsgAlphanumeric;
    // case 'specialcharacter':
    //   document.getElementById(errorId).textContent = errorMsgSpecialCharacter;
      break;
    default:
      document.getElementById(errorId).textContent = errorMsg;
  }
}

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
