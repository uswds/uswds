const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-default-value.template.html")
);

describe("combo box component with default value attribute", () => {
  const { body } = document;

  let root;
  let input;
  let select;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    root = body.querySelector(".usa-combo-box");
    ComboBox.on(root);
    input = root.querySelector(".usa-combo-box__input");
    select = root.querySelector(".usa-combo-box__select");
  });

  afterEach(() => {
    ComboBox.off(root);
    body.textContent = "";
  });

  it("enhances a select element into a combo box component", () => {
    assert.ok(input, "adds an input element");
    assert.strictEqual(
      input.value,
      "Blackberry",
      "updates the default value of the input"
    );
    assert.strictEqual(
      select.value,
      "blackberry",
      "updates the default value of the select"
    );
  });
});
