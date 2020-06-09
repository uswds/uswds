const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-subsequent-selection.template.html")
);

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

  it("should keep the value as previously selected item on focus out", () => {
    select.value = "value-JavaScript";
    input.value = "la";
    EVENTS.input(input);
    assert.ok(
      !list.hidden && list.children.length,
      "should display the option list with options"
    );

    EVENTS.focusout(root);

    assert.ok(list.hidden, "should hide the option list");
    assert.equal(
      select.value,
      "value-JavaScript",
      "should not change the value of the select"
    );
    assert.equal(
      input.value,
      "JavaScript",
      "should reset the input to the previously selected item"
    );
  });

  // //////////////////////////////////////////////////////////////////

  it("should keep the value as previously selected item on escape", () => {
    select.value = "value-JavaScript";
    input.value = "la";
    EVENTS.input(input);
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
    assert.equal(
      select.value,
      "value-JavaScript",
      "should not change the value of the select"
    );
    assert.equal(
      input.value,
      "JavaScript",
      "should reset the input to the previously selected item"
    );
  });

  it("should select on tab and close the list and focus the input when on a focused item", () => {
    select.value = "value-JavaScript";
    input.value = "la";
    EVENTS.input(input);
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

    EVENTS.keydownTab(focusedOption);

    assert.ok(list.hidden, "should hide the option list");
    assert.equal(
      select.value,
      "value-Erlang",
      "should select the focused item"
    );
    assert.equal(input.value, "Erlang", "should select the focused item");
    assert.equal(document.activeElement, input, "should focus the input");
  });

  it("should select on tab and close the list and focus the input when the list is open", () => {
    select.value = "value-JavaScript";
    input.value = "la";
    EVENTS.input(input);
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

    EVENTS.keydownTab(focusedOption);

    assert.ok(list.hidden, "should hide the option list");
    assert.equal(
      select.value,
      "value-Erlang",
      "should select the focused item"
    );
    assert.equal(input.value, "Erlang", "should select the focused item");
    assert.equal(document.activeElement, input, "should focus the input");
  });

  it("should not select the focused list item in the list when pressing bluring component on a focused item", () => {
    select.value = "value-JavaScript";
    input.value = "la";

    EVENTS.input(input);
    EVENTS.keydownArrowDown(input);
    const focusedOption = document.activeElement;
    assert.equal(
      focusedOption.textContent,
      "Erlang",
      "should focus the first item in the list"
    );
    EVENTS.keydownTab(focusedOption);

    assert.equal(
      select.value,
      "value-JavaScript",
      "should not change the value of the select"
    );
    assert.equal(
      input.value,
      "JavaScript",
      "should reset the input to the previously selected item"
    );
  });

  it("should complete selection and not tab when the list is closed and input is not pristine", () => {
    select.value = "value-JavaScript";
    input.value = "Erlang";
    EVENTS.input(input);
    EVENTS.keydownEscape(input);

    assert.ok(list.hidden, "should hide the option list");
    assert.equal(
      select.value,
      "value-Erlang",
      "should select the focused item"
    );
    assert.equal(input.value, "Erlang", "should select the focused item");
    assert.equal(document.activeElement, input, "should focus the input");
  });

  it("should initially focus the selected item when down is pressed from the input after an initial selection has occurred", () => {});
});
