const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");

const COMBO_BOX = `.${PREFIX}-combo-box`;
const SELECT = `.${PREFIX}-combo-box__select`;
const INPUT = `.${PREFIX}-combo-box__input`;

/**
 * Returns the root and message element
 * for an combo box input
 *
 * @param {Element} input The character count input element
 * @returns {Object} elements The root and message element.
 * @returns {HTMLElement} elements.comboBox The root combo box element
 * @returns {HTMLElement} elements.selectElement The select object
 */
const getElements = input => {
  const comboBox = input.closest(COMBO_BOX);

  if (!comboBox) {
    throw new Error(`${INPUT} is missing outer ${COMBO_BOX}`);
  }

  const selectElement = comboBox.querySelector(SELECT);

  if (!selectElement) {
    throw new Error(`${COMBO_BOX} is missing inner ${SELECT}`);
  }

  return { comboBox, selectElement };
};

/**
 * Update the select value and the input value
 *
 * @param {Element} input The combobox input element
 */
const updateSelectValue = event => {
  const input = event.target;
  const { comboBox, selectElement } = getElements(input);

  let newSelectValue = "";

  if (input.value) {
    let option;
    for (let i = 0, len = selectElement.options.length; i < len; i += 1) {
      option = selectElement.options[i];
      if (option.text === input.value) {
        newSelectValue = option.value;
        break;
      }
    }
  }

  selectElement.value = newSelectValue;

  console.log(input, selectElement);
};

/**
 * Transform select into input
 *
 * @param {Element} selectElement The initial select element
 */
const initialTransform = selectElement => {

  //   inputElement.addEventListener("blur", updateSelectValue);
  //   inputElement.addEventListener("focus", updateSelectValue);
};

const comboBox = behavior(
  {
  },
  {
    init(root) {
      select(SELECT, root).forEach(selectElement => {
        initialTransform(selectElement);
      });
    },
    teardown(root) {
      select(INPUT, root).forEach(inputElement => {
        // inputElement.removeEventListener("blur", noop);
        // inputElement.removeEventListener("focus", noop);
      });
    }
  }
);

module.exports = comboBox;
