const fs = require("fs");
const path = require("path");
const assert = require("assert");
const ComboBox = require("../../../src/js/components/combo-box");
const EVENTS = require("./events");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/combo-box-disabled.template.html")
);

describe("combo box component - disabled enhancement", () => {
  const { body } = document;

  let root;
  let input;
  let select;
  let toggle;
  let list;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector(".usa-combo-box");
    input = root.querySelector(".usa-combo-box__input");
    select = root.querySelector(".usa-combo-box__select");
    toggle = root.querySelector(".usa-combo-box__toggle-list");
    list = root.querySelector(".usa-combo-box__list");
  });

  afterEach(() => {
    body.textContent = "";
    ComboBox.off(body);
  });

  it("enhances a select element into a combo box component", () => {
    assert.ok(input, "adds an input element");
    assert.equal(
      input.disabled,
      true,
      "transfers disabled attribute to combo box"
    );
    assert.equal(
      select.disabled,
      false,
      "removes disabled attribute from select"
    );
  });

  it("should not show the list when clicking the disabled input", () => {
    EVENTS.click(input);

    assert.ok(list.hidden, "should not display the option list");
  });

  it("should not show the list when clicking the disabled button", () => {
    EVENTS.click(toggle);

    assert.ok(list.hidden, "should not display the option list");
  });

  it("should show the list when clicking the input once the component has been enabled", () => {
    ComboBox.enable(root);
    EVENTS.click(input);

    assert.ok(!list.hidden, "should display the option list");
  });
});
