const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-change-event.template.html")
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
 * send a keyup A event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keyupA = el => {
  const evt = new KeyboardEvent("keyup", {
    bubbles: true,
    key: "a",
    keyCode: 65
  });
  el.dispatchEvent(evt);
};

/**
 * send a keyup O event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keyupO = el => {
  const evt = new KeyboardEvent("keyup", {
    bubbles: true,
    key: "o",
    keyCode: 79
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

describe("combo box component change event dispatch", () => {
  const { body } = document;

  let root;
  let input;
  let inputChangeSpy;
  let select;
  let selectChangeSpy;
  let list;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    select = root.querySelector(".usa-combo-box__select");
    list = root.querySelector(".usa-combo-box__list");
    inputChangeSpy = sinon.stub();
    selectChangeSpy = sinon.stub();

    select.addEventListener("change", selectChangeSpy);
    input.addEventListener("change", inputChangeSpy);
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
  });

  it("enhances a select element into a combo box component", () => {
    assert.ok(input, "adds an input element");
    assert.ok(select, "select element exists");
    assert.ok(list, "adds an list element");
  });

  it("should emit change events when selecting an item from the option list when clicking a list option", () => {
    input.value = "";

    EVENTS.click(input);
    EVENTS.click(list.children[0]);

    assert.equal(
      select.value,
      "value-ActionScript",
      "should set that item to being the select option"
    );
    assert.equal(
      input.value,
      "ActionScript",
      "should set that item to being the input value"
    );

    assert.ok(
      selectChangeSpy.called,
      "should have dispatched a change event from the select"
    );
    assert.ok(
      inputChangeSpy.called,
      "should have dispatched a change event from the input"
    );
  });

  it("should emit change events when clearing input values when an incomplete item is remaining on blur", () => {
    select.value = "value-ActionScript";
    input.value = "a";
    EVENTS.keyupA(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.focusout(input);

    assert.equal(select.value, "", "should clear the value on the select");
    assert.equal(input.value, "", "should clear the value on the input");
    assert.ok(selectChangeSpy.called, "should have dispatched a change event");
    assert.ok(inputChangeSpy.called, "should have dispatched a change event");
  });

  it("should emit change events when clearing input values when an incomplete item is submitted through enter", () => {
    select.value = "value-ActionScript";
    input.value = "a";
    EVENTS.keyupA(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.keydownEnter(input);

    assert.equal(select.value, "", "should clear the value on the select");
    assert.equal(input.value, "", "should clear the value on the input");
    assert.ok(selectChangeSpy.called, "should have dispatched a change event");
    assert.ok(inputChangeSpy.called, "should have dispatched a change event");
  });

  it("should not emit change events when closing the list but not the clear the input value when escape is performed while the list is open", () => {
    select.value = "value-ActionScript";
    input.value = "a";
    EVENTS.keyupA(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.keydownEscape(input);

    assert.equal(
      select.value,
      "value-ActionScript",
      "should not change the value of the select"
    );
    assert.equal(input.value, "a", "should not change the value in the input");
    assert.ok(
      selectChangeSpy.notCalled,
      "should not have dispatched a change event"
    );
    assert.ok(
      inputChangeSpy.notCalled,
      "should not have dispatched a change event"
    );
  });

  it("should emit change events when setting the input value when a complete selection is submitted by clicking away", () => {
    select.value = "value-ActionScript";
    input.value = "go";
    EVENTS.keyupO(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.focusout(input);

    assert.equal(
      select.value,
      "value-Go",
      "should set that item to being the select option"
    );
    assert.equal(
      input.value,
      "Go",
      "should set that item to being the input value"
    );
    assert.ok(selectChangeSpy.called, "should have dispatched a change event");
    assert.ok(inputChangeSpy.called, "should have dispatched a change event");
  });

  it("should emit change events when setting the input value when a complete selection is submitted by pressing enter", () => {
    select.value = "value-ActionScript";
    input.value = "go";
    EVENTS.keyupO(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.keydownEnter(input);

    assert.equal(
      select.value,
      "value-Go",
      "should set that item to being the select option"
    );
    assert.equal(
      input.value,
      "Go",
      "should set that item to being the input value"
    );
    assert.ok(selectChangeSpy.called, "should have dispatched a change event");
    assert.ok(inputChangeSpy.called, "should have dispatched a change event");
  });

  it("should emit change events when selecting the focused list item in the list when pressing enter on a focused item", () => {
    select.value = "value-JavaScript";
    input.value = "la";

    EVENTS.keyupA(input);
    EVENTS.keydownArrowDown(input);
    const focusedOption = document.activeElement;
    assert.equal(
      focusedOption.textContent,
      "Erlang",
      "should focus the first item in the list"
    );
    EVENTS.keydownEnter(focusedOption);

    assert.equal(
      select.value,
      "value-Erlang",
      "select the first item in the list"
    );
    assert.equal(input.value, "Erlang", "should set the value in the input");
    assert.ok(selectChangeSpy.called, "should have dispatched a change event");
    assert.ok(inputChangeSpy.called, "should have dispatched a change event");
  });

  it("should not emit change events when pressing escape from a focused item", () => {
    select.value = "value-JavaScript";
    input.value = "la";

    EVENTS.keyupA(input);
    assert.ok(
      !list.hidden && list.children.length,
      "should display the option list with options"
    );
    EVENTS.keydownArrowDown(input);
    const focusedOption = document.activeElement;
    assert.equal(
      focusedOption.textContent,
      "Erlang",
      "should focus the first item in the list"
    );
    EVENTS.keydownEscape(focusedOption);

    assert.ok(list.hidden, "should hide the option list");
    assert.equal(list.children.length, 0, "should empty the option list");
    assert.equal(
      select.value,
      "value-JavaScript",
      "should not change the value of the select"
    );
    assert.equal(input.value, "la", "should not change the value in the input");
    assert.ok(
      selectChangeSpy.notCalled,
      "should not have dispatched a change event"
    );
    assert.ok(
      inputChangeSpy.notCalled,
      "should not have dispatched a change event"
    );
  });
});
