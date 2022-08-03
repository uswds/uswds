const Sanitizer = require("../../uswds-core/src/js/utils/sanitizer"); // eslint-disable-line no-unused-vars

const MASKED = "usa-masked";
const MASKED_CLASS = `.${MASKED}`;
const MASK = "usa-input-mask";
const MASK_CONTENT = "usa-input-mask--content";
const PLACEHOLDER = "placeholder";

function ready(fn) {
  document.addEventListener("DOMContentLoaded", fn, false);
}

ready(() => {
  const masking = {
    // User defined Values
    maskedInputs: document.getElementsByClassName(MASKED),
    maskedNumber: "XdDmMyY9",
    maskedLetter: "_",

    init() {
      masking.setUpMasks(masking.maskedInputs);
      masking.maskedInputs = document.querySelectorAll(MASKED_CLASS); // Repopulating. Needed b/c static node list was created above.
      masking.activateMasking(masking.maskedInputs);
    },

    setUpMasks(inputs) {
      let i;
      const l = inputs.length;

      for (i = 0; i < l; i += 1) {
        masking.createShell(inputs[i]);
      }
    },

    // replaces each masked input with a shell containing the input and it's mask.
    createShell(input) {
      const placeholder = input.getAttribute(`${PLACEHOLDER}`);

      if (
        placeholder !== null &&
        placeholder.length > 0 &&
        placeholder !== " "
      ) {
        input.setAttribute("maxlength", placeholder.length);
        input.setAttribute("data-placeholder", placeholder);
        input.removeAttribute(`${PLACEHOLDER}`);
      } else {
        return;
      }

      // This section still needs some rework
      const text = `<span class="${MASK}"><span class="${MASK_CONTENT}" aria-hidden="true" id="${input.id}Mask"><i></i>${placeholder}</span>${input.outerHTML}</span>`;

      input.outerHTML = text; // eslint-disable-line no-param-reassign, no-unsanitized/property
    },

    setValueOfMask(e) {
      const { value } = e.target;
      const placeholder = e.target.getAttribute("data-placeholder");
      const placeholderVal = `${placeholder.substr(value.length)}`;

      const theIEl = document.createElement("i");
      theIEl.textContent = value;
      return [theIEl, placeholderVal];
    },

    // add event listeners
    activateMasking(inputs) {
      let i;
      let l;

      for (i = 0, l = inputs.length; i < l; i += 1) {
        masking.maskedInputs[i].addEventListener(
          "keyup",
          (e) => {
            masking.handleValueChange(e);
          },
          false
        );
      }
    },

    handleValueChange(e) {
      const id = e.target.getAttribute("id");

      switch (
        e.keyCode // allows navigating thru input
      ) {
        case 20: // caplocks
        case 17: // control
        case 18: // option
        case 16: // shift
        case 37: // arrow keys
        case 38:
        case 39:
        case 40:
        case 9: // tab (let blur handle tab)
          return;
        // no default
      }

      document.getElementById(id).value = masking.handleCurrentValue(e);
      const maskVal = masking.setValueOfMask(e);
      const maskEl = document.getElementById(`${id}Mask`);
      maskEl.innerHTML = "";
      maskEl.replaceChildren(maskVal[0], maskVal[1]);
    },

    handleCurrentValue(e) {
      const isCharsetPresent = e.target.getAttribute("data-charset");
      const placeholder =
        isCharsetPresent || e.target.getAttribute("data-placeholder");
      const { value } = e.target;
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
        // eslint-disable-next-line no-restricted-globals
        isInt = !isNaN(parseInt(strippedValue[j], 10));
        isLetter = strippedValue[j] ? strippedValue[j].match(/[A-Z]/i) : false;
        const matchesNumber = masking.maskedNumber.indexOf(placeholder[i]) >= 0;
        const matchesLetter = masking.maskedLetter.indexOf(placeholder[i]) >= 0;

        if (
          (matchesNumber && isInt) ||
          (isCharsetPresent && matchesLetter && isLetter)
        ) {
          // eslint-disable-next-line no-plusplus
          newValue += strippedValue[j++];
        } else if (
          (!isCharsetPresent && !isInt && matchesNumber) ||
          (isCharsetPresent &&
            ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))
        ) {
          // masking.errorOnKeyEntry(); // write your own error handling function
          return newValue;
        } else {
          newValue += placeholder[i];
        }
        // break if no characters left and the pattern is non-special character
        if (strippedValue[j] === undefined) {
          break;
        }
      }
      if (e.target.getAttribute("data-valid-example")) {
        return masking.validateProgress(e, newValue);
      }
      return newValue;
    },
  };

  masking.init();
});
