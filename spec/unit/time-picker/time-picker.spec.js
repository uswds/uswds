const fs = require("fs");
const path = require("path");
const assert = require("assert");
const TimePicker = require("../../../src/js/components/time-picker");
const ComboBox = require("../../../src/js/components/combo-box");
const EVENTS = require("../combo-box/events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/time-picker.template.html")
);

describe("time picker component", () => {
  const { body } = document;

  let root;
  let input;
  let select;
  let list;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    TimePicker.on();
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    select = root.querySelector(".usa-combo-box__select");
    list = root.querySelector(".usa-combo-box__list");
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
    TimePicker.off(body);
  });

  it("enhances a select element into a combo box component", () => {
    assert.ok(input, "adds an input element");
    assert.ok(
      select.classList.contains("usa-sr-only"),
      "hides the select element from view"
    );
    assert.ok(list, "adds an list element");
    assert.ok(list.hidden, "the list is hidden");
    assert.equal(
      select.getAttribute("id"),
      "",
      "transfers id attribute to combo box"
    );
    assert.equal(
      input.getAttribute("id"),
      "appointment-time",
      "transfers id attribute to combo box"
    );
    assert.equal(
      select.getAttribute("required"),
      null,
      "transfers required attribute to combo box"
    );
    assert.equal(
      input.getAttribute("required"),
      "",
      "transfers required attribute to combo box"
    );
    assert.equal(
      select.getAttribute("name"),
      "appointment-time",
      "should not transfer name attribute to combo box"
    );
    assert.equal(
      input.getAttribute("name"),
      null,
      "should not transfer name attribute to combo box"
    );

    assert.equal(select.value, "", "the select value should be empty");
    assert.equal(input.value, "", "the input should be empty");
  });

  it("should focus the first item found in the list from the query when pressing down from the input", () => {
    input.value = "4p";

    EVENTS.input(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.keydownArrowDown(input);
    const focusedOption = document.activeElement;
    assert.equal(
      focusedOption.textContent,
      "4:00pm",
      "should focus the last item in the list"
    );
  });

  it("should focus the first complete hour found in the list from the query when pressing down from the input", () => {
    input.value = "1p";

    EVENTS.input(input);
    assert.ok(!list.hidden, "should display the option list");

    EVENTS.keydownArrowDown(input);
    const focusedOption = document.activeElement;
    assert.equal(
      focusedOption.textContent,
      "1:00pm",
      "should focus the last item in the list"
    );
  });
});
