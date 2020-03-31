const select = require("../utils/select");
const behavior = require("../utils/behavior");
const { prefix: PREFIX } = require("../config");
const { CLICK } = require("../events");

const BODY = "body";
const COMBO_BOX = `.${PREFIX}-combo-box`;

const INPUT_CLASS = `${PREFIX}-combo-box__input`;
const LIST_CLASS = `${PREFIX}-combo-box__list`;
const LIST_OPTION_CLASS = `${PREFIX}-combo-box__list-option`;

const SELECT = `.${PREFIX}-combo-box__select`;
const INPUT = `.${INPUT_CLASS}`;
const LIST = `.${LIST_CLASS}`;
const LIST_OPTION = `.${LIST_OPTION_CLASS}`;



const hideList = comboBox => {
  const listElement = comboBox.querySelector(LIST);
  listElement.innerHTML = '';
  listElement.setAttribute('aria-expanded', 'false');
  listElement.hidden = true;
};

/**
 * Update the select value and the input value
 *
 * @param {Element} input The combobox input element
 */
// const updateSelectValue = event => {
//   const input = event.target;
//   const { comboBox, selectElement } = getElements(input);

//   let newSelectValue = "";

//   if (input.value) {
//     let option;
//     for (let i = 0, len = selectElement.options.length; i < len; i += 1) {
//       option = selectElement.options[i];
//       if (option.text === input.value) {
//         newSelectValue = option.value;
//         break;
//       }
//     }
//   }

//   selectElement.value = newSelectValue;

//   console.log(input, selectElement);
// };

/**
 * Enhance the combo box element
 *
 * @param {Element} selectElement The initial select element
 */
const enhanceComboBox = selectElement => {

  const comboBox = selectElement.closest(COMBO_BOX);

  if (!comboBox) {
    throw new Error(`${INPUT} is missing outer ${COMBO_BOX}`);
  }

  const selectId = selectElement.id;
  const listId = `${selectId}--list`;

  const newInput = document.createElement('input');
  newInput.id = selectId;
  newInput.classList.add(INPUT_CLASS);

  const newList = document.createElement('ul');
  newList.id = listId;
  newList.classList.add(LIST_CLASS);
  newList.setAttribute('role', 'listbox');
  newList.setAttribute('aria-expanded', 'false');
  newList.hidden = true;

  selectElement.setAttribute("aria-hidden", "true");
  selectElement.setAttribute("tabindex", "-1");
  selectElement.classList.add("usa-sr-only");
  // eslint-disable-next-line no-param-reassign
  selectElement.id = '';

  comboBox.appendChild(newInput);
  comboBox.appendChild(newList);


  // console.log(comboBox.innerHTML);


  //   inputElement.addEventListener("blur", updateSelectValue);
  //   inputElement.addEventListener("focus", updateSelectValue);
};

const displayList = inputElement => {
  const comboBox = inputElement.closest(COMBO_BOX);
  const selectElement = comboBox.querySelector(SELECT);
  const listElement = comboBox.querySelector(LIST);

  hideList(comboBox);

  const inputValue = inputElement.value || '';

  let option;
  for (let i = 0, len = selectElement.options.length; i < len; i += 1) {
    option = selectElement.options[i];
    if (option.value && (!inputValue || option.text.indexOf(inputValue) !== -1)) {
      const newOption = document.createElement('li');
      newOption.id = `${listElement.id}--option-${i}`;
      newOption.classList.add(LIST_OPTION_CLASS);
      newOption.setAttribute("tabindex", "-1");
      newOption.setAttribute('role', 'option');
      newOption.setAttribute('aria-selected', 'false');
      newOption.setAttribute('data-option-value', option.value);
      newOption.textContent = option.text;
      listElement.appendChild(newOption);
    }
  }

  listElement.setAttribute('aria-expanded', 'true');
  listElement.hidden = false;
};

const selectItem = listOption => {
  const comboBox = listOption.closest(COMBO_BOX);
  const selectElement = comboBox.querySelector(SELECT);
  const input = comboBox.querySelector(INPUT);

  selectElement.value = listOption.getAttribute('data-option-value');
  input.value = listOption.textContent;
  hideList(comboBox);
};

const comboBox = behavior(
  {
    [CLICK]: {
      [INPUT]() {
        displayList(this);
      },
      [LIST_OPTION]() {
        selectItem(this);
      },
      [BODY](event) {
        select(COMBO_BOX).forEach(comboBoxComponent => {
          if (!comboBoxComponent.contains(event.target)) {
            hideList(comboBoxComponent);
          }
        });
      },
    },
  },
  {
    init(root) {
      select(SELECT, root).forEach(selectElement => {
        enhanceComboBox(selectElement);
      });
      // },
      // teardown(root) {
      //   select(INPUT, root).forEach(inputElement => {
      //     // inputElement.removeEventListener("blur", noop);
      //     // inputElement.removeEventListener("focus", noop);
      //   });
    }
  }
);

module.exports = comboBox;
