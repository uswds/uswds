const fs = require("fs");
const path = require("path");
const assert = require("assert");
const InputMask = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask.template.html")
);

const EVENTS = {};

/**
 * send an keydown event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.keydown = (el) => {
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
    let statusMessageVisual;
    let statusMessageSR;
    let shell;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      InputMask.on(containerSelector());
      root = containerSelector().parentNode;
      input = root.querySelector(".usa-input-mask");
      statusMessageVisual = root.querySelector(".usa-input-mask__status");
      statusMessageSR = root.querySelector(".usa-sr-only");
    });

    afterEach(() => {
      InputMask.off(containerSelector());
      body.textContent = "";
    });

    it("creates a visual status message on init", () => {
      const visibleStatus = document.querySelectorAll(
        ".usa-input-mask__status"
      );

      assert.strictEqual(visibleStatus.length, 1);
    });

    it("creates a screen reader status message on init", () => {
      const srStatus = document.querySelectorAll(".usa-sr-only");

      assert.strictEqual(srStatus.length, 1);
    });

    it("informs the user only number characters are allowed", () => {
      input.value = "a";

      EVENTS.keydown(input);

      assert.strictEqual(
        statusMessageVisual.innerHTML,
        "A number character is required here"
      );
    });

    it("formats a nine digit social security number to 123-45-6789", () => {
      const value = "123456789";

      for (let i = 0; i < value.length; i += 1) {
        input.dispatchEvent(
          new KeyboardEvent("keydown", {
            bubbles: true,
            key: value[i],
            keyCode: value[i].charCodeAt(0),
            which: value[i].charCodeAt(0),
          })
        );
      }

      shell = inputMaskShellSelector();
      assert.strictEqual(shell.textContent, "123-45-6789");
    });
  });
});
