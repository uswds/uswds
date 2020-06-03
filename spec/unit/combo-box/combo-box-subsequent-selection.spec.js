const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-subsequent-selection.template.html")
);

const EVENTS = {};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = el => {
  const evt = new MouseEvent("click", {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a focusout event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.focusout = el => {
  const evt = new Event("focusout", {
    bubbles: true,
    cancelable: true
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown Enter event
 * @param {HTMLElement} el the element to sent the event to
 * @returns {{preventDefaultSpy: sinon.SinonSpy<[], void>}}
 */
EVENTS.keydownEnter = el => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Enter",
    keyCode: 13
  });
  const preventDefaultSpy = sinon.spy(evt, "preventDefault");
  el.dispatchEvent(evt);
  return { preventDefaultSpy };
};

/**
 * send a keydown Escape event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownEscape = el => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "Escape",
    keyCode: 27
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowDown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowDown = el => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowDown"
  });
  el.dispatchEvent(evt);
};

/**
 * send a keydown ArrowUp event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydownArrowUp = el => {
  const evt = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowUp"
  });
  el.dispatchEvent(evt);
};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = el => {
  el.dispatchEvent(new KeyboardEvent("input", { bubbles: true }));
};

describe("combo box component", () => {
  const { body } = document;

  let root;
  let input;
  let select;
  let list;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    select = root.querySelector(".usa-combo-box__select");
    list = root.querySelector(".usa-combo-box__list");
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
  });

  it("should keep the value as previously selected item on escape", () => {});

  it("should select on tab and close the list and focus the input when the list is open", () => {});

  it("should tab and remove focus from the input when the list is closed", () => {});

  it("should initially focus the selected item when down is pressed from the input after an initial selection has occurred", () => {});
});
