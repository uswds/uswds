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
  const errorMsgAlphabetical = "Please enter a letter here";
  const errorMsgNumerical = "Please enter a number here";
  const errorMsgAlphanumeric = "Please enter a number or letter here";

  return {
    inputEl,
    errorId,
    inputId,
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

  const strippedVal = strippedValue(isCharsetPresent, value);

  for (i = 0, charIndex = 0; i < len; i += 1) {
    const isInt = isInteger(strippedVal[charIndex]);
    const isLet = isLetter(strippedVal[charIndex]);
    const matchesNumber = maskedNumber.indexOf(placeholder[i]) >= 0;
    const matchesLetter = maskedLetter.indexOf(placeholder[i]) >= 0;
    const { errorId }  = getMaskInputContext(el);
    const { errorMsgAlphabetical, errorMsgNumerical, errorMsgAlphanumeric }  = getMaskInputContext(el);
    let errorMsg;

    // if (matchesNumber) {
    //   errorMsg = errorMsgNumerical;
    // } else if (matchesletter) {
    //   erorMsg = errorMsgAlphabetical
    // } else {
    //   errorMsg = "Please enter an accepted value here"
    // }

    // document.getElementById(errorId).textContent = errorMsg;

    //checking if not a special character?
    if (
      matchesNumber && isInt
    ) {
      newValue += strippedVal[charIndex];
      charIndex += 1;

        //check 
        document.getElementById(errorId).className = "usa-error-message usa-hide-error";
        //maybe get mask requirement by checking the pattern for this index?
      } else if (
        isCharsetPresent && matchesLetter && isLet
      ) {
        newValue += strippedVal[charIndex];
        charIndex += 1;
  
        document.getElementById(errorId).className = "usa-error-message usa-hide-error";
        } else if (
      (!isCharsetPresent && !isInt && matchesNumber) ||
      (isCharsetPresent &&
        ((matchesLetter && !isLet) || (matchesNumber && !isInt)))
    ) {
      //might need to hide and unhide to alert user again for screen readers later on
      // document.getElementById('inputMaskError').className = "hide-error-message";

      // set the error message based on the mask requirement
      if (!isCharsetPresent && !isInt && matchesNumber) {
        errorMsg = errorMsgNumerical;
      } else if (isCharsetPresent && ((matchesLetter && !isLet))) {
        errorMsg = errorMsgAlphabetical;
      } else if (isCharsetPresent && (matchesNumber && !isInt)) {
        errorMsg = errorMsgNumerical;
      }
      document.getElementById(errorId).textContent = errorMsg;

      //add class to show error message
      document.getElementById(errorId).className = "usa-error-message";
      return newValue;
    } else {
      document.getElementById(errorId).className = "usa-error-message usa-hide-error";
      newValue += placeholder[i];
    }
    // break if no characters left and the pattern is non-special character
    if (strippedVal[charIndex] === undefined) {
      break;
    }
  }

  return newValue;
};

const getMaskRequirement = (pattern, index) => {

}

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
