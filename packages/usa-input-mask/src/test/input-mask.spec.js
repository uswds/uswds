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
