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
  const errorId = `${inputId}Error`;
  const errorMsg = inputEl.getAttribute("data-errorMessage");
  const errorMsgAlpha = inputEl.getAttribute("data-errorMessageAlphabetical");
  const errorMsgNum = inputEl.getAttribute("data-errorMessageNumerical");
  const errorMsgFull = inputEl.getAttribute("data-errorMessageInputFull");

  return {
    inputEl,
    errorId,
    inputId,
    errorMsg,
    errorMsgAlpha,
    errorMsgNum,
    errorMsgFull
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
  const inputValueLength = placeholderVal.length + value.length;

  const theIEl = document.createElement("i");
  theIEl.textContent = value;

  return [theIEl, placeholderVal, inputValueLength];
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
      matchType = "number";
    } else if (matchesLetter) {
      matchType = "letter";
    }

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
      return { newValue, matchType };
    } else {
      newValue += placeholder[i];
    }
    // break if no characters left and the pattern is non-special character
    if (strippedVal[charIndex] === undefined) {
      break;
    }
  }
  return { newValue, matchType };
};

const handleErrorState = (previousValue, newValue, matchType, inputEl, inputValueLength) => {
  const { errorId, errorMsgAlpha, errorMsgNum, errorMsg, errorMsgFull } =
    getMaskInputContext(inputEl);
  let messageType = newValue.length === inputValueLength ? "input full" : matchType;


    if (newValue.length == inputValueLength)  {
      document.getElementById(errorId).hidden = false;
    } else if (previousValue.length <= newValue.length) {
      document.getElementById(errorId).hidden = true;
    } else if (previousValue.length >= newValue.length)  {
      document.getElementById(errorId).hidden = false;
    }

    switch (messageType) {
      case "letter":
        document.getElementById(errorId).textContent = errorMsgAlpha;
        break;
      case "number":
        document.getElementById(errorId).textContent = errorMsgNum;
        break;
      case "input full":
        document.getElementById(errorId).textContent = errorMsgFull;
        break;
      default:
        document.getElementById(errorId).textContent = errorMsg;
    }
};

const handleValueChange = (el) => {
  const inputEl = el;
  const previousValue = inputEl.value;
  const { matchType } = handleCurrentValue(inputEl);
  const id = inputEl.getAttribute("id");
  const { newValue } = handleCurrentValue(inputEl);
  inputEl.value = newValue;

  const maskVal = setValueOfMask(el);
  const inputValueLength = maskVal[2];
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);

  handleErrorState(previousValue, newValue, matchType, inputEl, inputValueLength);    
};

const inputMaskEvents = {
  keyup: {
    [MASKED](e) {
      e.key != 'Shift' ? handleValueChange(this) : null;
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
