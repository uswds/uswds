const fs = require("fs");
const path = require("path");
const assert = require("assert");
const CharacterCount = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/valid-template-no-maxlength.template.html"),
);

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent("input", { bubbles: true }));
};

const characterCountSelector = () =>
  document.querySelector(".usa-character-count");

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "character count", selector: characterCountSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count component without maxlength initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let requirementsMessage;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      CharacterCount.on(containerSelector());
      root = characterCountSelector();
      input = root.querySelector(".usa-character-count__field");
      requirementsMessage = root.querySelector(".usa-character-count__message");
    });

    afterEach(() => {
      CharacterCount.off(containerSelector());
      body.textContent = "";
    });

    it("should not update an initial message for the character count component", () => {
      assert.strictEqual(requirementsMessage.innerHTML, "");
    });

    it("should not inform the user of remaining characters when typing", () => {
      input.value = "1";

      EVENTS.input(input);

      assert.strictEqual(requirementsMessage.innerHTML, "");
    });
  });
});
