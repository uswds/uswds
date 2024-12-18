const fs = require("fs");
const path = require("path");
const assert = require("assert");
const CharacterCount = require("../index");

const {
  FORM_GROUP_ERROR_CLASS,
  LABEL_ERROR_CLASS,
  INPUT_ERROR_CLASS,
  VALIDATION_MESSAGE,
  MESSAGE_INVALID_CLASS,
} = CharacterCount;

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/character-count.template.html"),
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
  describe(`character count component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let formGroup;
    let label;
    let input;
    let requirementsMessage;
    let statusMessageVisual;
    let statusMessageSR;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      CharacterCount.on(containerSelector());

      root = characterCountSelector();
      formGroup = root.querySelector(".usa-form-group");
      label = root.querySelector(".usa-label");
      input = root.querySelector(".usa-character-count__field");
      requirementsMessage = root.querySelector(".usa-character-count__message");
      statusMessageVisual = root.querySelector(".usa-character-count__status");
      statusMessageSR = root.querySelector(".usa-character-count__sr-status");
    });

    afterEach(() => {
      CharacterCount.off(containerSelector());
      body.textContent = "";
    });

    it("hides the requirements hint for screen readers", () => {
      assert.strictEqual(
        requirementsMessage.classList.contains("usa-sr-only"),
        true,
      );
    });

    it("creates a visual status message on init", () => {
      const visibleStatus = document.querySelectorAll(
        ".usa-character-count__status",
      );

      assert.strictEqual(visibleStatus.length, 1);
    });

    it("creates a screen reader status message on init", () => {
      const srStatus = document.querySelectorAll(
        ".usa-character-count__sr-status",
      );

      assert.strictEqual(srStatus.length, 1);
    });

    it("adds initial status message for the character count component", () => {
      assert.strictEqual(
        statusMessageVisual.innerHTML,
        "20 characters allowed",
      );
      assert.strictEqual(statusMessageSR.innerHTML, "20 characters allowed");
    });

    it("informs the user how many more characters they are allowed", () => {
      input.value = "1";

      EVENTS.input(input);

      assert.strictEqual(statusMessageVisual.innerHTML, "19 characters left");
    });

    it("informs the user they are allowed a single character", () => {
      input.value = "1234567890123456789";

      EVENTS.input(input);

      assert.strictEqual(statusMessageVisual.innerHTML, "1 character left");
    });

    it("informs the user they are over the limit by a single character", () => {
      input.value = "123456789012345678901";

      EVENTS.input(input);

      assert.strictEqual(
        statusMessageVisual.innerHTML,
        "1 character over limit",
      );
    });

    it("informs the user how many characters they will need to remove", () => {
      input.value = "1234567890123456789012345";

      EVENTS.input(input);

      assert.strictEqual(
        statusMessageVisual.innerHTML,
        "5 characters over limit",
      );
    });

    it("should show the component and input as valid when the input is under the limit", () => {
      input.value = "1";

      EVENTS.input(input);

      assert.strictEqual(input.validationMessage, "");
      assert.strictEqual(
        statusMessageVisual.classList.contains(MESSAGE_INVALID_CLASS),
        false,
      );
    });

    it("should show the component and input as invalid when the input is over the limit", () => {
      input.value = "123456789012345678901";

      EVENTS.input(input);

      assert.strictEqual(input.validationMessage, VALIDATION_MESSAGE);
      assert.strictEqual(label.classList.contains(LABEL_ERROR_CLASS), true);
      assert.strictEqual(input.classList.contains(INPUT_ERROR_CLASS), true);
      assert.strictEqual(
        formGroup.classList.contains(FORM_GROUP_ERROR_CLASS),
        true,
      );
      assert.strictEqual(
        statusMessageVisual.classList.contains(MESSAGE_INVALID_CLASS),
        true,
      );
    });

    it("should not allow for innerHTML of child elements ", () => {
      Array.from(statusMessageVisual.childNodes).forEach((childNode) => {
        assert.strictEqual(childNode.nodeType, Node.TEXT_NODE);
      });
    });
  });
});
