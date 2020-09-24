const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-subsequent-selection.template.html")
);

describe("combo box component - subsequent selection", () => {
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

  it("should display the full list and focus the selected item when the input is pristine (after fresh selection)", () => {
    assert.ok(
      root.classList.contains("usa-combo-box--pristine"),
      "pristine class added after selection"
    );
    EVENTS.click(input);

    assert.ok(!list.hidden, "should show the option list");
    assert.equal(
      list.children.length,
      select.options.length - 1,
      "should have all of the initial select items in the list except placeholder empty items"
    );
    const highlightedOption = list.querySelector(
      ".usa-combo-box__list-option--focused"
    );
    assert.ok(
      highlightedOption.classList.contains(
        "usa-combo-box__list-option--focused"
      ),
      "should style the focused item in the list"
    );
    assert.equal(
      highlightedOption.textContent,
      "Blackberry",
      "should be the previously selected item"
    );
  });

  it("should display the filtered list when the input is dirty (characters inputted)", () => {
    EVENTS.click(input);
    assert.equal(
      list.children.length,
      select.options.length - 1,
      "should have all of the initial select items in the list except placeholder empty items"
    );

    input.value = "COBOL";
    EVENTS.input(input);

    assert.ok(
      !root.classList.contains("usa-combo-box--pristine"),
      "pristine class is removed after input"
    );
    assert.equal(
      list.children.length,
      1,
      "should only show the filtered items"
    );
  });

  it("should show a clear button when the input has a selected value present", () => {
    assert.ok(
      root.classList.contains("usa-combo-box--pristine"),
      "pristine class added after selection"
    );
    assert.ok(
      root.querySelector(".usa-combo-box__clear-input"),
      "clear input button is present"
    );
  });

  it("should clear the input when the clear button is clicked", () => {
    assert.equal(select.value, "blackberry");
    assert.equal(input.value, "Blackberry");

    EVENTS.click(root.querySelector(".usa-combo-box__clear-input"));

    assert.equal(select.value, "", "should clear the value on the select");
    assert.equal(input.value, "", "should clear the value on the input");
    assert.equal(document.activeElement, input, "should focus the input");
  });

  it("should update the filter and begin filtering once a pristine input value is changed", () => {
    input.value = "go";
    EVENTS.click(input);
    EVENTS.keydownEnter(input);
    assert.equal(
      input.value,
      "Blackberry",
      "should set that item to the input value"
    );
    EVENTS.click(input);
    assert.equal(
      list.children.length,
      select.options.length - 1,
      "should have all of the initial select items in the list except placeholder empty items"
    );

    input.value = "Fig";
    EVENTS.input(input);

    assert.equal(
      list.children.length,
      1,
      "should only show the filtered items"
    );
  });
});
