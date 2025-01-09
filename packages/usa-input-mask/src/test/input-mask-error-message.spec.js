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
  el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
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

    describe("does not display error message when correct value passes", () => {
      it("does not display error message when letter value passes", () => {
        input.value = "A";
        EVENTS.input(input);

        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.hasAttribute("hidden"), true);
      });

      it("does not display error message when number value passes", () => {
        input.value = "A1";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.hasAttribute("hidden"), true);
      });
    });

    describe("displays the correct error message when input attempt is a number but it expects a letter", () => {
      it("displays the error message", () => {
        input.value = "1";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.hasAttribute("hidden"), false);
      });

      it("error message is correct", () => {
        input.value = "1";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.textContent, "Error: please enter a letter");
      });
    });

    describe("displays the correct error message when value is a letter but it expects a number", () => {
      it("displays the error message", () => {
        input.value = "AA";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.hasAttribute("hidden"), false);
      });

      it("error message is correct", () => {
        input.value = "AA";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.textContent, "Error: please enter a number");
      });
    });

    describe("displays the correct error message when value is a letter but it expects a number", () => {
      it("displays the error message", () => {
        input.value = "!";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.hasAttribute("hidden"), false);
      });

      it("error message is correct", () => {
        input.value = "!";

        EVENTS.input(input);
        shell = root.querySelector("#alphanumericError");
        assert.strictEqual(shell.textContent, "Error: please enter a letter");
      });
    });
  });
});
