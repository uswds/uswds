const fs = require("fs");
const path = require("path");
const assert = require("assert");
const InputMask = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask.template.html"),
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

    it("formats a nine digit social security number to 999 99 9999", () => {
      input.value = "999999999";

      EVENTS.input(input);
      shell = root.querySelector(".usa-input-mask--content");
      assert.strictEqual(shell.textContent, "999 99 9999");
    });
  });
});

/**
 * put the input in the state the browser leaves it in after an edit and
 * before keyup fires
 */
const edit = (input, value, caret) => {
  input.focus();
  input.value = value;
  input.setSelectionRange(caret, caret);
  EVENTS.input(input);
};

describe("input mask caret position", () => {
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

  it("keeps the caret in place after deleting a digit in the middle", () => {
    // "123 4|5 6789" then Backspace
    edit(input, "123 5 6789", 4);

    assert.strictEqual(input.value, "123 56 789");
    assert.strictEqual(input.selectionStart, 4);
  });

  it("keeps the caret after a digit typed in the middle", () => {
    // "123 |45 678" then "9"
    edit(input, "123 945 678", 5);

    assert.strictEqual(input.value, "123 94 5678");
    assert.strictEqual(input.selectionStart, 5);
  });

  it("keeps the caret after a digit typed over a selection", () => {
    // "123 [45] 6789" then "9"
    edit(input, "123 9 6789", 5);

    assert.strictEqual(input.value, "123 96 789");
    assert.strictEqual(input.selectionStart, 5);
  });

  it("moves the caret before a separator deleted with Backspace", () => {
    // "123 |45 6789" then Backspace
    edit(input, "12345 6789", 3);

    assert.strictEqual(input.value, "123 45 6789");
    assert.strictEqual(input.selectionStart, 3);
  });

  it("keeps the caret in place when a character is rejected", () => {
    // "123 |45 6789" then "a"
    edit(input, "123 a45 6789", 5);

    assert.strictEqual(input.value, "123 45 6789");
    assert.strictEqual(input.selectionStart, 4);
  });

  it("places the caret after a separator inserted at the end", () => {
    // "123 45|" then "6"
    edit(input, "123 456", 7);

    assert.strictEqual(input.value, "123 45 6");
    assert.strictEqual(input.selectionStart, 8);
  });

  it("leaves the caret alone when the value does not change", () => {
    // "123 |45 6789" then an arrow key
    edit(input, "123 45 6789", 4);

    assert.strictEqual(input.value, "123 45 6789");
    assert.strictEqual(input.selectionStart, 4);
  });

  it("does not steal focus from another element", () => {
    const other = document.createElement("input");
    body.appendChild(other);
    other.focus();

    input.value = "123 5 6789";
    input.setSelectionRange(4, 4);
    EVENTS.input(input);

    assert.strictEqual(input.value, "123 56 789");
    assert.strictEqual(document.activeElement, other);
  });
});
