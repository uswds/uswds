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

const KEYS = {
  enter: 13,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  tab: 9,
  left: 37,
  right: 39,
  shift: 16
};

const hideList = comboBox => {
  const listElement = comboBox.querySelector(LIST);
  listElement.innerHTML = "";
  listElement.setAttribute("aria-expanded", "false");
  listElement.hidden = true;
};

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
  const assistiveHintID = `${selectId}--assistiveHint`;

  comboBox.insertAdjacentHTML(
    "beforeend",
    [
      `<input 
        id="${selectId}" 
        class="${INPUT_CLASS}"
        role='combobox'
        autocapitalize="none" 
        autocomplete="off"
        type="text" 
        aria-owns="${listId}"
        aria-autocomplete="list" 
        aria-expanded="false"
        aria-describedby="${assistiveHintID}"
      >`,
      `<ul 
        id="${listId}" 
        class="${LIST_CLASS}" 
        role="listbox"
        hidden>
      </ul>`,
      `<div 
        role='status'
        aria-atomic='true'
        aria-live='polite'
        class="usa-sr-only">
      </div>`,
      `<span id="${assistiveHintID}" class="usa-sr-only">
        When autocomplete results are available use up and down arrows to review and enter to select.
        Touch device users, explore by touch or with swipe gestures.
      </span>`
    ].join("")
  );

  selectElement.setAttribute("aria-hidden", "true");
  selectElement.setAttribute("tabindex", "-1");
  selectElement.classList.add("usa-sr-only");
  // eslint-disable-next-line no-param-reassign
  selectElement.id = "";

  //   inputElement.addEventListener("blur", updateSelectValue);
  //   inputElement.addEventListener("focus", updateSelectValue);
};

const displayList = inputElement => {
  const comboBox = inputElement.closest(COMBO_BOX);
  const selectElement = comboBox.querySelector(SELECT);
  const listElement = comboBox.querySelector(LIST);

  const listOptionBaseId = `${listElement.id}--option-`;

  const inputValue = (inputElement.value || "").toLowerCase();

  let optionEl;
  const options = [];
  for (let i = 0, len = selectElement.options.length; i < len; i += 1) {
    optionEl = selectElement.options[i];
    if (
      optionEl.value &&
      (!inputValue || optionEl.text.toLowerCase().indexOf(inputValue) !== -1)
    ) {
      options.push(optionEl);
    }
  }

  const optionHtml = options
    .map(
      (option, index) =>
        `<li
      id="${listOptionBaseId}${index}"
      class="${LIST_OPTION_CLASS}"
      tabindex="-1"
      role=option
      aria-selected="false"
      aria-setsize="${options.length}" 
      aria-posinset="${index + 1}"
      data-option-value="${option.value}"
    >${option.text}</li>`
    )
    .join("");

  listElement.innerHTML = optionHtml;
  listElement.setAttribute("aria-expanded", "true");
  listElement.hidden = false;
};

const selectItem = listOption => {
  const comboBox = listOption.closest(COMBO_BOX);
  const selectElement = comboBox.querySelector(SELECT);
  const input = comboBox.querySelector(INPUT);

  selectElement.value = listOption.getAttribute("data-option-value");
  input.value = listOption.textContent;
  hideList(comboBox);
  input.focus();
};

const handlePrintableKey = input => {
  displayList(input);
};

const completeSelection = comboBox => {
  const selectElement = comboBox.querySelector(SELECT);
  const inputElement = comboBox.querySelector(INPUT);
  const currentOption = comboBox.querySelector(
    `${LIST_OPTION}[aria-selected=true]`
  );

  if (currentOption) {
    selectElement.value = currentOption.getAttribute("data-option-value");
    inputElement.value = currentOption.textContent;
    return;
  }

  const inputValue = (inputElement.value || "").toLowerCase();

  if (inputValue) {
    let option;
    for (let i = 0, len = selectElement.options.length; i < len; i += 1) {
      option = selectElement.options[i];
      if (option.text.toLowerCase() === inputValue) {
        selectElement.value = option.value;
        // eslint-disable-next-line no-param-reassign
        inputElement.value = option.text;
        return;
      }
    }
  }

  selectElement.value = "";
  // eslint-disable-next-line no-param-reassign
  inputElement.value = "";
};

const handleEnter = (event, inputElement) => {
  const comboBox = inputElement.closest(COMBO_BOX);
  const listElement = comboBox.querySelector(LIST);

  if (!listElement.hidden) {
    event.preventDefault();
    completeSelection(comboBox);
    hideList(comboBox);
  }
};

const handleEscape = inputElement => {
  const comboBox = inputElement.closest(COMBO_BOX);
  hideList(comboBox);
  inputElement.focus();
};

const highlightOption = (current, next, inputEl) => {
  if (current) {
    current.setAttribute("aria-selected", "false");
  }
  if (next) {
    next.setAttribute("aria-selected", "true");
    inputEl.setAttribute("aria-activedescendant", next.id);
  } else {
    inputEl.removeAttribute("aria-activedescendant");
  }
};

const handleUp = (event, inputElement) => {
  event.preventDefault();
  const comboBox = inputElement.closest(COMBO_BOX);
  const listElement = comboBox.querySelector(LIST);
  const currentOption = listElement.querySelector(
    `${LIST_OPTION}[aria-selected=true]`
  );
  const nextOption = currentOption && currentOption.previousSibling;
  highlightOption(currentOption, nextOption, inputElement);
  if (currentOption && !nextOption) {
    inputElement.focus();
  }
};

const handleDown = (event, inputElement) => {
  event.preventDefault();
  const comboBox = inputElement.closest(COMBO_BOX);
  const listElement = comboBox.querySelector(LIST);
  const currentOption = listElement.querySelector(
    `${LIST_OPTION}[aria-selected=true]`
  );
  const nextOption = currentOption
    ? currentOption.nextSibling
    : listElement.querySelector(`${LIST_OPTION}`);
  if (nextOption) {
    highlightOption(currentOption, nextOption, inputElement);
  }
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
            completeSelection(comboBoxComponent);
            hideList(comboBoxComponent);
          }
        });
      }
    },
    keydown: {
      [INPUT](event) {
        switch (event.keyCode) {
          case KEYS.left:
          case KEYS.right:
          case KEYS.space:
          case KEYS.tab:
          case KEYS.shift:
            break;
          case KEYS.up:
            handleUp(event, this);
            break;
          case KEYS.down:
            handleDown(event, this);
            break;
          case KEYS.esc:
            handleEscape(this);
            break;
          case KEYS.enter:
            handleEnter(event, this);
            break;
          default:
            break;
        }
      }
    },
    keyup: {
      [INPUT](event) {
        switch (event.keyCode) {
          case KEYS.esc:
          case KEYS.up:
          case KEYS.left:
          case KEYS.right:
          case KEYS.space:
          case KEYS.tab:
          case KEYS.shift:
          case KEYS.down:
          case KEYS.enter:
            break;
          default:
            handlePrintableKey(this);
        }
      }
    }
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
