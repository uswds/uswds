const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-filter.template.html")
);

describe("combo box component with filter attribute", () => {
  const { body } = document;

  let root;
  let input;
  let list;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    list = root.querySelector(".usa-combo-box__list");
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
  });

  it("should display and filter the option list after a character is typed", () => {
    input.value = "st";

    EVENTS.input(input);

    assert.ok(!list.hidden, "should display the option list");
    assert.equal(
      list.children.length,
      2,
      "should filter the item by the string starting with the option"
    );
  });
});
