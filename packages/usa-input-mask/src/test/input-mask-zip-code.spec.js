const fs = require("fs");
const path = require("path");
const assert = require("assert");
const InputMask = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask-zip-code.template.html")
);

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
};

const inputMaskSelector = () => document.querySelector(".usa-input-mask");
const inputMaskShellSelector = () =>
  document.querySelector(".usa-input-mask__content");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "input mask", selector: inputMaskSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`input mask component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let requirementsMessage;
    let statusMessageVisual;
    let statusMessageSR;
    let shell;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      InputMask.on(containerSelector());

      root = inputMaskSelector();
      input = root.querySelector(".usa-input-mask__field");
      requirementsMessage = root.querySelector(".usa-input-mask__message");
      statusMessageVisual = root.querySelector(".usa-input-mask__status");
      statusMessageSR = root.querySelector(".usa-input-mask__sr-status");
    });

    afterEach(() => {
      InputMask.off(containerSelector());
      body.textContent = "";
    });

    it("hides the requirements hint for screen readers", () => {
      assert.strictEqual(
        requirementsMessage.classList.contains("usa-sr-only"),
        true
      );
    });

    it("creates a visual status message on init", () => {
      const visibleStatus = document.querySelectorAll(
        ".usa-input-mask__status"
      );

      assert.strictEqual(visibleStatus.length, 1);
    });

    it("creates a screen reader status message on init", () => {
      const srStatus = document.querySelectorAll(".usa-input-mask__sr-status");

      assert.strictEqual(srStatus.length, 1);
    });

    it("adds initial status message for the input mask component", () => {
      assert.strictEqual(
        statusMessageVisual.innerHTML,
        "Please enter a valid character"
      );
      assert.strictEqual(
        statusMessageSR.innerHTML,
        "Please enter a valid character"
      );
    });

    it("informs the user only number characters are allowed", () => {
      input.value = "a";

      EVENTS.input(input);

      assert.strictEqual(
        statusMessageVisual.innerHTML,
        "A number character is required here"
      );
    });

    it("formats a US zip code to 12345-6789", () => {
      input.value = "123456789";

      EVENTS.input(input);

      setTimeout(() => {
        shell = inputMaskShellSelector();
        assert.strictEqual(shell.textContent, "12345-6789");
      }, 100);
    });
  });
});
