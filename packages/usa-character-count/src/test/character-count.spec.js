const fs = require("fs");
const path = require("path");
const assert = require("assert");
const CharacterCount = require("../index");

const { VALIDATION_MESSAGE, MESSAGE_INVALID_CLASS } = CharacterCount;

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/character-count.template.html")
);

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent("input", { bubbles: true }));
};

const characterCountSelector = () => document.querySelector('.usa-character-count');
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "character count", selector: characterCountSelector }
];

tests.forEach(({name, selector: containerSelector}) => {
  describe(`character count component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let message;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      CharacterCount.on(containerSelector());

      root = characterCountSelector();
      input = root.querySelector(".usa-character-count__field");
      message = root.querySelector(".usa-character-count__message");
    });

    afterEach(() => {
      CharacterCount.off(containerSelector());
      body.textContent = "";
    });

    it("adds initial message for the character count component", () => {
      assert.strictEqual(message.innerHTML, "20 characters allowed");
    });

    it("informs the user how many more characters they are allowed", () => {
      input.value = "1";

      EVENTS.input(input);

      assert.strictEqual(message.innerHTML, "19 characters left");
    });

    it("informs the user they are allowed a single character", () => {
      input.value = "1234567890123456789";

      EVENTS.input(input);

      assert.strictEqual(message.innerHTML, "1 character left");
    });

    it("informs the user they are over the limit by a single character", () => {
      input.value = "123456789012345678901";

      EVENTS.input(input);

      assert.strictEqual(message.innerHTML, "1 character over limit");
    });

    it("informs the user how many characters they will need to remove", () => {
      input.value = "1234567890123456789012345";

      EVENTS.input(input);

      assert.strictEqual(message.innerHTML, "5 characters over limit");
    });

    it("should show the component and input as valid when the input is under the limit", () => {
      input.value = "1";

      EVENTS.input(input);

      assert.strictEqual(input.validationMessage, "");
      assert.strictEqual(
        message.classList.contains(MESSAGE_INVALID_CLASS),
        false
      );
    });

    it("should show the component and input as invalid when the input is over the limit", () => {
      input.value = "123456789012345678901";

      EVENTS.input(input);

      assert.strictEqual(input.validationMessage, VALIDATION_MESSAGE);
      assert.strictEqual(message.classList.contains(MESSAGE_INVALID_CLASS), true);
    });

    it("should not allow for innerHTML of child elements ", () => {
      Array.from(message.childNodes).forEach((childNode) => {
        assert.strictEqual(childNode.nodeType, Node.TEXT_NODE);
      });
    });
  });
});
