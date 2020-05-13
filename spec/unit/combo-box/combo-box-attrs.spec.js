const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-attrs.template.html")
);

describe("combo box component with placeholder and default value attributes", () => {
  const { body } = document;

  let root;
  let input;
  let select;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    select = root.querySelector(".usa-combo-box__select");
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
  });

  it("enhances a select element into a combo box component", () => {
    assert.equal(select.value, "value-Go", "select the selected select item");
    assert.equal(input.value, "Go", "select the selected select item");
    assert.equal(
      input.getAttribute("placeholder"),
      "Select one...",
      "should add placeholder"
    );
  });
});
