const selectOrMatches = require("../../uswds-core/src/js/utils/select-or-matches");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const debounce = require("../../uswds-core/src/js/utils/debounce");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const MASKED_CLASS = `${PREFIX}-masked`;
const MASKED = `.${MASKED_CLASS}`;
const MASK = `${PREFIX}-input-mask`;
const MASK_CONTENT = `${MASK}--content`;
const PLACEHOLDER = "placeholder";
const SR_ONLY_CLASS = `${PREFIX}-sr-only`;
const ERROR_MESSAGE_CLASS = `${PREFIX}-error-message`;

let keydownLength;

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
  const errorMsgSrOnly = inputEl.getAttribute("data-errorMessageSrOnly");
  const errorMsgAlphaSrOnly = inputEl.getAttribute(
    "data-errorMessageAlphabeticalSrOnly",
  );
  const errorMsgNumSrOnly = inputEl.getAttribute(
    "data-errorMessageNumericalSrOnly",
  );
  const errorMsgFullSrOnly = inputEl.getAttribute(
    "data-errorMessageInputFullSrOnly",
  );

  return {
    inputEl,
    errorId,
    inputId,
    errorMsg,
    errorMsgAlpha,
    errorMsgNum,
    errorMsgFull,
    errorMsgSrOnly,
    errorMsgAlphaSrOnly,
    errorMsgNumSrOnly,
    errorMsgFullSrOnly,
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

/**
 * Updates the character count status for screen readers after a 1000ms delay.
 *
 * @param {HTMLElement} msgEl - The screen reader status message element
 * @param {string} statusMessage - A string of the current character status
 */
const srUpdateStatus = debounce((msgEl, statusMessage) => {
  const srStatusMessage = msgEl;
  srStatusMessage.textContent = statusMessage;
}, 1000);

const handleErrorState = (
  previousValue,
  newValue,
  matchType,
  inputEl,
  maxLengthReached,
) => {
  const {
    errorId,
    errorMsg,
    errorMsgNum,
    errorMsgAlpha,
    errorMsgFull,
    errorMsgSrOnly,
    errorMsgNumSrOnly,
    errorMsgAlphaSrOnly,
    errorMsgFullSrOnly,
  } = getMaskInputContext(inputEl);

  //create visual error message and add to DOM
  const errorMsgSpan = document.createElement("span");
  errorMsgSpan.setAttribute("id", errorId);
  errorMsgSpan.setAttribute("class", ERROR_MESSAGE_CLASS);
  errorMsgSpan.setAttribute("aria-hidden", "true");
  inputEl.parentNode.appendChild(errorMsgSpan);
  const errorMessageEl = document.getElementById(errorId);

  //create sr only error message and add to DOM
  const errorMsgSpanSrOnly = document.createElement("span");
  errorMsgSpanSrOnly.setAttribute("id", `${errorId}SrOnly`);
  errorMsgSpanSrOnly.setAttribute("class", SR_ONLY_CLASS);
  errorMsgSpanSrOnly.setAttribute("role", "alert");
  inputEl.parentNode.appendChild(errorMsgSpanSrOnly);
  const errorMessageSrOnlyEl = document.getElementById(`${errorId}SrOnly`);

  let messageType = maxLengthReached ? "input full" : matchType;

  //hide or show error message
  if (maxLengthReached) {
    //max length reached
    errorMessageEl.hidden = false;
    errorMessageSrOnlyEl.hidden = false;
  } else if (previousValue.length <= newValue.length) {
    //input accepted
    errorMessageEl.hidden = true;
    errorMessageSrOnlyEl.hidden = true;
  } else if (previousValue.length >= newValue.length) {
    //input rejected
    errorMessageEl.hidden = false;
    errorMessageSrOnlyEl.hidden = false;
  }

  //set error messages text
  switch (messageType) {
    case "letter":
      errorMessageEl.textContent = errorMsgAlpha;
      srUpdateStatus(errorMessageSrOnlyEl, errorMsgAlphaSrOnly);
      break;
    case "number":
      errorMessageEl.textContent = errorMsgNum;
      srUpdateStatus(errorMessageSrOnlyEl, errorMsgNumSrOnly);
      break;
    case "input full":
      errorMessageEl.textContent = errorMsgFull;
      srUpdateStatus(errorMessageSrOnlyEl, errorMsgFullSrOnly);
      break;
    default:
      errorMessageEl.textContent = errorMsg;
      srUpdateStatus(errorMessageSrOnlyEl, errorMsgSrOnly);
  }
};

const handleValueChange = (el, keydownLength) => {
  const inputEl = el;
  const previousValue = inputEl.value;
  const maxLengthReached =
    keydownLength == previousValue.length && !(previousValue.length === 0);
  const { matchType } = handleCurrentValue(inputEl);
  const id = inputEl.getAttribute("id");
  const { newValue } = handleCurrentValue(inputEl);
  inputEl.value = newValue;

  const maskVal = setValueOfMask(el);
  const maskEl = document.getElementById(`${id}Mask`);
  maskEl.textContent = "";
  maskEl.replaceChildren(maskVal[0], maskVal[1]);

  handleErrorState(
    previousValue,
    newValue,
    matchType,
    inputEl,
    maxLengthReached,
  );
};

const inputMaskEvents = {
  keyup: {
    [MASKED]() {
      this.key != "Shift" ? handleValueChange(this, keydownLength) : null;
    },
  },
  keydown: {
    [MASKED]() {
      keydownLength = this.value.length;
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
