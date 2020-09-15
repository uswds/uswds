const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-disable-filtering.template.html")
);

describe("combo box component with disable filtering attribute", () => {
  const { body } = document;

  let root;
  let input;
  let list;
  let select;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    list = root.querySelector(".usa-combo-box__list");
    select = root.querySelector(".usa-combo-box__select");
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
  });

  it("should display the full list and focus the first found item", () => {
    input.value = "oo";

    EVENTS.input(input);

    const focusedOption = list.querySelector(
      ".usa-combo-box__list-option--focused"
    );
    assert.ok(!list.hidden, "should show the option list");
    assert.equal(
      list.children.length,
      select.options.length - 1,
      "should have all of the initial select items in the list except placeholder empty items"
    );
    assert.equal(
      focusedOption.textContent,
      "Blood orange",
      "should be the first found item"
    );
  });
});
