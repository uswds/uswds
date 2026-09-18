const fs = require("fs");
const path = require("path");
const assert = require("assert");
const InputMask = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask-alphanumeric.template.html"),
);

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
};

const inputMaskingSelector = () => document.querySelector(".usa-input-masking");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "input mask", selector: inputMaskingSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`input mask component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let shell;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      InputMask.on(containerSelector());

      root = inputMaskingSelector();
      input = root.querySelector(".usa-input");
    });

    afterEach(() => {
      InputMask.off(containerSelector());
      body.textContent = "";
    });

    it("formats an alphanumeric example to A1B 2C3", () => {
      input.value = "A1B2C3";

      EVENTS.input(input);
      shell = root.querySelector(".usa-input-mask--content");
      assert.strictEqual(shell.textContent, "A1B 2C3");
    });
  });
});

describe("alphanumeric input mask caret position", () => {
  const { body } = document;

  let input;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    InputMask.on(document.body);
    input = document.querySelector(".usa-masked");
  });

  afterEach(() => {
    InputMask.off(document.body);
    body.textContent = "";
  });

  it("keeps the caret after a character typed over a selection", () => {
    // "A1B [2]C3" then "5"
    input.focus();
    input.value = "A1B 5C3";
    input.setSelectionRange(5, 5);
    EVENTS.input(input);

    assert.strictEqual(input.value, "A1B 5C3");
    assert.strictEqual(input.selectionStart, 5);
  });
});
